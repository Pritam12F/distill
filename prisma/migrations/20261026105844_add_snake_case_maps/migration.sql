-- CreateEnum
CREATE TYPE "user_tier" AS ENUM ('free', 'pro', 'admin');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "userTier" "user_tier" NOT NULL DEFAULT 'free';
