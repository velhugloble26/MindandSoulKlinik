import connectDB from "../../../../../../config/dbconnection";
import {
  success,
  validationError,
  serverError,
} from "../../../../../../utils/apiResponse";
import { requireAdmin } from "../../../../../../utils/auth";
import { Booking } from "../../../../../../schema/schema";
import {
  assertSlotAvailable,
  DEFAULT_PROVIDER_ID,
  getServiceId,
  isDuplicateSlotError,
  SCHEDULING_TIMEZONE,
} from "../../../../../../services/availabilityServices";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;

    const { bookingId } = await params;
    const body = await req.json();

    if (!body.date || !body.time || !body.sessionType) {
      return validationError(
        "Date, time, and session type are required.",
        null,
        422,
      );
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return validationError("Booking not found.", null, 404);
    }

    const slot = await assertSlotAvailable({
      date: body.date,
      time: body.time,
      sessionType: body.sessionType,
      providerId: booking.providerId || DEFAULT_PROVIDER_ID,
      serviceId: booking.serviceId || getServiceId(booking.packageId),
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
    if (booking.sessions?.length) {
      booking.sessions[0].date = body.date;
      booking.sessions[0].time = body.time;
      booking.sessions[0].sessionType = body.sessionType;
      booking.sessions[0].updatedAt = new Date();
    } else {
      booking.sessions = [
        {
          sessionNumber: 1,
          date: body.date,
          time: body.time,
          sessionType: body.sessionType,
          location: booking.location || "",
          status:
            booking.bookingStatus === "pending"
              ? "scheduled"
              : booking.bookingStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }
    await booking.save({ validateModifiedOnly: true });

    return success("Booking rescheduled successfully.", { booking });
  } catch (error) {
    console.error("PATCH_ADMIN_BOOKING_RESCHEDULE_ERROR:", error);
    if (isDuplicateSlotError(error)) {
      return validationError(
        "Sorry, this time slot is no longer available. Please select another time.",
        null,
        409,
      );
    }
    if (error.statusCode)
      return validationError(error.message, null, error.statusCode);
    return serverError("Unable to reschedule the booking.");
  }
}
