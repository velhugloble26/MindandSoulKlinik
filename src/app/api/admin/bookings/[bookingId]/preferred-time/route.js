import connectDB from "../../../../../../config/dbconnection";
import { Booking } from "../../../../../../schema/schema";
import { requireAdmin } from "../../../../../../utils/auth";
import { success, validationError, serverError } from "../../../../../../utils/apiResponse";
import {
  assertSlotAvailable,
  assertCustomSlotAvailable,
  displayTimeToMinutes,
  minutesToDisplay,
  STANDARD_APPOINTMENT_SLOTS,
  SCHEDULING_TIMEZONE,
  isDuplicateSlotError,
} from "../../../../../../services/availabilityServices";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const { bookingId } = await params;
    const body = await req.json();
    const booking = await Booking.findOne({ bookingId });
    if (!booking) return validationError("Booking not found.", null, 404);
    if (!booking.preferredTime) return validationError("This booking has no preferred-time request.", null, 422);
    if (body.status === "schedule") {
      if (booking.bookingStatus !== "manual_review" || booking.preferredTimeReviewStatus !== "approved") {
        return validationError("Approve this custom-time request before adding it to the calendar.", null, 409);
      }
      const start = displayTimeToMinutes(body.time);
      if (!body.date || start === null || !["online_session", "offline_session"].includes(booking.sessionCategory)) {
        return validationError("Enter a valid appointment date and time.", null, 422);
      }
      const standardSlot = STANDARD_APPOINTMENT_SLOTS.find((slot) => slot.start === start);
      const sessionType = booking.sessionCategory === "online_session" ? "Online" : "Offline";
      const slot = standardSlot
        ? await assertSlotAvailable({
            date: body.date,
            time: minutesToDisplay(start),
            sessionType,
            sessionCategory: booking.sessionCategory,
            providerId: booking.providerId,
            serviceId: booking.serviceId,
            timezone: SCHEDULING_TIMEZONE,
          })
        : await assertCustomSlotAvailable({
            date: body.date,
            time: `${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`,
            sessionCategory: booking.sessionCategory,
            providerId: booking.providerId,
            serviceId: booking.serviceId,
            timezone: SCHEDULING_TIMEZONE,
          });
      booking.selectedDate = body.date;
      booking.selectedTime = slot.start;
      booking.selectedEndTime = slot.end;
      booking.sessionType = sessionType;
      booking.sessionMode = sessionType;
      booking.bookingStatus = "pending";
      booking.paymentMethod = "cash";
      booking.paymentStatus = "pending";
      booking.holdExpiresAt = null;
      booking.timezone = SCHEDULING_TIMEZONE;
      booking.preferredTimeReviewNote = String(body.note || "").slice(0, 1000);
      booking.preferredTimeReviewedBy = auth.user.id;
      booking.preferredTimeReviewedAt = new Date();
      await booking.save({ validateModifiedOnly: true });
      return success("Approved custom-time request added to the calendar. Contact the customer to arrange payment.", { booking });
    }

    if (!["approved", "rejected"].includes(body.status)) return validationError("Choose approved or rejected.", null, 422);

    if (body.status === "approved" && booking.bookingStatus !== "manual_review") {
      if (!body.date || !body.time || !body.sessionType) {
        return validationError("Date, time, and session mode are required to approve this request.", null, 422);
      }
      const slot = await assertSlotAvailable({
        date: body.date,
        time: body.time,
        sessionType: body.sessionType,
        providerId: booking.providerId,
        serviceId: booking.serviceId,
        timezone: SCHEDULING_TIMEZONE,
        excludeBookingId: booking.bookingId,
      });
      booking.selectedDate = body.date;
      booking.selectedTime = body.time;
      booking.selectedEndTime = slot.end;
      booking.sessionType = body.sessionType;
      booking.sessionMode = body.sessionType;
      booking.sessionCategory = slot.sessionCategory;
      booking.timezone = SCHEDULING_TIMEZONE;
    }

    booking.preferredTimeReviewStatus = body.status;
    booking.preferredTimeReviewNote = String(body.note || "").slice(0, 1000);
    booking.preferredTimeReviewedBy = auth.user.id;
    booking.preferredTimeReviewedAt = new Date();
    await booking.save({ validateModifiedOnly: true });
    return success(`Preferred time ${body.status}.`, { booking });
  } catch (error) {
    if (isDuplicateSlotError(error)) return validationError("That appointment slot has just been taken.", null, 409);
    if (error.statusCode) return validationError(error.message, null, error.statusCode);
    console.error("PATCH_PREFERRED_TIME_REVIEW_ERROR:", error);
    return serverError("Unable to review the preferred time.");
  }
}
