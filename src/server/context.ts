import { inferAsyncReturnType } from '@trpc/server'
import { unsealData } from "iron-session"
import * as trpcNext from '@trpc/server/adapters/next'
import { IRON_COOKIE, sessionOptions, sessionSchema } from "./iron"


// auth for server side
export async function createContext({ req, res }: trpcNext.CreateNextContextOptions) {
  if (process.env.NODE_ENV === 'development') {
    return { user: { id: 1, name: 'admin', } }
  }

  const cookie = req.cookies[IRON_COOKIE]
  // check if cookie is present
  if (!cookie) return {}
  const unsealed = await unsealData(cookie, sessionOptions)
  // try parse cookie
  const result = sessionSchema.safeParse(unsealed)
  if (!result.success) return {}
  // return correct user
  return {
    user: result.data.user,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>;

