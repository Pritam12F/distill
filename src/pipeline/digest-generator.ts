import { SYNTHESIS_SYSTEM_PROMPT } from "@/constants/prompts";
import { buildSynthesisUserPrompt } from "@/utils/prompt-builder";
import { generateText, Output } from "ai";
import { customOpenAI } from "@/lib/custom-openai";
import { synthesisSchema } from "@/zod/pipeline";

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
    }),
  });

  return output;
}
