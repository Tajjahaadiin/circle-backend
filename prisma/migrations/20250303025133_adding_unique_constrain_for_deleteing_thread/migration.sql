/*
  Warnings:

  - A unique constraint covering the columns `[threadId,userId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "threads" DROP CONSTRAINT "threads_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "likes_threadId_userId_key" ON "likes"("threadId", "userId");

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
