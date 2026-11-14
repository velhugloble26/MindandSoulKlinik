import Link from "next/link";
import Navbar from "@/components/Navbar";

const sections = [
  {
    title: "1. Scope of This Policy",
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
    title: "2. Information We Collect",
    content: (
      <>
        <p>
          The information we request and why we need it will be shown when you
          provide it. Depending on how you use Adore Life, we may collect:
        </p>
        <ul>
          <li>
            <strong>Enquiry details:</strong> name, email address, phone number,
            preferred session or format, and the message you choose to send.
          </li>
          <li>
            <strong>Account details:</strong> name, email address, phone number
            if provided, and authentication information. Account passwords are
            stored in hashed form rather than as plain text.
          </li>
          <li>
            <strong>Booking details:</strong> contact details, date of birth,
            gender, WhatsApp number, location, occupation, relationship status,
            number of children, selected service and appointment details, and
            payment status.
          </li>
          <li>
            <strong>Information you share for therapy:</strong> therapy goals,
            notes, consent responses, and information about medication or other
            matters that you choose or are asked to provide in the booking
            process.
          </li>
          <li>
            <strong>Technical and usage information:</strong> information such
            as IP address, browser and device details, referring page, and
            access times may be processed by website hosting, security, or
            infrastructure services when you use the site.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "3. How We Use Information",
    content: (
      <ul>
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
    title: "4. Confidentiality of Therapy Information",
    content: (
      <p>
        Information shared in connection with therapy is handled with care and
        confidentiality, subject to applicable legal and professional
        obligations. Disclosure may be necessary where required by law or in
        serious safety situations. Please use the booking form only to provide
        information relevant to arranging and delivering services.
      </p>
    ),
  },
  {
    title: "5. Payments and Service Providers",
    content: (
      <p>
        Online payments are processed through Razorpay. Payment information is
        submitted to Razorpay and handled under its privacy and security
        practices. Adore Life receives payment and transaction details needed to
        confirm and manage a booking; we do not store your full card number or
        card security code. We may also use service providers for website
        hosting, database storage, email delivery, security, and other
        operational needs. These providers process information to provide their
        services to us.
      </p>
    ),
  },
  {
    title: "6. Cookies and Similar Technologies",
    content: (
      <p>
        Adore Life uses essential browser storage and authentication cookies to
        support account sign-in, security, and site operation. The website may
        also use session storage for temporary navigation state. Third-party
        features, such as payment checkout or embedded maps, may use their own
        cookies or similar technologies under their providers&apos; policies.
        You can manage cookies through your browser settings, though disabling
        essential cookies may affect some site features.
      </p>
    ),
  },
  {
    title: "7. When Information May Be Shared",
    content: (
      <>
        <p>We may share information:</p>
        <ul>
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
            clients, Adore Life, or others.
          </li>
        </ul>
        <p>We do not sell your personal information.</p>
      </>
    ),
  },
  {
    title: "8. Data Retention and Security",
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
    title: "9. Your Choices and Requests",
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
    title: "10. Children and Young People",
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
    title: "11. Third-Party Websites",
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
    title: "12. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Any revised version
        will be published on this page with an updated effective date.
      </p>
    ),
  },
  {
    title: "13. Contact Us",
    content: (
      <>
        <p>For privacy questions or requests, contact:</p>
        <p>
          <strong>Adore Life — By Kiran Khullar</strong>
          <br />
          Email:{" "}
          <a className="underline" href="mailto:mindandsoulklinic@gmail.com">
            mindandsoulklinic@gmail.com
          </a>
          <br />
          Location: Thane, Maharashtra, India
          <br />
          Website:{" "}
          <a className="underline" href="https://www.mindandsoulklinic.com/">
            adorelife.in
          </a>
        </p>
        <p>
          You can also use our{" "}
          <Link className="underline" href="/contact">
            contact page
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="w-full px-margin-mobile py-section md:px-8">
        <div className="mx-auto max-w-[850px]">
          <header className="mb-12 text-center">
            <span className="text-label-lg uppercase tracking-widest mb-4 block ui-muted">
              Adore Life — Because everyone needs to be understood.
            </span>
            <h1 className="text-headline-lg ui-heading">Privacy Policy</h1>
            <p className="mt-4 text-body-md ui-copy">
              Effective Date: October 25, 2026
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-body-lg ui-copy">
              Your privacy matters. This policy explains what information we
              collect when you use Adore Life&apos;s website and services, and
              how we use and protect it.
            </p>
          </header>

          <div className="space-y-9 text-body-md leading-relaxed ui-copy [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            <section className="space-y-3">
              <h2 className="text-headline-md ui-heading">Your Consent</h2>
              <p>
                By using our website or submitting information through it, you
                acknowledge this Privacy Policy. Where consent is required by
                applicable law, we will seek it for the relevant processing.
              </p>
            </section>
            {sections.map(({ title, content }) => (
              <section key={title} className="space-y-3">
                <h2 className="text-headline-md ui-heading">{title}</h2>
                <div className="space-y-3">{content}</div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
