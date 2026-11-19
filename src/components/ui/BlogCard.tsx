import Link from "next/link";
import { formatDate, stripHtml } from "@/utils/safe";
import { HoverZoomContainer, HoverZoomImage } from "@/components/ui/Motion";

type BlogCardProps = {
  blog: {
    _id?: string;
    slug: string;
    image?: { url: string };
    category?: string;
    publishedAt?: string | Date;
    title: string;
    excerpt?: string;
    content?: string;
  };
};

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="card card-hover flex h-full flex-col !p-0 overflow-hidden">
      {blog.image?.url && (
        <Link href={`/blog/${blog.slug}`} className="relative block aspect-[16/10]" tabIndex={-1} aria-hidden>
          <HoverZoomContainer className="h-full w-full">
            <HoverZoomImage
              src={blog.image.url}
              alt=""
              className="h-full w-full object-cover"
            />
          </HoverZoomContainer>
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
