import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { SITE } from "@/utils/site";

const SOCIAL_ICONS = {
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
} as const;

export default function Footer() {
  const socials = Object.entries(SITE.socials).filter(([, url]) => url);
  return (
    <footer className="footer">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="footer-title">{SITE.name}</p>
          <p className="max-w-xs text-sm">
            A safe, confidential space to understand your thoughts and reclaim your inner harmony.
          </p>
        </div>
        <div>
          <p className="footer-title">Explore</p>
          <ul className="grid gap-2 text-sm">
            {[
              ["About", "/about"],
              ["Services", "/services"],
              ["Blog", "/blog"],
              ["Book an Appointment", "/book-session"],
              ["Contact", "/contact"],
            ].map(([l, h]) => (
              <li key={h}><Link href={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-title">Get in touch</p>
          <ul className="grid gap-3 text-sm">
            <li><a href={SITE.phoneHref} className="inline-flex items-center gap-2"><Phone size={16} />{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2"><Mail size={16} />{SITE.email}</a></li>
          </ul>
          <div className="mt-4 flex gap-3">
            {socials.map(([name, url]) => {
              const Icon = SOCIAL_ICONS[name as keyof typeof SOCIAL_ICONS];
              return (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name}><Icon size={18} /></a>
              );
            })}
            <a href={`mailto:${SITE.email}`} aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
