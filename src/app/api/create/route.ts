import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import Post from "@/models/PostModel";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const userId = await getDataFromToken(req);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    const formData = await req.formData();
    const imge = formData.get("img");

    if (!imge || typeof imge === "string") {
      throw new Error("Image file is required and must be a file");
    }

    const imageByteData = await imge.arrayBuffer();

    if (!imageByteData) {
      throw new Error("Failed to process image data");
    }

    const buffer = Buffer.from(imageByteData);
    const timestamp = Date.now();
    const imagePath = `./public/${timestamp}_${imge.name}`;
    await writeFile(imagePath, buffer);
    const imgUrl = `/${timestamp}_${imge.name}`;

    const blogData = {
      title: formData.get("title"),
      desc: formData.get("desc"),
      userId: user._id,
      slug: formData.get("slug"),
      img: imgUrl,
      author: user.username,
      authorImg: user.img,
    };

    // console.log("Blog Data:", blogData);

    const newPost = await Post.create(blogData);

    // console.log("Newly Created Post:", newPost);

    return NextResponse.json({
      imgUrl,
      success: true,
      message: "BlogPost Added",
      post: newPost,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
