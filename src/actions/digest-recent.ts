"use server";

import { DigestCardProps } from "@/components/digest-card";
import { prisma } from "@/lib/prisma";

export async function getDigests(
  userId: string,
): Promise<{ currDigests: DigestCardProps[]; prevDigests: DigestCardProps[] }> {
  const sortedDigests = await prisma.digest.findMany({
    where: {
      id: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      topic: true,
      articles: {
        select: {
          sourceId: true,
        },
      },
    },
  });

  const currentTime = new Date();
  const currentDate = currentTime.getDate();

  const currentISO = new Date().toISOString().split("T")[0];
  const prevISO = new Date(currentTime.setDate(currentDate - 1))
    .toISOString()
    .split("T")[0];

  const currDigests = sortedDigests
    .filter((d) => d.createdAt.toISOString().split("T")[0] === currentISO)
    .map((m, i) => ({
      id: m.id,
      topic: m.topic.name,
      headline: m.headline,
      consensus: m.consensus,
      hasConflict: m.conflict,
      date: m.createdAt.toISOString().split("T")[0],
      isUnread: true,
      accentIndex: i,
      sourceCount: m.articles.length,
    }));

  const prevDigests = sortedDigests
    .filter((d) => d.createdAt.toISOString().split("T")[0] === prevISO)
    .map((m, i) => ({
      id: m.id,
      topic: m.topic.name,
      headline: m.headline,
      consensus: m.consensus,
      hasConflict: m.conflict ?? false,
      date: m.createdAt.toISOString().split("T")[0],
      isUnread: true,
      accentIndex: i,
      sourceCount: m.articles.length,
    }));

  return {
    currDigests,
    prevDigests,
  };
}
