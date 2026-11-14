import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import {
  MotionSection,
  MotionText,
  MotionStagger,
  MotionItem,
  MotionReveal,
  HoverZoomContainer,
  HoverZoomImage,
} from "@/components/ui/Motion";

export const metadata: Metadata = {
  title: "Understanding Therapy",
  description:
    "Learn what therapy is, what it isn't, and how the Adore Life Journey can help you move from feeling understood to experiencing emotional freedom.",
};

const therapyFor = [
  {
    title: "Within Yourself",
    items: [
      "Anxiety",
      "Overthinking",
      "Self-doubt",
      "Low self-worth",
      "Emotional exhaustion",
      "Stress",
      "Burnout",
      "Difficulty managing emotions",
    ],
  },
  {
    title: "In Your Relationships",
    items: [
      "Communication difficulties",
      "Conflict",
      "Trust issues",
      "Difficulty setting boundaries",
      "Repeated relationship patterns",
      "Emotional disconnection",
    ],
  },
  {
    title: "During Life Changes",
    items: [
      "Grief",
      "Loss",
      "Separation",
      "Career changes",
      "Major transitions",
      "Identity questions",
      "Becoming a parent",
    ],
  },
];

const journeySteps = [
  {
    num: 1,
    title: "Feel Understood",
    body: "A space where your experiences can be heard without judgement.",
  },
  {
    num: 2,
    title: "Understand Yourself",
    body: "Recognise your thoughts, emotions, beliefs and patterns.",
  },
  {
    num: 3,
    title: "Create Awareness",
    body: "Notice what once felt automatic.",
  },
  {
    num: 4,
    title: "Make New Choices",
    body: "Explore healthier ways of responding and relating.",
  },
  {
    num: 5,
    title: "Experience Emotional Freedom",
    body: "Develop greater flexibility, clarity and confidence in navigating life.",
  },
];

const faqItems = [
  {
    q: "I've never been to therapy before. Is that okay?",
    a: "Absolutely. You don't need previous experience with therapy. We begin wherever you are.",
  },
  {
    q: "What if I don't know what to talk about?",
    a: "That's okay too. You don't need to arrive with a prepared agenda. We can begin with whatever feels most important to you.",
  },
  {
    q: "Will you tell me what to do?",
    a: "Therapy isn't about prescribing solutions for your life. We work together to understand your situation and explore choices that may be right for you.",
  },
  {
    q: "How many sessions will I need?",
    a: "There is no universal answer. The duration depends on your needs, goals and progress, and is reviewed as the work develops.",
  },
  {
    q: "What if I'm not sure therapy is right for me?",
    a: "You don't have to be certain before reaching out. A first conversation can help you understand whether therapy feels appropriate and whether Adore Life feels like the right space for you.",
  },
];

const therapyForImage = "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241884/What_if_therapy_begins_with_understanding.png";
const therapyExplainedImage = "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241836/Therapy_is_a_space_to_understand_what_is_happening_within.png";
const therapyCollaborationImage = "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241835/Therapy_isn_t_someone_telling_you_how_to_live.png"
const abstractHealingJourneyImage = "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241836/findYourEmona.png"
const beginConversationImage = "https://res.cloudinary.com/mmov5y9w/image/upload/v1794241836/Pasted_image.png"


export default function TherapyPage() {
  return (
    <>
      <Navbar />

      <main className="design-system-page therapy-page">
        {/* ── Hero ── */}
        <MotionSection className="therapy-hero-section section-pad py-section flex items-center justify-center max-w-[1440px] mx-auto">
          <div className="therapy-hero-grid w-full grid grid-cols-1 lg:grid-cols-2 items-stretch gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <MotionText>
                <h1 className="text-headline-lg max-w-3xl mb-8 ui-heading">
                  What if therapy begins with understanding?
                </h1>
              </MotionText>

              <MotionStagger
                amount={0.2}
                className="max-w-2xl text-body-lg space-y-6 mb-12 ui-copy"
              >
                <MotionItem>
                  <p>You don't need to arrive with a diagnosis.</p>
                </MotionItem>

                <MotionItem>
                  <p>You don't need to know exactly what is wrong.</p>
                </MotionItem>

                <MotionItem>
                  <p>And you don't need to have the right words.</p>
                </MotionItem>

                <MotionItem>
                  <p>
                    Therapy begins with a conversation—about what you're
                    experiencing, what has brought you here, and what you hope
                    might become different.
                  </p>
                </MotionItem>
              </MotionStagger>


                               <MotionReveal delay={0.55}>
                                <div className="flex flex-wrap justify-center mt-6 gap-4 lg:justify-start">
                                  <Link
                                    href="/conversation"
                                    className="btn btn-primary"
                                  >
                                    Begin a Conversation
                                  </Link>
                                  <Link href="/book-session" className="btn btn-primary">
                                    Book a Session
                                  </Link>
                                </div>
                              </MotionReveal>
            </div>

            {/* Right Image */}

            <MotionReveal
              delay={0.3}
              direction="right"
              className="w-full min-w-0 flex justify-center lg:justify-end mx-auto lg:mx-0"
            >
              <HoverZoomContainer className="w-full max-w-md overflow-hidden rounded-3xl">
                <HoverZoomImage
                  src={therapyForImage}
                  alt="Therapy begins with understanding"
                  className="therapy-hero-image w-full h-auto object-cover scale-110"
                />
              </HoverZoomContainer>
            </MotionReveal>
          </div>
        </MotionSection>


        {/* ── What is therapy ── */}
        <MotionSection className="therapy-explained-section section-pad max-w-[1440px] mx-auto py-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 lg:order-last">
              <MotionText>
                <h2 className="text-headline-lg therapy-explained-title max-w-3xl ui-heading">
                  Therapy is a space to understand what is happening within you.
                </h2>
              </MotionText>

              <MotionStagger
                amount={0.2}
                className="therapy-explained-copy text-body-lg ui-copy"
              >
                <MotionItem>
                  <p>
                    Life can leave us carrying thoughts, emotions and patterns
                    that we don't always understand.
                  </p>
                </MotionItem>

                <MotionItem>
                  <p>
                    Sometimes we know what we're feeling. Sometimes we only know
                    that something doesn't feel right.
                  </p>
                </MotionItem>

                <MotionItem>
                  <p>
                    Therapy creates a confidential, professional space to slow
                    down and explore those experiences with curiosity and
                    compassion. Together, we can begin to understand:
                  </p>
                </MotionItem>

                <MotionItem>
                  <ul className="therapy-explained-list pl-6">
                    {[
                      "What you're experiencing",
                      "What may be contributing to it",
                      "How your thoughts, emotions and behaviours connect",
                      "Why certain situations affect you in particular ways",
                      "What patterns may be repeating",
                      "What choices may be available to you",
                    ].map((item) => (
                      <li
                        key={item}
                        className="relative"
                        style={{
                          listStyle: "none",
                        }}
                      >
                        <span
                          className="absolute font-bold"
                          style={{
                            left: "-1.5rem",
                            color: "var(--color-stone-grey)",
                          }}
                        >
                          ·
                        </span>

                        {item}
                      </li>
                    ))}
                  </ul>
                </MotionItem>
              </MotionStagger>

              <MotionReveal delay={0.4}>
                <p className="therapy-explained-closing text-headline-md ui-heading">
                  Therapy isn't about finding fault. It's about finding
                  understanding.
                </p>
              </MotionReveal>
            </div>

            {/* Right Image */}
            <MotionReveal
              delay={0.3}
              direction="right"
              className="lg:col-span-5 lg:order-first flex justify-center"
            >
              <HoverZoomContainer className="therapy-explained-image-frame w-full overflow-hidden rounded-3xl">
                <HoverZoomImage
                  src={therapyExplainedImage}
                  alt="Therapy and self understanding"
                  baseScale={1}
                  className="w-full h-auto object-contain"
                />
              </HoverZoomContainer>
            </MotionReveal>
          </div>
        </MotionSection>
        {/* ── What therapy is NOT ── */}
        <MotionSection className="therapy-collaboration-section surface-sand py-section">
          <div className="section-pad max-w-[1440px] mx-auto w-full">
            <div className="therapy-collaboration-grid grid grid-cols-1 items-center gap-8 lg:gap-12">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <MotionText>
                  <h2 className="text-headline-lg therapy-collaboration-title max-w-3xl ui-heading">
                    Therapy isn't someone telling you how to live.
                  </h2>
                </MotionText>

                <MotionStagger
                  amount={0.2}
                  className="therapy-collaboration-copy text-body-lg"
                  style={{ color: "var(--color-tertiary-container)" }}
                >
                  <MotionItem>
                    <p>
                      It isn't a lecture. It isn't a list of instructions. It
                      isn't about being told to "think positive." It isn't about
                      judging your choices. And it isn't about making you
                      dependent on therapy.
                    </p>
                  </MotionItem>

                  <MotionItem>
                    <p>
                      Therapy is a collaborative process. You remain the expert
                      on your own life. My role is to bring professional
                      psychological understanding, curiosity and perspective to
                      help you explore what may be difficult to see on your own.
                    </p>
                  </MotionItem>
                </MotionStagger>

                <MotionReveal delay={0.4} direction="up">
                  <blockquote
                    className="therapy-collaboration-quote text-quote-intense border-l-2 pl-5 py-2 mx-auto lg:mx-0 text-left max-w-2xl italic"
                    style={{
                      color: "var(--color-primary)",
                      borderColor: "var(--color-stone-grey)",
                    }}
                  >
                    "You don't need someone to tell you who to be. You need
                    space to understand who you are."
                  </blockquote>
                </MotionReveal>
              </div>

              {/* Right Image */}
              <MotionReveal
                delay={0.3}
                direction="right"
                className="flex justify-center"
              >
                <HoverZoomContainer className="therapy-collaboration-image w-full overflow-hidden rounded-3xl">
                  <HoverZoomImage
                    src={therapyCollaborationImage}
                    alt="Therapy as a collaborative process"
                    baseScale={1}
                    className="w-full h-auto object-contain"
                  />
                </HoverZoomContainer>
              </MotionReveal>
            </div>
          </div>
        </MotionSection>

        {/* ── Who therapy is for ── */}
        <MotionSection className="section-pad py-section max-w-[1440px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <MotionText>
              <h2 className="text-headline-lg mb-6 ui-heading">
                You don't have to be in crisis to seek therapy.
              </h2>
            </MotionText>
            <MotionReveal delay={0.2}>
              <p className="text-body-lg ui-copy">
                Therapy can be useful whenever something in your emotional life,
                relationships or way of coping feels difficult, confusing or
                stuck. You might be experiencing:
              </p>
            </MotionReveal>
          </div>
          <MotionStagger
            amount={0.2}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {therapyFor.map((group) => (
              <MotionItem key={group.title}>
                <div className="p-8 rounded-xl surface-ivory h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <h3
                    className="text-headline-md mb-6 pb-4 border-b"
                    style={{
                      color: "var(--color-primary)",
                      borderColor: "var(--color-stone-grey)",
                    }}
                  >
                    {group.title}
                  </h3>
                  <ul className="space-y-4 text-body-md ui-copy">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[var(--color-soft-teal)]">•</span>{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
          <MotionReveal delay={0.4} className="mt-16 text-center">
            <p className="text-body-lg mb-2 ui-copy">
              Or perhaps you simply have a sense that:
            </p>
            <p className="text-headline-md mb-4 ui-heading">
              "I don't feel like myself anymore."
            </p>
            <p className="text-body-md ui-muted">
              You don't need a perfect reason to begin.
            </p>
          </MotionReveal>
        </MotionSection>

        {/* ── Journey steps ── */}
        <MotionSection className="therapy-journey-section section-pad max-w-[1440px] mx-auto border-t border-surface py-section">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 items-center">
            <div className="lg:order-last">
              {/* <span  className="text-headline-lg home-intro-title ui-heading mb-6 uppercase">
                The Adore Life Journey™
              </span> */}
              <MotionText>
                <h2 className="text-headline-lg therapy-journey-title max-w-3xl ui-heading">
                  From feeling understood to experiencing emotional freedom.
                </h2>
              </MotionText>
              <MotionReveal delay={0.2}>
                <p className="therapy-journey-intro text-body-lg ui-copy">
                  There is no fixed timeline or formula for therapy. But the
                  journey often involves moving through several layers of
                  understanding.
                </p>
              </MotionReveal>

              <MotionStagger
                amount={0.2}
                className="therapy-journey-steps relative pl-8"
                style={{
                  borderLeft:
                    "1px solid color-mix(in srgb, var(--color-stone-grey) 30%, transparent)",
                }}
              >
                {journeySteps.map((step) => (
                  <MotionItem key={step.num}>
                    <div className="relative flex items-start gap-6 group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full text-white z-10 shrink-0 shadow-sm absolute -left-11 surface-accent transition-transform duration-300 group-hover:scale-125">
                        <span
                          className="text-label-md"
                          style={{ fontSize: "var(--text-micro)" }}
                        >
                          {step.num}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-headline-md mb-2 ui-heading transition-colors group-hover:text-[var(--color-soft-teal)]">
                          {step.title}
                        </h4>
                        <p className="text-body-md ui-copy">{step.body}</p>
                      </div>
                    </div>
                  </MotionItem>
                ))}
              </MotionStagger>
            </div>

            {/* Illustration */}
            <HoverZoomContainer className="therapy-journey-image lg:order-first w-full rounded-xl overflow-hidden">
              <HoverZoomImage
                src={abstractHealingJourneyImage}
                alt="Abstract representation of the healing journey"
                width={1600}
                height={900}
                baseScale={1}
                className="w-full h-auto object-contain"
              />
            </HoverZoomContainer>
          </div>

          <MotionReveal delay={0.6} className="therapy-journey-closing text-center">
            <p className="text-headline-md ui-heading">
              The goal isn't to become someone else. It is to become more fully
              yourself.
            </p>
          </MotionReveal>
        </MotionSection>

        {/* ── FAQ ── */}
        <MotionSection className="section-pad py-section max-w-[1440px] mx-auto surface-lowest">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-headline-lg max-w-3xl mb-8 ui-heading">
                Questions you may be wondering about.
              </h1>
              <p className="text-body-lg ui-muted">
                It's completely okay if you're not sure how this works.
              </p>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group border-b pb-4 border-surface"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex justify-between items-center py-4 cursor-pointer focus:outline-none ui-heading">
                    <span className="text-headline-md text-question">
                      {item.q}
                    </span>
                    <span className="material-symbols-outlined faq-icon ui-muted">
                      add
                    </span>
                  </summary>
                  <div className="text-body-md pb-4 pl-2 ui-copy">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* ── Final CTA ── */}
        <MotionSection
          id="contact"
          className="section-pad py-section flex items-center justify-center max-w-[1440px] mx-auto"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <MotionText>
                <h1 className="text-headline-lg max-w-3xl mb-8 ui-heading">
                  You don't need to know exactly what you need.
                </h1>
              </MotionText>

              <MotionStagger
                amount={0.2}
                className="max-w-xl text-body-lg space-y-6 mb-12 ui-copy"
              >
                <MotionItem>
                  <p>
                    Sometimes the first step is simply saying:
                    <br />
                    <strong className="text-headline-md mt-2 block ui-heading">
                      "Something isn't feeling right, and I want to understand
                      why."
                    </strong>
                  </p>
                </MotionItem>

                <MotionItem>
                  <p>That's enough to begin.</p>
                </MotionItem>
              </MotionStagger>

              <MotionReveal
                delay={0.4}
                className="flex flex-col items-center lg:items-start gap-6"
              >
                <Link
                  href="/conversation"
                  className="btn btn-primary"
                >
                  Begin a Conversation
                </Link>

                <span className="text-body-md italic ui-muted">
                  Whenever you're ready, we'll begin wherever you are.
                </span>
              </MotionReveal>
            </div>

            {/* Right Image */}
            <MotionReveal
              delay={0.3}
              direction="right"
              className="flex justify-center lg:justify-end"
            >
              <HoverZoomContainer className="w-full max-w-md aspect-square overflow-hidden rounded-3xl">
                <HoverZoomImage
                  src={beginConversationImage}
                  alt="Begin a conversation"
                  className="w-full h-full object-contain"
                />
              </HoverZoomContainer>
            </MotionReveal>
          </div>
        </MotionSection>
      </main>
    </>
  );
}
