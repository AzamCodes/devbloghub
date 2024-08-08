import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/UserModel";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("This is reqbody", reqBody);

    const { email } = reqBody.email;
    console.log(email); // Extract email from request body
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });
    }

    sendEmail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json({
      message: "Email for Forgot Password Sent successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error sending reset email:", error);
    // Consider a more descriptive error message for the user based on error type
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
