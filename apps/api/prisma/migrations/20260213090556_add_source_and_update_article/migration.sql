/*
  Warnings:

  - Made the column `originalUrl` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rssPublishedAt` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sourceId` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "originalUrl" SET NOT NULL,
ALTER COLUMN "rssPublishedAt" SET NOT NULL,
ALTER COLUMN "sourceId" SET NOT NULL;
