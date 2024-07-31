// pages/api/profile.js
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/userModel";

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

    if (img && img instanceof File) {
      const imageByteData = await img.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      const timestamp = Date.now();
      const filename = `${timestamp}_${img.name}`;
      const path = `./public/userimg/${filename}`;

      await writeFile(path, buffer);
      const userUrl = `/userimg/${filename}`;

      // Update the user document with the image URL and email
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { img: userUrl, email: email || user.email } }, // Ensure email is updated
        { new: true }
      );

      return NextResponse.json({ success: true, data: updatedUser });
    } else if (email) {
      // If no image, just update the email
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { email: email } },
        { new: true }
      );

      return NextResponse.json({ success: true, data: updatedUser });
    } else {
      throw new Error("No valid data provided");
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
