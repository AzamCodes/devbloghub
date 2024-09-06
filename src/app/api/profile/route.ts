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
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get form data
    const formData = await req.formData();
    const img = formData.get("img");
    const newEmail = formData.get("email")?.toString().trim();

    let isUpdated = false; // Flag to check if any update has occurred

    // Handle email update if provided
    if (newEmail) {
      if (newEmail === user.email) {
        return NextResponse.json(
          { success: false, message: "Email is the same as the current one" },
          { status: 400 }
        );
      }

      const emailExists = await User.findOne({ email: newEmail });

      if (emailExists) {
        return NextResponse.json(
          { success: false, message: "Email already exists" },
          { status: 400 }
        );
      }

      // Update email
      user.email = newEmail;
      isUpdated = true;
    }

    // Handle image update if provided
    if (img && img instanceof File) {
      // Validate MIME type
      if (!img.type.startsWith("image/")) {
        return NextResponse.json(
          { success: false, message: "Invalid image file type" },
          { status: 400 }
        );
      }

      // Get the public ID of the old image
      const oldImageUrl = user.img;
      const oldImagePublicId = oldImageUrl
        ? oldImageUrl.split("/").slice(-2).join("/").split(".")[0]
        : null;

      // Validate image with sharp
      const imageBuffer = Buffer.from(await img.arrayBuffer());
      const { width, height } = await sharp(imageBuffer).metadata();

      if (!width || !height) {
        return NextResponse.json(
          { success: false, message: "Failed to retrieve image metadata" },
          { status: 400 }
        );
      }

      if (width < 110 || height < 110) {
        return NextResponse.json(
          {
            success: false,
            message: "Image dimensions should be at least 110x110 pixels.",
          },
          { status: 400 }
        );
      }

      // Process and compress the image
      const processedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 110, height: 110, fit: "cover" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      // Upload to Cloudinary
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

      // Delete the old image if it exists
      if (oldImagePublicId) {
        try {
          await cloudinary.uploader.destroy(oldImagePublicId, {
            resource_type: "image",
          });
        } catch (error) {
          console.error("Error deleting old image from Cloudinary:", error);
        }
      }

      // Update user profile with new image URL
      user.img = imgUrl;
      isUpdated = true;
    }

    // Save user if any update occurred
    if (isUpdated) {
      await user.save();
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        user: { email: user.email, img: user.img },
      });
    } else {
      return NextResponse.json(
        { success: false, message: "No changes made to the profile" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
};
