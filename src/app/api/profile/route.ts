// pages/api/profile.js
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/UserModel";
import cloudinary from "@/utils/cloudinaryConfig"; // Import Cloudinary configuration
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connect();

    const userId = await getDataFromToken(req);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const img = formData.get("img");
    const email = formData.get("email");

    let imgUrl = user.img; // Default to the existing image URL

    if (img && img instanceof File) {
      const imageBuffer = Buffer.from(await img.arrayBuffer());

      // Convert the buffer to a readable stream
      const imageStream = new Readable();
      imageStream.push(imageBuffer);
      imageStream.push(null);

      // Upload image to Cloudinary
      const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "user_images" }, // Adjust the folder name as needed
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        imageStream.pipe(uploadStream);
      });

      imgUrl = cloudinaryResponse.secure_url;
    }

    // Update the user document with the image URL and email
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { img: imgUrl, email: email || user.email } }, // Ensure email is updated
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
