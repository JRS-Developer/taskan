/*
  Warnings:

  - You are about to drop the column `cover` on the `boards` table. All the data in the column will be lost.
  - You are about to drop the column `cover` on the `cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boards" DROP COLUMN "cover",
ADD COLUMN     "coverId" TEXT;

-- AlterTable
ALTER TABLE "cards" DROP COLUMN "cover",
ADD COLUMN     "coverId" TEXT;

-- CreateTable
CREATE TABLE "Cover" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "blur_hash" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "Cover_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Cover"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Cover"("id") ON DELETE SET NULL ON UPDATE CASCADE;
