/*
  Warnings:

  - Added the required column `conflict` to the `digest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "digest" DROP COLUMN "conflict",
ADD COLUMN     "conflict" BOOLEAN NOT NULL;
