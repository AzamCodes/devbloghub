import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "Logout Successful",
      success: true,
    });

    // Clear the cookie by setting its value to empty and setting the expiry date to the past
    response.cookies.set("token", "", {
      httpOnly: true, // Match how it was originally set
      path: "/", // Ensure the path matches where the cookie was set
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
