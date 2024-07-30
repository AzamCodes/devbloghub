// /app/api/posts/[id]/route.ts

import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/PostModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  try {
    await connect();
    await Post.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
