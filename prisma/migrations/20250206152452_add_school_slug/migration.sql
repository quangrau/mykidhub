/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- First add the slug column as nullable
ALTER TABLE "School" ADD COLUMN "slug" TEXT;

-- Update existing records with slugs based on their names
UPDATE "School" SET "slug" = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'));

-- Make the slug column required
ALTER TABLE "School" ALTER COLUMN "slug" SET NOT NULL;

-- Create unique index
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");
