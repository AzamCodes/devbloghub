// src/app/api/blog/[slug]/route.ts

import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/PostModel";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import cloudinary from "@/utils/cloudinaryConfig";
import { Readable } from "stream";
import sharp from "sharp";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Filter from "bad-words";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  await connect(); // Ensure database connection

  try {
    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getDataFromToken(req);
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const img = formData.get("img") as File | null;
    const existingImg = formData.get("existingImg") as string;
    const slug = formData.get("slug") as string;

    let imageUrl = existingImg;

    // Only process new image if one was uploaded
    if (img) {
      const imageBuffer = Buffer.from(await img.arrayBuffer());
      const { width, height } = await sharp(imageBuffer).metadata();

      if (width === undefined || height === undefined)
        throw new Error("Failed to retrieve image metadata");
      if (width < 800 || height < 600)
        throw new Error("Image dimensions should be at least 800x600 pixels.");
      if (imageBuffer.length > 5 * 1024 * 1024)
        throw new Error("Image size should not exceed 5MB.");

      const imageStream = Readable.from(imageBuffer);

      // Upload new image to Cloudinary
      const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts", quality: "auto", fetch_format: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        imageStream.pipe(uploadStream);
      });

      imageUrl = cloudinaryResponse.secure_url;
    }

    const filter = new Filter();
    const cleanTitle = filter.clean(title);
    const cleanDesc = filter.clean(desc);

    // Update the post
    const updatedPost = await Post.findOneAndUpdate(
      { slug: params.slug, userId },
      {
        title: cleanTitle,
        desc: cleanDesc,
        slug,
        ...(imageUrl && { img: imageUrl }),
      },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { success: false, message: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
