import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"

const defaultPersSelect = Prisma.validator<Prisma.PersonalizzazioneSelect>()({
  id: true,
  nome: true,
  prezzo: true,
})

const insertPersSchema = z.object({
  listino: z.number(),
  nome: z.string(),
  prezzo: z.number(),
})
export type insertPersType = z.infer<typeof insertPersSchema>

const updatePersSchema = z.object({
  id: z.number(),
  prezzo: z.number(),
})
export type updatePersType = z.infer<typeof updatePersSchema>

export const persRouter = createProtectedRouter()
  .query("byId", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input
      const pers = await prisma.personalizzazione.findFirst({
        where: {
          id
        },
        select: defaultPersSelect,
      })
      if (!pers) throw new TRPCError({ code: "NOT_FOUND" })
      return pers
    }
  })
  .query("list", {
    input: z.object({
      listino: z.number(),
    }),
    async resolve({ input }) {
      const { listino } = input
      const pers = await prisma.personalizzazione.findMany({
        where: {
          listinoId: listino
        },
        select: defaultPersSelect,
        orderBy: {
          nome: "asc",
        },
      })
      if (!pers) throw new TRPCError({ code: "NOT_FOUND" })
      return pers
    }
  })
  .mutation("insert", {
    input: insertPersSchema,
    async resolve({ input }) {
      try {
        const pers = await prisma.personalizzazione.create({
          data: {
            listinoId: input.listino,
            nome: input.nome.toLowerCase(),
            prezzo: input.prezzo,
          },
          select: defaultPersSelect,
        })
        return pers
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
    }
  })
  .mutation("update", {
    input: updatePersSchema,
    async resolve({ input }) {
      try {
        const pers = await prisma.personalizzazione.update({
          data: {
            prezzo: input.prezzo,
          },
          where: {
            id: input.id
          },
          select: defaultPersSelect,
        })
        return pers
      } catch {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
    }
  })
  .mutation("delete", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input
      const pers = await prisma.personalizzazione.delete({
        where: {
          id
        },
        select: defaultPersSelect,
      })
      if (!pers) throw new TRPCError({ code: "NOT_FOUND" })
      return
    }
  })
