"use server";

import { prisma } from "@/lib/prisma";

export const getDigest = async (digestId: string) => {
  const digest = await prisma.digest.findFirst({
    where: {
      id: digestId,
    },
    include: {
      articles: true,
      topic: {
        select: {
          name: true,
          user: {
            select: {
              topics: {
                select: {
                  id: true,
                },
              },
            },
          },
          id: true,
        },
      },
    },
  });

  if (!digest) return null;

  return { digest, ownerTopics: digest?.topic.user.topics };
};
