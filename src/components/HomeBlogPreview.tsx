"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GET_ALL_BLOGS } from "@/utils/api";
import {
  HoverZoomContainer,
  MotionItem,
  MotionStagger,
} from "@/components/ui/Motion";

type BlogPreview = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  created_at: string;
};

export default function HomeBlogPreview() {
  const [blogs, setBlogs] = useState<BlogPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      try {
        const response = await fetch(`${GET_ALL_BLOGS}?page=1&limit=2`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success)
          throw new Error(payload?.message || "Unable to load blogs.");
        setBlogs((payload.data?.data || []).slice(0, 2));
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("HOME_BLOGS_ERROR:", error);
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
      <p className="text-body-md text-center ui-muted">Loading reflections…</p>
    );
  }

  return (
    <>
      {blogs.length > 0 ? (
        <MotionStagger
          amount={0.2}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {blogs.map((blog) => (
            <MotionItem key={blog._id}>
              <article className="group h-full overflow-hidden rounded-xl border border-surface bg-surface-lowest shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <Link href={`/blog/${blog.slug}`} className="block h-full">
                  <HoverZoomContainer className="aspect-[16/9] surface-container">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={1200}
                      height={675}
                      className="h-full w-full object-cover"
                    />
                  </HoverZoomContainer>
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
                    <h3 className="text-headline-md mb-3 ui-heading">
                      {blog.title}
                    </h3>
                    <p className="text-body-md mb-6 line-clamp-3 ui-copy">
                      {blog.excerpt}
                    </p>
                    <span className="text-label-md border-b ui-link-accent">
                      Read article
                    </span>
                  </div>
                </Link>
              </article>
            </MotionItem>
          ))}
        </MotionStagger>
      ) : (
        <p className="text-body-md text-center ui-muted">
          New reflections are on their way.
        </p>
      )}

      <div className="mt-12 text-center">
        <Link href="/blog" className="btn btn-primary">
          See more blogs
          <span
            className="material-symbols-outlined text-lg"
            aria-hidden="true"
          >
            arrow_forward
          </span>
        </Link>
      </div>
    </>
  );
}
