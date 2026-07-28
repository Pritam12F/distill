import Parser from "rss-parser";
import { ArticleType, extractContent } from "@/utils/extractor";
import { promiseResolver } from "@/utils/resolver";

export async function rssScraper(url = "") {
  const parser = new Parser();
  const feed = await parser.parseURL(url);

  const articlePromises: PromiseSettledResult<ArticleType | null>[] =
    await Promise.allSettled(
      feed.items.map(async (f: any) => await extractContent(f.link!)),
    );
  const resolvedArticles = promiseResolver(articlePromises);

  console.log(resolvedArticles.length);

  return resolvedArticles;
}

rssScraper("https://www.technologyreview.com/feed/");
