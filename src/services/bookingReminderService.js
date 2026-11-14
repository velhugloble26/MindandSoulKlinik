import { randomUUID } from "node:crypto";
import { Booking } from "../schema/schema.js";
import emailServices from "../utils/common/emailServices.js";
import {
  formatDateKeyInTimezone,
  SCHEDULING_TIMEZONE,
  validateDateKey,
} from "./availabilityServices.js";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const IST_OFFSET_MINUTES = 5 * 60 + 30;
const CLAIM_LEASE_MILLISECONDS = 15 * 60 * 1000;
const ACTIVE_SESSION_STATUSES = new Set(["scheduled", "confirmed"]);

function addDaysToDateKey(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));
  return date.toISOString().slice(0, 10);
}

function parseTime(value) {
  const normalized = String(value || "").trim();
  const twentyFourHour = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHour) {
    return Number(twentyFourHour[1]) * 60 + Number(twentyFourHour[2]);
  }

  const twelveHour = normalized.match(/^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/i);
  if (!twelveHour) return null;

  const hour = Number(twelveHour[1]);
  if (hour < 1 || hour > 12) return null;
  return (
    (hour % 12 + (twelveHour[3].toUpperCase() === "PM" ? 12 : 0)) * 60 +
    Number(twelveHour[2])
  );
}

export function getAppointmentDateTime(date, time, timezone = SCHEDULING_TIMEZONE) {
  if (timezone !== SCHEDULING_TIMEZONE || !validateDateKey(date)) return null;
  const minutes = parseTime(time);
  if (minutes === null) return null;

  const [year, month, day] = date.split("-").map(Number);
  const appointment = new Date(
    Date.UTC(year, month - 1, day, 0, minutes) -
      IST_OFFSET_MINUTES * 60 * 1000,
  );
  return Number.isNaN(appointment.getTime()) ? null : appointment;
}

export function getBookingSessions(booking) {
  if (Array.isArray(booking.sessions) && booking.sessions.length > 0) {
    return booking.sessions.map((session) => ({
      sessionNumber: Number(session.sessionNumber),
      date: session.date,
      time: session.time,
      sessionType: session.sessionType,
      status: session.status || "scheduled",
      updatedAt: session.updatedAt,
    }));
  }

  return [
    {
      sessionNumber: 0,
      date: booking.selectedDate,
      time: booking.selectedTime,
      sessionType: booking.sessionType,
      status: "confirmed",
      updatedAt: null,
    },
  ];
}

function getLastScheduleChange(booking, session) {
  const timestamps = [booking.created_at, session.updatedAt]
    .map((value) => (value ? new Date(value).getTime() : Number.NaN))
    .filter(Number.isFinite);
  return timestamps.length > 0 ? Math.max(...timestamps) : null;
}

export function getDueReminderTypes(booking, session, now = new Date()) {
  if (booking.bookingStatus !== "confirmed") return [];
  if (!ACTIVE_SESSION_STATUSES.has(session.status)) return [];
  if (
    !Number.isInteger(session.sessionNumber) ||
    session.sessionNumber < 0 ||
    !String(booking.email || "").trim()
  ) {
    return [];
  }

  const appointmentAt = getAppointmentDateTime(
    session.date,
    session.time,
    booking.timezone || SCHEDULING_TIMEZONE,
  );
  if (!appointmentAt || appointmentAt <= now) return [];

  const appointmentDayAt = getAppointmentDateTime(
    session.date,
    "05:00",
    booking.timezone || SCHEDULING_TIMEZONE,
  );
  if (!appointmentDayAt) return [];

  const dueTimes = [
    {
      type: "24_hours",
      dueAt: new Date(appointmentAt.getTime() - DAY_IN_MILLISECONDS),
    },
    { type: "appointment_day", dueAt: appointmentDayAt },
  ];
  const lastScheduleChange = getLastScheduleChange(booking, session);

  return dueTimes
    .filter(
      ({ dueAt }) =>
        dueAt <= now &&
        (lastScheduleChange === null || lastScheduleChange <= dueAt),
    )
    .map(({ type }) => type);
}

function getReminderKey(session, reminderType) {
  return {
    sessionNumber: session.sessionNumber,
    appointmentDate: session.date,
    appointmentTime: session.time,
    reminderType,
  };
}

async function releaseExpiredClaim(bookingModel, bookingId, key, now) {
  const cutoff = new Date(now.getTime() - CLAIM_LEASE_MILLISECONDS);
  await bookingModel.updateOne(
    {
      _id: bookingId,
      reminderTracking: {
        $elemMatch: {
          ...key,
          status: "sending",
          claimedAt: { $lte: cutoff },
        },
      },
    },
    {
      $set: {
        "reminderTracking.$.status": "failed",
        "reminderTracking.$.claimId": "",
        "reminderTracking.$.claimedAt": null,
        "reminderTracking.$.lastError": "Reminder claim expired before completion.",
      },
    },
  );
}

async function claimReminder(bookingModel, bookingId, key, now) {
  await releaseExpiredClaim(bookingModel, bookingId, key, now);
  const claimId = randomUUID();
  const failedReminderFilter = {
    _id: bookingId,
    bookingStatus: "confirmed",
    reminderTracking: {
      $elemMatch: { ...key, status: "failed" },
    },
    $nor: [
      {
        reminderTracking: {
          $elemMatch: { ...key, status: "sent" },
        },
      },
    ],
  };
  const reusedClaim = await bookingModel.findOneAndUpdate(
    failedReminderFilter,
    {
      $set: {
        "reminderTracking.$.status": "sending",
        "reminderTracking.$.claimId": claimId,
        "reminderTracking.$.claimedAt": now,
        "reminderTracking.$.lastError": "",
      },
      $inc: { "reminderTracking.$.attempts": 1 },
    },
    { new: true },
  );
  if (reusedClaim) return claimId;

  const activeReminderFilter = {
    _id: bookingId,
    bookingStatus: "confirmed",
    $nor: [
      {
        reminderTracking: {
          $elemMatch: {
            ...key,
            status: { $in: ["sending", "sent"] },
          },
        },
      },
    ],
  };
  const claimed = await bookingModel.findOneAndUpdate(
    activeReminderFilter,
    {
      $push: {
        reminderTracking: {
          ...key,
          status: "sending",
          claimId,
          claimedAt: now,
          attempts: 1,
        },
      },
    },
    { new: true },
  );

  return claimed ? claimId : null;
}

async function markClaimFailed(bookingModel, bookingId, claimId, error) {
  await bookingModel.updateOne(
    {
      _id: bookingId,
      "reminderTracking.claimId": claimId,
    },
    {
      $set: {
        "reminderTracking.$.status": "failed",
        "reminderTracking.$.claimId": "",
        "reminderTracking.$.claimedAt": null,
        "reminderTracking.$.lastError": String(
          error instanceof Error ? error.message : error,
        ).slice(0, 1000),
      },
    },
  );
}

async function markClaimSent(bookingModel, bookingId, claimId, sentAt) {
  const result = await bookingModel.updateOne(
    {
      _id: bookingId,
      "reminderTracking.claimId": claimId,
    },
    {
      $set: {
        "reminderTracking.$.status": "sent",
        "reminderTracking.$.claimedAt": null,
        "reminderTracking.$.sentAt": sentAt,
        "reminderTracking.$.lastError": "",
      },
    },
  );
  if (result.modifiedCount !== 1) {
    throw new Error("Reminder email was sent but its delivery state was not saved.");
  }
}

function findCurrentSession(booking, sessionNumber) {
  return getBookingSessions(booking).find(
    (session) => session.sessionNumber === sessionNumber,
  );
}

function isSameActiveAppointment(booking, session) {
  if (booking?.bookingStatus !== "confirmed") return false;
  const currentSession = findCurrentSession(booking, session.sessionNumber);
  return (
    currentSession &&
    ACTIVE_SESSION_STATUSES.has(currentSession.status) &&
    currentSession.date === session.date &&
    currentSession.time === session.time &&
    (booking.timezone || SCHEDULING_TIMEZONE) === SCHEDULING_TIMEZONE
  );
}

function getCandidateDateRange(now) {
  const today = formatDateKeyInTimezone(now, SCHEDULING_TIMEZONE);
  return { startDate: today, endDate: addDaysToDateKey(today, 1) };
}

async function findCurrentBooking(bookingModel, bookingId) {
  return bookingModel.findOne({ _id: bookingId }).lean();
}

export async function runBookingReminderSweep({
  bookingModel = Booking,
  emailService = emailServices,
  now = new Date(),
} = {}) {
  const { startDate, endDate } = getCandidateDateRange(now);
  const bookings = await bookingModel
    .find({
      bookingStatus: "confirmed",
      $or: [
        { selectedDate: { $gte: startDate, $lte: endDate } },
        { "sessions.date": { $gte: startDate, $lte: endDate } },
      ],
    })
    .lean();

  const summary = {
    scannedBookings: bookings.length,
    sent: 0,
    failed: 0,
    skipped: 0,
    invalid: 0,
  };

  for (const booking of bookings) {
    for (const session of getBookingSessions(booking)) {
      const appointmentAt = getAppointmentDateTime(
        session.date,
        session.time,
        booking.timezone || SCHEDULING_TIMEZONE,
      );
      if (
        !appointmentAt ||
        !Number.isInteger(session.sessionNumber) ||
        !String(booking.email || "").trim()
      ) {
        summary.invalid += 1;
        console.warn("BOOKING_REMINDER_INVALID_APPOINTMENT", {
          bookingId: booking.bookingId,
          sessionNumber: session.sessionNumber,
        });
        continue;
      }

      const dueReminderTypes = getDueReminderTypes(booking, session, now);
      for (const reminderType of dueReminderTypes) {
        const key = getReminderKey(session, reminderType);
        let claimId;
        try {
          claimId = await claimReminder(
            bookingModel,
            booking._id,
            key,
            now,
          );
        } catch (error) {
          summary.failed += 1;
          console.error("BOOKING_REMINDER_CLAIM_ERROR:", {
            bookingId: booking.bookingId,
            sessionNumber: session.sessionNumber,
            reminderType,
            error,
          });
          continue;
        }

        if (!claimId) {
          summary.skipped += 1;
          continue;
        }

        try {
          const currentBooking = await findCurrentBooking(
            bookingModel,
            booking._id,
          );
          if (!isSameActiveAppointment(currentBooking, session)) {
            await markClaimFailed(
              bookingModel,
              booking._id,
              claimId,
              "Appointment was changed or is no longer active.",
            );
            summary.skipped += 1;
            continue;
          }

          await emailService.sendBookingReminder({
            booking: currentBooking,
            session,
            reminderType,
          });
        } catch (error) {
          summary.failed += 1;
          try {
            await markClaimFailed(
              bookingModel,
              booking._id,
              claimId,
              error,
            );
          } catch (stateError) {
            console.error("BOOKING_REMINDER_STATE_ERROR:", {
              bookingId: booking.bookingId,
              reminderType,
              error: stateError,
            });
          }
          console.error("BOOKING_REMINDER_EMAIL_ERROR:", {
            bookingId: booking.bookingId,
            sessionNumber: session.sessionNumber,
            reminderType,
            error,
          });
          continue;
        }

        try {
          await markClaimSent(bookingModel, booking._id, claimId, now);
          summary.sent += 1;
        } catch (error) {
          summary.failed += 1;
          console.error("BOOKING_REMINDER_SENT_STATE_ERROR:", {
            bookingId: booking.bookingId,
            sessionNumber: session.sessionNumber,
            reminderType,
            error,
          });
        }
      }
    }
  }

  return summary;
}

export const bookingReminderInternals = {
  claimReminder,
  isSameActiveAppointment,
  parseTime,
};
