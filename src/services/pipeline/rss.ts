import Parser from "rss-parser";
import { ArticleType, extractContent } from "@/utils/extractor";
import { promiseResolver } from "@/utils/resolver";
import { SUGGESTED_TOPICS } from "@/constants/constants";

export async function rssScraper(topic: string) {
  const source = SUGGESTED_TOPICS.find((t) => t.name === topic)?.sources.find(
    (s) => s.type === "rss",
  );
  const parser = new Parser();
  const feed = await parser.parseURL(source!.value);

  const articlePromises: PromiseSettledResult<ArticleType | null>[] =
    await Promise.allSettled(
      feed.items.map(async (f: any) => await extractContent(f.link!)),
    );
  const resolvedArticles = promiseResolver(articlePromises);

  return resolvedArticles;
}

rssScraper("https://www.technologyreview.com/feed/");
