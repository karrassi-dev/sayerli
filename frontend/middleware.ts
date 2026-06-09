import { NextRequest, NextResponse } from 'next/server'
import { ROUTE_ROLE_MAP } from '@/lib/permissions'

const TOKEN_KEY = 'sayerli_token'

function decodeJwtRole(token: string): string | null {
  try {
    const payload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/')
    if (!payload) return null
    const decoded = JSON.parse(atob(payload))
    return decoded?.role ? String(decoded.role).toLowerCase() : null
  } catch {
    return null
  }
}

function getRequiredRoles(pathname: string): string[] | null {
  const sorted = Object.keys(ROUTE_ROLE_MAP).sort((a, b) => b.length - a.length)
  for (const route of sorted) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return ROUTE_ROLE_MAP[route]
    }
  }
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_KEY)?.value

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const role = decodeJwtRole(token)
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const requiredRoles = getRequiredRoles(pathname)
    if (requiredRoles && !requiredRoles.includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
