"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { GET_ALL_BLOGS } from "@/utils/api";

type BlogSummary = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  created_at: string;
};

function BlogCardCover({ src, alt }: { src?: string; alt: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!src || imgFailed) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#e2f2f1] via-[#f2f7f6] to-[#efe9d8]">
        {/* Decorative Botanical Rings */}
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-36 w-36 rounded-full border border-[#C5A253]/30"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full border border-[#00646a]/15"
        />
        <div className="relative flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6e6e4] bg-white/80 text-[#00646a] shadow-2xs">
            <Sparkles size={20} strokeWidth={1.6} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5c8487]">
            Mind &amp; Soul Reflection
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={750}
      onError={() => setImgFailed(true)}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  );
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Topics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      try {
        const response = await fetch(`${GET_ALL_BLOGS}?page=1&limit=100`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success)
          throw new Error(payload?.message || "Unable to load articles.");
        setBlogs(payload.data?.data || []);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name !== "AbortError") {
          console.error("PUBLIC_BLOGS_ERROR:", loadError);
          setError(
            "Articles could not be loaded right now. Please try again later.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBlogs();
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        blogs
          .map((item) => item.category?.trim())
          .filter((cat): cat is string => Boolean(cat)),
      ),
    );
    return ["All Topics", ...unique];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "All Topics") return blogs;
    return blogs.filter(
      (blog) =>
        blog.category?.trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase(),
    );
  }, [blogs, selectedCategory]);

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-[#e3eae9] bg-white p-0 shadow-2xs"
          >
            <div className="aspect-16/10 animate-pulse bg-[#eaf3f2]" />
            <div className="space-y-3 p-7">
              <div className="h-3 w-28 animate-pulse rounded bg-[#eaf3f2]" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-[#eaf3f2]" />
              <div className="h-4 w-24 animate-pulse rounded bg-[#eaf3f2]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p
        className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50/70 p-6 text-center text-sm text-red-700"
        role="alert"
      >
        {error}
      </p>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="relative mx-auto max-w-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 rounded-[26px] border border-[#C5A253]/45"
        />
        <div className="relative rounded-3xl border border-[#dce7e6] bg-white p-10 text-center shadow-[0_18px_45px_rgba(0,48,68,0.06)] sm:p-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d6e6e4] bg-[#f2f9f8] text-[#00646a]">
            <BookOpen size={26} strokeWidth={1.6} />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#003044] sm:text-3xl">
            New reflections are on their way.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#4f7276] sm:text-base">
            Thoughtful articles and guided exercises by Therapy by Nidhi are
            being prepared. Please return soon or book a personal consultation
            in the meantime.
          </p>
          <div className="mt-7">
            <Link
              href="/book-session"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00646a] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#004b50]"
            >
              <span>Book a Session</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Centered Topic Filter Pills */}
      {categories.length > 1 && (
        <div
          role="tablist"
          aria-label="Filter articles by topic"
          className="mb-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  active
                    ? "border-[#004f55] bg-[#004f55] text-white shadow-xs"
                    : "border-[#d8e4e3] bg-white text-[#355d61] hover:border-[#00646a] hover:bg-[#f2f9f8] hover:text-[#003044]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <article
            key={blog._id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#e2eae9] bg-white shadow-[0_8px_28px_rgba(0,48,68,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c3d9d7] hover:shadow-[0_18px_40px_rgba(0,48,68,0.09)]"
          >
            <Link href={`/blog/${blog.slug}`} className="flex flex-1 flex-col">
              <div className="aspect-16/10 w-full overflow-hidden border-b border-[#edf3f2]">
                <BlogCardCover src={blog.image} alt={blog.title} />
              </div>

              <div className="flex flex-1 flex-col justify-between p-7">
                <div>
                  <div className="mb-3.5 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#00646a]">
                      {blog.category}
                    </span>
                    <time
                      className="text-xs font-medium text-[#6c8b8e]"
                      dateTime={blog.created_at}
                    >
                      {new Intl.DateTimeFormat("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(blog.created_at))}
                    </time>
                  </div>

                  <h3 className="font-serif text-lg font-semibold leading-snug text-[#003044] transition-colors group-hover:text-[#00646a] sm:text-[19px]">
                    {blog.title}
                  </h3>
                </div>

                <div className="mt-6 pt-1">
                  <span className="inline-flex items-center gap-1.5 border-b border-[#00646a]/60 pb-0.5 text-xs font-semibold text-[#003044] transition-colors group-hover:border-[#00646a] group-hover:text-[#00646a]">
                    <span>Read article</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}