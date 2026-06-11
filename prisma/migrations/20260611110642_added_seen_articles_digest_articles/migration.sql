/*
  Warnings:

  - You are about to drop the `Digest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Reaction" AS ENUM ('LIKE', 'DISLIKE');

-- DropForeignKey
ALTER TABLE "Digest" DROP CONSTRAINT "Digest_userId_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_userId_fkey";

-- DropTable
DROP TABLE "Digest";

-- DropTable
DROP TABLE "Topic";

-- CreateTable
CREATE TABLE "topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sources" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digest" (
    "id" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "consensus" TEXT NOT NULL,
    "conflict" TEXT,
    "signal" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digest_article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "oneLine" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "reaction" "Reaction",
    "userId" TEXT NOT NULL,
    "digestId" TEXT NOT NULL,

    CONSTRAINT "digest_article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seen_article" (
    "id" TEXT NOT NULL,
    "urlHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seen_article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seen_article_seenAt_idx" ON "seen_article"("seenAt");

-- CreateIndex
CREATE UNIQUE INDEX "seen_article_urlHash_userId_key" ON "seen_article"("urlHash", "userId");

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digest" ADD CONSTRAINT "digest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digest" ADD CONSTRAINT "digest_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digest_article" ADD CONSTRAINT "digest_article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digest_article" ADD CONSTRAINT "digest_article_digestId_fkey" FOREIGN KEY ("digestId") REFERENCES "digest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seen_article" ADD CONSTRAINT "seen_article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
