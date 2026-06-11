import { z } from "zod";

export const topicSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export const getTopicSchema = z.object({
  userId: z.string().min(1, "User Id is needed").max(100),
});

export const updateTopicSchema = topicSchema.partial();

export const getDigestSchema = z.object({
  userId: z.string().min(1, "User Id is needed").max(100),
});

export type TopicInput = z.infer<typeof topicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
export type GetTopicInput = z.infer<typeof getTopicSchema>;
export type GetDigestInput = z.infer<typeof getDigestSchema>;
