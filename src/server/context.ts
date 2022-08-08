import { inferAsyncReturnType } from '@trpc/server'
import { unsealData } from "iron-session"
import * as trpcNext from '@trpc/server/adapters/next'
import { IRON_COOKIE, sessionOptions, sessionSchema } from "./iron"


// auth for server side
export async function createContext({ req, res }: trpcNext.CreateNextContextOptions) {
  const cookie = req.cookies[IRON_COOKIE]
  if (!cookie) {
    //console.error("No cookie found")
    return {}
  }
  //console.log("session: ", cookie)
  const unsealed = await unsealData(cookie, sessionOptions)
  //console.log("unsealed: ", unsealed)
  const result = sessionSchema.safeParse(unsealed)
  if (!result.success) {
    console.error("Invalid session data: ", result.error)
    console.error(cookie)
    return {}
  }
  //console.log("user: ", result.data.user)
  return {
    user: result.data.user,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>;

