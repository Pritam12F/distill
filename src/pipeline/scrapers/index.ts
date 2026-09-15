import { TopicsType } from "..";
import { getNewsData } from "./newsapi";
import { rssScraper } from "./rss";

export async function getArticles(topics: TopicsType[]) {
  // Fetch news and RSS independently so a failure in one source doesn't lose
  // the other.
  const newsAPIArticles =
    (await getNewsData(topics).catch((e) => {
      console.error("News fetch failed:", e instanceof Error ? e.message : e);
      return [];
    })) ?? [];

  const rssArticles =
    (await rssScraper(topics).catch((e) => {
      console.error("RSS fetch failed:", e instanceof Error ? e.message : e);
      return [];
    })) ?? [];

  return [...newsAPIArticles, ...rssArticles];
}
