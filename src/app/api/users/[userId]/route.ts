// pages/api/users/[userId].ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";

connect();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const user = await User.findById(userId).select("-password"); // Use findById to find by _id

    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    console.error("Error fetching user:", error.message); // Detailed error logging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
