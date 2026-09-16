import { promiseResolver } from "@/utils/resolver";
import { ArticleType, NewsSourceType } from "@/types/pipeline";
import { promiseLogger } from "@/utils/promise-logger";

export async function fetchArticlesInBatches(
  sources: NewsSourceType[],
  fetcher: (url: string) => Promise<ArticleType | null>,
  limiter: number,
): Promise<ArticleType[]> {
  if (limiter <= 0) return [];
  const results: ArticleType[] = [];
  let currentIndex = 0;

  while (true) {
    const index = currentIndex;

    if (index >= sources.length) break;

    const batch: NewsSourceType[] = [];

    for (let i = index; i < Math.min(index + limiter, sources.length); i++) {
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

      promiseLogger(allPromises, "article");

      const resolvedPromises = promiseResolver(allPromises);

      results.push(...resolvedPromises);
    }
  }

  return results;
}
