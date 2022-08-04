import { createProtectedRouter } from "./protected-router";
import { prisma } from "@/server/db/client";

export const boardsRouter = createProtectedRouter()
  .query("getAll", {
    resolve({ ctx }) {
      return [];
    },
  })
  .mutation("createBoard", {
    async resolve({ ctx: { session } }) {
      //   const response = prisma.board.create()
    },
  });
