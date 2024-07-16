/*
  Warnings:

  - Added the required column `publication` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "publication" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "isWeekdays" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isWeekend" BOOLEAN NOT NULL DEFAULT true;
