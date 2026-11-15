"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
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
          setError("Articles could not be loaded right now. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBlogs();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <p className="text-body-md text-center ui-muted">Loading articles…</p>
    );
  }

  if (error) {
    return (
      <p className="text-body-md text-center ui-muted" role="alert">
        {error}
      </p>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-surface bg-surface-low p-10 text-center">
        <span
          className="material-symbols-outlined mb-4 text-4xl ui-accent"
          aria-hidden="true"
        >
          article
        </span>
        <h2 className="text-headline-lg mb-3 ui-heading">
          New reflections are on their way.
        </h2>
        <p className="text-body-md ui-copy">
          Please return soon for articles from Mind And Soul Klinic.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {blogs.map((blog) => (
        <article
          key={blog._id}
          className="group overflow-hidden rounded-xl border border-surface bg-surface-lowest shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <Link href={`/blog/${blog.slug}`} className="block">
            <div className="aspect-16/10 overflow-hidden surface-container">
              <Image
                src={blog.image}
                alt={blog.title}
                width={1200}
                height={750}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-label-md uppercase tracking-widest ui-accent">
                  {blog.category}
                </span>
                <time
                  className="text-label-md ui-muted"
                  dateTime={blog.created_at}
                >
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                  }).format(new Date(blog.created_at))}
                </time>
              </div>
              <h3 className="text-headline-sm mb-3 ui-heading">{blog.title}</h3>
              {/* <p className="text-body-md mb-6 line-clamp-3 ui-copy">
                {blog.excerpt}
              </p> */}
              <span className="text-label-md border-b ui-link-accent">
                Read article
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
