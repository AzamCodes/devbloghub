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

    const imageBuffer = Buffer.from(await img.arrayBuffer());

    // Determine the image format
    const imageFormat = img.type.split("/")[1]; // Extract format (e.g., jpeg, gif)

    // Compress and convert image using sharp if needed
    let processedImageBuffer: Buffer;

    if (imageFormat === "gif") {
      // No processing for GIFs
      processedImageBuffer = imageBuffer;
    } else {
      // Process non-GIF images
      processedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 800, height: 600, fit: "cover" }) // Resize to minimum dimensions
        .toFormat("jpeg", { quality: 80 }) // Convert to JPEG format and compress
        .toBuffer();
    }

    if (processedImageBuffer.length > 5 * 1024 * 1024) {
      // 5MB
      throw new Error("Image size should not exceed 5MB.");
    }

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

    // console.log("Cloudinary Response:", cloudinaryResponse);

    const imgUrl = cloudinaryResponse.secure_url;
    // console.log("Profile Image URL:", imgUrl);

    // Update user profile with new image URL
    user.img = imgUrl;
    await user.save();

    // console.log("Updated User Document:", user);

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
