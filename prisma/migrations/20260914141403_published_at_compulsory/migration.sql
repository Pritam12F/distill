/*
  Warnings:

  - Made the column `publishedAt` on table `digest_article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "digest_article" ALTER COLUMN "publishedAt" SET NOT NULL;
