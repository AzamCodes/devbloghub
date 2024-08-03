import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinaryConfig";
import Post from "@/models/PostModel";

export const DELETE = async (req: NextRequest) => {
  try {
    const { postId }: { postId: string } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Extract the public ID from the image URL
    const imageUrl = post.img;

    // Extract the public ID from the Cloudinary URL
    const imagePublicId = imageUrl
      .replace(
        /https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/v[^\/]+\//,
        ""
      ) // Remove base URL and version
      .replace(/\.[^.]+$/, ""); // Remove file extension

    if (!imagePublicId) {
      return NextResponse.json(
        { success: false, message: "Unable to extract image public ID" },
        { status: 400 }
      );
    }

    // Delete the image from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(imagePublicId);
    // console.log("Cloudinary Response:", cloudinaryResponse);

    if (cloudinaryResponse.result !== "ok") {
      throw new Error("Failed to delete image from Cloudinary");
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
};
