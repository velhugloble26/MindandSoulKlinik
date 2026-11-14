import { Blog } from "../schema/schema";
import {
  deleteCloudinaryImageIfUnused,
  getCloudinaryPublicIdFromUrl,
} from "../utils/cloudinary";
import { deleteLocalUploadIfUnused } from "../utils/uploads";
import mongoose from "mongoose";

async function cleanupPreviousImage(imageUrl, publicId) {
  try {
    if (imageUrl?.startsWith("/uploads/"))
      await deleteLocalUploadIfUnused(imageUrl);
    if (publicId) await deleteCloudinaryImageIfUnused(publicId);
    return false;
  } catch (error) {
    console.error("BLOG_IMAGE_CLEANUP_ERROR:", {
      publicId,
      message: error instanceof Error ? error.message : "Unknown cleanup error",
    });
    return true;
  }
}

class BlogService {
  async createBlog(data) {
    if (await Blog.exists({ slug: data.slug })) {
      throw Object.assign(new Error("Blog slug already exists."), {
        statusCode: 409,
      });
    }
    const publicId =
      data.imagePublicId || getCloudinaryPublicIdFromUrl(data.image);
    return Blog.create({
      ...data,
      ...(publicId ? { imagePublicId: publicId } : {}),
    });
  }

  async getAllBlogs({ page = 1, limit = 20, search, category } = {}) {
    const filter = {};
    if (category) filter.category = category.trim();
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Blog.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(filter),
    ]);
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getBlogByIdOrSlug(identifier) {
    const normalizedIdentifier = identifier.trim();
    const filter = mongoose.isObjectIdOrHexString(normalizedIdentifier)
      ? { $or: [{ _id: normalizedIdentifier }, { slug: normalizedIdentifier }] }
      : { slug: normalizedIdentifier };
    const blog = await Blog.findOne(filter);
    if (!blog)
      throw Object.assign(new Error("Blog not found."), { statusCode: 404 });
    return blog;
  }

  async getBlogBySlug(slug) {
    const blog = await Blog.findOne({ slug: slug.trim() });
    if (!blog)
      throw Object.assign(new Error("Blog not found."), { statusCode: 404 });
    return blog;
  }

  async updateBlog(blogId, data) {
    const previous = await Blog.findById(blogId).select("image imagePublicId");
    if (!previous)
      throw Object.assign(new Error("Blog not found."), { statusCode: 404 });
    const previousPublicId =
      previous.imagePublicId || getCloudinaryPublicIdFromUrl(previous.image);
    const update = { $set: { ...data, updated_at: new Date() } };
    if (data.image && !data.imagePublicId) {
      const publicId = getCloudinaryPublicIdFromUrl(data.image);
      if (publicId) update.$set.imagePublicId = publicId;
      else if (data.image !== previous.image)
        update.$unset = { imagePublicId: 1 };
    }
    const blog = await Blog.findByIdAndUpdate(blogId, update, {
      new: true,
      runValidators: true,
    });
    if (!blog)
      throw Object.assign(new Error("Blog not found."), { statusCode: 404 });
    const nextPublicId =
      blog.imagePublicId || getCloudinaryPublicIdFromUrl(blog.image);
    let cleanupPending = false;
    if (previousPublicId && previousPublicId !== nextPublicId)
      cleanupPending = await cleanupPreviousImage(
        previous.image,
        previousPublicId,
      );
    else if (
      previous.image?.startsWith("/uploads/") &&
      previous.image !== blog.image
    )
      cleanupPending = await cleanupPreviousImage(previous.image, null);
    return { blog, cleanupPending };
  }

  async deleteBlog(blogId) {
    const result = await Blog.findByIdAndDelete(blogId).select(
      "image imagePublicId",
    );
    if (!result)
      throw Object.assign(new Error("Blog not found."), { statusCode: 404 });
    const publicId =
      result.imagePublicId || getCloudinaryPublicIdFromUrl(result.image);
    let cleanupPending = false;
    try {
      if (result.image?.startsWith("/uploads/"))
        await deleteLocalUploadIfUnused(result.image);
      else await deleteCloudinaryImageIfUnused(publicId);
    } catch (error) {
      cleanupPending = true;
      console.error("BLOG_IMAGE_CLEANUP_ERROR:", {
        publicId,
        message:
          error instanceof Error ? error.message : "Unknown cleanup error",
      });
    }
    return {
      message: "Blog deleted successfully.",
      cleanupPending,
    };
  }
}

export default new BlogService();
