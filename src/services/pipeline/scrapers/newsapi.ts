import { fetchArticlesInBatches } from "@/utils/concurrency-limiter";
import { extractContent } from "@/utils/extractor";
import { promiseResolver } from "@/utils/resolver";
import axios from "axios";
import { TopicsType } from "..";

export const CONCURRENCY_LIMIT = 5;

export type NewsSourceType = {
  title?: string;
  url: string;
  publishedAt?: Date | string;
  source?: string;
  topic?: string;
};

export async function getNewsSources(
  searchTerm = "artificial intelligence",
): Promise<NewsSourceType[]> {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/search?q=${encodeURIComponent(searchTerm)}&api-key=${process.env.GUARDIAN_API_KEY ?? "test"}`,
    );
    const results = response.data.response.results;

    return results.map((a: any) => ({
      title: a.webTitle,
      url: a.webUrl,
      publishedAt: a.webPublicationDate,
      source: "The Guardian",
    }));
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "unknown error",
    );
    return [];
  }
}

export async function getNewsData(topics: TopicsType[]) {
  const sourcesPromises = await Promise.allSettled(
    topics.map(async (t) =>
      (await getNewsSources(t.name)).map((s) => ({ ...s, topic: t.name })),
    ),
  );

  const sources = promiseResolver(sourcesPromises).flat();

  const allArticles = await fetchArticlesInBatches(
    sources,
    extractContent,
    CONCURRENCY_LIMIT,
  );

  return allArticles;
}
