/*
  Warnings:

  - You are about to drop the `AccountRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'GUARDIAN');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'GUARDIAN';

-- DropTable
DROP TABLE "AccountRole";

-- DropTable
DROP TABLE "Role";
