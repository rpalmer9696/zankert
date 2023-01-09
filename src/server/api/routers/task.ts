import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { prisma } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const taskRouter = createTRPCRouter({
  addTask: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        list_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.task.create({
        data: {
          name: input.name,
          description: input.description,
          list_id: input.list_id,
        },
      });
    }),
  getTasks: protectedProcedure
    .input(z.object({ list_id: z.string() }))
    .query(({ input }) => {
      return prisma.task.findMany({ where: { list_id: input.list_id } });
    }),
  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        list_id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.task.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          list_id: input.list_id,
        },
      });
    }),
  deleteTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.task.delete({
        where: { id: input.id },
      });
    }),
});
