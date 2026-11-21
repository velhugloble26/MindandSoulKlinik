
import Link from "next/link";
import Reveal from "@/components/animations/Reveal";

const concerns = [
  {
    title: "Anxiety & Overthinking",
    description:
      "Racing thoughts, constant worry, stress and emotional overwhelm.",
    id: "anxiety-overthinking",
  },
  {
    title: "Relationship Difficulties",
    description:
      "Communication gaps, recurring conflicts and emotional distance.",
    id: "relationship-difficulties",
  },
  {
    title: "Childhood Emotional Wounds",
    description:
      "Past experiences that may continue to influence present emotions and behaviour.",
    id: "childhood-emotional-wounds",
  },
  {
    title: "Self-Esteem & Confidence",
    description:
      "Self-doubt, people-pleasing, low self-worth and lack of confidence.",
    id: "self-esteem-confidence",
  },
  {
    title: "Emotional Regulation",
    description:
      "Difficulty understanding, expressing and managing emotions.",
    id: "emotional-regulation",
  },
  {
    title: "Life Transitions",
    description:
      "Navigating career changes, family changes and personal challenges.",
    id: "life-transitions",
  },
];

export default function BringsYouHere() {
  return (
    <section className="section-pad py-section story-editorial-section" id="what-brings-you-here">
      <div className="container-site">

        <Reveal direction="up">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="story-editorial-title">
              Sometimes, You Just Need Someone Who Understands.
            </h2>

            <p className="text-body mt-5">
              You may not always have the words to explain what you are
              feeling. Sometimes, you simply know that something doesn't
              feel right.
            </p>

            <p className="text-body mt-3">
              At Mind and Soul Klinic, we offer a supportive space to
              understand your concerns, explore emotional patterns and
              work towards meaningful change.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {concerns.map((concern, index) => (
            <Reveal key={concern.id} direction="up">
              <div className="card card-assessment card-hover h-full">
                <h3 className="heading-md ui-heading">
                  {concern.title}
                </h3>

                <p className="text-body mt-4">
                  {concern.description}
                </p>

                <Link
                  href="/services"
                  className="btn btn-outline mt-6"
                >
                  Explore More →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
