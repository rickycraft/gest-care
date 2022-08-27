import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"
import { rowRouter } from './preventivo_row'
import { optsRouter } from './preventivo_opts'

const prevSelect = {
  id: true,
  nome: true,
  scuola: true,
  listinoId: true,
  lastEditedBy: true,
  editedAt: true,
  locked: true,
}
const defaultPrevSelect = Prisma.validator<Prisma.PreventivoSelect>()(prevSelect)

const prevSchema = {
  nome: z.string(),
  listino: z.number(),
  scuola: z.string(),
}

const insertPrevSchema = z.object(prevSchema)
export type insertPrevType = z.infer<typeof insertPrevSchema>

const updatePrevSchema = z.object({
  id: z.number(),
  ...prevSchema,
})
export type updatePrevType = z.infer<typeof updatePrevSchema>

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
          ...prevSelect,
          rows: true,
        }
      })
    }
  })
  .query('list', {
    input: z.any(),
    resolve: async () => {
      return await prisma.preventivo.findMany({
        select: {
          id: true,
          nome: true,
          scuola: true,
          listino: {
            select: {
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
    input: insertPrevSchema,
    resolve: async ({ input, ctx }) => {
      try {
        const opts = await prisma.preventivoOption.findMany()
        const preventivo = await prisma.preventivo.create({
          data: {
            nome: input.nome,
            scuola: input.scuola,
            listino: { connect: { id: input.listino } },
            lastEditedBy: { connect: { id: ctx.user.id } },
            editedAt: new Date(),
            options: {
              connect: opts.map(opt => ({ id: opt.id })),
            }
          },
          select: defaultPrevSelect
        })
        return preventivo
      } catch (e) {
        console.error(e)
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .mutation('update', {
    input: updatePrevSchema,
    resolve: async ({ input, ctx }) => {
      try {
        await isLocked(input.id)
        return await prisma.preventivo.update({
          where: { id: input.id },
          data: {
            nome: input.nome,
            scuola: input.scuola,
            listino: { connect: { id: input.listino } },
            lastEditedBy: { connect: { id: ctx.user.id } },
          },
          select: defaultPrevSelect,
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
        return await prisma.preventivo.delete({
          where: { id: input.id },
          select: defaultPrevSelect,
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
        })
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
    }
  })
  .merge('row.', rowRouter)
  .merge('opts.', optsRouter)