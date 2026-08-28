import Parser from "rss-parser";
import { SUGGESTED_TOPICS } from "@/constants/constants";
import { fetchArticlesInBatches } from "@/utils/concurrency-limiter";
import { CONCURRENCY_LIMIT } from "./newsapi";
import { TopicsType } from "..";
import { extractContent } from "@/utils/extractor";
import { promiseResolver } from "@/utils/resolver";

// Cap how many items we pull from each feed so one large feed can't blow up
// the number of full-page fetches — filtering keeps only a few per topic anyway.
const MAX_ITEMS_PER_FEED = 10;

export async function rssScraper(topics: TopicsType[]) {
  const parser = new Parser();

  const perTopicSources = await Promise.allSettled(
    topics.map(async (t) => {
      const sources =
        SUGGESTED_TOPICS.find((s) => s.name === t.name)?.sources.filter(
          (s) => s.type === "rss",
        ) ?? [];

      const parsedFeeds = await Promise.allSettled(
        sources.map((f) => parser.parseURL(f.value)),
      );

      // Keep each item's topic so it survives the fetch and grouping downstream.
      return promiseResolver(parsedFeeds).flatMap((feed) =>
        feed.items
          .filter((item) => item.link)
          .slice(0, MAX_ITEMS_PER_FEED)
          .map((item) => ({
            url: item.link!,
            topic: t.name,
            publishedAt: item.isoDate,
          })),
      );
    }),
  );

  const sources = promiseResolver(perTopicSources).flat();

  const articles = await fetchArticlesInBatches(
    sources,
    extractContent,
    CONCURRENCY_LIMIT,
  );

  return articles;
}
