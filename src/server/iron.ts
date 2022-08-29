import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiHandler } from "next"
import { ironSessionOptions } from 'utils/iron'

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, ironSessionOptions)
}

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number
      username: string
      role: string
      isLoggedIn: boolean
    }
  }
}