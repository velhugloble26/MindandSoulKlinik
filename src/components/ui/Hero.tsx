import Link from "next/link";
import { CalendarPlus, ArrowRight, User, Droplets, Heart } from "lucide-react";
import Reveal from "@/components/animations/Reveal";

const HIGHLIGHTS = [
  { icon: User, title: "Individual Counselling", text: "Understand yourself and heal." },
  { icon: Droplets, title: "Anxiety & Stress", text: "Find mental calm again." },
  { icon: Heart, title: "Relationship Building", text: "Strengthen bonds and communication." },
];

export default function Hero() {
  return (
    <section className="hero-glow hero-background section !pb-28">
      <div className="container-site hero-copy">
        <Reveal direction="left">
          <span className="badge">Counselling &amp; Psychotherapy</span>
          <h1 className="heading-xl mt-5">Helping You Reclaim Your Inner Harmony</h1>
          <p className="text-body mt-6">Is this problem actually real or is it just a part of my map?</p>
          <p className="text-body">And what exactly is this map?</p>
          <p className="text-body">
            A map is our representation of a problem based on our individual and social conditioning.
          </p>
          <p className="text-body">
            At the Mind and Soul Klinik, we help you understand your map and figure out how your
            generalizations, distortions and deletions can lead to diverse interpretations of events and
            situations, helping you reach the core issue of your problem.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book-session" className="btn btn-primary">
              Book an Appointment <CalendarPlus size={18} />
            </Link>
            <Link href="/services" className="btn btn-outline">
              Explore Our Services <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="container-site -mb-24 mt-12">
        <Reveal direction="up">
          <div className="card grid gap-6 md:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-4">
                <span className="grid h-12 w-12 flex-none place-items-center rounded-[var(--radius-md)] bg-[var(--section-background)] text-[var(--heading)]">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="font-semibold text-[var(--heading)]">{title}</p>
                  <p className="text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
