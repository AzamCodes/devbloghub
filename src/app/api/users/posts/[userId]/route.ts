// pages/api/posts/[userId].ts
import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/PostModel";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    await connect();
    const posts = await Post.find({ userId });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.error();
  }
}
