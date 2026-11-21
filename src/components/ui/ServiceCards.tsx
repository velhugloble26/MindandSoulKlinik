import Link from "next/link";
import { Check } from "lucide-react";
import Reveal from "@/components/animations/Reveal";

export type ServiceItem = { id: string; title: string; tone: string; description: string; points: readonly string[] };

export default function ServiceCards({ services }: { services: ServiceItem[] }) {
  return (
    <section className="section-pad py-section story-editorial-section">
      <div className="container-site">
        <Reveal direction="up">
          <h2 className="story-editorial-title max-w-2xl">Support for the moments that matter</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.id} direction={i % 2 === 0 ? "left" : "right"}>
              <article id={s.id} className={`card card-${s.tone} card-hover h-full`}>
                <h3 className="heading-md ui-heading">{s.title}</h3>
                <p className="mt-3">{s.description}</p>
                <ul className="check-list">
                  {s.points.map((p) => (
                    <li key={p}><Check size={16} />{p}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/services" className="btn btn-primary">View More Services</Link>
        </div>
      </div>
    </section>
  );
}
