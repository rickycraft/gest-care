import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { updateEditedAt } from './preventivo'

export const optsRouter = createProtectedRouter()
  .query('list', {
    input: z.object({
      prevId: z.number(),
    }),
    resolve: async ({ input }) => {
      const options = await prisma.preventivoOption.findMany({
        where: { prevId: input.prevId },
        select: {
          option: true,
          selected: true,
        }
      })
      return options.map(opt => ({
        id: opt.option.id,
        selected: opt.selected,
        short: opt.option.short,
        nome: opt.option.nome,
      }))
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
        await prisma.preventivoOption.update({
          where: {
            prevId_prevDefaultOptId: {
              prevId: input.prevId,
              prevDefaultOptId: input.optionId,
            }
          },
          data: { selected: input.selected },
        })
        await updateEditedAt(input.prevId, ctx.user.id)
      } catch {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
    }
  })