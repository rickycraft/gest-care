import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
//import { IRON_COOKIE } from 'server/iron'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const next = NextResponse.next()
  console.log(request.nextUrl)

  const cookie = request.cookies.get("iron-cookie")
  if (cookie === undefined) return NextResponse.redirect(new URL('/login', request.nextUrl.origin))

  // check for role here

  return next
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/preventivo/:page*'],
}