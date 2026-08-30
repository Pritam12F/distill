import { prisma } from "@/lib/prisma";
import { ArticleType } from "@/utils/extractor";
import stringComparison from "string-comparison";
import { hashUrl } from "./hasher";

export type ArticleWithTopic = {
  topic: string;
  articles: ArticleType[];
};

export async function removeDuplicates(
  articles: ArticleType[],
  userId?: string,
) {
  const seenArticlesFetched = userId
    ? await prisma.seenArticle.findMany({
        where: {
          userId,
        },
      })
    : [];

  // Articles the user has already seen in a previous run — tracked per-user,
  // independent of topic.
  const hashedUrls = new Set(seenArticlesFetched.map((a) => a.urlHash));

  const cos = stringComparison.cosine;

  const results: ArticleWithTopic[] = [];

  // URLs already taken within each topic, keyed by topic. Dedup is per-topic,
  // so the same article can still appear under a different topic.
  const urlsByTopic = new Map<string, Set<string>>();

  for (const article of articles) {
    if (!article.url) continue;

    const urlHash = hashUrl(article.url);

    // Skip anything already shown to the user in a previous run.
    if (hashedUrls.has(urlHash)) continue;

    const topic = article.topic!;

    let foundTopic = results.find((r) => r.topic === topic);

    if (!foundTopic) {
      foundTopic = { topic, articles: [] };
      results.push(foundTopic);
      urlsByTopic.set(topic, new Set());
    }

    const topicUrls = urlsByTopic.get(topic)!;

    // Per-topic URL dedup: the same URL twice within one topic is dropped.
    if (topicUrls.has(urlHash)) continue;

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

    topicUrls.add(urlHash);
    foundTopic.articles.push(article);
  }

  return results;
}
