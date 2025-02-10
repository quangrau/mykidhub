/*
  Warnings:

  - You are about to drop the column `schoolId` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "schoolId";

-- CreateIndex
CREATE INDEX "GuardianProfile_email_idx" ON "GuardianProfile"("email");

-- CreateIndex
CREATE INDEX "GuardianProfile_status_idx" ON "GuardianProfile"("status");

-- CreateIndex
CREATE INDEX "StaffProfile_email_idx" ON "StaffProfile"("email");

-- CreateIndex
CREATE INDEX "StaffProfile_status_idx" ON "StaffProfile"("status");
