import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "server/iron"
import { prisma } from 'server/prisma'
import { z } from "zod"

const credSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export default withSessionRoute(
  async function loginRoute(req: NextApiRequest, res: NextApiResponse<{isLoggedIn: boolean}>) {
    // console.log('[DBG LOGIN]body: '+req.body.username+' '  + req.body.password)
    const cred = credSchema.safeParse(req.body)
    if (!cred.success) {
      res.status(400).end()
      return
    }
    const findUser = await prisma.user.findFirst({
      where: {
        username: cred.data.username,
        password: cred.data.password,
      },
      select: {
        id: true,
        username: true,
      }, 
    })
    if (!findUser) {
      res.send({ isLoggedIn:false })
      return
    }
    const user = {
      id: findUser.id,
      username: findUser.username,
      isLoggedIn: true,
    }
    req.session.user = user 
    await req.session.save()
    res.send({isLoggedIn:true})
  },
)