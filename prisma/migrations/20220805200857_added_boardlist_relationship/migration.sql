-- AlterTable
ALTER TABLE "boardlists" ADD COLUMN     "boardId" TEXT;

-- AddForeignKey
ALTER TABLE "boardlists" ADD CONSTRAINT "boardlists_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
