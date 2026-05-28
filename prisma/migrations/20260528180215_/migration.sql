/*
  Warnings:

  - You are about to drop the column `durationMonths` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `duration` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationType` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanDurationType" AS ENUM ('DAYS', 'WEEKS', 'MONTHS');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('ADMIN', 'MANAGER', 'RECEPTION', 'TRAINER');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "EmployeeRole" NOT NULL;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "durationMonths",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "durationType" "PlanDurationType" NOT NULL;

-- CreateIndex
CREATE INDEX "Employee_role_idx" ON "Employee"("role");
