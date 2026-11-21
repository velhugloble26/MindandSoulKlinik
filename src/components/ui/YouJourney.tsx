
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { HoverZoomContainer, HoverZoomImage } from "@/components/ui/Motion";

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "We begin by understanding your concerns, experiences and goals.",
  },
  {
    number: "02",
    title: "Explore",
    description:
      "We explore emotional responses, thoughts and behavioural patterns.",
  },
  {
    number: "03",
    title: "Work Towards Change",
    description:
      "Develop healthier perspectives, coping strategies and responses.",
  },
  {
    number: "04",
    title: "Grow",
    description:
      "Continue building emotional awareness, confidence and resilience.",
  },
];

export default function YourJourney() {
  return (
    <section className="section-pad py-section story-editorial-section journey-intro" id="healing-journey">
      <div className="max-w-375 mx-auto w-full">
        <div className="story-editorial-card story-editorial-card--image-left">

        {/* LEFT SIDE - IMAGE */}

        <Reveal direction="left" className="story-editorial-image-column">
          <HoverZoomContainer className="story-editorial-media">
            <HoverZoomImage
              src="/You_Journey.jpeg"
              alt="Your journey towards healing"
              width={800}
              height={900}
              className="w-full h-full object-cover"
            />
          </HoverZoomContainer>
        </Reveal>

        {/* RIGHT SIDE - TEXT */}

        <Reveal direction="right" className="story-editorial-content story-editorial-copy">
            <h2 className="story-editorial-title">
              Change Begins With Understanding.
            </h2>

            <p>
              Every healing journey is unique. At Mind and Soul
              Klinic, we work with you through a supportive and
              personalised process that encourages understanding,
              awareness and meaningful change.
            </p>

            <div className="mt-8 space-y-7">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-5 items-start">
                  <span className="text-2xl font-semibold ui-heading">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="heading-md ui-heading">
                      {step.title}
                    </h3>

                    <p className="mt-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/therapy"
              className="btn btn-outline mt-2"
            >
              Explore Our Therapy Approach
            </Link>
        </Reveal>

        </div>
      </div>
    </section>
  );
}
