"use server";

import { prisma } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";
import { DigestArticle } from "@prisma/client";

export async function getDailySummary(): Promise<{
  error?: string;
  data?: {
    topic: string;
    articles: Pick<DigestArticle, "url" | "publishedAt" | "title">[];
    conflict: string;
    headline: string;
    summaryPoints: string[];
  };
}> {
  try {
    const result = await prisma.user.findFirst({
      where: {
        email: "test_user@devzy.live",
      },
      select: {
        digests: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            articles: {
              select: {
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
      },
    });

    const lastDigest = result?.digests[0];

    return {
      data: {
        topic: lastDigest?.topic.name!,
        headline: lastDigest?.headline!,
        articles:
          lastDigest?.articles.map((a) => ({
            ...a,
            oneLine: undefined,
          })) ?? [],
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
