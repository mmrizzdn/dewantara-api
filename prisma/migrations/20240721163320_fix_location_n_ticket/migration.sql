/*
  Warnings:

  - You are about to drop the column `isWeekdays` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `puppets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "puppets" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "isWeekdays",
ADD COLUMN     "isWeekday" BOOLEAN NOT NULL DEFAULT true;
