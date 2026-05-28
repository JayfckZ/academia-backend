/*
  Warnings:

  - You are about to drop the column `active` on the `Enrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,planId,status]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "active",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_planId_status_key" ON "Enrollment"("studentId", "planId", "status");
