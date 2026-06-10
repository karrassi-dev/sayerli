'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell, CheckCheck, Trash2, FileText, Receipt,
  CreditCard, AlertTriangle, Info, Eye, ClipboardCheck,
} from 'lucide-react'
import { notificationsApi } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

type NotifType =
  | 'DEVIS_ENVOYE' | 'DEVIS_ACCEPTE' | 'DEVIS_REFUSE' | 'DEVIS_VU'
  | 'FACTURE_CREEE' | 'FACTURE_ENVOYEE' | 'FACTURE_VUE' | 'FACTURE_PAYEE' | 'FACTURE_PARTIELLE'
  | 'RAPPEL_ECHEANCE' | 'PAIEMENT_RECU' | 'DECLARATION_RECUE'

interface Notification {
  id: string
  type: NotifType
  message: string
  lu: boolean
  lien?: string
  createdAt: string
}

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  DEVIS_ENVOYE:      { icon: FileText,      color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950/40' },
  DEVIS_ACCEPTE:     { icon: CheckCheck,    color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40' },
  DEVIS_REFUSE:      { icon: FileText,      color: 'text-red-600 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-950/40' },
  DEVIS_VU:          { icon: Eye,           color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  FACTURE_CREEE:     { icon: Receipt,       color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800' },
  FACTURE_ENVOYEE:   { icon: Receipt,       color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950/40' },
  FACTURE_VUE:       { icon: Eye,           color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  FACTURE_PAYEE:     { icon: CreditCard,    color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40' },
  FACTURE_PARTIELLE: { icon: CreditCard,    color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  RAPPEL_ECHEANCE:   { icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40' },
  PAIEMENT_RECU:     { icon: CreditCard,    color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40' },
  DECLARATION_RECUE: { icon: ClipboardCheck, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40' },
}

function relativeTime(dateStr: string, t: (k: string) => string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)   return t('notifications.justNow')
  if (diff < 3600) return t('notifications.minutesAgo').replace('{{n}}', String(Math.floor(diff / 60)))
  if (diff < 86400) return t('notifications.hoursAgo').replace('{{n}}', String(Math.floor(diff / 3600)))
  if (diff < 172800) return t('notifications.yesterday')
  return t('notifications.daysAgo').replace('{{n}}', String(Math.floor(diff / 86400)))
}

export default function NotificationsPage() {
  const { t, dir } = useTranslation()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationsApi.list(filter === 'unread')
      setNotifications(res.data?.data ?? res.data ?? [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    setLoading(true)
    fetchNotifications()
  }, [fetchNotifications])

  const handleClick = async (n: Notification) => {
    if (!n.lu) {
      await notificationsApi.markRead(n.id).catch(() => {})
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, lu: true } : x))
    }
    if (n.lien) router.push(n.lien)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeleting(id)
    await notificationsApi.delete(id).catch(() => {})
    setNotifications(prev => prev.filter(x => x.id !== id))
    setDeleting(null)
  }

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead().catch(() => {})
    setNotifications(prev => prev.map(x => ({ ...x, lu: true })))
  }

  const handleDeleteAll = async () => {
    await notificationsApi.deleteAll().catch(() => {})
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.lu).length
  const shown = filter === 'unread' ? notifications.filter(n => !n.lu) : notifications

  return (
    <div dir={dir} className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('notifications.title')}</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {unreadCount} {t('notifications.filterUnread').toLowerCase()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-950 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              {t('notifications.markAllRead')}
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t('notifications.deleteAll')}
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              filter === f
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            {t(f === 'all' ? 'notifications.filterAll' : 'notifications.filterUnread')}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
            {filter === 'unread' ? t('notifications.emptyUnread') : t('notifications.empty')}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t('notifications.emptyDesc')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {shown.map(n => {
            const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.FACTURE_CREEE
            const Icon = cfg.icon
            return (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  'relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group',
                  n.lu
                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    : 'bg-primary-50/40 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900 hover:border-primary-200 dark:hover:border-primary-800'
                )}
              >
                {/* Unread dot */}
                {!n.lu && (
                  <span className={cn(
                    'absolute top-4 w-2 h-2 rounded-full bg-primary-500 flex-shrink-0',
                    dir === 'rtl' ? 'right-4' : 'left-4'
                  )} />
                )}

                {/* Icon */}
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg, !n.lu && (dir === 'rtl' ? 'mr-2' : 'ml-2'))}>
                  <Icon className={cn('w-5 h-5', cfg.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-semibold mb-0.5', cfg.color)}>
                    {t(`notifications.types.${n.type}`) || n.type}
                  </p>
                  <p className={cn('text-sm leading-snug', n.lu ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium')}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {relativeTime(n.createdAt, t)}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={e => handleDelete(e, n.id)}
                  disabled={deleting === n.id}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex-shrink-0"
                  title={t('notifications.deleteLabel')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
