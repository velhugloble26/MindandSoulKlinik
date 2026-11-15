import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Mind And Soul Klinic",
  description:
    "Review the terms and conditions for booking and using therapy, consultation, and wellness services at Mind And Soul Klinic.",
};

const sections = [
  {
    title: "1. Services Offered",
    content: (
      <>
        <p>Mind And Soul Klinic provides:</p>
        <ul>
          <li>Individual Therapy</li>
          <li>Couples Therapy</li>
          <li>Consultation Calls</li>
          <li>Wellness Packages</li>
        </ul>

        <p>
          The fees, duration and inclusions of each service will be communicated
          before booking.
        </p>
      </>
    ),
  },

  {
    title: "2. Appointments & Payments",
    content: (
      <ul>
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
          If Mind And Soul Klinic needs to reschedule an appointment, an alternative
          appointment or applicable refund will be offered.
        </li>
      </ul>
    ),
  },

  {
    title: "3. Cancellation, Rescheduling & Refunds",
    content: (
      <ul>
        <li>
          One rescheduling is permitted with at least 24 hours&apos; advance
          notice.
        </li>

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
          Exceptional circumstances may be considered on a case-by-case basis.
        </li>
      </ul>
    ),
  },

  {
    title: "4. Confidentiality & Privacy",
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
          <Link className="underline" href="/privacy-policy">
            Privacy Policy
          </Link>{" "}
          and applicable data protection laws.
        </p>
      </>
    ),
  },

  {
    title: "5. Nature of Therapy",
    content: (
      <p>
        Therapy is a collaborative process, and outcomes vary from person to
        person. Mind And Soul Klinic does not guarantee specific therapeutic or
        relationship outcomes. Our services do not replace emergency care or
        medical treatment where required.
      </p>
    ),
  },

  {
    title: "6. Online Sessions & Communication",
    content: (
      <ul>
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
    title: "7. Client Conduct",
    content: (
      <p>
        Clients are expected to engage respectfully and observe agreed
        professional boundaries. Abusive, threatening or inappropriate behaviour
        may result in services being paused or discontinued, as appropriate.
      </p>
    ),
  },

  {
    title: "8. Website Content",
    content: (
      <p>
        Website content and downloadable resources are intended for personal
        educational and self-reflection purposes. They must not be reproduced,
        redistributed or used commercially without permission.
      </p>
    ),
  },

  {
    title: "9. Changes to These Terms",
    content: (
      <p>
        Mind And Soul Klinic may update these Terms & Conditions from time to time.
        Revised terms will be published on the website with an updated effective
        date.
      </p>
    ),
  },

  {
    title: "10. Governing Law & Contact",
    content: (
      <>
        <p>
          These Terms & Conditions are governed by the laws of India, subject to
          applicable law.
        </p>

        <p className="font-medium ui-heading">
          Mind And Soul Klinic — By Kiran Khullar
        </p>

        <p>
          Email:{" "}
          <a
            className="ui-accent underline"
            href="mailto:mindandsoulklinic@gmail.com"
          >
            mindandsoulklinic@gmail.com
          </a>
          <br />
          Location: E-339, Greater Kailash-1, Block E, Greater Kailash I,
          Greater Kailash, New Delhi, Delhi 110048
        </p>
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />

      <main className="w-full px-margin-mobile py-section md:px-8">
        <div className="mx-auto max-w-[850px]">
          <header className="mb-12 text-center">
            <span className="text-label-lg uppercase tracking-widest mb-4 block ui-muted">
              Mind And Soul Klinic — Because everyone needs to be understood.
            </span>

            <h1 className="text-headline-lg ui-heading">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-body-md ui-copy">
              Effective Date: 8 October 2024 (08.10.2024)
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-body-lg ui-copy">
              Welcome to Mind And Soul Klinic. By booking or using our services, you agree
              to the following Terms & Conditions.
            </p>
          </header>

          <div className="space-y-9 text-body-md leading-relaxed ui-copy">
            {sections.map(({ title, content }) => (
              <section key={title} className="space-y-3">
                <h2 className="text-headline-md ui-heading">
                  {title}
                </h2>

                <div className="terms-content space-y-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
                  {content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}