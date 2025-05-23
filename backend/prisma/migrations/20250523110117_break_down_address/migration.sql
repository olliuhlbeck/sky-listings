/*
  Warnings:

  - You are about to drop the column `address` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `squareM2s` on the `Property` table. All the data in the column will be lost.
  - Added the required column `city` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyStatus` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `squareMeters` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'PENGDING', 'SOLD');

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "address",
DROP COLUMN "squareM2s",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "propertyStatus" "PropertyStatus" NOT NULL,
ADD COLUMN     "squareMeters" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Property_city_state_idx" ON "Property"("city", "state");
