-- CreateEnum
CREATE TYPE "GuardianStatus" AS ENUM ('NOT_INVITED', 'INVITED', 'SIGNED_UP');

-- AlterTable
ALTER TABLE "Guardian" ADD COLUMN     "status" "GuardianStatus" NOT NULL DEFAULT 'NOT_INVITED';
