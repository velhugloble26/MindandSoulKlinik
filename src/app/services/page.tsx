
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Counselling Services",
  description:
    "Explore individual, career, family, and relationship counselling services at Mind and Soul Klinik.",
};

const services = [
  {
    number: "01",
    title: "Individual Counselling",
    image: "/01~mv2.avif",
    imageAlt: "Individual counselling",
    subtitle: "Your journey towards personal growth and emotional well-being.",
    description:
      "During challenging times in life, individual therapy provides an opportunity for personal growth and support on a focused level. Individual counselling offers a safe, comforting, and confidential environment where you can explore your thoughts, feelings, and behaviours with a qualified mental health therapist.",
    points: [
      "Anger Management",
      "Depression",
      "Anxiety",
      "Substance Abuse",
      "Marital and Relationship Difficulties",
      "Parenting Challenges",
      "Academic Struggles",
      "Career Changes",
    ],
    footer:
      "Together, we work towards personal development, emotional balance, and a healthier perspective on life.",
    link: "/book-session",
    button: "Book a Session",
  },
  {
    number: "02",
    title: "Career Assessment & Counselling",
    image: "/02.avif",
    imageAlt: "Career assessment and counselling",
    subtitle: "Discover your strengths. Define your future.",
    description:
      "As a career counsellor, I am dedicated to helping individuals navigate their professional journeys with confidence and clarity. Whether you are a recent graduate, a mid-career professional, or considering a career change, personalized guidance can help you move forward.",
    points: [
      "Career Assessment & Exploration",
      "Goal Setting & Career Planning",
      "Resume Building",
      "Interview Preparation & Mock Interviews",
      "Career Transition Support",
      "Work-Life Balance",
      "Personalized Career Guidance",
    ],
    footer:
      "Let's identify your potential, explore opportunities, and create a practical roadmap for your career aspirations.",
    link: "/book-session",
    button: "Book a Session",
  },
  {
    number: "03",
    title: "Family Counselling",
    image: "/03.avif",
    imageAlt: "Family counselling",
    subtitle: "Building stronger families through understanding and support.",
    description:
      "Family counselling offers valuable support for repairing fractured relationships, developing healthy coping mechanisms, and learning how to care for loved ones. It helps families work together more effectively while fostering cooperation, empathy, and understanding.",
    points: [
      "Family Relationship Difficulties",
      "Communication & Understanding",
      "Managing Family Conflicts",
      "Coping With Stress",
      "Marital & Financial Concerns",
      "Supporting Loved Ones With Illness",
      "Navigating Life Changes",
    ],
    footer:
      "We provide a safe and confidential space to discuss sensitive issues and work towards healthier family relationships.",
    link: "/book-session",
    button: "Book a Session",
  },
  {
    number: "04",
    title: "Relationship Building",
    image: "/04.avif",
    imageAlt: "Relationship counselling",
    subtitle: "Reconnect, communicate, and grow together.",
    description:
      "Every relationship experiences its ups and downs. With professional couples counselling, you can work through challenges, strengthen your partnership, and rebuild emotional connections. Taking timely steps can make a meaningful difference.",
    points: [
      "Rebuilding Broken Trust",
      "Improving Communication",
      "Managing Frequent Arguments",
      "Conflict Resolution",
      "Restoring Emotional Intimacy",
      "Understanding Relationship Challenges",
      "Strengthening Your Partnership",
    ],
    footer:
      "Whether you want to strengthen your relationship or rebuild it, we are here to support you every step of the way.",
    link: "/book-session",
    button: "Book a Session",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="design-system-page">
      <section className="relative overflow-hidden border-b border-[#e4eceb] bg-gradient-to-br from-[#f2f9f9] via-[#fafcfb] to-[#edf6f5] py-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#cce7e5]/45 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 right-0 h-[420px] w-[420px] rounded-full bg-[#e6dfc8]/35 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1740px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Left Content: 7 Columns */}
            <div className="max-w-2xl text-left lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d3e4e3] bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#00646a] shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#00646a]" />
                How We Can Help
              </span>

              <h1 className="heading-xl mt-6 text-left text-[#003044]">
                Counselling Services for a{" "}
                <span className="relative inline-block text-[#00646a]">
                  Better You
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[#C5A253]/80"
                  />
                </span>
              </h1>

              <p className="text-body mt-6 max-w-xl text-left text-[#42666b]">
                Every individual and relationship has a unique journey. Discover
                personalized counselling and guidance designed to help you find
                clarity, build confidence, and create meaningful positive changes in
                life.
              </p>

              {/* Dual CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/book-session"
                  className="inline-flex items-center justify-center rounded-xl bg-[#00646a] px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_10px_25px_rgba(0,100,106,0.2)] transition-all duration-200 hover:bg-[#004b50]"
                >
                  Book a Session
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-[#c7dcdd] bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-[#003044] transition-all duration-200 hover:border-[#00646a] hover:bg-[#f2f9f9]"
                >
                  Get in Touch
                </Link>
              </div>

              {/* Trust Strip */}
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-[#dfeae9] pt-6 text-xs font-medium text-[#4a6f73] sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-bold text-[#00646a]">✓</span> 100%
                  Confidential Space
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-bold text-[#00646a]">✓</span> Online Video
                  Sessions
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-bold text-[#00646a]">✓</span> In-Clinic (Delhi
                  NCR)
                </span>
              </div>
            </div>

            {/* Right Brand Showcase: 5 Columns */}
            <div className="mx-auto w-full max-w-[410px] lg:col-span-5 lg:ml-auto lg:mr-0">
              <div className="relative">
                {/* Outer Gold Border Frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-2.5 rounded-[26px] border border-[#C5A253]/45 bg-white/30"
                />

                <div className="relative flex flex-col items-center rounded-3xl border border-[#dce8e7] bg-white/95 p-7 text-center shadow-[0_20px_50px_rgba(0,48,68,0.08)] sm:p-8">
                  <Image
                    src="/website_logo.avif"
                    alt="Mind and Soul Klinik"
                    width={216}
                    height={188}
                    priority
                    className="mx-auto h-auto max-h-[155px] w-auto object-contain"
                  />

                  <div className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#C5A253] to-transparent" />

                  <p className="mt-3 text-xs font-medium text-[#52777b]">
                    Guided by{" "}
                    <strong className="font-semibold text-[#003044]">
                      Therapy by Nidhi
                    </strong>
                  </p>

                  {/* Clean Info Rows */}
                  <div className="mt-6 w-full divide-y divide-[#ebf2f1] border-y border-[#ebf2f1] text-left text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-2 py-3">
                      <span className="font-medium text-[#2c5358]">
                        Individual &amp; Couple Therapy
                      </span>
                      <span className="shrink-0 font-semibold text-[#00646a]">
                        60–90 mins
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 py-3">
                      <span className="font-medium text-[#2c5358]">
                        15-Min Intro Consultation
                      </span>
                      <span className="shrink-0 font-semibold text-[#00646a]">
                        ₹500
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/book-session"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#00646a] transition-colors hover:text-[#003044]"
                  >
                    <span>Start with a Call</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        <section className="section section-alt">
          <div className="container-site">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="badge badge-soft">Our Expertise</span>
              <h2 className="heading-lg mt-4">
                Services Designed Around You
              </h2>
              <p className="text-body mx-auto mt-5">
                From personal challenges to professional goals and relationship
                concerns, find the support you need.
              </p>
            </div>

            <div className="services-list">
              {services.map((service, index) => (
                <article
                  key={service.number}
                  className={`service-card-layout${index % 2 === 1 ? " service-card-reverse" : ""}`}
                >
                  <div className="service-card-content">
                    <div className="service-card-number">
                      <span>{service.number}</span>
                      <span aria-hidden="true" />
                    </div>
                    <h3 className="heading-md">{service.title}</h3>
                    <p className="service-card-subtitle mt-3">
                      {service.subtitle}
                    </p>
                    <p className="mt-5">{service.description}</p>
                    <div className="my-6">
                      <h4 className="font-semibold text-(--heading)">
                        How We Can Help
                      </h4>
                      <ul className="check-list sm:grid-cols-2">
                        {service.points.map((point) => (
                          <li key={point}>
                            <span
                              className="service-card-check"
                              aria-hidden="true"
                            >
                              ✦
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="mb-6">{service.footer}</p>
                    <div className="service-card-footer mt-auto">
                      <Link href={service.link} className="btn btn-outline">
                        {service.button}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                  <div className="service-card-image">
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      width={800}
                      height={600}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="service-cta section text-center">
          <div className="container-site">
            <span className="badge badge-soft">Take the First Step</span>
            <h2 className="heading-lg mt-5">
              Your Well-Being Matters
            </h2>
            <p className="text-body mx-auto mt-6 max-w-xl">
              You don't have to navigate life's challenges alone. Let's work
              together towards a happier, healthier, and more fulfilling life.
            </p>
            <Link href="/contact" className="btn btn-outline mt-8">
              Let's Talk
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
