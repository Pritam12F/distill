"use server";

import { type Source } from "@/types/topic";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { errorDecoder } from "@/utils/error-decoder";

export const onBoardUser = async (
  topics: { name: string; sources: Source[] }[],
): Promise<{
  message?: string;
  success: boolean;
}> => {
  const session = await getSession();

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
          sources: t.sources
            .filter((s) => s.type === "rss")
            .map((r) => r.value),
        })),
      });

      return (await topicsAdded).count > 0 ? true : false;
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
    const errMsg = errorDecoder(err, "couldn't on board uers");
    console.error(errMsg);

    return {
      message: errMsg,
      success: false,
    };
  }
};
