export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

// Appends -2, -3... until no other document uses the slug.
export async function uniqueSlug(Model, base, excludeId) {
  const root = slugify(base) || "post";
  let slug = root;
  let n = 1;
  while (await Model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${root}-${++n}`;
  }
  return slug;
}
