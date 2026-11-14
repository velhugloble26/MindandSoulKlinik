import connectDB from "../../../../config/dbconnection";
import {
  success,
  validationError,
  serverError,
} from "../../../../utils/apiResponse";
import {
  DEFAULT_PROVIDER_ID,
  getAvailabilityForDate,
  getBookingAvailability,
  DEFAULT_SERVICE_ID,
  SCHEDULING_TIMEZONE,
} from "../../../../services/availabilityServices";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const providerId = searchParams.get("providerId") || DEFAULT_PROVIDER_ID;
    const serviceId = DEFAULT_SERVICE_ID;
    const timezone = searchParams.get("timezone") || SCHEDULING_TIMEZONE;

    if (timezone !== SCHEDULING_TIMEZONE) {
      return validationError(
        `Timezone must be ${SCHEDULING_TIMEZONE}.`,
        null,
        422,
      );
    }

    if (date) {
      const availability = await getAvailabilityForDate({
        date,
        providerId,
        serviceId,
        timezone,
        includeUnavailable: true,
      });
      return success("Availability fetched successfully.", availability);
    }

    const days = Math.min(
      Math.max(Number(searchParams.get("days") || 62), 1),
      62,
    );
    const dates = await getBookingAvailability(days, {
      startDate: searchParams.get("startDate") || undefined,
      providerId,
      includeUnavailable: true,
      serviceId,
      timezone,
    });
    return success("Availability fetched successfully.", {
      dates,
      todayFullyBooked: !dates[0]?.isAvailable,
      providerId,
      serviceId,
      timezone,
    });
  } catch (error) {
    console.error("GET_BOOKING_AVAILABILITY_ERROR:", error);
    if (error.statusCode)
      return validationError(error.message, null, error.statusCode);
    return serverError("Unable to fetch booking availability.");
  }
}
