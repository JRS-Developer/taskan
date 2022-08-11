import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db/client";

export const columnsRouter = createProtectedRouter().mutation("createOne", {
  input: z.object({
    name: z.string().min(1),
    boardId: z.string().uuid(),
  }),
  async resolve({ input }) {
    // check if the board exits
    const board = await prisma.board.findUnique({
      where: {
        id: input.boardId,
      },
    });

    if (!board) {
      throw new TRPCError({
        message: "The board doesn't exits",
        code: "NOT_FOUND",
      });
    }

    // create column
    const column = await prisma.boardList.create({
      data: input,
    });

    return column;
  },
});
