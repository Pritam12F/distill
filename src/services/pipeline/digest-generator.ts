import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { SYNTHESIS_SYSTEM_PROMPT } from "@/constants/prompts";
import { buildSynthesisUserPrompt } from "@/lib/prompt-builder";
import { generateObject } from "ai";

export const synthesisSchema = z.object({
  headline: z.string().max(120),
  consensus: z.string(),
  conflict: z.string().nullable(),
  signal: z.string(),
  articles: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string().url(),
      oneLine: z.string().max(100),
    }),
  ),
});

export async function synthesise(
  topic: string,
  articles: { id: string; title: string; url: string; content: string }[],
) {
  const { object } = await generateObject({
    model: openai("gpt-5-mini"),
    system: SYNTHESIS_SYSTEM_PROMPT,
    prompt: buildSynthesisUserPrompt(topic, articles),
    schema: synthesisSchema,
  });

  return object;
}
