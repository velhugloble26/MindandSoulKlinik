import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Adore Life",
  description:
    "Contact therapist Kiran Khullar at Adore Life in Thane, Maharashtra, or send an enquiry about therapy and consultation sessions.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
