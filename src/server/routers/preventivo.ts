import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { createProtectedRouter } from "server/createRouter"
import { prisma } from 'server/prisma'
import { canUnlockPreventivo } from 'utils/role'
import { z } from 'zod'
import { optsRouter } from './preventivo_opts'
import { rowRouter } from './preventivo_row'

const selectId = Prisma.validator<Prisma.PreventivoSelect>()({ id: true })

export const updateEditedAt = async (prevId: number, userdId: number) => {
  await prisma.preventivo.update({
    where: { id: prevId },
    data: {
      editedAt: new Date(),
      userId: userdId,
    }
  })
}

export const isLocked = async (prevId: number) => {
  const prev = await prisma.preventivo.findFirst({
    where: { id: prevId },
    select: { locked: true },
  })
  const locked = (prev === null) ? true : prev.locked
  if (locked) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Preventivo locked" })
  }
}

export const prevRouter = createProtectedRouter()
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    resolve: async ({ input }) => {
      return await prisma.preventivo.findFirst({
        where: { id: input.id },
        select: {
          id: true,
          nome: true,
          scuola: true,
          listinoId: true,
          editedAt: true,
          locked: true,
        },
      })
    }
  })
  .query('list', {
    input: z.object({
      search: z.string().optional(),
    }),
    resolve: async ({ input }) => {
      const searchParam = input.search ?? ''
      return await prisma.preventivo.findMany({
        where: {
          OR: [
            { nome: { contains: searchParam } },
            { scuola: { contains: searchParam } },
          ]
        },
        select: {
          id: true,
          nome: true,
          scuola: true,
          listino: {
            select: {
              id: true,
              nome: true,
            },
          },
          lastEditedBy: {
            select: {
              username: true,
            }
          },
          editedAt: true,
          locked: true,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        }
      })
    }
  })
  .mutation('insert', {
    input: z.object({
      nome: z.string(),
      listino: z.number(),
      scuola: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const opts = await prisma.preventivoDefaultOpt.findMany()
        const preventivo = await prisma.preventivo.create({
          data: {
            nome: input.nome,
            scuola: input.scuola,
            listino: { connect: { id: input.listino } },
            lastEditedBy: { connect: { id: ctx.user.id } },
            editedAt: new Date(),
          },
          select: selectId
        })
        await prisma.preventivoOption.createMany({
          data: opts.map(opt => ({
            prevId: preventivo.id,
            prevDefaultOptId: opt.id,
            selected: opt.selected,
          })),
        })
        return preventivo
      } catch (e) {
        console.error(e)
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('update', {
    input: z.object({
      id: z.number(),
      nome: z.string(),
      scuola: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        await isLocked(input.id)
        await prisma.preventivo.update({
          where: { id: input.id },
          data: {
            nome: input.nome,
            scuola: input.scuola,
            lastEditedBy: { connect: { id: ctx.user.id } },
          },
          select: selectId,
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input }) => {
      try {
        await isLocked(input.id)
        await prisma.preventivo.delete({
          where: { id: input.id },
          select: { id: true },
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('lock', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input }) => {
      try {
        await prisma.preventivo.update({
          where: { id: input.id },
          data: { locked: true },
          select: selectId,
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('unlock', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input, ctx }) => {
      if (!canUnlockPreventivo(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN" })
      try {
        await prisma.preventivo.update({
          where: { id: input.id },
          data: { locked: false },
          select: selectId,
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('duplicate', {
    input: z.object({
      id: z.number(),
      nome: z.string()
    }),
    resolve: async ({ input }) => {
      try {
        const preventivo = await prisma.preventivo.findFirstOrThrow({
          where: { id: input.id },
          include: { options: true, rows: true }
        })
        const newPreventivo = await prisma.preventivo.create({
          data: {
            nome: input.nome,
            userId: preventivo.userId,
            scuola: preventivo.scuola,
            listinoId: preventivo.listinoId,
            rows: {
              createMany: {
                data: preventivo.rows.map(row => ({
                  personalizzazioneId: row.personalizzazioneId,
                  prodottoId: row.prodottoId,
                  provvigioneSC: row.provvigioneSC,
                  provvigioneComm: row.provvigioneComm,
                  provvigioneRappre: row.provvigioneRappre,
                }))
              }
            }
          }
        })
        const options = await prisma.preventivoDefaultOpt.findMany()
        await prisma.preventivoOption.createMany({
          data: options.map(opt => ({
            prevId: newPreventivo.id,
            prevDefaultOptId: opt.id,
            selected: opt.selected,
          })),
        })
        return {
          id: newPreventivo.id,
        }
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .merge('row.', rowRouter)
  .merge('opts.', optsRouter)