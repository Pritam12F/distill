import "dotenv/config";
import { SUGGESTED_TOPICS } from "@/constants/constants";
import { removeDuplicates } from "@/services/pipeline/deduplicate";
import { synthesiseDigest } from "@/services/pipeline/digest-generator";
import { filterArticles } from "@/services/pipeline/filter";
import { getNewsData } from "@/services/pipeline/scrapers/newsapi";
import { rssScraper } from "@/services/pipeline/scrapers/rss";
import { promiseResolver } from "@/utils/resolver";
import { buildTitlePrompt } from "@/lib/prompt-builder";
import { generateText, Output } from "ai";
import { customOpenAI } from "@/lib/custom-openai";
import { titleSummarySchema } from "@/zod/api";
import { prisma } from "@/lib/prisma";
import { EMAIL_SUBJECT_SYSTEM_PROMPT } from "@/constants/prompts";
import { sendDailyEmail } from "@/services/pipeline/email";

export async function manualPipeline() {
  const topics = SUGGESTED_TOPICS.slice(0, 2);

  const topicObjects = topics.map((t) => ({
    name: t.name,
    rssSources: t.sources.filter((s) => s.type === "rss").map((u) => u.value),
  }));

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          email: "pritam@distill.local",
        },
        {
          email: "maya@distill.local",
        },
      ],
    },
    select: {
      email: true,
      name: true,
    },
  });

  const newsApiArticles = (await getNewsData(topicObjects)) ?? [];
  const rssArticles = (await rssScraper(topicObjects)) ?? [];

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
      const digest = await synthesiseDigest(
        f.topic,
        f.articles.map((art) => ({
          id: art.id,
          title: art.title ?? "",
          url: art.url!,
          content: art.article,
        })),
      );

      return {
        ...digest,
        topic: f.topic,
        topicId: String(Math.floor(Math.random() * 11)),
      };
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

  const emailTitlePrompt = buildTitlePrompt(resolvedDigests);

  const { output } = await generateText({
    model: customOpenAI("gpt-5-nano"),
    system: EMAIL_SUBJECT_SYSTEM_PROMPT,
    prompt: emailTitlePrompt,
    output: Output.object({
      schema: titleSummarySchema,
    }),
  });

  await Promise.all(
    users.map(async (u) => {
      return await sendDailyEmail({
        emailTitle: output.name,
        userEmail: u.email,
        userName: u.name!,
        digests: resolvedDigests,
        baseUrl: process.env.BASE_URL!,
        date: new Date().toISOString().split("T")[0],
        unsubscribeUrl: "",
      });
    }),
  );

  return {
    success: true,
    message: "Test pipeline run successfully",
    emailId: "",
  };
}
