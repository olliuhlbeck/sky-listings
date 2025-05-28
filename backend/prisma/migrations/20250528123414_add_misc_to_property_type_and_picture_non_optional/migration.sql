/*
  Warnings:

  - Made the column `picture` on table `PropertyPicture` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "PropertyTypes" ADD VALUE 'MISCELLANOUS';

-- AlterTable
ALTER TABLE "PropertyPicture" ALTER COLUMN "picture" SET NOT NULL;
