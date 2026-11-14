import crypto from "crypto";
import connectDB from "../../../../config/dbconnection";
import { Booking } from "../../../../schema/schema";
import { assertSlotAvailable } from "../../../../services/availabilityServices";
import emailServices from "../../../../utils/common/emailServices";

function validSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest();
  let received;
  try {
    received = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

export async function POST(req) {
  const rawBody = await req.text();
  if (!validSignature(
    rawBody,
    req.headers.get("x-razorpay-signature"),
    process.env.RAZORPAY_WEBHOOK_SECRET,
  )) {
    return Response.json({ success: false, message: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.event !== "payment.captured") {
      return Response.json({ success: true, ignored: true });
    }
    await connectDB();
    const payment = event.payload?.payment?.entity;
    const order = event.payload?.order?.entity;
    const orderId = payment?.order_id || order?.id;
    if (!orderId || (payment && payment.status !== "captured")) {
      return Response.json({ success: true, ignored: true });
    }

    const booking = await Booking.findOne({ razorpayOrderId: orderId });
    if (!booking) return Response.json({ success: true, unmatched: true });
    if (booking.paymentStatus === "paid") return Response.json({ success: true, duplicate: true });

    const amount = Number(payment?.amount ?? order?.amount_paid);
    const currency = payment?.currency || order?.currency;
    const flagManualReview = async () => {
      const reviewed = await Booking.findOneAndUpdate(
        {
        bookingId: booking.bookingId,
        bookingStatus: { $in: ["pending", "expired", "cancelled"] },
        paymentStatus: { $in: ["pending", "failed", "cancelled"] },
        },
        {
          $set: {
          bookingStatus: "expired",
          paymentStatus: "paid",
          paymentReviewStatus: "manual_review",
          razorpayPaymentId: payment?.id || null,
          razorpayAmount: Number.isFinite(amount) ? amount : null,
          razorpayCurrency: currency || null,
          holdExpiresAt: null,
          },
        },
        { new: true },
      );
      if (reviewed) {
        await emailServices.sendBookingPaymentReviewAlert(reviewed).catch((error) => {
          console.error("BOOKING_PAYMENT_REVIEW_EMAIL_ERROR:", error);
        });
      }
      return reviewed;
    };
    if (
      amount !== Number(booking.packagePrice) * 100 ||
      currency !== "INR" ||
      (order?.amount !== undefined && Number(order.amount) !== amount)
    ) {
      console.error("RAZORPAY_WEBHOOK_PAYMENT_MISMATCH", { bookingId: booking.bookingId, orderId });
      await flagManualReview();
      return Response.json({ success: true, reviewRequired: true });
    }
    if (
      booking.bookingStatus !== "pending" ||
      !booking.holdExpiresAt ||
      booking.holdExpiresAt <= new Date()
    ) {
      console.error("RAZORPAY_WEBHOOK_EXPIRED_HOLD", { bookingId: booking.bookingId, orderId });
      await flagManualReview();
      return Response.json({ success: true, reviewRequired: true });
    }

    let availableSlot;
    try {
      availableSlot = await assertSlotAvailable({
        date: booking.selectedDate,
        time: booking.selectedTime,
        sessionType: booking.sessionType,
        providerId: booking.providerId,
        serviceId: booking.serviceId,
        timezone: "Asia/Kolkata",
        excludeBookingId: booking.bookingId,
      });
    } catch (availabilityError) {
      if (availabilityError.statusCode !== 409) throw availabilityError;
      await flagManualReview();
      return Response.json({ success: true, reviewRequired: true });
    }

    const updated = await Booking.findOneAndUpdate(
      {
        bookingId: booking.bookingId,
        bookingStatus: "pending",
        paymentStatus: "pending",
        holdExpiresAt: { $gt: new Date() },
      },
      {
        $set: {
          bookingStatus: "confirmed",
          paymentStatus: "paid",
          paymentReviewStatus: "none",
          sessionCategory: availableSlot.sessionCategory,
          razorpayPaymentId: payment?.id || null,
          razorpayAmount: amount,
          razorpayCurrency: currency,
          holdExpiresAt: null,
        },
      },
      { new: true },
    );

    if (updated) {
      await Promise.allSettled([
        emailServices.sendBookingAlert(updated),
        emailServices.sendBookingConfirmation(updated),
        ...(updated.preferredTime ? [emailServices.sendPreferredTimeAcknowledgement(updated)] : []),
      ]);
    }
    return Response.json({ success: true, duplicate: !updated });
  } catch (error) {
    console.error("RAZORPAY_WEBHOOK_ERROR:", error);
    return Response.json({ success: false, message: "Webhook processing failed." }, { status: 500 });
  }
}
