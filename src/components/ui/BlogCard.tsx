import Link from "next/link";
import Image from "next/image";
import { formatDate, stripHtml } from "@/utils/safe";

export default function BlogCard({ blog }: { blog: any }) {
  return (
    <article className="card card-hover flex h-full flex-col !p-0 overflow-hidden">
      {blog.image?.url && (
        <Link href={`/blog/${blog.slug}`} className="relative block aspect-[16/10]" tabIndex={-1} aria-hidden>
          <Image src={blog.image.url} alt="" fill sizes="(min-width:1024px) 380px, 100vw" className="object-cover" />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="badge badge-soft">{blog.category}</span>
          <span className="text-muted">{formatDate(blog.publishedAt)}</span>
        </div>
        <h3 className="heading-md mt-3">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3">{blog.excerpt || stripHtml(blog.content)}</p>
        <Link href={`/blog/${blog.slug}`} className="btn btn-outline mt-auto self-start" aria-label={`Read more: ${blog.title}`}>
          Read More
        </Link>
      </div>
    </article>
  );
}
