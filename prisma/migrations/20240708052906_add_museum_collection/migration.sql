/*
  Warnings:

  - Added the required column `collections` to the `museums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "museums" ADD COLUMN     "collections" TEXT NOT NULL;
