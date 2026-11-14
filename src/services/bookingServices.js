import crypto from "crypto";
import { Booking } from "../schema/schema.js";
import { THERAPY_CONTENT } from "../constants/therapyContent.js";
import {
  assertSlotAvailable,
  minutesToDisplay,
  validateCustomTimePreference,
  DEFAULT_PROVIDER_ID,
  DEFAULT_SERVICE_ID,
  SCHEDULING_TIMEZONE,
} from "./availabilityServices.js";

export { getBookingAvailability } from "./availabilityServices.js";

export const BOOKING_PACKAGES = [
  {
    id: "india-psychologist-psychotherapist-regular",
    name: "Individual Therapy · Individual Therapy",
    sessionCount: 1,
    price: 2499,
  },
  {
    id: "india-psychologist-psychotherapist-4-session",
    name: "Individual Therapy · 4-session package",
    sessionCount: 4,
    price: 9199,
  },
  {
    id: "india-psychologist-psychotherapist-8-session",
    name: "Individual Therapy · 8-session package (includes 1 complimentary 15-minute check-in)",
    sessionCount: 8,
    price: 15999,
  },
  {
    id: "india-psychologist-psychotherapist-12-session",
    name: "Individual Therapy · 12-session package (includes 2 complimentary 15-minute check-ins)",
    sessionCount: 12,
    price: 20999,
  },
  {
    id: "india-couple-therapy-regular",
    name: "Couple Therapy · Couple Therapy",
    sessionCount: 1,
    price: 3999,
  },
  {
    id: "india-couple-therapy-journey",
    name: "Couple Therapy · Couple Therapy Journey",
    sessionCount: 1,
    price: 19999,
  },
  {
    id: "india-wellness-package-3-month",
    name: "Wellness Package · 3 months (12 sessions + 2 complimentary 15-minute check-ins)",
    sessionCount: 12,
    price: 20999,
  },
  {
    id: "india-wellness-package-6-month",
    name: "Wellness Package · 6 months (24 sessions + 4 complimentary 15-minute check-ins)",
    sessionCount: 24,
    price: 35999,
  },
  {
    id: "india-wellness-package-12-month",
    name: "Wellness Package · 12 months (48 sessions + 12 complimentary 15-minute check-ins)",
    sessionCount: 48,
    price: 60000,
  },
  {
    id: "india-consultation-call-15-minute",
    name: "Consultation Call · 15 minutes",
    sessionCount: 1,
    price: 500,
  },
];

export const INDIA_BOOKING_PACKAGES = BOOKING_PACKAGES;

export function generateBookingId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AL-${stamp}-${random}`;
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateLabel(date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function validateBookingRequest(data) {
  const errors = {};
  const allowedGenders = [
    "Male",
    "Female",
    "Non-Binary",
    "Transgender",
    "Prefer not to say",
    "Other",
  ];
  const allowedSessionModes = ["Online", "Offline"];
  const allowedRelationshipStatuses = [
    "Single",
    "In a relationship",
    "Married",
    "Divorced",
    "Widowed",
    "Other",
  ];
  const allowedReferralSources = [
    "Social Media",
    "Instagram",
    "Facebook",
    "YouTube",
    "Twitter/X",
    "LinkedIn",
    "Friend/Family",
    "Doctor/Therapist Referral",
    "Existing Client",
    "Search Engine",
    "Google Search",
    "Website/Blog",
    "Workshop/Event",
    "Advertisement",
    "Other",
  ];
  const allowedTherapyGoals = [
    "Managing stress, anxiety, or overwhelming emotions",
    "Healing from past trauma or unresolved emotional pain",
    "Improving self-confidence and self-esteem",
    "Navigating relationship challenges (family, partner, friends, etc.)",
    "Coping with grief or loss",
    "Developing healthier coping mechanisms and habits",
    "Enhancing communication and interpersonal skills",
    "Gaining clarity and direction in life",
    "Overcoming workplace or career-related challenges",
    "Achieving emotional balance and inner peace",
    "Other",
  ];

  if (!BOOKING_PACKAGES.some((item) => item.id === data.packageId)) {
    errors.packageId = "Please select a valid session package.";
  }
  const customTimeRequestOnly = data.customTimeRequestOnly === true;
  if (customTimeRequestOnly) {
    const preferred = validateCustomTimePreference(data.preferredDate, data.preferredTimeValue);
    if (!preferred.valid) errors.preferredTime = preferred.message;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.customRequestId || "")) {
      errors.customRequestId = "Submit the custom-time request again.";
    }
    if (!["online_session", "offline_session"].includes(data.sessionCategory)) {
      errors.sessionCategory = "Choose Online or Offline for the custom-time request.";
    }
    if (data.timezone && data.timezone !== SCHEDULING_TIMEZONE) {
      errors.timezone = `Timezone must be ${SCHEDULING_TIMEZONE}.`;
    }
  } else {
    if (!data.selectedDate) errors.selectedDate = "Please select a date.";
    if (!data.selectedTime) errors.selectedTime = "Please select a time.";
  }
  if (!customTimeRequestOnly && data.customPreferenceEnabled) {
    const hasPreferredValue = Boolean(data.preferredDate || data.preferredTimeValue);
    if (hasPreferredValue) {
      const preferred = validateCustomTimePreference(data.preferredDate, data.preferredTimeValue);
      if (!preferred.valid) errors.preferredTime = preferred.message;
    }
  }
  if (data.preferredTime !== undefined && typeof data.preferredTime !== "string") {
    errors.preferredTime = "Preferred time must be text.";
  }
  if (data.preferredTime && String(data.preferredTime).length > 1000) {
    errors.preferredTime = "Preferred time must be 1000 characters or fewer.";
  }
  if (!data.sessionType || !["Online", "Offline"].includes(data.sessionType)) {
    errors.sessionType = "Please select a valid session type.";
  }
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = "First name is required.";
  }
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = "Last name is required.";
  }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!data.phone || !/^\d{10}$/.test(data.phone)) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }
  if (!data.whatsappNumber || !/^\d{10}$/.test(data.whatsappNumber)) {
    errors.whatsappNumber = "Enter a valid 10-digit WhatsApp number.";
  }
  if (!allowedGenders.includes(data.identifyYourGender))
    errors.identifyYourGender = "Select a valid gender.";
  if (!data.dob || Number.isNaN(Date.parse(data.dob))) {
    errors.dob = "Enter a valid date of birth.";
  } else if (data.dob > formatDateKey(new Date())) {
    errors.dob = "Date of birth cannot be in the future.";
  }
  if (!data.location?.trim()) errors.location = "Location is required.";
  if (!allowedSessionModes.includes(data.sessionMode))
    errors.sessionMode = "Select a valid session mode.";
  if (data.sessionMode && data.sessionType && data.sessionMode !== data.sessionType) {
    errors.sessionMode = "Session mode must match the selected appointment slot.";
  }
  if (!allowedRelationshipStatuses.includes(data.relationShipStatus))
    errors.relationShipStatus = "Select a valid relationship status.";
  if (
    data.numberOfChildren === undefined ||
    Number(data.numberOfChildren) < 0 ||
    !Number.isInteger(Number(data.numberOfChildren))
  ) {
    errors.numberOfChildren = "Enter a valid number of children.";
  }
  if (!allowedReferralSources.includes(data.whereuknowaboutus))
    errors.whereuknowaboutus = "Select how you heard about us.";
  if (
    !Array.isArray(data.therapyGoals) ||
    data.therapyGoals.length === 0 ||
    data.therapyGoals.some((goal) => !allowedTherapyGoals.includes(goal))
  ) {
    errors.therapyGoals = "Select at least one valid therapy goal.";
  }
  if (data.therapyGoals?.includes("Other") && !data.therapyGoalsOther?.trim())
    errors.therapyGoalsOther = "Please describe your other therapy goal.";
  if (typeof data.currentlyTakingAnyPsychiatricMedication !== "boolean")
    errors.currentlyTakingAnyPsychiatricMedication =
      "Select whether you are taking psychiatric medication.";
  if (
    data.currentlyTakingAnyPsychiatricMedication &&
    !data.medicationDetails?.trim()
  )
    errors.medicationDetails = "Please provide medication details.";
  if (
    (data.informedConsent || data.InformedConsentforTherapySessions) !==
    "I agree"
  )
    errors.informedConsent = "Consent is required.";
  if (data.conformationOfBooking !== true)
    errors.conformationOfBooking = "Booking confirmation is required.";

  return errors;
}

export async function isSlotUnavailable(
  selectedDate,
  selectedTime,
  sessionType,
) {
  try {
    await assertSlotAvailable({
      date: selectedDate,
      time: selectedTime,
      sessionType,
    });
    return false;
  } catch {
    return true;
  }
}

export async function createCashBooking(payload) {
  const errors = validateBookingRequest(payload);
  if (Object.keys(errors).length > 0) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.details = errors;
    throw error;
  }

  const packageInfo = INDIA_BOOKING_PACKAGES.find(
    (item) => item.id === payload.packageId,
  );
  if (!packageInfo) {
    const error = new Error("Please select a valid session package.");
    error.statusCode = 422;
    error.details = { packageId: error.message };
    throw error;
  }
  const customTimeRequestOnly = payload.customTimeRequestOnly === true;
  const customPreference = customTimeRequestOnly
    ? validateCustomTimePreference(payload.preferredDate, payload.preferredTimeValue)
    : null;
  const customSessionType = payload.sessionCategory === "offline_session" ? "Offline" : "Online";
  const selectedDate = customTimeRequestOnly ? payload.preferredDate : payload.selectedDate;
  const selectedTime = customTimeRequestOnly
    ? minutesToDisplay(customPreference.minutes)
    : payload.selectedTime;
  const sessionType = customTimeRequestOnly ? customSessionType : payload.sessionType;
  const providerId = payload.providerId || DEFAULT_PROVIDER_ID;
  const serviceId = DEFAULT_SERVICE_ID;
  const timezone = payload.timezone || SCHEDULING_TIMEZONE;
  const bookingId = customTimeRequestOnly
    ? `AL-CT-${payload.customRequestId.toLowerCase()}`
    : generateBookingId();

  const replayExistingRequest = async () => {
    const existing = await Booking.findOne({ bookingId }).lean();
    if (!existing) return null;
    const sameRequest =
      existing.email === payload.email.trim().toLowerCase() &&
      existing.packageId === packageInfo.id &&
      existing.selectedDate === payload.preferredDate &&
      existing.sessionCategory === payload.sessionCategory &&
      existing.preferredTime === `Preferred date: ${payload.preferredDate} · Preferred time: ${payload.preferredTimeValue} (${SCHEDULING_TIMEZONE})`;
    if (!sameRequest) {
      const error = new Error("This custom-time submission ID was already used for different request details.");
      error.statusCode = 409;
      throw error;
    }
    Object.defineProperty(existing, "_idempotentReplay", { value: true });
    return existing;
  };

  if (customTimeRequestOnly) {
    const existing = await replayExistingRequest();
    if (existing) return existing;
  }

  const slot = customTimeRequestOnly
    ? { end: "", sessionCategory: payload.sessionCategory }
    : await assertSlotAvailable({
        date: selectedDate,
        time: selectedTime,
        sessionType,
        sessionCategory: payload.sessionCategory,
        providerId,
        serviceId,
        timezone,
      });

  let booking;
  try {
    booking = await Booking.create({
    userId: payload.userId || null,
    userEmail: payload.userEmail || null,
    bookingId,
    packageId: packageInfo.id,
    packageName: packageInfo.name,
    packagePrice: packageInfo.price,
    packageSessionCount: packageInfo.sessionCount,
    providerId,
    serviceId,
    timezone,
    selectedEndTime: slot.end,
    selectedDate,
    selectedTime,
    sessionType,
    sessionCategory: slot.sessionCategory,
    meetYourTherapist: "Therapy by Nidhi",
    meetYourTherapistContent: THERAPY_CONTENT.meetYourTherapist,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    identifyYourGender: payload.identifyYourGender,
    dob: payload.dob,
    whatsappNumber: payload.whatsappNumber,
    location: payload.location,
    sessionMode: customTimeRequestOnly ? customSessionType : payload.sessionMode,
    occupation: payload.occupation,
    relationShipStatus: payload.relationShipStatus,
    numberOfChildren: Number(payload.numberOfChildren),
    currentlyTakingAnyPsychiatricMedication:
      payload.currentlyTakingAnyPsychiatricMedication,
    medicationDetails: payload.medicationDetails || null,
    whereuknowaboutus: payload.whereuknowaboutus,
    therapyGoals: payload.therapyGoals,
    addNotes: payload.addNotes || null,
    preferredTime: customTimeRequestOnly
      ? `Preferred date: ${payload.preferredDate} · Preferred time: ${payload.preferredTimeValue} (${SCHEDULING_TIMEZONE})`
      : payload.preferredTime || "",
    preferredTimeReviewStatus:
      customTimeRequestOnly || payload.preferredTime?.trim() ? "pending" : "none",
    therapyGoalsOther: payload.therapyGoalsOther || null,
    informedConsent:
      payload.informedConsent || payload.InformedConsentforTherapySessions,
    InformedConsentforTherapySessions:
      payload.InformedConsentforTherapySessions || payload.informedConsent,
    informedConsentContent: THERAPY_CONTENT.informedConsent,
    conformationOfBooking: payload.conformationOfBooking,
    paymentMethod: "cash",
    paymentStatus: "pending",
    bookingStatus: customTimeRequestOnly ? "manual_review" : "pending",
    holdExpiresAt: customTimeRequestOnly ? null : new Date(Date.now() + 10 * 60 * 1000),
    });
  } catch (error) {
    if (customTimeRequestOnly && error?.code === 11000) {
      const existing = await replayExistingRequest();
      if (existing) return existing;
    }
    throw error;
  }

  return booking.toObject();
}

export async function getUserBookings(user) {
  return Booking.find({
    $or: [{ userId: user.id }, { userEmail: user.email }],
  })
    .sort({ created_at: -1 })
    .lean();
}

export async function getUserBookingById(user, bookingId) {
  return Booking.findOne({
    bookingId,
    $or: [{ userId: user.id }, { userEmail: user.email }],
  }).lean();
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZZER_PAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error("RAZZER_PAY_KEY_SECRET is not configured.");
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}
