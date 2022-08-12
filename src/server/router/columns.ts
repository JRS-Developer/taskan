import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db/client";
import getLastPosition from "@/utils/getLastPosition";

export const columnsRouter = createProtectedRouter()
  .mutation("createOne", {
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
        include: {
          lists: true,
        },
      });

      if (!board) {
        throw new TRPCError({
          message: "The board doesn't exits",
          code: "NOT_FOUND",
        });
      }

      // get last position of the columns
      const lastPosition = getLastPosition(board.lists);
      // create column
      const column = await prisma.boardList.create({
        data: {
          ...input,
          position: lastPosition + 1,
        },
      });

      return column;
    },
  })
  .mutation("updateOne", {
    input: z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      position: z.number().optional(),
    }),
    async resolve({ input: { id, ...input } }) {
      const updatedColumn = await prisma.boardList.update({
        where: {
          id,
        },
        data: input,
      });

      return updatedColumn;
    },
  })
  .mutation("deleteById", {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ input: { id } }) {
      // check if the column exits
      const column = await prisma.boardList.findUnique({
        where: {
          id,
        },
      });

      if (!column) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This column doesn't exit",
        });
      }

      // delete column if it exits
      return await prisma.boardList.delete({
        where: {
          id,
        },
      });
    },
  });
