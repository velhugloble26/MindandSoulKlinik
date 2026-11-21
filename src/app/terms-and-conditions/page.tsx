import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import LegalContentsSidebar from "@/components/ui/LegalContentsSidebar";
// import LegalContentsSidebar from "@/components/LegalContentsSidebar";

export const metadata: Metadata = {
  title: "Terms & Conditions | Mind And Soul Klinic",
  description:
    "Review the terms and conditions for booking and using therapy, consultation, and wellness services at Mind And Soul Klinic.",
};

const sections = [
  {
    id: "services-offered",
    number: "01",
    title: "1. Services Offered",
    shortTitle: "Services Offered",
    content: (
      <>
        <p>Mind And Soul Klinic provides:</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {[
            "Individual Therapy",
            "Couples Therapy",
            "Consultation Calls",
            "Wellness Packages",
          ].map((service) => (
            <div
              key={service}
              className="flex items-center gap-2.5 rounded-xl border border-black/[0.06] bg-black/[0.02] px-3.5 py-2.5 text-sm font-medium ui-heading"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
              <span>{service}</span>
            </div>
          ))}
        </div>
        <p className="pt-1 text-sm ui-muted">
          The fees, duration and inclusions of each service will be communicated
          before booking.
        </p>
      </>
    ),
  },
  {
    id: "appointments-payments",
    number: "02",
    title: "2. Appointments & Payments",
    shortTitle: "Appointments & Payments",
    content: (
      <ul className="space-y-3">
        <li>
          All appointments must be booked in advance and are subject to
          availability.
        </li>
        <li>
          Payment must be completed as communicated at the time of booking.
        </li>
        <li>
          Clients are requested to attend sessions on time. Late arrivals may
          result in a shorter session.
        </li>
        <li>
          If Mind And Soul Klinic needs to reschedule an appointment, an
          alternative appointment or applicable refund will be offered.
        </li>
      </ul>
    ),
  },
  {
    id: "cancellation-rescheduling",
    number: "03",
    title: "3. Cancellation, Rescheduling & Refunds",
    shortTitle: "Cancellation & Refunds",
    content: (
      <>
        <div className="rounded-xl border border-amber-900/15 bg-amber-50/60 px-4 py-3 text-sm ui-heading">
          <span className="font-semibold">24-Hour Notice Policy:</span> One
          rescheduling is permitted with at least 24 hours&apos; advance
          notice.
        </div>
        <ul className="space-y-3 pt-1">
          <li>
            Cancellations or rescheduling requests made within 24 hours, and
            missed appointments without notice, will ordinarily be treated as
            completed sessions.
          </li>
          <li>
            Further rescheduling after the permitted change will ordinarily be
            non-refundable and non-transferable.
          </li>
          <li>
            Refunds and validity conditions for wellness packages will be
            communicated before purchase.
          </li>
          <li>
            Exceptional circumstances may be considered on a case-by-case
            basis.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "confidentiality-privacy",
    number: "04",
    title: "4. Confidentiality & Privacy",
    shortTitle: "Confidentiality & Privacy",
    content: (
      <>
        <p>
          Client information is treated confidentially, subject to applicable
          legal and professional obligations. Disclosure may be necessary where
          required by law or in certain serious safety situations.
        </p>
        <p>
          Personal information collected through our website, bookings and
          services will be handled in accordance with our{" "}
          <Link
            className="ui-accent font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>{" "}
          and applicable data protection laws.
        </p>
      </>
    ),
  },
  {
    id: "nature-of-therapy",
    number: "05",
    title: "5. Nature of Therapy",
    shortTitle: "Nature of Therapy",
    content: (
      <>
        <p>
          Therapy is a collaborative process, and outcomes vary from person to
          person. Mind And Soul Klinic does not guarantee specific therapeutic
          or relationship outcomes.
        </p>
        <div className="rounded-xl border border-black/[0.08] bg-black/[0.025] px-4 py-3 text-sm">
          Our services do not replace emergency care or medical treatment where
          required.
        </div>
      </>
    ),
  },
  {
    id: "online-sessions",
    number: "06",
    title: "6. Online Sessions & Communication",
    shortTitle: "Online Sessions",
    content: (
      <ul className="space-y-3">
        <li>
          Clients are responsible for maintaining a private environment and a
          suitable internet connection for online sessions.
        </li>
        <li>
          Messages and calls outside scheduled appointments are not a substitute
          for therapy or emergency support.
        </li>
        <li>
          Sessions will not be recorded without appropriate prior consent.
        </li>
      </ul>
    ),
  },
  {
    id: "client-conduct",
    number: "07",
    title: "7. Client Conduct",
    shortTitle: "Client Conduct",
    content: (
      <p>
        Clients are expected to engage respectfully and observe agreed
        professional boundaries. Abusive, threatening or inappropriate
        behaviour may result in services being paused or discontinued, as
        appropriate.
      </p>
    ),
  },
  {
    id: "website-content",
    number: "08",
    title: "8. Website Content",
    shortTitle: "Website Content",
    content: (
      <p>
        Website content and downloadable resources are intended for personal
        educational and self-reflection purposes. They must not be reproduced,
        redistributed or used commercially without permission.
      </p>
    ),
  },
  {
    id: "changes-to-terms",
    number: "09",
    title: "9. Changes to These Terms",
    shortTitle: "Changes to Terms",
    content: (
      <p>
        Mind And Soul Klinic may update these Terms &amp; Conditions from time
        to time. Revised terms will be published on the website with an updated
        effective date.
      </p>
    ),
  },
  {
    id: "governing-law-contact",
    number: "10",
    title: "10. Governing Law & Contact",
    shortTitle: "Governing Law & Contact",
    content: (
      <>
        <p>
          These Terms &amp; Conditions are governed by the laws of India,
          subject to applicable law.
        </p>

        <div className="mt-4 space-y-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-5">
          <p className="text-base font-semibold ui-heading">
            Mind And Soul Klinic — By Kiran Khullar
          </p>

          <div className="space-y-1.5 text-sm">
            <p>
              <span className="font-medium ui-heading">Email: </span>
              <a
                className="ui-accent underline underline-offset-4 transition-opacity hover:opacity-80"
                href="mailto:mindandsoulklinic@gmail.com"
              >
                mindandsoulklinic@gmail.com
              </a>
            </p>
            <p>
              <span className="font-medium ui-heading">Location: </span>
              E-339, Greater Kailash-1, Block E, Greater Kailash I, Greater
              Kailash, New Delhi, Delhi 110048
            </p>
          </div>
        </div>
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
  const tocItems = sections.map(({ id, number, shortTitle }) => ({
    id,
    number,
    shortTitle,
  }));

  return (
    <>
      <Navbar />

      <main className="design-system-page min-h-screen w-full px-margin-mobile py-section md:px-8">
        <div className="mx-auto w-full max-w-375">
          <header className="mx-auto mb-14 max-w-3xl border-b border-black/[0.08] pb-10 text-center">
            <span className="text-label-lg mb-4 inline-block rounded-full border border-black/[0.08] bg-black/[0.02] px-4 py-1.5 uppercase tracking-widest ui-muted">
              Mind And Soul Klinic — Because everyone needs to be understood.
            </span>

            <h1 className="text-headline-lg mt-2 ui-heading">
              Terms &amp; Conditions
            </h1>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/[0.03] px-3.5 py-1 text-xs font-medium ui-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Effective Date: 8 October 2024 (08.10.2024)</span>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed ui-copy">
              Welcome to Mind And Soul Klinic. By booking or using our services,
              you agree to the following Terms &amp; Conditions.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
            <LegalContentsSidebar
              items={tocItems}
              ariaLabel="Terms and Conditions sections"
            />

            <div className="space-y-6 text-body-md leading-relaxed ui-copy">
              {sections.map(({ id, number, title, content }) => (
                <section
                  key={id}
                  id={id}
                  className="scroll-mt-28 rounded-2xl border border-black/[0.07] bg-white/70 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors hover:border-black/[0.12] sm:p-8"
                >
                  <div className="mb-4 flex items-center gap-3 border-b border-black/[0.05] pb-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] font-mono text-xs font-semibold ui-heading">
                      {number}
                    </span>
                    <h2 className="text-headline-md ui-heading">
                      {title.replace(/^\d+\.\s*/, "")}
                    </h2>
                  </div>

                  <div className="terms-content space-y-3.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul>li::marker]:opacity-50">
                    {content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}