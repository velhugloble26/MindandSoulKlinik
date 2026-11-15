import nodemailer from "nodemailer";

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "BOOKING_ALERT_EMAIL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`Missing environment variable: ${key}`);
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

class EmailService {
  async sendEmail({ to, bcc, subject, html, text }) {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    const senderOptions = [
      process.env.SMTP_FROM,
      process.env.SMTP_VERIFY_EMAIL,
    ].filter(Boolean);
    const configuredFrom =
      process.env.SMTP_USER ||
      senderOptions.find(
        (sender) =>
          !/(your_email|your app name|example\.com|placeholder|changeme)/i.test(
            sender,
          ),
      );
    if (!configuredFrom) {
      throw new Error("A valid SMTP sender address is not configured.");
    }
    const from = configuredFrom?.includes("<")
      ? configuredFrom
      : `"Mind And Soul Klinic with Nidhi" <${configuredFrom}>`;

    const info = await transporter.sendMail({
      from,
      to,
      bcc,
      subject,
      text,
      html,
    });

    if (info.rejected?.length) {
      throw new Error(`SMTP rejected recipient: ${info.rejected.join(", ")}`);
    }

    return {
      messageId: info.messageId,
    };
  }


  async sendSignupOtp({ email, otp, expiresInMinutes = 5 }) {
    const subject = "Verify your Mind And Soul Klinic with Nidhi account";

    const text = `
Your signup verification OTP is: ${otp}

This OTP will expire in ${expiresInMinutes} minutes.

If you did not create this account, please ignore this email.
    `.trim();

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Verify your Mind And Soul Klinic with Nidhi account</h2>

        <p>Use the following OTP to complete your signup:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          padding:20px;
          background:#f5f5f5;
          text-align:center;
          border-radius:8px;
        ">
          ${otp}
        </div>

        <p>
          This OTP will expire in
          <strong>${expiresInMinutes} minutes</strong>.
        </p>

        <p>
          If you did not request this OTP, you can safely ignore this email.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }

  async sendWelcomeEmail({ email, name }) {
    const subject = "Welcome to Mind And Soul Klinic with Nidhi";
    const text = `Hello ${name || "there"},\n\nWelcome to Mind And Soul Klinic with Nidhi. Your account login was successful.\n\nIf this was not you, please reset your password.`;
    const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#173f4d"><h2>Welcome to Mind And Soul Klinic with Nidhi</h2><p>Hello ${name || "there"},</p><p>Your account login was successful.</p><p>If this was not you, please reset your password immediately.</p></div>`;
    return this.sendEmail({ to: email, subject, text, html });
  }

  async sendPasswordResetEmail({ email, resetUrl, expiresInMinutes = 15 }) {
    const subject = "Reset your Mind And Soul Klinic with Nidhi password";
    const text = `Reset your password using this link: ${resetUrl}\n\nThis link expires in ${expiresInMinutes} minutes. If you did not request this, ignore this email.`;
    const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#173f4d"><h2>Reset your password</h2><p>We received a request to reset your Mind And Soul Klinic with Nidhi password.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#003044;color:#fff;text-decoration:none;border-radius:8px">Choose a new password</a></p><p>This link expires in <strong>${expiresInMinutes} minutes</strong>.</p><p>If you did not request this, you can safely ignore this email.</p></div>`;
    return this.sendEmail({ to: email, subject, text, html });
  }

  async sendBookingAlert(booking) {
    const record =
      typeof booking?.toObject === "function" ? booking.toObject() : booking;
    const escapeHtml = (value) =>
      String(value ?? "Not provided").replace(
        /[&<>\"']/g,
        (character) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '\"': "&quot;",
            "'": "&#39;",
          })[character],
      );
    const formatValue = (value) => {
      if (value === null || value === undefined || value === "") {
        return "Not provided";
      }
      return String(value);
    };
    const isCustomTimeRequest = record.bookingStatus === "manual_review";
    const submittedAt = record.created_at || record.createdAt;
    const submittedDate = submittedAt
      ? new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        }).format(new Date(submittedAt)) + " IST"
      : "Not available";
    const fields = [
      ["Booking ID", record.bookingId],
      ...(isCustomTimeRequest ? [["Request type", "Custom time · Pending Manual Review"]] : []),
      [
        "Customer name",
        `${record.firstName || ""} ${record.lastName || ""}`.trim(),
      ],
      ["Email", record.email],
      ["Phone", record.phone],
      ["Package name", record.packageName],
      [
        isCustomTimeRequest ? "Requested date and time (IST)" : "Booking date and time",
        `${record.selectedDate || ""} ${record.selectedTime || ""}`.trim(),
      ],
      ...(isCustomTimeRequest ? [["Preferred time details", record.preferredTime]] : []),
      ...(isCustomTimeRequest ? [["Request submitted", submittedDate]] : []),
      [
        "Package price",
        record.packagePrice == null
          ? null
          : `₹${Number(record.packagePrice).toLocaleString("en-IN")}`,
      ],
      ["Payment method", isCustomTimeRequest ? "Not initiated" : record.paymentMethod],
      ["Payment status", isCustomTimeRequest ? "Not started" : record.paymentStatus],
      ["Booking status", isCustomTimeRequest ? "Pending Manual Review" : record.bookingStatus],
    ];
    const rows = fields
      .map(
        ([label, value]) =>
          `<tr><th style="padding:8px;text-align:left;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(formatValue(value))}</td></tr>`,
      )
      .join("");
    const text = fields
      .map(([label, value]) => `${label}: ${formatValue(value)}`)
      .join("\n");

    return this.sendEmail({
      to: process.env.BOOKING_ALERT_EMAIL,
      subject: isCustomTimeRequest
        ? `New custom-time request: ${record.bookingId}`
        : `New booking: ${record.bookingId}`,
      text,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#173f4d"><h2>${isCustomTimeRequest ? "New custom appointment request received" : "New Mind And Soul Klinic booking"}</h2><table style="border-collapse:collapse;width:100%">${rows}</table></div>`,
    });
  }

  async sendBookingConfirmation(booking) {
    const record = typeof booking?.toObject === "function" ? booking.toObject() : booking;
    const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[character]);
    const name = `${record.firstName || ""} ${record.lastName || ""}`.trim();
    const category =
      record.sessionCategory === "offline_session" ||
      ["04:00 PM", "05:30 PM"].includes(record.selectedTime)
        ? "Clinic Session"
        : "Online Session";
    const deliveryDetails = record.sessionMode === "Offline"
      ? "Clinic location: E-339, Greater Kailash-1, Block E, Greater Kailash I, Greater Kailash, New Delhi, Delhi 110048."
      : "Online meeting details will be shared separately.";
    const subject = `Appointment confirmed: ${record.bookingId}`;
    const text = `Hello ${name},\n\nYour ${category} is confirmed for ${record.selectedDate} at ${record.selectedTime} IST.\nDuration: 60 minutes (30-minute buffer reserved).\nPayment reference: ${record.razorpayPaymentId || "Not available"}.\n\n${deliveryDetails}`;
    const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#173f4d"><h2>Appointment confirmed</h2><p>Hello ${escapeHtml(name)},</p><p>Your <strong>${escapeHtml(category)}</strong> appointment is confirmed.</p><p><strong>Date and time:</strong> ${escapeHtml(record.selectedDate)} at ${escapeHtml(record.selectedTime)} IST<br><strong>Duration:</strong> 60 minutes (30-minute buffer reserved)<br><strong>Payment reference:</strong> ${escapeHtml(record.razorpayPaymentId)}</p><p>${escapeHtml(deliveryDetails)}</p></div>`;
    return this.sendEmail({ to: record.email, subject, text, html });
  }

  async sendBookingReminder({ booking, session, reminderType }) {
    const record =
      typeof booking?.toObject === "function" ? booking.toObject() : booking;
    const customerEmail = String(record.email || "").trim();
    const alertEmail = String(process.env.BOOKING_ALERT_EMAIL || "").trim();
    if (!customerEmail) {
      throw new Error("Customer email is required to send a booking reminder.");
    }
    if (!alertEmail) {
      throw new Error("BOOKING_ALERT_EMAIL is not configured.");
    }

    const alertRecipient =
      customerEmail.toLowerCase() === alertEmail.toLowerCase()
        ? undefined
        : alertEmail;
    const escapeHtml = (value) =>
      String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]);
    const name =
      `${record.firstName || ""} ${record.lastName || ""}`.trim() || "there";
    const isAppointmentDay = reminderType === "appointment_day";
    const reminderLabel = isAppointmentDay
      ? "Your appointment is today"
      : "Your appointment is in 24 hours";
    const sessionLabel =
      Number(session.sessionNumber) > 0
        ? `Session ${session.sessionNumber}`
        : "Appointment";
    const dateTime = `${session.date} at ${session.time} IST`;
    const subject = `${isAppointmentDay ? "Appointment today" : "Appointment reminder"}: ${record.bookingId}`;
    const text = `Hello ${name},\n\n${reminderLabel} (${sessionLabel}) for booking ${record.bookingId}.\n\nDate and time: ${dateTime}\nSession type: ${session.sessionType || record.sessionType}\n\nWe look forward to seeing you.\n\nMind And Soul Klinic with Nidhi`;
    const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#173f4d"><h2>${escapeHtml(reminderLabel)}</h2><p>Hello ${escapeHtml(name)},</p><p>This is a reminder for your ${escapeHtml(sessionLabel.toLowerCase())}.</p><p><strong>Date and time:</strong> ${escapeHtml(dateTime)}<br><strong>Session type:</strong> ${escapeHtml(session.sessionType || record.sessionType)}</p><p>We look forward to seeing you.</p><p>Mind And Soul Klinic with Nidhi</p></div>`;

    return this.sendEmail({
      to: customerEmail,
      bcc: alertRecipient,
      subject,
      text,
      html,
    });
  }

  async sendPreferredTimeAcknowledgement(booking) {
    const record = typeof booking?.toObject === "function" ? booking.toObject() : booking;
    if (record.bookingStatus === "manual_review") {
      const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
      })[character]);
      const name = `${record.firstName || ""} ${record.lastName || ""}`.trim();
      const requestedTime = `${record.selectedDate} at ${record.selectedTime} IST`;
      const text = `Hello ${name || "there"},\n\nThank you for choosing Mind And Soul Klinic. We have successfully received your preferred appointment time request for ${requestedTime}. Our team will review your requested date and time and contact you after checking availability. Please note that this is only a request and your appointment is not confirmed yet.`;
      return this.sendEmail({
        to: record.email,
        subject: "We received your Mind And Soul Klinic appointment request",
        text,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#173f4d"><h2>Custom appointment request received</h2><p>Hello ${escapeHtml(name || "there")},</p><p>Thank you for choosing Mind And Soul Klinic. We have successfully received your preferred appointment time request for <strong>${escapeHtml(requestedTime)}</strong>.</p><p>Our team will review your requested date and time and contact you after checking availability.</p><p><strong>This is only a request; your appointment is not confirmed yet.</strong></p></div>`,
      });
    }
    const name = `${record.firstName || ""} ${record.lastName || ""}`.trim();
    const text = `Hello ${name},\n\nWe received your preferred alternative time: ${record.preferredTime}. This request is pending manual review and is not a confirmed appointment. We will contact you after reviewing availability.`;
    return this.sendEmail({
      to: record.email,
      subject: "We received your preferred appointment time",
      text,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#173f4d"><h2>Preferred time received</h2><p>Hello ${name},</p><p>We received your preference: <strong>${record.preferredTime}</strong>.</p><p>This request is pending manual review and is not a confirmed appointment. We will contact you after reviewing availability.</p></div>`,
    });
  }

  async sendBookingPaymentReviewAlert(booking) {
    const record = typeof booking?.toObject === "function" ? booking.toObject() : booking;
    const text = [
      `Booking ${record.bookingId} needs payment review.`,
      `Client: ${record.firstName} ${record.lastName}`,
      `Email: ${record.email}`,
      `Phone: ${record.phone}`,
      `Slot: ${record.selectedDate} ${record.selectedTime} IST`,
      `Payment: ${record.paymentStatus} · ${record.razorpayCurrency || ""} ${record.razorpayAmount ?? ""}`,
      `Razorpay payment: ${record.razorpayPaymentId || "Not available"}`,
    ].join("\n");
    const htmlLines = text.split("\n").map((line) =>
      line.replace(/[&<>\"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      })[character]),
    );
    return this.sendEmail({
      to: process.env.BOOKING_ALERT_EMAIL,
      subject: `Payment needs review: ${record.bookingId}`,
      text,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#173f4d"><h2>Razorpay payment needs review</h2>${htmlLines.map((line) => `<p>${line}</p>`).join("")}</div>`,
    });
  }

  async verifyConnection() {
    return transporter.verify();
  }
}

const emailService = new EmailService();
export default emailService;
