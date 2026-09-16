"use server";

import { SUGGESTED_TOPICS } from "@/constants/constants";
import { prisma } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";

const topic = SUGGESTED_TOPICS.find((t) => t.name === "Web Development")!;

export async function addTestUser() {
  try {
    const userAdded = await prisma.user.upsert({
      where: {
        email: "test_user@devzy.live",
      },
      create: {
        email: "test_user@devzy.live",
        name: "test_user",
        topics: {
          create: {
            name: topic.name,
            sources: topic.sources
              .filter((s) => s.type === "rss")
              .map((s) => s.value),
          },
        },
      },
      update: {},
      select: {
        id: true,
      },
    });

    return userAdded.id;
  } catch (err) {
    return errorDecoder(err);
  }
}

addTestUser()
  .then((res) => {
    console.log(`Test user of ID ${res} was added`);
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
