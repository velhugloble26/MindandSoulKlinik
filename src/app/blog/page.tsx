import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/ui/PageHero";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Gentle reflections and practical insights for emotional wellbeing, relationships, and self-understanding.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="design-system-page">
        <PageHero
          eyebrow="Reflections & Resources"
          headline="A little understanding can change how you see yourself."
          body="Explore thoughtful perspectives on emotional wellbeing, relationships, and the patterns that shape everyday life."
          centered
        />
        <section className="section-pad mx-auto w-full max-w-360 pb-section">
          <BlogList />
        </section>
      </main>
    </>
  );
}
