import "dotenv/config";
import { RELEVANCY_SYSTEM_PROMPT } from "@/constants/prompts";
import { buildRelevancyUserPrompt } from "@/utils/prompt-builder";
import { generateText, Output } from "ai";
import { customOpenAI } from "@/lib/custom-openai";
import { ArticleWithTopic } from "@/types/pipeline";
import { RatingSchema } from "@/zod/pipeline";
import { errorDecoder } from "@/utils/error-decoder";

export const rateRelevancy = async (
  groups: ArticleWithTopic[],
): Promise<{ id: string; score: number }[]> => {
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

    const flattenedItems = mockRatings.flatMap((r) => r);

    return flattenedItems;
  }

  const userPrompt = buildRelevancyUserPrompt(groups);

  try {
    const { output } = await generateText({
      model: customOpenAI("gpt-5-nano"),
      system: RELEVANCY_SYSTEM_PROMPT,
      prompt: userPrompt,
      output: Output.object({
        schema: RatingSchema,
      }),
    });

    return output.ratings;
  } catch (e) {
    console.error(errorDecoder(e));
    throw new Error("Error calling openAI");
  }
};

export const filterArticles = async (
  groups: ArticleWithTopic[],
): Promise<ArticleWithTopic[]> => {
  const SHORTLISTED_PER_TOPIC = 5;
  const LLM_SHORTLISTED_PER_TOPIC = 3;

  const keywordShortlisted = groups.map((g) => {
    const topicWords = new Set(g.topic.trim().toLocaleLowerCase().split(/\s+/));

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
              if (topicWords.has(word)) wordCountRelevancy++;
            });

          a.article
            ?.trim()
            .toLocaleLowerCase()
            .split(/\s+/)
            .forEach((word) => {
              if (topicWords.has(word)) wordCountRelevancy++;
            });

          return {
            ...a,
            keywordRelevancy: wordCountRelevancy,
          };
        })
        .sort((a, b) => b.keywordRelevancy - a.keywordRelevancy)
        .slice(0, Math.min(g.articles.length, SHORTLISTED_PER_TOPIC)),
    };
  });

  const relevancyScoresMap = new Map<string, number>();

  try {
    const results = await rateRelevancy(keywordShortlisted);

    results.forEach((r) => {
      relevancyScoresMap.set(r.id, r.score);
    });
  } catch (e) {
    console.error(
      "Relevancy rating failed; falling back to keyword ranking:",
      e instanceof Error ? e.message : e,
    );
  }

  return keywordShortlisted.map((m) => {
    const articles = m.articles
      .map((a) => ({
        ...a,
        contentRelevancy: relevancyScoresMap.get(a.id) ?? 0,
      }))
      .sort((a, b) => b.contentRelevancy - a.contentRelevancy);

    return {
      topic: m.topic,
      articles: articles.slice(
        0,
        Math.min(articles.length, LLM_SHORTLISTED_PER_TOPIC),
      ),
    };
  });
};
