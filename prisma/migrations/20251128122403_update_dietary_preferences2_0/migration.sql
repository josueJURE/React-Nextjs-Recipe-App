/*
  Warnings:

  - You are about to drop the column `vegan` on the `session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "session" DROP COLUMN "vegan";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "vegan" BOOLEAN NOT NULL DEFAULT false;
