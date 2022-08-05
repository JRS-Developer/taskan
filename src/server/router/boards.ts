import { createProtectedRouter } from "./protected-router";
import { prisma } from "@/server/db/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const boardsRouter = createProtectedRouter()
  .query("getAll", {
    async resolve({ ctx: { session } }) {
      if (!session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged to see your boards",
        });
      }

      return await prisma.board.findMany({
        where: {
          creatorId: session.user.id,
        },
      });
    },
  })
  .mutation("createOne", {
    input: z.object({
      title: z.string(),
      cover: z.string().optional(),
      description: z.string().optional(),
      isPrivate: z.boolean().default(true),
    }),
    async resolve({ ctx: { session }, input }) {
      if (!session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged to create a new board",
        });
      }

      const board = await prisma.board.create({
        data: {
          ...input,
          creator: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      return board;
    },
  });
