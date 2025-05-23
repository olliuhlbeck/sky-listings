/*
  Warnings:

  - Added the required column `propertyType` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyTypes" AS ENUM ('HOUSE', 'APARTMENT', 'COMMERCIAL', 'LAND', 'INDUSTRIAL');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "propertyType" "PropertyTypes" NOT NULL;
