import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"

export const listinoRouter = createProtectedRouter()
  .query("list", {
    input: z.any(),
    async resolve() {
      const listni = await prisma.listino.findMany({
        where: {},
        select: {
          id: true,
          nome: true,
          createdAt: true,
          fornitore: true,
        },
        orderBy: {
          nome: "asc",
        },
        take: 5,
      })
      if (!listni) throw new TRPCError({ code: "NOT_FOUND" })
      return listni
    }
  })
  .mutation("insert", {
    input: z.object({
      nome: z.string(),
      fornitore: z.number(),
    }),
    async resolve({ input }) {
      try {
        const listino = await prisma.listino.create({
          data: {
            nome: input.nome,
            fornitore: {
              connect: {
                id: input.fornitore,
              }
            }
          }
        })
        return listino
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
    }
  })