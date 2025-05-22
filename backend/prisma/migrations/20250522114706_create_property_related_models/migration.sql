/*
  Warnings:

  - The primary key for the `UserInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId]` on the table `UserInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP CONSTRAINT "UserInfo_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "squareM2s" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "additionalInfo" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyPicture" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "picture" BYTEA,
    "useAsCoverPicture" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PropertyPicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_userId_idx" ON "Property"("userId");

-- CreateIndex
CREATE INDEX "PropertyPicture_propertyId_idx" ON "PropertyPicture"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userId_key" ON "UserInfo"("userId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyPicture" ADD CONSTRAINT "PropertyPicture_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
