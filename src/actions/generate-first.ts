"use server";

import { prisma } from "@/lib/prisma";
import { core } from "../pipeline";
import { type CoreSuccessType } from "@/types/pipeline";
import { errorDecoder } from "@/utils/error-decoder";
import { Digest } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function generateFirstDigest(): Promise<
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
  const auth = await getSession();

  if(!auth?.session || !auth.user){
    return {
      error: {
        reason: "User not authenticated!"
      },
      data: null,
    }
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: auth.session.id,
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

    let result = await core(user.topics, {
      name: auth.user.name,
      email: auth.user.email,
      id: auth.user.id,
    });

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
