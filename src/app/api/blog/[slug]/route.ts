// src/app/api/blog/[slug]/route.ts

import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/PostModel";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  await connect(); // Ensure database connection

  try {
    // console.log(slug);
    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    // console.log(post);
    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
