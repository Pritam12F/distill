"use server";

import { prisma } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";

export async function deleteUser(
  userId: string,
): Promise<{ error?: string; message?: string; success?: boolean }> {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      success: true,
      message: "User was deleted",
    };
  } catch (err) {
    console.error(errorDecoder(err));

    return {
      success: false,
      error: errorDecoder(err),
    };
  }
}
