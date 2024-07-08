/*
  Warnings:

  - You are about to drop the column `collections` on the `museums` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "museums" DROP COLUMN "collections";

-- CreateTable
CREATE TABLE "collections" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "museumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
