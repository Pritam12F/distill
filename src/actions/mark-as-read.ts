import { prisma } from "@/lib/prisma";
import { errorDecoder } from "@/utils/error-decoder";

export async function markAsRead(digestId: string) {
  try {
    await prisma.digest.update({
      where: {
        id: digestId,
      },
      data: {
        hasRead: true,
      },
    });

    console.log(`Digest with ID: ${digestId} marked as read`);
  } catch (err) {
    console.error(errorDecoder(err));
  }
}
