/*
  Warnings:

  - You are about to drop the column `operationalHour` on the `museums` table. All the data in the column will be lost.
  - You are about to drop the column `ticketPrice` on the `museums` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "museums" DROP COLUMN "operationalHour",
DROP COLUMN "ticketPrice";

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "regency" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "museumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operatingHours" (
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

    CONSTRAINT "operatingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "type" TEXT NOT NULL DEFAULT 'individual',
    "isChild" BOOLEAN NOT NULL,
    "isStudent" BOOLEAN NOT NULL,
    "isAdult" BOOLEAN NOT NULL,
    "museumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operatingHours" ADD CONSTRAINT "operatingHours_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
