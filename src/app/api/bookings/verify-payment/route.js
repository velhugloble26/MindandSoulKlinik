import connectDB from "../../../../config/dbconnection";
import Razorpay from "razorpay";
import {
  success,
  validationError,
  serverError,
} from "../../../../utils/apiResponse";
import { verifyRazorpaySignature } from "../../../../services/bookingServices";
import { Booking } from "../../../../schema/schema";
import { assertSlotAvailable, isDuplicateSlotError } from "../../../../services/availabilityServices";
import emailServices from "../../../../utils/common/emailServices";

async function recordPaymentForManualReview(filter, paymentFields) {
  const booking = await Booking.findOneAndUpdate(
    filter,
    {
      $set: {
        ...paymentFields,
        bookingStatus: "expired",
        paymentReviewStatus: "manual_review",
      },
    },
    { new: true },
  );
  if (booking) {
    await emailServices.sendBookingPaymentReviewAlert(booking).catch((error) => {
      console.error("BOOKING_PAYMENT_REVIEW_EMAIL_ERROR:", error);
    });
  }
  return booking;
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const orderId = body?.orderId || body?.razorpay_order_id;
    const paymentId = body?.paymentId || body?.razorpay_payment_id;
    const signature = body?.signature || body?.razorpay_signature;
    const bookingId = body?.bookingId;

    if (!orderId || !paymentId || !signature || !bookingId) {
      return validationError(
        "Payment verification data is incomplete.",
        null,
        422,
      );
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return validationError(
        "Booking not found. Please contact support.",
        null,
        404,
      );
    }

    if (!booking.razorpayOrderId || booking.razorpayOrderId !== orderId) {
      return validationError(
        "Payment order does not match this booking.",
        null,
        400,
      );
    }

    if (booking.paymentStatus === "paid" && booking.razorpayPaymentId === paymentId) {
      if (booking.bookingStatus === "confirmed") {
        return success("Payment verified and booking confirmed.", booking);
      }
      return validationError("Payment was received and is under manual review. Please contact support.", null, 409);
    }

    const isValid = verifyRazorpaySignature({
      orderId: booking.razorpayOrderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return validationError(
        "Payment verification failed. Please contact support if your account was charged.",
        null,
        400,
      );
    }

    const keyId = process.env.RAZZER_PAY_KEY_ID;
    const keySecret = process.env.RAZZER_PAY_KEY_SECRET;
    if (!keyId || !keySecret) return serverError("Razorpay is not configured.");
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const [gatewayOrder, gatewayPayment] = await Promise.all([
      razorpay.orders.fetch(orderId),
      razorpay.payments.fetch(paymentId),
    ]);
    const expectedAmount = Number(booking.packagePrice) * 100;
    if (
      gatewayOrder.id !== orderId ||
      gatewayPayment.order_id !== orderId ||
      Number(gatewayOrder.amount) !== expectedAmount ||
      Number(gatewayPayment.amount) !== expectedAmount ||
      gatewayOrder.currency !== "INR" ||
      gatewayPayment.currency !== "INR" ||
      gatewayPayment.status !== "captured" ||
      gatewayOrder.status !== "paid"
    ) {
      return validationError("The Razorpay payment is not captured for the expected amount and currency.", null, 400);
    }

    const paymentFields = {
      paymentStatus: "paid",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      razorpayAmount: Number(gatewayPayment.amount),
      razorpayCurrency: gatewayPayment.currency,
      holdExpiresAt: null,
    };
    if (
      booking.bookingStatus !== "pending" ||
      !booking.holdExpiresAt ||
      booking.holdExpiresAt <= new Date()
    ) {
      await recordPaymentForManualReview(
        { bookingId, razorpayOrderId: orderId, paymentStatus: { $in: ["pending", "failed", "cancelled"] } },
        paymentFields,
      );
      return validationError("Payment was captured after the slot hold ended. Support will contact you to arrange the appointment or refund.", null, 409);
    }

    try {
      const availableSlot = await assertSlotAvailable({
        date: booking.selectedDate,
        time: booking.selectedTime,
        sessionType: booking.sessionType,
        providerId: booking.providerId,
        serviceId: booking.serviceId,
        timezone: "Asia/Kolkata",
        excludeBookingId: booking.bookingId,
      });
      booking.sessionCategory = availableSlot.sessionCategory;
      paymentFields.sessionCategory = availableSlot.sessionCategory;
      paymentFields.timezone = "Asia/Kolkata";
    } catch (availabilityError) {
      if (availabilityError.statusCode !== 409) throw availabilityError;
      await recordPaymentForManualReview(
        { bookingId, razorpayOrderId: orderId, paymentStatus: { $in: ["pending", "cancelled"] } },
        paymentFields,
      );
      return validationError("Payment was captured but the time is no longer available. Support will contact you to arrange another time or a refund.", null, 409);
    }

    const confirmedBooking = await Booking.findOneAndUpdate(
      {
        bookingId,
        razorpayOrderId: orderId,
        paymentStatus: "pending",
      },
      {
        $set: {
          ...paymentFields,
          bookingStatus: "confirmed",
          paymentReviewStatus: "none",
        },
      },
      { new: true, runValidators: true },
    );

    if (confirmedBooking) {
      await emailServices.sendBookingAlert(confirmedBooking).catch((error) => {
        console.error("BOOKING_ALERT_EMAIL_ERROR:", error);
      });
      await emailServices.sendBookingConfirmation(confirmedBooking).catch((error) => {
        console.error("BOOKING_CONFIRMATION_EMAIL_ERROR:", error);
      });
      if (confirmedBooking.preferredTime) {
        await emailServices.sendPreferredTimeAcknowledgement(confirmedBooking).catch((error) => {
          console.error("PREFERRED_TIME_ACK_EMAIL_ERROR:", error);
        });
      }
    } else {
      const latestBooking = await Booking.findOne({ bookingId });
      if (latestBooking?.paymentStatus !== "paid") {
        return validationError(
          "Booking payment is no longer pending. Please contact support.",
          null,
          409,
        );
      }
      if (latestBooking.bookingStatus !== "confirmed") {
        return validationError("Payment was received and is under manual review. Please contact support.", null, 409);
      }
      booking.paymentStatus = latestBooking.paymentStatus;
      booking.bookingStatus = latestBooking.bookingStatus;
      booking.razorpayPaymentId = latestBooking.razorpayPaymentId;
      booking.razorpaySignature = latestBooking.razorpaySignature;
    }

    const savedBooking = confirmedBooking || booking;
    return success("Payment verified and booking confirmed.", savedBooking);
  } catch (error) {
    console.error("VERIFY_PAYMENT_ERROR:", error);
    if (error.statusCode) {
      return validationError(
        error.message,
        error.details || null,
        error.statusCode,
      );
    }
    if (isDuplicateSlotError(error)) {
      return validationError("This appointment time is no longer available.", null, 409);
    }
    return serverError("Unable to verify payment.");
  }
}
