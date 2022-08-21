import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"

export const scuolaRouter = createProtectedRouter()
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    resolve: async ({ input }) => {
      try {
        return await prisma.scuola.findFirst({
          where: { id: input.id }
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .query("list", {
    input: z.any(),
    async resolve() {
      return await prisma.scuola.findMany({
        where: {},
      })
    }
  })