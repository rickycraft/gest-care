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