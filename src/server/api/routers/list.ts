import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { prisma } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const listRouter = createTRPCRouter({
  getLists: protectedProcedure
    .input(
      z.object({
        board_id: z.string(),
      })
    )
    .query(({ input }) => {
      return prisma.list.findMany({ where: { board_id: input.board_id } });
    }),
  addList: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        board_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.list.create({
        data: {
          name: input.name,
          board_id: input.board_id,
        },
      });
    }),
});
