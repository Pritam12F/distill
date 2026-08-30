import "dotenv/config";
import { SUGGESTED_TOPICS } from "@/constants/constants";
import { removeDuplicates } from "@/services/pipeline/deduplicate";
import { synthesiseDigest } from "@/services/pipeline/digest-generator";
import { filterArticles } from "@/services/pipeline/filter";
import { getNewsData } from "@/services/pipeline/scrapers/newsapi";
import { rssScraper } from "@/services/pipeline/scrapers/rss";
import { promiseResolver } from "@/utils/resolver";

export async function manualPipeline() {
  const topics = SUGGESTED_TOPICS.slice(0, 2);

  const topicObjects = topics.map((t) => ({
    name: t.name,
    rssSources: t.sources.filter((s) => s.type === "rss").map((u) => u.value),
  }));

  const newsApiArticles = (await getNewsData([...topicObjects])) ?? [];
  const rssArticles = (await rssScraper([...topicObjects])) ?? [];

  const deduplicated = await removeDuplicates([
    ...newsApiArticles,
    ...rssArticles,
  ]);

  const filteredArticles = await filterArticles(deduplicated);

  if (!filterArticles.length) {
    console.error("No articles left after filtration");

    return {
      success: false,
      message: "No articles left after filtration",
    };
  }

  const digests = await Promise.allSettled(
    filteredArticles.map(async (f) => {
      return await synthesiseDigest(
        f.topic,
        f.articles.map((art) => ({
          id: art.id,
          title: art.title ?? "",
          url: art.url!,
          content: art.article,
        })),
      );
    }),
  );

  digests.forEach((d) => {
    if (d.status === "rejected") {
      console.error("Synthesize error: ", d.reason);
    }
  });

  const resolvedDigests = promiseResolver(digests);

  if (!resolvedDigests.length) {
    return {
      success: false,
      message:
        "No digests to create — all articles were filtered out, already seen, or synthesis failed.",
    };
  }
}
