import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import { TRPCError } from "@trpc/server";
import getLastPosition from "@/utils/getLastPosition";
import { Prisma } from "@prisma/client";

const CardInclude = Prisma.validator<Prisma.CardInclude>()({
  boardList: true,
});

const showCardNotFound = () =>
  new TRPCError({
    message: "The card doesn't exist",
    code: "NOT_FOUND",
  });

export const cardsRouter = createProtectedRouter()
  .query("getOneById", {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ input }) {
      const card = await prisma.card.findUnique({
        where: {
          id: input.id,
        },
        include: CardInclude,
      });

      // returns error if the card doesn't exit
      if (!card) throw showCardNotFound();

      return card;
    },
  })
  .mutation("createOne", {
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
  })
  .mutation("updateOne", {
    input: z.object({
      id: z.string().uuid(),
      name: z.string().optional(),
      cover: z.string().url().optional(),
      description: z.string().optional(),
    }),
    async resolve({ input: { id, ...input } }) {
      const card = await prisma.card.findUnique({
        where: {
          id: id,
        },
      });

      // check that the card exist
      if (!card) throw showCardNotFound();

      // update card
      const updatedCard = await prisma.card.update({
        where: {
          id: id,
        },
        data: input,
        include: CardInclude,
      });

      return updatedCard;
    },
  });
