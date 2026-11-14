import { success, serverError } from "../../../../utils/apiResponse";
import { INDIA_BOOKING_PACKAGES } from "../../../../services/bookingServices";

export async function GET() {
  try {
    return success("Session packages loaded successfully.", {
      packages: INDIA_BOOKING_PACKAGES,
    });
  } catch (error) {
    console.error("GET_BOOKING_PACKAGES_ERROR:", error);
    return serverError("Unable to load the session packages.");
  }
}
