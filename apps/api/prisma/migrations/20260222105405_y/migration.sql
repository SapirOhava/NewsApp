/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `rssFeedUrl` on the `Source` table. All the data in the column will be lost.
  - You are about to drop the `SourceCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `feedId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "SourceCategory" DROP CONSTRAINT "SourceCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "SourceCategory" DROP CONSTRAINT "SourceCategory_sourceId_fkey";

-- DropIndex
DROP INDEX "Source_rssFeedUrl_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "categoryId",
DROP COLUMN "sourceId",
ADD COLUMN     "feedId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Source" DROP COLUMN "rssFeedUrl";

-- DropTable
DROP TABLE "SourceCategory";

-- CreateTable
CREATE TABLE "Feed" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "rssFeedUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feed_rssFeedUrl_key" ON "Feed"("rssFeedUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Feed_slug_key" ON "Feed"("slug");

-- CreateIndex
CREATE INDEX "Feed_sourceId_idx" ON "Feed"("sourceId");

-- CreateIndex
CREATE INDEX "Feed_categoryId_idx" ON "Feed"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Feed_sourceId_categoryId_key" ON "Feed"("sourceId", "categoryId");

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
