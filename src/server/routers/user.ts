import { createRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
})

export const userRouter = createRouter()
  .query("byId", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input
      const user = await prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      })
      if (!user) throw new TRPCError({ code: "NOT_FOUND" })
      return user
    }
  })
  .query("byUsername", {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input }) {
      const { username } = input
      const user = await prisma.user.findUnique({
        where: { username },
        select: defaultUserSelect,
      })
      if (!user) throw new TRPCError({ code: "NOT_FOUND" })
      return user
    }
  })
  .mutation("create", {
    input: z.object({
      username: z.string(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.create({
        data: {
          username: input.username,
          password: input.password,
        },
        select: defaultUserSelect,
      })
      return user
    }
  })
  .mutation("update", {
    input: z.object({
      id: z.number(),
      username: z.string(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const { id, username, password } = input
      const user = await prisma.user.update({
        where: { id },
        data: {
          username,
          password,
        },
        select: defaultUserSelect,
      })
      if (!user) throw new TRPCError({ code: "NOT_FOUND" })
      return user
    }
  })