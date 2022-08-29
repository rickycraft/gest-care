import { createProtectedRouter } from "server/createRouter"
import { z } from 'zod'
import { prisma } from 'server/prisma'
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"
import { canEditUser } from 'utils/role'
import bcrypt from 'bcrypt'

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
})

export const authRouter = createProtectedRouter()
  .query('listUser', {
    input: z.any(),
    resolve: async () => {
      return await prisma.user.findMany({
        select: defaultUserSelect,
      })
    }
  })
  .mutation('editUser', {
    input: z.object({
      username: z.string(),
      password: z.string(),
      role: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      if (!canEditUser(ctx.user.role)) throw new TRPCError({ code: 'UNAUTHORIZED' })
      const _user = await prisma.user.findFirst({ where: { username: input.username } })
      try {
        const hash = await bcrypt.hash(input.password, 10)
        const data = {
          username: input.username,
          password: hash,
          role: input.role,
        }
        if (_user === null) {
          return await prisma.user.create({ data })
        } else {
          return await prisma.user.update({
            where: { id: _user.id },
            data,
          })
        }
      } catch {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }
  })

  // })

/*
  const _user = await prisma.user.findFirst({ where: { username: cred.data.username } })
// hash password
try {
  const hash = await bcrypt.hash(cred.data.password, 10)
  const data = {
    username: cred.data.username,
    password: hash,
    role: cred.data.role,
  }
  var user: User
  if (_user === null) {
    user = await prisma.user.create({ data })
  } else {
    user = await prisma.user.update({
      where: { id: _user.id },
      data,
    })
  }
  res.status(200).end()
} catch {
  res.status(500).end()
}*/