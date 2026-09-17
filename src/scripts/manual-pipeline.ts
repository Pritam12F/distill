import "dotenv/config";
import { SUGGESTED_TOPICS } from "@/constants/constants";
import { removeDuplicates } from "../pipeline/deduplicate";
import { synthesiseDigest } from "../pipeline/digest-generator";
import { filterArticles } from "../pipeline/filter";
import { getNewsData } from "../pipeline/scrapers/newsapi";
import { rssScraper } from "../pipeline/scrapers/rss";
import { promiseResolver } from "@/utils/resolver";
import { buildTitlePrompt } from "@/utils/prompt-builder";
import { generateText, Output } from "ai";
import { customOpenAI } from "@/lib/custom-openai";
import { titleSummarySchema } from "@/zod/email";
import { prisma } from "@/lib/prisma";
import { EMAIL_SUBJECT_SYSTEM_PROMPT } from "@/constants/prompts";
import { sendDailyEmail } from "../pipeline/email";
import { v4 as uuid } from "uuid";
import { errorDecoder } from "@/utils/error-decoder";

// Only run after seed script has been run once

export async function manualPipeline() {
  const topics = SUGGESTED_TOPICS.slice(0, 2);

  const topicObjects = topics.map((t) => ({
    name: t.name,
    sources: t.sources.filter((s) => s.type === "rss").map((u) => u.value),
  }));

  prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: {
        email: "pritam.das.santuxd@gmail.com",
      },
      select: {
        email: true,
        name: true,
        id: true,
      },
    });

    const newsApiArticles = await getNewsData(topicObjects);
    const rssArticles = await rssScraper(topicObjects);

    const deduplicated = await removeDuplicates(
      [...newsApiArticles, ...rssArticles],
      user!.id,
    );

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
          topicId: uuid(),
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

    await sendDailyEmail({
      emailTitle: output.name,
      userEmail: user!.email,
      userName: user!.name!,
      digests: resolvedDigests,
      baseUrl: process.env.BASE_URL!,
      date: new Date().toISOString().split("T")[0],
      unsubscribeUrl: "",
    });

    return {
      success: true,
      message: "Test pipeline run successfully",
      emailId: "",
    };
  });
}

manualPipeline()
  .then((r) => {
    console.log("Manual pipeline was run successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error(errorDecoder(err));
    process.exit(1);
  });
