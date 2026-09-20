"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ServerActionDefaultResponse } from "@/types/actions";
import { errorDecoder } from "@/utils/error-decoder";
import { User } from "@prisma/client";

type UserSettingsType = {
  paused: boolean | null;
};

export async function getUserSettings({
  paused,
}: UserSettingsType): Promise<ServerActionDefaultResponse<User>> {
  const session = await getSession();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized user",
    };
  }

  try {
    const userUpdated = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        pausedBriefing: paused,
      },
    });

    return {
      success: true,
      data: userUpdated,
    };
  } catch (error) {
    return {
      error: errorDecoder(error),
      success: false,
    };
  }
}
