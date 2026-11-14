import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import connectDB from "@/config/dbconnection";
import BlogService from "@/services/blogServices";
import sanitizeBlogContent from "@/utils/sanitizeBlogContent";
import { Phone } from "lucide-react";
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
  { label: "Call Adore Life", href: "tel:+917304490951", icon: Phone },
  {
    label: "Chat on WhatsApp",
    href: "https://wa.me/917304490951",
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
      <main className="pb-section mt-section">
        <article>
          <header className="section-pad mx-auto w-full max-w-[1440px] pt-8 md:pt-12">
            <div className="relative isolate flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-2xl">
              <Image
                src={blog.image}
                alt=""
                fill
                priority
                className="-z-20 object-cover"
                sizes="(max-width: 1440px) calc(100vw - 2rem), 1440px"
              />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,25,40,0.43),rgba(0,25,40,0.77))]" />
              <div className="section-pad mx-auto w-full max-w-[1000px] py-section text-center">
                <Link
                  href="/blog"
                  className="text-label-md mb-8 inline-flex items-center gap-2 border-b border-white/70 text-white transition hover:border-white"
                >
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                  >
                    arrow_back
                  </span>
                  All articles
                </Link>
                <p className="text-label-md mb-5 uppercase tracking-widest text-white/80">
                  {blog.category}
                </p>
                <h1 className="text-headline-lg mb-6 text-white ui-heading">
                  {blog.title}
                </h1>
                <p className="text-body-lg mx-auto mb-6 max-w-3xl text-white/90">
                  {blog.excerpt}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-label-md text-white/75">
                  <span>By Kiran Khullar</span>
                  <span aria-hidden="true">•</span>
                  <time dateTime={blog.created_at}>
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "long",
                    }).format(new Date(blog.created_at))}
                  </time>
                </div>
              </div>
              <nav
                className="mt-8 flex flex-wrap items-center justify-center gap-3"
                aria-label="Social media and contact links"
              >
                {footerSocialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    aria-label={label}
                    title={label}
                    className="inline-flex h-12 w-12 mb-2 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-soft-teal)] text-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-outline-variant)] hover:bg-transparent hover:text-[var(--color-soft-teal)] hover:shadow-md"
                  >
                    <Icon size={22} aria-hidden="true" />
                  </a>
                ))}
              </nav>
            </div>
          </header>
          <div className="section-pad mx-auto mt-14 w-full max-w-[1350px]">
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
