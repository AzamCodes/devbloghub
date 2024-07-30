import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    // console.log("This is Request BiBody", reqBody);
    const token = reqBody.data.token;
    const pass = reqBody.data.pass;
    const confirmp = reqBody.data.confirmp;
    // Validate required fields
    // console.log(pass);
    // console.log(token);
    // console.log(confirmp);

    if (!token || !pass || !confirmp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 500 }
      );
    }
    // console.log("this is token", token);
    // Find user with valid token and unexpired expiry
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() }, // Ensure unexpired token
    });
    // console.log(user);
    // Access user properties only after checking for existence
    // const userToken = user.forgotPasswordToken; // Example usage

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      ); // Improved error message
    }
    // console.log(user);
    // const salt = await bcryptjs.genSalt(10);

    const hashPass = await bcryptjs.hash(pass, 10);
    // console.log("hashpass", hashPass);

    const rp = await bcryptjs.compare(pass, hashPass);

    // console.log(rp);

    if (!rp) {
      return NextResponse.json(
        { error: "Passwords Do Not Match" },
        { status: 400 }
      );
    }

    // console.log("this is hash", hashPass);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    user.password = hashPass;
    await user.save();

    return NextResponse.json(
      {
        message: "Password Update Successfully",
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
