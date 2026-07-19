import { NextRequest, NextResponse } from 'next/server'
import { ROUTE_ROLE_MAP } from '@/lib/permissions'

const TOKEN_KEY = 'sayerli_token'

function decodeJwt(token: string): { role: string | null; superAdmin: boolean } {
  try {
    const payload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/')
    if (!payload) return { role: null, superAdmin: false }
    const decoded = JSON.parse(atob(payload))
    return {
      role: decoded?.role ? String(decoded.role).toLowerCase() : null,
      superAdmin: decoded?.superAdmin === true,
    }
  } catch {
    return { role: null, superAdmin: false }
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

  if (pathname.startsWith('/superadmin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const { superAdmin } = decodeJwt(token)
    if (!superAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { role } = decodeJwt(token)
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

  // Company picker: requires a session select token in sessionStorage (client-side only)
  // We just let it through — the page itself validates the token
  if (pathname === '/selectionner-entreprise' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/superadmin/:path*', '/dashboard/:path*', '/login', '/register', '/selectionner-entreprise'],
}
