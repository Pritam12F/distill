"use server";

import { getSession } from "@/lib/auth";
import { Topic } from "@prisma/client";
import { ServerActionDefaultResponse } from "@/types/actions";
import { prisma } from "@/lib/prisma";

type TopicCreateType = Pick<Topic, "name" | "userId" | "sources">;
type TopicDeleteType = Pick<Topic, "id">;
type UpdateType = Pick<Topic, "id" | "sources" | "name">;

export async function createTopic(
  topic: TopicCreateType[],
): Promise<ServerActionDefaultResponse> {
  const session = await getSession();

  if (!session) {
    return {
      error: "User not authorized",
      success: false,
    };
  }

  try {
    await prisma.topic.createMany({
      data: [...topic],
    });

    return {
      success: true,
    };
  } catch {
    console.error("Error creating topic");

    return {
      success: false,
      error: "Error creating topic",
    };
  }
}

export async function updateTopic(
  topic: UpdateType[],
): Promise<ServerActionDefaultResponse> {
  const session = await getSession();

  if (!session) {
    return {
      error: "User not authorized",
      success: false,
    };
  }

  try {
    await Promise.all(
      topic.map(async (t) => {
        return await prisma.topic.update({
          where: {
            userId: session.user.id,
            id: t.id,
          },
          data: {
            name: t.name,
            sources: t.sources,
          },
        });
      }),
    );

    return {
      success: true,
      error: "Topic update succesfull",
    };
  } catch {
    console.error("Error updating topic");

    return {
      success: false,
      error: "Error updating topic",
    };
  }
}

export async function deleteTopic(topic: TopicDeleteType[]) {
  const session = await getSession();

  if (!session) {
    return {
      error: "User not authorized",
      success: false,
    };
  }

  try {
    await prisma.topic.deleteMany({
      where: {
        id: {
          in: topic.map((t) => t.id),
        },
      },
    });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Error deleting topic",
    };
  }
}
