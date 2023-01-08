import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { prisma } from "@/server/db";
import { TRPCError } from "@trpc/server";

type Board = {
  id: string;
  name: string;
  user_id: string;
};

export const boardRouter = createTRPCRouter({
  addBoard: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The email provided does not exist.",
        });
      }

      return prisma.board.create({
        data: {
          name: input.name,
          user_id: user.id,
        },
      });
    }),
  getBoards: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input }): Promise<Board[]> => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The email provided does not exist.",
        });
      }

      return prisma.board.findMany({ where: { user_id: user.id } });
    }),
  getBoard: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma.board.findUnique({ where: { id: input.id } });
    }),
  updateBoard: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(({ input }) => {
      return prisma.board.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      });
    }),
});
