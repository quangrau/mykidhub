/*
  Warnings:

  - You are about to drop the `SchoolUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SchoolUser" DROP CONSTRAINT "SchoolUser_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolUser" DROP CONSTRAINT "SchoolUser_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "schoolId" TEXT,
ADD COLUMN     "schoolRole" "SchoolRole" NOT NULL DEFAULT 'TEACHER';

-- DropTable
DROP TABLE "SchoolUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
