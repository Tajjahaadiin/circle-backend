-- CreateIndex
CREATE INDEX "follows_followedId_idx" ON "follows"("followedId");

-- CreateIndex
CREATE INDEX "follows_followingId_idx" ON "follows"("followingId");
