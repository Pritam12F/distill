import { ArticleType } from "@/utils/extractor";
import stringComparison from "string-comparison";

export type ArticleWithTopic = {
  topic: string;
  articles: ArticleType[];
};

export async function removeDuplicates(
  newsSources: ArticleType[],
  rssSources: ArticleType[],
) {
  const cos = stringComparison.cosine;

  const results: ArticleWithTopic[] = [];

  const allSources: ArticleType[] = [...newsSources, ...rssSources];

  for (let i = 0; i < allSources.length; i++) {
    const foundTopic = results.find((r) => r.topic === allSources[i].topic);

    if (!foundTopic) {
      results.push({
        topic: allSources[i].topic!,
        articles: [{ ...allSources[i] }],
      });

      continue;
    }

    if (
      foundTopic.articles.some(
        (a) => cos.similarity(a.title!, allSources[i].title!) >= 0.85,
      )
    ) {
      continue;
    }

    foundTopic.articles.push(allSources[i]);

    results.splice(
      results.findIndex((r) => r.topic === foundTopic.topic),
      1,
      foundTopic,
    );
  }

  return results;
}
