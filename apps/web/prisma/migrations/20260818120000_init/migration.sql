-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'HOSPITAL_ADMIN', 'INTERNATIONAL_COORDINATOR', 'RECEPTION', 'DOCTOR', 'NURSE', 'PATIENT');
CREATE TYPE "Locale" AS ENUM ('en', 'my');
CREATE TYPE "GenderScope" AS ENUM ('ANY', 'MALE', 'FEMALE');
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');
CREATE TYPE "AppointmentStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "OutboundChannel" AS ENUM ('EMAIL', 'TELEGRAM');
CREATE TYPE "OutboundStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserRole_userId_role_key" ON "UserRole"("userId", "role");
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "HospitalProfile" (
    "id" TEXT NOT NULL,
    "legalNameTh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "addressMy" TEXT NOT NULL,
    "mainPhone" TEXT NOT NULL,
    "emergencyPhone" TEXT NOT NULL,
    "cardiacPhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "facebookUrl" TEXT NOT NULL,
    "logoPath" TEXT NOT NULL,
    "sourceNote" TEXT NOT NULL,
    CONSTRAINT "HospitalProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "phone" TEXT,
    "hoursEn" TEXT,
    "hoursMy" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "summaryMy" TEXT NOT NULL,
    "servicesEn" TEXT[],
    "servicesMy" TEXT[],
    "sortOrder" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Specialty_slug_key" ON "Specialty"("slug");
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "PackageCatalog" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "notesEn" TEXT NOT NULL,
    "notesMy" TEXT NOT NULL,
    CONSTRAINT "PackageCatalog_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PackageCatalog_code_key" ON "PackageCatalog"("code");

CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "catalogId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "gender" "GenderScope" NOT NULL,
    "listPrice" DECIMAL(12,2) NOT NULL,
    "salePrice" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "published" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Package_code_key" ON "Package"("code");
ALTER TABLE "Package" ADD CONSTRAINT "Package_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "PackageCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "specialtySlug" TEXT,
    "packageId" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "interpreterNeeded" BOOLEAN NOT NULL DEFAULT false,
    "interpreterLang" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'REQUESTED',
    "staffNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "MessageTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MessageTemplate_key_locale_key" ON "MessageTemplate"("key", "locale");

CREATE TABLE "OutboundMessage" (
    "id" TEXT NOT NULL,
    "channel" "OutboundChannel" NOT NULL,
    "toAddress" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboundStatus" NOT NULL DEFAULT 'QUEUED',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutboundMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "textVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);
