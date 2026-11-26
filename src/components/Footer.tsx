"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { PiWhatsappLogo } from "react-icons/pi";
import { LiaYoutube } from "react-icons/lia";
import { BsFacebook } from "react-icons/bs";

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
  {
    label: "Call Mind And Soul Klinic",
    href: "tel:+919811378979",
    icon: Phone,
  },
  {
    label: "Chat on WhatsApp",
    href: "https://wa.me/919811378979",
    icon: PiWhatsappLogo,
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="site-footer__content"
      >
        {/* Column 1: Brand & Social Icons (4 cols) */}
        <div className="site-footer__brand">
          <Link
            href="/"
            aria-label="Mind And Soul Klinic – Home"
            className="site-footer__brand-link"
          >
            <Image
              src={LOGO_URL}
              alt="Mind And Soul Klinic"
              width={1024}
              height={1024}
              className="site-footer__logo"
              loading="lazy"
            />
          </Link>

          <nav
            className="site-footer__social-links"
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
                className="site-footer__social-link"
              >
                <Icon size={20} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        {/* Column 2: Explore Links (2 cols) */}
        <div className="site-footer__section">
          <h4 className="site-footer__title">Explore</h4>
          <nav
            className="site-footer__navigation"
            aria-label="Explore navigation"
          >
            <Link className="nav-link" href="/blog">
              Blog
            </Link>
            <Link className="nav-link" href="/gallery">
              Gallery
            </Link>
            <Link className="nav-link" href="/contact">
              Contact
            </Link>
          </nav>
        </div>

        {/* Column 3: Legal Links (2 cols) */}
        <div className="site-footer__section">
          <h4 className="site-footer__title">Legal</h4>
          <nav
            className="site-footer__navigation"
            aria-label="Legal navigation"
          >
            <Link className="nav-link" href="/terms-and-conditions">
              Terms & Conditions
            </Link>
            <Link className="nav-link" href="/privacy-policy">
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* Column 4: Bookings Card (4 cols) */}
        <div className="site-footer__booking">
          <div className="site-footer__booking-card">
            <h3 className="site-footer__booking-title">
              Manage Sessions or Appointments
            </h3>
            <p className="site-footer__booking-description">
              View upcoming consultations, reschedule sessions, or manage your
              bookings easily.
            </p>
            <motion.div
              whileHover={{ y: -2 }}
              className="site-footer__booking-action"
            >
              <Link
                href="/my-bookings"
                className="btn btn-primary site-footer__booking-button"
              >
                My Bookings
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Copyright Bar */}
      <div className="site-footer__bottom">
        <p className="site-footer__copyright">
          © Mind And Soul Klinic. Because everyone deserves to be understood.
        </p>
      </div>
    </footer>
  );
}
