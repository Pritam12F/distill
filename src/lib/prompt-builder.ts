import { ArticleWithTopic } from "@/services/pipeline/deduplicate";

export function buildSynthesisUserPrompt(
  topic: string,
  articles: { id: string; title: string; url: string; content: string }[],
): string {
  return `Topic: "${topic}"
   
  Articles:
   
  ${articles
    .map(
      (a) => `[${a.id}]
  Title: ${a.title}
  URL: ${a.url}
  Content: ${a.content.slice(0, 500)}`,
    )
    .join("\n\n---\n\n")}
   
  Synthesize these into a single briefing for someone following "${topic}".`;
}

export function buildRelevancyUserPrompt(groups: ArticleWithTopic[]): string {
  const sections = groups
    .map(
      ({ topic, articles }) => `Topic: "${topic}"

Articles:
${articles
  .map(
    (a) => `[${a.id}]
Title: ${a.title}
Content: ${a.article.slice(0, 300)}`,
  )
  .join("\n\n---\n\n")}`,
    )
    .join("\n\n========\n\n");

  return `${sections}

Rate each article's relevance to its own topic as instructed.`;
}

export function buildTitlePrompt (digests: ({
    topic: string;
    headline: string;
})[]) {

  return `Write one email subject line summarizing today's briefing across these topics.

${digests.map(d => `${d.topic}: ${d.headline}`).join('\n')}

Rules: under 60 characters, specific not generic, no "Your daily digest" phrasing. If one story clearly dominates, lead with it. Otherwise name the 2 biggest themes. Return only the subject line.`
}
