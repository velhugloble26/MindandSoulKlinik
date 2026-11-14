import Link from "next/link";
import BlogCard from "./BlogCard";

export default function LatestBlogs({ items }: { items: any[] }) {
  if (!items.length) return null;
  return (
    <section className="section section-alt">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="heading-lg">Latest from the blog</h2>
          <Link href="/blog" className="btn btn-outline">View all articles</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((b) => <BlogCard key={String(b._id)} blog={b} />)}
        </div>
      </div>
    </section>
  );
}
