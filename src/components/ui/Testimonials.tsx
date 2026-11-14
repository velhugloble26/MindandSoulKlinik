import Reveal from "@/components/animations/Reveal";

// Shows only testimonials passed in (published ones); renders nothing when there are none.
export default function Testimonials({ items }: { items: any[] }) {
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="container-site">
        <h2 className="heading-lg">What clients say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={String(t._id)} direction={i % 2 === 0 ? "left" : "right"}>
              <figure className="card card-assessment h-full">
                <blockquote>{t.message}</blockquote>
                <figcaption className="mt-4 font-semibold text-[var(--heading)]">
                  {t.name}{t.role ? <span className="text-muted font-normal"> · {t.role}</span> : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
