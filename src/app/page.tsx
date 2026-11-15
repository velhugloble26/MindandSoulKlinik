import type { Metadata } from "next";
import HomePage from "./home/page";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Mind And Soul Klinic offers compassionate therapy and support for individuals, couples, and teams.",
};

export default function Page() {
  return <HomePage />;
}
