-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('HOME', 'CENTER', 'MULTI_SITE');

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" "SchoolType" NOT NULL DEFAULT 'HOME';
