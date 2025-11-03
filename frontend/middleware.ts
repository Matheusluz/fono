import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Rewrite /login -> /
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Simple token check via cookie for /home
  if (pathname.startsWith('/home')) {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/home/:path*']
}
