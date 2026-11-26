"use client";

import {
  ADMIN_BOOKINGS,
  GET_ALL_BLOGS,
  GET_ALL_CONTACTS,
  GET_ALL_GALLERY,
  GET_ALL_QUOTES,
} from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Notice, PageHeader, requestApi } from "./AdminUI";
import {
  CalendarCheck,
  CalendarDays,
  FilePlus2,
  FileText,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Mail,
  MailCheck,
  MessageSquareQuote,
} from "lucide-react";

const sources = [
  {
    label: "Bookings",
    url: ADMIN_BOOKINGS + "?limit=1",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    label: "Blogs",
    url: GET_ALL_BLOGS + "?limit=1",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    label: "Gallery items",
    url: GET_ALL_GALLERY + "?limit=1",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    label: "Contact enquiries",
    url: GET_ALL_CONTACTS + "?limit=1",
    href: "/admin/enquiries",
    icon: Mail,
  },
  {
    label: "Quick quotes",
    url: GET_ALL_QUOTES + "?limit=1",
    href: "/admin/enquiries",
    icon: MessageSquareQuote,
  },
] as const;

export default function AdminOverview() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all(
      sources.map(async ({ label, url }) => {
        const payload = await requestApi(url);
        return [label, payload.data?.pagination?.total || 0] as const;
      }),
    )
      .then((values) => setStats(Object.fromEntries(values)))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Unable to load the overview.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <PageHeader
        eyebrow="Admin workspace"
        title="Overview"
        description="A concise view of the records managed by the application’s existing API routes."
      />
      {error && <Notice>{error}</Notice>}
      {loading ? (
        <Loader2 className="mx-auto animate-spin" />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {sources.map(({ label, href, icon: Icon }) => (
              <Link
                href={href}
                className="admin-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                key={label}
              >
                <Icon className="ui-accent" size={22} aria-hidden="true" />
                <p className="mt-4 text-3xl font-semibold ui-heading">
                  {stats[label] || 0}
                </p>
                <p className="mt-1 text-sm ui-copy">{label}</p>
              </Link>
            ))}
          </section>
          <section className="admin-card mt-7 p-6">
            <h2 className="text-headline-lg ui-heading">Quick actions</h2>
            <p className="mt-1 ui-copy">Common administration tasks.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link className="admin-action-card" href="/admin/bookings">
                <CalendarCheck size={20} aria-hidden="true" />
                Manage bookings
              </Link>
              <Link className="admin-action-card" href="/admin/blogs">
                <FilePlus2 size={20} aria-hidden="true" />
                Publish a blog
              </Link>
              <Link className="admin-action-card" href="/admin/gallery">
                <ImagePlus size={20} aria-hidden="true" />
                Add gallery item
              </Link>
              <Link className="admin-action-card" href="/admin/enquiries">
                <MailCheck size={20} aria-hidden="true" />
                Review enquiries
              </Link>
            </div>
          </section>
        </>
      )}
    </>
  );
}
