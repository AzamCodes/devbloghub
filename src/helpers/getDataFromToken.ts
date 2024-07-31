import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      throw new Error("Token not provided");
    }
    const decodedToken: any = jwt.verify(token, process.env.SECRET_TOKEN!);
    return decodedToken.id;
  } catch (error: any) {
    console.error("Token verification error:", error.message); // Detailed error logging
    throw new Error("Invalid or expired token");
  }
};
