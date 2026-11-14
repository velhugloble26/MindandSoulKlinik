import connectDB from "../../../../config/dbconnection";
import { Booking, Users } from "../../../../schema/schema";
import {
  success,
  validationError,
  serverError,
} from "../../../../utils/apiResponse";

const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "whatsappNumber",
  "identifyYourGender",
  "dob",
  "location",
  "occupation",
  "relationShipStatus",
  "numberOfChildren",
  "currentlyTakingAnyPsychiatricMedication",
  "medicationDetails",
  "whereuknowaboutus",
  "therapyGoals",
  "therapyGoalsOther",
];

export async function POST(req) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return validationError("Enter a valid email address.", null, 400);
    }

    await connectDB();
    const [booking, user] = await Promise.all([
      Booking.findOne({
        $or: [{ email: normalizedEmail }, { userEmail: normalizedEmail }],
      })
        .sort({ created_at: -1 })
        .select(PROFILE_FIELDS.join(" "))
        .lean(),
      Users.findOne({ email: normalizedEmail }).select("name phone").lean(),
    ]);

    if (!booking && !user) {
      return success("No previous details found.", {
        found: false,
        profile: null,
      });
    }

    const nameParts = String(user?.name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const profile = booking
      ? { ...booking }
      : {
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" "),
          phone: user?.phone || "",
          whatsappNumber: user?.phone || "",
        };

    return success("Previous details found.", { found: true, profile });
  } catch (error) {
    console.error("BOOKING_PREFILL_ERROR:", error);
    return serverError("Unable to load previous booking details.");
  }
}
