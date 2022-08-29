import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'server/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'

const signupSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  role: z.string(),
})

export default async function Signup(req: NextApiRequest, res: NextApiResponse) {
  // only allow in dev for now
  if (process.env.NODE_ENV != 'development') return res.status(403).end()
  // parse body
  const cred = signupSchema.safeParse(req.body)
  if (!cred.success) {
    res.status(400).end()
    return
  }
  // hash password
  try {
    const hash = await bcrypt.hash(cred.data.password, 10)
    const data = {
      username: cred.data.username,
      password: hash,
      role: cred.data.role,
    }
    var user: User
    if (cred.data.id === undefined) {
      user = await prisma.user.create({ data })
    } else {
      user = await prisma.user.update({
        where: { id: cred.data.id },
        data,
      })
    }
    res.status(200).end()
  } catch {
    res.status(500).end()
  }
}