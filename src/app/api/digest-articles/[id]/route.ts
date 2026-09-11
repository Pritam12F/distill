import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reactionSchema } from "@/zod/api";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
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
    return NextResponse.json(
      { error: "No digestId provided" },
      { status: 403 },
    );
  }

  const { success, data } = reactionSchema.safeParse(await req.json());

  if (!success) {
    return NextResponse.json({ error: "Invalid data format" }, { status: 402 });
  }

  const digestId = id;
  const reaction = data.reaction;

  try {
    const updatedArticle = await prisma.digestArticle.update({
      where: {
        id: digestId,
      },
      data: {
        reaction,
      },
    });

    return NextResponse.json({
      message: "article updated successfully",
      data: updatedArticle,
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { id } = await params;

  if (!id && !session) {
    return NextResponse.json({
      error: "No digestId or userId provided/authorized",
    });
  }

  try {
    const allDigests = await prisma.digestArticle.findMany({
      where: {
        id: id,
        userId: session?.user.id,
      },
    });

    return NextResponse.json({
      message: "Fetched all digests",
      data: allDigests,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json({
      error:
        err instanceof Error
          ? err.message
          : "Unknown error trying to fetch articles",
    });
  }
}
