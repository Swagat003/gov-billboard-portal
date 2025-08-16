-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'OWNER', 'ADVERTISER');

-- CreateEnum
CREATE TYPE "public"."GovIdType" AS ENUM ('AADHAR', 'PAN');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('NO_QR', 'BANNED_CONTENT', 'ILLEGAL_INSTALLATION', 'STRUCTURAL_HAZARD');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACTION_TAKEN');

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gov_id_type" "public"."GovIdType" NOT NULL,
    "gov_id_no" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Hoarding" (
    "hoarding_no" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "installation_date" TIMESTAMP(3) NOT NULL,
    "location" geography(Point,4326) NOT NULL,
    "address" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hoarding_pkey" PRIMARY KEY ("hoarding_no")
);

-- CreateTable
CREATE TABLE "public"."Advertisement" (
    "advertise_no" TEXT NOT NULL,
    "advertiserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "contentUrl" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("advertise_no")
);

-- CreateTable
CREATE TABLE "public"."HoardingAdvertisement" (
    "id" TEXT NOT NULL,
    "hoardingId" TEXT NOT NULL,
    "advertisementId" TEXT NOT NULL,
    "qrCodeNo" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HoardingAdvertisement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "report_no" TEXT NOT NULL,
    "qrCodeNo" TEXT,
    "reporterPhone" TEXT NOT NULL,
    "issueType" "public"."ReportType" NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "location" geography(Point,4326) NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("report_no")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_gov_id_no_key" ON "public"."User"("gov_id_no");

-- CreateIndex
CREATE UNIQUE INDEX "HoardingAdvertisement_hoardingId_key" ON "public"."HoardingAdvertisement"("hoardingId");

-- CreateIndex
CREATE UNIQUE INDEX "HoardingAdvertisement_qrCodeNo_key" ON "public"."HoardingAdvertisement"("qrCodeNo");

-- AddForeignKey
ALTER TABLE "public"."Hoarding" ADD CONSTRAINT "Hoarding_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Advertisement" ADD CONSTRAINT "Advertisement_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HoardingAdvertisement" ADD CONSTRAINT "HoardingAdvertisement_hoardingId_fkey" FOREIGN KEY ("hoardingId") REFERENCES "public"."Hoarding"("hoarding_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HoardingAdvertisement" ADD CONSTRAINT "HoardingAdvertisement_advertisementId_fkey" FOREIGN KEY ("advertisementId") REFERENCES "public"."Advertisement"("advertise_no") ON DELETE RESTRICT ON UPDATE CASCADE;
