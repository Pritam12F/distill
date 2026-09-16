"use server";

import { prisma } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";
import { DailySummaryResult } from "@/types/digest";
import { DigestArticle } from "@prisma/client";

export async function getDailySummary(): Promise<DailySummaryResult> {
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
        articles: lastDigest?.articles as Pick<
          DigestArticle,
          "url" | "publishedAt" | "title"
        >[],
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
