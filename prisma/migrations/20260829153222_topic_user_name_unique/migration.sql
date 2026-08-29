/*
  Warnings:

  - The `sources` column on the `topic` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,name]` on the table `topic` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "digest_article" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "topic" DROP COLUMN "sources",
ADD COLUMN     "sources" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "topic_userId_name_key" ON "topic"("userId", "name");
