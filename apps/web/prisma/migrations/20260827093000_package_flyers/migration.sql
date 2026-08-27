-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN "code" TEXT;
ALTER TABLE "Promotion" ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'announcement';
ALTER TABLE "Promotion" ADD COLUMN "flyerGroup" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");
