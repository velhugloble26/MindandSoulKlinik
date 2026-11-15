"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { PiWhatsappLogo } from "react-icons/pi";
import { LiaYoutube } from "react-icons/lia";
import { BsFacebook, BsTwitter } from "react-icons/bs";

const LOGO_URL = "/website_logo.avif";

const footerSocialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/mindandsoulklinic/",
    icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/mindandsoulklinic",
    icon: LiaYoutube,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/mindandsoulklinic",
    icon: BsFacebook,
  },
  // { label: "Twitter", href: "https://twitter.com/", icon: BsTwitter },
  { label: "Call Mind And Soul Klinic", href: "tel:+919811378979 ", icon: Phone },
  {
    label: "Chat on WhatsApp",
    href: "https://wa.me/919811378979 ",
    icon: PiWhatsappLogo,
  },
];

export default function Footer() {
  return (
    <footer
      className="w-full relative overflow-hidden"
      style={{ backgroundColor: "var(--color-surface-container-low)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row justify-between items-center gap-8 py-16 max-w-[1440px] mx-auto"
        style={{
          paddingLeft: "clamp(1rem, 4vw, 4rem)",
          paddingRight: "clamp(1rem, 4vw, 4rem)",
        }}
      >
        {/* Brand */}
        <Link href="/" aria-label="Mind And Soul Klinic – Home">
          <Image
            src={LOGO_URL}
            alt="Mind And Soul Klinic"
            width={1024}
            height={1024}
            className="transition-transform duration-500 hover:scale-105 hover:opacity-80"
            style={{ width: 280, height: "auto" }}
            loading="lazy"
          />
        </Link>

        {/* Footer navigation */}
        <div className="flex flex-col items-center gap-4 text-center">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            aria-label="Footer navigation"
          >
            <Link className="nav-link" href="/blog">
              Blog
            </Link>
            <Link className="nav-link" href="/gallery">
              Gallery
            </Link>
            <Link className="nav-link" href="/terms-and-conditions">
              Terms & Conditions
            </Link>
            <Link className="nav-link" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="nav-link" href="/contact">
              Contact
            </Link>
            {/* <Link
              className="nav-link"
              href="/contact#emergency-helplines"
            >
              Emergency Helplines
            </Link> */}
          </nav>
          <nav
            className="flex flex-wrap items-center justify-center gap-3"
            aria-label="Social media and contact links"
          >
            {footerSocialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                aria-label={label}
                title={label}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-primary)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-soft-teal)] hover:bg-[var(--color-soft-teal)] hover:text-white hover:shadow-md"
              >
                <Icon size={22} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <p
            className="text-body-md"
            style={{ color: "var(--color-on-surface)" }}
          >
            © Mind And Soul Klinic. Because everyone deserves to be understood.
          </p>
        </div>

        {/* Footer action */}
        <motion.div
          whileHover={{ y: -2 }}
          className="flex items-center justify-center"
        >
          <Link
            href="/my-bookings"
            className="btn btn-primary footer-bookings-button"
            style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
          >
            My Bookings
          </Link>
        </motion.div>
      </motion.div>
    </footer>
  );
}
