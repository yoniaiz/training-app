-- CreateEnum
CREATE TYPE "Professions" AS ENUM ('TRAINER', 'PHYSIOTHERAPIST', 'NUTRITIONIST');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'CUSTOMER', 'SERVICE_PROVIDER');

-- CreateEnum
CREATE TYPE "Expertise" AS ENUM ('RUNNING', 'WEIGHTLIFTING', 'FAT_LOSS', 'ARMY_PREPARATION', 'POST_INJURY_REHABILITATION', 'POST_PREGNANCY_REHABILITATION', 'YOGA', 'PILATES', 'CROSSFIT', 'SWIMMING', 'CYCLING', 'BOXING', 'MARTIAL_ARTS', 'DANCING', 'GYMNASTICS', 'FOOTBALL', 'BASKETBALL', 'TENNIS', 'GOLF', 'KETTLEBELL', 'VEGITARIAN', 'VEGAN', 'PALEO', 'KETO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Roles" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "serviceProviderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotritionPlan" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "serviceProviderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotritionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "serviceProviderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "serviceProviderId" INTEGER NOT NULL,
    "availability" TIMESTAMP(3)[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceProvider" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "profession" "Professions" NOT NULL,
    "expertise" "Expertise"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlan_customerId_key" ON "TrainingPlan"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlan_serviceProviderId_key" ON "TrainingPlan"("serviceProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "NotritionPlan_customerId_key" ON "NotritionPlan"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "NotritionPlan_serviceProviderId_key" ON "NotritionPlan"("serviceProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_customerId_key" ON "Review"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_serviceProviderId_key" ON "Review"("serviceProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_customerId_key" ON "Appointment"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_scheduleId_key" ON "Appointment"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_serviceProviderId_key" ON "Schedule"("serviceProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProvider_userId_key" ON "ServiceProvider"("userId");
