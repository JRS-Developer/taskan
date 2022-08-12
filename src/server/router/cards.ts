import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import { TRPCError } from "@trpc/server";
import getLastPosition from "@/utils/getLastPosition";

export const cardsRouter = createProtectedRouter().mutation("createOne", {
  input: z.object({
    columnId: z.string().uuid(),
    name: z.string().min(1),
  }),
  async resolve({ input }) {
    const boardColumn = await prisma.boardList.findUnique({
      where: {
        id: input.columnId,
      },
      include: {
        cards: true,
      },
    });

    // check that the boardColumn exits
    if (!boardColumn)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The board column doesn't exist",
      });

    // get last position
    const lastPosition = getLastPosition(boardColumn.cards);

    const card = await prisma.card.create({
      data: {
        name: input.name,
        boardListId: input.columnId,
        position: lastPosition + 1,
      },
    });

    return card;
  },
});
