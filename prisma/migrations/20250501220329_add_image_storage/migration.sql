/*
  Warnings:

  - You are about to drop the column `reasonForRejection` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `userSettingId` on the `File` table. All the data in the column will be lost.
  - The `fileCategory` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `approvedApps` on the `MonthlyHistory` table. All the data in the column will be lost.
  - You are about to drop the column `pendingApps` on the `MonthlyHistory` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedApps` on the `MonthlyHistory` table. All the data in the column will be lost.
  - You are about to drop the column `totalApps` on the `MonthlyHistory` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Notification` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `college` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `failedLoginAttempts` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isLocked` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lockUntil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetExpires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `User` table. All the data in the column will be lost.
  - The primary key for the `ValidStudent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `ValidStudent` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `ValidStudent` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `ValidStudent` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ValidStudent` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `ValidStudent` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `ValidStudent` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `ValidStudent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ValidStudent` table. All the data in the column will be lost.
  - You are about to drop the column `approvedApps` on the `YearlyHistory` table. All the data in the column will be lost.
  - You are about to drop the column `pendingApps` on the `YearlyHistory` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedApps` on the `YearlyHistory` table. All the data in the column will be lost.
  - You are about to drop the column `totalApps` on the `YearlyHistory` table. All the data in the column will be lost.
  - You are about to drop the `IdCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MailCard` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[PhoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[StudentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[StudentId]` on the table `ValidStudent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email]` on the table `ValidStudent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Collage` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Department` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Program` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudentId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileData` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudentId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudentId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Year` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `PhoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `Email` to the `ValidStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FirstName` to the `ValidStudent` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `ValidStudent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `LastName` to the `ValidStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PhoneNumber` to the `ValidStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudentId` to the `ValidStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `ValidStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Year` to the `ValidStudent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('ID_CARD', 'MAIL_CARD');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_studentId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userSettingId_fkey";

-- DropForeignKey
ALTER TABLE "IdCard" DROP CONSTRAINT "IdCard_studentId_fkey";

-- DropForeignKey
ALTER TABLE "MailCard" DROP CONSTRAINT "MailCard_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_studentId_fkey";

-- DropForeignKey
ALTER TABLE "UserSetting" DROP CONSTRAINT "UserSetting_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoles" DROP CONSTRAINT "_UserRoles_B_fkey";

-- DropIndex
DROP INDEX "Application_studentId_idx";

-- DropIndex
DROP INDEX "File_userSettingId_key";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_studentId_key";

-- DropIndex
DROP INDEX "ValidStudent_email_key";

-- DropIndex
DROP INDEX "ValidStudent_studentId_email_idx";

-- DropIndex
DROP INDEX "ValidStudent_studentId_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "reasonForRejection",
DROP COLUMN "studentId",
ADD COLUMN     "Collage" TEXT NOT NULL,
ADD COLUMN     "Department" TEXT NOT NULL,
ADD COLUMN     "Program" TEXT NOT NULL,
ADD COLUMN     "StudentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "filePath",
DROP COLUMN "userSettingId",
ADD COLUMN     "fileData" TEXT NOT NULL,
DROP COLUMN "fileCategory",
ADD COLUMN     "fileCategory" "FileCategory" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "MonthlyHistory" DROP COLUMN "approvedApps",
DROP COLUMN "pendingApps",
DROP COLUMN "rejectedApps",
DROP COLUMN "totalApps",
ADD COLUMN     "Accepted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Pending" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Rejected" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Total" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "studentId",
ADD COLUMN     "StudentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "college",
DROP COLUMN "createdAt",
DROP COLUMN "department",
DROP COLUMN "email",
DROP COLUMN "failedLoginAttempts",
DROP COLUMN "id",
DROP COLUMN "isLocked",
DROP COLUMN "lockUntil",
DROP COLUMN "password",
DROP COLUMN "passwordResetExpires",
DROP COLUMN "passwordResetToken",
DROP COLUMN "program",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpires",
DROP COLUMN "studentId",
DROP COLUMN "year",
ADD COLUMN     "Collage" TEXT,
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Department" TEXT,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "FailedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Id" TEXT NOT NULL,
ADD COLUMN     "IsBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "IsLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "LockUntil" TIMESTAMP(3),
ADD COLUMN     "Password" TEXT NOT NULL,
ADD COLUMN     "PasswordResetExpires" TIMESTAMP(3),
ADD COLUMN     "PasswordResetToken" TEXT,
ADD COLUMN     "ProfilePicture" TEXT,
ADD COLUMN     "Program" TEXT,
ADD COLUMN     "ResetToken" TEXT,
ADD COLUMN     "ResetTokenExpires" TIMESTAMP(3),
ADD COLUMN     "StudentId" TEXT NOT NULL,
ADD COLUMN     "Year" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "PhoneNumber" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "ValidStudent" DROP CONSTRAINT "ValidStudent_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "id",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
DROP COLUMN "studentId",
DROP COLUMN "updatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "FirstName" TEXT NOT NULL,
ADD COLUMN     "Id" TEXT NOT NULL,
ADD COLUMN     "LastName" TEXT NOT NULL,
ADD COLUMN     "PhoneNumber" TEXT NOT NULL,
ADD COLUMN     "StudentId" TEXT NOT NULL,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Year" TEXT NOT NULL,
ADD CONSTRAINT "ValidStudent_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "YearlyHistory" DROP COLUMN "approvedApps",
DROP COLUMN "pendingApps",
DROP COLUMN "rejectedApps",
DROP COLUMN "totalApps",
ADD COLUMN     "Accepted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Pending" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Rejected" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Total" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "IdCard";

-- DropTable
DROP TABLE "MailCard";

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "StudentId" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL DEFAULT 'ID_CARD',
    "cardNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingApplication" (
    "id" TEXT NOT NULL,
    "StudentId" TEXT NOT NULL,
    "applicationType" "ApplicationType" NOT NULL,
    "reason" TEXT NOT NULL,
    "Collage" TEXT NOT NULL,
    "Department" TEXT NOT NULL,
    "Program" TEXT NOT NULL,
    "verificationToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationNotifications" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_StudentId_key" ON "Card"("StudentId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardNumber_key" ON "Card"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PendingApplication_verificationToken_key" ON "PendingApplication"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationNotifications_AB_unique" ON "_ApplicationNotifications"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationNotifications_B_index" ON "_ApplicationNotifications"("B");

-- CreateIndex
CREATE INDEX "Application_StudentId_idx" ON "Application"("StudentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_PhoneNumber_key" ON "User"("PhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_StudentId_key" ON "User"("StudentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE INDEX "User_Email_idx" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "ValidStudent_StudentId_key" ON "ValidStudent"("StudentId");

-- CreateIndex
CREATE UNIQUE INDEX "ValidStudent_Email_key" ON "ValidStudent"("Email");

-- CreateIndex
CREATE INDEX "ValidStudent_StudentId_Email_idx" ON "ValidStudent"("StudentId", "Email");

-- AddForeignKey
ALTER TABLE "UserSetting" ADD CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "User"("StudentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "User"("StudentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRoles" ADD CONSTRAINT "_UserRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationNotifications" ADD CONSTRAINT "_ApplicationNotifications_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationNotifications" ADD CONSTRAINT "_ApplicationNotifications_B_fkey" FOREIGN KEY ("B") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
