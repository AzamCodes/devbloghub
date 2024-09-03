import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    connect();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Check for existing email and username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const errors: string[] = [];
      if (existingUser.email === email)
        errors.push("Email is already registered.");
      if (existingUser.username === username)
        errors.push("Username is already taken.");
      return NextResponse.json(
        { error: errors.join(" ") }, // Concatenate error messages
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message:
        "User created successfully. Please check your email to verify your account.",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
