import {
  AvailabilitySettings,
  BlockedDate,
  Booking,
  UnavailableSlot,
} from "../schema/schema.js";

export const DEFAULT_PROVIDER_ID = "therapy-by-nidhi";
export const DEFAULT_SERVICE_ID = "general-therapy";
export const SCHEDULING_TIMEZONE = "Asia/Kolkata";
export const STANDARD_APPOINTMENT_SLOTS = [
  { start: 660, sessionCategory: "online_session", sessionTypes: ["Online"] },
  { start: 750, sessionCategory: "online_session", sessionTypes: ["Online"] },
  { start: 960, sessionCategory: "offline_session", sessionTypes: ["Offline"] },
  { start: 1050, sessionCategory: "offline_session", sessionTypes: ["Offline"] },
];

export async function expireAbandonedPaymentHolds() {
  const now = new Date();
  const legacyHoldCutoff = new Date(now.getTime() - 10 * 60 * 1000);
  await Booking.updateMany(
    {
      bookingStatus: "pending",
      paymentMethod: "online",
      $or: [
        { holdExpiresAt: { $lte: now } },
        { holdExpiresAt: null, created_at: { $lte: legacyHoldCutoff } },
      ],
    },
    { $set: { bookingStatus: "expired", paymentStatus: "failed" } },
  );
}

const ACTIVE_BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "no_show",
];
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const defaultWorkingHours = [
  { dayOfWeek: 0, enabled: false, start: "09:00", end: "20:00" },
  ...[1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
    dayOfWeek,
    enabled: true,
    start: "09:00",
    end: "20:00",
  })),
];

export function getServiceId(packageId = "") {
  if (String(packageId).includes("consultation-call"))
    return "consultation-call";
  if (String(packageId).includes("couple-therapy")) return "couple-therapy";
  if (
    String(packageId).includes("psychologist-psychotherapist") ||
    String(packageId).includes("wellness-package")
  )
    return "individual-therapy";
  return DEFAULT_SERVICE_ID;
}

export function timeToMinutes(value) {
  const match = String(value || "").match(TIME_PATTERN);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function displayTimeToMinutes(value) {
  const normalized = String(value || "").trim();
  const twentyFourHour = timeToMinutes(normalized);
  if (twentyFourHour !== null) return twentyFourHour;
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}

export function minutesToDisplay(totalMinutes) {
  const hour24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function formatDateKeyInTimezone(
  date = new Date(),
  timezone = SCHEDULING_TIMEZONE,
) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function validateDateKey(dateKey) {
  if (!DATE_PATTERN.test(String(dateKey || ""))) return false;
  const [year, month, day] = dateKey.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day, 12));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function validateCustomTimePreference(date, time) {
  if (!validateDateKey(date)) {
    return { valid: false, message: "Enter a valid preferred date." };
  }
  const minutes = timeToMinutes(time);
  if (minutes === null || minutes < 10 * 60 || minutes > 18 * 60) {
    return { valid: false, message: "Preferred time must be between 10:00 AM and 6:00 PM IST." };
  }
  const today = formatDateKeyInTimezone(new Date(), SCHEDULING_TIMEZONE);
  if (date < today) {
    return { valid: false, message: "Preferred date must be today or later." };
  }
  if (date === today) {
    const nowParts = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: SCHEDULING_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date()).map((part) => [part.type, part.value]),
    );
    if (minutes <= Number(nowParts.hour) * 60 + Number(nowParts.minute)) {
      return { valid: false, message: "Choose a future preferred time." };
    }
  }
  return { valid: true, minutes };
}

function dateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function formatDateLabel(dateKey) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: SCHEDULING_TIMEZONE,
  }).format(dateFromKey(dateKey));
}

function providerScope(providerId) {
  return providerId === DEFAULT_PROVIDER_ID
    ? {
        $or: [
          { providerId },
          { providerId: { $exists: false } },
          { providerId: null },
        ],
      }
    : { providerId };
}

export async function getSchedulingSettings({
  providerId = DEFAULT_PROVIDER_ID,
  serviceId = DEFAULT_SERVICE_ID,
} = {}) {
  const serviceSettings = await AvailabilitySettings.findOne({
    providerId,
    serviceId,
  }).lean();
  if (serviceSettings) return { ...serviceSettings, timezone: SCHEDULING_TIMEZONE, slotDurationMinutes: 60, slotIntervalMinutes: 90 };

  const generalSettings =
    serviceId !== DEFAULT_SERVICE_ID
      ? await AvailabilitySettings.findOne({
          providerId,
          serviceId: DEFAULT_SERVICE_ID,
        }).lean()
      : null;
  if (generalSettings) {
    return {
      ...generalSettings,
      serviceId,
      timezone: SCHEDULING_TIMEZONE,
      slotDurationMinutes: 60,
      slotIntervalMinutes: 90,
    };
  }
  return {
    providerId,
    serviceId,
    timezone: SCHEDULING_TIMEZONE,
    slotDurationMinutes: 60,
    slotIntervalMinutes: 90,
    sessionTypes: ["Online", "Offline"],
    workingHours: defaultWorkingHours,
    breaks: [],
  };
}

function overlaps(start, end, rangeStart, rangeEnd) {
  return start < rangeEnd && end > rangeStart;
}

export async function getAvailabilityForDate({
  date,
  providerId = DEFAULT_PROVIDER_ID,
  serviceId = DEFAULT_SERVICE_ID,
  timezone = SCHEDULING_TIMEZONE,
  includeUnavailable = false,
  excludeBookingId = null,
  skipHoldCleanup = false,
  settingsOverride = null,
  availabilitySnapshot = null,
} = {}) {
  if (!validateDateKey(date))
    throw Object.assign(new Error("Enter a valid date."), { statusCode: 422 });
  if (timezone !== SCHEDULING_TIMEZONE)
    throw Object.assign(new Error(`Timezone must be ${SCHEDULING_TIMEZONE}.`), {
      statusCode: 422,
    });

  if (!skipHoldCleanup) await expireAbandonedPaymentHolds();

  const settings =
    settingsOverride || (await getSchedulingSettings({ providerId, serviceId }));
  const dayOfWeek = dateFromKey(date).getUTCDay();
  const hours = settings.workingHours.find(
    (item) => item.dayOfWeek === dayOfWeek,
  );
  const duration = 60;
  const buffer = 30;

  if (!hours?.enabled) {
    return {
      date,
      label: formatDateLabel(date),
      timezone,
      providerId,
      serviceId,
      isAvailable: false,
      isBlocked: false,
      slots: [],
    };
  }

  const [blockedDate, bookings, blockedSlots] = availabilitySnapshot
    ? [
        availabilitySnapshot.blockedDates.find((item) => item.date === date) || null,
        availabilitySnapshot.bookings.filter(
          (item) => item.selectedDate === date && (!excludeBookingId || item.bookingId !== excludeBookingId),
        ),
        availabilitySnapshot.blockedSlots.filter((item) => item.selectedDate === date),
      ]
    : await Promise.all([
        BlockedDate.findOne({ ...providerScope(providerId), date }).lean(),
        Booking.find({
          selectedDate: date,
          bookingStatus: { $in: ACTIVE_BOOKING_STATUSES },
          ...(excludeBookingId ? { bookingId: { $ne: excludeBookingId } } : {}),
          ...providerScope(providerId),
        })
          .select("bookingId selectedDate selectedTime selectedEndTime sessionType paymentMethod holdExpiresAt")
          .lean(),
        UnavailableSlot.find({
          selectedDate: date,
          ...providerScope(providerId),
        }).lean(),
      ]);

  const now = new Date();
  const activeBookings = bookings.filter(
    (booking) =>
      booking.paymentMethod !== "online" ||
      !booking.holdExpiresAt ||
      booking.holdExpiresAt > now,
  );
  const bookedRanges = activeBookings
    .map((booking) => {
      const start = displayTimeToMinutes(booking.selectedTime);
      return Number.isFinite(start)
        ? { start, end: (displayTimeToMinutes(booking.selectedEndTime) || start + duration) + buffer }
        : null;
    })
    .filter(Boolean);
  const blockedKeys = new Set(
    blockedSlots.map(
      (slot) =>
        `${displayTimeToMinutes(slot.selectedTime)}|${slot.sessionType}`,
    ),
  );
  const breaks = (settings.breaks || []).filter(
    (item) => item.dayOfWeek === dayOfWeek,
  );
  const today = formatDateKeyInTimezone(new Date(), timezone);
  const isPastDate = date < today;
  const currentTimeParts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );
  const currentMinute = Number(currentTimeParts.hour) * 60 + Number(currentTimeParts.minute);
  const slots = [];

  for (const standardSlot of STANDARD_APPOINTMENT_SLOTS) {
    const { start: slotStart, sessionCategory, sessionTypes } = standardSlot;
    const slotEnd = slotStart + duration;
    const isBreak = breaks.some((item) => {
      const breakStart = timeToMinutes(item.start);
      const breakEnd = timeToMinutes(item.end);
      return (
        breakStart !== null &&
        breakEnd !== null &&
        overlaps(slotStart, slotStart + duration + buffer, breakStart, breakEnd)
      );
    });

    for (const sessionType of sessionTypes) {
      let status = "available";
      if (isPastDate) status = "past";
      else if (date === today && slotStart <= currentMinute) status = "past";
      else if (blockedDate) status = "blocked";
      else if (isBreak) status = "break";
      else if (
        bookedRanges.some((range) =>
          overlaps(slotStart, slotStart + duration + buffer, range.start, range.end),
        )
      ) status = "booked";
      else if (blockedKeys.has(`${slotStart}|${sessionType}`))
        status = "blocked";

      const startTime = minutesToDisplay(slotStart);
      const endTime = minutesToDisplay(slotEnd);
      slots.push({
        start: startTime,
        end: endTime,
        time: startTime,
        sessionType,
        sessionCategory,
        label: `${startTime} - ${endTime}`,
        status,
        available: status === "available",
      });
    }
  }

  const visibleSlots = includeUnavailable
    ? slots
    : slots.filter((slot) => slot.available);
  return {
    date,
    label: formatDateLabel(date),
    timezone,
    providerId,
    serviceId,
    isBlocked: Boolean(blockedDate),
    blockReason: blockedDate?.reason || "",
    isAvailable: slots.some((slot) => slot.available),
    slots: visibleSlots,
  };
}

export async function getBookingAvailability(days = 32, options = {}) {
  const timezone = options.timezone || SCHEDULING_TIMEZONE;
  const startDate =
    options.startDate && validateDateKey(options.startDate)
      ? dateFromKey(options.startDate)
      : dateFromKey(formatDateKeyInTimezone(new Date(), timezone));
  const dayCount = Math.min(Math.max(Number(days) || 32, 1), 62);
  await expireAbandonedPaymentHolds();
  const settings = await getSchedulingSettings({
    providerId: options.providerId || DEFAULT_PROVIDER_ID,
    serviceId: options.serviceId || DEFAULT_SERVICE_ID,
  });
  const dateKeys = [];
  for (let offset = 0; offset < dayCount; offset += 1) {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + offset);
    dateKeys.push(date.toISOString().slice(0, 10));
  }

  const providerId = options.providerId || DEFAULT_PROVIDER_ID;
  const dateFilter = { selectedDate: { $in: dateKeys }, ...providerScope(providerId) };
  const [blockedDates, bookings, blockedSlots] = await Promise.all([
    BlockedDate.find({ date: { $in: dateKeys }, ...providerScope(providerId) }).lean(),
    Booking.find({
      ...dateFilter,
      bookingStatus: { $in: ACTIVE_BOOKING_STATUSES },
    })
      .select("bookingId selectedDate selectedTime selectedEndTime sessionType paymentMethod holdExpiresAt")
      .lean(),
    UnavailableSlot.find(dateFilter).lean(),
  ]);
  const availabilitySnapshot = { blockedDates, bookings, blockedSlots };

  // The calendar needs one shared snapshot for its date range. Load those records
  // in three bounded queries instead of issuing three database reads per day.
  const results = new Array(dateKeys.length);
  const concurrency = 8;
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, dateKeys.length) },
    async () => {
      while (nextIndex < dateKeys.length) {
        const index = nextIndex;
        nextIndex += 1;
        results[index] = await getAvailabilityForDate({
          ...options,
          date: dateKeys[index],
          timezone,
          skipHoldCleanup: true,
          settingsOverride: settings,
          availabilitySnapshot,
        });
      }
    },
  );

  await Promise.all(workers);
  return results;
}

export async function assertSlotAvailable({
  date,
  time,
  sessionType,
  sessionCategory,
  providerId = DEFAULT_PROVIDER_ID,
  serviceId = DEFAULT_SERVICE_ID,
  timezone = SCHEDULING_TIMEZONE,
  excludeBookingId = null,
}) {
  if (date < formatDateKeyInTimezone(new Date(), timezone)) {
    throw Object.assign(new Error("Past dates cannot be booked."), {
      statusCode: 422,
    });
  }
  if (!["Online", "Offline"].includes(sessionType)) {
    throw Object.assign(new Error("Select a valid session type."), {
      statusCode: 422,
    });
  }
  const availability = await getAvailabilityForDate({
    date,
    providerId,
    serviceId,
    timezone,
    includeUnavailable: true,
    excludeBookingId,
  });
  const requestedStart = displayTimeToMinutes(time);
  const expectedSlot = STANDARD_APPOINTMENT_SLOTS.find(
    (slot) => slot.start === requestedStart,
  );
  if (!expectedSlot) {
    throw Object.assign(new Error("Select one of the available appointment times."), { statusCode: 422 });
  }
  const expectedCategory = expectedSlot.sessionCategory;
  if (sessionCategory && sessionCategory !== expectedCategory) {
    throw Object.assign(new Error("The selected appointment category does not match its time."), { statusCode: 422 });
  }
  const slot = availability.slots.find(
    (item) =>
      displayTimeToMinutes(item.start) === requestedStart &&
      item.sessionType === sessionType &&
      item.sessionCategory === expectedCategory,
  );
  if (!slot || !slot.available) {
    throw Object.assign(
      new Error(
        "Sorry, this time slot is no longer available. Please select another time.",
      ),
      { statusCode: 409 },
    );
  }
  return slot;
}

export async function assertCustomSlotAvailable({
  date,
  time,
  sessionCategory,
  providerId = DEFAULT_PROVIDER_ID,
  serviceId = DEFAULT_SERVICE_ID,
  timezone = SCHEDULING_TIMEZONE,
  excludeBookingId = null,
} = {}) {
  if (timezone !== SCHEDULING_TIMEZONE) {
    throw Object.assign(new Error(`Timezone must be ${SCHEDULING_TIMEZONE}.`), { statusCode: 422 });
  }
  if (!["online_session", "offline_session"].includes(sessionCategory)) {
    throw Object.assign(new Error("Select a valid appointment category."), { statusCode: 422 });
  }
  const requested = validateCustomTimePreference(date, time);
  if (!requested.valid) throw Object.assign(new Error(requested.message), { statusCode: 422 });

  const start = requested.minutes;
  const duration = 60;
  const buffer = 30;
  const sessionType = sessionCategory === "online_session" ? "Online" : "Offline";
  const settings = await getSchedulingSettings({ providerId, serviceId });
  const dayOfWeek = dateFromKey(date).getUTCDay();
  const workingHours = settings.workingHours.find((item) => item.dayOfWeek === dayOfWeek);
  if (!workingHours?.enabled) {
    throw Object.assign(new Error("This day is not open for appointments."), { statusCode: 409 });
  }
  const workingStart = timeToMinutes(workingHours.start);
  const workingEnd = timeToMinutes(workingHours.end);
  if (workingStart === null || workingEnd === null || start < workingStart || start + 90 > workingEnd) {
    throw Object.assign(new Error("This time is outside the therapist's working hours."), { statusCode: 409 });
  }
  const breaks = (settings.breaks || []).filter((item) => item.dayOfWeek === dayOfWeek);
  if (breaks.some((item) => {
    const breakStart = timeToMinutes(item.start);
    const breakEnd = timeToMinutes(item.end);
    return breakStart !== null && breakEnd !== null && overlaps(start, start + duration + buffer, breakStart, breakEnd);
  })) {
    throw Object.assign(new Error("This time overlaps a blocked break."), { statusCode: 409 });
  }

  await expireAbandonedPaymentHolds();
  const [blockedDate, bookings, blockedSlots] = await Promise.all([
    BlockedDate.findOne({ ...providerScope(providerId), date }).lean(),
    Booking.find({
      selectedDate: date,
      bookingStatus: { $in: ACTIVE_BOOKING_STATUSES },
      ...(excludeBookingId ? { bookingId: { $ne: excludeBookingId } } : {}),
      ...providerScope(providerId),
    }).select("bookingId selectedTime selectedEndTime paymentMethod holdExpiresAt").lean(),
    UnavailableSlot.find({ selectedDate: date, ...providerScope(providerId) }).select("selectedTime endTime").lean(),
  ]);
  if (blockedDate) throw Object.assign(new Error("This date is blocked."), { statusCode: 409 });

  const now = new Date();
  const conflictsWith = (otherStart, otherEnd) =>
    Number.isFinite(otherStart) && overlaps(start, start + duration + buffer, otherStart, otherEnd);
  const bookingConflict = bookings.some((booking) => {
    if (booking.paymentMethod === "online" && booking.holdExpiresAt && booking.holdExpiresAt <= now) return false;
    const bookedStart = displayTimeToMinutes(booking.selectedTime);
    if (bookedStart === null) return false;
    const bookedEnd = displayTimeToMinutes(booking.selectedEndTime) || bookedStart + duration;
    return conflictsWith(bookedStart, bookedEnd + buffer);
  });
  const blockedConflict = blockedSlots.some((slot) => {
    const blockedStart = displayTimeToMinutes(slot.selectedTime);
    if (blockedStart === null) return false;
    const blockedEnd = displayTimeToMinutes(slot.endTime) || blockedStart + duration;
    return conflictsWith(blockedStart, blockedEnd + buffer);
  });
  if (bookingConflict || blockedConflict) {
    throw Object.assign(new Error("This time overlaps an existing booking or blocked slot."), { statusCode: 409 });
  }
  const end = start + duration;
  return {
    start: minutesToDisplay(start),
    end: minutesToDisplay(end),
    time: minutesToDisplay(start),
    sessionType,
    sessionCategory,
    label: `${minutesToDisplay(start)} - ${minutesToDisplay(end)}`,
  };
}

export function isDuplicateSlotError(error) {
  return (
    error?.code === 11000 &&
    (error?.keyPattern?.selectedTime ||
      error?.message?.includes("unique_active_provider_slot"))
  );
}
