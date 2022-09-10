import { TRPCError } from "@trpc/server"
import { createProtectedRouter } from "server/createRouter"
import { prisma } from 'server/prisma'
import { z } from 'zod'

export const listinoRouter = createProtectedRouter()
  .query("list", {
    input: z.any(),
    async resolve() {
      const listini = await prisma.listino.findMany({
        where: {},
        select: {
          id: true,
          nome: true,
          createdAt: true,
          fornitore: true,
        },
        orderBy: {
          id: "desc",
        },
        take: 5,
      })
      return listini
    }
  })
  .query("byId", {
    input: z.object({
      id: z.number()
    }),
    async resolve({ input }) {
      return await prisma.listino.findFirst({
        where: { id: input.id },
        select: {
          id: true,
          nome: true,
          createdAt: true,
          fornitore: true,
        },
      })
    }
  })
  .mutation("insert", {
    input: z.object({
      nome: z.string(),
      fornitore: z.number(),
    }),
    async resolve({ input }) {
      try {
        await prisma.listino.create({
          data: {
            nome: input.nome.trim(),
            fornitore: {
              connect: {
                id: input.fornitore,
              }
            }
          }
        })
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
    }
  })
  .mutation("update", {
    input: z.object({
      id: z.number(),
      nome: z.string(),
    }),
    async resolve({ input }) {
      try {
        return await prisma.listino.update({
          where: { id: input.id },
          data: {
            nome: input.nome.trim(),
          }
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation("delete", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      try {
        return await prisma.listino.delete({
          where: { id: input.id },
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })