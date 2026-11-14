import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import connectDB from "../../../../config/dbconnection";
import {
  success,
  validationError,
  serverError,
} from "../../../../utils/apiResponse";
import {
  INDIA_BOOKING_PACKAGES,
  generateBookingId,
  validateBookingRequest,
} from "../../../../services/bookingServices";
import { Booking } from "../../../../schema/schema";
import { THERAPY_CONTENT } from "../../../../constants/therapyContent.js";
import {
  assertSlotAvailable,
  DEFAULT_PROVIDER_ID,
  DEFAULT_SERVICE_ID,
  isDuplicateSlotError,
  SCHEDULING_TIMEZONE,
} from "../../../../services/availabilityServices";

function getRazorpayClient() {
  const keyId = process.env.RAZZER_PAY_KEY_ID;
  const keySecret = process.env.RAZZER_PAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY credentials are not configured.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

function getRequestUser(req) {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (payload.type !== "access") return null;
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    if (body.customTimeRequestOnly) {
      return validationError("Custom-time requests must be reviewed before payment.", null, 422);
    }
    const authUser = getRequestUser(req);
    const errors = validateBookingRequest(body);

    if (Object.keys(errors).length > 0) {
      return validationError(
        "Please complete the booking details correctly.",
        errors,
        422,
      );
    }

    const keyId = process.env.RAZZER_PAY_KEY_ID;
    if (!keyId) {
      return serverError("Razorpay is not configured for this environment.");
    }

    const packageInfo = INDIA_BOOKING_PACKAGES.find(
      (item) => item.id === body.packageId,
    );
    if (!packageInfo) {
      return validationError(
        "Please select a valid India session package.",
        { packageId: "Invalid session package." },
        422,
      );
    }
    const razorpay = getRazorpayClient();
    const providerId = body.providerId || DEFAULT_PROVIDER_ID;
    const serviceId = DEFAULT_SERVICE_ID;
    const timezone = body.timezone || SCHEDULING_TIMEZONE;
    const slot = await assertSlotAvailable({
      date: body.selectedDate,
      time: body.selectedTime,
      sessionType: body.sessionType,
      sessionCategory: body.sessionCategory,
      providerId,
      serviceId,
      timezone,
    });

    const bookingId = generateBookingId();
    const booking = await Booking.create({
      userId: authUser?.id || null,
      userEmail: authUser?.email || body.email || null,
      bookingId,
      packageId: packageInfo.id,
      packageName: packageInfo.name,
      packagePrice: packageInfo.price,
      packageSessionCount: packageInfo.sessionCount,
      providerId,
      serviceId,
      timezone,
      selectedEndTime: slot.end,
      selectedDate: body.selectedDate,
      selectedTime: body.selectedTime,
      sessionType: body.sessionType,
      sessionCategory: slot.sessionCategory,
      meetYourTherapist: "Therapy by Nidhi",
      meetYourTherapistContent: THERAPY_CONTENT.meetYourTherapist,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      identifyYourGender: body.identifyYourGender,
      dob: body.dob,
      whatsappNumber: body.whatsappNumber,
      location: body.location,
      sessionMode: body.sessionMode,
      occupation: body.occupation,
      relationShipStatus: body.relationShipStatus,
      numberOfChildren: Number(body.numberOfChildren),
      currentlyTakingAnyPsychiatricMedication:
        body.currentlyTakingAnyPsychiatricMedication,
      medicationDetails: body.medicationDetails || null,
      whereuknowaboutus: body.whereuknowaboutus,
      therapyGoals: body.therapyGoals,
      addNotes: body.addNotes || null,
      preferredTime: body.preferredTime || "",
      preferredTimeReviewStatus: body.preferredTime?.trim() ? "pending" : "none",
      therapyGoalsOther: body.therapyGoalsOther || null,
      informedConsent:
        body.informedConsent || body.InformedConsentforTherapySessions,
      InformedConsentforTherapySessions:
        body.InformedConsentforTherapySessions || body.informedConsent,
      informedConsentContent: THERAPY_CONTENT.informedConsent,
      conformationOfBooking: body.conformationOfBooking,
      paymentMethod: "online",
      paymentStatus: "pending",
      bookingStatus: "pending",
      holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    let order;
    try {
      order = await razorpay.orders.create({
        amount: Number(packageInfo.price) * 100,
        currency: "INR",
        expire_by: Math.floor(Date.now() / 1000) + 10 * 60,
        receipt: booking.bookingId,
        notes: {
          bookingId: booking.bookingId,
          packageId: packageInfo.id,
          selectedDate: body.selectedDate,
          selectedTime: body.selectedTime,
          sessionType: body.sessionType,
        },
      });
    } catch (error) {
      await Booking.deleteOne({
        _id: booking._id,
        paymentStatus: "pending",
        razorpayOrderId: null,
      }).catch((cleanupError) => {
        console.error("ROLLBACK_RAZORPAY_BOOKING_ERROR:", cleanupError);
      });
      error.isPaymentGatewayError = true;
      throw error;
    }

    booking.razorpayOrderId = order.id;
    booking.razorpayAmount = Number(packageInfo.price) * 100;
    booking.razorpayCurrency = "INR";
    await booking.save();

    return success("Razorpay order created successfully.", {
      order,
      keyId,
      amount: Number(packageInfo.price) * 100,
      currency: "INR",
      bookingId: booking.bookingId,
    });
  } catch (error) {
    console.error("CREATE_RAZORPAY_ORDER_ERROR:", error);
    if (isDuplicateSlotError(error)) {
      return validationError(
        "Sorry, this time slot is no longer available. Please select another time.",
        null,
        409,
      );
    }
    if (error.isPaymentGatewayError) {
      const message =
        error.error?.description ||
        error.description ||
        error.message ||
        "Unable to create the payment order.";
      return validationError(message, null, 400);
    }
    if (error.statusCode) {
      return validationError(
        error.message,
        error.details || null,
        error.statusCode,
      );
    }
    return serverError("Unable to create the Razorpay order.");
  }
}
