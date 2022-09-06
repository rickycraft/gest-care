import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"

export const ordineById = async (id: number) => {
  const ordine = await prisma.ordine.findFirst({
    where: { id },
    select: {
      id: true,
      totSC: true,
      totRappre: true,
      totComm: true,
      preventivo: {
        select: { nome: true }
      },
      OrdineRow: {
        select: {
          id: true,
          quantity: true,
          prevRow: {
            select: {
              provvigioneSC: true,
              provvigioneRappre: true,
              provvigioneComm: true,
              prodotto: true,
              personalizzazione: true,
            }
          }
        }
      },
    }
  })
  if (!ordine) return null
  const row = ordine.OrdineRow.map(row => ({
    id: row.id,
    prod: row.prevRow.prodotto.nome,
    quantity: row.quantity,
    costo: row.prevRow.prodotto.prezzo.add(row.prevRow.personalizzazione.prezzo),
    sc: row.prevRow.provvigioneSC,
    comm: row.prevRow.provvigioneComm,
    rappre: row.prevRow.provvigioneRappre,
  }))
  return {
    ...ordine,
    OrdineRow: row,
  }
}

export const ordineTotal = async (id: number) => {
  const ordine = await ordineById(id)
  if (!ordine) throw new TRPCError({ code: "BAD_REQUEST" })
  const rows = ordine.OrdineRow.map(row => {
    const costo = row.costo.mul(row.quantity)
    const sc = row.sc.mul(row.quantity)
    const comm = row.comm.mul(row.quantity)
    const rappre = row.rappre.mul(row.quantity)
    const qt = row.quantity
    return {
      costo, sc, rappre, comm, qt,
      tot: costo.add(sc).add(comm).add(rappre),
    }
  })
  if (rows.length == 0) throw new TRPCError({ code: "BAD_REQUEST" })
  const totals = rows.reduce((acc, row) => {
    acc.qt += row.qt
    acc.costo = acc.costo.add(row.costo)
    acc.sc = acc.sc.add(row.sc)
    acc.rappre = acc.rappre.add(row.rappre)
    acc.comm = acc.comm.add(row.comm)
    acc.tot = acc.tot.add(row.tot)
    return acc
  })
  return {
    qt: totals.qt,
    costo: totals.costo.toNumber(),
    sc: totals.sc.toNumber(),
    comm: totals.comm.toNumber(),
    rappre: totals.rappre.toNumber(),
    tot: totals.tot.toNumber(),
  }
}

export const ordineRouter = createProtectedRouter()
  .query("byId", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const ordine = await ordineById(input.id)
      if (!ordine) throw new TRPCError({ code: "BAD_REQUEST" })
      return {
        ...ordine,
        OrdineRow: ordine.OrdineRow.map(row => ({
          ...row,
          costo: row.costo.toNumber(),
          sc: row.sc.toNumber(),
          comm: row.comm.toNumber(),
          rappre: row.comm.toNumber(),
        })),
      }
    }
  })
  .query("totals", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      return await ordineTotal(input.id)
    }
  })
  .query("list", {
    input: z.any(),
    async resolve() {
      const ordineList = await prisma.ordine.findMany({
        select: {
          id: true,
          totSC: true,
          preventivo: {
            select: { id: true, nome: true }
          }
        },
        take: 10,
        orderBy: {
          id: "desc"
        }
      })
      return ordineList.map(o => ({
        ...o,
        sc: o.totSC.toNumber(),
      }))
    }
  })
  .mutation("create", {
    input: z.object({
      preventivoId: z.number(),
    }),
    async resolve({ input }) {
      try {
        const rows = await prisma.preventivoRow.findMany({
          where: { preventivoId: input.preventivoId },
          select: { id: true }
        })
        const ordine = await prisma.ordine.create({
          data: {
            preventivo: { connect: { id: input.preventivoId } },
          }
        })
        await prisma.ordineRow.createMany({
          data: rows.map(row => ({
            preventivoRowId: row.id,
            ordineId: ordine.id
          }))
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
  .mutation("delete", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      try {
        return await prisma.ordine.delete({
          where: { id: input.id }
        })
      }
      catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })