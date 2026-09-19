"use server";

import { newClient } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";
import { Digest } from "@prisma/client";

export type AllDigestsPerTopicType = Pick<
  Digest,
  "id" | "headline" | "conflict" | "hasRead" | "topicId" | "createdAt"
> & {
  sources: number;
  topicIndex: number;
  topic: string;
};

export type AllGroupsType = {
  groups?: {
    name: string;
    digests: AllDigestsPerTopicType[];
    hasNext: boolean;
  }[];
} & {
  success: boolean;
  error?: string;
};

const DEFAULT_NUM_DAYS = 7;

export async function getAllDigests(page: number): Promise<AllGroupsType> {
  // const session = await getSession();

  // if (!session) {
  //   return {
  //     error: "Unauthorized for getting all digests",
  //   };
  // }

  console.log(page);

  try {
    const topics = await newClient.topic.findMany({
      where: {
        userId: "cmu808o8m0000ohuwhm1zhfls",
      },
      select: {
        id: true,
        name: true,
      },
    });

    const groups = await Promise.all(
      topics.map(async (t) => {
        const { digests, hasNext } = await newClient.digest.findByDateRange(
          t.id,
          "cmu808o8m0000ohuwhm1zhfls",
          page,
        ); // In reverse order..

        return {
          name: t.name,
          digests: digests
            .map((d, i) => ({
              id: d.id,
              headline: d.headline,
              conflict: d.conflict,
              hasRead: d.hasRead,
              sources: d._count.articles,
              topicIndex: i,
              topic: t.name,
              topicId: t.id,
              createdAt: d.createdAt,
            }))
            .slice(0, DEFAULT_NUM_DAYS),
          hasNext,
        };
      }),
    );

    // revalidatePath("/archive");

    return {
      groups,
      success: true,
    };
  } catch (err) {
    const message = errorDecoder(err, "Could not get all digests");

    console.error(message);

    return {
      error: message,
      success: false,
    };
  }
}
