import type { MetadataRoute } from "next";
import connectDB from "@/config/dbconnection";
import BlogService from "@/services/blogServices";

const SITE_URL = "https://www.mindandsoulklinic.com";
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: `${SITE_URL}/`,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/home`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/story`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/therapy`,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/therapy/individual`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/therapy/couples`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/therapy/corporate`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/therapy/schools`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/therapy/womens-wellness`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/therapy/workshops`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/contact`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/blog`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/book-session`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/conversation`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/community`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/faq`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/gallery`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/insights`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/privacy-policy`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/terms-and-conditions`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const firstPage = await BlogService.getAllBlogs({ page: 1, limit: 100 });
  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.max(firstPage.pagination.totalPages - 1, 0) },
      (_, index) =>
        BlogService.getAllBlogs({ page: index + 2, limit: 100 }),
    ),
  );
  const blogs = [
    ...firstPage.data,
    ...remainingPages.flatMap(({ data }) => data),
  ];

  const blogPages = blogs.flatMap((blog) => {
    if (typeof blog.slug !== "string" || !blog.slug.trim()) return [];

    const page: MetadataRoute.Sitemap[number] = {
      url: `${SITE_URL}/blog/${encodeURIComponent(blog.slug)}`,
      changeFrequency: "monthly",
      priority: 0.6,
    };
    const lastModified = blog.updated_at || blog.created_at;

    if (lastModified) {
      const date = new Date(lastModified);
      if (!Number.isNaN(date.getTime())) page.lastModified = date;
    }

    return [page];
  });

  return [...STATIC_PAGES, ...blogPages];
}
