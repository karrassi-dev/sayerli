export const ROUTE_ROLE_MAP: Record<string, string[]> = {
  '/dashboard/equipe':       ['admin'],
  '/dashboard/settings':     ['admin'],
  '/dashboard/clients':      ['admin', 'manager', 'commercial'],
  '/dashboard/devis':        ['admin', 'manager', 'commercial'],
  '/dashboard/factures':     ['admin', 'manager', 'commercial', 'comptable'],
  '/dashboard/declarations': ['admin', 'manager', 'comptable'],
  '/dashboard/paiements':    ['admin', 'manager', 'comptable'],
  '/dashboard/notifications':['admin', 'manager', 'commercial', 'comptable'],
  '/dashboard/export':       ['admin', 'manager', 'comptable'],
}

export const NAV_ALLOWED_ROLES: Record<string, string[]> = {
  dashboard:     ['admin', 'manager', 'commercial', 'comptable'],
  clients:       ['admin', 'manager', 'commercial'],
  devis:         ['admin', 'manager', 'commercial'],
  factures:      ['admin', 'manager', 'commercial', 'comptable'],
  declarations:  ['admin', 'manager', 'comptable'],
  paiements:     ['admin', 'manager', 'comptable'],
  equipe:        ['admin'],
  notifications: ['admin', 'manager', 'commercial', 'comptable'],
  export:        ['admin', 'manager', 'comptable'],
  settings:      ['admin'],
}

export function canAccess(role: string, routeKey: string): boolean {
  const allowed = NAV_ALLOWED_ROLES[routeKey]
  if (!allowed) return true
  return allowed.includes(role.toLowerCase())
}
