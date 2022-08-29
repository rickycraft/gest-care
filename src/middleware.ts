import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from "iron-session/edge"
import { ironSessionOptions } from 'utils/iron'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const next = NextResponse.next()
  if (process.env.NODE_ENV === 'development') return next

  const session = await getIronSession(request, next, ironSessionOptions)
  if (session.user === undefined) return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin))

  // can check for role here
  return next
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/listino/:page*', '/preventivo/:page*'],
}
