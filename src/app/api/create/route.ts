import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinaryConfig"; // Adjust the import path as needed
import { Readable } from "stream";
import Post from "@/models/PostModel"; // Import your Post model
import User from "@/models/UserModel"; // Import your User model
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Import your token helper

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getDataFromToken(req); // Assuming this function extracts user ID from the token
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    const formData = await req.formData();
    const img = formData.get("img");
    const slug = formData.get("slug");

    if (!img || typeof img === "string") {
      throw new Error("Image file is required and must be a file");
    }

    // Check if the slug already exists in the database
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already in use. Please choose a unique slug.",
        },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await img.arrayBuffer());

    // Convert the buffer to a readable stream
    const imageStream = new Readable();
    imageStream.push(imageBuffer);
    imageStream.push(null);

    // Upload image to Cloudinary
    const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "blog_posts" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      imageStream.pipe(uploadStream);
    });

    const imgUrl = cloudinaryResponse.secure_url;

    // Save post details to the database
    const blogData = {
      title: formData.get("title"),
      desc: formData.get("desc"),
      userId: user._id,
      slug,
      img: imgUrl,
      author: user.username,
      authorImg: user.img,
    };

    const newPost = await Post.create(blogData);

    return NextResponse.json({
      imgUrl,
      success: true,
      message: "BlogPost Added",
      post: newPost,
    });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
