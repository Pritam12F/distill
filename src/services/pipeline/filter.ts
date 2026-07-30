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

function populateRest(
  shortlisted: ArticleWithTopic[],
  remaining: ArticleWithTopic[],
  difference: number,
) {
  let result: ArticleWithTopic[] = [];
  let rest = [...remaining];

  for (let i = 0; i < difference; i++) {
    const allArticles = rest.map((a) => a.articles).flat();

    const relevantArticle = allArticles.reduce(
      (max, curr) =>
        curr.keywordRelevancy! > max.keywordRelevancy! ? curr : max,
      allArticles[0],
    );

    rest = rest.map((r) =>
      r.topic === relevantArticle.topic
        ? {
            topic: r.topic,
            articles: r.articles.filter((a) => a.id !== relevantArticle.id),
          }
        : r,
    );

    const index = shortlisted.findIndex(
      (s) => s.topic === relevantArticle.topic,
    );

    if (i === 0) {
      result = shortlisted.map(({ articles, topic }, i) =>
        index === i
          ? { topic, articles: articles.concat(relevantArticle) }
          : { topic, articles },
      );

      continue;
    }

    result = result.map((item, i) =>
      index === i
        ? {
            topic: item.topic,
            articles: item.articles.concat(relevantArticle),
          }
        : item,
    );
  }

  return result;
}

//Function to shortlist exactly upto the LLM Budget
function shortlist(
  scoredArticles: ArticleWithTopic[],
  shortlistQuota: number,
  totalBudget: number,
) {
  const remainingArticles: ArticleWithTopic[] = [];

  const firstRoundArticles = scoredArticles.map((a) => {
    const shortlisted = a.articles.slice(0, shortlistQuota);
    const remaining = a.articles.slice(shortlistQuota, a.articles.length);

    if (remaining.length) {
      remainingArticles.push({
        topic: remaining[0].topic!,
        articles: remaining,
      });
    }

    return {
      topic: a.topic,
      articles: shortlisted,
    };
  });

  const numberOfArticles = firstRoundArticles
    .map((a) => a.articles)
    .flat().length;

  if (numberOfArticles < totalBudget) {
    const difference = totalBudget - numberOfArticles;

    return populateRest(firstRoundArticles, remainingArticles, difference);
  }

  return firstRoundArticles;
}

function restrictToQuota(
  topics: string[],
  LLM_BUDGET: number,
  DIGEST_BUDGET: number,
  withLLMRating: ArticleWithTopic[],
) {
  switch (topics.length) {
    case 1:
      return withLLMRating[0].articles.slice(0, DIGEST_BUDGET);
    case 2: {
      const [firstTopic, secondTopic] = withLLMRating.map((w) =>
        w.articles.slice(0, LLM_BUDGET / 2),
      );

      const firstTopicOption = withLLMRating[0].articles[2];
      const secondTopicOption = withLLMRating[1].articles[2];

      return firstTopicOption.contentRelevancy! >=
        secondTopicOption.contentRelevancy!
        ? [...firstTopic, ...secondTopic, firstTopicOption]
        : [...firstTopic, ...secondTopic, secondTopicOption];
    }

    case 3: {
      const firstChoiceArticles = withLLMRating.map((t) => t.articles[0]);
      const nextHighestRatingArticles = withLLMRating
        .map((t) => t.articles[1])
        .sort((a, b) => b.contentRelevancy! - a.contentRelevancy!)
        .slice(0, 2);

      return [...firstChoiceArticles, ...nextHighestRatingArticles];
    }

    case 4: {
      const firstChoiceArticles = withLLMRating.map((t) => t.articles[0]);

      const extraArticle = withLLMRating
        .map((t) => t.articles[1])
        .sort((a, b) => b.contentRelevancy! - a.contentRelevancy!)
        .slice(0, 2);

      return [...firstChoiceArticles, ...extraArticle];
    }

    case 5: {
      const firstChoiceArticles = withLLMRating.map((t) => t.articles[0]);

      return firstChoiceArticles;
    }
  }
}

export const filterArticles = async (
  groups: ArticleWithTopic[],
  topics: string[],
) => {
  // Total budget just to get a rough idea of
  // articles per topic
  const LLM_BUDGET = 20;
  const DIGEST_BUDGET = 5;
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

  const shortlisted = shortlist(
    scoredGroups,
    SHORTLISTED_PER_TOPIC,
    LLM_BUDGET,
  );

  const relevancyResponse = await rateRelevancy(shortlisted);

  const relevancyScores: RatingType[] = (
    typeof relevancyResponse === "string"
      ? JSON.parse(relevancyResponse)
      : relevancyResponse
  ).ratings;

  const withLLMRating = shortlisted.map((m) => {
    const articles = m.articles.map((a) => ({
      ...a,
      contentRelevancy: relevancyScores.find((r) => r.id === a.id)?.score,
    }));

    return {
      topic: m.topic,
      articles,
    };
  });

  const finalQuotaApplied = restrictToQuota(
    topics,
    LLM_BUDGET,
    DIGEST_BUDGET,
    withLLMRating,
  )!;

  return finalQuotaApplied;
};
