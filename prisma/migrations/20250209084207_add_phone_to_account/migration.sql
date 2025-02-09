/*
  Warnings:

  - The `role` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'GUARDIAN');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "phone" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "AccountRole" NOT NULL DEFAULT 'GUARDIAN';

-- DropEnum
DROP TYPE "UserRole";
