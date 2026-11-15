import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Mind And Soul Klinic",
  description:
    "Contact therapist Kiran Khullar at Mind And Soul Klinic in New Delhi, or send an enquiry about therapy and consultation sessions.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
