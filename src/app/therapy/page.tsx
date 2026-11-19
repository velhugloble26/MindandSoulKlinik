
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Link from "next/link";

import Reveal from "@/components/animations/Reveal";
import {
  HoverZoomContainer,
  HoverZoomImage,
} from "@/components/ui/Motion";

export const metadata: Metadata = {
  title: "Therapy & Counselling | Mind and Soul Klinic",
  description:
    "Explore therapy and counselling at Mind and Soul Klinic with Kiran Khullar, Counselling Psychologist and Cognitive Hypnotic Psychotherapist. Understand your emotions, thoughts, relationships and behavioural patterns.",
  keywords: [
    "therapy and counselling",
    "psychotherapy",
    "counselling psychologist",
    "emotional well-being",
    "anxiety and overthinking",
    "relationship counselling",
    "emotional healing",
    "Cognitive Hypnotic Psychotherapy",
    "Mind and Soul Klinic",
    "Kiran Khullar",
  ],
  openGraph: {
    title: "Understanding Therapy | Mind and Soul Klinic",
    description:
      "A professional, empathetic space to understand yourself, explore emotional difficulties and work towards meaningful change.",
    type: "website",
  },
};

const therapyFor = [
  {
    title: "Emotional & Personal Well-being",
    description:
      "Therapy can help you understand your emotional experiences and develop healthier ways of responding to life's challenges.",
    items: [
      "Anxiety and excessive worrying",
      "Overthinking and racing thoughts",
      "Self-doubt and low self-esteem",
      "Emotional exhaustion and stress",
      "Burnout and feeling overwhelmed",
      "Difficulty managing emotions",
      "People-pleasing and boundary difficulties",
      "Confidence and personal growth",
    ],
  },
  {
    title: "Relationships & Family",
    description:
      "Explore relationship patterns, communication difficulties and emotional experiences affecting your connections.",
    items: [
      "Relationship conflicts",
      "Communication difficulties",
      "Trust and attachment concerns",
      "Emotional distance",
      "Repeated relationship patterns",
      "Family conflicts",
      "Difficulty setting boundaries",
      "Emotional disconnection",
    ],
  },
  {
    title: "Life Transitions & Experiences",
    description:
      "Get support while navigating difficult experiences, transitions and changes in your personal or professional life.",
    items: [
      "Grief and loss",
      "Separation and relationship changes",
      "Career transitions",
      "Parenting challenges",
      "Childhood emotional experiences",
      "Identity and self-discovery",
      "Major life changes",
      "Personal and professional challenges",
    ],
  },
];

const journeySteps = [
  {
    num: "01",
    title: "Feel Understood",
    body: "Begin in a safe, professional and non-judgmental space where your experiences can be heard.",
  },
  {
    num: "02",
    title: "Understand Yourself",
    body: "Explore your thoughts, emotions, beliefs, experiences and behavioural patterns.",
  },
  {
    num: "03",
    title: "Develop Awareness",
    body: "Recognise emotional triggers and understand why certain situations affect you in particular ways.",
  },
  {
    num: "04",
    title: "Work Towards Change",
    body: "Explore healthier perspectives, coping strategies and ways of responding to everyday situations.",
  },
  {
    num: "05",
    title: "Grow With Confidence",
    body: "Continue developing emotional awareness, resilience, self-understanding and confidence.",
  },
];

const faqItems = [
  {
    q: "What happens during the first therapy session?",
    a: "The first session is an opportunity to understand what has brought you to therapy, your current concerns and what you hope to work towards. You can share your experiences at your own pace. We also discuss your expectations and how the therapeutic process may work.",
  },
  {
    q: "Is counselling confidential?",
    a: "Confidentiality is an important part of the therapeutic relationship. Information shared during sessions is treated with professional care and privacy, subject to applicable legal, ethical and safety-related exceptions. These boundaries can be discussed during your initial session.",
  },
  {
    q: "Do I need a diagnosis before starting therapy?",
    a: "No. You do not need a formal diagnosis to seek psychological support. You can reach out if you are experiencing anxiety, stress, relationship difficulties, emotional confusion or simply want to understand yourself better.",
  },
  {
    q: "How many therapy sessions will I need?",
    a: "There is no fixed number of therapy sessions for everyone. The duration depends on your concerns, personal goals, individual circumstances and progress. Your therapeutic journey is reviewed together as the work develops.",
  },
  {
    q: "What is Cognitive Hypnotic Psychotherapy?",
    a: "Cognitive Hypnotic Psychotherapy is an approach that integrates cognitive and psychological techniques with therapeutic hypnosis. Depending on individual needs and suitability, it may involve exploring thoughts, beliefs, emotional responses and behavioural patterns.",
  },
  {
    q: "What is the difference between counselling and psychotherapy?",
    a: "Counselling generally focuses on helping people understand and navigate specific concerns, emotional difficulties and life situations. Psychotherapy may involve a deeper exploration of recurring emotional, cognitive and behavioural patterns. The appropriate approach depends on the individual's needs and goals.",
  },
  {
    q: "Is therapy suitable for relationship and family concerns?",
    a: "Yes. Individual therapy can help you explore communication difficulties, relationship conflicts, emotional distance, trust concerns, boundaries and recurring patterns. The focus is on understanding your experiences and developing healthier ways of relating.",
  },
  {
    q: "Can I start therapy if I am not sure what is bothering me?",
    a: "Absolutely. You do not need to have everything figured out before beginning. Sometimes the first step is simply recognising that something does not feel right. Therapy can help you explore those feelings and understand what may be happening.",
  },
  {
    q: "How can I book a therapy appointment?",
    a: "You can begin by using the Book a Session option on the Mind and Soul Klinic website. You can also use the Begin a Conversation option to take the first step and discuss your requirements.",
  },
];

const therapyForImage =
  "https://images.openai.com/static-rsc-4/tbrYMr59ixDkLqkR_9D2N42pLUfASwmzC6KViAxftONtrvoSdeCIkjGJ1YsSZgB34FjPpKM_M5LE4d9oygoVHAuAhHa0S1PHroEU3BaC70qFUSSS_ClOMJ9e_JzioI0G1RBYZcRdzFONlcpAkEIWGZBXgkGR6b61B9FNlz3VO4o7PpxJydV7YomvyqjLi6pm?purpose=fullsize";

const therapyExplainedImage =
  "https://images.openai.com/static-rsc-4/HU12CTAI16cr3CyjfA14KJwTvdn81fOEtQfzVijRIZScLoiFEKP1mMC-0pOXozqe6bAdyivJo0dqCQLFEFNkorfnBimAXpcca-DT_NsKS1KT5swngjG-auGtIUGbcuns6fpyVjrcwjAxYOg5b7QEjyCtMmloWagmSbt9C4WoF5Qh5FLcJcSqbafjc9_B0hFP?purpose=fullsize";

const therapyCollaborationImage =
  "https://images.openai.com/static-rsc-4/5oR8DqUdWGcg4ZDyaXpj-0gaMslgwrPpCH4TDJA7Fhnw4U29gn4PtFi3SLk-YRxZUKmeR9tPW9nVIJ9vsHTxK6c78RfkJXFmRfoJ5ZYk6dlYoCBeBaOvk14K8eSXOcROz78y5DhfSHjJ4H1NHtVx2-8xR-RBN5kOnVl-1d5mIZICVVkk4lzAQRZfahlcFy87?purpose=fullsize";

const abstractHealingJourneyImage =
  "https://images.openai.com/static-rsc-4/U1DGaYM5amfUZ-GXyd7_BlQ5-MV514kmwKQ1rN6glcZ0MpNznxKG58HJcEe5DhRXdg7GSdlMRM6Xzh24LgYcHCta65VSKiqlp4B-tcSjOQazLz-pF5V3ziKzsQlHsCj3yBFp6kc6ljo0LxrxeZ9Vn6ssoBTke0R1lN8hUFOeQCvOkRbF_8IircDoWmCeLi6T?purpose=fullsize";

const beginConversationImage =
  "https://images.openai.com/static-rsc-4/wLVxJzXHNtWYsy21hxqypTs2ikgfnwr2_3PZwxl_RHnfSTUeLymjdC-gegby9G_OHQnYDniJCfoWv-pd9CWaMufiDr6qjopvioZdCoQmSqLaTPdjdFsF65hqLvcnu8M0hB0W3f3y0cSPrTWjrICuovPN6aC43bqCyjwqMMTUi6YAHaXAn81UW4OfKr4eEERS?purpose=fullsize";

export default function TherapyPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <Navbar />

      <main className="design-system-page therapy-page">

        {/* HERO */}
        <Reveal className="therapy-hero-section section-pad py-section flex items-center justify-center max-w-[1440px] mx-auto">
          <div className="therapy-hero-grid w-full grid grid-cols-1 lg:grid-cols-2 items-stretch gap-12 lg:gap-20">

            <div className="flex h-full flex-col items-center lg:items-start text-center lg:text-left">
              <Reveal>
                <h1 className="text-headline-lg max-w-3xl mb-8 ui-heading">
                  What Is Therapy? A Journey Towards Understanding Yourself.
                </h1>
              </Reveal>

              <Reveal
                className="max-w-2xl text-body-lg space-y-6 mb-8 ui-copy"
              >
                <Reveal>
                  <p>
                    You don't need to arrive with a diagnosis or know exactly
                    what is wrong.
                  </p>
                </Reveal>

                <Reveal>
                  <p>
                    You don't need to have the right words to explain what
                    you're experiencing.
                  </p>
                </Reveal>

                <Reveal>
                  <p>
                    Therapy begins with a conversation about your thoughts,
                    emotions, relationships and experiences.
                  </p>
                </Reveal>

                <Reveal>
                  <p>
                    At Mind and Soul Klinic, we believe meaningful change
                    begins with understanding the person behind the problem.
                    Our approach focuses on your individual experiences,
                    concerns and therapeutic goals.
                  </p>
                </Reveal>
              </Reveal>

              <Reveal delay={0.55}>
                <div className="flex flex-wrap justify-center mt-6 gap-4 lg:justify-start">
                  <Link href="/conversation" className="btn btn-primary">
                    Begin a Conversation
                  </Link>
                  <Link href="/book-session" className="btn btn-primary">
                    Book a Session
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal
              delay={0.3}
              direction="right"
              className="w-full min-w-0 h-full flex justify-center lg:justify-end"
            >
              <HoverZoomContainer className="media-frame w-full max-w-[520px] overflow-hidden rounded-3xl lg:h-full lg:aspect-auto">
                <HoverZoomImage
                  src={therapyForImage}
                  alt="Understanding therapy and emotional well-being"
                  className="therapy-hero-image w-full h-full object-cover"
                />
              </HoverZoomContainer>
            </Reveal>

          </div>
        </Reveal>


        {/* WHAT IS THERAPY */}
        <Reveal className="therapy-explained-section section-pad max-w-[1440px] mx-auto py-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">

            <div className="lg:col-span-5 lg:order-first flex justify-center">
              <Reveal delay={0.3} direction="left" className="w-full h-full">
                <HoverZoomContainer className="media-frame therapy-explained-image-frame w-full overflow-hidden rounded-3xl lg:h-full lg:aspect-auto">
                  <HoverZoomImage
                    src={therapyExplainedImage}
                    alt="Psychotherapy as a space for self-understanding"
                    baseScale={1}
                    className="w-full h-full object-cover"
                  />
                </HoverZoomContainer>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:order-last">
              <Reveal>
                <h2 className="text-headline-lg therapy-explained-title max-w-3xl ui-heading">
                  What Happens During Therapy?
                </h2>
              </Reveal>

              <Reveal
                className="therapy-explained-copy text-body-lg space-y-5 ui-copy"
              >
                <Reveal>
                  <p>
                    Life can leave us carrying thoughts, emotions and
                    behavioural patterns that we don't always understand.
                  </p>
                </Reveal>

                <Reveal>
                  <p>
                    Sometimes we know what we are feeling. At other times,
                    we only know that something doesn't feel right.
                  </p>
                </Reveal>

                <Reveal>
                  <p>
                    Therapy provides a confidential professional space to
                    explore these experiences with curiosity and compassion.
                    Together, we can begin understanding:
                  </p>
                </Reveal>

                <Reveal>
                  <ul className="therapy-explained-list pl-6 space-y-3">
                    {[
                      "What you are experiencing emotionally",
                      "What may be contributing to your difficulties",
                      "How your thoughts, feelings and behaviours connect",
                      "Why certain situations affect you in particular ways",
                      "What patterns may be repeating in your life",
                      "What healthier choices may be available to you",
                    ].map((item) => (
                      <li key={item} className="relative" style={{ listStyle: "none" }}>
                        <span
                          className="absolute font-bold"
                          style={{ left: "-1.5rem", color: "var(--color-stone-grey)" }}
                        >
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </Reveal>

              <Reveal delay={0.4}>
                <p className="therapy-explained-closing text-headline-md mt-8 ui-heading">
                  Therapy isn't about finding fault. It's about finding
                  understanding.
                </p>
              </Reveal>
            </div>

          </div>
        </Reveal>


        {/* THERAPY IS COLLABORATIVE */}
        <Reveal className="therapy-collaboration-section surface-sand py-section">
          <div className="section-pad max-w-[1440px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-10 lg:gap-16">

              <div className="text-center lg:text-left">
                <Reveal>
                  <h2 className="text-headline-lg therapy-collaboration-title max-w-3xl ui-heading">
                    Therapy Isn't Someone Telling You How to Live.
                  </h2>
                </Reveal>

                <Reveal
                  className="therapy-collaboration-copy text-body-lg space-y-6 ui-copy"
                >
                  <Reveal>
                    <p>
                      Therapy isn't a lecture, a list of instructions or
                      simply being told to think positively. It isn't about
                      judging your choices or making you dependent on therapy.
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      It is a collaborative process. You remain the expert
                      on your own life. My role is to bring professional
                      psychological understanding, curiosity and perspective
                      to help you explore what may be difficult to see on
                      your own.
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      Together, we work towards greater awareness, healthier
                      responses and meaningful personal change.
                    </p>
                  </Reveal>
                </Reveal>

                <Reveal delay={0.4}>
                  <blockquote className="therapy-collaboration-quote text-quote-intense border-l-2 pl-5 py-2 mt-8 mx-auto lg:mx-0 text-left max-w-2xl italic">
                    "You don't need someone to tell you who to be. You need
                    space to understand who you are."
                  </blockquote>
                </Reveal>
              </div>

              <Reveal
                delay={0.3}
                direction="right"
                className="flex h-full justify-center"
              >
                <HoverZoomContainer className="media-frame therapy-collaboration-image w-full overflow-hidden rounded-3xl lg:h-full lg:aspect-auto">
                  <HoverZoomImage
                    src={therapyCollaborationImage}
                    alt="Collaborative psychotherapy and personal growth"
                    baseScale={1}
                    className="w-full h-full object-cover"
                  />
                </HoverZoomContainer>
              </Reveal>

            </div>
          </div>
        </Reveal>


        {/* WHO CAN BENEFIT */}
        <Reveal className="section-pad py-section max-w-[1440px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal>
              <h2 className="text-headline-lg mb-6 ui-heading">
                Who Can Benefit From Therapy?
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-body-lg ui-copy">
                You don't have to be in crisis to seek therapy. Counselling
                and psychotherapy can offer support when your emotional
                well-being, relationships or ways of coping feel difficult,
                confusing or overwhelming.
              </p>
            </Reveal>
          </div>

          <Reveal
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {therapyFor.map((group) => (
              <Reveal key={group.title}>
                <div className="p-8 rounded-xl surface-ivory h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">

                  <h3
                    className="text-headline-md mb-5 pb-4 border-b ui-heading"
                    style={{
                      color: "var(--color-primary)",
                      borderColor: "var(--color-stone-grey)",
                    }}
                  >
                    {group.title}
                  </h3>

                  <p className="text-body-md ui-copy mb-6">
                    {group.description}
                  </p>

                  <ul className="space-y-4 text-body-md ui-copy">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[var(--color-soft-teal)]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                </div>
              </Reveal>
            ))}
          </Reveal>

          <Reveal delay={0.4} className="mt-16 text-center">
            <p className="text-body-lg mb-2 ui-copy">
              Or perhaps you simply have a sense that:
            </p>

            <p className="text-headline-md mb-4 ui-heading">
              "I don't feel like myself anymore."
            </p>

            <p className="text-body-md ui-muted">
              You don't need a perfect reason to begin.
            </p>
          </Reveal>
        </Reveal>


        {/* THERAPY JOURNEY */}
        <Reveal className="therapy-journey-section section-pad max-w-[1440px] mx-auto border-t border-surface py-section">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 items-stretch">

            <div className="lg:order-last">
              <Reveal>
                <h2 className="text-headline-lg therapy-journey-title max-w-3xl ui-heading">
                  Your Journey Towards Emotional Well-being.
                </h2>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="therapy-journey-intro text-body-lg ui-copy my-6">
                  Every person's therapeutic journey is different. There is
                  no fixed timeline or formula. However, therapy may involve
                  moving through several layers of understanding and change.
                </p>
              </Reveal>

              <Reveal
                className="therapy-journey-steps relative pl-8 space-y-8"
                style={{
                  borderLeft:
                    "1px solid color-mix(in srgb, var(--color-stone-grey) 30%, transparent)",
                }}
              >
                {journeySteps.map((step) => (
                  <Reveal key={step.num}>
                    <div className="relative flex items-start gap-6 group">

                      <div className="flex items-center justify-center w-7 h-7 rounded-full text-white z-10 shrink-0 shadow-sm absolute -left-11 surface-accent transition-transform duration-300 group-hover:scale-125">
                        <span className="text-label-md">
                          {step.num}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-headline-md mb-2 ui-heading transition-colors group-hover:text-[var(--color-soft-teal)]">
                          {step.title}
                        </h3>
                        <p className="text-body-md ui-copy">
                          {step.body}
                        </p>
                      </div>

                    </div>
                  </Reveal>
                ))}
              </Reveal>
            </div>

            <Reveal
              delay={0.3}
              direction="left"
              className="therapy-journey-image lg:order-first w-full h-full rounded-xl overflow-hidden"
            >
              <HoverZoomContainer className="media-frame w-full rounded-xl overflow-hidden lg:h-full lg:aspect-auto">
                <HoverZoomImage
                  src={abstractHealingJourneyImage}
                  alt="The journey of self-understanding and emotional growth"
                  width={1600}
                  height={900}
                  baseScale={1}
                  className="w-full h-full object-cover"
                />
              </HoverZoomContainer>
            </Reveal>

          </div>

          <Reveal delay={0.6} className="therapy-journey-closing text-center mt-12">
            <p className="text-headline-md ui-heading">
              The goal isn't to become someone else. It is to become more
              fully yourself.
            </p>
          </Reveal>
        </Reveal>


        {/* FAQ */}
        <Reveal className="section-pad py-section max-w-[1440px] mx-auto surface-lowest">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left Content */}
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="text-headline-lg max-w-2xl mb-6 ui-heading">
                  Frequently Asked Questions About Therapy.
                </h2>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-body-lg ui-copy mb-8">
                  Starting therapy can bring up questions. Here are some
                  answers to help you understand the counselling process
                  and what to expect at Mind and Soul Klinic.
                </p>

                <p className="text-body-md ui-muted mb-8">
                  Still have questions? You can begin with a conversation.
                </p>

                <Link href="/conversation" className="btn btn-primary">
                  Ask a Question
                </Link>
              </Reveal>
            </div>

            {/* Right FAQ */}
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <details
                    className="group border-b pb-4 border-surface"
                    {...(i === 0 ? { open: true } : {})}
                  >
                    <summary className="flex justify-between items-center gap-5 py-4 cursor-pointer focus:outline-none ui-heading">
                      <h3 className="text-headline-md text-question">
                        {item.q}
                      </h3>

                      <span className="material-symbols-outlined faq-icon ui-muted shrink-0">
                        add
                      </span>
                    </summary>

                    <div className="text-body-md pb-4 pl-2 ui-copy">
                      <p>{item.a}</p>
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>

          </div>
        </Reveal>


        {/* FINAL CTA */}
        <Reveal
          id="contact"
          className="section-pad py-section flex items-center justify-center max-w-[1440px] mx-auto"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-stretch gap-12 lg:gap-20">

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <Reveal>
                <h2 className="text-headline-lg max-w-3xl mb-8 ui-heading">
                  You Don't Need to Know Exactly What You Need.
                </h2>
              </Reveal>

              <Reveal
                className="max-w-xl text-body-lg space-y-6 mb-8 ui-copy"
              >
                <Reveal>
                  <p>
                    Sometimes the first step is simply saying:
                  </p>
                </Reveal>

                <Reveal>
                  <p className="text-headline-md ui-heading">
                    "Something isn't feeling right, and I want to understand why."
                  </p>
                </Reveal>

                <Reveal>
                  <p>
                    That's enough to begin. Take the first step towards
                    understanding yourself with professional psychological
                    support.
                  </p>
                </Reveal>
              </Reveal>

              <Reveal
                delay={0.4}
                className="flex flex-col items-center lg:items-start gap-6"
              >
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link href="/conversation" className="btn btn-primary">
                    Begin a Conversation
                  </Link>

                  <Link href="/book-session" className="btn btn-primary">
                    Book a Session
                  </Link>
                </div>

                <span className="text-body-md italic ui-muted">
                  Whenever you're ready, we'll begin wherever you are.
                </span>
              </Reveal>
            </div>

            <Reveal
              delay={0.3}
              direction="right"
              className="flex h-full justify-center lg:justify-end"
            >
              <HoverZoomContainer className="media-frame w-full max-w-md rounded-3xl overflow-hidden lg:h-full lg:aspect-auto">
                <HoverZoomImage
                  src={beginConversationImage}
                  alt="Begin your therapy journey with Mind and Soul Klinic"
                  className="w-full h-full object-cover"
                />
              </HoverZoomContainer>
            </Reveal>

          </div>
        </Reveal>

      </main>

      {/* FAQ Structured Data for Search Engines and Answer Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />

    </>
  );
}
