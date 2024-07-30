// pages/api/posts/[userId].ts
import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/PostModel";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const {
//     query: { userId },
//     method,
//   } = req;

//   if (method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required" });
//   }

//   try {
//     await connect(); // Ensure database connection

//     const posts = await Post.find({ userId }).exec(); // Assuming `Post` is a Mongoose model
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }
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
