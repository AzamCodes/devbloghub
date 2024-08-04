import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinaryConfig";
import { Readable } from "stream";
import User from "@/models/UserModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import sharp from "sharp";

export const POST = async (req: NextRequest) => {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(req);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    // Get form data
    const formData = await req.formData();
    const img = formData.get("img");

    if (!img || !(img instanceof File)) {
      throw new Error("Image file is required and must be a file");
    }

    // Get the public ID of the old image
    const oldImageUrl = user.img;
    const oldImagePublicId = oldImageUrl
      ? oldImageUrl.split("/").slice(-2).join("/").split(".")[0]
      : null;

    console.log("Old Image URL:", oldImageUrl);
    console.log("Old Image Public ID:", oldImagePublicId);

    // Validate image with sharp
    const imageBuffer = Buffer.from(await img.arrayBuffer());
    const { width, height } = await sharp(imageBuffer).metadata();

    if (width === undefined || height === undefined) {
      throw new Error("Failed to retrieve image metadata");
    }

    // Resize image to 110x110 pixels (Instagram profile image dimensions)
    if (width < 110 || height < 110) {
      throw new Error("Image dimensions should be at least 110x110 pixels.");
    }

    // Compress and convert image using sharp
    const processedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 110, height: 110, fit: "cover" }) // Resize to 110x110 pixels
      .toFormat("jpeg", { quality: 80 }) // Convert to JPEG format and compress
      .toBuffer();

    // Upload image to Cloudinary
    const imageStream = new Readable();
    imageStream.push(processedImageBuffer);
    imageStream.push(null);

    const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile_pictures", quality: "auto", fetch_format: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      imageStream.pipe(uploadStream);
    });

    const imgUrl = cloudinaryResponse.secure_url;
    console.log("Uploaded Image URL:", imgUrl);

    // If there was an old image, delete it from Cloudinary
    if (oldImagePublicId) {
      try {
        const deletionResponse = await cloudinary.uploader.destroy(
          oldImagePublicId,
          {
            resource_type: "image",
          }
        );
        console.log("Cloudinary Deletion Response:", deletionResponse);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
      }
    }

    // Update user profile with new image URL
    user.img = imgUrl;
    await user.save();

    return NextResponse.json({
      imgUrl,
      success: true,
      message: "Profile picture updated",
      user,
    });
  } catch (error: any) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
};
