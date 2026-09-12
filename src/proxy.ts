import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC = ["/", "/signin", "/signup", "/digest"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-pathname", pathname);

  if (!isPublic) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}
