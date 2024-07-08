/*
  Warnings:

  - Added the required column `imageUrl` to the `puppets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "puppets" ADD COLUMN     "imageUrl" TEXT NOT NULL;
