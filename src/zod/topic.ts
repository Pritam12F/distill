import { z } from "zod";

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
