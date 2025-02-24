/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `avatarUrl` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bannerUrl` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followersCount` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingsCount` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ADD COLUMN     "bannerUrl" TEXT NOT NULL,
ADD COLUMN     "followersCount" TEXT NOT NULL,
ADD COLUMN     "followingsCount" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
