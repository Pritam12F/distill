"use server";

import { getSession } from "@/lib/auth";
import { Topic } from "@prisma/client";
import { ServerActionDefaultResponse } from "@/types/actions";
import { prisma } from "@/lib/prisma";

type TopicCreateType = Pick<Topic, "name" | "sources">;
type TopicDeleteType = Pick<Topic, "id">;
type UpdateType = Pick<Topic, "id" | "sources" | "name">;

export async function createTopic(
  topic: TopicCreateType,
): Promise<ServerActionDefaultResponse<Topic>> {
  const session = await getSession();

  if (!session) {
    return {
      error: "User not authorized",
      success: false,
    };
  }

  try {
    const topicCreated = await prisma.topic.create({
      data: {
        userId: session.user.id,
        name: topic.name,
        sources: topic.sources,
      },
    });

    return {
      success: true,
      data: topicCreated,
    };
  } catch {
    console.error("Error creating topic");

    return {
      success: false,
      error: "Error creating topic",
    };
  }
}

// export async function updateTopic(
//   topic: UpdateType[],
// ): Promise<ServerActionDefaultResponse<Topic>> {
//   const session = await getSession();

//   if (!session) {
//     return {
//       error: "User not authorized",
//       success: false,
//     };
//   }

//   try {
//     const updatedTopics = await Promise.all(
//       topic.map(async (t) => {
//         return await prisma.topic.update({
//           where: {
//             userId: session.user.id,
//             id: t.id,
//           },
//           data: {
//             name: t.name,
//             sources: t.sources,
//           },
//         });
//       }),
//     );

//     return {
//       success: true,
//       message: "Topic update succesfull",
//       data: updatedTopics,
//     };
//   } catch {
//     console.error("Error updating topic");

//     return {
//       success: false,
//       error: "Error updating topic",
//     };
//   }
// }

export async function deleteTopic(
  topic: TopicDeleteType,
): Promise<ServerActionDefaultResponse<{ count: number }>> {
  const session = await getSession();

  if (!session) {
    return {
      error: "User not authorized",
      success: false,
    };
  }

  try {
    const deletedTopic = await prisma.topic.deleteMany({
      where: {
        id: topic.id,
      },
    });

    return {
      success: true,
      data: deletedTopic,
    };
  } catch {
    return {
      success: false,
      error: "Error deleting topic",
    };
  }
}
