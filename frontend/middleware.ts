import { NextRequest, NextResponse } from 'next/server'
import { ROUTE_ROLE_MAP } from '@/lib/permissions'

const TOKEN_KEY = 'sayerli_token'

// Maps route prefixes to the permission key required to access them
const ROUTE_PERMISSION_MAP: Record<string, string> = {
  '/dashboard/clients':          'clients.read',
  '/dashboard/devis':            'devis.read',
  '/dashboard/factures':         'factures.read',
  '/dashboard/paiements':        'paiements.read',
  '/dashboard/declarations-tva': 'declarations-tva',
  '/dashboard/declarations':     'paiements.declarations',
  '/dashboard/depenses':         'depenses.read',
  '/dashboard/export':           'export',
  '/dashboard/catalogue':        'catalogue.read',
  '/dashboard/equipe':           'equipe.read',
  '/dashboard/settings':         'settings',
  '/dashboard/bons-livraison':   'bons-livraison.read',
  '/dashboard':                  'dashboard',
}

function decodeJwt(token: string): { role: string | null; superAdmin: boolean; permissionsRetirees: string[] } {
  try {
    const payload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/')
    if (!payload) return { role: null, superAdmin: false, permissionsRetirees: [] }
    const decoded = JSON.parse(atob(payload))
    return {
      role: decoded?.role ? String(decoded.role).toLowerCase() : null,
      superAdmin: decoded?.superAdmin === true,
      permissionsRetirees: Array.isArray(decoded?.permissionsRetirees) ? decoded.permissionsRetirees : [],
    }
  } catch {
    return { role: null, superAdmin: false, permissionsRetirees: [] }
  }
}

function getRequiredPermission(pathname: string): string | null {
  // Sort by length descending so more specific routes match first
  const sorted = Object.keys(ROUTE_PERMISSION_MAP).sort((a, b) => b.length - a.length)
  for (const route of sorted) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return ROUTE_PERMISSION_MAP[route]
    }
  }
  return null
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

    const { role, permissionsRetirees } = decodeJwt(token)
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based access check
    const requiredRoles = getRequiredRoles(pathname)
    if (requiredRoles && !requiredRoles.includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Permission-based access check (permissionsRetirees from JWT)
    if (role !== 'proprietaire') {
      const requiredPermission = getRequiredPermission(pathname)
      if (requiredPermission && permissionsRetirees.includes(requiredPermission)) {
        // Redirect to a safe fallback — try factures, else root dashboard
        const fallback = !permissionsRetirees.includes('factures.read')
          ? '/dashboard/factures'
          : '/dashboard/notifications'
        return NextResponse.redirect(new URL(fallback, request.url))
      }
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
