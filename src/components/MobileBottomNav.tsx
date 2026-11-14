"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, HeartHandshake, House, Phone } from "lucide-react";

const items = [
  { href: "/home", label: "Home", Icon: House },
  { href: "/story", label: "Story", Icon: BookOpen },
  { href: "/therapy", label: "Therapy", Icon: HeartHandshake },
  { href: "/book-session", label: "Book", Icon: CalendarDays },
  { href: "/contact", label: "Contact", Icon: Phone },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map(({ href, label, Icon }) => {
        const active =
          href === "/home"
            ? pathname === "/" || pathname === "/home"
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={`mobile-bottom-nav-link${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={21} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
