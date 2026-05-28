/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "registrationNumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_registrationNumber_key" ON "Student"("registrationNumber");

-- CreateIndex
CREATE INDEX "Student_name_idx" ON "Student"("name");
