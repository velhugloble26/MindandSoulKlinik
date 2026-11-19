
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
    <section className="section pt-40 journey-intro" id="healing-journey">
      <div className="container-site split">

        {/* LEFT SIDE - IMAGE */}

        <Reveal direction="left">
          <HoverZoomContainer className="media-frame">
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

        <Reveal direction="right">
          <div>
            <h2 className="heading-lg">
              Change Begins With Understanding.
            </h2>

            <p className="text-body mt-5">
              Every healing journey is unique. At Mind and Soul
              Klinic, we work with you through a supportive and
              personalised process that encourages understanding,
              awareness and meaningful change.
            </p>

            <div className="mt-8 space-y-7">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex gap-5 items-start"
                >
                  <span className="text-2xl font-semibold">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="heading-md">
                      {step.title}
                    </h3>

                    <p className="text-body mt-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/therapy"
              className="btn btn-outline mt-8"
            >
              Explore Our Therapy Approach
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
