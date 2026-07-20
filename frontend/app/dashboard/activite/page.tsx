'use client'

import { useState, useEffect, useCallback } from 'react'
import { Activity, ChevronLeft, ChevronRight, X } from 'lucide-react'
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
  userId: string
  userNom: string
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
  PAIEMENT: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  MEMBRE:   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  CATALOGUE:'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
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

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "À l'instant"
  if (mins < 60) return `il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return new Date(dateStr).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric' })
}

function absoluteTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-MA', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const ENTITY_TYPES = ['CLIENT', 'DEVIS', 'FACTURE', 'PAIEMENT', 'MEMBRE', 'CATALOGUE']

export default function ActivitePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const role = user?.role ?? ''
  const removed = user?.permissionsRetirees ?? []

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 50, totalPages: 1 })
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)

  const [filterUserId, setFilterUserId] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [page, setPage] = useState(1)

  const canView = canDo('settings', role, removed)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page }
      if (filterUserId) params.userId = filterUserId
      if (filterType) params.entityType = filterType
      if (filterFrom) params.dateDebut = filterFrom
      if (filterTo) params.dateFin = filterTo
      const res = await api.get('/logs', { params })
      const d = res.data
      const logsArr = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []
      setLogs(logsArr)
      setMeta(d?.meta ?? { total: 0, page: 1, limit: 50, totalPages: 1 })
    } catch {
      setLogs([])
    } finally {
      setLoading(false)
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

  const handleFilterChange = () => {
    setPage(1)
  }

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
    <div className="space-y-6">
      <PageHeader
        title={t('pages.activite.title')}
        sub={t('pages.activite.sub')}
      />

      {/* Filter bar */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Membre */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {t('pages.activite.filterMembre')}
            </label>
            <select
              value={filterUserId}
              onChange={e => { setFilterUserId(e.target.value); handleFilterChange() }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400"
            >
              <option value="">{t('pages.activite.allMembers')}</option>
              {membres.map(m => (
                <option key={m.userId} value={m.userId}>{m.userNom}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {t('pages.activite.filterType')}
            </label>
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); handleFilterChange() }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400"
            >
              <option value="">{t('pages.activite.allTypes')}</option>
              {ENTITY_TYPES.map(type => (
                <option key={type} value={type}>{t(`pages.activite.types.${type}`)}</option>
              ))}
            </select>
          </div>

          {/* Date from */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {t('pages.activite.filterFrom')}
            </label>
            <input
              type="date"
              value={filterFrom}
              onChange={e => { setFilterFrom(e.target.value); handleFilterChange() }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400"
            />
          </div>

          {/* Date to */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {t('pages.activite.filterTo')}
            </label>
            <input
              type="date"
              value={filterTo}
              onChange={e => { setFilterTo(e.target.value); handleFilterChange() }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400"
            />
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              {t('pages.activite.filterReset')}
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Activity className="w-6 h-6 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">{t('pages.activite.empty.title')}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">{t('pages.activite.empty.desc')}</p>
          </div>
        ) : (
          <div>
            {logs.map((log, idx) => {
              const actionLabel = t(`pages.activite.actions.${log.action}`) || log.action
              const typeColor = ENTITY_TYPE_COLORS[log.entityType] || ENTITY_TYPE_COLORS.CATALOGUE
              const avatarGradient = getAvatarColor(log.userId)
              const initials = getInitials(log.userNom)

              return (
                <div
                  key={log.id}
                  className={cn(
                    'flex items-start gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors',
                    idx < logs.length - 1 && 'border-b border-slate-100 dark:border-slate-800'
                  )}
                >
                  {/* Avatar */}
                  <div className={cn('w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0', avatarGradient)}>
                    <span className="text-white font-bold text-xs">{initials}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{log.userNom}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{actionLabel}</span>
                      {log.entityRef && (
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', typeColor)}>
                          {log.entityRef}
                        </span>
                      )}
                    </div>
                    {log.entityType && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {t(`pages.activite.types.${log.entityType}`)}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div
                    className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap flex-shrink-0 cursor-default"
                    title={absoluteTime(log.createdAt)}
                  >
                    {relativeTime(log.createdAt)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {meta.total} entrée{meta.total !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium px-2">
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
