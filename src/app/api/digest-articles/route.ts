import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reactionSchema } from "@/zod/api";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
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
    return NextResponse.json(
      { error: "No digestId provided" },
      { status: 403 },
    );
  }

  const { success, data } = reactionSchema.safeParse(await req.json());

  if (!success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const digestId = params.id;
  const reaction = data.reaction;

  try {
    return await prisma.digestArticle.update({
      where: {
        id: digestId,
      },
      data: {
        reaction,
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
