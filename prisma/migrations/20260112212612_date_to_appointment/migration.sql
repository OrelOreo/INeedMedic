/*
  Warnings:

  - You are about to drop the column `endDateTime` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `startDateTime` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `Date` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "appointments_startDateTime_idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "endDateTime",
DROP COLUMN "startDateTime",
ADD COLUMN     "Date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
