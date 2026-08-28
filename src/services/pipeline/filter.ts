import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { RELEVANCY_SYSTEM_PROMPT } from "@/constants/prompts";
import { buildRelevancyUserPrompt } from "@/lib/prompt-builder";
import { ArticleWithTopic } from "./deduplicate";
import { z } from "zod";
import { generateObject } from "ai";

const RatingSchema = z.object({
  id: z.string().min(1, "Id should not be empty"),
  score: z.number(),
});

const RatingGenerationSchema = z.array(RatingSchema);

export type RatingType = z.infer<typeof RatingSchema>;
export type RatingGenerationType = z.infer<typeof RatingGenerationSchema>;

export const rateRelevancy = async (
  groups: ArticleWithTopic[],
): Promise<RatingGenerationType> => {
  const isDevMode = process.env.DEV_MODE === "true";

  if (isDevMode) {
    const mockRatings = groups.map((g) => {
      if (g.articles.length === 1) {
        return {
          id: g.articles[0].id,
          score: 1,
        };
      }

      return g.articles.map((a) => ({
        id: a.id,
        score: Math.floor(Math.random() * 11),
      }));
    });

    const flattenedItems = mockRatings.filter((r) => Array.isArray(r)).flat();
    const singleItems = mockRatings.filter((r) => !Array.isArray(r)) as {
      id: string;
      score: number;
    }[];

    return [...singleItems, ...flattenedItems];
  }

  const userPrompt = buildRelevancyUserPrompt(groups);

  try {
    const { object } = await generateObject({
      output: "array",
      model: openai("gpt-5-mini"),
      system: RELEVANCY_SYSTEM_PROMPT,
      prompt: userPrompt,
      schema: RatingSchema,
    });

    return object;
  } catch (e) {
    console.log(e instanceof Error ? e.message : "Error calling openAI");
    throw new Error("Error calling openAI");
  }
};

export const filterArticles = async (
  groups: ArticleWithTopic[],
): Promise<ArticleWithTopic[]> => {
  const SHORTLISTED_PER_TOPIC = 5;
  const LLM_SHORTLISTED_PER_TOPIC = 3;
  const scoredGroups = groups.map((g) => {
    const topicWord = new Set(g.topic.trim().toLocaleLowerCase().split(/\s+/));

    return {
      topic: g.topic,
      articles: g.articles
        .map((a) => {
          let wordCountRelevancy = 0;

          a.title
            ?.trim()
            .toLocaleLowerCase()
            .split(/\s+/)
            .forEach((word) => {
              if (topicWord.has(word)) wordCountRelevancy++;
            });

          a.article
            ?.trim()
            .toLocaleLowerCase()
            .split(/\s+/)
            .forEach((word) => {
              if (topicWord.has(word)) wordCountRelevancy++;
            });

          return {
            ...a,
            keywordRelevancy: wordCountRelevancy,
          };
        })
        .sort((a, b) => b.keywordRelevancy - a.keywordRelevancy),
    };
  });

  const shortlisted = scoredGroups.map((g) => ({
    topic: g.topic,
    articles: g.articles.slice(
      0,
      Math.min(g.articles.length, SHORTLISTED_PER_TOPIC),
    ),
  }));

  const relevancyScoresMap = new Map<string, number>();

  try {
    const results = await rateRelevancy(shortlisted);

    results.forEach((r) => {
      if (r.id != null) {
        relevancyScoresMap.set(r.id, r.score);
      }
    });
  } catch (e) {
    console.error(
      "Relevancy rating failed; falling back to keyword ranking:",
      e instanceof Error ? e.message : e,
    );
  }

  const llmQuotaApplied = shortlisted.map((m) => {
    const articles = m.articles
      .map((a) => ({
        ...a,
        contentRelevancy: relevancyScoresMap.has(a.id)
          ? relevancyScoresMap.get(a.id)
          : 0,
      }))
      .sort((a, b) => b.contentRelevancy! - a.contentRelevancy!);

    return {
      topic: m.topic,
      articles: articles.slice(
        0,
        Math.min(articles.length, LLM_SHORTLISTED_PER_TOPIC),
      ),
    };
  });

  return llmQuotaApplied;
};
