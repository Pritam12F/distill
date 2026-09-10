"use server";

import { type Source } from "@/constants/constants";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const onBoardUser = async (
  topics: { name: string; sources: Source[] }[],
): Promise<{
  message?: string;
  success: boolean;
}> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "User not authorzied",
      success: false,
    };
  }

  try {
    const promise = await prisma.$transaction(async (tx) => {
      const topicsEnlisted = await tx.topic.count({
        where: {
          userId: session.user.id,
        },
      });

      if (topicsEnlisted) {
        return false;
      }

      const topicsAdded = tx.topic.createMany({
        data: topics.map((t) => ({
          userId: session.user.id,
          name: t.name,
          sources: t.sources.map((s) => s.value),
        })),
      });

      return (await topicsAdded).count ? true : false;
    });

    if (promise) {
      revalidatePath("/");
    }

    return promise
      ? {
          message: "Topics added",
          success: true,
        }
      : {
          message: "Error adding topics or already present",
          success: false,
        };
  } catch (err) {
    console.error(
      err instanceof Error ? err.message : "couldn't on board uers",
    );

    return {
      message: err instanceof Error ? err.message : "couldn't on board uers",
      success: false,
    };
  }
};
