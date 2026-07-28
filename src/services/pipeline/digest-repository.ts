import { prisma } from "@/lib/prisma";
import { synthesisSchema } from "./digest-generator";
import z from "zod";

export type DigestType = z.infer<typeof synthesisSchema>;

export function addDigestToRepo(userId: string, digest: DigestType) {
  return prisma.digest.create({
    data: {
      userId,
      headline: digest.headline,
      conflict: digest.conflict!,
      consensus: digest.consensus,
      signal: digest.signal,
    },
  });
}
