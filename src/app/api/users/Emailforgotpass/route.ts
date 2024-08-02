import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/UserModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        error: "Invalid Credentials",
        status: 400,
      });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({
        error: "Invalid Credentials",
        status: 400,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_TOKEN!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Logged in successfully!",
      success: 200,
      token, // Include token in the response body
    });

    response.cookies.set("token", token, {
      httpOnly: true, // Keeps the cookie secure
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    });
  }
}
