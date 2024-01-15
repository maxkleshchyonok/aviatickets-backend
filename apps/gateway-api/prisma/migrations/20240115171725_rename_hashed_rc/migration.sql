/*
  Warnings:

  - You are about to drop the column `reset_token` on the `devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "reset_token",
ADD COLUMN     "hashedResetCode" TEXT;
