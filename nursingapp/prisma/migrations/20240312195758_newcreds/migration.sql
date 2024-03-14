-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "first_name" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "last_name" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "netID" TEXT NOT NULL DEFAULT 'null';
