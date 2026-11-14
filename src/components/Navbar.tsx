"use client";

import { AUTH_ME, MY_BOOKINGS } from "@/utils/api";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CalendarPlus } from "lucide-react";

const LOGO_URL = "/website_logo.avif";

export default function Navbar() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasBookings, setHasBookings] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navLinksVisible = true;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadBookingState() {
      try {
        const authResponse = await fetch(AUTH_ME, { cache: "no-store" });
        const authPayload = authResponse.ok ? await authResponse.json() : null;
        if (!authPayload?.success || !authPayload?.data?.user) {
          if (active) setHasBookings(false);
          return;
        }

        const bookingsResponse = await fetch(MY_BOOKINGS, {
          cache: "no-store",
        });
        const bookingsPayload = bookingsResponse.ok
          ? await bookingsResponse.json()
          : null;
        if (active) {
          setHasBookings(
            Boolean(
              bookingsPayload?.success &&
              bookingsPayload?.data?.bookings?.length,
            ),
          );
        }
      } catch {
        if (active) setHasBookings(false);
      }
    }

    loadBookingState();

    return () => {
      active = false;
    };
  }, []);

  const bookingCtaHref = hasBookings ? "/my-bookings" : "/conversation";
  const bookingCtaLabel = hasBookings ? "My Bookings" : "Begin";

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/story", label: "Story" },
    { href: "/therapy", label: "Therapy" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
    
  ];

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`site-navbar glass-nav sticky top-0 z-50 w-full transition-all duration-300 ease-in-out${isScrolled ? " navbar-scrolled" : ""}`}
      >
        <div
          className="site-navbar-inner flex justify-between items-center w-full py-5 mx-auto"
        >
          {/* Brand */}
          <Link href="/" aria-label="Adore Life – Home" className="site-brand-link">
            <Image
              src={LOGO_URL}
              alt="Adore Life"
              width={1024}
              height={1024}
              className="site-brand-logo h-24 w-auto object-contain transition-transform duration-500 hover:scale-105 hover:opacity-90"
              loading="eager"
            />
          </Link>

          {/* Desktop nav */}
          <motion.nav
            initial={false}
            animate={{
              opacity: navLinksVisible ? 1 : 0,
              y: navLinksVisible ? 0 : -10,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
            aria-hidden={!navLinksVisible}
            inert={!navLinksVisible ? true : undefined}
            style={{ pointerEvents: navLinksVisible ? "auto" : "none" }}
          >
            {navLinks.map(({ href, label }) => {
              const active =
                href === "/home"
                  ? pathname === "/home"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="nav-link relative pb-1"
                  style={{
                    color: active
                      ? "var(--color-primary)"
                      : "var(--color-on-surface-variant)",
                  }}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-soft-teal"
                      style={{ backgroundColor: "var(--color-soft-teal)" }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </motion.nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/book-session"
              className="site-navbar-cta btn btn-primary"
            >
              Book an Appointment <CalendarPlus size={18} />
            </Link>
            <motion.div
              className="site-navbar-menu mobile-menu-toggle md:hidden"
              initial={false}
              animate={{
                opacity: navLinksVisible ? 1 : 0,
                scale: navLinksVisible ? 1 : 0.92,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
              style={{ pointerEvents: navLinksVisible ? "auto" : "none" }}
              aria-hidden={!navLinksVisible}
              inert={!navLinksVisible ? true : undefined}
            >
              <button
                className="transition-transform duration-300 hover:scale-110 active:scale-95"
                aria-label="Open menu"
                onClick={() => setMobileOpen((o) => !o)}
                style={{ color: "var(--color-primary)" }}
              >
                <span className="material-symbols-outlined text-2xl">
                  {mobileOpen ? "close" : "menu"}
                </span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && navLinksVisible && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mobile-nav-drawer md:hidden flex flex-col gap-1 px-6 pb-6 overflow-hidden"
              aria-label="Mobile navigation"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              {navLinks.map(({ href, label }, i) => {
                const active =
                  href === "/home"
                    ? pathname === "/home"
                    : pathname.startsWith(href);
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`nav-link py-3 block border-b${active ? " nav-link-active" : ""}`}
                      style={{ borderColor: "var(--color-outline-variant)" }}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + navLinks.length * 0.05,
                  duration: 0.4,
                }}
              >
                <Link
                  href={bookingCtaHref}
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary mt-4 self-start inline-flex hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  {bookingCtaLabel}
                </Link>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
}
