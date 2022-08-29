import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"
import { Decimal } from '@prisma/client/runtime'

export const ordineRouter = createProtectedRouter()
  .query("byId", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const ordine = await prisma.ordine.findFirst({ where: { id: input.id } })
      if (!ordine) throw new TRPCError({ code: "BAD_REQUEST" })
      const _rows = await prisma.preventivoRow.findMany({
        where: { preventivoId: ordine.preventivoId },
        select: {
          OrdineRow: true
        }
      })
      const rows = _rows.map(row => row.OrdineRow)
      return { ...ordine, rows }
    }
  })
  .query("list", {
    input: z.any(),
    async resolve() {
      return await prisma.ordine.findMany({
        select: {
          id: true,
          totSC: true,
          totRappre: true,
          totComm: true,
          preventivo: {
            select: { id: true, nome: true }
          }
        }
      })
    }
  })
  .mutation("create", {
    input: z.object({
      preventivoId: z.number(),
    }),
    async resolve({ input }) {
      try {
        await prisma.ordine.create({
          data: {
            preventivo: { connect: { id: input.preventivoId } },
          }
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation("editTot", {
    input: z.object({
      ordineId: z.number(),
      totSC: z.number(),
      totRappre: z.number(),
      totComm: z.number(),
    }),
    async resolve({ input }) {
      try {
        return await prisma.ordine.update({
          where: { id: input.ordineId },
          data: {
            totSC: input.totSC,
            totRappre: input.totRappre,
            totComm: input.totComm,
          }
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation("editRow", {
    input: z.object({
      rowId: z.number(),
      quantity: z.number(),
    }),
    async resolve({ input }) {
      try {
        return await prisma.ordineRow.update({
          where: { id: input.rowId },
          data: { quantity: input.quantity }
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })