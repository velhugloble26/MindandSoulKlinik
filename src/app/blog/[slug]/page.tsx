import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import connectDB from "@/config/dbconnection";
import BlogService from "@/services/blogServices";
import sanitizeBlogContent from "@/utils/sanitizeBlogContent";
import { ArrowLeft, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { PiWhatsappLogo } from "react-icons/pi";
import { LiaYoutube } from "react-icons/lia";
import { BsFacebook } from "react-icons/bs";

type BlogArticle = {
  title: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
  created_at: string;
};
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
  { label: "Call Mind And Soul Klinic", href: "tel:+919811378979 ", icon: Phone },
  {
    label: "Chat on WhatsApp",
    href: "https://wa.me/919811378979 ",
    icon: PiWhatsappLogo,
  },
];
async function getBlog(slug: string): Promise<BlogArticle | null> {
  try {
    await connectDB();
    const blog = await BlogService.getBlogBySlug(slug);
    return {
      title: blog.title,
      category: blog.category,
      excerpt: blog.excerpt,
      image: blog.image,
      content: blog.content,
      created_at: new Date(blog.created_at).toISOString(),
    };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "statusCode" in error &&
      error.statusCode === 404
    )
      return null;
    console.error("PUBLIC_BLOG_ERROR:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  return blog
    ? {
        title: blog.title,
        description: blog.excerpt,
        openGraph: { images: [blog.image] },
      }
    : { title: "Article not found" };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fffdf8] pb-16 md:pb-24">
        <article>
          <header className="mx-auto w-full max-w-[1440px] px-4 pt-4 md:px-6 md:pt-5">
            <div
              className="relative isolate flex min-h-[390px] flex-col items-center justify-center overflow-hidden rounded-[24px] border border-[#9b6c45] bg-[linear-gradient(180deg,#eef6e9_0%,#ecf4ed_44%,#dbeaf0_100%)] px-5 py-14 text-center sm:min-h-[410px] md:min-h-[350px]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 14% 52%, rgba(183,216,223,.72) 0 12%, transparent 36%), radial-gradient(circle at 86% 46%, rgba(240,219,181,.62) 0 13%, transparent 36%), linear-gradient(150deg, rgba(255,255,255,.65), transparent 52%)",
                }}
              />

              <Link
                href="/blog"
                className="absolute left-5 top-5 inline-flex items-center gap-2 text-sm text-[#5e7d80] transition hover:text-[#004f55] md:left-12 md:top-10"
              >
                <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
                All articles
              </Link>

              <div className="relative z-10 mx-auto mt-5 w-full max-w-[850px]">
                <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-[11px] md:text-xs">
                  <span className="rounded-full border border-[#9cb9a8] bg-[#fffdf6] px-3 py-1 font-semibold uppercase tracking-[0.08em] text-[#233c41]">
                    {blog.category}
                  </span>
                  <time
                    dateTime={blog.created_at}
                    className="font-medium text-[#4e6265]"
                  >
                    {new Intl.DateTimeFormat("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(blog.created_at))}
                  </time>
                  <span className="text-[#789093]">·</span>
                  <span className="text-[#789093]">4 min read</span>
                </div>

                <h1 className="mx-auto max-w-[760px] font-serif text-[32px] leading-[1.08] font-bold tracking-[-0.02em] text-[#092d3d] sm:text-[42px] md:text-[42px]">
                  {blog.title}
                </h1>

                <p className="mx-auto mt-4 max-w-[650px] text-sm leading-relaxed text-[#4f6466] md:text-[15px]">
                  {blog.excerpt}
                </p>

                <p className="mt-5 text-xs text-[#627b7d]">
                  By{" "}
                  <span className="rounded-full border border-[#c5a253]/60 bg-[#fff7df] px-2.5 py-1 font-bold text-[#31575a] shadow-[0_2px_8px_rgba(197,162,83,.12)]">
                    Kiran Khullar
                  </span>
                </p>

                <nav
                  className="mt-5 flex flex-wrap items-center justify-center gap-2.5"
                  aria-label="Social media and contact links"
                >
                  {footerSocialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={label}
                      title={label}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#789799] bg-white/75 text-[#4d7477] transition hover:-translate-y-0.5 hover:bg-[#004f55] hover:text-white"
                    >
                      <Icon size={13} aria-hidden="true" />
                    </a>
                  ))}
                </nav>
              </div>

              <svg
                aria-hidden="true"
                viewBox="0 0 340 170"
                className="pointer-events-none absolute bottom-[-8px] left-1/2 h-[155px] w-[300px] -translate-x-1/2 md:h-[170px]"
              >
                <g fill="none" stroke="#78909a" strokeWidth="1.2" strokeLinecap="round">
                  <path d="M92 164c23-31 48-52 78-68M132 132l-28-12M145 123l-31-26M159 113l-18-35M111 151l-36-9M213 164c-20-31-34-53-42-73M199 139l29-10M186 126l29-28M171 112l15-38M219 151l35-12" />
                  <path d="M96 164c22-12 43-18 64-18 29 0 52 7 78 18" stroke="#927b56" />
                </g>
                <g>
                  <ellipse cx="170" cy="150" rx="58" ry="15" fill="#91aaa1" opacity=".45" />
                  <ellipse cx="170" cy="137" rx="45" ry="17" fill="#c7c3a9" opacity=".95" />
                  <ellipse cx="170" cy="119" rx="39" ry="14" fill="#ded4ba" opacity=".95" />
                  <ellipse cx="169" cy="102" rx="30" ry="12" fill="#b0aaa0" opacity=".95" />
                  <ellipse cx="169" cy="88" rx="18" ry="10" fill="#9da99d" />
                </g>
                <g fill="#c6ad78" opacity=".95">
                  <ellipse cx="77" cy="118" rx="7" ry="20" transform="rotate(-42 77 118)" />
                  <ellipse cx="98" cy="104" rx="6" ry="17" transform="rotate(-48 98 104)" />
                  <ellipse cx="58" cy="144" rx="6" ry="16" transform="rotate(-60 58 144)" />
                  <ellipse cx="228" cy="113" rx="6" ry="18" transform="rotate(47 228 113)" />
                  <ellipse cx="248" cy="132" rx="6" ry="17" transform="rotate(58 248 132)" />
                </g>
                <g fill="none" stroke="#d8c89e" strokeWidth="1">
                  <path d="M215 95c15-25 28-48 30-74M245 20c-11 11-13 20-10 29M245 21c12 7 17 15 17 25M229 54c-11 5-17 12-20 23M229 54c10 1 17 6 23 15M220 75c-10 4-16 10-19 20M220 75c10 1 17 6 22 14" />
                </g>
              </svg>
            </div>
          </header>

          <div className="mx-auto mt-8 w-full max-w-[980px] px-5 sm:px-8 md:mt-10">
            <div
              className="blog-article-content text-body-lg ui-copy"
              dangerouslySetInnerHTML={{
                __html: sanitizeBlogContent(blog.content),
              }}
            />
          </div>
        </article>
      </main>
    </>
  );
}
