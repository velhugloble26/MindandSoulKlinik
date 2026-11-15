
"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  MotionSection,
  MotionReveal,
  MotionText,
  MotionStagger,
  MotionItem,
  HoverZoomContainer,
  HoverZoomImage,
} from "@/components/ui/Motion";

const NIDHI_STORY_IMG = "/kiran_khullar.avif";

// EXISTING IMAGES – UNCHANGED
const understanding_people =
  "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241842/Website_screen_Images-31.png";

const everyone_deserves =
  "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241848/Website_screen_Images-32.png";

const therapy_should_fit_person =
  "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241886/Website_screen_Images-33.png";

const beginConversationImage =
  "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241840/Website_screen_Images-30.png";

// VALUES
const values = [
  {
    num: "01",
    title: "Empathy & Compassion",
    body: "Every person deserves to be heard with warmth, patience and respect. I believe in creating a space where you can express yourself without fear of judgement.",
    wide: false,
  },
  {
    num: "02",
    title: "Respect for Individual Journeys",
    body: "Every individual has a unique story, experiences and needs. There is no universal timeline for healing or a single definition of personal growth.",
    wide: false,
  },
  {
    num: "03",
    title: "Continuous Learning",
    body: "Psychology continues to evolve. So do I. I remain committed to learning, reflecting and growing as a therapist to provide thoughtful and responsible support.",
    wide: false,
  },
  {
    num: "04",
    title: "Independence, Not Dependence",
    body: "Therapy should help you develop self-awareness, confidence and the ability to understand and navigate your life with greater independence.",
    wide: true,
    icon: "flight_takeoff",
  },
  {
    num: "05",
    title: "Understanding Before Change",
    body: "Meaningful change begins when we understand the experiences, beliefs and patterns that influence the way we think, feel and respond.",
    wide: false,
  },
];

// QUALIFICATIONS
const qualifications = [
  {
    label: "Qualifications",
    value: "MA Psychology (Counselling)",
  },
  {
    label: "Certifications",
    value:
      "Diploma in Cognitive Hypnotic Psychotherapy, Advanced NLP Master Practitioner, Certificate in Relationship Coach Training Programme",
  },
  {
    label: "Experience",
    value:
      "Experience in supporting individuals through emotional, behavioural and relationship-related concerns.",
  },
  {
    label: "Areas of Work",
    tags: [
      "Therapy",
      "Workshops",
      "Speaking",
      "Corporate Wellbeing",
      "Schools & Colleges",
    ],
  },
];

export default function StoryPage() {
  return (
    <>
      <Navbar />

      <main className="design-system-page">

        {/* 01 – MY STORY / HERO */}

        <MotionSection className="story-hero-section section-pad max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-16 py-section-hero">

          <div className="w-full lg:w-1/2 flex flex-col items-start">

            <MotionText>
              <h1 className="text-headline-lg home-intro-title ui-heading">
                "Before I became a therapist, I was always curious about people."
              </h1>
            </MotionText>

            <MotionStagger
              amount={0.5}
              className="story-hero-copy max-w-lg text-body-lg ui-copy"
            >
              <MotionItem>
                <p>What makes us think the way we do?</p>
              </MotionItem>

              <MotionItem>
                <p>
                  Why do some experiences stay with us long after they have passed?
                </p>
              </MotionItem>

              <MotionItem>
                <p>
                  Why do we sometimes repeat patterns we consciously want to change?
                </p>
              </MotionItem>

              <MotionItem>
                <p>
                  And why can two people experience the same situation so differently?
                </p>
              </MotionItem>

              <MotionItem>
                <p className="pt-2">
                  My curiosity about human behaviour gradually became more than
                  an interest. It became a journey towards understanding
                  people, their emotions, experiences and the patterns that
                  shape their lives.
                </p>
              </MotionItem>
            </MotionStagger>

            <MotionReveal delay={0.55}>
              <div className="flex flex-wrap justify-center mt-6 gap-4 lg:justify-start">
                <Link href="/conversation" className="btn btn-primary">
                  Begin a Conversation
                </Link>

                <Link href="/book-session" className="btn btn-primary">
                  Book a Session
                </Link>
              </div>
            </MotionReveal>

          </div>

          <div className="w-full lg:w-1/2">
            <MotionReveal
              delay={0.55}
              direction="left"
              className="story-hero-image-frame w-full rounded overflow-hidden relative group surface-sand"
            >
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in srgb, var(--color-primary) 20%, transparent) 0%, transparent 60%)",
                  mixBlendMode: "multiply",
                  opacity: 0.5,
                }}
              />

              <HoverZoomImage
                src={NIDHI_STORY_IMG}
                alt="Kiran Khullar, therapist at Mind And Soul Klinic"
                baseScale={1}
                className="story-hero-image"
              />
            </MotionReveal>
          </div>

        </MotionSection>


        {/* 02 – UNDERSTANDING PEOPLE */}

        <MotionSection className="section-pad py-section surface-sand">
          <div className="max-w-[1500px] mx-auto w-full">

            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">

              <MotionReveal
                delay={0.2}
                direction="left"
                className="flex justify-center lg:justify-start order-2 lg:order-1"
              >
                <HoverZoomContainer className="w-full max-w-[600px] overflow-hidden rounded-3xl">
                  <HoverZoomImage
                    src={understanding_people}
                    alt="Understanding people and their stories"
                    className="h-full w-full object-cover"
                    baseScale={1.05}
                  />
                </HoverZoomContainer>
              </MotionReveal>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2">

                <MotionText>
                  <h2 className="text-headline-lg home-intro-title ui-heading">
                    I believe people are rarely as simple as their problems make them appear.
                  </h2>
                </MotionText>

                <MotionStagger
                  amount={0.5}
                  className="text-body-md space-y-6 w-full ui-copy"
                >
                  <MotionItem>
                    <p>
                      Over the years, I have come to understand that people
                      often see themselves through the difficulties they
                      experience. They may describe themselves as too anxious,
                      too emotional, too sensitive, too dependent or too angry.
                    </p>
                  </MotionItem>

                  <MotionItem>
                    <p>
                      But when we begin exploring their stories, we often
                      discover that their thoughts, emotions and behaviours
                      have a context. Their patterns have a history, and their
                      reactions may have meaning rooted in past experiences.
                    </p>
                  </MotionItem>

                  <MotionItem>
                    <p>
                      Beneath what someone is struggling with is a person
                      trying to cope with experiences, expectations and
                      emotions they may have carried for a long time.
                    </p>
                  </MotionItem>

                  <MotionItem>
                    <blockquote
                      className="text-quote-intense italic pt-4 pb-2 pl-6 ml-2 my-4"
                      style={{
                        color: "var(--color-primary)",
                        borderLeft: "1px solid var(--color-stone-grey)",
                      }}
                    >
                      I began seeing therapy not as a process of fixing what
                      was wrong, but as a process of understanding what was
                      there.
                    </blockquote>
                  </MotionItem>
                </MotionStagger>

              </div>
            </div>
          </div>
        </MotionSection>


        {/* 03 – EMPATHY AND UNDERSTANDING */}

        <MotionSection className="section-pad py-section flex items-center justify-center relative overflow-hidden surface-ivory">

          <div
            className="absolute top-0 right-0 h-full rounded-l-full blur-3xl -z-10"
            style={{
              width: "50%",
              opacity: 0.5,
              backgroundColor: "var(--color-surface-container)",
              transform: "translateX(25%)",
            }}
          />

          <div className="max-w-[1500px] mx-auto w-full">

            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

                <MotionText>
                  <h2 className="text-headline-lg home-intro-title ui-heading">
                    Everyone deserves to be understood.
                    <span
                      className="absolute left-1/2 lg:left-0 lg:translate-x-0 -translate-x-1/2 w-12 h-px"
                      style={{
                        bottom: "-1.5rem",
                        backgroundColor: "var(--color-soft-teal)",
                      }}
                    />
                  </h2>
                </MotionText>

                <MotionStagger
                  amount={0.5}
                  className="text-body-lg space-y-4 ui-copy max-w-[700px]"
                >
                  <MotionItem>
                    <p>
                      Not just heard. Not simply advised. Not immediately
                      analysed.{" "}
                      <strong className="ui-heading">Understood.</strong>
                    </p>
                  </MotionItem>

                  <MotionItem>
                    <p>
                      Sometimes, what people need most is a space where they
                      can speak openly without having to explain, justify or
                      defend everything they feel.
                    </p>
                  </MotionItem>

                  <MotionItem>
                    <p>
                      I believe in looking beyond what is visible on the
                      surface and becoming curious about what someone feels,
                      fears, protects, hopes for and may not yet have the
                      words to express.
                    </p>
                  </MotionItem>

                  <MotionItem>
                    <p className="pt-4 font-medium ui-heading">
                      That is where I believe meaningful therapy begins.
                    </p>
                  </MotionItem>
                </MotionStagger>

              </div>

              <MotionReveal
                delay={0.3}
                direction="right"
                className="flex justify-center lg:justify-end"
              >
                <HoverZoomContainer className="relative h-[450px] w-full max-w-[550px] overflow-hidden rounded-3xl border border-gray-200 md:h-[500px] lg:h-[550px]">
                  <HoverZoomImage
                    src={everyone_deserves}
                    alt="Everyone deserves to be understood"
                    className="h-full w-full object-contain object-center lg:object-cover"
                    baseScale={1.03}
                  />
                </HoverZoomContainer>
              </MotionReveal>

            </div>
          </div>
        </MotionSection>


        {/* 04 – MY THERAPEUTIC PHILOSOPHY */}

        <MotionSection className="section-pad py-section surface-container">

          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-16 items-center">

            <MotionReveal
              direction="right"
              className="col-span-1 md:col-span-5 order-2 md:order-1"
            >
              <div
                className="relative aspect-[9/10] w-full overflow-hidden rounded-xl border"
                style={{
                  backgroundColor: "var(--color-warm-ivory)",
                  borderColor:
                    "color-mix(in srgb, var(--color-stone-grey) 20%, transparent)",
                }}
              >
                <HoverZoomContainer className="w-full max-w-[700px] overflow-hidden rounded-xl">
                  <HoverZoomImage
                    src={therapy_should_fit_person}
                    alt="Therapy should fit the person"
                    className="h-full w-full object-cover"
                    baseScale={1.05}
                  />

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.35))",
                    }}
                  />
                </HoverZoomContainer>
              </div>
            </MotionReveal>

            <MotionStagger
              amount={0.5}
              className="col-span-1 md:col-span-6 md:col-start-7 order-1 md:order-2 space-y-6"
            >

              <MotionText>
                <h2 className="text-headline-lg max-w-2xl ui-heading">
                  I don't believe there is a single formula for a human being.
                </h2>
              </MotionText>

              <MotionItem>
                <p className="text-body-md ui-copy">
                  Every person who enters therapy brings a different history,
                  personality, relationships and way of making sense of life.
                  What works for one individual may not necessarily work for
                  another.
                </p>
              </MotionItem>

              <MotionItem>
                <p className="text-body-md ui-copy">
                  My approach is individualised and draws upon appropriate
                  psychological and therapeutic methods according to the
                  person's concerns, needs and goals.
                </p>
              </MotionItem>

              <MotionItem>
                <p className="text-body-md ui-copy">
                  Our work may involve exploring thoughts, emotions,
                  behavioural responses, relationships, beliefs and past
                  experiences, depending on what brings someone to therapy.
                </p>
              </MotionItem>

              <MotionItem>
                <p className="text-body-md font-medium ui-heading">
                  But the approach always begins with the person, not the
                  technique.
                </p>
              </MotionItem>

            </MotionStagger>

          </div>
        </MotionSection>



        {/* 06 – PROFESSIONAL EXPERTISE */}

        {/* <MotionSection
          className="section-pad py-section border-t"
          style={{
            backgroundColor: "var(--color-surface-container-low)",
            borderColor: "var(--color-surface-dim)",
          }}
        >

          <div className="max-w-[800px] mx-auto">

            <div className="mb-10 text-center">

              <MotionText>
                <h2 className="text-headline-lg mb-4 ui-heading">
                  Professional expertise, grounded in human connection.
                </h2>
              </MotionText>

              <p className="text-body-md ui-copy">
                Kiran Khullar — Counselling Psychologist |
                Cognitive Hypnotic Psychotherapist |
                NLP Practitioner | Life Coach
              </p>

            </div>

            <MotionReveal delay={0.5} className="space-y-4">

              {qualifications.map((q) => (
                <div
                  key={q.label}
                  className="flex flex-col sm:flex-row sm:items-baseline py-4 border-b border-dim"
                >

                  <span className="w-full sm:w-1/3 text-label-md mb-2 sm:mb-0 ui-muted">
                    {q.label}
                  </span>

                  {q.tags ? (
                    <div className="w-full sm:w-2/3 flex flex-wrap gap-2">

                      {q.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full border"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            borderColor: "var(--color-surface-dim)",
                            color: "var(--color-on-surface-variant)",
                            fontSize: "var(--text-xs)",
                            fontFamily: "var(--font-label-md)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}

                    </div>
                  ) : (
                    <span className="w-full sm:w-2/3 text-body-md ui-heading">
                      {q.value}
                    </span>
                  )}

                </div>
              ))}

            </MotionReveal>

          </div>
        </MotionSection> */}


        {/* 07 – CLOSING CTA */}

        <MotionSection
          className="section-pad py-section relative overflow-hidden"
          style={{
            background: `linear-gradient(
              180deg,
              var(--color-warm-ivory) 0%,
              var(--color-muted-sand) 100%
            )`,
          }}
        >

          <div className="max-w-[1500px] mx-auto w-full">

            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

                <MotionText>
                  <h2 className="text-headline-lg max-w-2xl mb-6 ui-heading">
                    You don't have to have everything figured out.
                  </h2>
                </MotionText>

                <MotionReveal delay={0.5}>
                  <p className="text-body-lg max-w-3xl mb-12 ui-copy">
                    A first conversation doesn't have to be a commitment to
                    a long therapeutic journey. It can simply be a beginning.
                    A chance to talk, understand what is happening and explore
                    whether this feels like the right space for you.
                  </p>
                </MotionReveal>

                <MotionReveal delay={0.55}>
                  <div className="flex flex-wrap justify-center gap-4 lg:justify-start">

                    <Link href="/conversation" className="btn btn-primary">
                      Begin a Conversation
                    </Link>

                    <Link href="/book-session" className="btn btn-primary">
                      Book a Session
                    </Link>

                  </div>
                </MotionReveal>

                <MotionReveal delay={0.4}>
                  <p className="text-body-md italic mt-6 ui-muted">
                    Whenever you're ready, we'll begin wherever you are.
                  </p>
                </MotionReveal>

              </div>

              <MotionReveal
                delay={0.3}
                direction="right"
                className="flex w-full justify-center lg:justify-end"
              >
                <HoverZoomContainer className="relative w-full max-w-[420px] overflow-hidden rounded-3xl">

                  <HoverZoomImage
                    src={beginConversationImage}
                    alt="Begin a conversation"
                    className="block h-auto w-full object-contain"
                    baseScale={1.05}
                  />

                </HoverZoomContainer>
              </MotionReveal>

            </div>
          </div>
        </MotionSection>

      </main>
    </>
  );
}
