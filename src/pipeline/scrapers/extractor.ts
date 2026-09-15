import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { v4 as uuidv4 } from "uuid";

export type ArticleType = {
  id: string;
  title?: string | null;
  topic?: string;
  url?: string;
  article: string;
  siteName?: string | null;
  length: number;
  publishedAt?: Date | string | null;
  keywordRelevancy?: number;
  contentRelevancy?: number;
};

function normalizeText(article: ReturnType<Readability["parse"]>): ArticleType {
  const normalizedArticle = article!
    .textContent!.replace(/\n{3,}/g, "\n\n") // collapse 3+ newlines into 2
    .replace(/\t/g, " ") // tabs to spaces
    .replace(/ {2,}/g, " ") // collapse multiple spaces
    .trim();

  return {
    id: uuidv4(),
    title: article?.title,
    article: normalizedArticle,
    siteName: article?.siteName,
    length: normalizedArticle.length,
  };
}

function isUseableContent(response: any) {
  if (!response) return false;
  if (!response.textContent) return false;

  return response.textContent.length > 200;
}

async function fetchWithAPI(url: string) {
  try {
    const html = await (
      await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        signal: AbortSignal.timeout(10000),
      })
    ).text();
    const doc = new JSDOM(html, { url });

    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    return article;
  } catch (error) {
    console.error(`fetchWithAPI failed for ${url}:`, error);
    return null;
  }
}

export async function extractContent(url: string) {
  let content = await fetchWithAPI(url);

  if (!isUseableContent(content)) {
    return null;
  }

  const normalizedArticle = normalizeText(content);

  return {
    ...normalizedArticle,
    url,
  };
}
