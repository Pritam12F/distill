import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addTopicSchema } from "@/zod/api";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "User not authorized" }, { status: 400 });
  }

  try {
    const topics = await prisma.topic.findMany({
      where: {
        userId: session.user.id,
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

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "user not authorized" }, { status: 400 });
  }

  const body = await req.json();

  const { success, data } = addTopicSchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      { error: "invalid data shape: { topicName: string; }" },
      { status: 403 },
    );
  }

  try {
    const topics = await prisma.topic.upsert({
      where: {
        userId_name: {
          userId: session.user.id,
          name: data.topicName,
        },
      },
      create: {
        userId: session.user.id,
        name: data.topicName,
        sources: data.sources,
      },
      update: {
        sources: data.sources,
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "User not authorized" }, { status: 400 });
  }

  if (!params || !params.id) {
    return NextResponse.json({ error: "No topicId provided" }, { status: 403 });
  }

  try {
    return await prisma.topic.delete({
      where: {
        userId: session.user.id,
        id: params.id,
      },
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
