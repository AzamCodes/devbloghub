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

    if (!img || typeof img === "string") {
      throw new Error("Image file is required and must be a file");
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
    // console.log("Cloudinary response:", cloudinaryResponse);

    // Save post details to the database
    const blogData = {
      title: formData.get("title"),
      desc: formData.get("desc"),
      userId: user._id,
      slug: formData.get("slug"),
      img: imgUrl,
      author: user.username,
      authorImg: user.img,
    };

    const newPost = await Post.create(blogData);
    // console.log("New post created:", newPost);
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
