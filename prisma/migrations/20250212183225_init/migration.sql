-- DropIndex
DROP INDEX "Role_name_key";

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET DEFAULT 'STUDENT';

-- AlterTable
ALTER TABLE "UserSetting" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';
