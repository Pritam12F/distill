import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "userId not provided" }, { status: 400 });
  }

  try {
    const digests = await prisma.digest.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, digests });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
