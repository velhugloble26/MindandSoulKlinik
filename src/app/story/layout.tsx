import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Meet Kiran Khullar, counselling psychologist and psychotherapist at Adore Life. Learn her philosophy, values, and approach to therapy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
