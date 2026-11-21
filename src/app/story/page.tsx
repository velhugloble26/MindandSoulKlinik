
"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import {
  HoverZoomContainer,
  HoverZoomImage,
} from "@/components/ui/Motion";

const KIRAN_STORY_IMG = "https://images.openai.com/static-rsc-4/lIAAoGrkw4V8F3o2isuI-CghOzPRd6MaYRV-PUdSw_jrb3HAB-TLvqOqiBvFb0rDafrD_UfBeyl9d_Cx94TtZt0fM_WkABzH0zON9Q_u2nRYzgM4ytH7S0rrLCTOVMs2YRRfQZQ2iw9e_xhM5X8MxptR8z0XFIEaM5I93L-bFzAUUM42YNt1poqR8MuP1zGG?purpose=fullsize";

// EXISTING IMAGES – UNCHANGED
const understanding_people =
  "https://images.openai.com/static-rsc-4/CenUEEOEJxWWcAf0ITBOc1dpqZvfBlavf4HH7wNWxGqMACKUJztqVSDeaX-KOtp3FmszRYXpJ_LtaIpbIY_hjtJr-aGk_rvsMKZyzryYPS4OmYCLGNzVjV25-FCIhv27E4qJsl-ANGy7uWbZVGVn4O_PbUe-eaCSxGvz9IDkzwg?purpose=inline";

const everyone_deserves =
  "https://images.openai.com/static-rsc-4/quW3I43j2UuQlrnXQ66HKfRAoZJHD1N0BlHX6XmEmIsJaRA5Bkvukixnz0Z7fPjz6UcVLwcwxN113EwpJyTYrj5SHZRDZuE7mUr0ZAUS_jNI9SuPh6_NJZA628B9fpqJL-g2eeHs8TBuWkMXB16R2yhq37FV9BzeaGX3G0koXzA-tnKJD3q60pccpA9ppN7l?purpose=fullsize";

const therapy_should_fit_person =
  "https://images.openai.com/static-rsc-4/LNDCj8xvjuUMkbDWm5YW1Xgn6ujJakckkwxa9YEs48smLO0bABFNt2Hg7B5SQb86-MsHxdEE4jg6aTXtUh3POe8awgmV2oouhwkTb5n5XutjcH5FQZ5GBL3AqmqgaHFMo_OxDHoaHDoZbs4FaXf-tBDxGhaFv9od10CSZBlsqvN6RLjWcRFhm8FQael4vJR9?purpose=fullsize";

const beginConversationImage =
  "https://images.openai.com/static-rsc-4/J-sYuNLTBkw9P2Eu87Ejjw70CUjIvfoqvzX0ijhUQlpYFrR1b4dtjUccvhiS1d88F4BUaWJbiVWbdGZmZg-8fd21xnehvlpjoOTN21PT2Wg_iJ-RdbAnI9-S7M8gMrnt6shBimMgF00HYinnnZTDa9pHDLyP2BAmzSmK1ZMRUlqOuXnG8O5GVS2efSXGd9n6?purpose=fullsize";

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

        <Reveal className="section-pad py-section story-editorial-section">
          <div className="max-w-375 mx-auto w-full">
            <div className="story-editorial-card">
              <div className="story-editorial-content">

                <Reveal>
                  <h1 className="story-editorial-title">
                    "Before I became a therapist, I was always curious about people."
                  </h1>
                </Reveal>

                <Reveal className="story-editorial-copy">
                  <Reveal>
                    <p>What makes us think the way we do?</p>
                  </Reveal>

                  <Reveal>
                    <p>
                      Why do some experiences stay with us long after they have passed?
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      Why do we sometimes repeat patterns we consciously want to change?
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      And why can two people experience the same situation so differently?
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      My curiosity about human behaviour gradually became more
                      than an interest. It became a journey towards understanding
                      people, their emotions, experiences and the patterns that
                      shape their lives.
                    </p>
                  </Reveal>
                </Reveal>

                <Reveal delay={0.55}>
                  <div className="story-hero-actions">
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
                delay={0.55}
                direction="left"
                className="story-editorial-image-column"
              >
                <HoverZoomContainer className="story-editorial-media">
                  <HoverZoomImage
                    src={KIRAN_STORY_IMG}
                    alt="Kiran Khullar, therapist at Mind And Soul Klinic"
                    baseScale={1}
                    className="h-full w-full object-cover"
                  />
                </HoverZoomContainer>
              </Reveal>
            </div>
          </div>
        </Reveal>


        {/* 02 – UNDERSTANDING PEOPLE */}

        <Reveal className="section-pad py-section story-understanding-section">
          <div className="max-w-375 mx-auto w-full">
            <div className="story-understanding-card">
              <div className="story-understanding-content">

                <Reveal>
                  <h2 className="story-understanding-title">
                    I believe people are rarely as simple as their problems make them appear.
                  </h2>
                </Reveal>

                <Reveal className="story-understanding-copy">
                  <Reveal>
                    <p>
                      Over the years, I have come to understand that people
                      often see themselves through the difficulties they
                      experience. They may describe themselves as too anxious,
                      too emotional, too sensitive, too dependent or too angry.
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      But when we begin exploring their stories, we often
                      discover that their thoughts, emotions and behaviours
                      have a context. Their patterns have a history, and their
                      reactions may have meaning rooted in past experiences.
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      Beneath what someone is struggling with is a person
                      trying to cope with experiences, expectations and
                      emotions they may have carried for a long time.
                    </p>
                  </Reveal>

                  <Reveal>
                    <blockquote
                      className="story-understanding-quote italic"
                    >
                      I began seeing therapy not as a process of fixing what
                      was wrong, but as a process of understanding what was
                      there.
                    </blockquote>
                  </Reveal>
                </Reveal>
              </div>

              <Reveal
                delay={0.2}
                direction="left"
                className="story-understanding-image-column"
              >
                <HoverZoomContainer className="story-understanding-media">
                  <HoverZoomImage
                    src={understanding_people}
                    alt="Understanding people and their stories"
                    className="h-full w-full object-cover"
                    baseScale={1}
                  />
                </HoverZoomContainer>
              </Reveal>
            </div>
          </div>
        </Reveal>


        {/* 03 – EMPATHY AND UNDERSTANDING */}

        <Reveal className="section-pad py-section story-editorial-section">
          <div className="max-w-375 mx-auto w-full">
            <div className="story-editorial-card story-editorial-card--image-left">
              <div className="story-editorial-content">

                <Reveal>
                  <h2 className="story-editorial-title">
                    Everyone deserves to be understood.
                  </h2>
                </Reveal>

                <Reveal className="story-editorial-copy">
                  <Reveal>
                    <p>
                      Not just heard. Not simply advised. Not immediately
                      analysed.{" "}
                      <strong className="ui-heading">Understood.</strong>
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      Sometimes, what people need most is a space where they
                      can speak openly without having to explain, justify or
                      defend everything they feel.
                    </p>
                  </Reveal>

                  <Reveal>
                    <p>
                      I believe in looking beyond what is visible on the
                      surface and becoming curious about what someone feels,
                      fears, protects, hopes for and may not yet have the
                      words to express.
                    </p>
                  </Reveal>

                  <Reveal>
                    <p className="pt-4 font-medium ui-heading">
                      That is where I believe meaningful therapy begins.
                    </p>
                  </Reveal>
                </Reveal>

              </div>

              <Reveal
                delay={0.3}
                direction="right"
                className="story-editorial-image-column"
              >
                <HoverZoomContainer className="story-editorial-media">
                  <HoverZoomImage
                    src={everyone_deserves}
                    alt="Everyone deserves to be understood"
                    className="h-full w-full object-cover object-center"
                    baseScale={1.03}
                  />
                </HoverZoomContainer>
              </Reveal>

            </div>
          </div>
        </Reveal>


        {/* 04 – MY THERAPEUTIC PHILOSOPHY */}

        <Reveal className="section-pad py-section story-editorial-section">
          <div className="max-w-375 mx-auto w-full">
            <div className="story-editorial-card">

            <Reveal
              direction="right"
              className="story-editorial-image-column"
            >
              <div className="story-editorial-media">
                <HoverZoomContainer className="absolute inset-0 h-full w-full overflow-hidden">
                  <HoverZoomImage
                    src={therapy_should_fit_person}
                    alt="Therapy should fit the person"
                    className="h-full w-full object-cover"
                    baseScale={1.05}
                  />

                </HoverZoomContainer>
              </div>
            </Reveal>

            <Reveal
              className="story-editorial-content story-editorial-copy"
            >

              <Reveal>
                <h2 className="story-editorial-title">
                  I don't believe there is a single formula for a human being.
                </h2>
              </Reveal>

              <Reveal>
                <p>
                  Every person who enters therapy brings a different history,
                  personality, relationships and way of making sense of life.
                  What works for one individual may not necessarily work for
                  another.
                </p>
              </Reveal>

              <Reveal>
                <p>
                  My approach is individualised and draws upon appropriate
                  psychological and therapeutic methods according to the
                  person's concerns, needs and goals.
                </p>
              </Reveal>

              <Reveal>
                <p>
                  Our work may involve exploring thoughts, emotions,
                  behavioural responses, relationships, beliefs and past
                  experiences, depending on what brings someone to therapy.
                </p>
              </Reveal>

              <Reveal>
                <p className="font-medium ui-heading">
                  But the approach always begins with the person, not the
                  technique.
                </p>
              </Reveal>

            </Reveal>

            </div>
          </div>
        </Reveal>
        

        {/* 07 – CLOSING CTA */}

        <Reveal className="section-pad py-section story-editorial-section">
          <div className="max-w-375 mx-auto w-full">
            <div className="story-editorial-card story-editorial-card--image-left">
              <div className="story-editorial-content">

                <Reveal>
                  <h2 className="story-editorial-title">
                    You don't have to have everything figured out.
                  </h2>
                </Reveal>

                <Reveal delay={0.5}>
                  <p>
                    A first conversation doesn't have to be a commitment to
                    a long therapeutic journey. It can simply be a beginning.
                    A chance to talk, understand what is happening and explore
                    whether this feels like the right space for you.
                  </p>
                </Reveal>

                <Reveal delay={0.55}>
                  <div className="story-hero-actions">

                    <Link href="/conversation" className="btn btn-primary">
                      Begin a Conversation
                    </Link>

                    <Link href="/book-session" className="btn btn-primary">
                      Book a Session
                    </Link>

                  </div>
                </Reveal>

                <Reveal delay={0.4}>
                  <p className="story-editorial-note italic">
                    Whenever you're ready, we'll begin wherever you are.
                  </p>
                </Reveal>

              </div>

              <Reveal
                delay={0.3}
                direction="right"
                className="story-editorial-image-column"
              >
                <HoverZoomContainer className="story-editorial-media">

                  <HoverZoomImage
                    src={beginConversationImage}
                    alt="Begin a conversation"
                    className="h-full w-full object-cover"
                    baseScale={1.05}
                  />

                </HoverZoomContainer>
              </Reveal>

            </div>
          </div>
        </Reveal>

      </main>
    </>
  );
}
