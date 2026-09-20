"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ServerActionDefaultResponse } from "@/types/actions";
import { errorDecoder } from "@/utils/error-decoder";
import { User } from "@prisma/client";

export async function changeBriefing(
  pausedState: boolean,
): Promise<ServerActionDefaultResponse<User>> {
  const session = await getSession();

  if (!session) {
    return {
      error: "Not authorized",
      success: false,
    };
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        pausedBriefing: pausedState,
      },
    });

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      error: errorDecoder(error),
      success: false,
    };
  }
}
