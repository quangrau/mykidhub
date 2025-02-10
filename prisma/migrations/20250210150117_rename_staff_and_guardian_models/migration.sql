/*
  Warnings:

  - You are about to drop the `GuardianStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StaffSchool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClassroomToStaffSchool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "GuardianStudent";

-- DropTable
DROP TABLE "StaffSchool";

-- DropTable
DROP TABLE "_ClassroomToStaffSchool";

-- CreateTable
CREATE TABLE "StaffProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "AccountRole" NOT NULL DEFAULT 'TEACHER',
    "status" INTEGER NOT NULL DEFAULT 1,
    "schoolId" TEXT NOT NULL,
    "accountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "StaffProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianProfile" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "relationship" TEXT,
    "status" "InvitationStatus" NOT NULL DEFAULT 'NOT_INVITED',
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "GuardianProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassroomToStaffProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassroomToStaffProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffProfile_accountId_key" ON "StaffProfile"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffProfile_email_schoolId_key" ON "StaffProfile"("email", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "GuardianProfile_guardianId_studentId_key" ON "GuardianProfile"("guardianId", "studentId");

-- CreateIndex
CREATE INDEX "_ClassroomToStaffProfile_B_index" ON "_ClassroomToStaffProfile"("B");
