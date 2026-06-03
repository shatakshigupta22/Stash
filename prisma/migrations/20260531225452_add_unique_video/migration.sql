/*
  Warnings:

  - A unique constraint covering the columns `[youtubeId,userId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_youtubeId_userId_key" ON "Video"("youtubeId", "userId");
