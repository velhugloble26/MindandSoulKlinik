/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  ADMIN_AVAILABILITY,
  ADMIN_BOOKING,
  ADMIN_BOOKING_CREATE,
  ADMIN_BOOKING_CANCEL,
  ADMIN_BOOKING_RESCHEDULE,
  ADMIN_BOOKING_STATUS,
  ADMIN_BOOKING_PREFERRED_TIME,
  ADMIN_BOOKINGS,
} from "@/utils/api";
import { THERAPY_CONTENT } from "@/constants/therapyContent";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  EmptyState,
  fieldClass,
  LoadingState,
  Modal,
  Notice,
  PageHeader,
  Pager,
  Pagination,
  requestApi,
  SearchBar,
} from "./AdminUI";

type Slot = {
  start: string;
  end: string;
  time: string;
  sessionType: string;
  label: string;
  status: "available" | "booked" | "blocked" | "break" | "past";
  available: boolean;
};
type AvailabilityDate = {
  date: string;
  label: string;
  isAvailable: boolean;
  isBlocked: boolean;
  slots: Slot[];
};
type WorkingHour = {
  dayOfWeek: number;
  enabled: boolean;
  start: string;
  end: string;
};
type AvailabilityBreak = {
  dayOfWeek: number;
  start: string;
  end: string;
  label: string;
};
type AvailabilitySettings = {
  timezone: string;
  slotDurationMinutes: number;
  slotIntervalMinutes: number;
  sessionTypes: string[];
  workingHours: WorkingHour[];
  breaks: AvailabilityBreak[];
};
type BookingSession = {
  sessionNumber: number;
  date: string;
  time: string;
  sessionType: "Online" | "Offline";
  location?: string;
  amountPaid?: number;
  remarks?: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
  createdAt?: string;
  updatedAt?: string;
};
type Booking = {
  bookingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  identifyYourGender?: string;
  dob?: string;
  location?: string;
  sessionMode?: string;
  occupation?: string;
  relationShipStatus?: string;
  numberOfChildren?: number;
  currentlyTakingAnyPsychiatricMedication?: boolean;
  medicationDetails?: string;
  whereuknowaboutus?: string;
  therapyGoals?: string[];
  therapyGoalsOther?: string;
  addNotes?: string;
  preferredTime?: string;
  preferredTimeReviewStatus?: "none" | "pending" | "approved" | "rejected";
  preferredTimeReviewNote?: string;
  paymentReviewStatus?: "none" | "manual_review";
  meetYourTherapist?: string;
  meetYourTherapistContent?: string;
  informedConsent?: string;
  InformedConsentforTherapySessions?: string;
  informedConsentContent?: string;
  conformationOfBooking?: boolean;
  packageId: string;
  packageName: string;
  packagePrice: number;
  selectedDate: string;
  selectedTime: string;
  sessionType: string;
  sessionCategory?: "online_session" | "offline_session";
  paymentMethod: string;
  paymentStatus: string;
  bookingStatus: string;
  sessions?: BookingSession[];
  created_at?: string;
};
const statuses = ["pending", "confirmed", "completed", "cancelled", "no_show"];
const bookingFilterStatuses = [...statuses, "manual_review"];
const standardBookingTimes = ["11:00 AM", "12:30 PM", "04:00 PM", "05:30 PM"];
const isOnlineSessionTime = (time: string) => ["11:00 AM", "12:30 PM"].includes(time);
const paymentStatuses = [
  "pending",
  "paid",
  "cash_received",
  "failed",
  "cancelled",
];
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

function getBookingSessions(booking: Booking): BookingSession[] {
  if (booking.sessions?.length) return booking.sessions;
  return [
    {
      sessionNumber: 1,
      date: booking.selectedDate,
      time: booking.selectedTime,
      sessionType: booking.sessionType as "Online" | "Offline",
      location: booking.location,
      amountPaid:
        booking.paymentStatus === "paid" ||
        booking.paymentStatus === "cash_received"
          ? booking.packagePrice
          : 0,
      remarks: "",
      status: "scheduled",
    },
  ];
}

export default function BookingsManager() {
  const [items, setItems] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    sessionType: "",
    paymentStatus: "",
    packageId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [viewing, setViewing] = useState<Booking | null>(null);
  const [previewing, setPreviewing] = useState<Booking | null>(null);
  const [reviewingPreference, setReviewingPreference] = useState<Booking | null>(null);
  const [schedulingPreference, setSchedulingPreference] = useState<Booking | null>(null);
  const [creating, setCreating] = useState(false);
  const [acting, setActing] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) query.set("search", search);
      Object.entries(filters).forEach(
        ([key, value]) => value && query.set(key, value),
      );
      const payload = await requestApi(`${ADMIN_BOOKINGS}?${query}`);
      setItems(payload.data?.data || []);
      setPagination(payload.data?.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [filters, page, search]);
  useEffect(() => {
    load();
  }, [load]);
  function filter(name: string, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  }
  async function updateStatus(booking: Booking, status: string) {
    if (
      status === "cancelled" &&
      !window.confirm(`Cancel booking ${booking.bookingId}?`)
    )
      return;
    setActing(booking.bookingId);
    setError("");
    setSuccess("");
    try {
      const url =
        status === "cancelled"
          ? ADMIN_BOOKING_CANCEL(booking.bookingId)
          : ADMIN_BOOKING_STATUS(booking.bookingId);
      const payload = await requestApi(url, {
        method: "PATCH",
        body: JSON.stringify(status === "cancelled" ? {} : { status }),
      });
      setSuccess(payload.message);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setActing("");
    }
  }
  async function updatePaymentStatus(booking: Booking, paymentStatus: string) {
    setActing(booking.bookingId);
    setError("");
    setSuccess("");
    try {
      const payload = await requestApi(
        ADMIN_BOOKING_STATUS(booking.bookingId),
        { method: "PATCH", body: JSON.stringify({ paymentStatus }) },
      );
      setSuccess(payload.message);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment status update failed.",
      );
    } finally {
      setActing("");
    }
  }
  return (
    <>
      <PageHeader
        eyebrow="Sessions"
        title="Bookings"
        description="Search and filter all appointments, then update status, cancel, or reschedule using the dedicated admin booking APIs."
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => setCreating(true)}
          >
            + Book for Client
          </button>
        }
      />
      {success && <Notice kind="success">{success}</Notice>}
      {error && <Notice>{error}</Notice>}
      <SlotAvailabilityManager />
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search name, email, phone or booking ID"
      >
        <input
          type="date"
          className="admin-filter"
          value={filters.date}
          onChange={(e) => filter("date", e.target.value)}
          aria-label="Filter by date"
        />
        <select
          className="admin-filter"
          value={filters.status}
          onChange={(e) => filter("status", e.target.value)}
          aria-label="Filter by booking status"
        >
          <option value="">All statuses</option>
          {bookingFilterStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select
          className="admin-filter"
          value={filters.sessionType}
          onChange={(e) => filter("sessionType", e.target.value)}
          aria-label="Filter by session type"
        >
          <option value="">All session types</option>
          <option>Online</option>
          <option>Offline</option>
        </select>
        <select
          className="admin-filter"
          value={filters.paymentStatus}
          onChange={(e) => filter("paymentStatus", e.target.value)}
          aria-label="Filter by payment status"
        >
          <option value="">All payments</option>
          {paymentStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </SearchBar>
      {loading ? (
        <LoadingState label="Loading bookings…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon="calendar_month"
          title="No bookings found"
          body="Try changing the search or filters."
        />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Client</th>
                <th>Session</th>
                <th>Preferred time</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>
                    <strong>{booking.bookingId}</strong>
                    <span>{booking.packageName}</span>
                  </td>
                  <td>
                    <strong>
                      {booking.firstName} {booking.lastName}
                    </strong>
                    <a className="block text-blue-700 underline" href={`mailto:${booking.email}`}>{booking.email}</a>
                    <a className="block text-blue-700 underline" href={`tel:${booking.phone}`}>{booking.phone}</a>
                  </td>
                  <td>
                    <strong>{booking.selectedDate}</strong>
                    <span>
                      {booking.bookingStatus === "manual_review" ? "Custom time request · " : ""}
                      {booking.selectedTime} · {booking.sessionCategory === "offline_session" || ["04:00 PM", "05:30 PM"].includes(booking.selectedTime) ? "Offline Session" : "Online Session"} · {booking.sessionType}
                    </span>
                  </td>
                  <td>
                    {booking.preferredTime ? (
                      <>
                        <span>{booking.preferredTime}</span>
                        <span className="capitalize">{booking.preferredTimeReviewStatus || "pending"} manual review</span>
                      </>
                    ) : <span>—</span>}
                  </td>
                  <td>
                    <strong>
                      ₹{booking.packagePrice?.toLocaleString("en-IN")}
                    </strong>
                    {booking.bookingStatus === "manual_review" ? (
                      <span className="block text-sm text-slate-500">Payment not started</span>
                    ) : booking.paymentMethod === "cash" ? (
                      <select
                        className="admin-filter mt-1"
                        value={booking.paymentStatus}
                        disabled={acting === booking.bookingId}
                        onChange={(e) =>
                          updatePaymentStatus(booking, e.target.value)
                        }
                        aria-label={`Payment status for ${booking.bookingId}`}
                      >
                        {paymentStatuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span>
                        {booking.paymentMethod} · {booking.paymentStatus}
                      </span>
                    )}
                    {booking.paymentReviewStatus === "manual_review" && (
                      <span className="mt-1 block font-semibold text-amber-700">Payment requires manual review</span>
                    )}
                  </td>
                  <td>
                    <select
                      className="admin-filter min-w-[130px]"
                      value={booking.bookingStatus}
                      disabled={acting === booking.bookingId || booking.bookingStatus === "manual_review"}
                      onChange={(e) => updateStatus(booking, e.target.value)}
                    >
                      {!statuses.includes(booking.bookingStatus) && (
                        <option value={booking.bookingStatus} disabled>{booking.bookingStatus === "manual_review" ? "Pending Manual Review" : booking.bookingStatus}</option>
                      )}
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {booking.preferredTime && booking.preferredTimeReviewStatus === "pending" && (
                        <button className="admin-button-secondary" onClick={() => setReviewingPreference(booking)}>
                          {booking.bookingStatus === "manual_review" ? "Review request" : "Review preference"}
                        </button>
                      )}
                      {booking.bookingStatus === "manual_review" && booking.preferredTimeReviewStatus === "approved" && (
                        <button className="btn-primary" onClick={() => setSchedulingPreference(booking)}>
                          Add to calendar
                        </button>
                      )}
                      {booking.bookingStatus !== "manual_review" && <>
                      <button
                        className="admin-button-secondary"
                        onClick={() => setPreviewing(booking)}
                      >
                        Preview
                      </button>
                      <button
                        className="admin-button-secondary"
                        onClick={() => setViewing(booking)}
                      >
                        View / Edit
                      </button>
                      <button
                        className="admin-button-secondary"
                        onClick={() => setEditing(booking)}
                      >
                        Reschedule
                      </button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager value={pagination} onChange={setPage} />
      {editing && (
        <RescheduleForm
          booking={editing}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            setSuccess(message);
            load();
          }}
        />
      )}
      {previewing && (
        <BookingPreview
          booking={previewing}
          onClose={() => setPreviewing(null)}
        />
      )}
      {reviewingPreference && (
        <PreferredTimeReview
          booking={reviewingPreference}
          onClose={() => setReviewingPreference(null)}
          onSaved={(message) => {
            setReviewingPreference(null);
            setSuccess(message);
            load();
          }}
        />
      )}
      {schedulingPreference && (
        <CustomTimeSchedule
          booking={schedulingPreference}
          onClose={() => setSchedulingPreference(null)}
          onSaved={(message) => {
            setSchedulingPreference(null);
            setSuccess(message);
            load();
          }}
        />
      )}
      {viewing && (
        <BookingDetailsForm
          booking={viewing}
          onClose={() => setViewing(null)}
          onSaved={(message, updated) => {
            setViewing(null);
            setSuccess(message);
            setItems((current) =>
              current.map((item) =>
                item.bookingId === updated.bookingId ? updated : item,
              ),
            );
          }}
        />
      )}
      {creating && (
        <AdminCreateBooking
          onClose={() => setCreating(false)}
          onSaved={(message) => {
            setCreating(false);
            setSuccess(message);
            load();
          }}
        />
      )}
    </>
  );
}

function PreferredTimeReview({
  booking,
  onClose,
  onSaved,
}: {
  booking: Booking;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [date, setDate] = useState(booking.selectedDate);
  const [time, setTime] = useState(booking.selectedTime);
  const [sessionType, setSessionType] = useState(
    isOnlineSessionTime(booking.selectedTime) ? "Online" : booking.sessionType,
  );
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function review(status: "approved" | "rejected") {
    setBusy(true);
    setError("");
    try {
      const payload = await requestApi(ADMIN_BOOKING_PREFERRED_TIME(booking.bookingId), {
        method: "PATCH",
        body: JSON.stringify({
          status,
          note,
          ...(status === "approved" && booking.bookingStatus !== "manual_review" ? { date, time, sessionType } : {}),
        }),
      });
      onSaved(payload.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to review preference.");
    } finally {
      setBusy(false);
    }
  }

  if (booking.bookingStatus === "manual_review") {
    return (
      <Modal title={`Review custom-time request: ${booking.bookingId}`} onClose={onClose}>
        <div className="space-y-4">
          <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6">{booking.preferredTime}</p>
          <p className="text-sm">Contact customer: <a className="text-blue-700 underline" href={`mailto:${booking.email}`}>{booking.email}</a> · <a className="text-blue-700 underline" href={`tel:${booking.phone}`}>{booking.phone}</a></p>
          <p className="text-sm text-slate-600">Approving only marks this request as approved. It does not reserve a slot. Use Add to calendar after checking availability to create the appointment.</p>
          <label className="admin-label">Review note<textarea className={fieldClass} value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} /></label>
          {error && <Notice>{error}</Notice>}
          <div className="flex justify-end gap-2">
            <button type="button" className="admin-button-secondary" onClick={onClose}>Close</button>
            <button type="button" className="admin-button-secondary" disabled={busy} onClick={() => review("rejected")}>Reject</button>
            <button type="button" className="admin-button-secondary" disabled={busy} onClick={() => review("approved")}>{busy ? "Saving…" : "Approve request"}</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`Review preferred time: ${booking.bookingId}`} onClose={onClose}>
      <div className="space-y-4">
        <p className="rounded-lg bg-slate-50 p-4 text-sm leading-6">{booking.preferredTime}</p>
        <p className="text-sm">Contact: <a className="underline" href={`mailto:${booking.email}`}>{booking.email}</a> · <a className="underline" href={`tel:${booking.phone}`}>{booking.phone}</a></p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="admin-label">Approved date<input className={fieldClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <label className="admin-label">Approved time<select className={fieldClass} value={time} onChange={(event) => { setTime(event.target.value); if (isOnlineSessionTime(event.target.value)) setSessionType("Online"); }}>{standardBookingTimes.map((slot) => <option key={slot}>{slot}</option>)}</select></label>
          <label className="admin-label">Session mode<select className={fieldClass} value={sessionType} onChange={(event) => setSessionType(event.target.value)}><option>Online</option><option disabled={isOnlineSessionTime(time)}>Offline</option></select></label>
        </div>
        <label className="admin-label">Review note<textarea className={fieldClass} value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} /></label>
        <p className="text-xs leading-5 text-slate-500">Approval moves the appointment to the selected slot after the shared calendar confirms it is available.</p>
        {error && <Notice>{error}</Notice>}
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="admin-button-secondary" onClick={onClose}>Close</button>
          <button type="button" className="admin-button-secondary" disabled={busy} onClick={() => review("rejected")}>Reject</button>
          <button type="button" className="admin-button-secondary" disabled={busy} onClick={() => review("approved")}>{busy ? "Saving…" : "Approve and schedule"}</button>
        </div>
      </div>
    </Modal>
  );
}

function toTimeInputValue(value: string) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

function CustomTimeSchedule({
  booking,
  onClose,
  onSaved,
}: {
  booking: Booking;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [date, setDate] = useState(booking.selectedDate);
  const [time, setTime] = useState(toTimeInputValue(booking.selectedTime));
  const [note, setNote] = useState(booking.preferredTimeReviewNote || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function schedule() {
    setBusy(true);
    setError("");
    try {
      const result = await requestApi(ADMIN_BOOKING_PREFERRED_TIME(booking.bookingId), {
        method: "PATCH",
        body: JSON.stringify({ status: "schedule", date, time, note }),
      });
      onSaved(result.message || "Custom appointment added to the calendar.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add appointment to the calendar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={`Add approved request to calendar`} onClose={() => !busy && onClose()}>
      <div className="space-y-4">
        <p className="text-sm">Client: {booking.firstName} {booking.lastName} · <a className="text-blue-700 underline" href={`mailto:${booking.email}`}>{booking.email}</a> · <a className="text-blue-700 underline" href={`tel:${booking.phone}`}>{booking.phone}</a></p>
        <p className="text-sm">Category: {booking.sessionCategory === "offline_session" ? "Offline Sessions (Clinic Only)" : "Online Sessions (Online Only)"}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="admin-label">Appointment date<input className={fieldClass} type="date" min={new Date().toISOString().slice(0, 10)} required value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <label className="admin-label">Appointment time (IST, 10:00 AM–6:00 PM)<input className={fieldClass} type="time" min="10:00" max="18:00" required value={time} onChange={(event) => setTime(event.target.value)} /></label>
        </div>
        <label className="admin-label">Admin note<textarea className={fieldClass} value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} /></label>
        <p className="text-xs leading-5 text-slate-500">The shared calendar will be checked when you add this appointment. It will not be reserved before this action.</p>
        {error && <Notice>{error}</Notice>}
        <div className="flex justify-end gap-2"><button type="button" className="admin-button-secondary" disabled={busy} onClick={onClose}>Cancel</button><button type="button" className="btn-primary" disabled={busy || !date || !time} onClick={schedule}>{busy ? "Checking availability…" : "Check availability and add"}</button></div>
      </div>
    </Modal>
  );
}

type AdminCreateBookingState = {
  packageId: string;
  selectedDate: string;
  selectedTime: string;
  sessionType: "Online" | "Offline";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  identifyYourGender: string;
  dob: string;
  location: string;
  occupation: string;
  relationShipStatus: string;
  numberOfChildren: number;
  whereuknowaboutus: string;
  therapyGoals: string[];
  currentlyTakingAnyPsychiatricMedication: boolean;
  medicationDetails: string;
  addNotes: string;
  informedConsent: string;
  InformedConsentforTherapySessions: string;
  conformationOfBooking: boolean;
};

const adminCreateInitial: AdminCreateBookingState = {
  packageId: "india-psychologist-psychotherapist-regular",
  selectedDate: "",
  selectedTime: "",
  sessionType: "Offline",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  whatsappNumber: "",
  identifyYourGender: "Prefer not to say",
  dob: "1970-01-01",
  location: "",
  occupation: "",
  relationShipStatus: "Other",
  numberOfChildren: 0,
  whereuknowaboutus: "Other",
  therapyGoals: [therapyGoalOptions[0]],
  currentlyTakingAnyPsychiatricMedication: false,
  medicationDetails: "",
  addNotes: "",
  informedConsent: "",
  InformedConsentforTherapySessions: "",
  conformationOfBooking: false,
};

function AdminCreateBooking({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [form, setForm] = useState(adminCreateInitial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = <K extends keyof AdminCreateBookingState>(
    field: K,
    value: AdminCreateBookingState[K],
  ) => setForm((current) => ({ ...current, [field]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = await requestApi(ADMIN_BOOKING_CREATE, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          sessionMode: form.sessionType,
          paymentMethod: "cash",
        }),
      });
      onSaved(payload.message || "Booking created successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create booking.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Book for Client" onClose={() => !busy && onClose()}>
      <form
        onSubmit={submit}
        className="max-h-[78vh] space-y-5 overflow-y-auto pr-2"
      >
        {error && <Notice>{error}</Notice>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="admin-label">
            Package
            <select
              className={fieldClass}
              value={form.packageId}
              onChange={(e) => update("packageId", e.target.value)}
            >
              <optgroup label="Individual Therapy">
                <option value="india-psychologist-psychotherapist-regular">Individual Therapy</option>
                <option value="india-psychologist-psychotherapist-4-session">4-session package</option>
                <option value="india-psychologist-psychotherapist-8-session">8-session package</option>
                <option value="india-psychologist-psychotherapist-12-session">12-session package</option>
              </optgroup>
              <optgroup label="Couple Therapy">
                <option value="india-couple-therapy-regular">Couple Therapy</option>
                <option value="india-couple-therapy-journey">Couple Therapy Journey</option>
              </optgroup>
              <optgroup label="Wellness Packages">
                <option value="india-wellness-package-3-month">3-month package</option>
                <option value="india-wellness-package-6-month">6-month package</option>
                <option value="india-wellness-package-12-month">12-month package</option>
              </optgroup>
              <optgroup label="Consultation Call">
                <option value="india-consultation-call-15-minute">15-minute consultation</option>
              </optgroup>
            </select>
          </label>
          <label className="admin-label">
            Session type
            <select
              className={fieldClass}
              value={form.sessionType}
              onChange={(e) =>
                update(
                  "sessionType",
                  e.target.value as AdminCreateBookingState["sessionType"],
                )
              }
            >
              <option>Online</option>
              <option disabled={isOnlineSessionTime(form.selectedTime)}>Offline</option>
            </select>
          </label>
          <label className="admin-label">
            Date
            <input
              className={fieldClass}
              type="date"
              required
              value={form.selectedDate}
              onChange={(e) => update("selectedDate", e.target.value)}
            />
          </label>
          <label className="admin-label">
            Time
            <select
              className={fieldClass}
              required
              value={form.selectedTime}
              onChange={(e) => {
                update("selectedTime", e.target.value);
                if (isOnlineSessionTime(e.target.value)) update("sessionType", "Online");
              }}
            >
              <option value="">Select a standard time</option>
              {standardBookingTimes.map((time) => <option key={time}>{time}</option>)}
            </select>
          </label>
          <label className="admin-label">
            First name
            <input
              className={fieldClass}
              required
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </label>
          <label className="admin-label">
            Last name
            <input
              className={fieldClass}
              required
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </label>
          <label className="admin-label">
            Email
            <input
              className={fieldClass}
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </label>
          <label className="admin-label">
            Phone
            <input
              className={fieldClass}
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </label>
          <label className="admin-label">
            WhatsApp number
            <input
              className={fieldClass}
              required
              value={form.whatsappNumber}
              onChange={(e) => update("whatsappNumber", e.target.value)}
            />
          </label>
          <label className="admin-label">
            Date of birth
            <input
              className={fieldClass}
              type="date"
              required
              value={form.dob}
              onChange={(e) => update("dob", e.target.value)}
            />
          </label>
          <label className="admin-label">
            Gender
            <select
              className={fieldClass}
              value={form.identifyYourGender}
              onChange={(e) => update("identifyYourGender", e.target.value)}
            >
              <option>Prefer not to say</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-Binary</option>
              <option>Transgender</option>
              <option>Other</option>
            </select>
          </label>
          <label className="admin-label">
            Location
            <input
              className={fieldClass}
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </label>
          <label className="admin-label">
            Relationship status
            <select
              className={fieldClass}
              value={form.relationShipStatus}
              onChange={(e) => update("relationShipStatus", e.target.value)}
            >
              <option>Other</option>
              <option>Single</option>
              <option>In a relationship</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
          </label>
          <label className="admin-label">
            How they heard about us
            <select
              className={fieldClass}
              value={form.whereuknowaboutus}
              onChange={(e) => update("whereuknowaboutus", e.target.value)}
            >
              <option>Other</option>
              <option>Social Media</option>
              <option>Friend/Family</option>
              <option>Search Engine</option>
              <option>Advertisement</option>
            </select>
          </label>
          <label className="admin-label">
            Number of children
            <input
              className={fieldClass}
              type="number"
              min="0"
              value={form.numberOfChildren}
              onChange={(e) =>
                update("numberOfChildren", Number(e.target.value))
              }
            />
          </label>
        </div>
        <label className="admin-label">
          Occupation
          <input
            className={fieldClass}
            value={form.occupation}
            onChange={(e) => update("occupation", e.target.value)}
          />
        </label>
        <label className="admin-label">
          Additional notes
          <textarea
            className={fieldClass}
            value={form.addNotes}
            onChange={(e) => update("addNotes", e.target.value)}
          />
        </label>
        <div className="space-y-2 text-sm">
          <strong>Therapy goal</strong>
          {therapyGoalOptions.slice(0, 1).map((goal) => (
            <label key={goal} className="flex gap-2">
              <input
                type="checkbox"
                checked={form.therapyGoals.includes(goal)}
                onChange={(e) =>
                  update("therapyGoals", e.target.checked ? [goal] : [])
                }
              />
              {goal}
            </label>
          ))}
        </div>
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.informedConsent === "I agree"}
            onChange={(e) => {
              const value = e.target.checked ? "I agree" : "";
              update("informedConsent", value);
              update("InformedConsentforTherapySessions", value);
            }}
          />{" "}
          Consent given
        </label>
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.conformationOfBooking}
            onChange={(e) => update("conformationOfBooking", e.target.checked)}
          />{" "}
          Booking confirmed by client
        </label>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="admin-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="btn-primary" disabled={busy}>
            {busy ? "Creating…" : "Create Booking"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function escapeHtml(value: unknown) {
  return String(value ?? "Not provided").replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] || character,
  );
}

function BookingPreview({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const therapistContent =
    booking.meetYourTherapistContent || THERAPY_CONTENT.meetYourTherapist;
  const consentContent =
    booking.informedConsentContent || THERAPY_CONTENT.informedConsent;
  const sessions = getBookingSessions(booking);
  const therapistBody = therapistContent.replace(
    /^Meet your therapist\s*/i,
    "",
  );
  const consentBody = consentContent.replace(/^Informed Consent\s*/i, "");

  function downloadPdf() {
    const rows = [
      ["Booking ID", booking.bookingId],
      ["Client", `${booking.firstName} ${booking.lastName}`],
      ["Email", booking.email],
      ["Phone", booking.phone],
      ["Package", booking.packageName],
      ["Date", booking.selectedDate],
      ["Time", booking.selectedTime],
      [
        "Session",
        `${booking.sessionType} (${booking.sessionMode || "Not provided"})`,
      ],
      ["Gender", booking.identifyYourGender],
      ["Date of birth", booking.dob],
      ["Location", booking.location],
      ["Relationship status", booking.relationShipStatus],
      // ["Meet your therapist", therapistContent], ["Informed consent", consentContent],
      [
        "Agreement",
        booking.informedConsent || booking.InformedConsentforTherapySessions,
      ],
      ["Occupation", booking.occupation],
      ["Children", booking.numberOfChildren],
      ["Therapy goals", booking.therapyGoals?.join(", ")],
      [
        "Booking confirmation",
        booking.conformationOfBooking ? "Confirmed" : "Not confirmed",
      ],
      ["Payment", `${booking.paymentMethod} · ${booking.paymentStatus}`],
      ["Status", booking.bookingStatus],
    ];
    const sessionsHtml = sessions
      .map(
        (session, index) =>
          `<div class="session-card"><h3>Session ${index + 1}</h3><p><strong>Date:</strong> ${escapeHtml(session.date)}</p><p><strong>Time:</strong> ${escapeHtml(session.time)}</p><p><strong>Session Type:</strong> ${escapeHtml(session.sessionType)}</p><p><strong>Location:</strong> ${escapeHtml(session.location || "Not provided")}</p><p><strong>Amount Paid:</strong> ₹${escapeHtml(session.amountPaid ?? 0)}</p><p><strong>Remarks:</strong> ${escapeHtml(session.remarks || "")}</p><p><strong>Status:</strong> ${escapeHtml(session.status)}</p></div>`,
      )
      .join("");
    const clientDetailsHtml = Array.from(
      { length: Math.ceil(rows.length / 2) },
      (_, rowIndex) => rows.slice(rowIndex * 2, rowIndex * 2 + 2),
    )
      .map(
        (row) =>
          `<tr>${row
            .map(
              ([label, value]) =>
                `<th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td>`,
            )
            .join(
              "",
            )}${row.length === 1 ? '<th class="empty"></th><td class="empty"></td>' : ""}</tr>`,
      )
      .join("");
    const logoUrl = `${window.location.origin}/website_logo.avif`;
    const headerUrl = logoUrl;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Booking ${escapeHtml(booking.bookingId)}</title><style>:root{--sand:#f7f3ee;--sand-deep:#e9dcc6;--sage:#59766c;--sage-soft:#a9b9af;--ink:#2d2d2d;--line:#d9d1c1}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:var(--ink);max-width:820px;margin:0 auto;padding:14px 0 40px;background:#f3f1ee;position:relative}body:before{content:"";position:fixed;inset:10px 0 auto 0;height:154px;background:radial-gradient(circle at 15% 35%, rgba(232,205,175,.82), rgba(232,205,175,0) 28%), radial-gradient(circle at 78% 44%, rgba(168,178,170,.45), rgba(168,178,170,0) 28%), linear-gradient(90deg, rgba(255,255,255,.35), rgba(255,255,255,.2));pointer-events:none;z-index:0}.brand-header{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:180px;padding:28px 26px 22px;background:var(--sand);border:1px solid var(--line);border-bottom:4px solid #d8c4a8;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,.04)}.brand-header:before,.brand-header:after{content:"";position:absolute;border-radius:50%;pointer-events:none}.brand-header:before{width:500px;height:240px;left:-120px;top:-40px;background:rgba(225,200,160,.23)}.brand-header:after{width:420px;height:220px;right:-70px;bottom:-60px;background:rgba(150,170,160,.22)}.brand-left,.brand-right{position:relative;z-index:1}.brand-left{display:flex;align-items:center;justify-content:center}.brand-logo{max-width:260px;height:auto;display:block}.brand-right{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;padding:0 18px}.brand-right:before{content:"";position:absolute;left:-18px;top:18px;bottom:18px;width:1px;background:rgba(88,97,89,.55)}.brand-wordmark{font-family:Georgia,'Times New Roman',serif;font-size:92px;line-height:.92;letter-spacing:-4px;color:#2e2e2d;font-weight:500;margin:0}.brand-right .brand-title{font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:58px;line-height:1.1;color:var(--sage);font-weight:500;margin:0 0 8px}.brand-subtitle{font-size:18px;line-height:1.4;color:#4d4d4d;font-weight:500;letter-spacing:.02em;white-space:nowrap}.brand-tagline{font-size:18px;line-height:1.25;color:var(--sage);letter-spacing:.22em;text-transform:uppercase;font-weight:700;margin-top:8px}.print-section{break-before:page;page-break-before:always;break-inside:auto;page-break-inside:auto}.content{white-space:pre-wrap;line-height:1.55;border:1px solid #d9e0e2;padding:16px;background:rgba(255,255,255,.94)}.content h2{color:#003044;margin:0 0 14px;break-after:avoid;page-break-after:avoid}.content-body{white-space:pre-wrap}.session-card{break-inside:avoid;page-break-inside:avoid;border:1px solid #d9e0e2;padding:14px;margin:12px 0;background:rgba(255,255,255,.94)}.session-card h3{color:#003044;margin:0 0 10px}table{width:100%;border-collapse:collapse;background:rgba(255,255,255,.94)}td{border-bottom:1px solid #d9e0e2;padding:10px 6px;vertical-align:top}td:first-child{font-weight:700;width:30%;color:#506356}@media print{body{margin:0;padding:20px 0 24px}body:before{opacity:.9}.brand-header{margin:0 20px 20px}}@media (max-width:760px){body{padding:16px 0 30px}.brand-header{grid-template-columns:1fr;gap:12px;padding:24px 18px}.brand-right:before{display:none}.brand-wordmark{font-size:60px}.brand-right .brand-title{font-size:42px}.brand-subtitle,.brand-tagline{white-space:normal;letter-spacing:.1em;text-align:center}}</style></head><body><header class="brand-header"><div class="brand-left"><img class="brand-logo" src="${logoUrl}" alt="Adore Life" /></div><div class="brand-right"><div class="brand-title">Client Details</div><div class="brand-tagline">Therapy • Healing • Growth</div></div></header><table>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join("")}</table><section class="print-section"><div class="content"><h2>Therapy Sessions</h2>${sessionsHtml}</div></section><section class="print-section"><div class="content"><h2>Meet your therapist</h2><div class="content-body">${escapeHtml(therapistBody)}</div></div></section><section class="print-section"><div class="content"><h2>Informed Consent</h2><div class="content-body">${escapeHtml(consentBody)}</div></div></section><section class="print-section"><div class="content"><h2>User Agreement</h2><div class="content-body">${escapeHtml(booking.informedConsent || booking.InformedConsentforTherapySessions || "Not provided")}</div></div></section></body></html>`;
    const printableHtml = html
      .replace(
        "</style>",
        `.brand-header{display:block;width:100%;min-height:0;padding:0;aspect-ratio:1080/897;max-height:52vh;overflow:hidden;background:#f7f4ee;border:0;border-bottom:1px solid #7d8a72;box-shadow:none}.brand-header:before,.brand-header:after{display:none}.brand-header img{display:block;width:auto;height:100%;max-width:100%;margin:0 auto;object-fit:contain}.client-details,.print-section{position:relative;z-index:1}.content,.content-body,.session-card,.session-card p,.session-card strong{color:var(--ink);opacity:1}.client-details{table-layout:fixed;border:1px solid #aeb7ad}.client-details th,.client-details td{border:1px solid #cbd1ca;padding:10px 12px;text-align:left;vertical-align:top}.client-details th{width:18%;background:#f1f3ef;color:#506356;font-size:12px;text-transform:uppercase;letter-spacing:.04em}.client-details td{width:32%;overflow-wrap:anywhere}.client-details .empty{background:#fafafa}@media print{@page{margin:12mm}.brand-header{margin:0 0 20px}.client-details th,.client-details td{padding:8px 10px}}</style>`,
      )
      .replace(
        /<header class="brand-header">.*?<\/header>/,
        `<header class="brand-header"><img src="${headerUrl}" alt="Adore Life — Client Details" /></header>`,
      )
      .replace(
        /<table>.*?<\/table>/,
        `<table class="client-details">${clientDetailsHtml}</table>`,
      );

    const url = URL.createObjectURL(
      new Blob([printableHtml], { type: "text/html;charset=utf-8" }),
    );
    const printWindow = window.open(url, "_blank");
    if (!printWindow) {
      URL.revokeObjectURL(url);
      return;
    }
    printWindow.addEventListener(
      "load",
      () => {
        printWindow.focus();
        printWindow.print();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      { once: true },
    );
  }

  const detail = (label: string, value: unknown) => (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-line text-sm text-slate-900">
        {String(value || "Not provided")}
      </dd>
    </div>
  );
  return (
    <Modal title={`Booking preview: ${booking.bookingId}`} onClose={onClose}>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {detail("Client", `${booking.firstName} ${booking.lastName}`)}
          {detail("Email", booking.email)}
          {detail("Phone", booking.phone)}
          {detail("Package", booking.packageName)}
          {detail("Date", booking.selectedDate)}
          {detail("Time", booking.selectedTime)}
          {detail(
            "Session",
            `${booking.sessionType} (${booking.sessionMode || "Not provided"})`,
          )}
          {detail("Location", booking.location)}
          {detail("Gender", booking.identifyYourGender)}
          {detail("Date of birth", booking.dob)}
          {detail("Relationship status", booking.relationShipStatus)}
          {detail("Occupation", booking.occupation)}
          {detail("Therapy goals", booking.therapyGoals?.join(", "))}
          {detail(
            "Agreement",
            booking.informedConsent ||
              booking.InformedConsentforTherapySessions,
          )}
          {detail(
            "Booking confirmation",
            booking.conformationOfBooking ? "Confirmed" : "Not confirmed",
          )}
          {detail(
            "Payment",
            `${booking.paymentMethod} · ${booking.paymentStatus}`,
          )}
          {detail("Status", booking.bookingStatus)}
        </div>
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[#003044]">
            Therapy Sessions
          </h3>
          {sessions.map((session, index) => (
            <div
              key={`${session.sessionNumber}-${index}`}
              className="rounded-lg border border-slate-200 p-4"
            >
              <strong>Session {index + 1}</strong>
              <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                {detail("Date", session.date)}
                {detail("Time", session.time)}
                {detail("Type", session.sessionType)}
                {detail("Location", session.location)}
                {detail("Amount paid", `₹${session.amountPaid ?? 0}`)}
                {detail("Remarks", session.remarks)}
                {detail("Status", session.status)}
              </dl>
            </div>
          ))}
        </section>
        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-[#003044]">
            Meet your therapist
          </h3>
          <p className="whitespace-pre-line text-sm text-slate-700">
            {therapistBody}
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-[#003044]">
            Informed Consent
          </h3>
          <p className="whitespace-pre-line text-sm text-slate-700">
            {consentBody}
          </p>
        </section>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="admin-button-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button type="button" className="btn-primary" onClick={downloadPdf}>
            Download PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}

function BookingDetailsForm({
  booking,
  onClose,
  onSaved,
}: {
  booking: Booking;
  onClose: () => void;
  onSaved: (message: string, booking: Booking) => void;
}) {
  const [form, setForm] = useState({
    ...booking,
    therapyGoals: booking.therapyGoals || [],
    sessions: getBookingSessions(booking),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (field: string, value: unknown) =>
    setForm((current) => ({ ...current, [field]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const formValues = form as unknown as Record<string, unknown>;
      const payload = await requestApi(ADMIN_BOOKING(booking.bookingId), {
        method: "PATCH",
        body: JSON.stringify({
          ...Object.fromEntries(
            Object.entries(formValues).filter(
              ([, value]) =>
                value !== undefined && value !== "" && value !== "sessions",
            ),
          ),
          sessions: form.sessions,
        }),
      });
      onSaved(payload.message, payload.data.booking);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update booking.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={`Booking details: ${booking.bookingId}`} onClose={onClose}>
      <form
        onSubmit={submit}
        className="space-y-5 max-h-[75vh] overflow-y-auto pr-2"
      >
        {error && <Notice>{error}</Notice>}
        <div className="grid sm:grid-cols-2 gap-4">
          {(
            [
              ["firstName", "First name"],
              ["lastName", "Last name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["whatsappNumber", "WhatsApp"],
              ["dob", "Date of birth"],
              ["location", "Location"],
              ["occupation", "Occupation"],
              ["medicationDetails", "Medication details"],
              ["therapyGoalsOther", "Other therapy goal"],
              ["addNotes", "Additional notes"],
            ] as const
          ).map(([field, label]) => (
            <label key={field} className="admin-label">
              {label}
              <input
                className={fieldClass}
                value={String(
                  (form as unknown as Record<string, unknown>)[field] || "",
                )}
                onChange={(e) => update(field, e.target.value)}
              />
            </label>
          ))}
          <label className="admin-label">
            Gender
            <select
              className={fieldClass}
              value={form.identifyYourGender || ""}
              onChange={(e) => update("identifyYourGender", e.target.value)}
            >
              <option value="">Not provided</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-Binary</option>
              <option>Transgender</option>
              <option>Prefer not to say</option>
              <option>Other</option>
            </select>
          </label>
          <label className="admin-label">
            Session mode
            <select
              className={fieldClass}
              value={form.sessionMode || ""}
              onChange={(e) => update("sessionMode", e.target.value)}
            >
              <option value="">Not provided</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
          </label>
          <label className="admin-label">
            Relationship status
            <select
              className={fieldClass}
              value={form.relationShipStatus || ""}
              onChange={(e) => update("relationShipStatus", e.target.value)}
            >
              <option value="">Not provided</option>
              <option>Single</option>
              <option>In a relationship</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
              <option>Other</option>
            </select>
          </label>
          <label className="admin-label">
            Number of children
            <input
              className={fieldClass}
              type="number"
              min="0"
              value={form.numberOfChildren ?? 0}
              onChange={(e) =>
                update("numberOfChildren", Number(e.target.value))
              }
            />
          </label>
          <label className="admin-label">
            How they heard about us
            <select
              className={fieldClass}
              value={form.whereuknowaboutus || ""}
              onChange={(e) => update("whereuknowaboutus", e.target.value)}
            >
              <option value="">Not provided</option>
              <option>Social Media</option>
              <option>Friend/Family</option>
              <option>Search Engine</option>
              <option>Advertisement</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <div className="space-y-3 text-sm">
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.currentlyTakingAnyPsychiatricMedication)}
              onChange={(e) =>
                update(
                  "currentlyTakingAnyPsychiatricMedication",
                  e.target.checked,
                )
              }
            />{" "}
            Taking psychiatric medication
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.InformedConsentforTherapySessions)}
              onChange={(e) =>
                update(
                  "InformedConsentforTherapySessions",
                  e.target.checked ? "I agree" : "",
                )
              }
            />{" "}
            Consent given
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.conformationOfBooking)}
              onChange={(e) =>
                update("conformationOfBooking", e.target.checked)
              }
            />{" "}
            Booking confirmed by client
          </label>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <strong className="text-sm">Sessions</strong>
            <button
              type="button"
              className="admin-button-secondary"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  sessions: [
                    ...(current.sessions || []),
                    {
                      sessionNumber: (current.sessions?.length || 0) + 1,
                      date: "",
                      time: "",
                      sessionType: "Online",
                      location: "",
                      amountPaid: 0,
                      remarks: "",
                      status: "scheduled",
                    },
                  ],
                }))
              }
            >
              + Add More Session
            </button>
          </div>
          <div className="space-y-4">
            {(form.sessions || []).map((session, index) => (
              <div
                key={`${session.sessionNumber}-${index}`}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <strong className="text-sm">Session {index + 1}</strong>
                  {index > 0 && (
                    <button
                      type="button"
                      className="admin-button-quiet"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          sessions: (current.sessions || [])
                            .filter((_, sessionIndex) => sessionIndex !== index)
                            .map((item, sessionIndex) => ({
                              ...item,
                              sessionNumber: sessionIndex + 1,
                            })),
                        }))
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="admin-label">
                    Date
                    <input
                      className={fieldClass}
                      type="date"
                      value={session.date}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          sessions: (current.sessions || []).map(
                            (item, sessionIndex) =>
                              sessionIndex === index
                                ? { ...item, date: e.target.value }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className="admin-label">
                    Time
                    <input
                      className={fieldClass}
                      value={session.time}
                      placeholder="10:30 AM"
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          sessions: (current.sessions || []).map(
                            (item, sessionIndex) =>
                              sessionIndex === index
                                ? { ...item, time: e.target.value }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className="admin-label">
                    Session type
                    <select
                      className={fieldClass}
                      value={session.sessionType}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          sessions: (current.sessions || []).map(
                            (item, sessionIndex) =>
                              sessionIndex === index
                                ? {
                                    ...item,
                                    sessionType: e.target
                                      .value as BookingSession["sessionType"],
                                  }
                                : item,
                          ),
                        }))
                      }
                    >
                      <option>Online</option>
                      <option>Offline</option>
                    </select>
                  </label>
                  <label className="admin-label">
                    Location
                    <input
                      className={fieldClass}
                      value={session.location || ""}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          sessions: (current.sessions || []).map(
                            (item, sessionIndex) =>
                              sessionIndex === index
                                ? { ...item, location: e.target.value }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className="admin-label">
                    Amount paid
                    <input
                      className={fieldClass}
                      type="number"
                      min="0"
                      value={session.amountPaid ?? 0}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          sessions: (current.sessions || []).map(
                            (item, sessionIndex) =>
                              sessionIndex === index
                                ? {
                                    ...item,
                                    amountPaid: Number(e.target.value),
                                  }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className="admin-label">
                    Remarks
                    <input
                      className={fieldClass}
                      value={session.remarks || ""}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          sessions: (current.sessions || []).map(
                            (item, sessionIndex) =>
                              sessionIndex === index
                                ? { ...item, remarks: e.target.value }
                                : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className="admin-label">
                    Status
                    <select
                      className={fieldClass}
                      value={session.status}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          sessions: (current.sessions || []).map(
                            (item, sessionIndex) =>
                              sessionIndex === index
                                ? {
                                    ...item,
                                    status: e.target
                                      .value as BookingSession["status"],
                                  }
                                : item,
                          ),
                        }))
                      }
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no_show">No show</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <strong className="text-sm">Therapy goals</strong>
          <div className="mt-2 grid gap-2 text-sm">
            {therapyGoalOptions.map((goal) => (
              <label key={goal} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={form.therapyGoals?.includes(goal)}
                  onChange={(e) =>
                    update(
                      "therapyGoals",
                      e.target.checked
                        ? [...(form.therapyGoals || []), goal]
                        : (form.therapyGoals || []).filter(
                            (item) => item !== goal,
                          ),
                    )
                  }
                />{" "}
                {goal}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="admin-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save details"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function RescheduleForm({
  booking,
  onClose,
  onSaved,
}: {
  booking: Booking;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [date, setDate] = useState(booking.selectedDate);
  const [time, setTime] = useState(booking.selectedTime);
  const [sessionType, setSessionType] = useState(
    isOnlineSessionTime(booking.selectedTime) ? "Online" : booking.sessionType,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = await requestApi(
        ADMIN_BOOKING_RESCHEDULE(booking.bookingId),
        { method: "PATCH", body: JSON.stringify({ date, time, sessionType }) },
      );
      onSaved(payload.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reschedule.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={`Reschedule ${booking.bookingId}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        {error && <Notice>{error}</Notice>}
        <label className="admin-label">
          Date
          <input
            className={fieldClass}
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="admin-label">
            Time
            <select
              className={fieldClass}
              required
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                if (isOnlineSessionTime(e.target.value)) setSessionType("Online");
              }}
            >
              {standardBookingTimes.map((slot) => <option key={slot}>{slot}</option>)}
            </select>
          </label>
          <label className="admin-label">
            Session type
            <select
              className={fieldClass}
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
            >
              <option>Online</option>
              <option disabled={isOnlineSessionTime(time)}>Offline</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="admin-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Reschedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function SlotAvailabilityManager() {
  const [dates, setDates] = useState<AvailabilityDate[]>([]);
  const [activeDate, setActiveDate] = useState("");
  const [settings, setSettings] = useState<AvailabilitySettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await requestApi(ADMIN_AVAILABILITY);
      const nextDates: AvailabilityDate[] = payload.data?.dates || [];
      setDates(nextDates);
      setSettings(payload.data?.settings || null);
      setActiveDate((current) =>
        nextDates.some((date) => date.date === current)
          ? current
          : nextDates[0]?.date || "",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load slot availability.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  const selected = dates.find((date) => date.date === activeDate) || dates[0];

  async function toggle(slot: Slot) {
    if (!selected || ["booked", "break", "past"].includes(slot.status)) return;
    const key = `${selected.date}-${slot.time}-${slot.sessionType}`;
    setActing(key);
    setError("");
    setMessage("");
    try {
      const nextStatus = slot.status === "blocked" ? "available" : "blocked";
      const payload = await requestApi(ADMIN_AVAILABILITY, {
        method: "PATCH",
        body: JSON.stringify({
          action: "slot",
          date: selected.date,
          time: slot.time,
          sessionType: slot.sessionType,
          status: nextStatus,
        }),
      });
      setMessage(payload.message);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update slot.");
    } finally {
      setActing("");
    }
  }

  async function saveSettings() {
    if (!settings) return;
    setActing("settings");
    setError("");
    setMessage("");
    try {
      const payload = await requestApi(ADMIN_AVAILABILITY, {
        method: "PATCH",
        body: JSON.stringify({ action: "settings", ...settings }),
      });
      setMessage(payload.message);
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save availability settings.",
      );
    } finally {
      setActing("");
    }
  }

  async function toggleDateBlock() {
    if (!selected) return;
    setActing(`date-${selected.date}`);
    setError("");
    setMessage("");
    try {
      const payload = await requestApi(ADMIN_AVAILABILITY, {
        method: "PATCH",
        body: JSON.stringify({
          action: "date",
          date: selected.date,
          status: selected.isBlocked ? "available" : "blocked",
        }),
      });
      setMessage(payload.message);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update this date.",
      );
    } finally {
      setActing("");
    }
  }

  return (
    <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-label-md uppercase tracking-[0.14em] ui-accent">
            Availability
          </p>
          <h2 className="text-headline-lg ui-heading">Manage Session Slots</h2>
          <p className="mt-1 text-sm ui-copy">
            Select a date, then toggle an empty slot between available and not
            available.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="admin-button-secondary"
            onClick={() => setShowSettings((value) => !value)}
          >
            {showSettings ? "Close Settings" : "Working Hours & Breaks"}
          </button>
          <button
            className="admin-button-secondary"
            onClick={load}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>
      {message && <Notice kind="success">{message}</Notice>}
      {error && <Notice>{error}</Notice>}
      {showSettings && settings && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-3 font-semibold text-[#003044]">
            Working Hours &amp; Breaks · {settings.timezone}
          </h3>
          <p className="mb-4 rounded-lg bg-white p-3 text-sm leading-6 text-slate-700">
            Standard appointments are 60 minutes with a 30-minute buffer. The four daily start times are 11:00 AM, 12:30 PM, 4:00 PM, and 5:30 PM.
          </p>
          <div className="grid gap-2">
            {settings.workingHours.map((hours, index) => (
              <div
                key={hours.dayOfWeek}
                className="rounded-lg bg-white p-2"
              >
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hours.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workingHours: settings.workingHours.map(
                          (item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, enabled: e.target.checked }
                              : item,
                        ),
                      })
                    }
                  />
                  {
                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                      hours.dayOfWeek
                    ]
                  }
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <strong className="text-sm">Recurring Breaks</strong>
            <button
              type="button"
              className="admin-button-secondary"
              onClick={() =>
                setSettings({
                  ...settings,
                  breaks: [
                    ...settings.breaks,
                    {
                      dayOfWeek: 1,
                      start: "13:00",
                      end: "14:00",
                      label: "Break",
                    },
                  ],
                })
              }
            >
              + Add Break
            </button>
          </div>
          {settings.breaks.map((item, index) => (
            <div
              key={`${item.dayOfWeek}-${index}`}
              className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <select
                className={fieldClass}
                value={item.dayOfWeek}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    breaks: settings.breaks.map((entry, itemIndex) =>
                      itemIndex === index
                        ? { ...entry, dayOfWeek: Number(e.target.value) }
                        : entry,
                    ),
                  })
                }
              >
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, dayIndex) => (
                  <option key={day} value={dayIndex}>
                    {day}
                  </option>
                ))}
              </select>
              <input
                className={fieldClass}
                type="time"
                value={item.start}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    breaks: settings.breaks.map((entry, itemIndex) =>
                      itemIndex === index
                        ? { ...entry, start: e.target.value }
                        : entry,
                    ),
                  })
                }
              />
              <input
                className={fieldClass}
                type="time"
                value={item.end}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    breaks: settings.breaks.map((entry, itemIndex) =>
                      itemIndex === index
                        ? { ...entry, end: e.target.value }
                        : entry,
                    ),
                  })
                }
              />
              <button
                type="button"
                className="admin-button-secondary"
                onClick={() =>
                  setSettings({
                    ...settings,
                    breaks: settings.breaks.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-primary mt-4"
            disabled={acting === "settings"}
            onClick={saveSettings}
          >
            {acting === "settings" ? "Saving…" : "Save Settings"}
          </button>
        </div>
      )}
      {loading && dates.length === 0 ? (
        <LoadingState label="Loading slot availability…" />
      ) : (
        <>
          <div
            role="tablist"
            aria-label="Manage availability by date"
            className="mb-5 grid grid-cols-4 gap-2 sm:grid-cols-7"
          >
            {dates.map((date) => (
              <button
                key={date.date}
                type="button"
                role="tab"
                aria-selected={date.date === selected?.date}
                onClick={() => setActiveDate(date.date)}
                className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${date.date === selected?.date ? "border-[#003044] bg-[#003044] text-white" : "border-slate-200 bg-[#f8fafb] text-[#1b1c19] hover:border-[#003044]"}`}
              >
                {date.label}
              </button>
            ))}
          </div>
          {selected && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <strong>{selected.label}</strong>
              <button
                type="button"
                className="admin-button-secondary"
                disabled={acting === `date-${selected.date}`}
                onClick={toggleDateBlock}
              >
                {selected.isBlocked ? "Unblock Date" : "Block Complete Date"}
              </button>
            </div>
          )}
          <div className="mb-4 flex flex-wrap gap-4 text-sm ui-copy">
            <span>🟩 Booked</span>
            <span>⬜ Available</span>
            <span>🟥 Not Available</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selected?.slots.map((slot) => {
              const key = `${selected.date}-${slot.time}-${slot.sessionType}`;
              const booked = slot.status === "booked";
              const unavailable = slot.status === "blocked";
              return (
                <button
                  key={key}
                  type="button"
                  disabled={booked || acting === key}
                  onClick={() => toggle(slot)}
                  className={`rounded-xl border p-4 text-left transition ${booked ? "cursor-not-allowed border-emerald-300 bg-emerald-100 text-emerald-950" : unavailable ? "border-red-300 bg-red-100 text-red-950 hover:bg-red-50" : "border-slate-200 bg-white text-[#1b1c19] hover:border-[#003044]"}`}
                >
                  <span className="flex justify-between gap-3">
                    <strong>{slot.time}</strong>
                    <span className="text-xs font-semibold uppercase">
                      {unavailable ? "Not Available" : slot.status}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm">{slot.sessionType}</span>
                  {!booked && (
                    <span className="mt-3 block text-xs font-semibold ui-accent">
                      {acting === key
                        ? "Updating…"
                        : unavailable
                          ? "Mark Available"
                          : "Mark Not Available"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
