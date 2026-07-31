import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNewsData } from "./newsapi";
import { rssScraper } from "./rss";
import { removeDuplicates } from "./deduplicate";
import { filterArticles } from "./filter";
import { synthesiseDigest } from "./digest-generator";
import { hashArticles } from "./hasher";
import { addDigestsToRepo, DigestType } from "./digest-repository";
import { ArticleType } from "@/utils/extractor";

type PipelineOutputType = {
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

export async function pipeline(
  topics: { name: string; id: string }[],
): Promise<PipelineOutputType | (PipelineOutputType & DigestRepoType)> {
  if (!topics.length) {
    return {
      success: false,
      message: "No topic provided",
    };
  }

  if (topics.length > 5)
    return {
      success: false,
      message: "No of topics selected greater than 5",
    };

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "User is not authenticated",
    };
  }

  const newsAPIArticles: ArticleType[][] = await Promise.all(
    topics.map(async (t) =>
      (await getNewsData(t.name)).map((a) => ({ ...a, topic: t.name })),
    ),
  );

  const rssArticles: ArticleType[][] = await Promise.all(
    topics.map(async (t) =>
      (await rssScraper(t.name)).map((a) => ({ ...a, topic: t.name })),
    ),
  );

  const deduplicated = await removeDuplicates(
    newsAPIArticles.flat(),
    rssArticles.flat(),
  );

  const topArticles = await filterArticles(deduplicated);

  const topicIdByName = new Map(topics.map((t) => [t.name, t.id]));

  const digests: (DigestType & { topic: string; topicId: string })[] =
    await Promise.all(
      topArticles.map(async (a) => {
        const generated = await synthesiseDigest(
          a.topic,
          a.articles.map((a) => ({
            id: a.id,
            title: a.title!,
            url: a.url!,
            content: a.article,
          })),
        );

        return {
          topic: a.topic,
          topicId: topicIdByName.get(a.topic)!,
          ...generated,
        };
      }),
    );

  const digestRepo = await addDigestsToRepo(session.session.id, digests);

  await hashArticles(
    session.user.id,
    digestRepo.digests
      .map((a) => a.articles)
      .flat()
      .map((a) => a.url),
  );

  return {
    ...digestRepo,
    success: true,
    message: "Digest was added to DB successfully",
  };
}
