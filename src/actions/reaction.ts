"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Reaction } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type UpdateReactionActionType = {
  reaction: Reaction | null;
  articleId: string;
};

export async function updateReaction({
  reaction,
  articleId,
}: UpdateReactionActionType) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  try {
    const updatedArticle = await prisma.digestArticle.update({
      where: {
        userId: session.user.id,
        id: articleId,
      },
      data: {
        reaction,
      },
    });

    revalidatePath(`/digest/${articleId}`);
    return {
      success: true,
      data: {
        updatedArticle,
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error updating reaction";

    console.error(message);

    throw new Error(message);
  }
}
