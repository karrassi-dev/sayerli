'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Activity, ChevronLeft, ChevronRight, X, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui/PageHeader'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { canDo } from '@/lib/permissions'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

interface LogEntry {
  id: string
  userId: string
  userNom: string
  action: string
  entityType: string
  entityId: string | null
  entityRef: string | null
  createdAt: string
}

interface Membre {
  id: string
  nom: string
  prenom: string | null
  role: string
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

const ENTITY_TYPE_COLORS: Record<string, string> = {
  FACTURE:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  DEVIS:    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  CLIENT:   'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  PAIEMENT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  MEMBRE:   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  CATALOGUE:'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

const ROLE_COLORS: Record<string, string> = {
  PROPRIETAIRE:            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  ADMIN:                   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  MANAGER:                 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  COMPTABLE:               'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  COMPTABLE_EXTERNE:       'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  DAF:                     'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  COMMERCIAL:              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  COMMERCIAL_PROPRE:       'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  RESPONSABLE_RECOUVREMENT:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  CAISSIER:                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  ASSISTANT:               'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  ASSOCIE:                 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
}

const AVATAR_COLORS = [
  'from-primary-500 to-primary-600',
  'from-teal-500 to-teal-600',
  'from-violet-500 to-violet-600',
  'from-orange-500 to-orange-600',
  'from-green-500 to-green-600',
  'from-pink-500 to-pink-600',
]

function getAvatarColor(userId: string | null | undefined): string {
  if (!userId) return AVATAR_COLORS[0]
  let hash = 0
  for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(nom: string | null | undefined): string {
  if (!nom) return '?'
  return nom.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function relativeTime(dateStr: string, dir: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (dir === 'rtl') {
    if (mins < 1) return 'الآن'
    if (mins < 60) return `منذ ${mins} د`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `منذ ${hours} س`
    const days = Math.floor(hours / 24)
    if (days < 7) return `منذ ${days} ي`
  } else {
    if (mins < 1) return "À l'instant"
    if (mins < 60) return `il y a ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `il y a ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `il y a ${days}j`
  }
  return new Date(dateStr).toLocaleDateString(dir === 'rtl' ? 'ar-MA' : 'fr-MA', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function absoluteTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-MA', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const ENTITY_TYPES = ['CLIENT', 'DEVIS', 'FACTURE', 'PAIEMENT', 'MEMBRE', 'CATALOGUE']

const SELECT_CLASS = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-colors'

export default function ActivitePage() {
  const { t, dir } = useTranslation()
  const { user } = useAuth()
  const role = user?.role ?? ''
  const removed = user?.permissionsRetirees ?? []

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 50, totalPages: 1 })
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [filterUserId, setFilterUserId] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [page, setPage] = useState(1)

  const canView = canDo('settings', role, removed)

  // Build userId → role lookup from membres list
  const roleMap = useMemo<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    membres.forEach(mb => { m[mb.id] = mb.role })
    return m
  }, [membres])

  const fetchLogs = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true)
    else setLoading(true)
    try {
      const params: Record<string, string | number> = { page }
      if (filterUserId) params.userId = filterUserId
      if (filterType) params.entityType = filterType
      if (filterFrom) params.dateDebut = filterFrom
      if (filterTo) params.dateFin = filterTo
      const res = await api.get('/logs', { params })
      const d = res.data?.data ?? res.data
      setLogs(Array.isArray(d?.logs) ? d.logs : [])
      setMeta({
        total: d?.total ?? 0,
        page: d?.page ?? 1,
        limit: d?.perPage ?? 50,
        totalPages: d?.perPage ? Math.ceil((d?.total ?? 0) / d.perPage) : 1,
      })
    } catch {
      if (!silent) setLogs([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [page, filterUserId, filterType, filterFrom, filterTo])

  useEffect(() => {
    if (!canView) return
    api.get('/logs/membres')
      .then(res => {
        const d = res.data
        setMembres(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [])
      })
      .catch(() => {})
  }, [canView])

  useEffect(() => {
    if (!canView) return
    fetchLogs()
  }, [canView, fetchLogs])

  useEffect(() => {
    if (!canView) return
    const id = setInterval(() => fetchLogs(true), 30000)
    return () => clearInterval(id)
  }, [canView, fetchLogs])

  const handleFilterChange = () => setPage(1)

  const resetFilters = () => {
    setFilterUserId('')
    setFilterType('')
    setFilterFrom('')
    setFilterTo('')
    setPage(1)
  }

  const hasFilters = filterUserId || filterType || filterFrom || filterTo

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400 text-sm">
        Accès non autorisé
      </div>
    )
  }

  return (
    <div className="space-y-5" dir={dir}>
      <PageHeader
        title={t('pages.activite.title')}
        sub={t('pages.activite.sub')}
      />

      {/* ── Filter bar ── */}
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
          {/* Membre */}
          <div className="flex flex-col gap-1 col-span-2 sm:col-auto sm:min-w-[200px]">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('pages.activite.filterMembre')}
            </label>
            <select
              value={filterUserId}
              onChange={e => { setFilterUserId(e.target.value); handleFilterChange() }}
              className={SELECT_CLASS}
            >
              <option value="">{t('pages.activite.allMembers')}</option>
              {membres.map(m => (
                <option key={m.id} value={m.id}>
                  {m.prenom ? `${m.prenom} ${m.nom}` : m.nom}
                  {m.role ? ` · ${t(`roles.${m.role}`) || m.role}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1 sm:min-w-[150px]">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('pages.activite.filterType')}
            </label>
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); handleFilterChange() }}
              className={SELECT_CLASS}
            >
              <option value="">{t('pages.activite.allTypes')}</option>
              {ENTITY_TYPES.map(type => (
                <option key={type} value={type}>{t(`pages.activite.types.${type}`)}</option>
              ))}
            </select>
          </div>

          {/* Date from */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('pages.activite.filterFrom')}
            </label>
            <input
              type="date"
              value={filterFrom}
              onChange={e => { setFilterFrom(e.target.value); handleFilterChange() }}
              className={SELECT_CLASS}
            />
          </div>

          {/* Date to */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('pages.activite.filterTo')}
            </label>
            <input
              type="date"
              value={filterTo}
              onChange={e => { setFilterTo(e.target.value); handleFilterChange() }}
              className={SELECT_CLASS}
            />
          </div>

          {/* Reset + Refresh row on mobile */}
          <div className="col-span-2 sm:col-auto flex items-center gap-2 sm:ms-auto">
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span className="sm:inline">{t('pages.activite.filterReset')}</span>
              </button>
            )}
            <button
              onClick={() => fetchLogs()}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
              <span>{t('pages.activite.refresh')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-4 sm:px-6 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-3.5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="h-3 w-14 bg-slate-100 dark:bg-slate-800 rounded flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Activity className="w-6 h-6 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              {t('pages.activite.empty.title')}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {t('pages.activite.empty.desc')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map(log => {
              const actionLabel = t(`pages.activite.actions.${log.action}`) || log.action
              const typeColor = ENTITY_TYPE_COLORS[log.entityType] || ENTITY_TYPE_COLORS.CATALOGUE
              const memberRole = roleMap[log.userId]
              const roleLabel = memberRole ? (t(`roles.${memberRole}`) || memberRole) : null
              const roleColor = memberRole ? (ROLE_COLORS[memberRole] || ROLE_COLORS.ASSISTANT) : ROLE_COLORS.ASSISTANT
              const avatarGradient = getAvatarColor(log.userId)
              const initials = getInitials(log.userNom)

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 px-4 sm:px-6 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm',
                    avatarGradient
                  )}>
                    <span className="text-white font-bold text-xs">{initials}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top row: name + action + ref pill */}
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                        {log.userNom}
                      </span>
                      {roleLabel && (
                        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-tight', roleColor)}>
                          {roleLabel}
                        </span>
                      )}
                      <span className="text-sm text-slate-600 dark:text-slate-300 leading-tight">
                        {actionLabel}
                      </span>
                      {log.entityRef && (
                        <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full leading-tight', typeColor)}>
                          {log.entityRef}
                        </span>
                      )}
                    </div>

                    {/* Bottom row: entity type */}
                    {log.entityType && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {t(`pages.activite.types.${log.entityType}`)}
                      </p>
                    )}

                    {/* Time — shown inline on mobile below content */}
                    <p
                      className="text-xs text-slate-400 dark:text-slate-500 mt-1 sm:hidden"
                      title={absoluteTime(log.createdAt)}
                    >
                      {relativeTime(log.createdAt, dir)}
                    </p>
                  </div>

                  {/* Time — hidden on mobile, shown right-aligned on desktop */}
                  <div
                    className="hidden sm:block text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap flex-shrink-0 pt-0.5 cursor-default"
                    title={absoluteTime(log.createdAt)}
                  >
                    {relativeTime(log.createdAt, dir)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 order-2 sm:order-1">
            {meta.total} entrée{meta.total !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium px-2 min-w-[60px] text-center">
              {page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
