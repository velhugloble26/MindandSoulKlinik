
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { HoverZoomContainer, HoverZoomImage } from "@/components/ui/Motion";

const approaches = [
  {
    title: "Psychotherapy",
    description:
      "Understanding emotional and psychological difficulties, thought patterns and behavioural responses to support meaningful change.",
  },
  {
    title: "Cognitive Hypnotic Coaching",
    description:
      "Exploring thought patterns, emotional responses and underlying patterns to facilitate personal change and self-understanding.",
  },
  {
    title: "NLP-Based Techniques",
    description:
      "Working with patterns of thinking, communication and behaviour to develop healthier perspectives and responses.",
  },
  {
    title: "Emotional Healing",
    description:
      "Developing healthier ways to understand, process and respond to emotions and life experiences.",
  },
  {
    title: "Personal Growth Coaching",
    description:
      "Building self-awareness, confidence, clarity and the ability to move towards meaningful personal goals.",
  },
];

export default function OurApproach() {
  return (
    <section className="section pt-40 approach-intro" id="our-approach">
      <div className="container-site split">

        {/* LEFT SIDE - TEXT */}

        <Reveal direction="left">
          <div>
            <h2 className="heading-lg">
              Understanding the Person Behind the Problem.
            </h2>

            <p className="text-body mt-5">
              At Mind and Soul Klinic, we believe that meaningful
              change begins with understanding. We look beyond
              immediate concerns to explore emotional experiences,
              thought patterns, behaviours and relationship dynamics.
            </p>

            <div className="mt-7 space-y-6">
              {approaches.map((approach) => (
                <div key={approach.title}>
                  <h3 className="heading-md">
                    {approach.title}
                  </h3>

                  <p className="text-body mt-2">
                    {approach.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-body mt-7">
              Every individual is unique. The therapeutic approach
              is selected according to the person&apos;s concerns,
              needs and suitability, ensuring personalised
              and supportive care.
            </p>

            <Link
              href="/therapy"
              className="btn btn-outline mt-7"
            >
              Explore Our Therapy Approach
            </Link>
          </div>
        </Reveal>

        {/* RIGHT SIDE - IMAGE */}

        <Reveal direction="right">
          <HoverZoomContainer className="media-frame">
            <HoverZoomImage
              src="/our-approach.jpeg"
              alt="Our therapeutic approach at Mind and Soul Klinic"
              width={800}
              height={1000}
              className="w-full h-full object-cover"
            />
          </HoverZoomContainer>
        </Reveal>

      </div>
    </section>
  );
}
