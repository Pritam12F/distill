"use server";

import { prisma } from "@/lib/prisma";
import { core } from "../pipeline";
import { type CoreSuccessType } from "@/types/pipeline";
import { errorDecoder } from "@/utils/error-decoder";
import { Digest } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function generateFirstDigest(userDetails: {
  id: string;
  name: string;
  email: string;
}): Promise<
  | {
      error: {
        reason: string;
      };
      data: null;
    }
  | {
      error: null;
      data: Pick<CoreSuccessType, "message"> & {
        digestCounts: number;
        digests: Omit<Digest, "userId">[];
      };
    }
> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userDetails.id,
      },
      select: {
        topics: true,
      },
    });

    if (!user) {
      return {
        error: {
          reason: "User doesn't exist",
        },
        data: null,
      };
    }

    let result = await core(user.topics, userDetails);

    if (!result.success) {
      return {
        error: {
          reason: result.message,
        },
        data: null,
      };
    }

    const successResp = result as CoreSuccessType;

    revalidatePath("/");

    return {
      error: null,
      data: {
        message: successResp.message,
        digestCounts: successResp.digestCount,
        digests: successResp.digests,
      },
    };
  } catch (err) {
    const errMessage = errorDecoder(err);
    console.error(errMessage);

    return {
      error: {
        reason: errMessage,
      },
      data: null,
    };
  }
}
