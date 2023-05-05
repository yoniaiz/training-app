/*
  Warnings:

  - You are about to drop the column `availability` on the `Schedule` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "Time" AS ENUM ('SIX_AM', 'SEVEN_AM', 'EIGHT_AM', 'NINE_AM', 'TEN_AM', 'ELEVEN_AM', 'TWELVE_PM', 'ONE_PM', 'TWO_PM', 'THREE_PM', 'FOUR_PM', 'FIVE_PM', 'SIX_PM', 'SEVEN_PM', 'EIGHT_PM', 'NINE_PM', 'TEN_PM', 'ELEVEN_PM', 'TWELVE_AM', 'ONE_AM', 'TWO_AM', 'THREE_AM', 'FOUR_AM', 'FIVE_AM');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "interests" "Expertise"[] DEFAULT ARRAY[]::"Expertise"[],
ADD COLUMN     "servicesSeeked" "Professions"[],
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "availability";

-- AlterTable
ALTER TABLE "ServiceProvider" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "serviceProviderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "locationId" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" SERIAL NOT NULL,
    "day" "Day" NOT NULL,
    "time" "Time"[],
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceProviderId_key" ON "Service"("serviceProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_locationId_key" ON "Service"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_scheduleId_key" ON "Availability"("scheduleId");
