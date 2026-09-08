/*
  Warnings:

  - Added the required column `title` to the `seen_article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seen_article" ADD COLUMN     "title" TEXT NOT NULL;
