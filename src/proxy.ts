import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const isPublic = ["/signin", "/signup"];

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  const pathName = request.nextUrl.pathname;
  const checkPublic = isPublic.includes(pathName);

  if (!session && !checkPublic) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (session && checkPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/onboarding",
    // "/archive",
    "/settings",
    "/api/topics/:path*",
    "/api/topics",
    "/api/digests",
    "/api/digest-articles/:path*",
    "/api/feedback/:path*",
  ],
};
