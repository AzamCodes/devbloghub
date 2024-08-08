// src/app/api/users/forgotPass/route.ts

import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/UserModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, pass, confirmp } = reqBody.data;

    if (!token || !pass || !confirmp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (pass !== confirmp) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const hashPass = await bcryptjs.hash(pass, 10);

    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    user.password = hashPass;
    await user.save();

    return NextResponse.json(
      {
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
