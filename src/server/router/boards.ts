import { createProtectedRouter } from "./protected-router";
import { prisma } from "@/server/db/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

export const boardsRouter = createProtectedRouter()
  .query("getAll", {
    async resolve({ ctx: { userId } }) {
      const userData = Prisma.validator<Prisma.UserSelect>()({
        id: true,
        name: true,
        image: true,
      });

      return await prisma.board.findMany({
        where: {
          creatorId: userId,
        },
        include: {
          creator: {
            select: userData,
          },
          members: {
            select: {
              isAdmin: true,
              User: {
                select: userData,
              },
            },
          },
        },
      });
    },
  })
  .query("getOneById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx: { userId }, input: { id } }) {
      // get the board
      const board = await prisma.board.findUnique({
        where: {
          id,
        },
        include: {
          members: {
            select: {
              userId: true,
            },
          },
          lists: {
            orderBy: {
              position: "asc",
            },
            include: {
              cards: {
                orderBy: {
                  position: "asc",
                },
                include: {
                  labels: {
                    include: {
                      Label: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // check if the board exits
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "There is no any board with that ID",
        });
      }

      // check if the user owner or member of the board
      const isMember = board.members.find((member) => userId === member.userId);
      const isCreator = board.creatorId === userId;

      // In the case that the board is private
      // Amd yje user is not a member or the owner, then returns an error
      if (board.isPrivate && !isCreator && !isMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not a member or the creator of this board, you can't have access to this board",
        });
      }

      return board;
    },
  })
  .mutation("createOne", {
    input: z.object({
      title: z.string(),
      cover: z.string().optional(),
      description: z.string().optional(),
      isPrivate: z.boolean().default(true),
    }),
    async resolve({ ctx: { userId }, input }) {
      const board = await prisma.board.create({
        data: {
          ...input,
          creator: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return board;
    },
  });
