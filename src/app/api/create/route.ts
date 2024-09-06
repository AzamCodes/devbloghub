import { NextRequest, NextResponse } from "next/server"; // Correct import
import cloudinary from "@/utils/cloudinaryConfig";
import { Readable } from "stream";
import sharp from "sharp";
import Post from "@/models/PostModel";
import User from "@/models/UserModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Filter from "bad-words";

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getDataFromToken(req);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) throw new Error("User not found");

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const img = formData.get("img");
    const slug = formData.get("slug") as string;

    if (!img || !(img instanceof File))
      throw new Error("Image file is required and must be a file");

    const imageBuffer = Buffer.from(await img.arrayBuffer());
    const { width, height } = await sharp(imageBuffer).metadata();

    if (width === undefined || height === undefined)
      throw new Error("Failed to retrieve image metadata");
    if (width < 800 || height < 600)
      throw new Error("Image dimensions should be at least 800x600 pixels.");
    if (imageBuffer.length > 5 * 1024 * 1024)
      throw new Error("Image size should not exceed 5MB.");

    const imageStream = Readable.from(imageBuffer);

    // Upload image to Cloudinary
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

    const filter = new Filter();
    const cleanTitle = filter.clean(title);
    const cleanDesc = filter.clean(desc);

    const blogData = {
      title: cleanTitle,
      desc: cleanDesc,
      userId: user._id,
      slug,
      img: cloudinaryResponse.secure_url,
      author: user.username,
      authorImg: user.img,
    };

    const newPost = await Post.create(blogData);

    return NextResponse.json({
      imgUrl: cloudinaryResponse.secure_url,
      success: true,
      message: "BlogPost Added",
      post: newPost,
    });
  } catch (error: any) {
    console.error("Error creating post:", error.message || "An error occurred");
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
};
