import { timingSafeEqual } from "node:crypto";
import connectDB from "../../../../config/dbconnection.js";
import { runBookingReminderSweep } from "../../../../services/bookingReminderService.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasValidCronAuthorization(request, secret) {
  const expected = Buffer.from(`Bearer ${secret}`);
  const provided = Buffer.from(request.headers.get("authorization") || "");
  return (
    provided.length === expected.length &&
    timingSafeEqual(provided, expected)
  );
}

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json(
      { success: false, message: "CRON_SECRET is not configured." },
      { status: 503 },
    );
  }
  if (!hasValidCronAuthorization(request, secret)) {
    return Response.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    await connectDB();
    const summary = await runBookingReminderSweep();
    return Response.json({ success: true, ...summary });
  } catch (error) {
    console.error("BOOKING_REMINDER_CRON_ERROR:", error);
    return Response.json(
      { success: false, message: "Unable to process booking reminders." },
      { status: 500 },
    );
  }
}
