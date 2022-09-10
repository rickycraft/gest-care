import { inferAsyncReturnType } from '@trpc/server'
import { unsealData } from "iron-session"
import * as trpcNext from '@trpc/server/adapters/next'
import { IRON_COOKIE, ironSessionOptions, sessionSchema } from "utils/iron"
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { createSSGHelpers } from '@trpc/react/ssg'
import { appRouter } from './routers/_app'
import superjson from 'superjson'


// auth for server side
export async function createContext({ req, res }: trpcNext.CreateNextContextOptions) {
  return createContextFromCookies(req.cookies)
}

// auth for server side
export async function createContextFromCookies(cookies: NextApiRequestCookies) {
  if (process.env.NODE_ENV === 'development') {
    return { user: { id: 1, name: 'admin', role: 'admin' } }
  }

  const cookie = cookies[IRON_COOKIE]
  // check if cookie is present
  if (!cookie) return {}
  const unsealed = await unsealData(cookie, ironSessionOptions)
  // try parse cookie
  const result = sessionSchema.safeParse(unsealed)
  if (!result.success) return {}
  // return correct user
  return {
    user: result.data.user,
  }
}

export const createSSG = async (cookies: NextApiRequestCookies) => createSSGHelpers({
  router: appRouter,
  ctx: await createContextFromCookies(cookies),
  transformer: superjson,
})

export type Context = inferAsyncReturnType<typeof createContext>;

