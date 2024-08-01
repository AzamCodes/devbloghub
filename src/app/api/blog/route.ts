import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/PostModel";
// import { Metadata } from "next";

// const metadata: Metadata = {
//   title: "BLOG",
//   description: "Blog Application made with Next JS",
// };
connect();
export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "6");
    const query = url.searchParams.get("query") || "";

    // Calculate the number of skips
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 }) // Sort posts by date descending
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({ posts, totalPages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
