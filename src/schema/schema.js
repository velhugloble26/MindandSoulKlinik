import mongoose from "mongoose";
import { THERAPY_CONTENT } from "../constants/therapyContent.js";

const PermissionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    module: { type: String, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "permissions" },
);

PermissionSchema.pre("save", function () {
  this.updated_at = Date.now();
});

// roles user(accoding to admin), admin(all permissions), sales(contact, quick_quote)
const UserRolesSchema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      required: true,
      trim: true,
      enum: ["user", "admin", "sales"],
    },
    description: { type: String, trim: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permissions" }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "user_roles" },
);

UserRolesSchema.pre("save", function () {
  this.updated_at = Date.now();
});
const LoginOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp_hash: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    expires_at: {
      type: Date,
      required: true,
      index: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    purpose: {
      type: String,
      enum: ["signup"],
      default: "signup",
      index: true,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "login_otps",
  },
);

// Automatically delete expired OTP documents.
LoginOtpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

LoginOtpSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      trim: true,
    },
    emailVerified: { type: Boolean, default: true, index: true },
    emailVerifiedAt: { type: Date, default: null },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRoles",
      required: true,
    },
    refreshTokens: [{ type: String }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "users" },
);

UserSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    category: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true }, //  folder inside the project
    imagePublicId: { type: String, trim: true },
    content: { type: String, required: true, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "blog" },
);

BlogSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true }, //  folder inside the project
    imagePublicId: { type: String, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "gallery" },
);

GallerySchema.pre("save", function () {
  this.updated_at = Date.now();
});

const ContentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    selectedOption: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "content" },
);

ContentSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const QuickContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    selectedOption: { type: String, default: "", trim: true },
    preferredSession: { type: String, default: "", trim: true },
    preferredFormat: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "quick_contact" },
);

QuickContactSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    message: { type: String, default: "", trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "client" },
);

ClientSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const BookingSchema = new mongoose.Schema(
  {
    sessions: {
      type: [
        {
          _id: false,
          sessionNumber: { type: Number, required: true, min: 1 },
          date: { type: String, required: true, trim: true },
          time: { type: String, required: true, trim: true },
          sessionType: {
            type: String,
            required: true,
            enum: ["Online", "Offline"],
            trim: true,
          },
          location: { type: String, default: "", trim: true },
          amountPaid: { type: Number, default: 0, min: 0 },
          remarks: { type: String, default: "", trim: true },
          status: {
            type: String,
            default: "scheduled",
            enum: [
              "scheduled",
              "confirmed",
              "completed",
              "cancelled",
              "no_show",
            ],
            trim: true,
          },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
      default: undefined,
    },
    reminderTracking: {
      type: [
        {
          _id: false,
          sessionNumber: { type: Number, required: true, min: 0 },
          appointmentDate: { type: String, required: true, trim: true },
          appointmentTime: { type: String, required: true, trim: true },
          reminderType: {
            type: String,
            required: true,
            enum: ["24_hours", "appointment_day"],
            trim: true,
          },
          status: {
            type: String,
            required: true,
            enum: ["sending", "sent", "failed"],
            trim: true,
          },
          claimId: { type: String, default: "", trim: true },
          claimedAt: { type: Date, default: null },
          sentAt: { type: Date, default: null },
          attempts: { type: Number, default: 1, min: 1 },
          lastError: { type: String, default: "", trim: true },
        },
      ],
      default: undefined,
    },
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
      index: true,
    },
    userEmail: { type: String, default: null, trim: true, lowercase: true },
    packageId: { type: String, required: true, trim: true },
    packageName: { type: String, required: true, trim: true },
    packagePrice: { type: Number, required: true, min: 0 },
    packageSessionCount: { type: Number, default: 1, min: 1 },
    providerId: {
      type: String,
      default: "therapy-by-nidhi",
      trim: true,
      index: true,
    },
    serviceId: {
      type: String,
      default: "general-therapy",
      trim: true,
      index: true,
    },
    timezone: { type: String, default: "Asia/Kolkata", trim: true },
    sessionCategory: {
      type: String,
      enum: ["online_session", "offline_session"],
      default: "online_session",
      trim: true,
    },
    selectedEndTime: { type: String, default: "", trim: true },
    selectedDate: { type: String, required: true, trim: true },
    selectedTime: { type: String, required: true, trim: true },
    sessionType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Online", "Offline"],
    },
    meetYourTherapist: { type: String, required: true, trim: true }, // all ready filled in the frontend form Meet Your Therapist
    meetYourTherapistContent: {
      type: String,
      required: true,
      trim: true,
      default: THERAPY_CONTENT.meetYourTherapist,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    identifyYourGender: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Male",
        "Female",
        "Non-Binary",
        "Transgender",
        "Prefer not to say",
        "Other",
      ],
    },
    dob: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    sessionMode: {
      type: String,
      required: true,
      trim: true,
      enum: ["Online", "Offline"],
    },
    occupation: { type: String, trim: true, default: "" },
    relationShipStatus: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Single",
        "In a relationship",
        "Married",
        "Divorced",
        "Widowed",
        "Other",
      ],
    },
    numberOfChildren: { type: Number, default: 0, min: 0 },
    currentlyTakingAnyPsychiatricMedication: { type: Boolean, default: false },
    medicationDetails: { type: String, default: null, trim: true },
    whereuknowaboutus: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Social Media",
        "Instagram",
        "Facebook",
        "YouTube",
        "Twitter/X",
        "LinkedIn",
        "Friend/Family",
        "Doctor/Therapist Referral",
        "Existing Client",
        "Search Engine",
        "Google Search",
        "Website/Blog",
        "Workshop/Event",
        "Advertisement",
        "Other",
      ],
    },

    therapyGoals: {
      type: [String],
      required: true,
      enum: [
        "Managing stress, anxiety, or overwhelming emotions",
        "Healing from past trauma or unresolved emotional pain",
        "Improving self-confidence and self-esteem",
        "Navigating relationship challenges (family, partner, friends, etc.)",
        "Coping with grief or loss",
        "Developing healthier coping mechanisms and habits",
        "Enhancing communication and interpersonal skills",
        "Gaining clarity and direction in life",
        "Overcoming workplace or career-related challenges",
        "Achieving emotional balance and inner peace",
        "Other",
      ],
    },
    addNotes: {
      type: String,
      default: null,
      trim: true,
    },
    preferredTime: { type: String, default: "", trim: true, maxlength: 1000 },
    preferredTimeReviewStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
      trim: true,
    },
    preferredTimeReviewNote: { type: String, default: "", trim: true },
    preferredTimeReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    preferredTimeReviewedAt: { type: Date, default: null },
    therapyGoalsOther: {
      type: String,
      default: null,
      trim: true,
    },
    informedConsent: { type: String, required: true, trim: true }, // already defined in the frontend form Informed Consent
    informedConsentContent: {
      type: String,
      required: true,
      trim: true,
      default: THERAPY_CONTENT.informedConsent,
    },
    InformedConsentforTherapySessions: {
      type: String,
      required: true,
      trim: true,
    },
    conformationOfBooking: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
      enum: ["cash", "online"],
    },
    paymentStatus: {
      type: String,
      default: "pending",
      trim: true,
      enum: ["pending", "paid", "cash_received", "failed", "cancelled", "refunded"],
    },
    bookingStatus: {
      type: String,
      default: "pending",
      trim: true,
      enum: ["pending", "manual_review", "confirmed", "completed", "cancelled", "no_show", "expired"],
    },
    razorpayOrderId: { type: String, default: null, trim: true },
    razorpayPaymentId: { type: String, default: null, trim: true },
    razorpaySignature: { type: String, default: null, trim: true },
    razorpayAmount: { type: Number, default: null, min: 0 },
    razorpayCurrency: { type: String, default: null, trim: true },
    holdExpiresAt: { type: Date, default: null, index: true },
    paymentReviewStatus: {
      type: String,
      enum: ["none", "manual_review"],
      default: "none",
      trim: true,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "bookings" },
);

BookingSchema.index(
  { providerId: 1, selectedDate: 1, selectedTime: 1 },
  {
    name: "unique_active_provider_slot",
    unique: true,
    partialFilterExpression: {
      bookingStatus: { $in: ["pending", "confirmed", "completed", "no_show"] },
    },
  },
);

BookingSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const UnavailableSlotSchema = new mongoose.Schema(
  {
    selectedDate: { type: String, required: true, trim: true },
    selectedTime: { type: String, required: true, trim: true },
    endTime: { type: String, default: "", trim: true },
    providerId: {
      type: String,
      default: "therapy-by-nidhi",
      trim: true,
      index: true,
    },
    serviceId: {
      type: String,
      default: "general-therapy",
      trim: true,
      index: true,
    },
    timezone: { type: String, default: "Asia/Kolkata", trim: true },
    reason: { type: String, default: "", trim: true },
    sessionType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Online", "Offline"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "unavailable_slots" },
);

UnavailableSlotSchema.index(
  {
    providerId: 1,
    serviceId: 1,
    selectedDate: 1,
    selectedTime: 1,
    sessionType: 1,
  },
  { unique: true },
);
UnavailableSlotSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const AvailabilitySettingsSchema = new mongoose.Schema(
  {
    providerId: {
      type: String,
      required: true,
      default: "therapy-by-nidhi",
      trim: true,
    },
    serviceId: {
      type: String,
      required: true,
      default: "general-therapy",
      trim: true,
    },
    timezone: {
      type: String,
      required: true,
      default: "Asia/Kolkata",
      trim: true,
    },
    slotDurationMinutes: {
      type: Number,
      required: true,
      default: 60,
      min: 15,
      max: 240,
    },
    slotIntervalMinutes: {
      type: Number,
      required: true,
      default: 90,
      min: 15,
      max: 240,
    },
    sessionTypes: {
      type: [String],
      default: ["Online", "Offline"],
      enum: ["Online", "Offline"],
    },
    workingHours: {
      type: [
        {
          _id: false,
          dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
          enabled: { type: Boolean, default: true },
          start: { type: String, required: true, default: "09:00" },
          end: { type: String, required: true, default: "20:00" },
        },
      ],
      default: () => [
        { dayOfWeek: 0, enabled: false, start: "09:00", end: "20:00" },
        ...[1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
          dayOfWeek,
          enabled: true,
          start: "09:00",
          end: "20:00",
        })),
      ],
    },
    breaks: {
      type: [
        {
          _id: false,
          dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
          start: { type: String, required: true },
          end: { type: String, required: true },
          label: { type: String, default: "Break", trim: true },
        },
      ],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "availability_settings" },
);
AvailabilitySettingsSchema.index(
  { providerId: 1, serviceId: 1 },
  { unique: true },
);

const BlockedDateSchema = new mongoose.Schema(
  {
    providerId: {
      type: String,
      required: true,
      default: "therapy-by-nidhi",
      trim: true,
    },
    serviceId: {
      type: String,
      required: true,
      default: "general-therapy",
      trim: true,
    },
    date: { type: String, required: true, trim: true },
    timezone: {
      type: String,
      required: true,
      default: "Asia/Kolkata",
      trim: true,
    },
    reason: { type: String, default: "", trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "blocked_dates" },
);
BlockedDateSchema.index(
  { providerId: 1, serviceId: 1, date: 1 },
  { unique: true },
);

const SiteVisitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      maxlength: 255,
    },
    ipAddress: { type: String, default: null, index: true, maxlength: 255 },
    userAgent: { type: String, default: null },
    browser: { type: String, default: null, maxlength: 100 },
    os: { type: String, default: null, maxlength: 100 },
    device: { type: String, default: null, maxlength: 100 },
    referrer: { type: String, default: null },
    landingPage: { type: String, default: null },
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { collection: "site_visitors", timestamps: false },
);

SiteVisitorSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const SiteSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      maxlength: 255,
    },
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteVisitor",
      required: true,
      index: true,
    },
    ipAddress: { type: String, default: null, maxlength: 255 },
    userAgent: { type: String, default: null },
    browser: { type: String, default: null, maxlength: 100 },
    os: { type: String, default: null, maxlength: 100 },
    device: { type: String, default: null, maxlength: 100 },
    referrer: { type: String, default: null },
    landingPage: { type: String, default: null },
    exitPage: { type: String, default: null },
    pageViews: { type: Number, default: 0, min: 0 },
    duration: { type: Number, default: 0, min: 0 },
    startedAt: { type: Date, default: Date.now, index: true },
    lastActivityAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { collection: "site_sessions", timestamps: false },
);

SiteSessionSchema.pre("save", function () {
  this.updated_at = Date.now();
});

const PageVisitSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteSession",
      required: true,
      index: true,
    },
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteVisitor",
      required: true,
      index: true,
    },
    page: { type: String, default: null },
    title: { type: String, default: null, maxlength: 255 },
    timeSpent: { type: Number, default: 0, min: 0 },
    enteredAt: { type: Date, default: Date.now, index: true },
    exitedAt: { type: Date, default: null },
  },
  { collection: "page_visits", timestamps: false },
);

PageVisitSchema.pre("save", function () {
  this.updated_at = Date.now();
});

export const Contents =
  mongoose.models.Contents || mongoose.model("Contents", ContentSchema);
export const QuickContacts =
  mongoose.models.QuickContacts ||
  mongoose.model("QuickContacts", QuickContactSchema);
export const Gallery =
  mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
export const Permissions =
  mongoose.models.Permissions ||
  mongoose.model("Permissions", PermissionSchema);
export const UserRoles =
  mongoose.models.UserRoles || mongoose.model("UserRoles", UserRolesSchema);
export const Users =
  mongoose.models.Users || mongoose.model("Users", UserSchema);
export const LoginOtp =
  mongoose.models.LoginOtp || mongoose.model("LoginOtp", LoginOtpSchema);
export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export const Client =
  mongoose.models.Client || mongoose.model("Client", ClientSchema);
const cachedBookingModel = mongoose.models.Booking;
if (
  cachedBookingModel &&
  !cachedBookingModel.schema
    .path("bookingStatus")
    ?.enumValues.includes("manual_review")
) {
  mongoose.deleteModel("Booking");
}
export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export const UnavailableSlot =
  mongoose.models.UnavailableSlot ||
  mongoose.model("UnavailableSlot", UnavailableSlotSchema);
export const AvailabilitySettings =
  mongoose.models.AvailabilitySettings ||
  mongoose.model("AvailabilitySettings", AvailabilitySettingsSchema);
export const BlockedDate =
  mongoose.models.BlockedDate ||
  mongoose.model("BlockedDate", BlockedDateSchema);
export const SiteVisitor =
  mongoose.models.SiteVisitor ||
  mongoose.model("SiteVisitor", SiteVisitorSchema);
export const SiteSession =
  mongoose.models.SiteSession ||
  mongoose.model("SiteSession", SiteSessionSchema);
export const PageVisit =
  mongoose.models.PageVisit || mongoose.model("PageVisit", PageVisitSchema);
