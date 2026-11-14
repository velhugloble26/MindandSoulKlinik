import { requireAdmin } from "../../../../utils/auth";
import connectDB from "../../../../config/dbconnection";
import apiResponse from "../../../../utils/common/apiResponse";
import {
  cloudinaryErrorDetails,
  createCloudinarySubfolderIfMissing,
  listCloudinaryFolders,
  normalizeCloudinaryFolderName,
} from "../../../../utils/cloudinary";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    return apiResponse.success("Cloudinary folders fetched.", {
      root: "adorlifewithnidhi",
      folders: await listCloudinaryFolders(),
    });
  } catch (error) {
    console.error(
      "GET_CLOUDINARY_FOLDERS_ERROR:",
      cloudinaryErrorDetails(error),
    );
    return apiResponse.serverError("Unable to fetch image folders.");
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const auth = await requireAdmin(req);
    if (auth.error) return auth.error;
    const body = await req.json().catch(() => null);
    const name = normalizeCloudinaryFolderName(body?.name);
    if (!name)
      return apiResponse.validationError(
        "Invalid folder name.",
        ["Use letters, numbers, hyphens, or underscores."],
        422,
      );

    const folders = await listCloudinaryFolders();
    if (!folders.includes(name)) {
      await createCloudinarySubfolderIfMissing(name);
    }

    return apiResponse.created("Image folder is ready.", { name });
  } catch (error) {
    console.error(
      "CREATE_CLOUDINARY_FOLDER_ERROR:",
      cloudinaryErrorDetails(error),
    );
    return apiResponse.serverError("Unable to create image folder.");
  }
}
