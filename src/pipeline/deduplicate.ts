import { prisma } from "@/lib/prisma";
import stringComparison from "string-comparison";
import { hashUrl } from "./hasher";
import { ArticleType, ArticleWithTopic } from "@/types/pipeline";

export async function removeDuplicates(
  articles: ArticleType[],
  userId: string,
) {
  const seenArticlesFetched = await prisma.seenArticle.findMany({
    where: {
      userId,
    },
    select: {
      urlHash: true,
    },
  });

  // Articles the user has already seen in a previous run — tracked per-user,
  // independent of topic.
  const hashedUrls = new Set(seenArticlesFetched.map((a) => a.urlHash));

  const cos = stringComparison.cosine;

  const results: ArticleWithTopic[] = [];

  for (const article of articles) {
    if (!article.url) continue;

    const urlHash = hashUrl(article.url);

    // Skip anything already shown to the user in a previous run.
    if (hashedUrls.has(urlHash)) continue;

    const topic = article.topic!;

    let foundTopic = results.find((r) => r.topic === topic);

    if (!foundTopic) {
      foundTopic = { topic, articles: [article] };
      results.push(foundTopic);

      continue;
    }

    // Per-topic similarity dedup: compare only against this topic's articles.
    const isDuplicate = foundTopic.articles.some((a) => {
      if (!a.title || !article.title) {
        if (!a.article || !article.article) {
          return false;
        }

        return cos.similarity(a.article, article.article) >= 0.78;
      }

      return cos.similarity(a.title, article.title) >= 0.78;
    });

    if (isDuplicate) continue;

    foundTopic.articles.push(article);
  }

  return results;
}
