import { prisma } from "@/lib/prisma";
import { updateTopicSchema } from "@/zod/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const topicId = body.topicId;

  if (!topicId) {
    return NextResponse.json(
      { error: "topicId not provided" },
      { status: 402 },
    );
  }

  const { success, data } = updateTopicSchema.safeParse(body.data);

  if (!success) {
    return NextResponse.json({ error: "invalid data shape" }, { status: 403 });
  }

  try {
    await prisma.topic.update({
      where: {
        id: topicId,
      },
      data: {
        name: data.name,
      },
    });

    return NextResponse.json({ message: "Topic was updated", topicId });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
