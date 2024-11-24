import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/admin/auth')
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get('token')?.value

  if (!token && pathname.startsWith('/admin')) {
    const response = NextResponse.redirect(
      new URL('/admin/auth/login', req.url),
    )

    if (!pathname.endsWith('.png')) {
      response.cookies.set('callbackUrl', pathname, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    return response
  }
  if (pathname === '/' || pathname === '/home') {
    const response = NextResponse.redirect(
      new URL('/home/questionnaires', req.url),
    )

    return response
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|admin/auth).*)',
}
