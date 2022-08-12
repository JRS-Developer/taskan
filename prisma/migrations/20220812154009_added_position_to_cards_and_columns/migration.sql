/*
  Warnings:

  - A unique constraint covering the columns `[boardId,position]` on the table `boardlists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[boardListId,position]` on the table `cards` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `boardlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "boardlists" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "boardlists_boardId_position_key" ON "boardlists"("boardId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "cards_boardListId_position_key" ON "cards"("boardListId", "position");
