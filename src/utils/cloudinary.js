import { v2 as cloudinary } from "cloudinary";
import { Blog, Gallery } from "../schema/schema";

export const CLOUDINARY_ROOT_FOLDER = "adorlifewithnidhi";
export const DEFAULT_CLOUDINARY_FOLDERS = ["blog", "gallery"];

export function cloudinaryErrorDetails(error) {
  const detail = error?.error || error;
  return {
    message:
      typeof detail?.message === "string"
        ? detail.message
        : "Unknown Cloudinary error.",
    http_code: error?.http_code,
    name: error?.name,
  };
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function normalizeCloudinaryFolderName(value) {
  if (typeof value !== "string") return null;
  const name = value.trim().toLowerCase();
  return /^[a-z0-9](?:[a-z0-9_-]{0,48}[a-z0-9])?$/.test(name) ? name : null;
}

export function getCloudinaryFolderPath(name) {
  const normalized = normalizeCloudinaryFolderName(name);
  if (!normalized) throw new Error("Invalid Cloudinary folder name.");
  return `${CLOUDINARY_ROOT_FOLDER}/${normalized}`;
}

async function createFolderIfMissing(path) {
  try {
    await cloudinary.api.create_folder(path);
  } catch (error) {
    if (error?.http_code !== 409) throw error;
  }
}

export async function createCloudinarySubfolderIfMissing(name) {
  await ensureCloudinaryRootFolder();
  await createFolderIfMissing(getCloudinaryFolderPath(name));
}

export async function ensureCloudinaryRootFolder() {
  const response = await cloudinary.api.root_folders({ max_results: 500 });
  const exists = (response.folders || []).some(
    (folder) => folder.name === CLOUDINARY_ROOT_FOLDER,
  );
  if (!exists) await createFolderIfMissing(CLOUDINARY_ROOT_FOLDER);
}

export async function listCloudinaryFolders() {
  await ensureCloudinaryRootFolder();
  const response = await cloudinary.api.sub_folders(CLOUDINARY_ROOT_FOLDER, {
    max_results: 500,
  });
  const names = new Set(
    (response.folders || []).map((folder) =>
      folder.path.split("/").filter(Boolean).at(-1),
    ),
  );

  for (const name of DEFAULT_CLOUDINARY_FOLDERS) {
    if (!names.has(name)) {
      await createFolderIfMissing(getCloudinaryFolderPath(name));
      names.add(name);
    }
  }

  return [...names].filter(Boolean).sort();
}

export function getCloudinaryPublicIdFromUrl(imageUrl) {
  if (typeof imageUrl !== "string") return null;
  try {
    const url = new URL(imageUrl);
    if (
      url.hostname !== "res.cloudinary.com" ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        url.pathname.split("/")[1] !== process.env.CLOUDINARY_CLOUD_NAME)
    ) {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex < 0) return null;
    const versionIndex = parts.findIndex(
      (part, index) => index > uploadIndex && /^v\d+$/.test(part),
    );
    if (versionIndex < 0) return null;

    const publicId = parts
      .slice(versionIndex + 1)
      .join("/")
      .replace(/\.[^/.]+$/, "");
    return publicId || null;
  } catch {
    return null;
  }
}

async function hasLegacyImageReference(model, publicId) {
  const escapedPublicId = publicId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const possibleReferences = await model
    .find({
      $or: [
        { imagePublicId: { $exists: false } },
        { imagePublicId: null },
        { imagePublicId: "" },
      ],
      image: { $regex: escapedPublicId },
    })
    .select("image")
    .lean();
  return possibleReferences.some(
    (item) => getCloudinaryPublicIdFromUrl(item.image) === publicId,
  );
}

export async function deleteCloudinaryImageIfUnused(publicId) {
  if (typeof publicId !== "string" || !publicId.trim()) return false;
  const normalizedId = publicId.trim();
  const [
    blogReference,
    galleryReference,
    legacyBlogReference,
    legacyGalleryReference,
  ] = await Promise.all([
    Blog.exists({ imagePublicId: normalizedId }),
    Gallery.exists({ imagePublicId: normalizedId }),
    hasLegacyImageReference(Blog, normalizedId),
    hasLegacyImageReference(Gallery, normalizedId),
  ]);

  if (
    blogReference ||
    galleryReference ||
    legacyBlogReference ||
    legacyGalleryReference
  ) {
    return false;
  }

  const result = await cloudinary.uploader.destroy(normalizedId, {
    resource_type: "image",
    invalidate: true,
  });
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary image cleanup failed (${result.result}).`);
  }
  return result.result === "ok";
}

export default cloudinary;
