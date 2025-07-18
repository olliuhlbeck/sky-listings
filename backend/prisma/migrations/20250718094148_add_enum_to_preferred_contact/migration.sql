/*
  Warnings:

  - The `preferredContactDetails` column on the `UserInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONECALL', 'TEXTMESSAGE', 'NOTCHOSEN');

-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "preferredContactDetails",
ADD COLUMN     "preferredContactDetails" "ContactMethod" NOT NULL DEFAULT 'NOTCHOSEN';
