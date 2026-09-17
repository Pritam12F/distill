"use server";

import { prisma } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";
import { DailySummaryResult } from "@/types/digest";
import { getMetadata } from "@/utils/microlink";
import { getInitials } from "@/utils/get-initals";

export async function getDailySummary(): Promise<
  { error?: string; source?: string } & DailySummaryResult
> {
  try {
    const result = await prisma.user.findFirst({
      where: {
        email: "pritam.das.santuxd@gmail.com",
      },
      select: {
        digests: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            articles: {
              select: {
                id: true,
                url: true,
                title: true,
                publishedAt: true,
                oneLine: true,
              },
            },
            headline: true,
            topic: {
              select: {
                name: true,
              },
            },
            conflict: true,
          },
        },
        name: true,
      },
    });

    if (!result) {
      return {
        error: "No demo user found",
      };
    }

    const lastDigest = result?.digests[0];

    if (!lastDigest) {
      return {
        error: `No digest found for this user: ${result.name}`,
      };
    }

    const articles = await Promise.all(
      lastDigest?.articles.map(async (a) => {
        const sourceName = (await getMetadata(a.url)).data?.publisher!;
        return {
          id: a.id,
          title: a.title,
          source: sourceName,
          publishedAt: a.publishedAt,
          initials: getInitials(sourceName),
        };
      }),
    );

    return {
      data: {
        topic: lastDigest?.topic.name!,
        headline: lastDigest?.headline!,
        articles,
        conflict: lastDigest?.conflict!,
        summaryPoints: lastDigest?.articles.map((a) => a.oneLine) ?? [],
      },
    };
  } catch (err) {
    const message = errorDecoder(err);
    console.error(message);

    return {
      error: message,
    };
  }
}
