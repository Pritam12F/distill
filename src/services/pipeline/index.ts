import { removeDuplicates } from "./deduplicate";
import { filterArticles } from "./filter";
import { synthesiseDigest } from "./digest-generator";
import { addDigestsToRepo } from "./digest-repository";
import { prisma } from "@/lib/prisma";
import { getArticles } from "./scrapers";
import { promiseResolver } from "@/utils/resolver";

type PipelineMessageType = {
  success: boolean;
  message: string;
};

type DigestRepoType = {
  digestCount: number;
  articleCount: number;
  digests: {
    id: string;
    headline: string;
    topicId: string;
    articles: {
      id: string;
      title: string;
      url: string;
    }[];
  }[];
};

export type TopicsType = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  name: string;
  sources?: string[];
};

type PiplelineFinalOutput =
  | PipelineMessageType
  | (PipelineMessageType & DigestRepoType)[];

export async function pipeline() {
  const users = await prisma.user.findMany({
    select: { id: true, topics: true },
  });

  const allUserDigests = await Promise.allSettled(
    users.map(async (u) => await core(u.topics, u.id)),
  );

  allUserDigests.forEach((d) => {
    if (d.status === "rejected") {
      console.error(d.reason);
    }
  });

  const allUserDigestsResolved = promiseResolver(allUserDigests);

  return allUserDigestsResolved as PiplelineFinalOutput;
}

async function core(topics: TopicsType[], userId: string) {
  try {
    const articles = await getArticles(topics);

    const deduplicated = await removeDuplicates(articles, userId);

    const topArticles = await filterArticles(deduplicated);

    const topicIdByName = new Map(topics.map((t) => [t.name, t.id]));

    const digests = await Promise.allSettled(
      topArticles.map(async (a) => {
        if (a.articles.length) {
          const generated = await synthesiseDigest(
            a.topic,
            a.articles.map((art) => ({
              id: art.id,
              title: art.title!,
              url: art.url!,
              content: art.article,
            })),
          );

          // publishedAt is source metadata (not produced by the LLM), so join
          // it back onto each synthesised article by its source id.
          const publishedAtById = new Map(
            a.articles.map((art) => [art.id, art.publishedAt ?? null]),
          );

          return {
            topic: a.topic,
            topicId: topicIdByName.get(a.topic)!,
            ...generated,
            articles: generated.articles.map((art) => ({
              ...art,
              publishedAt: publishedAtById.get(art.id) ?? null,
            })),
          };
        }
      }),
    );

    digests.forEach((d, i) => {
      if (d.status === "rejected") {
        console.error(
          `Synthesis failed for topic "${topArticles[i].topic}":`,
          d.reason,
        );
      }
    });

    const resolvedDigests = promiseResolver(digests);

    if (!resolvedDigests.length) {
      return {
        success: false,
        message:
          "No digests to create — all articles were filtered out, already seen, or synthesis failed.",
      };
    }

    const digestRepo = await addDigestsToRepo(userId, resolvedDigests);

    if (!digestRepo.digestCount) {
      return {
        success: false,
        message: "Failed to save any digests to the database.",
      };
    }

    return {
      ...digestRepo,
      success: true,
      message: "Digest was added to DB successfully",
    };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unknown pipeline error occured";

    console.error(message);

    return {
      success: false,
      message,
    };
  }
}
