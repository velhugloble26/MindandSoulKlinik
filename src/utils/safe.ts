// Runs a server-side data load and reports failure instead of crashing the page.
export async function safe<T>(fn: () => Promise<T>, fallback: T) {
  try {
    return { data: await fn(), failed: false };
  } catch (err) {
    console.error("[page data]", (err as Error)?.message);
    return { data: fallback, failed: true };
  }
}

export const formatDate = (d?: string | Date) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : "";

export const stripHtml = (html = "", max = 160) => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
};
