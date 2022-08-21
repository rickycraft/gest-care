import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"

const rowSchema = {
  prevId: z.number(),
  provSc: z.number(),
  provRappre: z.number(),
  provComm: z.number(),
  prodId: z.number(),
  persId: z.number(),
}

const insertRowSchema = z.object(rowSchema)

const updateRowSchema = z.object({
  id: z.number(),
  ...rowSchema,
})

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
    resolve: async ({ input }) => {
      try {
        return await prisma.preventivoRow.create({
          data: {
            preventivo: { connect: { id: input.prevId } },
            prodotto: { connect: { id: input.prodId } },
            personalizzazione: { connect: { id: input.persId } },
            provvigioneSC: input.provSc,
            provvigioneRappre: input.provRappre,
            provvigioneComm: input.provComm,
          },
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('update', {
    input: updateRowSchema,
    resolve: async ({ input }) => {
      try {
        return await prisma.preventivoRow.update({
          where: { id: input.id },
          data: {
            prodotto: { connect: { id: input.prodId } },
            personalizzazione: { connect: { id: input.persId } },
            provvigioneSC: input.provSc,
            provvigioneRappre: input.provRappre,
            provvigioneComm: input.provComm,
          },
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })