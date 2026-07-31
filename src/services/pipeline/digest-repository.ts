import { prisma } from "@/lib/prisma";
import { synthesisSchema } from "./digest-generator";
import z from "zod";

export type DigestType = z.infer<typeof synthesisSchema>;

export async function addDigestsToRepo(
  userId: string,
  digests: (DigestType & { topic: string; topicId: string })[],
) {
  // Each digest and its articles are written in their own transaction, so a
  // failure while writing one digest never leaves it half-persisted, and the
  // other digests are unaffected.
  const added = await Promise.all(
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
          select: { id: true, headline: true, topicId: true },
        });

        const articles = await tx.digestArticle.createManyAndReturn({
          data: d.articles.map((a) => ({
            title: a.title,
            url: a.url,
            oneLine: a.oneLine,
            sourceId: a.id,
            digestId: digest.id,
            userId,
          })),
          select: { id: true, title: true, url: true },
        });

        return { ...digest, articles };
      }),
    ),
  );

  return {
    digestCount: added.length,
    articleCount: added.reduce((total, d) => total + d.articles.length, 0),
    digests: added.map((d) => ({
      id: d.id,
      headline: d.headline,
      topicId: d.topicId,
      articles: d.articles,
    })),
  };
}
