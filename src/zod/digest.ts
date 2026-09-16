import { z } from "zod";

export const reactionSchema = z.object({
  reaction: z.enum(["LIKE", "DISLIKE"]).nullable(),
});
