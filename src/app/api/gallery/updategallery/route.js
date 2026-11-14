import connectDB from "../../../../config/dbconnection";
import {
  success,
  serverError,
  validationError,
} from "../../../../utils/apiResponse";
import GalleryService from "../../../../services/galleryServices";
import { requireAdmin } from "../../../../utils/auth";

import { z } from "zod";

const schema = z.object({
  galleryId: z.string().min(1),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  image: z.string().trim().min(1).max(1000).optional(),
  imagePublicId: z.string().trim().min(1).max(1000).optional(),
});

export async function PATCH(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    await connectDB();
    const validation = schema.safeParse(await req.json());
    if (!validation.success)
      return validationError(
        validation.error.issues.map((issue) => issue.message),
        422,
      );
    const { galleryId, ...data } = validation.data;
    const result = await GalleryService.updateGallery(galleryId, data);
    return success(
      result.cleanupPending
        ? "Gallery item updated; old image cleanup is pending."
        : "Gallery item updated successfully.",
      result.item,
    );
  } catch (error) {
    console.error("UPDATE_GALLERY_ERROR:", error);
    return error.statusCode
      ? validationError([error.message], error.statusCode)
      : serverError("Unable to update gallery item.");
  }
}
