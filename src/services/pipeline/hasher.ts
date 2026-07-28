import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function hashArticles(userId: string, articleUrls: string[]) {
  articleUrls.forEach((url) => {
    bcrypt.hash(url, 10, async function (err, hash) {
      if (err) {
        throw new Error(err.message);
      }

      try {
        await prisma.seenArticle.create({
          data: {
            userId,
            urlHash: hash,
          },
        });
      } catch (e) {
        console.log(
          e instanceof Error ? e.message : "Could not hash password to db!",
        );

        throw new Error(
          e instanceof Error ? e.message : "Could not hash password to db!",
        );
      }
    });
  });
}
