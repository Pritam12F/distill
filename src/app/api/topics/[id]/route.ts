import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTopicSchema } from "@/zod/topic";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "User not authorized" }, { status: 400 });
  }

  const body = await req.json();

  const { success, data } = updateTopicSchema.safeParse(body.data);

  if (!success) {
    return NextResponse.json({ error: "invalid data shape" }, { status: 403 });
  }

  try {
    await prisma.topic.update({
      where: {
        id: data.topicId,
        userId: session.user.id,
      },
      data: {
        name: data.name,
      },
    });

    return NextResponse.json({
      message: "Topic was updated",
      topicId: data.topicId,
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "User not authorized" }, { status: 400 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "No topicId provided" }, { status: 403 });
  }

  try {
    const deletedTopic = await prisma.topic.delete({
      where: {
        userId: session.user.id,
        id: id,
      },
    });

    return NextResponse.json({
      message: "Deleted successfully",
      data: deletedTopic,
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
