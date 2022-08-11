import type { User } from './user'
import { trpc } from 'utils/trpc'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(loginRoute, sessionOptions)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { body } = await req.body;
  console.log('req.body.username: '+body.username)
  // const user = req.session.user
  // console.log('check user session: '+user)

  // if(user!=undefined ){
  // if (!user || user.isLoggedIn === false) {
  //   res.status(401).end()
  //   return
  // }
  // }
  // get user from prisma
  try {
    const findUser= trpc.useQuery(['user.byUsername', { username: body.username }])
    if (!findUser.isSuccess) { //controllo che i dati di ritorno siano validi
      console.log('user not found: '+findUser)

      // return ()
    }
    else{
      const user = { 
        isLoggedIn:true,
        id: findUser.data.id,
        username: findUser.data.username
        } as User
      req.session.user = user
      await req.session.save();
      console.log(user)
      res.json(user)
      return res
      }
    // const findUser = await getUserByUsername(req.body.username)
    // console.log('finduser: '+findUser)
    
    // .user.findMany({
    //   where: {
    //     username: req.body.username
    //   },
    //   select: {
    //     id: true,
    //     username: true
    //   }
    // })
  } catch (error) {
        res.status(200).json(body)
  }

}