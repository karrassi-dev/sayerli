'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, Receipt, CreditCard,
  UserCog, Bell, Settings, LogOut, Menu, X,
  ChevronLeft, ChevronRight, ClipboardCheck, Download, Package,
  Building2, ChevronsUpDown, Check, Activity, Calculator, Truck, Share2, Wallet,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationContext } from '@/components/providers/NotificationProvider'
import { cn } from '@/lib/utils'
import { NAV_ALLOWED_ROLES } from '@/lib/permissions'
import { Logo, LogoMark } from '@/components/ui/LogoMark'

/* ── Nav items ── keep exactly the same href/key/permission mapping ── */
const NAV_ITEMS = [
  { href: '/dashboard',                  iconC: LayoutDashboard, key: 'dashboard',      permission: 'dashboard',              group: 0 },
  { href: '/dashboard/clients',          iconC: Users,           key: 'clients',        permission: 'clients.read',           group: 0 },
  { href: '/dashboard/devis',            iconC: FileText,        key: 'devis',          permission: 'devis.read',             group: 0 },
  { href: '/dashboard/factures',         iconC: Receipt,         key: 'factures',       permission: 'factures.read',          group: 0 },
  { href: '/dashboard/catalogue',        iconC: Package,         key: 'catalogue',      permission: 'catalogue.read',         group: 0 },
  { href: '/dashboard/bons-livraison',   iconC: Truck,           key: 'bonsLivraison',  permission: 'bons-livraison.read',    group: 0 },
  { href: '/dashboard/depenses',         iconC: Wallet,          key: 'depenses',       permission: null,                     group: 0 },
  { href: '/dashboard/paiements',        iconC: CreditCard,      key: 'paiements',      permission: 'paiements.read',         group: 1 },
  { href: '/dashboard/declarations',     iconC: ClipboardCheck,  key: 'declarations',   permission: 'paiements.declarations', group: 1 },
  { href: '/dashboard/declarations-tva', iconC: Calculator,      key: 'declarationsTva',permission: 'export',                 group: 1 },
  { href: '/dashboard/export',           iconC: Download,        key: 'export',         permission: 'export',                 group: 1 },
  { href: '/dashboard/equipe',           iconC: UserCog,         key: 'equipe',         permission: 'equipe.read',            group: 2 },
  { href: '/dashboard/notifications',    iconC: Bell,            key: 'notifications',  permission: null,                     group: 2 },
  { href: '/dashboard/activite',         iconC: Activity,        key: 'activite',       permission: 'settings',               group: 2 },
  { href: '/dashboard/graphe',           iconC: Share2,          key: 'graphe',         permission: null,                     group: 2 },
  { href: '/dashboard/settings',         iconC: Settings,        key: 'settings',       permission: null,                     group: 2 },
]

const ROLE_COLORS: Record<string, string> = {
  proprietaire: 'from-indigo-500 to-violet-500',
  admin:        'from-primary-500 to-primary-600',
  manager:      'from-teal-500 to-teal-600',
  commercial:   'from-orange-500 to-orange-600',
  comptable:    'from-purple-500 to-purple-600',
}


export function Sidebar() {
  const { t } = useTranslation()
  const { user, entreprise, companies, switchCompany, logout } = useAuth()
  const { unreadCount, pendingDeclarationsCount } = useNotificationContext()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) setSwitcherOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed')
    if (saved) setCollapsed(saved === 'true')
  }, [])

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar_collapsed', String(next))
  }

  const avatarInitials = user?.nom
    ? user.nom.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const userRole = user?.role?.toLowerCase() || ''
  const removedPerms: string[] = user?.permissionsRetirees ?? []

  const visibleNavItems = NAV_ITEMS.filter(({ key, permission }) => {
    const allowed = NAV_ALLOWED_ROLES[key]
    if (allowed && !allowed.includes(userRole)) return false
    if (permission && removedPerms.includes(permission) && userRole !== 'proprietaire') return false
    return true
  })

  /* ── Shared sidebar body ── */
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const isExpanded = isMobile || !collapsed

    /* group visible items by their group index, keeping dividers */
    const groupedItems: (typeof visibleNavItems[number] | null)[] = []
    let lastGroup = -1
    visibleNavItems.forEach(item => {
      if (lastGroup !== -1 && item.group !== lastGroup) groupedItems.push(null) // divider sentinel
      groupedItems.push(item)
      lastGroup = item.group
    })

    return (
      <div className="flex flex-col h-full overflow-hidden">

        {/* ── Header ── */}
        <div className={cn(
          'flex items-center h-16 flex-shrink-0',
          isExpanded ? 'px-4 justify-between' : 'px-2 justify-center'
        )}>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 min-w-0 group"
            onClick={() => isMobile && setMobileOpen(false)}
          >
            {isExpanded ? <Logo size={30} /> : <LogoMark size={30} />}
            {isExpanded && entreprise && (
              <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[108px] group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                {entreprise.nom}
              </span>
            )}
          </Link>

          {!isMobile && (
            <button
              onClick={toggleCollapsed}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/8 transition-all flex-shrink-0"
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/8 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Thin top divider */}
        <div className="h-px bg-slate-100 dark:bg-white/5 mx-3 flex-shrink-0" />

        {/* ── Nav ── */}
        <nav className={cn(
          'flex-1 py-3 overflow-y-auto overflow-x-hidden scrollbar-thin',
          isExpanded ? 'px-3' : 'px-2'
        )}>
          <div className="space-y-0.5">
            {groupedItems.map((item, idx) => {
              if (item === null) {
                return (
                  <div
                    key={`divider-${idx}`}
                    className={cn('my-2', isExpanded ? 'mx-1' : 'mx-0')}
                  >
                    <div className="h-px bg-slate-100 dark:bg-white/5" />
                  </div>
                )
              }

              const { href, iconC: Icon, key } = item
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
              const badge = key === 'notifications' ? unreadCount : key === 'declarations' ? pendingDeclarationsCount : 0

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => isMobile && setMobileOpen(false)}
                  title={!isExpanded ? t(`dashboard.sidebar.${key}`) : undefined}
                  className={cn(
                    'group relative flex items-center rounded-xl transition-all duration-200',
                    isExpanded ? 'gap-3 px-2.5 py-2' : 'justify-center p-2.5',
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                >
                  {/* Icon container */}
                  <div className={cn(
                    'flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200',
                    isExpanded ? 'w-7 h-7' : 'w-8 h-8',
                    active ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-transparent'
                  )}>
                    <Icon className={cn(
                      'w-4 h-4 transition-colors',
                      active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                    )} />
                  </div>

                  {/* Label + badge */}
                  {isExpanded && (
                    <>
                      <span className={cn(
                        'text-sm flex-1 truncate transition-colors',
                        active ? 'font-semibold' : 'font-medium'
                      )}>
                        {t(`dashboard.sidebar.${key}`)}
                      </span>
                      {badge > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Collapsed: badge dot */}
                  {!isExpanded && badge > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-950" />
                  )}

                  {/* Collapsed tooltip */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-xl translate-x-1 group-hover:translate-x-0">
                      {t(`dashboard.sidebar.${key}`)}
                      {badge > 0 && (
                        <span className="ml-1.5 px-1 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] inline-flex items-center justify-center font-bold">
                          {badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Thin bottom divider */}
        <div className="h-px bg-slate-100 dark:bg-white/5 mx-3 flex-shrink-0" />

        {/* ── Footer ── */}
        <div className={cn(
          'py-3 flex-shrink-0 space-y-1',
          isExpanded ? 'px-3' : 'px-2'
        )}>

          {/* Company switcher */}
          {isExpanded && companies.length > 1 && entreprise && (
            <div className="relative mb-1" ref={!isMobile ? switcherRef : undefined}>
              <button
                onClick={() => setSwitcherOpen(o => !o)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/8 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all text-left group"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate flex-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {entreprise.nom}
                </span>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </button>

              {switcherOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-xl shadow-2xl overflow-hidden z-50">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 pt-3 pb-1.5">
                    {t('auth.selectCompany.switchTitle')}
                  </p>
                  {companies.map(c => {
                    const isActive = c.entrepriseId === entreprise.id
                    return (
                      <button
                        key={c.utilisateurId}
                        onClick={() => { setSwitcherOpen(false); if (!isActive) switchCompany(c.utilisateurId) }}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors',
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-500/10'
                            : 'hover:bg-slate-50 dark:hover:bg-white/4'
                        )}
                      >
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-[9px]">{c.nom.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <span className={cn(
                          'text-xs font-medium truncate flex-1',
                          isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'
                        )}>
                          {c.nom}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            title={!isExpanded ? t('dashboard.sidebar.logout') : undefined}
            className={cn(
              'group relative w-full flex items-center rounded-xl transition-all duration-200 text-red-500/80 dark:text-red-400/70 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/8',
              isExpanded ? 'gap-3 px-2.5 py-2' : 'justify-center p-2.5'
            )}
          >
            <div className={cn(
              'flex-shrink-0 flex items-center justify-center rounded-lg',
              isExpanded ? 'w-7 h-7' : 'w-8 h-8'
            )}>
              <LogOut className="w-4 h-4" />
            </div>
            {isExpanded && (
              <span className="text-sm font-medium">{t('dashboard.sidebar.logout')}</span>
            )}
            {!isExpanded && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-xl translate-x-1 group-hover:translate-x-0">
                {t('dashboard.sidebar.logout')}
              </div>
            )}
          </button>

          {/* User card */}
          {user && (
            isExpanded ? (
              <div className="flex items-center gap-3 px-2.5 py-2.5 mt-1 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                <div className={cn(
                  'w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm',
                  ROLE_COLORS[userRole] || 'from-indigo-500 to-violet-500'
                )}>
                  <span className="text-white font-bold text-xs">{avatarInitials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-tight">{user.nom}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 capitalize leading-tight mt-0.5">{user.role?.toLowerCase()}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mt-1">
                <div className={cn(
                  'w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm',
                  ROLE_COLORS[userRole] || 'from-indigo-500 to-violet-500'
                )}>
                  <span className="text-white font-bold text-xs">{avatarInitials}</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 ease-in-out',
        'bg-white dark:bg-[#0c0e12]',
        'border-r border-slate-100 dark:border-white/[0.06]',
        collapsed ? 'w-[68px]' : 'w-[232px]'
      )}>
        <SidebarContent />
      </aside>

      {/* ── Mobile toggle button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-white/8 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/8 transition-all"
      >
        <Menu className="w-4.5 h-4.5 text-slate-700 dark:text-slate-200" />
      </button>

      {/* ── Mobile overlay + drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 bottom-0 w-[280px] z-50 bg-white dark:bg-[#0c0e12] border-r border-slate-100 dark:border-white/[0.06] shadow-2xl">
            <SidebarContent isMobile />
          </aside>
        </>
      )}
    </>
  )
}
