import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function to handle redirections based on authentication
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/blog" ||
    path === "/";
  const token = request.cookies.get("token")?.value || "";

  // If the user is logged in and tries to access a public path, redirect to the profile
  // if (isPublicPath && token) {
  //   return NextResponse.redirect(new URL("/profile", request.nextUrl));
  // }

  // If the user is not logged in and tries to access protected paths, redirect to the blog
  if (path === "/create" && !token) {
    return NextResponse.redirect(new URL("/blog", request.nextUrl));
  }

  // Redirect non-logged-in users away from other protected paths
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/blog", request.nextUrl));
  }
}

// Specify which paths should be handled by this middleware
export const config = {
  matcher: ["/", "/login", "/signup", "/profile", "/verifyemail", "/create"],
};
