import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LegalContentsSidebar from "@/components/ui/LegalContentsSidebar";

export const metadata: Metadata = {
  title: "Privacy Policy | Mind And Soul Klinic",
  description:
    "Your privacy matters. Learn what information Mind And Soul Klinic collects, how we use it, and how we protect your confidentiality.",
};

const sections = [
  {
    id: "your-consent",
    number: "00",
    title: "Your Consent",
    shortTitle: "Your Consent",
    content: (
      <p>
        By using our website or submitting information through it, you
        acknowledge this Privacy Policy. Where consent is required by applicable
        law, we will seek it for the relevant processing.
      </p>
    ),
  },
  {
    id: "scope-of-policy",
    number: "01",
    title: "1. Scope of This Policy",
    shortTitle: "Scope of Policy",
    content: (
      <p>
        This Privacy Policy applies to personal information collected through
        adorelife.in, our enquiry and booking forms, client accounts, and
        related online services. It does not cover information collected offline
        or by third-party websites and services that have their own privacy
        policies.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    number: "02",
    title: "2. Information We Collect",
    shortTitle: "Information We Collect",
    content: (
      <>
        <p>
          The information we request and why we need it will be shown when you
          provide it. Depending on how you use Mind And Soul Klinic, we may
          collect:
        </p>
        <div className="grid grid-cols-1 gap-3 pt-1">
          {[
            {
              label: "Enquiry details",
              text: "Name, email address, phone number, preferred session or format, and the message you choose to send.",
            },
            {
              label: "Account details",
              text: "Name, email address, phone number if provided, and authentication information. Account passwords are stored in hashed form rather than as plain text.",
            },
            {
              label: "Booking details",
              text: "Contact details, date of birth, gender, WhatsApp number, location, occupation, relationship status, number of children, selected service and appointment details, and payment status.",
            },
            {
              label: "Information you share for therapy",
              text: "Therapy goals, notes, consent responses, and information about medication or other matters that you choose or are asked to provide in the booking process.",
            },
            {
              label: "Technical and usage information",
              text: "Information such as IP address, browser and device details, referring page, and access times may be processed by website hosting, security, or infrastructure services when you use the site.",
            },
          ].map(({ label, text }) => (
            <div
              key={label}
              className="rounded-xl border border-black/[0.06] bg-black/[0.02] p-4"
            >
              <p className="text-sm font-semibold ui-heading">{label}</p>
              <p className="mt-1 text-sm leading-relaxed ui-copy">{text}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    number: "03",
    title: "3. How We Use Information",
    shortTitle: "How We Use Information",
    content: (
      <ul className="space-y-3">
        <li>
          Respond to enquiries and communicate with you about your request.
        </li>
        <li>
          Create and manage accounts, appointments, payments, and client
          services.
        </li>
        <li>
          Provide, operate, maintain, and improve the website and our services.
        </li>
        <li>
          Send service messages, booking updates, account verification codes,
          and other relevant information.
        </li>
        <li>
          Protect the website, prevent misuse or fraud, and meet legal or
          professional obligations.
        </li>
      </ul>
    ),
  },
  {
    id: "confidentiality",
    number: "04",
    title: "4. Confidentiality of Therapy Information",
    shortTitle: "Therapy Confidentiality",
    content: (
      <>
        <p>
          Information shared in connection with therapy is handled with care and
          confidentiality, subject to applicable legal and professional
          obligations. Disclosure may be necessary where required by law or in
          serious safety situations.
        </p>
        <div className="rounded-xl border border-black/[0.08] bg-black/[0.025] px-4 py-3 text-sm">
          Please use the booking form only to provide information relevant to
          arranging and delivering services.
        </div>
      </>
    ),
  },
  {
    id: "payments-service-providers",
    number: "05",
    title: "5. Payments and Service Providers",
    shortTitle: "Payments & Providers",
    content: (
      <>
        <div className="rounded-xl border border-emerald-900/15 bg-emerald-50/50 px-4 py-3 text-sm ui-heading">
          <span className="font-semibold">Secure Checkout:</span> Online
          payments are processed through Razorpay. We do not store your full
          card number or card security code.
        </div>
        <p>
          Payment information is submitted to Razorpay and handled under its
          privacy and security practices. Mind And Soul Klinic receives payment
          and transaction details needed to confirm and manage a booking. We may
          also use service providers for website hosting, database storage,
          email delivery, security, and other operational needs. These providers
          process information to provide their services to us.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    number: "06",
    title: "6. Cookies and Similar Technologies",
    shortTitle: "Cookies & Storage",
    content: (
      <p>
        Mind And Soul Klinic uses essential browser storage and authentication
        cookies to support account sign-in, security, and site operation. The
        website may also use session storage for temporary navigation state.
        Third-party features, such as payment checkout or embedded maps, may use
        their own cookies or similar technologies under their providers&apos;
        policies. You can manage cookies through your browser settings, though
        disabling essential cookies may affect some site features.
      </p>
    ),
  },
  {
    id: "when-information-shared",
    number: "07",
    title: "7. When Information May Be Shared",
    shortTitle: "Information Sharing",
    content: (
      <>
        <p>We may share information:</p>
        <ul className="space-y-3">
          <li>
            With service providers who help us operate the website and deliver
            services.
          </li>
          <li>With payment providers to process and verify transactions.</li>
          <li>
            When required by law, court order, or a valid request from an
            authority.
          </li>
          <li>
            When necessary to protect the rights, safety, or security of
            clients, Mind And Soul Klinic, or others.
          </li>
        </ul>
        <div className="mt-2 rounded-xl border border-black/[0.08] bg-black/[0.025] px-4 py-3 text-sm font-medium ui-heading">
          We do not sell your personal information.
        </div>
      </>
    ),
  },
  {
    id: "data-retention-security",
    number: "08",
    title: "8. Data Retention and Security",
    shortTitle: "Retention & Security",
    content: (
      <p>
        We keep personal information only for as long as needed for the purposes
        described in this policy, to provide services, resolve disputes, and
        meet applicable legal, accounting, or professional requirements. We use
        reasonable safeguards to protect information, but no method of online
        transmission or storage can be guaranteed to be completely secure.
      </p>
    ),
  },
  {
    id: "your-choices-requests",
    number: "09",
    title: "9. Your Choices and Requests",
    shortTitle: "Your Choices & Requests",
    content: (
      <p>
        You may contact us to request access to, correction of, or deletion of
        personal information you have provided, or to raise a privacy concern.
        We may need to retain some information where required by law or for
        legitimate service, safety, or record-keeping purposes. We will handle
        requests in accordance with applicable law.
      </p>
    ),
  },
  {
    id: "children-young-people",
    number: "10",
    title: "10. Children and Young People",
    shortTitle: "Children & Young People",
    content: (
      <p>
        We take the privacy of children and young people seriously. Where a
        service involves a person under 18, a parent or legal guardian should be
        involved where required by applicable law and professional practice. If
        you believe a child has provided personal information inappropriately,
        please contact us so we can review the request.
      </p>
    ),
  },
  {
    id: "third-party-websites",
    number: "11",
    title: "11. Third-Party Websites",
    shortTitle: "Third-Party Websites",
    content: (
      <p>
        Our website may link to third-party websites or include third-party
        features. We do not control their privacy practices. Please review the
        relevant provider&apos;s privacy policy before sharing information with
        them.
      </p>
    ),
  },
  {
    id: "changes-to-policy",
    number: "12",
    title: "12. Changes to This Policy",
    shortTitle: "Changes to Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Any revised version
        will be published on this page with an updated effective date.
      </p>
    ),
  },
  {
    id: "contact-us",
    number: "13",
    title: "13. Contact Us",
    shortTitle: "Contact Us",
    content: (
      <>
        <p>For privacy questions or requests, contact:</p>

        <div className="mt-3 space-y-2.5 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-5">
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
            <p>
              <span className="font-medium ui-heading">Website: </span>
              <a
                className="ui-accent underline underline-offset-4 transition-opacity hover:opacity-80"
                href="https://www.mindandsoulklinic.com/"
              >
                adorelife.in
              </a>
            </p>
          </div>
        </div>

        <p className="pt-1 text-sm">
          You can also use our{" "}
          <Link
            className="ui-accent font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
            href="/contact"
          >
            contact page
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
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

            <h1 className="text-headline-lg mt-2 ui-heading">Privacy Policy</h1>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/[0.03] px-3.5 py-1 text-xs font-medium ui-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Effective Date: October 25, 2026</span>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed ui-copy">
              Your privacy matters. This policy explains what information we
              collect when you use Mind And Soul Klinic&apos;s website and
              services, and how we use and protect it.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
            <LegalContentsSidebar
              items={tocItems}
              ariaLabel="Privacy Policy sections"
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

                  <div className="space-y-3.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul>li::marker]:opacity-50">
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