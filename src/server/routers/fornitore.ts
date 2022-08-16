import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"

const defaultFornitoreSelect = Prisma.validator<Prisma.FornitoreSelect>()({
  id: true,
  nome: true,
})

export const fornitoreRouter = createProtectedRouter()
  .query("list", {
    input: z.any(),
    async resolve() {
      const fornitori = await prisma.fornitore.findMany({
        where: {},
        select: defaultFornitoreSelect,
      })
      if (!fornitori) throw new TRPCError({ code: "NOT_FOUND" })
      return fornitori
    }
  })


  const fornitoreSchema = z.object({
    id: z.number().nullable(),
    nome: z.string(),
  })
  
  export type fornitoreType = z.infer<typeof fornitoreSchema>