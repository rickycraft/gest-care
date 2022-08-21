import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"
import { rowRouter } from './preventivo_row'

const defaultPrevSelect = Prisma.validator<Prisma.PreventivoSelect>()({
  id: true,
  createdAt: true,
  nome: true,

  scuola: true,
  rows: true,
  listino: true,
  lastEditedBy: true,
})

const insertPrevSchema = z.object({
  nome: z.string(),
  listino: z.number(),
  scuola: z.number(),
})
export type insertPrevType = z.infer<typeof insertPrevSchema>

export const prevRouter = createProtectedRouter()
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    resolve: async ({ input }) => {
      return await prisma.preventivo.findFirst({
        where: { id: input.id },
        select: defaultPrevSelect,
      })
    }
  })
  .query('list', {
    input: z.any(),
    resolve: async () => {
      return await prisma.preventivo.findMany({
        select: defaultPrevSelect,
        take: 10,
        orderBy: {
          createdAt: "desc",
        }
      })
    }
  })
  .mutation('insert', {
    input: insertPrevSchema,
    resolve: async ({ input, ctx }) => {
      try {
        return await prisma.preventivo.create({
          data: {
            nome: input.nome,
            scuola: { connect: { id: input.scuola } },
            listino: { connect: { id: input.listino } },
            lastEditedBy: { connect: { id: ctx.user.id } },
          },
          select: defaultPrevSelect,
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .merge('row.', rowRouter)