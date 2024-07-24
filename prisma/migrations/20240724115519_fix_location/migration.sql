/*
  Warnings:

  - You are about to drop the column `latitude` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `locations` table. All the data in the column will be lost.
  - Added the required column `mapsUrl` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "mapsUrl" TEXT NOT NULL;
