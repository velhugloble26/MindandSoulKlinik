
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { HoverZoomContainer, HoverZoomImage } from "@/components/ui/Motion";

const faqs = [
  {
    question: "What happens during the first therapy session?",
    answer:
      "Your first session is an opportunity to discuss your concerns, experiences and expectations. We take time to understand your situation, explore what brings you to therapy and discuss your goals. Together, we can identify a suitable way forward.",
  },
  {
    question: "Is counselling confidential?",
    answer:
      "Yes. Your privacy and confidentiality are important to us. Information shared during sessions is treated with professional care and discretion, subject to applicable legal, ethical and safety-related exceptions.",
  },
  {
    question: "Do you offer online and offline sessions?",
    answer:
      "We can discuss the available consultation options and help you understand which format may be suitable for your needs. Please contact us for current availability and appointment details.",
  },
  {
    question: "How many therapy sessions will I need?",
    answer:
      "The number of sessions varies from person to person. It depends on your concerns, goals, individual circumstances and progress. We review the process together and discuss the next steps as therapy progresses.",
  },
  {
    question: "What is Cognitive Hypnotic Coaching?",
    answer:
      "Cognitive Hypnotic Coaching is an approach that works with thoughts, emotions, behavioural responses and underlying patterns. It can help individuals develop greater self-awareness and work towards meaningful personal change.",
  },
  {
    question: "Is therapy suitable for relationship and family concerns?",
    answer:
      "Yes. Therapy can provide support for relationship difficulties, communication gaps, emotional distance, family conflicts and parenting challenges. The approach depends on the concerns and needs of the individuals involved.",
  },
  {
    question: "How can I book an appointment?",
    answer:
      "You can get in touch with Mind and Soul Klinic through our Contact page to enquire about appointments, available consultation options and session details.",
  },
];

export default function FrequentlyAskedQuestions() {
  return (
    <section className="section-pad py-section story-editorial-section faq-intro" id="faqs">
      <div className="max-w-375 mx-auto w-full">
        <div className="story-editorial-card story-editorial-card--image-left">

        {/* LEFT SIDE - IMAGE */}

        <Reveal direction="left" className="story-editorial-image-column">
          <HoverZoomContainer className="story-editorial-media">
            <HoverZoomImage
              src="/faq.jpeg"
              alt="Frequently asked questions at Mind and Soul Klinic"
              width={800}
              height={900}
              className="w-full h-full object-cover"
            />
          </HoverZoomContainer>
        </Reveal>

        {/* RIGHT SIDE - FAQ CONTENT */}

        <Reveal direction="right" className="story-editorial-content story-editorial-copy">
            <h2 className="story-editorial-title">
              Frequently Asked Questions
            </h2>

            <p>
              Starting therapy can bring up many questions.
              Here are some answers to help you feel more
              informed and comfortable about taking your
              first step.
            </p>

            <div className="mt-8 space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group border-b border-surface pb-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 ui-heading">
                    <span className="heading-md">
                      {faq.question}
                    </span>

                    <span className="text-xl transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="mt-3">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-8">
              <p>
                Still have questions? We are here to help.
              </p>

              <Link
                href="/contact"
                className="btn btn-outline mt-2"
              >
                Contact Us
              </Link>
            </div>
        </Reveal>

        </div>
      </div>
    </section>
  );
}
