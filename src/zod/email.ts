import { z } from "zod";

export const titleSummarySchema = z.object({
  name: z.string().min(5, { message: "Too short of a title" }),
});
