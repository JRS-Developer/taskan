import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { prisma } from "@/server/db/client";

export const cardsRouter = createProtectedRouter().mutation("createOne", {
  input: z.object({
    columnId: z.string().uuid(),
    name: z.string().min(1),
  }),
  async resolve({ input }) {
    const card = await prisma.card.create({
      data: {
        name: input.name,
        boardListId: input.columnId,
      },
    });

    return card;
  },
});
