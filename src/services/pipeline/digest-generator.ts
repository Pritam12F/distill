import { z } from "zod";
import { SYNTHESIS_SYSTEM_PROMPT } from "@/constants/prompts";
import { buildSynthesisUserPrompt } from "@/lib/prompt-builder";
import { generateText, Output } from "ai";
import { customOpenAI } from "@/lib/custom-openai";

export const synthesisSchema = z.object({
  headline: z.string().max(120),
  topic: z.string().min(1),
  consensus: z.string(),
  conflict: z.string().nullable(),
  signal: z.string(),
  articles: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string().refine((val) => {
        try{
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }),
      oneLine: z.string(),
    }),
  ),
});

export async function synthesiseDigest(
  topic: string,
  articles: { id: string; title: string; url: string; content: string }[],
) {
  const { output } = await generateText({
    model: customOpenAI("gpt-5-nano"),
    system: SYNTHESIS_SYSTEM_PROMPT,
    prompt: buildSynthesisUserPrompt(topic, articles),
    output: Output.object({
      schema: synthesisSchema,
    })
  });

  return output;
}
