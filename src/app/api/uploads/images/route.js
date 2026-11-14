import { requireAdmin } from "../../../../utils/auth";
import connectDB from "../../../../config/dbconnection";
import apiResponse from "../../../../utils/common/apiResponse";
import {
  cloudinaryErrorDetails,
  getCloudinaryFolderPath,
  normalizeCloudinaryFolderName,
  default as cloudinary,
} from "../../../../utils/cloudinary";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;

    const folder = normalizeCloudinaryFolderName(
      new URL(req.url).searchParams.get("folder"),
    );
    if (!folder)
      return apiResponse.validationError(
        "A valid folder is required.",
        ["Choose a valid image folder."],
        422,
      );

    const result = await cloudinary.search
      .expression(
        `asset_folder="${getCloudinaryFolderPath(folder)}" AND resource_type:image`,
      )
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();
    return apiResponse.success("Cloudinary images fetched.", {
      images: (result.resources || [])
        .filter((image) => image.resource_type === "image")
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() -
            new Date(left.created_at).getTime(),
        )
        .map((image) => ({
          publicId: image.public_id,
          url: image.secure_url,
          format: image.format,
          bytes: image.bytes,
          createdAt: image.created_at,
        })),
    });
  } catch (error) {
    console.error(
      "GET_CLOUDINARY_IMAGES_ERROR:",
      cloudinaryErrorDetails(error),
    );
    return apiResponse.serverError("Unable to fetch images.");
  }
}
