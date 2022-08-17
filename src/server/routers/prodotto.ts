import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"

const defaultProdSelect = Prisma.validator<Prisma.ProdottoSelect>()({
  id: true,
  nome: true,
  prezzo: true,
})

const insertProdSchema = z.object({
  listino: z.number(),
  nome: z.string(),
  prezzo: z.number(),
})
export type insertProdType = z.infer<typeof insertProdSchema>

const updateProdSchema = z.object({
  id: z.number(),
  prezzo: z.number(),
})
export type updateProdType = z.infer<typeof updateProdSchema>

export const prodRouter = createProtectedRouter()
  .query("byId", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input
      const prodotto = await prisma.prodotto.findFirst({
        where: {
          id
        },
        select: defaultProdSelect,
      })
      if (!prodotto) throw new TRPCError({ code: "NOT_FOUND" })
      return prodotto
    }
  })
  .query("list", {
    input: z.object({
      listino: z.number(),
    }),
    async resolve({ input }) {
      const { listino } = input
      const prodotto = await prisma.prodotto.findMany({
        where: {
          listinoId: listino
        },
        select: defaultProdSelect,
        orderBy: {
          nome: "asc",
        },
      })
      if (!prodotto) throw new TRPCError({ code: "NOT_FOUND" })
      return prodotto
    }
  })
  .mutation("insert", {
    input: insertProdSchema,
    async resolve({ input }) {
      try {
        const prodotto = await prisma.prodotto.create({
          data: {
            listinoId: input.listino,
            nome: input.nome,
            prezzo: input.prezzo,
          },
          select: defaultProdSelect,
        })
        return prodotto
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
    }
  })
  .mutation("update", {
    input: updateProdSchema,
    async resolve({ input }) {
      try {
        const prodotto = await prisma.prodotto.update({
          data: {
            prezzo: input.prezzo,
          },
          where: {
            id: input.id
          },
          select: defaultProdSelect,
        })
        return prodotto
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
      const prodotto = await prisma.prodotto.delete({
        where: {
          id
        },
        select: defaultProdSelect,
      })
      if (!prodotto) throw new TRPCError({ code: "NOT_FOUND" })
      return
    }
  })
