"use server";

import { DigestCardProps, GetDigestsErrorType } from "@/types/digest";
import { topicColors } from "@/constants/constants";
import { prisma } from "@/lib/prisma";
import { Digest } from "@prisma/client";
import { errorDecoder } from "@/utils/error-decoder";

const MAX_TOPICS_PER_USER = 10;

function reorder(
  digests: (Digest & {
    _count: { articles: number };
    topic: {
      name: string;
    };
  })[],
) {
  return digests.map((m) => ({
    id: m.id,
    topic: m.topic.name,
    headline: m.headline,
    consensus: m.consensus,
    hasConflict: m.conflict,
    date: m.createdAt.toISOString().split("T")[0],
    hasRead: m.hasRead,
    accentIndex:
      m.topic.name
        .split("")
        .reduce((acc, curr) => acc + curr.charCodeAt(0), 0) %
      topicColors.length,
    sourceCount: m._count.articles,
  }));
}

export async function getDigests(userId: string): Promise<
  | {
      currDigests: DigestCardProps[];
      prevDigests: DigestCardProps[];
    }
  | GetDigestsErrorType
> {
  try {
    const userTopics = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        topics: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!userTopics || !userTopics.topics.length) {
      return {
        error: "No user or topics found for this id",
      };
    }

    const sortedDigests = await prisma.digest.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        topic: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
      take: MAX_TOPICS_PER_USER,
    });

    const dateMap = new Map<string, typeof sortedDigests>();

    sortedDigests.forEach((d) => {
      const createdAt = d.createdAt.toISOString().split("T")[0];

      const date = dateMap.get(createdAt);

      if (!date) {
        dateMap.set(createdAt, [d]);
        return;
      }

      date.push(d);
    });

    const groups = Array.from(dateMap.values());

    return {
      currDigests: groups[0] ? reorder(groups[0]) : [],
      prevDigests: groups[1] ? reorder(groups[1]) : [],
    };
  } catch (e) {
    const errMsg = errorDecoder(e, "Error fetching recent digests");
    console.error(errMsg);

    return {
      error: errMsg,
    };
  }
}
