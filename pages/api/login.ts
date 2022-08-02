import type { User } from './user'

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(loginRoute, sessionOptions)


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user
  console.log(user)

  if (!user || user.isLoggedIn === false) {
    res.status(401).end()
    return
  }

  // get user from prisma
  try {
    const findUser = await prisma.user.findMany({
      where: {
        username: req.body.username
      },
      select: {
        id: true,
        username: true
      }
    })
  
    const getId = findUser[0].id
    const getUsername = findUser[0].username

    const user = { 
      isLoggedIn:true,
      username: getUsername
      } as User
    req.session.user = user
    await req.session.save();
    console.log(user)
    res.json(user)
  } catch (error) {
        res.status(200).json(user)
  }

}