import { createHash } from "node:crypto";
import { requireAdmin } from "../../../../utils/auth";
import connectDB from "../../../../config/dbconnection";
import apiResponse from "../../../../utils/common/apiResponse";
import {
  CLOUDINARY_ROOT_FOLDER,
  cloudinaryErrorDetails,
  deleteCloudinaryImageIfUnused,
  getCloudinaryFolderPath,
  listCloudinaryFolders,
  normalizeCloudinaryFolderName,
  default as cloudinary,
} from "../../../../utils/cloudinary";

export const runtime = "nodejs";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(req) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;

    const formData = await req.formData();
    const file = formData.get("image");
    const folder = normalizeCloudinaryFolderName(
      formData.get("folder") || "blog",
    );

    if (!(file instanceof File) || file.size === 0)
      return apiResponse.validationError(
        "Validation failed.",
        ["An image file is required."],
        422,
      );

    if (!allowedTypes.has(file.type))
      return apiResponse.validationError(
        "Validation failed.",
        ["Only JPEG, PNG, WebP, and GIF images are supported."],
        415,
      );

    if (file.size > 8 * 1024 * 1024)
      return apiResponse.validationError(
        "Validation failed.",
        ["Image size must not exceed 8 MB."],
        413,
      );

    if (!folder)
      return apiResponse.validationError(
        "Invalid folder.",
        ["Choose a valid Cloudinary folder."],
        422,
      );

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("UPLOAD_IMAGE_ERROR: Cloudinary configuration is missing.");
      return apiResponse.serverError("Image upload failed.");
    }

    const folders = await listCloudinaryFolders();
    if (!folders.includes(folder))
      return apiResponse.validationError(
        "Folder not found.",
        ["Create or select a folder before uploading."],
        422,
      );

    const buffer = Buffer.from(await file.arrayBuffer());
    const assetFolder = getCloudinaryFolderPath(folder);
    const fileHash = createHash("sha256").update(buffer).digest("hex");
    const expectedPublicId = `${assetFolder}/${fileHash}`;
    let result;
    try {
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            asset_folder: assetFolder,
            use_asset_folder_as_public_id_prefix: true,
            public_id: fileHash,
            unique_filename: false,
            overwrite: false,
            resource_type: "image",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
          },
        );

        uploadStream.end(buffer);
      });
    } catch (error) {
      if (error?.http_code !== 409) throw error;
      result = await cloudinary.api.resource(expectedPublicId, {
        resource_type: "image",
      });
    }

    return apiResponse.created("Image uploaded successfully.", {
      url: result.secure_url,
      publicId: result.public_id,
      fileName: result.public_id,
      size: file.size,
      mimeType: file.type,
      cloudinary: {
        publicId: result.public_id,
        format: result.format,
        assetFolder: result.asset_folder,
      },
    });
  } catch (error) {
    console.error("UPLOAD_IMAGE_ERROR:", {
      ...cloudinaryErrorDetails(error),
    });
    return apiResponse.serverError("Image upload failed.");
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const body = await req.json().catch(() => null);
    const { publicId } = body || {};
    if (
      typeof publicId !== "string" ||
      !publicId.startsWith(`${CLOUDINARY_ROOT_FOLDER}/`)
    ) {
      return apiResponse.validationError(
        "Invalid image.",
        ["Only images in the managed Cloudinary folder can be removed."],
        422,
      );
    }

    const deleted = await deleteCloudinaryImageIfUnused(publicId);
    return apiResponse.success(
      deleted
        ? "Unreferenced image deleted."
        : "Image is still in use and was kept.",
      { deleted },
    );
  } catch (error) {
    console.error(
      "DELETE_CLOUDINARY_IMAGE_ERROR:",
      cloudinaryErrorDetails(error),
    );
    return apiResponse.serverError("Unable to delete image.");
  }
}
