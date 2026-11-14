import connectDB from "../../../../config/dbconnection";
import {
  success,
  serverError,
  validationError,
} from "../../../../utils/apiResponse";
import GalleryService from "../../../../services/galleryServices";
import { requireAdmin } from "../../../../utils/auth";
import { z } from "zod";

export async function DELETE(req) {
  try {
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    await connectDB();
    const validation = z
      .object({ galleryId: z.string().min(1) })
      .safeParse(await req.json());
    if (!validation.success)
      return validationError(["Gallery id is required."], 422);
    const result = await GalleryService.deleteGallery(
      validation.data.galleryId,
    );
    return success(
      result.cleanupPending
        ? "Gallery item deleted; image cleanup is pending."
        : result.message,
      result,
    );
  } catch (error) {
    console.error("DELETE_GALLERY_ERROR:", error);
    return error.statusCode
      ? validationError([error.message], error.statusCode)
      : serverError("Unable to delete gallery item.");
  }
}
