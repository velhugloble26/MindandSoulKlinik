import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import Reveal from "@/components/animations/Reveal";

export type ContentItem = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  badge?: string;
  meta?: string[];
  points?: string[];
  cta?: { label: string; href: string; external?: boolean };
};

export function EmptyState({ failed, text }: { failed?: boolean; text: string }) {
  return (
    <div className="card card-therapy max-w-xl" role="status">
      <p className="heading-md">{failed ? "We couldn't load this right now" : "Nothing here yet"}</p>
      <p className="mt-2">{failed ? "Please refresh in a moment, or contact us if it continues." : text}</p>
    </div>
  );
}

export default function ContentGrid({ items, failed, emptyText }: { items: ContentItem[]; failed?: boolean; emptyText: string }) {
  if (!items.length) return <EmptyState failed={failed} text={emptyText} />;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <Reveal key={it.id} direction={i % 2 === 0 ? "left" : "right"}>
          <article className="card card-hover flex h-full flex-col !p-0 overflow-hidden">
            {it.image && (
              <div className="relative aspect-[16/10]">
                <Image src={it.image} alt={it.title} fill sizes="(min-width:1024px) 380px, 100vw" className="object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              {it.badge && <span className="badge badge-soft self-start">{it.badge}</span>}
              <h3 className="heading-md mt-3">{it.title}</h3>
              {it.meta && it.meta.length > 0 && <p className="text-muted mt-1">{it.meta.join(" · ")}</p>}
              {it.description && <p className="mt-3 line-clamp-5">{it.description}</p>}
              {it.points && it.points.length > 0 && (
                <ul className="check-list">
                  {it.points.map((p) => <li key={p}><Check size={16} />{p}</li>)}
                </ul>
              )}
              {it.cta && (
                <div className="mt-auto pt-5">
                  {it.cta.external ? (
                    <a href={it.cta.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{it.cta.label}</a>
                  ) : (
                    <Link href={it.cta.href} className="btn btn-outline">{it.cta.label}</Link>
                  )}
                </div>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
