"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  number: string;
  shortTitle: string;
}

interface LegalContentsSidebarProps {
  items: TocItem[];
  ariaLabel?: string;
}

export default function LegalContentsSidebar({
  items,
  ariaLabel = "Page sections",
}: LegalContentsSidebarProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) return;

    const handleScroll = () => {
      const scrollOffset = 160;
      let current = items[0].id;

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= scrollOffset) {
          current = item.id;
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40
      ) {
        current = items[items.length - 1].id;
      }

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  return (
    <aside className="hidden lg:sticky lg:top-35 lg:block">
      <div className="rounded-2xl border border-black/[0.07] bg-white/60 p-5 backdrop-blur-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider ui-muted">
          Contents
        </p>
        <nav aria-label={ariaLabel}>
          <ul className="space-y-1">
            {items.map(({ id, number, shortTitle }) => {
              const isActive = activeId === id;

              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setActiveId(id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`group flex items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-1.5 text-sm transition-all duration-200 ${
                      isActive
                        ? "border-current bg-black/[0.06] font-semibold ui-heading"
                        : "border-transparent ui-copy hover:bg-black/[0.035]"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs transition-colors ${
                        isActive
                          ? "ui-accent font-semibold"
                          : "ui-muted group-hover:ui-heading"
                      }`}
                    >
                      {number}
                    </span>
                    <span className="truncate group-hover:ui-heading">
                      {shortTitle}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}