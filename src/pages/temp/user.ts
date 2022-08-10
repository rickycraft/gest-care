import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from "server/iron"
import { NextApiRequest, NextApiResponse } from 'next'
import { trpc } from 'utils/trpc'

export type User = {
  isLoggedIn: boolean
  username: string
  id: number
}

export default withIronSessionApiRoute(userRoute, sessionOptions)

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    const username= trpc.useQuery(['user.byUsername', req.body.username])
    console.log('getUserbyUsername '+username)
    res.json({
      isLoggedIn: true,
      username: req.session.user.username,
      id: req.session.user.id
    })
  } else {
    res.json({
      isLoggedIn: false,
      username: '',
      id: -1 //ATT da cambiare
    })
  }
}
