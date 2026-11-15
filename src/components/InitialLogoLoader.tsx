"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function InitialLogoLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLeaving(true), 650);
    const hideTimer = window.setTimeout(() => setVisible(false), 950);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] grid place-items-center bg-[var(--color-background)] transition-opacity duration-300 ${leaving ? "pointer-events-none opacity-0" : "opacity-100"}`}
      role="status"
      aria-label="Loading Mind And Soul Klinic"
    >
      <div className="flex flex-col items-center gap-5">
        <Image
          src="/website_logo.avif"
          alt="Mind And Soul Klinic"
          width={1024}
          height={1024}
          priority
          className="h-[40vh] w-auto max-w-[85vw] animate-pulse object-contain"
        />
        <span className="h-0.5 w-20 overflow-hidden rounded-full bg-[var(--color-surface-variant)]">
          <span className="block h-full w-1/2 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-[var(--color-primary)]" />
        </span>
      </div>
    </div>
  );
}
