import "dotenv/config";
import { SUGGESTED_TOPICS } from "@/constants/constants";
import { removeDuplicates } from "@/services/pipeline/deduplicate";
import { synthesiseDigest } from "@/services/pipeline/digest-generator";
import { filterArticles } from "@/services/pipeline/filter";
import { getNewsData } from "@/services/pipeline/scrapers/newsapi";
import { rssScraper } from "@/services/pipeline/scrapers/rss";
import { promiseResolver } from "@/utils/resolver";
import { sendDailyEmail } from "@/services/pipeline/email";
import { buildTitlePrompt } from "@/lib/prompt-builder";
import { generateText, Output } from "ai";
import { customOpenAI } from "@/lib/custom-openai";
import { titleSummarySchema } from "@/zod/api";

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
        "No digests to create — all articles were filtered out, already seen, or synthesis failed."
    };
  }

  const emailTitlePrompt = buildTitlePrompt(resolvedDigests);

  const { output } = await generateText({
      model: customOpenAI("gpt-5-nano"),
      system: emailTitlePrompt,
      prompt: buildTitlePrompt(resolvedDigests.map((d)=>({ topic: d.topic, headline: d.headline }))),
      output: Output.object({
        schema: titleSummarySchema,
      })
  });

  const emailSent = await sendDailyEmail({
  userName: "Maya",
  date: "Tuesday, 16 September 2025",
  emailTitle: output.name,
  baseUrl: "https://distill.news",
  topic: "AI & Technology",
  unsubscribeUrl: "https://distill.news/unsubscribe",
  digests: [
    {
      topic: "AI & Technology",
      topicId: "ai-technology",
      headline: "AI agents are moving from demos into the daily workflow.",
      consensus:
        "The latest releases focus less on spectacle and more on dependable, repeatable work across the tools people already use.",
      conflict:
        "Benchmarks remain inconsistent: early adopters report big gains, while independent tests show results vary by task and setup.",
      signal:
        "The durable story is integration. The winners will be the products that make delegation feel ordinary, not magical.",
      articles: [
        {
          id: "1",
          title: "The new shape of AI work",
          url: "https://example.com/ai-work",
          oneLine: "Why utility is becoming the defining product feature.",
          publishedAt: "2025-09-16",
        },
        {
          id: "2",
          title: "Inside the agent platform race",
          url: "https://example.com/agents",
          oneLine: "Platforms are competing on reliability and reach.",
          publishedAt: null,
        },
      ],
    },
    {
      topic: "Climate",
      topicId: "climate",
      headline: "Clean energy is scaling, but the grid is the bottleneck.",
      consensus:
        "Investment and deployment are accelerating across solar, storage, and transmission projects worldwide.",
      conflict: null,
      signal:
        "Watch permitting and grid interconnection queues: that is where the next decade of progress will be won or delayed.",
      articles: [
        {
          id: "3",
          title: "The grid upgrade nobody can skip",
          url: "https://example.com/grid",
          oneLine: "Transmission is now the climate infrastructure story.",
          publishedAt: "2025-09-16",
        },
      ],
    },
  ],
  });

  return {
    success: true,
    message: "Test pipeline run successfully",
    emailId: emailSent.data?.id,
  }
}
