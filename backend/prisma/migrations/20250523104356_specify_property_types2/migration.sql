/*
  Warnings:

  - Added the required column `description` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "description" TEXT NOT NULL;
