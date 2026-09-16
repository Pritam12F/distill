import { z } from "zod";

export const synthesisSchema = z.object({
  headline: z.string().max(120),
  consensus: z.string(),
  conflict: z.string().nullable(),
  signal: z.string(),
  articles: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string().refine((val) => {
        try {
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

export type DigestType = z.infer<typeof synthesisSchema>;

export const RatingSchema = z.object({
  ratings: z.array(
    z.object({
      id: z.string().min(1, "Id should not be empty"),
      score: z.number(),
    }),
  ),
});
