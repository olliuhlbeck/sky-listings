/*
  Warnings:

  - You are about to drop the column `profilePictuerMimeType` on the `UserInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "profilePictuerMimeType",
ADD COLUMN     "profilePictureMimeType" VARCHAR(50);
