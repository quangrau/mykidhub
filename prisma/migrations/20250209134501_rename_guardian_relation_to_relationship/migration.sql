/*
  Warnings:

  - You are about to drop the column `relation` on the `GuardianStudent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GuardianStudent" DROP COLUMN "relation",
ADD COLUMN     "relationship" TEXT;
