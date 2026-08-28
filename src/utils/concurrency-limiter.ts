import { ArticleType } from "./extractor";
import { promiseResolver } from "./resolver";
import { NewsSourceType } from "@/services/pipeline/scrapers/newsapi";

export async function fetchArticlesInBatches(
  sources: NewsSourceType[],
  fetcher: (url: string) => Promise<ArticleType | null>,
  limiter: number,
): Promise<ArticleType[] | null> {
  if (limiter <= 0) return null;
  const results: ArticleType[] = [];
  let currentIndex = 0;

  while (true) {
    const index = currentIndex;

    if (index >= sources.length) break;

    const batch: NewsSourceType[] = [];

    for (let i = index; i < Math.min(index + limiter, sources.length); i++) {
      if (!sources[i]) {
        currentIndex = i + 1;
        break;
      }

      batch.push(sources[i]);

      currentIndex++;
    }

    if (batch.length) {
      const allPromises = await Promise.allSettled(
        batch.map(async (s) => {
          const article = await fetcher(s.url);
          return article
            ? { ...article, topic: s.topic, publishedAt: s.publishedAt }
            : null;
        }),
      );

      const resolvedPromises = promiseResolver(allPromises);

      results.push(...resolvedPromises);
    }
  }

  return results;
}
