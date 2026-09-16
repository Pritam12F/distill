import { TopicsType } from "@/types/pipeline";
import { getNewsData } from "./newsapi";
import { rssScraper } from "./rss";

export async function getArticles(topics: TopicsType[]) {
  // Fetch news and RSS independently so a failure in one source doesn't lose
  // the other.
  const newsAPIArticles = await getNewsData(topics);
  const rssArticles = await rssScraper(topics);

  return [...newsAPIArticles, ...rssArticles];
}
