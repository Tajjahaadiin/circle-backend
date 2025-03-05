/*
  Warnings:

  - Added the required column `content` to the `replies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "content" TEXT NOT NULL;
