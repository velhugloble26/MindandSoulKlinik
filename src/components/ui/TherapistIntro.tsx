import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { HoverZoomContainer, HoverZoomImage } from "@/components/ui/Motion";

export default function TherapistIntro() {
  return (
    <section className="section-pad py-section story-editorial-section therapist-intro" id="therapist">
      <div className="max-w-375 mx-auto w-full">
        <div className="story-editorial-card story-editorial-card--image-left">
        <Reveal direction="left" className="story-editorial-image-column">
          <HoverZoomContainer className="story-editorial-media">
            <HoverZoomImage
              src="/kiran_khular.avif"
              alt="Kiran Khullar"
              width={800}
              height={1000}
              className="w-full h-full object-cover"
            />
          </HoverZoomContainer>
        </Reveal>
        <Reveal direction="right" className="story-editorial-content story-editorial-copy">
          <h2 className="story-editorial-title">Meet Your Therapist</h2>
          <p className="font-semibold ui-heading">Kiran Khullar</p>
          <p>
            Kiran Khullar is a Cognitive Hypnotic Coach and Cognitive Hypnotic Psychotherapist, an NLP
            practitioner, a Counselling Psychologist, a Life Coach and a Career Counsellor.
          </p>
          <p>
            Her primary goal is to destigmatize mental health issues and enhance personal as well as
            professional well-being.
          </p>
          <p>
            Her approach involves deeply understanding each client&apos;s unique situation before determining
            the most appropriate therapy.
          </p>
          <p>
            She believes in providing personalized, empathetic and warm care through a non-judgmental approach.
          </p>
          <Link href="/about" className="btn btn-outline mt-2">Read more about Kiran</Link>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
