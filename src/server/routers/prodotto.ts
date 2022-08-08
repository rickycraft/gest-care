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

const prodSchema = z.object({
  id: z.number().nullable(),
  fornitore: z.number(),
  nome: z.string(),
  prezzo: z.number(),
})

type prodType = z.infer<typeof prodSchema>

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
      fornitore: z.number(),
    }),
    async resolve({ input }) {
      const { fornitore } = input
      const prodotto = await prisma.prodotto.findMany({
        where: {
          fornitoreId: fornitore
        },
        select: defaultProdSelect,
      })
      if (!prodotto) throw new TRPCError({ code: "NOT_FOUND" })
      return prodotto
    }
  })
  .mutation("upsert", {
    input: prodSchema,
    async resolve({ input }) {
      try {
        const prodotto = await upsertProd(input)
        return prodotto
      } catch {
        if (input.id === null) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
        } else {
          throw new TRPCError({ code: "NOT_FOUND" })
        }

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

async function upsertProd(prod: prodType) {
  if (prod.id === null) {
    // create
    return await prisma.prodotto.create({
      data: {
        fornitoreId: prod.fornitore,
        nome: prod.nome,
        prezzo: prod.prezzo,
      },
      select: defaultProdSelect,
    })
  }

  // update
  return await prisma.prodotto.update({
    where: {
      id: prod.id
    },
    data: {
      fornitoreId: prod.fornitore,
      nome: prod.nome,
      prezzo: prod.prezzo,
    },
    select: defaultProdSelect,
  })
}