import { ArticleType, extractContent } from "@/utils/extractor";
import { promiseResolver } from "@/utils/resolver";
import axios from "axios";

export async function getNewsSources(searchTerm = "artificial intelligence") {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/search?q=${encodeURIComponent(searchTerm)}&api-key=${process.env.GUARDIAN_API_KEY ?? "test"}`,
    );
    const results = response.data.response.results;

    return results.map((a: any) => ({
      title: a.webTitle,
      url: a.webUrl,
      publishedAt: a.webPublicationDate,
      source: "The Guardian",
    }));
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "unknown error",
    );
  }
}

export async function getNewsData(searchTerm = "artificial intelligence") {
  const sources = await getNewsSources(searchTerm);

  const allPromises: PromiseSettledResult<ArticleType | null>[] =
    await Promise.allSettled(
      sources.map(async (source: any) => await extractContent(source.url!)),
    );

  const resolvedArticles = promiseResolver(allPromises);

  console.log(resolvedArticles.length);

  return resolvedArticles;
}

getNewsData("Electric Vehicles");
