import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
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
      <main className="min-h-screen bg-[#faf8f3]">
        {/* Centered Editorial Hero Section matching Image Background */}
        <section
          className="relative overflow-hidden border-b border-[#e4eceb] py-16 md:py-24"
          style={{
            backgroundColor: "#f3f6f1",
            backgroundImage: `
              radial-gradient(ellipse 75% 95% at 12% 35%, rgba(193, 232, 228, 0.85) 0%, rgba(193, 232, 228, 0) 68%),
              radial-gradient(ellipse 70% 90% at 88% 40%, rgba(242, 229, 206, 0.85) 0%, rgba(242, 229, 206, 0) 68%),
              radial-gradient(ellipse 65% 80% at 50% 60%, rgba(247, 245, 236, 0.92) 0%, rgba(247, 245, 236, 0) 75%)
            `,
          }}
        >
          {/* Flowing Organic Silk Wave Overlay */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 420"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-65"
          >
            <defs>
              <linearGradient id="heroWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#fdf8ee" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="heroWave2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c9e8e5" stopOpacity="0.35" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#efe2ca" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M-80,310 C220,160 460,360 760,220 C1040,90 1240,250 1520,130 L1520,440 L-80,440 Z"
              fill="url(#heroWave1)"
            />
            <path
              d="M-60,120 C260,260 520,40 840,180 C1120,300 1290,110 1500,210 L1500,440 L-60,440 Z"
              fill="url(#heroWave2)"
            />
          </svg>

          <div className="relative z-10 mx-auto max-w-[920px] px-5 text-center sm:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#8fb6b5]/70 bg-white/65 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#004f55] backdrop-blur-xs">
              Reflections &amp; Resources
            </span>

            <h1 className="mx-auto mt-6 max-w-3xl font-serif text-3xl font-semibold leading-[1.2] tracking-tight text-[#0d2b36] sm:text-5xl">
              A little understanding can change how you{" "}
              <span className="relative inline-block text-[#0d2b36]">
                see yourself.
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-[3px] w-full rounded-full bg-[#C5A253]/90"
                />
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#456368] sm:text-lg">
              Explore thoughtful perspectives on emotional wellbeing,
              relationships, and the patterns that shape everyday life.
            </p>
          </div>
        </section>

        {/* Blog Grid & Category Tabs */}
        <section className="mx-auto w-full max-w-[1240px] px-5 py-12 sm:px-8 md:py-16">
          <BlogList />
        </section>
      </main>
    </>
  );
}