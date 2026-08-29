import { z } from "zod";

export const topicSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export const getTopicSchema = z.object({
  userId: z.string().min(1, "User Id is needed").max(100),
});

export const updateTopicSchema = z.object({
  topicId: z.uuid(),
  name: z.string().min(1, "Name is required").max(100),
});

export const addTopicSchema = z.object({
  topicName: z.string().min(1, "Name is required").max(100),
  sources: z
    .array(z.string().min(1, { error: "Source cannot be empty string" }))
    .min(1)
    .optional(),
});

export const reactionSchema = z.object({
  reaction: z.enum(["LIKE", "DISLIKE"]),
});

export const getDigestSchema = z.object({
  userId: z.string().min(1, "User Id is needed").max(100),
});

export type TopicInput = z.infer<typeof topicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
export type GetTopicInput = z.infer<typeof getTopicSchema>;
export type GetDigestInput = z.infer<typeof getDigestSchema>;
