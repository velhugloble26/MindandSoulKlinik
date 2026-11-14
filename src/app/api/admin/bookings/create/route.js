import connectDB from "../../../../../config/dbconnection";
import { success, validationError, serverError } from "../../../../../utils/apiResponse";
import { requireAdmin } from "../../../../../utils/auth";
import { createCashBooking } from "../../../../../services/bookingServices";
import { isDuplicateSlotError } from "../../../../../services/availabilityServices";
import emailServices from "../../../../../utils/common/emailServices";

export async function POST(req) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const body = await req.json();
    const booking = await createCashBooking({
      ...body,
      userId: auth.user.id,
      userEmail: body.email,
    });
    await emailServices.sendBookingAlert(booking).catch((error) => {
      console.error("ADMIN_BOOKING_ALERT_EMAIL_ERROR:", error);
    });
    return success("Admin booking created successfully.", booking, 201);
  } catch (error) {
    if (isDuplicateSlotError(error)) return validationError("That appointment slot has just been taken.", null, 409);
    if (error.statusCode) return validationError(error.message, error.details || null, error.statusCode);
    console.error("ADMIN_CREATE_BOOKING_ERROR:", error);
    return serverError("Unable to create the admin booking.");
  }
}
