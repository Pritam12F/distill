import { ArticleType } from "@/utils/extractor";
import "dotenv/config";
import { openai } from "@/lib/openai";
import { RELEVANCY_SYSTEM_PROMPT } from "@/constants/prompts";
import { buildRelevancyUserPrompt } from "@/lib/prompt-builder";
import { ArticleWithTopic } from "./deduplicate";

export interface RatingType {
  id: string;
  score: number;
}

export const rateRelevancy = async (
  groups: ArticleWithTopic[],
): Promise<{ ratings: RatingType[] } | string> => {
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

    return {
      ratings: [...flattenedItems, ...singleItems],
    };
  }

  const userPrompt = buildRelevancyUserPrompt(groups);

  try {
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      instructions: RELEVANCY_SYSTEM_PROMPT,
      input: userPrompt,
    });

    return response.output_text;
  } catch (e) {
    console.log(e instanceof Error ? e.message : "Error calling openAI");
    throw new Error("Error calling openAI");
  }
};

export const filterArticles = async (
  groups: ArticleWithTopic[],
  topics: string[],
) => {
  // Total budget just to get a rough idea of
  // articles per topic
  const LLM_BUDGET = 20;
  const DIGEST_BUDGET = 5;
  const TOTAL_ARTICLES = groups.map((g) => g.articles).flat().length;
  const SHORTLISTED_PER_TOPIC = Math.abs(LLM_BUDGET / topics.length);

  // Rearranges the articles array in each group item
  // based on keywordRelevancy field
  // Starting with the highest

  const scoredGroups = groups.map((g) => {
    return {
      topic: g.topic,
      articles: g.articles
        .map((a) => {
          let wordCountRelevancy = 0;

          a.title
            ?.trim()
            .split(" ")
            .forEach((word) => {
              if (g.topic.includes(word.trim())) wordCountRelevancy++;
            });

          a.article
            ?.trim()
            .split(" ")
            .forEach((word) => {
              if (g.topic.includes(word.trim())) wordCountRelevancy++;
            });

          return {
            ...a,
            keywordRelevancy: wordCountRelevancy,
          };
        })
        .sort((a, b) => b.keywordRelevancy - a.keywordRelevancy),
    };
  });

  // Keeps no. of articles limited to quota per topic
  const mostRelevant = scoredGroups.map((g) => ({
    topic: g.topic,
    articles: g.articles.slice(
      0,
      Math.min(SHORTLISTED_PER_TOPIC, g.articles.length),
    ),
  }));

  const countOfShortlistedArticles = mostRelevant
    .map((a) => a.articles)
    .flat().length;

  const trackerSet = new Set<ArticleType>([]);

  if (countOfShortlistedArticles < LLM_BUDGET) {
    const extraSlots = LLM_BUDGET - countOfShortlistedArticles;

    for (let i = 0; i < extraSlots; i++) {
      const highestRatedArticle = mostRelevant
        .map((m) => m.articles)
        .flat()
        .reduce((max, curr) =>
          curr.keywordRelevancy > max.keywordRelevancy ? curr : max,
        );

      trackerSet.add(highestRatedArticle);

      const targetGroup = mostRelevant.find(
        (m) => m.topic === highestRatedArticle.topic,
      );

      targetGroup?.articles.splice(
        targetGroup?.articles.findIndex((a) => a.id === highestRatedArticle.id),
        1,
      );

      mostRelevant.splice(
        mostRelevant.findIndex((m) => m.topic === targetGroup?.topic),
        1,
        targetGroup!,
      );
    }
  }

  const relevancyResponse = await rateRelevancy(mostRelevant);

  const relevancyScores: RatingType[] = (
    typeof relevancyResponse === "string"
      ? JSON.parse(relevancyResponse)
      : relevancyResponse
  ).ratings;

  const withLLMRating = mostRelevant.map((m) => {
    const articles = m.articles.map((a) => ({
      ...a,
      contentRelevancy: relevancyScores.find((r) => r.id === a.id)?.score,
    }));
    return {
      topic: m.topic,
      articles,
    };
  });

  return topArticles.map((a) => ({
    id: a.id,
    title: a.title!,
    url: a.url!,
    content: a.article!,
  }));
};
