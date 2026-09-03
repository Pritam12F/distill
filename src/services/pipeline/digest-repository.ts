import { prisma } from "@/lib/prisma";
import { synthesisSchema } from "./digest-generator";
import z from "zod";
import { hashUrl } from "./hasher";
import { promiseResolver } from "@/utils/resolver";
import { Prisma } from "@prisma/client";

export type DigestType = z.infer<typeof synthesisSchema>;

export type AddDigestsResult = {
  digestCount: number;
  articleCount: number;
  digests: {
    id: string;
    headline: string;
    topicId: string;
    createdAt: Date;
    consensus: string;
    signal: string;
    conflict: string | null;
    topic: {
      id: string;
      name: string;
      userId: string;
      sources: Prisma.JsonValue;
      createdAt: Date;
      updatedAt: Date;
    };
    articles: {
      id: string;
      title: string;
      url: string;
    }[];
  }[];
};

export async function addDigestsToRepo(
  userId: string,
  digests: (Omit<DigestType, "articles"> & {
    topic: string;
    topicId: string;
    articles: (DigestType["articles"][number] & {
      publishedAt: Date | string | null;
    })[];
  })[],
){
  // Each digest and its articles are written in their own transaction, so a
  // failure while writing one digest never leaves it half-persisted, and the
  // other digests are unaffected.
  const added = await Promise.allSettled(
    digests.map((d) =>
      prisma.$transaction(async (tx) => {
        const digest = await tx.digest.create({
          data: {
            headline: d.headline,
            consensus: d.consensus,
            conflict: d.conflict,
            signal: d.signal,
            userId,
            topicId: d.topicId,
          },
          select: { id: true, headline: true, topicId: true, createdAt: true, topic: true, consensus: true, conflict: true, signal: true, articles: {
            select: {
              oneLine: true,
              publishedAt: true,
            }
          }},
        });

        const articles = await tx.digestArticle.createManyAndReturn({
          data: d.articles.map((a) => {
            const parsedDate = a.publishedAt ? new Date(a.publishedAt) : null;

            return {
              title: a.title,
              url: a.url,
              oneLine: a.oneLine,
              sourceId: a.id,
              publishedAt:
                parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null,
              digestId: digest.id,
              userId,
            };
          }),
          select: { id: true, title: true, url: true },
        });

        await tx.seenArticle.createMany({
          data: articles.map((a) => ({
            userId,
            urlHash: hashUrl(a.url),
          })),
          skipDuplicates: true,
        });

        return { ...digest, topic: digest.topic.name, articles };
      }),
    ),
  );

  added.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(
        `Failed to persist digest for topic "${digests[i].topic}":`,
        result.reason,
      );
    }
  });

  const addedResolved = promiseResolver(added);

  return {
    digestCount: addedResolved.length,
    articleCount: addedResolved.reduce(
      (total, d) => total + d.articles.length,
      0,
    ),
    digests: addedResolved,
  };
}
