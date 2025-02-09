/*
  Warnings:

  - You are about to drop the column `userId` on the `GuardianStudent` table. All the data in the column will be lost.
  - You are about to drop the `Guardian` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('NOT_INVITED', 'INVITED', 'SIGNED_UP');

-- AlterTable
ALTER TABLE "GuardianStudent" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'NOT_INVITED';

-- DropTable
DROP TABLE "Guardian";

-- DropEnum
DROP TYPE "GuardianStatus";
