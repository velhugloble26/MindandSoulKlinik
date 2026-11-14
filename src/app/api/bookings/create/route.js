import jwt from "jsonwebtoken";
import connectDB from "../../../../config/dbconnection";
import {
  success,
  validationError,
  serverError,
} from "../../../../utils/apiResponse";
import { createCashBooking } from "../../../../services/bookingServices";
import { isDuplicateSlotError } from "../../../../services/availabilityServices";
import emailServices from "../../../../utils/common/emailServices";

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
    const authUser = getRequestUser(req);

    try {
      const booking = await createCashBooking({
        ...body,
        userId: authUser?.id || null,
        userEmail: authUser?.email || body.email || null,
      });
      if (!booking._idempotentReplay) {
        const notifications = [
          ["BOOKING_ALERT_EMAIL_ERROR", emailServices.sendBookingAlert(booking)],
        ];
        if (booking.preferredTime) {
          notifications.push([
            "PREFERRED_TIME_ACK_EMAIL_ERROR",
            emailServices.sendPreferredTimeAcknowledgement(booking),
          ]);
        }
        const results = await Promise.allSettled(notifications.map(([, task]) => task));
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(`${notifications[index][0]}:`, result.reason);
          } else {
            console.info(`${notifications[index][0].replace("_ERROR", "")}_SENT`, {
              bookingId: booking.bookingId,
            });
          }
        });
      }
      const isCustomRequest = booking.bookingStatus === "manual_review";
      return success(
        isCustomRequest
          ? "Custom-time request received and is pending manual review."
          : "Booking created successfully.",
        booking,
        booking._idempotentReplay ? 200 : 201,
      );
    } catch (error) {
      if (error.statusCode === 409 || error.statusCode === 422) {
        return validationError(
          error.message,
          error.details || null,
          error.statusCode,
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("CREATE_BOOKING_ERROR:", error);
    if (isDuplicateSlotError(error)) {
      return validationError(
        "Sorry, this time slot is no longer available. Please select another time.",
        null,
        409,
      );
    }
    if (error.statusCode) {
      return validationError(
        error.message,
        error.details || null,
        error.statusCode,
      );
    }
    return serverError("Unable to create booking.");
  }
}
