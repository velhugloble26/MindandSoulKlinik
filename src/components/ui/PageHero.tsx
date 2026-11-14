import Reveal from "@/components/animations/Reveal";
import type { ReactNode } from "react";

type Props = {
  title?: string;
  intro?: string;
  eyebrow?: string;
  headline?: string;
  body?: string;
  centered?: boolean;
  children?: ReactNode;
};

export default function PageHero({
  title,
  intro,
  eyebrow,
  headline,
  body,
  centered = false,
  children,
}: Props) {
  const resolvedHeadline = headline ?? title;
  const resolvedBody = body ?? intro;

  return (
    <section className="page-hero hero-glow section">
      <div className={`container-site${centered ? " page-hero-centered" : ""}`}>
        <Reveal direction="left">
          {eyebrow && <span className="badge mb-5">{eyebrow}</span>}
          {resolvedHeadline && (
            <h1 className="heading-xl max-w-3xl">{resolvedHeadline}</h1>
          )}
          {resolvedBody && <p className="text-body mt-5">{resolvedBody}</p>}
          {children && <div className="page-hero-actions">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
