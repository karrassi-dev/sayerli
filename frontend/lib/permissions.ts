import { ROLE_DEFAULTS, PermissionKey } from './role-permissions'

export function canDo(perm: PermissionKey, role: string | undefined, removed: string[]): boolean {
  if (!role) return false
  if (role.toUpperCase() === 'PROPRIETAIRE') return true
  const defaults = ROLE_DEFAULTS[role.toUpperCase()] ?? []
  return defaults.includes(perm) && !removed.includes(perm)
}

export const ROUTE_ROLE_MAP: Record<string, string[]> = {
  '/dashboard/equipe':       ['admin', 'proprietaire'],
  '/dashboard/settings':     ['admin', 'proprietaire'],
  '/dashboard/catalogue':    ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'assistant'],
  '/dashboard/clients':      ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'assistant', 'comptable_externe', 'responsable_recouvrement'],
  '/dashboard/devis':        ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'assistant'],
  '/dashboard/factures':     ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'comptable', 'comptable_externe', 'daf', 'responsable_recouvrement', 'caissier', 'assistant', 'associe'],
  '/dashboard/declarations': ['admin', 'proprietaire', 'manager', 'comptable', 'comptable_externe', 'daf', 'responsable_recouvrement'],
  '/dashboard/paiements':    ['admin', 'proprietaire', 'manager', 'comptable', 'comptable_externe', 'daf', 'responsable_recouvrement', 'caissier'],
  '/dashboard/notifications':['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'comptable', 'comptable_externe', 'daf', 'responsable_recouvrement', 'caissier', 'assistant', 'associe'],
  '/dashboard/export':           ['admin', 'proprietaire', 'manager', 'comptable', 'comptable_externe', 'daf'],
  '/dashboard/declarations-tva': ['admin', 'proprietaire', 'manager', 'comptable', 'comptable_externe', 'daf'],
  '/dashboard/activite':         ['admin', 'proprietaire'],
}

export const NAV_ALLOWED_ROLES: Record<string, string[]> = {
  dashboard:     ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'comptable', 'comptable_externe', 'daf', 'associe'],
  clients:       ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'assistant', 'comptable_externe', 'responsable_recouvrement'],
  devis:         ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'assistant'],
  factures:      ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'comptable', 'comptable_externe', 'daf', 'responsable_recouvrement', 'caissier', 'assistant', 'associe'],
  declarations:  ['admin', 'proprietaire', 'manager', 'comptable', 'comptable_externe', 'daf', 'responsable_recouvrement'],
  paiements:     ['admin', 'proprietaire', 'manager', 'comptable', 'comptable_externe', 'daf', 'responsable_recouvrement', 'caissier'],
  equipe:        ['admin', 'proprietaire'],
  notifications: ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'comptable', 'comptable_externe', 'daf', 'responsable_recouvrement', 'caissier', 'assistant', 'associe'],
  export:           ['admin', 'proprietaire', 'manager', 'comptable', 'comptable_externe', 'daf'],
  declarationsTva:  ['admin', 'proprietaire', 'manager', 'comptable', 'comptable_externe', 'daf'],
  settings:         ['admin', 'proprietaire'],
  catalogue:     ['admin', 'proprietaire', 'manager', 'commercial', 'commercial_propre', 'assistant'],
  activite:      ['admin', 'proprietaire'],
}

export function canAccess(role: string, routeKey: string): boolean {
  const allowed = NAV_ALLOWED_ROLES[routeKey]
  if (!allowed) return true
  return allowed.includes(role.toLowerCase())
}
