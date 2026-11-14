import assert from "node:assert/strict";
import test from "node:test";
import emailServices from "../utils/common/emailServices.js";
import { GET as bookingReminderRoute } from "../app/api/cron/booking-reminders/route.js";
import {
  getAppointmentDateTime,
  getDueReminderTypes,
  runBookingReminderSweep,
} from "./bookingReminderService.js";

function createBooking(overrides = {}) {
  return {
    _id: "booking-document-1",
    bookingId: "AL-TEST-1",
    bookingStatus: "confirmed",
    timezone: "Asia/Kolkata",
    email: "customer@example.com",
    firstName: "Test",
    lastName: "Customer",
    sessionType: "Online",
    created_at: new Date("2026-11-08T00:00:00.000Z"),
    updated_at: new Date("2026-11-08T00:00:00.000Z"),
    selectedDate: "2026-11-11",
    selectedTime: "11:00 AM",
    sessions: [
      {
        sessionNumber: 1,
        date: "2026-11-11",
        time: "11:00 AM",
        sessionType: "Online",
        status: "confirmed",
        updatedAt: new Date("2026-11-08T00:00:00.000Z"),
      },
    ],
    reminderTracking: [],
    ...overrides,
  };
}

function clone(value) {
  return structuredClone(value);
}

function entryMatchesKey(entry, key) {
  return (
    entry.sessionNumber === key.sessionNumber &&
    entry.appointmentDate === key.appointmentDate &&
    entry.appointmentTime === key.appointmentTime &&
    entry.reminderType === key.reminderType
  );
}

function statusMatches(entry, status) {
  return status?.$in ? status.$in.includes(entry.status) : entry.status === status;
}

class FakeBookingModel {
  constructor(bookings) {
    this.bookings = bookings;
  }

  find(query) {
    const [startDate, endDate] = [
      query.$or[0].selectedDate.$gte,
      query.$or[0].selectedDate.$lte,
    ];
    const matchesDate = (date) => date >= startDate && date <= endDate;
    return {
      lean: async () =>
        clone(
          this.bookings.filter(
            (booking) =>
              booking.bookingStatus === query.bookingStatus &&
              (matchesDate(booking.selectedDate) ||
                booking.sessions?.some((session) =>
                  matchesDate(session.date),
                )),
          ),
        ),
    };
  }

  findOne({ _id }) {
    return {
      lean: async () => {
        const booking = this.bookings.find((item) => item._id === _id);
        return booking ? clone(booking) : null;
      },
    };
  }

  async findOneAndUpdate(filter, update) {
    const booking = this.bookings.find(
      (item) =>
        item._id === filter._id &&
        (!filter.bookingStatus || item.bookingStatus === filter.bookingStatus),
    );
    if (!booking) return null;

    if (filter.reminderTracking?.$elemMatch) {
      const expected = filter.reminderTracking.$elemMatch;
      const existing = booking.reminderTracking.find(
        (entry) =>
          entryMatchesKey(entry, expected) &&
          statusMatches(entry, expected.status),
      );
      if (!existing) return null;

      const sentExclusion = filter.$nor?.some((condition) => {
        const excluded = condition.reminderTracking.$elemMatch;
        return booking.reminderTracking.some(
          (entry) =>
            entryMatchesKey(entry, excluded) &&
            statusMatches(entry, excluded.status),
        );
      });
      if (sentExclusion) return null;

      for (const [path, value] of Object.entries(update.$set || {})) {
        existing[path.replace("reminderTracking.$.", "")] = value;
      }
      existing.attempts += update.$inc?.["reminderTracking.$.attempts"] || 0;
      return clone(booking);
    }

    const exclusion = filter.$nor?.[0]?.reminderTracking?.$elemMatch;
    if (
      !exclusion ||
      booking.reminderTracking.some(
        (entry) =>
          entryMatchesKey(entry, exclusion) &&
          statusMatches(entry, exclusion.status),
      )
    ) {
      return null;
    }

    booking.reminderTracking.push(
      clone(update.$push.reminderTracking),
    );
    return clone(booking);
  }

  async updateOne(filter, update) {
    const booking = this.bookings.find((item) => item._id === filter._id);
    if (!booking) return { modifiedCount: 0 };

    let entry;
    if (filter.reminderTracking?.$elemMatch) {
      const expected = filter.reminderTracking.$elemMatch;
      entry = booking.reminderTracking.find(
        (item) =>
          entryMatchesKey(item, expected) &&
          item.status === expected.status &&
          (!expected.claimedAt ||
            item.claimedAt <= expected.claimedAt.$lte),
      );
    } else if (filter["reminderTracking.claimId"]) {
      entry = booking.reminderTracking.find(
        (item) => item.claimId === filter["reminderTracking.claimId"],
      );
    }
    if (!entry) return { modifiedCount: 0 };

    for (const [path, value] of Object.entries(update.$set || {})) {
      entry[path.replace("reminderTracking.$.", "")] = value;
    }
    return { modifiedCount: 1 };
  }
}

test("converts appointment date and time from IST to UTC", () => {
  assert.equal(
    getAppointmentDateTime("2026-11-11", "11:00 AM").toISOString(),
    "2026-11-11T05:30:00.000Z",
  );
  assert.equal(
    getAppointmentDateTime("2026-11-11", "16:00").toISOString(),
    "2026-11-11T10:30:00.000Z",
  );
  assert.equal(getAppointmentDateTime("2026-02-30", "11:00 AM"), null);
  assert.equal(
    getAppointmentDateTime("2026-11-11", "11:00 AM", "UTC"),
    null,
  );
});

test("schedules the 24-hour and 5:00 AM IST reminders at their intended times", () => {
  const booking = createBooking();
  const session = booking.sessions[0];
  assert.deepEqual(
    getDueReminderTypes(
      booking,
      session,
      new Date("2026-11-10T05:30:00.000Z"),
    ),
    ["24_hours"],
  );
  assert.deepEqual(
    getDueReminderTypes(
      booking,
      session,
      new Date("2026-11-10T23:30:00.000Z"),
    ),
    ["24_hours", "appointment_day"],
  );
});

test("does not schedule cancelled, unconfirmed, or invalid appointments", () => {
  const session = createBooking().sessions[0];
  const now = new Date("2026-11-10T05:30:00.000Z");
  assert.deepEqual(
    getDueReminderTypes(
      createBooking({ bookingStatus: "cancelled" }),
      session,
      now,
    ),
    [],
  );
  assert.deepEqual(
    getDueReminderTypes(
      createBooking({ bookingStatus: "pending" }),
      session,
      now,
    ),
    [],
  );
  assert.deepEqual(
    getDueReminderTypes(createBooking({ timezone: "UTC" }), session, now),
    [],
  );
  assert.deepEqual(
    getDueReminderTypes(
      createBooking({
        sessions: [{ ...session, status: "cancelled" }],
      }),
      { ...session, status: "cancelled" },
      now,
    ),
    [],
  );
});

test("sends a due reminder only once across concurrent scheduler runs", async () => {
  const booking = createBooking();
  const bookingModel = new FakeBookingModel([booking]);
  const deliveries = [];
  const emailService = {
    async sendBookingReminder(message) {
      deliveries.push(message);
    },
  };
  const now = new Date("2026-11-10T05:30:00.000Z");

  const [firstRun, secondRun] = await Promise.all([
    runBookingReminderSweep({ bookingModel, emailService, now }),
    runBookingReminderSweep({ bookingModel, emailService, now }),
  ]);

  assert.equal(firstRun.sent + secondRun.sent, 1);
  assert.equal(firstRun.skipped + secondRun.skipped, 1);
  assert.equal(deliveries.length, 1);
  assert.equal(booking.reminderTracking[0].status, "sent");

  const laterRun = await runBookingReminderSweep({
    bookingModel,
    emailService,
    now,
  });
  assert.equal(laterRun.sent, 0);
  assert.equal(laterRun.skipped, 1);
});

test("sends the appointment-day reminder separately at 5:00 AM IST", async () => {
  const bookingModel = new FakeBookingModel([createBooking()]);
  const deliveries = [];
  const emailService = {
    async sendBookingReminder(message) {
      deliveries.push(message);
    },
  };

  await runBookingReminderSweep({
    bookingModel,
    emailService,
    now: new Date("2026-11-10T05:30:00.000Z"),
  });
  const appointmentDayRun = await runBookingReminderSweep({
    bookingModel,
    emailService,
    now: new Date("2026-11-10T23:30:00.000Z"),
  });

  assert.equal(appointmentDayRun.sent, 1);
  assert.deepEqual(
    deliveries.map(({ reminderType }) => reminderType),
    ["24_hours", "appointment_day"],
  );
});

test("rechecks cancellation and uses the new date/time after rescheduling", async () => {
  const booking = createBooking();
  const bookingModel = new FakeBookingModel([booking]);
  const deliveries = [];
  const emailService = {
    async sendBookingReminder(message) {
      deliveries.push(message);
    },
  };

  await runBookingReminderSweep({
    bookingModel,
    emailService,
    now: new Date("2026-11-10T05:30:00.000Z"),
  });
  booking.bookingStatus = "cancelled";
  const cancelledRun = await runBookingReminderSweep({
    bookingModel,
    emailService,
    now: new Date("2026-11-10T23:30:00.000Z"),
  });
  assert.equal(cancelledRun.sent, 0);

  booking.bookingStatus = "confirmed";
  booking.sessions[0].date = "2026-11-12";
  booking.sessions[0].time = "11:00 AM";
  booking.sessions[0].updatedAt = new Date("2026-11-11T05:29:00.000Z");
  booking.selectedDate = booking.sessions[0].date;
  booking.selectedTime = booking.sessions[0].time;

  const rescheduledRun = await runBookingReminderSweep({
    bookingModel,
    emailService,
    now: new Date("2026-11-11T05:30:00.000Z"),
  });
  assert.equal(rescheduledRun.sent, 1);
  assert.equal(deliveries.length, 2);
  assert.equal(deliveries[1].session.date, "2026-11-12");
});

test("sends customer and alert recipients through the existing email service", async () => {
  const originalSendEmail = emailServices.sendEmail;
  const originalAlertEmail = process.env.BOOKING_ALERT_EMAIL;
  let capturedMessage;
  process.env.BOOKING_ALERT_EMAIL = "alerts@example.com";
  emailServices.sendEmail = async (message) => {
    capturedMessage = message;
  };

  try {
    await emailServices.sendBookingReminder({
      booking: createBooking(),
      session: createBooking().sessions[0],
      reminderType: "24_hours",
    });
  } finally {
    emailServices.sendEmail = originalSendEmail;
    if (originalAlertEmail === undefined) {
      delete process.env.BOOKING_ALERT_EMAIL;
    } else {
      process.env.BOOKING_ALERT_EMAIL = originalAlertEmail;
    }
  }

  assert.equal(capturedMessage.to, "customer@example.com");
  assert.equal(capturedMessage.bcc, "alerts@example.com");
  assert.match(capturedMessage.subject, /Appointment reminder/);
  assert.match(capturedMessage.text, /2026-11-11 at 11:00 AM IST/);
});

test("protects the cron endpoint with a Bearer token", async () => {
  const originalSecret = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "test-cron-secret";
  try {
    const unauthorized = await bookingReminderRoute(
      new Request("http://localhost/api/cron/booking-reminders"),
    );
    const authorized = await bookingReminderRoute(
      new Request("http://localhost/api/cron/booking-reminders", {
        headers: { authorization: "Bearer wrong-secret" },
      }),
    );
    assert.equal(unauthorized.status, 401);
    assert.equal(authorized.status, 401);
  } finally {
    if (originalSecret === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = originalSecret;
    }
  }
});
