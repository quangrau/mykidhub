/*
  Warnings:

  - You are about to drop the column `type` on the `School` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "School" DROP COLUMN "type",
ADD COLUMN     "metadata" JSONB DEFAULT '{}';

-- DropEnum
DROP TYPE "SchoolType";
