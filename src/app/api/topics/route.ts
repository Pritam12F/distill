import { prisma } from "@/lib/prisma";
import { getTopicSchema } from "@/zod/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const body = await req.json();

  const { success, data } = getTopicSchema.safeParse(body);

  if (!success) {
    return NextResponse.json({ error: "userId not provided" }, { status: 400 });
  }

  try {
    const topics = await prisma.topic.findMany({
      where: {
        userId: data.userId,
      },
    });

    return NextResponse.json({ success: true, topics });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
