"use client";

import {
  BOOKING_AVAILABILITY,
  BOOKING_PREFILL,
  CREATE_BOOKING,
  CREATE_BOOKING_ORDER,
  VERIFY_BOOKING_PAYMENT,
} from "@/utils/api";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageCircleHeart,
  CalendarCheck,
  Layers,
  Award,
  UsersRound,
  HeartHandshake,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  PhoneCall,
  Sparkles,
  Clock,
  FileText,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Check,
  Globe,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { MotionReveal, MotionSection } from "@/components/ui/Motion";
import { THERAPY_CONTENT } from "@/constants/therapyContent";

const steps = [
  "Select Session",
  "Schedule",
  "Booking Details",
  "Payment",
  "Confirmation",
];

const BOOKING_TIMEZONE = "Asia/Kolkata";
const calendarWeekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type BookingPackage = {
  id: string;
  name: string;
  sessions: {
    id: string;
    name: string;
    count: number;
    details: string;
    indiaPrice?: number;
  }[];
};

type AvailabilitySlot = {
  start: string;
  end: string;
  time: string;
  sessionType: string;
  sessionCategory: "online_session" | "offline_session";
  label: string;
  status: "available" | "booked" | "blocked" | "break" | "past";
  available: boolean;
};

type AvailabilityDate = {
  date: string;
  label: string;
  isAvailable: boolean;
  slots: AvailabilitySlot[];
};

type BookingErrorPayload = {
  message?: string;
  errors?: Record<string, string> | string[] | string | null;
};

type BookingConfirmation = {
  bookingId?: string;
  _id?: string;
  bookingStatus?: string;
  packageName?: string;
  sessionType?: string;
  selectedDate?: string;
  selectedTime?: string;
  firstName?: string;
  lastName?: string;
  paymentMethod?: string;
  paymentStatus?: string;
};

type RazorpayCallback = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function formatSelectedDate(dateKey: string) {
  if (!dateKey) return "Not selected";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: BOOKING_TIMEZONE,
  }).format(parseDateKey(dateKey));
}

function getCalendarDays(monthKey: string) {
  if (!monthKey) return [];

  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month - 1, 1 - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return {
      date,
      dateKey,
      isCurrentMonth: date.getMonth() === month - 1,
    };
  });
}

function getTodayKey() {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: BOOKING_TIMEZONE,
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function isCustomTimeInRange(value: string) {
  const match = String(value || "").match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;
  const minutes = Number(match[1]) * 60 + Number(match[2]);
  return minutes >= 10 * 60 && minutes <= 18 * 60;
}

const indiaPackages: BookingPackage[] = [
  {
    id: "psychologist-psychotherapist",
    name: "Individual Therapy",
    sessions: [
      {
        id: "regular",
        name: "Individual Therapy",
        count: 1,
        details: "60–75 minutes per session",
        indiaPrice: 2499,
      },
      {
        id: "4-session",
        name: "4-session package",
        count: 4,
        details: "4 sessions",
        indiaPrice: 9199,
      },
      {
        id: "8-session",
        name: "8-session package",
        count: 8,
        details: "8 sessions + 1 complimentary 15-minute check-in",
        indiaPrice: 15999,
      },
      {
        id: "12-session",
        name: "12-session package",
        count: 12,
        details:
          "12 sessions + 2 complimentary check-ins of 15 minutes each",
        indiaPrice: 20999,
      },
    ],
  },
  {
    id: "couple-therapy",
    name: "Couple Therapy",
    sessions: [
      {
        id: "regular",
        name: "Couple Therapy",
        count: 1,
        details: "Single joint session – 90 minutes",
        indiaPrice: 3999,
      },
      {
        id: "journey",
        name: "Couple Therapy Journey",
        count: 1,
        details: "Structured combination of joint and individual sessions",
        indiaPrice: 19999,
      },
    ],
  },
  {
    id: "wellness-package",
    name: "Wellness Packages",
    sessions: [
      {
        id: "3-month",
        name: "3-month package",
        count: 12,
        details: "12 sessions + 2 complimentary check-ins of 15 minutes each",
        indiaPrice: 20999,
      },
      {
        id: "6-month",
        name: "6-month package",
        count: 24,
        details: "24 sessions + 4 complimentary check-ins of 15 minutes each",
        indiaPrice: 35999,
      },
      {
        id: "12-month",
        name: "12-month package",
        count: 48,
        details:
          "48 sessions + 12 complimentary check-ins of 15 minutes each",
        indiaPrice: 60000,
      },
    ],
  },
  {
    id: "consultation-call",
    name: "Consultation Call",
    sessions: [
      {
        id: "15-minute",
        name: "Consultation Call",
        count: 1,
        details: "15 minutes",
        indiaPrice: 500,
      },
    ],
  },
];

const iconMap: Record<string, React.ElementType> = {
  // Individual Therapy
  "psychologist-psychotherapist-regular": MessageCircleHeart,
  "psychologist-psychotherapist-4-session": CalendarCheck,
  "psychologist-psychotherapist-8-session": Layers,
  "psychologist-psychotherapist-12-session": Award,

  // Couple Therapy
  "couple-therapy-regular": UsersRound,
  "couple-therapy-journey": HeartHandshake,

  // Wellness Packages
  "wellness-package-3-month": CalendarDays,
  "wellness-package-6-month": CalendarRange,
  "wellness-package-12-month": CalendarClock,

  // Consultation Call
  "consultation-call-15-minute": PhoneCall,
};

const initialBooking = {
  packageId: "",
  selectedDate: "",
  selectedTime: "",
  sessionType: "",
  sessionCategory: "",
  meetYourTherapist: "Therapy by Nidhi",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  identifyYourGender: "",
  dob: "",
  whatsappNumber: "",
  location: "",
  sessionMode: "Online",
  occupation: "",
  relationShipStatus: "",
  numberOfChildren: 0,
  currentlyTakingAnyPsychiatricMedication: false,
  medicationDetails: "",
  whereuknowaboutus: "",
  therapyGoals: [] as string[],
  therapyGoalsOther: "",
  addNotes: "",
  preferredTime: "",
  informedConsent: "",
  InformedConsentforTherapySessions: "",
  conformationOfBooking: false,
  paymentMethod: "cash",
};

const therapyGoalOptions = [
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
];

export default function BookSessionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [dates, setDates] = useState<AvailabilityDate[]>([]);
  const [activeDate, setActiveDate] = useState("");
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [booking, setBooking] = useState(initialBooking);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const locationTab = "india";
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState("");
  const [customTimeOpen, setCustomTimeOpen] = useState(false);
  const [customPreferenceEnabled, setCustomPreferenceEnabled] = useState(false);
  const [customRequestOnly, setCustomRequestOnly] = useState(false);
  const [customPreferenceCategory, setCustomPreferenceCategory] = useState<"online_session" | "offline_session">("online_session");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeOfDay, setPreferredTimeOfDay] = useState("");
  const [customRequestId, setCustomRequestId] = useState("");

  const packages = indiaPackages;
  const visiblePackages =
    activeCategoryFilter === "all"
      ? packages
      : packages.filter((pkg) => pkg.id === activeCategoryFilter);

  const selectedPlan = (() => {
    for (const service of packages) {
      for (const session of service.sessions) {
        const packageId = `${locationTab}-${service.id}-${session.id}`;
        if (packageId === booking.packageId) {
          return {
            serviceName: service.name,
            sessionName: session.name,
            details: session.details,
            sessionCount: session.count,
            price: session.indiaPrice ?? 0,
            location: "India",
          };
        }
      }
    }

    return null;
  })();

  const selectedPackageName = selectedPlan
    ? `${selectedPlan.serviceName} · ${selectedPlan.sessionName} — ${selectedPlan.details}`
    : "Session booking";

  const fetchAvailability = async (packageId = booking.packageId) => {
    setAvailabilityLoading(true);
    setAvailabilityError("");
    try {
      const query = new URLSearchParams({
        packageId,
        providerId: "therapy-by-nidhi",
        timezone: BOOKING_TIMEZONE,
        days: "62",
      });
      const response = await fetch(`${BOOKING_AVAILABILITY}?${query}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load available dates.");
      }

      const upcomingDates: AvailabilityDate[] = (result.data.dates || []).slice(
        1,
      );
      setDates(upcomingDates);
      setActiveDate((current) =>
        upcomingDates.some((date) => date.date === current)
          ? current
          : upcomingDates[0]?.date || "",
      );
    } catch (error) {
      setAvailabilityError(
        error instanceof Error
          ? error.message
          : "Unable to load available dates.",
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const isEmailValid = /^\S+@\S+\.\S+$/.test(booking.email.trim());

  const prefillReturningClient = async () => {
    if (!isEmailValid) return;

    setPrefillLoading(true);
    setPrefillMessage("");
    try {
      const requestedEmail = booking.email.trim().toLowerCase();
      const response = await fetch(BOOKING_PREFILL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestedEmail }),
      });
      if (!response.ok) return;

      const result = await response.json();
      const previousBooking = result.data?.profile as Record<
        string,
        unknown
      > | null;

      if (!result.data?.found || !previousBooking) {
        setPrefillMessage(
          "No previous booking details found. Please complete the form below.",
        );
        return;
      }

      const profileFields = [
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

      setBooking((current) => {
        const profile = profileFields.reduce<Record<string, unknown>>(
          (values, field) => {
            if (
              previousBooking[field] !== undefined &&
              previousBooking[field] !== null
            ) {
              values[field] = previousBooking[field];
            }
            return values;
          },
          {},
        );
        return current.email.trim().toLowerCase() === requestedEmail
          ? { ...current, ...profile, email: current.email }
          : current;
      });
      setPrefillMessage(
        "Your previous details were added. You can change any field.",
      );
    } finally {
      setPrefillLoading(false);
    }
  };

  useEffect(() => {
    if (!isEmailValid) return;

    const timeoutId = window.setTimeout(() => {
      void prefillReturningClient();
    }, 600);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.email]);

  const updateField = (field: string, value: unknown) => {
    setCustomRequestId("");
    if (field === "phone") {
      const contactValue = String(value);
      setBooking((current) => ({
        ...current,
        phone: contactValue,
        whatsappNumber: contactValue,
      }));
      setErrors((current) => ({ ...current, phone: "", whatsappNumber: "" }));
      return;
    }

    setBooking((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateFields = () => {
    const nextErrors: Record<string, string> = {};

    if (!booking.firstName || booking.firstName.trim().length < 2)
      nextErrors.firstName = "First name is required.";
    if (!booking.lastName || booking.lastName.trim().length < 2)
      nextErrors.lastName = "Last name is required.";
    if (!/^\S+@\S+\.\S+$/.test(booking.email))
      nextErrors.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(booking.phone))
      nextErrors.phone = "Enter a valid 10-digit phone number.";
    if (!booking.identifyYourGender)
      nextErrors.identifyYourGender = "Select your gender.";
    if (!booking.dob) nextErrors.dob = "Date of birth is required.";
    else if (booking.dob > getTodayKey())
      nextErrors.dob = "Date of birth cannot be in the future.";
    if (!booking.location.trim()) nextErrors.location = "Location is required.";
    if (!booking.sessionMode) nextErrors.sessionMode = "Select a session mode.";
    if (!booking.relationShipStatus)
      nextErrors.relationShipStatus = "Select your relationship status.";
    if (
      booking.numberOfChildren < 0 ||
      !Number.isInteger(Number(booking.numberOfChildren))
    )
      nextErrors.numberOfChildren = "Enter a valid number.";
    if (!booking.whereuknowaboutus)
      nextErrors.whereuknowaboutus = "Select how you heard about us.";
    if (!booking.therapyGoals.length)
      nextErrors.therapyGoals = "Select at least one therapy goal.";
    if (
      booking.therapyGoals.includes("Other") &&
      !booking.therapyGoalsOther.trim()
    )
      nextErrors.therapyGoalsOther = "Please describe your other goal.";
    if (
      booking.currentlyTakingAnyPsychiatricMedication &&
      !booking.medicationDetails.trim()
    )
      nextErrors.medicationDetails = "Please provide medication details.";
    if (booking.InformedConsentforTherapySessions !== "I agree")
      nextErrors.InformedConsentforTherapySessions = "Consent is required.";
    if (!booking.conformationOfBooking)
      nextErrors.conformationOfBooking = "Please confirm your booking details.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 0 && !booking.packageId) {
      setErrors({ packageId: "Please select a package." });
      return;
    }

    if (currentStep === 1) {
      if (customRequestOnly) {
        const nextErrors: Record<string, string> = {};
        if (!preferredDate || preferredDate < todayKey) {
          nextErrors.preferredDate = "Choose a valid preferred date today or later.";
        }
        if (!isCustomTimeInRange(preferredTimeOfDay)) {
          nextErrors.preferredTime = "Choose a preferred time between 10:00 AM and 6:00 PM IST.";
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        const sessionType = customPreferenceCategory === "offline_session" ? "Offline" : "Online";
        setBooking((current) => ({
          ...current,
          sessionCategory: customPreferenceCategory,
          sessionType,
          sessionMode: sessionType,
        }));
        setCurrentStep(2);
        return;
      }

      if (
        !booking.selectedDate ||
        !booking.selectedTime ||
        !booking.sessionType
      ) {
        setErrors({
          selectedDate: !booking.selectedDate ? "Please select a date." : "",
          selectedTime: !booking.selectedTime
            ? "Preferred Time is an alternative request. To continue, select a standard slot above: 11:00 AM, 12:30 PM, 4:00 PM or 5:30 PM."
            : "",
          sessionType: !booking.sessionType
            ? "Please select session type."
            : "",
        });
        return;
      }
      if (customPreferenceEnabled && (preferredDate || preferredTimeOfDay)) {
        const preferenceErrors: Record<string, string> = {};
        if (!preferredDate || preferredDate < todayKey) {
          preferenceErrors.preferredDate = "Choose a valid preferred date today or later.";
        }
        if (!isCustomTimeInRange(preferredTimeOfDay)) {
          preferenceErrors.preferredTime = "Choose a preferred time between 10:00 AM and 6:00 PM IST.";
        }
        setErrors(preferenceErrors);
        if (Object.keys(preferenceErrors).length) return;
      }
    }

    if (currentStep === 2) {
      if (!validateFields()) return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleBookingError = async (
    response: Response,
    result: BookingErrorPayload,
    fallbackMessage: string,
  ) => {
    const message = result?.message || fallbackMessage;

    if (response.status === 409) {
      setBooking((current) => ({
        ...current,
        selectedDate: "",
        selectedTime: "",
        sessionType: "",
        sessionMode: "",
      }));
      setErrors({ selectedTime: message });
      setCurrentStep(1);
      await fetchAvailability(booking.packageId);
      return;
    }

    const fieldErrors = result?.errors;
    if (
      fieldErrors &&
      typeof fieldErrors === "object" &&
      !Array.isArray(fieldErrors)
    ) {
      const normalizedErrors = { ...fieldErrors };
      if (
        normalizedErrors.informedConsent &&
        !normalizedErrors.InformedConsentforTherapySessions
      ) {
        normalizedErrors.InformedConsentforTherapySessions =
          normalizedErrors.informedConsent;
      }
      setErrors({ ...normalizedErrors, submit: message });
      setCurrentStep(
        normalizedErrors.preferredTime || normalizedErrors.preferredDate
          ? 1
          : 2,
      );
      return;
    }

    setErrors({
      submit:
        Array.isArray(fieldErrors) && fieldErrors.length > 0
          ? fieldErrors.join(" ")
          : message,
    });
  };

  const handleCashBooking = async () => {
    if (!validateFields()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(CREATE_BOOKING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          preferredDate,
          preferredTimeValue: preferredTimeOfDay,
          customPreferenceEnabled,
          packageId: booking.packageId,
          paymentMethod: "cash",
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        await handleBookingError(response, result, "Unable to create booking.");
        return;
      }

      setConfirmation({
        ...result.data,
        paymentMethod: "Cash",
        paymentStatus: "Pending",
        bookingStatus: "Pending",
      });
      setCurrentStep(steps.length - 1);
    } catch (error: unknown) {
      setErrors({ submit: error instanceof Error ? error.message : "Unable to create booking." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomTimeRequest = async () => {
    if (!validateFields()) return;
    setIsSubmitting(true);
    try {
      const requestId = customRequestId || crypto.randomUUID();
      setCustomRequestId(requestId);
      const sessionType = customPreferenceCategory === "offline_session" ? "Offline" : "Online";
      const response = await fetch(CREATE_BOOKING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          selectedDate: preferredDate,
          selectedTime: preferredTimeOfDay,
          preferredDate,
          preferredTimeValue: preferredTimeOfDay,
          customPreferenceEnabled: true,
          customTimeRequestOnly: true,
          customRequestId: requestId,
          sessionCategory: customPreferenceCategory,
          sessionType,
          sessionMode: sessionType,
          timezone: BOOKING_TIMEZONE,
          paymentMethod: "cash",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        await handleBookingError(response, result, "Unable to submit the custom-time request.");
        return;
      }
      setConfirmation({
        ...result.data,
        bookingStatus: "manual_review",
        paymentMethod: "Not initiated",
        paymentStatus: "Not started",
      });
      setCurrentStep(steps.length - 1);
    } catch (error: unknown) {
      setErrors({ submit: error instanceof Error ? error.message : "Unable to submit the custom-time request." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!validateFields()) return;
    setPaymentProcessing(true);

    try {
      const orderResponse = await fetch(CREATE_BOOKING_ORDER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          preferredDate,
          preferredTimeValue: preferredTimeOfDay,
          customPreferenceEnabled,
          paymentMethod: "online",
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        await handleBookingError(
          orderResponse,
          orderData,
          "Unable to create payment order.",
        );
        return;
      }

      const { order, keyId, amount, currency, bookingId } = orderData.data;
      const paymentOptions = {
        key: keyId,
        amount,
        currency,
        name: "Mind And Soul Klinic",
        description: selectedPackageName,
        order_id: order.id,
        handler: async function (response: RazorpayCallback) {
          try {
            const verifyResponse = await fetch(VERIFY_BOOKING_PAYMENT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookingId,
              }),
            });

            const verifyResult = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyResult.success) {
              setErrors({
                submit: verifyResult.message || "Payment verification failed.",
              });
              setPaymentProcessing(false);
              return;
            }

            setConfirmation({
              ...verifyResult.data,
              paymentMethod: "Online Payment",
              paymentStatus: "Paid",
              bookingStatus: "Confirmed",
            });
            setCurrentStep(steps.length - 1);
            setPaymentProcessing(false);
          } catch (error: unknown) {
            setErrors({ submit: error instanceof Error ? error.message : "Payment verification failed." });
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: `${booking.firstName} ${booking.lastName}`,
          email: booking.email,
          contact: booking.phone,
        },
        theme: {
          color: "#003044",
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
          },
        },
      };

      const razorpayScript = "https://checkout.razorpay.com/v1/checkout.js";
      const script = document.createElement("script");
      script.src = razorpayScript;
      script.onload = () => {
        const Razorpay = (window as Window & {
          Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
        }).Razorpay;
        if (!Razorpay) {
          setErrors({ submit: "Unable to initialize Razorpay checkout." });
          setPaymentProcessing(false);
          return;
        }
        const razorpay = new Razorpay(paymentOptions as unknown as Record<string, unknown>);
        razorpay.open();
      };
      script.onerror = () => {
        setErrors({ submit: "Unable to load Razorpay checkout." });
        setPaymentProcessing(false);
      };
      document.body.appendChild(script);
    } catch (error: unknown) {
      setErrors({ submit: error instanceof Error ? error.message : "Payment failed." });
      setPaymentProcessing(false);
    }
  };

  const activeDateData =
    dates.find((date) => date.date === activeDate) || dates[0];
  const onlineSlots = (activeDateData?.slots || []).filter(
    (slot) => slot.sessionCategory === "online_session",
  );
  const offlineSlots = (activeDateData?.slots || []).filter(
    (slot) => slot.sessionCategory === "offline_session",
  );
  const availabilityByDate = new Map(dates.map((date) => [date.date, date]));
  const availableMonthKeys = Array.from(
    new Set(dates.map((date) => date.date.slice(0, 7))),
  );
  const activeMonthKey = (activeDateData?.date || dates[0]?.date || "").slice(
    0,
    7,
  );
  const activeMonthIndex = availableMonthKeys.indexOf(activeMonthKey);
  const calendarDays = getCalendarDays(activeMonthKey);
  const todayKey = getTodayKey();
  const monthLabel = activeMonthKey
    ? new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
        timeZone: BOOKING_TIMEZONE,
      }).format(parseDateKey(`${activeMonthKey}-01`))
    : "No dates available";

  const showDate = (dateKey: string) => {
    setActiveDate(dateKey);
    if (booking.selectedDate !== dateKey) {
      setBooking((current) => ({
        ...current,
        selectedDate: "",
        selectedTime: "",
        sessionType: "",
      }));
    }
    setErrors((current) => ({
      ...current,
      selectedDate: "",
      selectedTime: "",
      sessionType: "",
    }));
  };

  const showAdjacentMonth = (offset: number) => {
    const targetMonth = availableMonthKeys[activeMonthIndex + offset];
    const targetDate = dates.find((date) => date.date.startsWith(targetMonth));

    if (targetDate) showDate(targetDate.date);
  };

  const activeYear = activeMonthKey.slice(0, 4);
  const activeMonth = activeMonthKey.slice(5, 7);
  const availableYears = Array.from(
    new Set(availableMonthKeys.map((key) => key.slice(0, 4))),
  );
  const availableMonths = availableMonthKeys.filter((key) =>
    key.startsWith(activeYear),
  );

  const showMonth = (month: string) => {
    const targetDate = dates.find((date) =>
      date.date.startsWith(`${activeYear}-${month}`),
    );
    if (targetDate) showDate(targetDate.date);
  };

  const showYear = (year: string) => {
    const matchingMonth =
      availableMonthKeys.find((key) => key === `${year}-${activeMonth}`) ||
      availableMonthKeys.find((key) => key.startsWith(year));
    const targetDate = dates.find((date) =>
      date.date.startsWith(matchingMonth || ""),
    );
    if (targetDate) showDate(targetDate.date);
  };

  const selectCalendarDate = (dateKey: string) => {
    showDate(dateKey);
    setBooking((current) => ({
      ...current,
      selectedDate: dateKey,
      selectedTime: "",
      sessionType: "",
    }));
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-[1680px] px-[clamp(1rem,4vw,3.5rem)] py-8 md:py-12">
        <MotionReveal>
          {/* Editorial Header */}
          <div className="mb-8 flex flex-col gap-4 border-b border-[#e4e1d8] pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B89545]">
                Mind And Soul Klinic · Appointments
              </p>
              <h1 className="text-headline-lg mt-2 text-[#003044] ui-heading">
                Book a Session
              </h1>
              <p className="mt-2.5 max-w-xl text-body-lg text-[#4a666a] ui-copy">
                Choose a session type, then select a date and time that works
                for you.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#dce6e6] bg-[#f6fafa] px-3.5 py-1.5 text-xs font-medium text-[#286368] lg:self-auto">
              <Globe size={14} className="text-[#00646a]" />
              <span>All timings in IST ({BOOKING_TIMEZONE})</span>
            </div>
          </div>

          {/* Sleek Stepper */}
          <nav
            aria-label="Booking progress"
            className="mb-10 rounded-2xl border border-[#e3e7e6] bg-white/90 px-3 py-4 shadow-[0_6px_24px_rgba(0,48,68,0.04)] backdrop-blur-sm sm:px-6 sm:py-5"
          >
            <ol className="grid grid-cols-5">
              {steps.map((label, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                  <li
                    key={label}
                    className="flex min-w-0 flex-col items-center"
                  >
                    <div className="relative flex h-9 w-full items-center justify-center sm:h-10">
                      {index !== steps.length - 1 && (
                        <span
                          aria-hidden="true"
                          className={`absolute left-1/2 top-1/2 z-0 h-[2px] w-full -translate-y-1/2 transition-colors duration-300 ${
                            isCompleted ? "bg-[#00646a]" : "bg-[#e5e9e8]"
                          }`}
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 sm:h-10 sm:w-10 ${
                          isCompleted
                            ? "bg-[#00646a] text-white shadow-sm"
                            : isActive
                              ? "bg-[#eef7f6] text-[#00646a] ring-2 ring-[#00646a] ring-offset-2"
                              : "border border-[#e2e6e5] bg-[#f8f9f8] text-[#849194]"
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={16} strokeWidth={2.5} />
                        ) : (
                          <>
                            {index === 0 && <CalendarDays size={16} />}
                            {index === 1 && <Clock size={16} />}
                            {index === 2 && <FileText size={16} />}
                            {index === 3 && <CreditCard size={16} />}
                            {index === 4 && <ShieldCheck size={16} />}
                          </>
                        )}
                      </div>
                    </div>

                    <span
                      className={`mt-2.5 flex min-h-5 items-start justify-center text-center text-[10px] leading-tight sm:min-h-6 sm:text-xs ${
                        isActive
                          ? "font-bold text-[#003044]"
                          : isCompleted
                            ? "font-semibold text-[#00646a]"
                            : "font-medium text-[#7b888b]"
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* STEP 0: Cardless Horizontal Service Menu */}
          {currentStep === 0 && (
            <div className="mx-auto max-w-[1540px]">
              {/* Subtle Category Filter Bar */}
              <div
                role="tablist"
                aria-label="Filter therapy categories"
                className="mb-8 flex flex-wrap items-center gap-2 border-b border-[#e7e4dc] pb-4"
              >
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter("all")}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    activeCategoryFilter === "all"
                      ? "bg-[#003044] text-white shadow-xs"
                      : "bg-[#f4f6f5] text-[#3c6266] hover:bg-[#e6efef] hover:text-[#003044]"
                  }`}
                >
                  All Sessions
                </button>
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setActiveCategoryFilter(pkg.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                      activeCategoryFilter === pkg.id
                        ? "bg-[#003044] text-white shadow-xs"
                        : "bg-[#f4f6f5] text-[#3c6266] hover:bg-[#e6efef] hover:text-[#003044]"
                    }`}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>

              {/* Column Header Strip */}
              <div className="mb-2 hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_130px_148px] items-center gap-6 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5c8689] sm:grid">
                <span>Package</span>
                <span>Session Details</span>
                <span>Fee</span>
                <span className="text-right">Action</span>
              </div>

              {/* Service Sections */}
              <div className="space-y-10">
                {visiblePackages.map((pkg) => (
                  <section key={pkg.id} aria-label={pkg.name}>
                    <div className="mb-1 flex items-center justify-between border-b-2 border-[#C5A253] pb-2">
                      <h2 className="text-base font-extrabold uppercase tracking-[0.12em] text-[#B89545] sm:text-lg md:text-xl">
                        {pkg.name}
                      </h2>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-[#9c8244]">
                        {pkg.sessions.length}{" "}
                        {pkg.sessions.length === 1 ? "Option" : "Options"}
                      </span>
                    </div>

                    <div className="divide-y divide-[#e6eceb]">
                      {pkg.sessions.map((session) => {
                        const price = session.indiaPrice ?? 0;
                        const packageId = `${locationTab}-${pkg.id}-${session.id}`;
                        const selected = booking.packageId === packageId;
                        const isPopular =
                          pkg.id === "psychologist-psychotherapist" &&
                          session.id === "8-session";
                        const ServiceIcon =
                          iconMap[`${pkg.id}-${session.id}`] || Sparkles;

                        return (
                          <article
                            key={packageId}
                            className={`group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 border-l-[3px] px-4 py-5 transition-all duration-200 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_130px_148px] sm:gap-6 sm:px-5 sm:py-6 ${
                              selected
                                ? "border-l-[#00646a] bg-[#f2f9f8]"
                                : "border-l-transparent bg-transparent hover:border-l-[#8fc2bc] hover:bg-[#f8fbfb]"
                            }`}
                          >
                            {/* Package Name + Icon */}
                            <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12 ${
                                  selected
                                    ? "bg-[#00646a] text-white"
                                    : "bg-[#eff6f5] text-[#4c9c90] group-hover:bg-[#e1f0ee] group-hover:text-[#00646a]"
                                }`}
                              >
                                <ServiceIcon
                                  aria-hidden="true"
                                  size={24}
                                  strokeWidth={1.6}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="break-words text-base font-semibold leading-snug text-[#003c42] transition-colors group-hover:text-[#00646a] sm:text-[17px]">
                                    {session.name}
                                  </h3>
                                  {isPopular && (
                                    <span className="inline-flex items-center rounded-full border border-[#dfc584] bg-[#fbf6ea] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9c7724]">
                                      Most Chosen
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 text-xs font-medium text-[#5c8689] sm:hidden">
                                  {pkg.name}
                                </p>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="col-span-2 row-start-2 min-w-0 break-words text-sm leading-relaxed text-[#426e72] sm:col-auto sm:row-auto">
                              {session.details}
                            </div>

                            {/* Price */}
                            <div className="col-start-2 row-start-1 whitespace-nowrap text-right sm:col-auto sm:row-auto sm:text-left">
                              <span className="text-base font-bold tabular-nums text-[#003044] sm:text-[17px]">
                                ₹{price.toLocaleString("en-IN")}
                              </span>
                              {session.count > 1 && (
                                <span className="block text-[11px] font-medium text-[#648b8e]">
                                  ₹
                                  {Math.round(
                                    price / session.count,
                                  ).toLocaleString("en-IN")}{" "}
                                  / session
                                </span>
                              )}
                            </div>

                            {/* Book Now Button */}
                            <div className="col-start-2 row-start-3 flex justify-end sm:col-auto sm:row-auto">
                              <button
                                type="button"
                                className="inline-flex min-w-[122px] items-center justify-center gap-1.5 rounded-lg bg-[#00646a] px-4 py-2.5 text-xs font-semibold tracking-wide text-white shadow-xs transition-all duration-200 hover:bg-[#004b50] hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00646a] sm:min-w-[134px]"
                                aria-label={`Book ${pkg.name}, ${session.name}`}
                                onClick={() => {
                                  updateField("packageId", packageId);
                                  updateField("locationType", locationTab);
                                  updateField("serviceType", pkg.id);
                                  updateField("sessionType", session.id);
                                  updateField("sessionCount", session.count);
                                  updateField("price", price);
                                  setCurrentStep(1);
                                  void fetchAvailability(packageId);
                                }}
                              >
                                <span>Book Now</span>
                                <ArrowRight
                                  size={14}
                                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                                />
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Date & Time */}
          {currentStep === 1 && (
            <div className="w-full max-w-none">
              {selectedPlan && (
                <aside
                  className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#b9d3d4] bg-[#f3f9f9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  aria-label="Selected plan"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Selected plan
                      </p>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(0)}
                        className="text-xs font-semibold text-[#00646a] underline underline-offset-2 hover:text-[#003044]"
                      >
                        Change package
                      </button>
                    </div>
                    <p className="mt-1 break-words font-semibold text-[#003044]">
                      {selectedPlan.serviceName} · {selectedPlan.sessionName}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {selectedPlan.details} · {selectedPlan.location}
                    </p>
                  </div>
                  <p className="shrink-0 text-xl font-bold tabular-nums text-[#003044]">
                    ₹{selectedPlan.price.toLocaleString("en-IN")}
                  </p>
                </aside>
              )}

              <section
                className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(0,48,68,0.06)] lg:h-[880px]"
                aria-labelledby="schedule-heading"
              >
                <header className="flex shrink-0 flex-col items-stretch gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-start sm:justify-between md:px-8">
                  <div>
                    <h2
                      id="schedule-heading"
                      className="text-headline-lg text-[#003044] ui-heading"
                    >
                      Date &amp; Time
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Choose a date and time that works best for you.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-micro font-semibold uppercase tracking-[0.08em] text-[#003044] transition-colors hover:border-[#7aa9aa] hover:bg-[#f5fafa] disabled:cursor-wait disabled:opacity-60 sm:self-auto sm:px-4 sm:text-xs"
                    onClick={() => void fetchAvailability()}
                    disabled={availabilityLoading}
                  >
                    {availabilityLoading ? "Checking..." : "Check Availability"}
                  </button>
                </header>

                <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                  <div className="flex min-h-0 flex-col border-b border-slate-200 p-4 sm:p-6 lg:border-b-0 lg:border-r md:p-8">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => showAdjacentMonth(-1)}
                        disabled={activeMonthIndex <= 0}
                        aria-label="Show previous available month"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl text-[#003044] transition-colors hover:border-[#7aa9aa] hover:bg-[#f0f7f7] disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:border-slate-200 disabled:hover:bg-white"
                      >
                        <span aria-hidden="true">←</span>
                      </button>
                      <div className="min-w-0 text-center">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          1. Select date
                        </p>
                        <div
                          className="flex items-center justify-center gap-2"
                          aria-label="Calendar month and year"
                        >
                          <label className="sr-only" htmlFor="booking-month">
                            Month
                          </label>
                          <select
                            id="booking-month"
                            value={activeMonth}
                            onChange={(event) => showMonth(event.target.value)}
                            className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-semibold text-[#003044] outline-none focus:border-[#4f898c] focus:ring-2 focus:ring-[#4f898c]/20 sm:px-3 sm:text-base"
                          >
                            {availableMonths.map((key) => (
                              <option key={key} value={key.slice(5, 7)}>
                                {new Intl.DateTimeFormat("en-IN", {
                                  month: "long",
                                }).format(parseDateKey(`${key}-01`))}
                              </option>
                            ))}
                          </select>
                          <label className="sr-only" htmlFor="booking-year">
                            Year
                          </label>
                          <select
                            id="booking-year"
                            value={activeYear}
                            onChange={(event) => showYear(event.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-semibold text-[#003044] outline-none focus:border-[#4f898c] focus:ring-2 focus:ring-[#4f898c]/20 sm:px-3 sm:text-base"
                          >
                            {availableYears.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => showAdjacentMonth(1)}
                        disabled={
                          activeMonthIndex < 0 ||
                          activeMonthIndex >= availableMonthKeys.length - 1
                        }
                        aria-label="Show next available month"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl text-[#003044] transition-colors hover:border-[#7aa9aa] hover:bg-[#f0f7f7] disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:border-slate-200 disabled:hover:bg-white"
                      >
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>

                    <div className="mb-4 flex justify-center sm:justify-end">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f4f8f8] px-3 py-1.5 text-xs font-medium text-slate-600">
                        <Globe size={13} className="text-[#00646a]" />
                        {BOOKING_TIMEZONE}
                      </span>
                    </div>

                    {availabilityLoading ? (
                      <div
                        className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500"
                        role="status"
                      >
                        Loading available dates…
                      </div>
                    ) : availabilityError ? (
                      <div
                        className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 px-6 text-center text-sm text-red-700"
                        role="alert"
                      >
                        {availabilityError}
                      </div>
                    ) : calendarDays.length > 0 ? (
                      <div
                        role="grid"
                        aria-label={`Availability calendar for ${monthLabel}`}
                      >
                        <div role="row" className="mb-2 grid grid-cols-7">
                          {calendarWeekdays.map((weekday) => (
                            <div
                              key={weekday}
                              role="columnheader"
                              className="py-2 text-center text-micro font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-xs"
                            >
                              {weekday}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                          {calendarDays.map((day) => {
                            const dateAvailability = availabilityByDate.get(
                              day.dateKey,
                            );
                            const isAvailable =
                              day.isCurrentMonth &&
                              Boolean(dateAvailability?.isAvailable);
                            const isActive =
                              day.dateKey === activeDateData?.date;
                            const isToday = day.dateKey === todayKey;

                            return (
                              <div
                                key={day.dateKey}
                                role="gridcell"
                                className="aspect-square min-w-0"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    selectCalendarDate(day.dateKey)
                                  }
                                  disabled={!isAvailable}
                                  aria-label={`${formatSelectedDate(day.dateKey)}${isToday ? ", today" : ""}${isAvailable ? ", available" : ", unavailable"}`}
                                  aria-pressed={isActive}
                                  className={`relative flex h-full w-full items-center justify-center rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003044] focus-visible:ring-offset-2 sm:rounded-xl sm:text-base ${
                                    isActive
                                      ? "border-[#003044] bg-[#003044] text-white shadow-sm"
                                      : isAvailable
                                        ? "border-slate-200 bg-white text-[#163d48] hover:border-[#4f898c] hover:bg-[#f3f9f9]"
                                        : day.isCurrentMonth
                                          ? "cursor-not-allowed border-transparent bg-slate-50 text-slate-300"
                                          : "cursor-not-allowed border-transparent bg-transparent text-slate-200"
                                  }`}
                                >
                                  {day.date.getDate()}
                                  {isToday && (
                                    <span
                                      className={`absolute bottom-1 h-1 w-1 rounded-full ${isActive ? "bg-white" : "bg-[#4f898c]"}`}
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500">
                        No upcoming dates are currently available.
                      </div>
                    )}
                    {errors.selectedDate && (
                      <p className="mt-3 text-sm text-red-600">
                        {errors.selectedDate}
                      </p>
                    )}
                  </div>

                  <div className="flex min-h-0 flex-col bg-[#fbfdfd] p-4 sm:p-6 md:p-8">
                    <div className="mb-4 shrink-0">
                      <p className="text-xl font-semibold text-[#003044] sm:text-2xl">
                        {customRequestOnly && preferredDate
                          ? formatSelectedDate(preferredDate)
                          : booking.selectedDate
                            ? formatSelectedDate(booking.selectedDate)
                            : "Select a date to see available times"}
                      </p>
                      <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                        2. Select a Time
                      </h3>
                    </div>

                    <div
                      id="available-time-slots"
                      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1"
                    >
                      {[
                        {
                          category: "online_session" as const,
                          title: "Online Sessions (Online Only)",
                          slots: onlineSlots,
                        },
                        {
                          category: "offline_session" as const,
                          title: "Offline Sessions (Clinic Only)",
                          slots: offlineSlots,
                        },
                      ].map(({ category, title, slots }) => (
                        <section
                          key={category}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <h4 className="mb-3 font-semibold text-[#003044]">
                            {title}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {slots.length ? (
                              slots.map((slot) => {
                                const active =
                                  booking.selectedDate ===
                                    activeDateData?.date &&
                                  booking.selectedTime === slot.time &&
                                  booking.sessionCategory === category;
                                const isUnavailable =
                                  slot.status !== "available";
                                return (
                                  <button
                                    type="button"
                                    key={`${activeDateData?.date}-${slot.time}`}
                                    aria-pressed={active}
                                    disabled={!activeDateData || isUnavailable}
                                    aria-label={`${slot.label}${isUnavailable ? `, ${slot.status}` : ", available"}`}
                                    onClick={() => {
                                      if (!activeDateData) return;
                                      setCustomRequestOnly(false);
                                      const mode =
                                        category === "online_session"
                                          ? "Online"
                                          : "Offline";
                                      updateField(
                                        "selectedDate",
                                        activeDateData.date,
                                      );
                                      updateField("selectedTime", slot.time);
                                      updateField("sessionCategory", category);
                                      updateField("sessionType", mode);
                                      updateField("sessionMode", mode);
                                    }}
                                    className={`rounded-lg border px-3 py-3 text-center text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                                      active
                                        ? "border-[#003044] bg-[#003044] text-white"
                                        : isUnavailable
                                          ? "border-slate-200 bg-slate-100 text-slate-400"
                                          : "border-slate-200 bg-white text-[#163d48] hover:border-[#4f898c] hover:bg-[#f3f9f9]"
                                    }`}
                                  >
                                    {slot.label}
                                    {isUnavailable ? ` · ${slot.status}` : ""}
                                  </button>
                                );
                              })
                            ) : (
                              <p className="col-span-2 rounded-lg bg-slate-50 p-3 text-center text-sm text-slate-500">
                                {booking.selectedDate
                                  ? "No times available for this date."
                                  : "Choose a date to see availability."}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            className="mt-3 w-full rounded-lg border border-[#7aa9aa] px-4 py-2.5 text-sm font-semibold text-[#003044] transition-colors hover:bg-[#f3f9f9]"
                            onClick={() => {
                              setCustomRequestId("");
                              setCustomPreferenceCategory(category);
                              setCustomTimeOpen(true);
                            }}
                          >
                            Request a Custom Time
                          </button>
                        </section>
                      ))}

                      {customPreferenceEnabled && (
                        <div className="space-y-3 rounded-xl border border-[#b9d3d4] bg-[#f4f9f9] p-4">
                          <p className="text-sm font-semibold text-[#003044]">
                            Preferred Time{" "}
                            <span className="font-normal text-slate-500">
                              (Optional)
                            </span>
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label
                              className="text-sm text-slate-700"
                              htmlFor="preferred-date"
                            >
                              Preferred date
                              <input
                                id="preferred-date"
                                type="date"
                                min={todayKey}
                                value={preferredDate}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setCustomRequestId("");
                                  setPreferredDate(value);
                                  setErrors((current) => ({
                                    ...current,
                                    preferredDate: "",
                                  }));
                                  updateField(
                                    "preferredTime",
                                    [
                                      value && `Date: ${value}`,
                                      preferredTimeOfDay &&
                                        `Time: ${preferredTimeOfDay} (${BOOKING_TIMEZONE})`,
                                    ]
                                      .filter(Boolean)
                                      .join(" · "),
                                  );
                                }}
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
                              />
                              {errors.preferredDate && (
                                <span className="mt-1 block text-xs text-red-600">
                                  {errors.preferredDate}
                                </span>
                              )}
                            </label>
                            <label
                              className="text-sm text-slate-700"
                              htmlFor="preferred-time"
                            >
                              Preferred time (IST)
                              <input
                                id="preferred-time"
                                type="time"
                                min="10:00"
                                max="18:00"
                                value={preferredTimeOfDay}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setCustomRequestId("");
                                  setPreferredTimeOfDay(value);
                                  setErrors((current) => ({
                                    ...current,
                                    preferredTime: "",
                                  }));
                                  updateField(
                                    "preferredTime",
                                    [
                                      preferredDate &&
                                        `Date: ${preferredDate}`,
                                      value &&
                                        `Time: ${value} (${BOOKING_TIMEZONE})`,
                                    ]
                                      .filter(Boolean)
                                      .join(" · "),
                                  );
                                }}
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
                              />
                              {errors.preferredTime && (
                                <span className="mt-1 block text-xs text-red-600">
                                  {errors.preferredTime}
                                </span>
                              )}
                            </label>
                          </div>
                          <p className="text-xs leading-5 text-slate-600">
                            This is a preference request only. It will not
                            reserve a calendar slot and requires admin or
                            therapist approval.
                          </p>
                        </div>
                      )}
                    </div>
                    {(errors.selectedTime || errors.sessionType) &&
                      !customRequestOnly && (
                        <p className="mt-3 text-sm text-red-600">
                          {errors.selectedTime || errors.sessionType}
                        </p>
                      )}

                    {booking.selectedTime && (
                      <div
                        className="mt-4 shrink-0 rounded-xl border border-slate-200 bg-[#f8fbfb] p-3.5"
                        aria-live="polite"
                      >
                        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Selected appointment
                        </p>
                        <dl className="space-y-2 text-sm">
                          <div className="flex items-start justify-between gap-4">
                            <dt className="text-slate-500">Selected Date</dt>
                            <dd className="text-right font-semibold text-[#003044]">
                              {formatSelectedDate(booking.selectedDate)}
                            </dd>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <dt className="text-slate-500">Selected Time</dt>
                            <dd className="text-right font-semibold text-[#003044]">
                              {booking.selectedTime || "Not selected"}
                            </dd>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <dt className="text-slate-500">Timezone</dt>
                            <dd className="text-right font-semibold text-[#003044]">
                              {BOOKING_TIMEZONE}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={previousStep}
                        className="btn-primary bg-[#f4f4f3] text-[#003044] hover:bg-[#e5e8ea]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn-primary flex-1"
                        onClick={nextStep}
                      >
                        Continue
                      </button>
                    </div>
                    <p className="mt-3 text-center text-xs text-slate-500">
                      {customRequestOnly
                        ? "Your custom-time request will be sent for manual review without reserving a slot or starting payment."
                        : "Preferred Time is optional and does not replace your appointment slot. Choose one of the available standard times above to continue."}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 2: Booking Form */}
          {currentStep === 2 && (
            <div className="mx-auto max-w-[1040px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(0,48,68,0.05)] md:p-8">
              <h2 className="text-headline-lg mb-6 ui-heading">Booking Form</h2>
              <MotionSection
                className="mb-8 rounded-xl border border-slate-200 bg-[#f8fbfb] p-5 md:p-6"
                aria-labelledby="therapist-introduction"
              >
                <div className="mb-4">
                  <p className="text-label-md uppercase tracking-[0.12em] text-[#506356]">
                    Meet your therapist
                  </p>
                  <h3
                    id="therapist-introduction"
                    className="mt-1 text-headline-lg ui-heading"
                  >
                    Therapy by Nidhi
                  </h3>
                </div>

                <div className="whitespace-pre-line text-body-md ui-copy">
                  {THERAPY_CONTENT.meetYourTherapist}
                </div>
              </MotionSection>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-label-md ui-copy mb-2 block">
                    First Name
                  </label>
                  <input
                    className="ghost-input"
                    value={booking.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                  {errors.firstName && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-label-md ui-copy mb-2 block">
                    Last Name
                  </label>
                  <input
                    className="ghost-input"
                    value={booking.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                  {errors.lastName && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-label-md ui-copy mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    className="ghost-input"
                    value={booking.email}
                    onChange={(e) => {
                      updateField("email", e.target.value);
                      setPrefillMessage("");
                    }}
                  />
                  {errors.email && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="-mt-3 md:col-span-2" aria-live="polite">
                  {prefillLoading && (
                    <p className="text-sm text-slate-500">
                      Checking for your previous details…
                    </p>
                  )}
                  {!prefillLoading && prefillMessage && (
                    <p className="text-sm text-teal-700">{prefillMessage}</p>
                  )}
                  {!isEmailValid && booking.email && (
                    <p className="text-sm text-slate-500">
                      Enter a valid email address to continue.
                    </p>
                  )}
                </div>

                {isEmailValid && (
                  <>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        Phone/WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        className="ghost-input"
                        value={booking.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                      />
                      {errors.phone && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        Gender
                      </label>
                      <select
                        className="ghost-input"
                        value={booking.identifyYourGender}
                        onChange={(e) =>
                          updateField("identifyYourGender", e.target.value)
                        }
                      >
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-Binary</option>
                        <option>Transgender</option>
                        <option>Prefer not to say</option>
                        <option>Other</option>
                      </select>
                      {errors.identifyYourGender && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.identifyYourGender}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        max={getTodayKey()}
                        className="ghost-input"
                        value={booking.dob}
                        onChange={(e) => updateField("dob", e.target.value)}
                      />
                      {errors.dob && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.dob}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        Location
                      </label>
                      <input
                        className="ghost-input"
                        value={booking.location}
                        onChange={(e) =>
                          updateField("location", e.target.value)
                        }
                      />
                      {errors.location && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.location}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        Appointment Category
                      </label>
                      <p className="ghost-input">
                        {booking.sessionCategory === "offline_session"
                          ? "Offline Sessions (Clinic Only)"
                          : "Online Sessions (Online Only)"}
                      </p>
                      {errors.sessionMode && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.sessionMode}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        Relationship Status
                      </label>
                      <select
                        className="ghost-input"
                        value={booking.relationShipStatus}
                        onChange={(e) =>
                          updateField("relationShipStatus", e.target.value)
                        }
                      >
                        <option value="">Select status</option>
                        <option>Single</option>
                        <option>In a relationship</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                        <option>Other</option>
                      </select>
                      {errors.relationShipStatus && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.relationShipStatus}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        Occupation{" "}
                        <span className="text-slate-500">(optional)</span>
                      </label>
                      <input
                        className="ghost-input"
                        value={booking.occupation}
                        onChange={(e) =>
                          updateField("occupation", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        Number of Children
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="ghost-input"
                        value={booking.numberOfChildren}
                        onChange={(e) =>
                          updateField(
                            "numberOfChildren",
                            Number(e.target.value),
                          )
                        }
                      />
                      {errors.numberOfChildren && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.numberOfChildren}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-label-md ui-copy mb-2 block">
                        How did you hear about us?
                      </label>
                      <select
                        className="ghost-input"
                        value={booking.whereuknowaboutus}
                        onChange={(e) =>
                          updateField("whereuknowaboutus", e.target.value)
                        }
                      >
                        <option value="">Select an option</option>
                        <option>Social Media</option>
                        <option>Instagram</option>
                        <option>Facebook</option>
                        <option>YouTube</option>
                        <option>Twitter/X</option>
                        <option>LinkedIn</option>
                        <option>Friend/Family</option>
                        <option>Doctor/Therapist Referral</option>
                        <option>Existing Client</option>
                        <option>Search Engine</option>
                        <option>Google Search</option>
                        <option>Website/Blog</option>
                        <option>Workshop/Event</option>
                        <option>Advertisement</option>
                        <option>Other</option>
                      </select>
                      {errors.whereuknowaboutus && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.whereuknowaboutus}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-label-md ui-copy mb-2 block">
                        Therapy Goals
                      </label>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {therapyGoalOptions.map((goal) => (
                          <label
                            key={goal}
                            className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-[#fbfdfd] p-2.5 text-sm ui-copy transition-colors hover:border-slate-200"
                          >
                            <input
                              type="checkbox"
                              className="mt-0.5 accent-[#00646a]"
                              checked={booking.therapyGoals.includes(goal)}
                              onChange={(e) =>
                                updateField(
                                  "therapyGoals",
                                  e.target.checked
                                    ? [...booking.therapyGoals, goal]
                                    : booking.therapyGoals.filter(
                                        (item) => item !== goal,
                                      ),
                                )
                              }
                            />{" "}
                            <span>{goal}</span>
                          </label>
                        ))}
                      </div>
                      {errors.therapyGoals && (
                        <div className="mt-1 text-sm text-red-600">
                          {errors.therapyGoals}
                        </div>
                      )}
                    </div>

                    {booking.therapyGoals.includes("Other") && (
                      <div className="md:col-span-2">
                        <label className="text-label-md ui-copy mb-2 block">
                          Other Therapy Goal
                        </label>
                        <input
                          className="ghost-input"
                          value={booking.therapyGoalsOther}
                          onChange={(e) =>
                            updateField("therapyGoalsOther", e.target.value)
                          }
                        />
                        {errors.therapyGoalsOther && (
                          <div className="mt-1 text-sm text-red-600">
                            {errors.therapyGoalsOther}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm ui-copy">
                        <input
                          type="checkbox"
                          className="accent-[#00646a]"
                          checked={
                            booking.currentlyTakingAnyPsychiatricMedication
                          }
                          onChange={(e) =>
                            updateField(
                              "currentlyTakingAnyPsychiatricMedication",
                              e.target.checked,
                            )
                          }
                        />{" "}
                        Currently taking psychiatric medication
                      </label>
                    </div>

                    {booking.currentlyTakingAnyPsychiatricMedication && (
                      <div className="md:col-span-2">
                        <label className="text-label-md ui-copy mb-2 block">
                          Medication Details
                        </label>
                        <textarea
                          className="ghost-input min-h-24"
                          value={booking.medicationDetails}
                          onChange={(e) =>
                            updateField("medicationDetails", e.target.value)
                          }
                        />
                        {errors.medicationDetails && (
                          <div className="mt-1 text-sm text-red-600">
                            {errors.medicationDetails}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-label-md ui-copy mb-2 block">
                        Additional Notes{" "}
                        <span className="text-slate-500">(optional)</span>
                      </label>
                      <textarea
                        className="ghost-input min-h-24"
                        value={booking.addNotes}
                        onChange={(e) =>
                          updateField("addNotes", e.target.value)
                        }
                        placeholder="Add any additional notes here..."
                      />
                    </div>
                    <div className="space-y-4 border-t border-slate-200 pt-5 md:col-span-2">
                      <h3 className="text-headline-md ui-heading">
                        Informed Consent
                      </h3>
                      <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-[#fafcfc] p-4 whitespace-pre-line text-body-md ui-copy">
                        {THERAPY_CONTENT.informedConsent}
                      </div>
                      <label className="flex items-start gap-2.5 text-sm ui-copy">
                        <input
                          type="checkbox"
                          className="mt-0.5 accent-[#00646a]"
                          checked={booking.informedConsent === "I agree"}
                          onChange={(e) => {
                            const value = e.target.checked ? "I agree" : "";
                            updateField("informedConsent", value);
                            updateField(
                              "InformedConsentforTherapySessions",
                              value,
                            );
                          }}
                        />
                        <span>
                          I agree to the informed consent for therapy sessions.
                        </span>
                      </label>
                      {errors.InformedConsentforTherapySessions && (
                        <div className="text-sm text-red-600">
                          {errors.InformedConsentforTherapySessions}
                        </div>
                      )}
                      <label className="flex items-start gap-2.5 text-sm ui-copy">
                        <input
                          type="checkbox"
                          className="mt-0.5 accent-[#00646a]"
                          checked={booking.conformationOfBooking}
                          onChange={(e) =>
                            updateField(
                              "conformationOfBooking",
                              e.target.checked,
                            )
                          }
                        />
                        <span>
                          I have read and understood the above information and
                          agree to proceed with the therapy.
                        </span>
                      </label>
                      {errors.conformationOfBooking && (
                        <div className="text-sm text-red-600">
                          {errors.conformationOfBooking}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={previousStep}
                  className="btn-primary bg-[#f4f4f3] text-[#003044] hover:bg-[#e5e8ea]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {currentStep === 3 && (
            <div className="mx-auto max-w-[920px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(0,48,68,0.05)] md:p-8">
              <h2 className="text-headline-lg mb-6 ui-heading">
                {customRequestOnly ? "Submit Custom Time Request" : "Payment"}
              </h2>
              {customRequestOnly ? (
                <div className="mb-6 rounded-xl border border-[#c9dfe0] bg-[#f4f9f9] p-5 text-sm leading-6 text-[#254b55]">
                  <p>
                    <strong>Requested appointment:</strong>{" "}
                    {formatSelectedDate(preferredDate)} at {preferredTimeOfDay}{" "}
                    IST
                  </p>
                  <p className="mt-3">
                    This request will be sent for Pending Manual Review. It will
                    not reserve a calendar slot, confirm an appointment, or
                    initiate payment. An admin or therapist will check
                    availability and contact you.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 rounded-xl border border-[#c9dfe0] bg-[#f4f9f9] p-5 text-sm leading-6 text-[#254b55]">
                    <p>
                      <strong>Selected appointment:</strong>{" "}
                      {booking.selectedDate} at {booking.selectedTime} IST ·{" "}
                      {booking.sessionCategory === "offline_session"
                        ? "Offline Sessions (Clinic Only)"
                        : "Online Sessions (Online Only)"}
                    </p>
                    <p className="mt-3">
                      Please select your preferred appointment slot from the
                      available timings.
                    </p>
                    <p>
                      Each session is approximately 60 minutes. A 30-minute
                      buffer is maintained between appointments to allow
                      adequate time between sessions.
                    </p>
                    <p>
                      If your preferred day or time is not listed, use “Select
                      Custom Time” to request it for manual review.
                    </p>
                    <p>
                      Your appointment will be confirmed once the booking and
                      payment process is completed.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <button
                      type="button"
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        booking.paymentMethod === "cash"
                          ? "border-[#00646a] bg-[#eef7f6] shadow-xs"
                          : "border-slate-200 bg-[#f9fafb] hover:border-slate-300"
                      }`}
                      onClick={() => updateField("paymentMethod", "cash")}
                    >
                      <div className="text-label-md font-bold uppercase tracking-[0.12em] text-[#003044]">
                        Cash
                      </div>
                      <div className="mt-2 text-body-lg text-slate-600">
                        Pay in person / manual booking
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        booking.paymentMethod === "online"
                          ? "border-[#00646a] bg-[#eef7f6] shadow-xs"
                          : "border-slate-200 bg-[#f9fafb] hover:border-slate-300"
                      }`}
                      onClick={() => updateField("paymentMethod", "online")}
                    >
                      <div className="text-label-md font-bold uppercase tracking-[0.12em] text-[#003044]">
                        Online Payment
                      </div>
                      <div className="mt-2 text-body-lg text-slate-600">
                        Secure Razorpay checkout
                      </div>
                    </button>
                  </div>
                </>
              )}

              {errors.submit && (
                <div className="mt-4 text-sm text-red-600">{errors.submit}</div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={previousStep}
                  className="btn-primary bg-[#f4f4f3] text-[#003044] hover:bg-[#e5e8ea]"
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={
                    customRequestOnly
                      ? handleCustomTimeRequest
                      : booking.paymentMethod === "cash"
                        ? handleCashBooking
                        : handleOnlinePayment
                  }
                  disabled={isSubmitting || paymentProcessing}
                >
                  {customRequestOnly
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit Request"
                    : booking.paymentMethod === "cash"
                      ? isSubmitting
                        ? "Processing..."
                        : "Confirm Booking"
                      : paymentProcessing
                        ? "Processing Payment..."
                        : "Pay Now"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {currentStep === 4 && confirmation && (
            <div className="mx-auto max-w-[840px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(0,48,68,0.05)] md:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7f6] text-[#00646a]">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-headline-lg ui-heading">
                  {confirmation.bookingStatus === "manual_review"
                    ? "Custom Time Request Received"
                    : confirmation.bookingStatus === "Pending"
                      ? "Booking Request Received"
                      : "Booking Confirmed"}
                </h2>
                {confirmation.bookingStatus === "manual_review" ? (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Your request is Pending Manual Review. No calendar slot was
                    reserved and no payment was initiated. Our admin or
                    therapist will check availability and contact you.
                  </p>
                ) : (
                  confirmation.bookingStatus === "Pending" && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Your request is pending payment confirmation. The
                      appointment is not confirmed yet.
                    </p>
                  )
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-[#fafcfc] p-5 text-body-md ui-copy md:grid-cols-2">
                <div>
                  <strong>Booking ID:</strong>{" "}
                  {confirmation.bookingId || confirmation._id}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {confirmation.bookingStatus === "manual_review"
                    ? "Pending Manual Review"
                    : confirmation.bookingStatus || "Confirmed"}
                </div>
                <div>
                  <strong>Package:</strong>{" "}
                  {confirmation.packageName || selectedPackageName}
                </div>
                <div>
                  <strong>Session Type:</strong>{" "}
                  {confirmation.sessionType || booking.sessionType}
                </div>
                <div>
                  <strong>
                    {confirmation.bookingStatus === "manual_review"
                      ? "Requested Date:"
                      : "Date:"}
                  </strong>{" "}
                  {confirmation.selectedDate || booking.selectedDate}
                </div>
                <div>
                  <strong>
                    {confirmation.bookingStatus === "manual_review"
                      ? "Requested Time:"
                      : "Time:"}
                  </strong>{" "}
                  {confirmation.selectedTime || booking.selectedTime}
                </div>
                <div>
                  <strong>Customer:</strong>{" "}
                  {confirmation.firstName || booking.firstName}{" "}
                  {confirmation.lastName || booking.lastName}
                </div>
                <div>
                  <strong>Payment Method:</strong>{" "}
                  {confirmation.paymentMethod || booking.paymentMethod}
                </div>
                <div>
                  <strong>Payment Status:</strong>{" "}
                  {confirmation.paymentStatus || "Pending"}
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/" className="btn-primary">
                  Return Home
                </Link>
                <Link
                  href={
                    typeof window !== "undefined" &&
                    document.cookie.includes("accessToken=")
                      ? "/my-bookings"
                      : "/login?redirect=/my-bookings"
                  }
                  className="btn-primary bg-[#f4f4f3] text-[#003044] hover:bg-[#e5e8ea]"
                >
                  View My Booking
                </Link>
              </div>
            </div>
          )}
        </MotionReveal>
      </main>

      {customTimeOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-time-confirmation-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2
              id="custom-time-confirmation-title"
              className="text-xl font-semibold text-[#003044]"
            >
              Select Custom Time
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              Your preferred time is subject to availability and requires
              approval from our admin or therapist. Your appointment will only
              be confirmed after approval and completion of the booking and
              payment process.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCustomTimeOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setCustomTimeOpen(false);
                  setCustomPreferenceEnabled(true);
                  setCustomRequestOnly(true);
                  const sessionType =
                    customPreferenceCategory === "offline_session"
                      ? "Offline"
                      : "Online";
                  setBooking((current) => ({
                    ...current,
                    selectedDate: "",
                    selectedTime: "",
                    sessionCategory: customPreferenceCategory,
                    sessionType,
                    sessionMode: sessionType,
                  }));
                }}
              >
                Yes, Select Custom Time
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}