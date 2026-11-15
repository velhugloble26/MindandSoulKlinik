import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Meet Kiran Khullar, counselling psychologist and psychotherapist at Mind And Soul Klinic. Learn her philosophy, values, and approach to therapy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
