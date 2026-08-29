import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // In this version of Next.js `params` is a Promise and must be awaited.
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const digest = await prisma.digest.findFirst({
      // Scope by userId so a user can only read their own digests.
      where: { id, userId: session.user.id },
      include: { articles: true },
    });

    if (!digest) {
      return NextResponse.json({ error: "Digest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, digest });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
