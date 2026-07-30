import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNewsData } from "./newsapi";
import { rssScraper } from "./rss";
import { removeDuplicates } from "./deduplicate";
import { filterArticles } from "./filter";
import { synthesise } from "./digest-generator";
import { hashArticles } from "./hasher";
import { addDigestToRepo } from "./digest-repository";
import { ArticleType } from "@/utils/extractor";

type PipelineOutputType = {
  success: boolean;
  message: string;
};

async function pipeline(topics: string[]): Promise<PipelineOutputType> {
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
      (await getNewsData(t)).map((a) => ({ ...a, topic: t })),
    ),
  );

  const rssArticles: ArticleType[][] = await Promise.all(
    topics.map(async (t) =>
      (await rssScraper(t)).map((a) => ({ ...a, topic: t })),
    ),
  );

  const deduplicated = await removeDuplicates(
    newsAPIArticles.flat(),
    rssArticles.flat(),
  );

  const topArticles = await filterArticles(deduplicated, topics);

  await hashArticles(
    session.user.id,
    topArticles.map((a) => a.url!),
  );

  const digest = await Promise.all(topArticles.map((t)=>t.));

  const digestRepo = await addDigestToRepo(session.session.id, digest);
}
