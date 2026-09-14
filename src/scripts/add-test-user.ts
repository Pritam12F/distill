"use server";

import { SUGGESTED_TOPICS } from "@/constants/constants";
import { prisma } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";

const topic = SUGGESTED_TOPICS.find((t) => t.name === "Web Development")!;

export async function addTestUser() {
  try {
    await prisma.user.upsert({
      where: {
        email: "test_user@devzy.live",
      },
      create: {
        email: "test_user@devzy.live",
        name: "test_user",
      },
      update: {},
    });
    console.log("Test user was added");
  } catch (err) {
    const errMessage = errorDecoder(err);

    console.error(errMessage);
  }
}

addTestUser();
