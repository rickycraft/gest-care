import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { updateEditedAt } from './preventivo'

export const optsRouter = createProtectedRouter()
  // .query('all', {
  //   input: z.any(),
  //   resolve: async () => {
  //     return await prisma.preventivoOption.findMany()
  //   }
  // })
  .query('list', {
    input: z.object({
      prevId: z.number(),
    }),
    resolve: async ({ input }) => {
      return await prisma.preventivo.findFirst({
        where: { id: input.prevId },
        select: {
          options: true
        }
      })
    }
  })
  .mutation('edit', {
    input: z.object({
      prevId: z.number(),
      optionId: z.number(),
      selected: z.boolean(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const preventivo = await prisma.preventivo.update({
          where: {
            id: input.prevId,
          },
          data: {
            options: {
              update: {
                where: { id: input.optionId },
                data: { selected: input.selected },
              },
            },
          },
          select: { id: true },
        })
        await updateEditedAt(input.prevId, ctx.user.id)
        return preventivo
      } catch {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }
  })