'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, Receipt, CreditCard,
  UserCog, Bell, Settings, LogOut, Menu, X,
  ChevronLeft, ChevronRight, ClipboardCheck, Download, Package,
  Building2, ChevronsUpDown, Check,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationContext } from '@/components/providers/NotificationProvider'
import { cn } from '@/lib/utils'
import { NAV_ALLOWED_ROLES } from '@/lib/permissions'
import { Logo, LogoMark } from '@/components/ui/LogoMark'

const NAV_ITEMS = [
  { href: '/dashboard',              iconC: LayoutDashboard, key: 'dashboard' },
  { href: '/dashboard/clients',      iconC: Users,           key: 'clients' },
  { href: '/dashboard/devis',        iconC: FileText,        key: 'devis' },
  { href: '/dashboard/factures',     iconC: Receipt,         key: 'factures' },
  { href: '/dashboard/catalogue',    iconC: Package,         key: 'catalogue' },
  { href: '/dashboard/declarations', iconC: ClipboardCheck,  key: 'declarations' },
  { href: '/dashboard/paiements',    iconC: CreditCard,      key: 'paiements' },
  { href: '/dashboard/equipe',       iconC: UserCog,         key: 'equipe' },
  { href: '/dashboard/notifications',iconC: Bell,            key: 'notifications' },
  { href: '/dashboard/export',       iconC: Download,        key: 'export' },
  { href: '/dashboard/settings',     iconC: Settings,        key: 'settings' },
]

const ROLE_COLORS: Record<string, string> = {
  admin: 'from-primary-500 to-primary-600',
  manager: 'from-teal-500 to-teal-600',
  commercial: 'from-orange-500 to-orange-600',
  comptable: 'from-purple-500 to-purple-600',
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
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false)
      }
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
  const visibleNavItems = NAV_ITEMS.filter(({ key }) => {
    const allowed = NAV_ALLOWED_ROLES[key]
    return !allowed || allowed.includes(userRole)
  })

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo + toggle */}
      <div className={cn('flex items-center border-b border-slate-100 dark:border-slate-800 h-16', collapsed && !isMobile ? 'justify-center px-2' : 'justify-between px-4')}>
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0" onClick={() => setMobileOpen(false)}>
          {(!collapsed || isMobile) ? (
            <Logo size={32} />
          ) : (
            <LogoMark size={32} />
          )}
          {(!collapsed || isMobile) && entreprise && (
            <p className="text-xs text-slate-400 truncate max-w-[110px]">{entreprise.nom}</p>
          )}
        </Link>
        {!isMobile && (
          <button onClick={toggleCollapsed} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-shrink-0">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={cn('flex-1 py-3 overflow-y-auto overflow-x-hidden', collapsed && !isMobile ? 'px-2' : 'px-3')}>
        <div className="space-y-0.5">
          {visibleNavItems.map(({ href, iconC: Icon, key }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            const badge = key === 'notifications' ? unreadCount : key === 'declarations' ? pendingDeclarationsCount : 0
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                title={collapsed && !isMobile ? t(`dashboard.sidebar.${key}`) : undefined}
                className={cn(
                  'flex items-center rounded-xl transition-all duration-200 group relative',
                  collapsed && !isMobile ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  active
                    ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <Icon className={cn('flex-shrink-0', collapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4', active ? 'text-primary-600 dark:text-primary-400' : '')} />
                {(!collapsed || isMobile) && (
                  <>
                    <span className="text-sm font-medium flex-1">{t(`dashboard.sidebar.${key}`)}</span>
                    {badge > 0 && (
                      <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">{badge}</span>
                    )}
                  </>
                )}
                {/* Collapsed tooltip */}
                {collapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                    {t(`dashboard.sidebar.${key}`)}
                    {badge > 0 && <span className="ml-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] inline-flex items-center justify-center font-bold">{badge}</span>}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom: company switcher + logout + user */}
      <div className={cn('py-3 border-t border-slate-100 dark:border-slate-800', collapsed && !isMobile ? 'px-2' : 'px-3')}>

        {/* Company switcher — only shown if user belongs to multiple companies */}
        {(!collapsed || isMobile) && companies.length > 1 && entreprise && (
          <div className="relative mb-2" ref={!isMobile ? switcherRef : undefined}>
            <button
              onClick={() => setSwitcherOpen(o => !o)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all text-left"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate flex-1">{entreprise.nom}</span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            </button>

            {switcherOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pt-2.5 pb-1">
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
                          ? 'bg-primary-50 dark:bg-primary-950/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-[9px]">{c.nom.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className={cn('text-xs font-medium truncate flex-1', isActive ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300')}>
                        {c.nom}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <button
          onClick={logout}
          title={collapsed && !isMobile ? t('dashboard.sidebar.logout') : undefined}
          className={cn(
            'w-full flex items-center rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group relative',
            collapsed && !isMobile ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
          )}
        >
          <LogOut className={cn('flex-shrink-0', collapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4')} />
          {(!collapsed || isMobile) && <span>{t('dashboard.sidebar.logout')}</span>}
          {collapsed && !isMobile && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
              {t('dashboard.sidebar.logout')}
            </div>
          )}
        </button>

        {/* User info */}
        {(!collapsed || isMobile) && user && (
          <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0', ROLE_COLORS[user.role] || 'from-primary-500 to-teal-500')}>
              <span className="text-white font-bold text-xs">{avatarInitials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.nom}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role?.toLowerCase()}</p>
            </div>
          </div>
        )}
        {collapsed && !isMobile && user && (
          <div className="flex justify-center mt-2">
            <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center', ROLE_COLORS[user.role] || 'from-primary-500 to-teal-500')}>
              <span className="text-white font-bold text-xs">{avatarInitials}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-shrink-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-56'
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setMobileOpen(false)} />
          <aside className="md:hidden fixed left-0 top-0 bottom-0 w-64 z-50 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform">
            <SidebarContent isMobile />
          </aside>
        </>
      )}
    </>
  )
}
