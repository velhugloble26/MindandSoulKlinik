import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Begin a Conversation",
  description:
    "Reach out to Mind And Soul Klinic to begin your therapy journey. Fill in the form or contact Kiran Khullar directly by phone, WhatsApp, or email.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
