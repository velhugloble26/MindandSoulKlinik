import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/animations/Reveal";

export default function TherapistIntro() {
  return (
    <section className="section pt-40 therapist-intro" id="therapist">
      <div className="container-site split">
        <Reveal direction="left">
          <div className="media-frame">
            <Image src="/kiran_khular.avif" alt="Kiran Khullar" width={800} height={1000} />
          </div>
        </Reveal>
        <Reveal direction="right">
          <h2 className="heading-lg">Meet Your Therapist</h2>
          <p className="heading-md mt-3">Kiran Khullar</p>
          <p className="text-body mt-5">
            Kiran Khullar is a Cognitive Hypnotic Coach and Cognitive Hypnotic Psychotherapist, an NLP
            practitioner, a Counselling Psychologist, a Life Coach and a Career Counsellor.
          </p>
          <p className="text-body">
            Her primary goal is to destigmatize mental health issues and enhance personal as well as
            professional well-being.
          </p>
          <p className="text-body">
            Her approach involves deeply understanding each client&apos;s unique situation before determining
            the most appropriate therapy.
          </p>
          <p className="text-body">
            She believes in providing personalized, empathetic and warm care through a non-judgmental approach.
          </p>
          <Link href="/about" className="btn btn-outline mt-7">Read more about Kiran</Link>
        </Reveal>
      </div>
    </section>
  );
}
