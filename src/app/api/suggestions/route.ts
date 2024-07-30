// src/app/api/suggestions/route.ts
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/PostModel";

connect();

export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";

    const suggestions = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
      ],
    })
      .limit(5)
      .select("title slug"); // Ensure 'slug' is included in the suggestions

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
