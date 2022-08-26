import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { updateEditedAt } from './preventivo'

const rowSchema = {
  prevId: z.number(),
  provSc: z.number(),
  provRappre: z.number(),
  provComm: z.number(),
  prodId: z.number(),
  persId: z.number(),
}

const insertRowSchema = z.object(rowSchema)
export type insertPrevRow = z.infer<typeof insertRowSchema>

const updateRowSchema = z.object({
  id: z.number(),
  ...rowSchema,
})
export type updatePrevRow = z.infer<typeof updateRowSchema>

export const rowRouter = createProtectedRouter()
  .query('list', {
    input: z.object({
      prevId: z.number(),
    }),
    resolve: async ({ input }) => {
      return await prisma.preventivoRow.findMany({
        where: { preventivo: { id: input.prevId } },
      })
    }
  })
  .mutation('insert', {
    input: insertRowSchema,
    resolve: async ({ input, ctx }) => {
      try {
        const preventivo = await prisma.preventivoRow.create({
          data: {
            preventivo: { connect: { id: input.prevId } },
            prodotto: { connect: { id: input.prodId } },
            personalizzazione: { connect: { id: input.persId } },
            provvigioneSC: input.provSc,
            provvigioneRappre: input.provRappre,
            provvigioneComm: input.provComm,
          },
        })
        await updateEditedAt(input.prevId, ctx.user.id)
        return preventivo
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('update', {
    input: updateRowSchema,
    resolve: async ({ input, ctx }) => {
      try {
        const preventivo = await prisma.preventivoRow.update({
          where: { id: input.id },
          data: {
            prodotto: { connect: { id: input.prodId } },
            personalizzazione: { connect: { id: input.persId } },
            provvigioneSC: input.provSc,
            provvigioneRappre: input.provRappre,
            provvigioneComm: input.provComm,
          },
        })
        await updateEditedAt(input.prevId, ctx.user.id)
        return preventivo
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input, ctx }) => {
      try {
        const row = await prisma.preventivoRow.delete({
          where: { id: input.id },
        })
        await updateEditedAt(row.preventivoId, ctx.user.id)
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })