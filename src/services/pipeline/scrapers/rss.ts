import Parser from "rss-parser";
import { fetchArticlesInBatches } from "@/utils/concurrency-limiter";
import { CONCURRENCY_LIMIT } from "./newsapi";
import { TopicsType } from "..";
import { extractContent } from "@/utils/extractor";
import { promiseResolver } from "@/utils/resolver";

// Cap how many items we pull from each feed so one large feed can't blow up
// the number of full-page fetches — filtering keeps only a few per topic anyway.
const MAX_ITEMS_PER_FEED = 8;

export async function rssScraper(topics: TopicsType[]) {
  const parser = new Parser();

  const perTopicSources = await Promise.allSettled(
    topics.map(async (t) => {
      const sources = t.sources!;

      const parsedFeeds = await Promise.allSettled(
        sources.map((f) => parser.parseURL(f)),
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
