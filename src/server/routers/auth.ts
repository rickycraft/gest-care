import { createRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
})

export const authRouter = createRouter()
  .query("currentUser", {
    input: z.any(),
    async resolve({ ctx }) {
      const ctxUser = ctx['user']
      if (!ctxUser) return { id: -1, username: '' }
      const user = await prisma.user.findUnique({
        where: { id: ctxUser.id },
        select: defaultUserSelect,
      })
      if (!user) throw new TRPCError({ code: "NOT_FOUND" })
      return user
    }
  })