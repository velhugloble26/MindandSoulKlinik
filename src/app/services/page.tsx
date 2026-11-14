
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
        <section className="services-hero hero-glow section">
          <div className="container-site services-hero-grid">
            <div className="services-hero-copy">
              <span className="badge">How We Can Help</span>
              <h1 className="heading-xl mt-5">
                Counselling Services for a Better You
              </h1>
              <p className="text-body mt-6">
                Every individual and relationship has a unique journey. Discover
                personalized counselling and guidance designed to help you find
                clarity, build confidence, and create meaningful positive changes
                in life.
              </p>
              <Link href="/contact" className="btn btn-primary mt-8">
                Get in Touch
              </Link>
            </div>
            <div className="services-hero-image">
              <Image
                src="/website_logo.avif"
                alt="Mind and Soul Klinik"
                width={216}
                height={188}
                priority
              />
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
