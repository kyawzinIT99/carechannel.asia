ALTER TABLE "HospitalProfile" ADD COLUMN "mapPath" TEXT NOT NULL DEFAULT '/photos/map.jpg';
ALTER TABLE "HospitalProfile" ADD COLUMN "heroPath" TEXT NOT NULL DEFAULT '/photos/hero-cardiac.jpg';
ALTER TABLE "HospitalProfile" ADD COLUMN "locationNoteEn" TEXT NOT NULL DEFAULT '';
ALTER TABLE "HospitalProfile" ADD COLUMN "locationNoteMy" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Specialty" ADD COLUMN "imagePath" TEXT;

CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleMy" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyMy" TEXT NOT NULL,
    "imagePath" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);
