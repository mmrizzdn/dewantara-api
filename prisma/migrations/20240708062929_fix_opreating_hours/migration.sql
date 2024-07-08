/*
  Warnings:

  - You are about to drop the `operatingHours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "operatingHours" DROP CONSTRAINT "operatingHours_museumId_fkey";

-- DropTable
DROP TABLE "operatingHours";

-- CreateTable
CREATE TABLE "operating_hours" (
    "id" SERIAL NOT NULL,
    "isSunday" BOOLEAN NOT NULL,
    "isMonday" BOOLEAN NOT NULL,
    "isTuesday" BOOLEAN NOT NULL,
    "isWednesday" BOOLEAN NOT NULL,
    "isThursday" BOOLEAN NOT NULL,
    "isFriday" BOOLEAN NOT NULL,
    "isSaturday" BOOLEAN NOT NULL,
    "isNationalHoliday" BOOLEAN NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "museumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_hours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "operating_hours" ADD CONSTRAINT "operating_hours_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
