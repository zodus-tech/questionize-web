import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const deleteToken = () => {
  const response = NextResponse.next()
  response.cookies.delete('token')
  console.log(
    '[Middleware] Clearing token, user tried to leave admin page while logged in.',
  )

  return response
}

const redirectToAdminAuth = (url: string, pathname: string) => {
  const response = NextResponse.redirect(new URL('/admin/auth/login', url))

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

const redirectToQuestionnaires = (url: string) => {
  return NextResponse.redirect(new URL('/home/questionnaires', url))
}

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
  if (token && !pathname.includes('admin')) {
    return deleteToken()
  }

  if (!token && pathname.startsWith('/admin')) {
    return redirectToAdminAuth(req.url, pathname)
  }

  if (pathname === '/' || pathname === '/home') {
    return redirectToQuestionnaires(req.url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|admin/auth).*)',
}
