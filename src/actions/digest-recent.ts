"use server";

import { DigestCardProps } from "@/types/digest";
import { topicColors } from "@/constants/constants";
import { prisma } from "@/lib/prisma";

export async function getDigests(
  userId: string,
): Promise<{ currDigests: DigestCardProps[]; prevDigests: DigestCardProps[] }> {
  const timeNow = new Date();
  timeNow.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(timeNow.getTime() - 86_400_000);
  const tomorrow = new Date(timeNow.getTime() + 86_400_000);

  const sortedDigests = await prisma.digest.findMany({
    where: {
      userId,
      createdAt: {
        gte: yesterday,
        lt: tomorrow,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      topic: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });

  const currDigests = sortedDigests
    .filter((d) => d.createdAt >= timeNow && d.createdAt < tomorrow)
    .map((m, i) => ({
      id: m.id,
      topic: m.topic.name,
      headline: m.headline,
      consensus: m.consensus,
      hasConflict: m.conflict,
      date: m.createdAt.toISOString().split("T")[0],
      isUnread: true,
      accentIndex:
        [m.topic.name].reduce((acc, curr) => acc + curr.charCodeAt(0), 0) %
        topicColors.length,
      sourceCount: m._count.articles,
    }));

  const prevDigests = sortedDigests
    .filter((d) => d.createdAt >= yesterday && d.createdAt < timeNow)
    .map((m, i) => ({
      id: m.id,
      topic: m.topic.name,
      headline: m.headline,
      consensus: m.consensus,
      hasConflict: m.conflict,
      date: m.createdAt.toISOString().split("T")[0],
      isUnread: true,
      accentIndex:
        [m.topic.name].reduce((acc, curr) => acc + curr.charCodeAt(0), 0) %
        topicColors.length,
      sourceCount: m._count.articles,
    }));

  return {
    currDigests,
    prevDigests,
  };
}
