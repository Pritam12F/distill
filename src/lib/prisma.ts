import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const DEFAULT_PAGE_LENGTH = 7;

export const newClient = prisma.$extends({
  model: {
    digest: {
      async findByDateRange(
        topicId: string,
        userId: string,
        pageNumber: number,
      ) {
        const items = Number(pageNumber) * 7;

        const digests = await prisma.digest.findMany({
          where: {
            topicId,
            userId,
          },
          select: {
            id: true,
            _count: {
              select: {
                articles: true,
              },
            },
            headline: true,
            conflict: true,
            hasRead: true,
            topicId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: items,
          take: 8,
        });

        return {
          digests,
          hasNext: digests.length > DEFAULT_PAGE_LENGTH,
        };
      },
    },
  },
});
