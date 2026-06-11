import { prisma } from "@/lib/prisma";
import { getDigestSchema } from "@/zod/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const body = await req.json();

  const { success, data } = getDigestSchema.safeParse(body);

  if (!success) {
    return NextResponse.json({ error: "userId not provided" }, { status: 400 });
  }

  try {
    const digests = await prisma.digest.findMany({
      where: {
        userId: data.userId,
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
