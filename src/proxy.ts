import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/onboarding",
    "/archive",
    "/settings",
    "/api/topics/:path*",
    "/api/topics",
    "/api/digests",
    "/api/digest-articles/:path*",
    "/api/feedback/:path*",
  ],
};
