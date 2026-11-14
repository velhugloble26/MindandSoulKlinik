import { Gallery } from "../schema/schema";
import {
  deleteCloudinaryImageIfUnused,
  getCloudinaryPublicIdFromUrl,
} from "../utils/cloudinary";
import { deleteLocalUploadIfUnused } from "../utils/uploads";

async function cleanupPreviousImage(imageUrl, publicId) {
  try {
    if (imageUrl?.startsWith("/uploads/"))
      await deleteLocalUploadIfUnused(imageUrl);
    if (publicId) await deleteCloudinaryImageIfUnused(publicId);
    return false;
  } catch (error) {
    console.error("GALLERY_IMAGE_CLEANUP_ERROR:", {
      publicId,
      message: error instanceof Error ? error.message : "Unknown cleanup error",
    });
    return true;
  }
}

class GalleryService {
  async createGallery(data) {
    const publicId =
      data.imagePublicId || getCloudinaryPublicIdFromUrl(data.image);
    return Gallery.create({
      ...data,
      ...(publicId ? { imagePublicId: publicId } : {}),
    });
  }

  async getAllGallery({ page = 1, limit = 20, search } = {}) {
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Gallery.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      Gallery.countDocuments(filter),
    ]);
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getGalleryById(id) {
    const item = await Gallery.findById(id);
    if (!item)
      throw Object.assign(new Error("Gallery item not found."), {
        statusCode: 404,
      });
    return item;
  }

  async updateGallery(id, data) {
    const previous = await Gallery.findById(id).select("image imagePublicId");
    if (!previous)
      throw Object.assign(new Error("Gallery item not found."), {
        statusCode: 404,
      });
    const previousPublicId =
      previous.imagePublicId || getCloudinaryPublicIdFromUrl(previous.image);
    const update = { $set: { ...data, updated_at: new Date() } };
    if (data.image && !data.imagePublicId) {
      const publicId = getCloudinaryPublicIdFromUrl(data.image);
      if (publicId) update.$set.imagePublicId = publicId;
      else if (data.image !== previous.image)
        update.$unset = { imagePublicId: 1 };
    }
    const item = await Gallery.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!item)
      throw Object.assign(new Error("Gallery item not found."), {
        statusCode: 404,
      });
    const nextPublicId =
      item.imagePublicId || getCloudinaryPublicIdFromUrl(item.image);
    let cleanupPending = false;
    if (previousPublicId && previousPublicId !== nextPublicId)
      cleanupPending = await cleanupPreviousImage(
        previous.image,
        previousPublicId,
      );
    else if (
      previous.image?.startsWith("/uploads/") &&
      previous.image !== item.image
    )
      cleanupPending = await cleanupPreviousImage(previous.image, null);
    return { item, cleanupPending };
  }

  async deleteGallery(id) {
    const item = await Gallery.findByIdAndDelete(id).select(
      "image imagePublicId",
    );
    if (!item)
      throw Object.assign(new Error("Gallery item not found."), {
        statusCode: 404,
      });
    const publicId =
      item.imagePublicId || getCloudinaryPublicIdFromUrl(item.image);
    let cleanupPending = false;
    try {
      if (item.image?.startsWith("/uploads/"))
        await deleteLocalUploadIfUnused(item.image);
      else await deleteCloudinaryImageIfUnused(publicId);
    } catch (error) {
      cleanupPending = true;
      console.error("GALLERY_IMAGE_CLEANUP_ERROR:", {
        publicId,
        message:
          error instanceof Error ? error.message : "Unknown cleanup error",
      });
    }
    return {
      message: "Gallery item deleted successfully.",
      cleanupPending,
    };
  }
}

export default new GalleryService();
