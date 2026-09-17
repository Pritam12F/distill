"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";
import { Reaction } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type UpdateReactionActionType = {
  reaction: Reaction | null;
  articleId: string;
};

export async function updateReaction({
  reaction,
  articleId,
}: UpdateReactionActionType) {
  const session = await getSession();

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
    const message = errorDecoder(err, "Error updating reaction");

    console.error(message);
  }
}
