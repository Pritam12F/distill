import { removeDuplicates } from "./deduplicate";
import { filterArticles } from "./filter";
import { synthesiseDigest } from "./digest-generator";
import { addDigestsToRepo } from "./digest-repository";
import { prisma } from "@/lib/prisma";
import { getArticles } from "./scrapers";
import { promiseResolver } from "@/utils/resolver";
import { sendDailyEmail } from "./email";
import { User } from "@prisma/client";
import { buildTitlePrompt } from "@/lib/prompt-builder";
import { generateText, Output } from "ai";
import { customOpenAI } from "@/lib/custom-openai";
import { titleSummarySchema } from "@/zod/api";

type PipelineMessageType = {
  success: boolean;
  message: string;
};

type DigestRepoType = {
  digestCount: number;
  articleCount: number;
  digests: {
    id: string;
    headline: string;
    topicId: string;
    articles: {
      id: string;
      title: string;
      url: string;
    }[];
  }[];
};

export type TopicsType = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  name: string;
  sources?: string[];
};

type PiplelineFinalOutput =
  | PipelineMessageType
  | (PipelineMessageType & DigestRepoType)[];

export async function pipeline() {
  const users = await prisma.user.findMany({
    select: { id: true, topics: true },
  });

  const allUserDigests = await Promise.allSettled(
    users.map(async (u) => await core(u.topics, u)),
  );

  allUserDigests.forEach((d) => {
    if (d.status === "rejected") {
      console.error(d.reason);
    }
  });

  const allUserDigestsResolved = promiseResolver(allUserDigests);

  return allUserDigestsResolved as PiplelineFinalOutput;
}

async function core(topics: TopicsType[], user: Partial<User>) {
  try {
    const articles = await getArticles(topics);

    const deduplicated = await removeDuplicates(articles, user.id);

    const topArticles = await filterArticles(deduplicated);

    const topicIdByName = new Map(topics.map((t) => [t.name, t.id]));

    const digests = await Promise.allSettled(
      topArticles.map(async (a) => {
        if (a.articles.length) {
          const generated = await synthesiseDigest(
            a.topic,
            a.articles.map((art) => ({
              id: art.id,
              title: art.title!,
              url: art.url!,
              content: art.article,
            })),
          );

          // publishedAt is source metadata (not produced by the LLM), so join
          // it back onto each synthesised article by its source id.
          const publishedAtById = new Map(
            a.articles.map((art) => [art.id, art.publishedAt ?? null]),
          );

          return {
            topicId: topicIdByName.get(a.topic)!,
            ...generated,
            articles: generated.articles.map((art) => ({
              ...art,
              publishedAt: publishedAtById.get(art.id) ?? null,
            })),
          };
        }
      }),
    );

    digests.forEach((d, i) => {
      if (d.status === "rejected") {
        console.error(
          `Synthesis failed for topic "${topArticles[i].topic}":`,
          d.reason,
        );
      }
      else if(d.status==="fulfilled"){
        console.log(`Synthesis succeeded for topic "${topArticles[i].topic}" ✅`)
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

    const digestRepo = await addDigestsToRepo(user.id!, resolvedDigests);
    const userPrompt = buildTitlePrompt(digestRepo.digests);
    const structured = digestRepo.digests.map((d)=>({ topic: d.topic, topicId: d.topicId, headline: d.headline, consensus: d.consensus, signal: d.signal, articles: d.articles, conflict: d.conflict }));

    const { output } = await generateText({
      model: customOpenAI("gpt-5-nano"),
      system: userPrompt,
      prompt: buildTitlePrompt(digestRepo.digests),
      output: Output.object({
        schema: titleSummarySchema,
      })
    });

    try{
      await sendDailyEmail({ userName: user.name!, emailTitle: output.name, digests: structured, unsubscribeUrl: "", baseUrl: 'localhost:3000', date: "", topic: '' });

      console.log("Email sent successfully");

    } catch(err) {
      console.error("Error sending email");
    }

    if(!digestRepo.digestCount) {
      return {
        success: false,
        message: "Failed to save any digests to the database.",
      };
    }

    return {
      ...digestRepo,
      success: true,
      message: "Digest was added to DB successfully",
    };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unknown pipeline error occured";

    console.error(message);

    return {
      success: false,
      message,
    };
  }
}
