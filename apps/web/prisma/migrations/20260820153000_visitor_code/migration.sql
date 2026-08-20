-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN "visitorCode" TEXT;

UPDATE "Inquiry"
SET "visitorCode" = 'CH' || printf('%03d', (
  SELECT COUNT(*) FROM "Inquiry" AS "older"
  WHERE "older"."createdAt" < "Inquiry"."createdAt"
     OR ("older"."createdAt" = "Inquiry"."createdAt" AND "older"."id" <= "Inquiry"."id")
))
WHERE "visitorCode" IS NULL;

CREATE UNIQUE INDEX "Inquiry_visitorCode_key" ON "Inquiry"("visitorCode");
