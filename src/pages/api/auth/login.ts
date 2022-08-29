import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "server/iron"
import { prisma } from 'server/prisma'
import { z } from "zod"
import bcrypt from 'bcrypt'

const credSchema = z.object({
  username: z.string(),
  password: z.string(),
})

const loginResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.string(),
  isLoggedIn: z.boolean(),
})
type loginResponse = z.infer<typeof loginResponseSchema>

export default withSessionRoute(
  async function loginRoute(req: NextApiRequest, res: NextApiResponse<loginResponse | { isLoggedIn: boolean }>) {
    const cred = credSchema.safeParse(req.body)
    if (!cred.success) {
      res.status(400).end()
      return
    }
    const findUser = await prisma.user.findFirst({
      where: { username: cred.data.username },
    })
    if (!findUser) {
      res.send({ isLoggedIn: false })
      return
    }
    const valid = await bcrypt.compare(cred.data.password, findUser.password)
    if (!valid) {
      res.send({ isLoggedIn: false })
      return
    }
    const user: loginResponse = {
      id: findUser.id,
      username: findUser.username,
      role: findUser.role,
      isLoggedIn: true,
    }
    req.session.user = user
    await req.session.save()
    res.send(user)
  },
)