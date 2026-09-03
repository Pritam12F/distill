import "dotenv/config"
import { createOpenAI } from "@ai-sdk/openai";

export const customOpenAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});
