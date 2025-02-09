/*
  Warnings:

  - A unique constraint covering the columns `[guardianId,studentId]` on the table `GuardianStudent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guardianId` to the `GuardianStudent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GuardianStudent_userId_studentId_key";

-- AlterTable
ALTER TABLE "GuardianStudent" ADD COLUMN     "guardianId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_email_key" ON "Guardian"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GuardianStudent_guardianId_studentId_key" ON "GuardianStudent"("guardianId", "studentId");
