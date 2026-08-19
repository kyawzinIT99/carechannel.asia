-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "phone" TEXT
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "valueEn" TEXT NOT NULL,
    "valueMy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "detailEn" TEXT NOT NULL,
    "detailMy" TEXT NOT NULL,
    "mapQuery" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "published" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "HospitalProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "mapPath" TEXT NOT NULL,
    "heroPath" TEXT NOT NULL,
    "locationNoteEn" TEXT NOT NULL,
    "locationNoteMy" TEXT NOT NULL,
    "sourceNote" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "imagePath" TEXT,
    "phone" TEXT,
    "hoursEn" TEXT,
    "hoursMy" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "summaryMy" TEXT NOT NULL,
    "servicesEn" JSONB NOT NULL DEFAULT [],
    "servicesMy" JSONB NOT NULL DEFAULT [],
    "sortOrder" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    CONSTRAINT "Specialty_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Specialty" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PackageCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "validFrom" DATETIME NOT NULL,
    "validTo" DATETIME NOT NULL,
    "notesEn" TEXT NOT NULL,
    "notesMy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "catalogId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "listPrice" DECIMAL NOT NULL,
    "salePrice" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "highlight" TEXT,
    "featuresEn" JSONB NOT NULL DEFAULT [],
    "featuresMy" JSONB NOT NULL DEFAULT [],
    CONSTRAINT "Package_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "PackageCatalog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titleEn" TEXT NOT NULL,
    "titleMy" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyMy" TEXT NOT NULL,
    "imagePath" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "country" TEXT,
    "returningPatient" BOOLEAN,
    "message" TEXT NOT NULL,
    "specialtySlug" TEXT,
    "packageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "assignedToId" TEXT,
    "patientUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inquiry_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Inquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Inquiry_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inquiryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "preferredDate" DATETIME,
    "interpreterNeeded" BOOLEAN NOT NULL DEFAULT false,
    "interpreterLang" TEXT,
    "airportPickup" BOOLEAN NOT NULL DEFAULT false,
    "accommodationHelp" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "staffNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Appointment_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MessageTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OutboundMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "meta" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inquiryId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "textVersion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_role_key" ON "UserRole"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_key_key" ON "SiteContent"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_slug_key" ON "Specialty"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageCatalog_code_key" ON "PackageCatalog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Package_code_key" ON "Package"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MessageTemplate_key_locale_key" ON "MessageTemplate"("key", "locale");

