import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"
import { rowRouter } from './preventivo_row'

const prevSelect = {
  id: true,
  nome: true,
  scuola: true,
  listino: true,
  lastEditedBy: true,
}
const defaultPrevSelect = Prisma.validator<Prisma.PreventivoSelect>()(prevSelect)

const prevSchema = {
  nome: z.string(),
  listino: z.number(),
  scuola: z.number(),
}

const insertPrevSchema = z.object(prevSchema)
export type insertPrevType = z.infer<typeof insertPrevSchema>

const updatePrevSchema = z.object({
  id: z.number(),
  ...prevSchema,
})
export type updatePrevType = z.infer<typeof updatePrevSchema>


export const prevRouter = createProtectedRouter()
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    resolve: async ({ input }) => {
      return await prisma.preventivo.findFirst({
        where: { id: input.id },
        select: {
          ...prevSelect,
          rows: true,
        }
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
          select: defaultPrevSelect
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('update', {
    input: updatePrevSchema,
    resolve: async ({ input, ctx }) => {
      try {
        return await prisma.preventivo.update({
          where: { id: input.id },
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
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input, ctx }) => {
      try {
        return await prisma.preventivo.delete({
          where: { id: input.id },
          select: {},
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .merge('row.', rowRouter)