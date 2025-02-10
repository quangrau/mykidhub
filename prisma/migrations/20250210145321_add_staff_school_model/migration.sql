-- CreateTable
CREATE TABLE "StaffSchool" (
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

    CONSTRAINT "StaffSchool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassroomToStaffSchool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassroomToStaffSchool_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffSchool_accountId_key" ON "StaffSchool"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffSchool_email_schoolId_key" ON "StaffSchool"("email", "schoolId");

-- CreateIndex
CREATE INDEX "_ClassroomToStaffSchool_B_index" ON "_ClassroomToStaffSchool"("B");
