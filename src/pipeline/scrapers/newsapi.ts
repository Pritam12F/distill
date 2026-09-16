import { fetchArticlesInBatches } from "./concurrency-limiter";
import { extractContent } from "./extractor";
import { promiseResolver } from "@/utils/resolver";
import axios from "axios";
import { NewsSourceType, TopicsType } from "@/types/pipeline";
import { promiseLogger } from "@/utils/promise-logger";
import { errorDecoder } from "@/utils/error-decoder";

export const CONCURRENCY_LIMIT = 3;

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
    console.error(errorDecoder(error));
    return [];
  }
}

export async function getNewsData(
  topics: Pick<TopicsType, "name" | "sources">[],
) {
  const sourcesPromises = await Promise.allSettled(
    topics.map(async (t) =>
      (await getNewsSources(t.name)).map((s) => ({ ...s, topic: t.name })),
    ),
  );

  promiseLogger(sourcesPromises, "news_source");

  const sources = promiseResolver(sourcesPromises).flat();

  const allArticles = await fetchArticlesInBatches(
    sources,
    extractContent,
    CONCURRENCY_LIMIT,
  );

  return allArticles;
}
