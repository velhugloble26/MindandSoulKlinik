import connectDB from "../../../../config/dbconnection";
import {
  success,
  validationError,
  serverError,
} from "../../../../utils/apiResponse";
import { requireAdmin } from "../../../../utils/auth";
import {
  AvailabilitySettings,
  BlockedDate,
  Booking,
  UnavailableSlot,
} from "../../../../schema/schema";
import {
  DEFAULT_PROVIDER_ID,
  DEFAULT_SERVICE_ID,
  getAvailabilityForDate,
  getBookingAvailability,
  getSchedulingSettings,
  SCHEDULING_TIMEZONE,
  timeToMinutes,
  validateDateKey,
} from "../../../../services/availabilityServices";

export async function GET(req) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId") || DEFAULT_PROVIDER_ID;
    const serviceId = searchParams.get("serviceId") || DEFAULT_SERVICE_ID;
    const timezone = searchParams.get("timezone") || SCHEDULING_TIMEZONE;
    const date = searchParams.get("date");
    const settings = await getSchedulingSettings({ providerId, serviceId });

    if (date) {
      const availability = await getAvailabilityForDate({
        date,
        providerId,
        serviceId,
        timezone,
        includeUnavailable: true,
      });
      return success("Slot availability fetched successfully.", {
        ...availability,
        settings,
      });
    }

    const days = Math.min(
      Math.max(Number(searchParams.get("days") || 32), 1),
      62,
    );
    const dates = await getBookingAvailability(days, {
      startDate: searchParams.get("startDate") || undefined,
      providerId,
      serviceId,
      timezone,
      includeUnavailable: true,
    });
    return success("Slot availability fetched successfully.", {
      dates,
      settings,
      providerId,
      serviceId,
      timezone,
    });
  } catch (error) {
    console.error("GET_ADMIN_AVAILABILITY_ERROR:", error);
    if (error.statusCode)
      return validationError(error.message, null, error.statusCode);
    return serverError("Unable to fetch slot availability.");
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const body = await req.json();
    const action = body.action || "slot";
    const providerId = body.providerId || DEFAULT_PROVIDER_ID;
    const serviceId = body.serviceId || DEFAULT_SERVICE_ID;
    const timezone = body.timezone || SCHEDULING_TIMEZONE;

    if (timezone !== SCHEDULING_TIMEZONE) {
      return validationError(
        `Timezone must be ${SCHEDULING_TIMEZONE}.`,
        null,
        422,
      );
    }

    if (action === "settings") {
      const duration = Number(body.slotDurationMinutes);
      const interval = Number(body.slotIntervalMinutes);
      const validHours =
        Array.isArray(body.workingHours) &&
        body.workingHours.length === 7 &&
        body.workingHours.every(
          (item) =>
            Number.isInteger(item.dayOfWeek) &&
            timeToMinutes(item.start) !== null &&
            timeToMinutes(item.end) !== null &&
            timeToMinutes(item.end) > timeToMinutes(item.start),
        );
      const validBreaks =
        Array.isArray(body.breaks) &&
        body.breaks.every(
          (item) =>
            Number.isInteger(item.dayOfWeek) &&
            timeToMinutes(item.start) !== null &&
            timeToMinutes(item.end) !== null &&
            timeToMinutes(item.end) > timeToMinutes(item.start),
        );
      if (
        !validHours ||
        !validBreaks ||
        duration !== 60 ||
        interval !== 90
      ) {
        return validationError(
          "Working hours, breaks, slot duration, or slot interval are invalid.",
          null,
          422,
        );
      }
      const settings = await AvailabilitySettings.findOneAndUpdate(
        { providerId, serviceId },
        {
          $set: {
            timezone,
            slotDurationMinutes: 60,
            slotIntervalMinutes: 90,
            sessionTypes: body.sessionTypes?.filter((item) =>
              ["Online", "Offline"].includes(item),
            ) || ["Online", "Offline"],
            workingHours: body.workingHours,
            breaks: body.breaks,
            createdBy: auth.user.id,
            updated_at: new Date(),
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      ).lean();
      return success("Availability settings updated successfully.", {
        settings,
      });
    }

    if (action === "date") {
      if (
        !validateDateKey(body.date) ||
        !["blocked", "available"].includes(body.status)
      ) {
        return validationError(
          "A valid date and status are required.",
          null,
          422,
        );
      }
      if (body.status === "blocked") {
        const booked = await Booking.exists({
          selectedDate: body.date,
          providerId,
          bookingStatus: { $in: ["pending", "confirmed"] },
        });
        if (booked)
          return validationError(
            "A date with active bookings cannot be blocked.",
            null,
            409,
          );
        await BlockedDate.findOneAndUpdate(
          { providerId, serviceId, date: body.date },
          {
            $set: {
              timezone,
              reason: String(body.reason || ""),
              createdBy: auth.user.id,
              updated_at: new Date(),
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      } else {
        await BlockedDate.deleteOne({ providerId, serviceId, date: body.date });
      }
      return success(`Date marked as ${body.status}.`, {
        date: body.date,
        status: body.status,
      });
    }

    const { date, time, sessionType, status } = body;
    if (
      !validateDateKey(date) ||
      !time ||
      !["Online", "Offline"].includes(sessionType) ||
      !["available", "blocked"].includes(status)
    ) {
      return validationError(
        "A valid date, time, session type, and status are required.",
        null,
        422,
      );
    }
    const day = await getAvailabilityForDate({
      date,
      providerId,
      serviceId,
      timezone,
      includeUnavailable: true,
    });
    const validSlot = day.slots.find(
      (slot) => slot.time === time && slot.sessionType === sessionType,
    );
    if (!validSlot)
      return validationError(
        "This time is outside the configured working hours.",
        null,
        422,
      );

    if (status === "blocked") {
      const booked = await Booking.exists({
        selectedDate: date,
        selectedTime: time,
        providerId,
        bookingStatus: { $in: ["pending", "confirmed"] },
      });
      if (booked)
        return validationError(
          "A booked slot cannot be marked as unavailable.",
          null,
          409,
        );
      await UnavailableSlot.findOneAndUpdate(
        {
          providerId,
          serviceId,
          selectedDate: date,
          selectedTime: time,
          sessionType,
        },
        {
          $set: {
            endTime: validSlot.end,
            timezone,
            reason: String(body.reason || ""),
            createdBy: auth.user.id,
            updated_at: new Date(),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    } else {
      await UnavailableSlot.deleteOne({
        providerId,
        serviceId,
        selectedDate: date,
        selectedTime: time,
        sessionType,
      });
    }
    return success(`Slot marked as ${status}.`, {
      date,
      time,
      sessionType,
      status,
    });
  } catch (error) {
    console.error("PATCH_ADMIN_AVAILABILITY_ERROR:", error);
    if (error.statusCode)
      return validationError(error.message, null, error.statusCode);
    return serverError("Unable to update slot availability.");
  }
}
