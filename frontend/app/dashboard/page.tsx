'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Receipt, CreditCard, Plus, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { StatsCard } from '@/components/dashboard/ui/StatsCard'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import { MiniBarChart } from '@/components/dashboard/ui/MiniChart'
import { dashboardApi } from '@/lib/api'
import { formatMAD } from '@/lib/mock-data'

const QUICK_ACTIONS = [
  { href: '/dashboard/devis/new', icon: '📄', labelKey: 'dashboard.newQuote', color: 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-950' },
  { href: '/dashboard/factures/new', icon: '🧾', labelKey: 'dashboard.newInvoice', color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-950' },
  { href: '/dashboard/clients/new', icon: '👤', labelKey: 'dashboard.newClient', color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950' },
  { href: '/dashboard/paiements', icon: '💰', labelKey: 'dashboard.payments', color: 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950' },
]

const ACTIVITY_COLORS: Record<string, string> = {
  PAIEMENT_RECU: 'bg-green-500',
  FACTURE_PAYEE: 'bg-green-500',
  DEVIS_ACCEPTE: 'bg-blue-500',
  FACTURE_CREEE: 'bg-purple-500',
  DEVIS_ENVOYE: 'bg-teal-500',
  FACTURE_PARTIELLE: 'bg-amber-500',
  DEVIS_REFUSE: 'bg-red-400',
  RAPPEL_ECHEANCE: 'bg-orange-500',
  DEVIS_VU: 'bg-indigo-400',
}

const EMPTY_MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map(
  (mois) => ({ mois, valeur: 0 }),
)

interface DashboardAnalytics {
  clients: { total: number; nouveauxCeMois: number; actifs: number }
  devis: {
    total: number; brouillon: number; envoye: number; vu: number
    accepte: number; refuse: number; tauxAcceptation: number
  }
  factures: {
    total: number; brouillon: number; envoyee: number; payee: number
    partielle: number; enRetard: number; totalRevenus: number
  }
  paiements: { total: number; ceMois: number; moisDernier: number; moyenne: number; count: number }
  revenus: { mensuel: { mois: string; valeur: number }[]; ceMois: number; moisDernier: number; evolution: number }
  facturesRecentes: { id: string; numero: string; clientNom: string; totalTTC: number; statut: string }[]
  activite: { id: string; type: string; message: string; lien: string | null; lu: boolean; createdAt: string }[]
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const d = new Date(dateStr)
  const diffMs = now.getTime() - d.getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)
  if (minutes < 2) return "À l'instant"
  if (minutes < 60) return `il y a ${minutes}min`
  if (hours < 24) return `il y a ${hours}h`
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days}j`
  return d.toLocaleDateString('fr-MA', { day: '2-digit', month: 'short' })
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  const currentYear = new Date().getFullYear()
  const currentMonthLabel = new Date().toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    dashboardApi
      .analytics()
      .then((res) => {
        const data = res.data?.data ?? res.data
        setAnalytics(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const chartData = analytics?.revenus.mensuel ?? EMPTY_MONTHS

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('dashboard.welcome')}, {user?.nom?.split(' ')[0] ?? ''} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{t('dashboard.overview')}</p>
        </div>
        <Link href="/dashboard/devis/new" className="btn-primary text-sm hidden sm:flex">
          <Plus className="w-4 h-4" />
          {t('dashboard.newQuote')}
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard
          loading={loading}
          label={t('dashboard.totalRevenue')}
          value={analytics ? formatMAD(analytics.paiements.total) : '—'}
          sub={analytics ? `${formatMAD(analytics.revenus.ceMois)} ${t('dashboard.thisMonth')}` : undefined}
          icon={TrendingUp}
          trend={analytics?.revenus.evolution}
          color="blue"
        />
        <StatsCard
          loading={loading}
          label={t('dashboard.clients')}
          value={analytics?.clients.total ?? '—'}
          sub={analytics ? `+${analytics.clients.nouveauxCeMois} ${t('dashboard.thisMonth')}` : undefined}
          icon={Users}
          color="teal"
        />
        <StatsCard
          loading={loading}
          label={t('dashboard.quotes')}
          value={analytics ? `${analytics.devis.accepte}/${analytics.devis.total}` : '—'}
          sub={analytics ? `${analytics.devis.tauxAcceptation}% ${t('dashboard.accepted')}` : undefined}
          icon={Receipt}
          color="purple"
        />
        <StatsCard
          loading={loading}
          label={t('dashboard.invoices')}
          value={analytics ? `${analytics.factures.payee}/${analytics.factures.total}` : '—'}
          sub={analytics ? `${analytics.factures.enRetard} ${t('dashboard.overdue')}` : undefined}
          icon={CreditCard}
          color="orange"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.revenueChart')}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentYear} — En MAD</p>
            </div>
            {analytics && analytics.revenus.evolution !== 0 && (
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                analytics.revenus.evolution >= 0
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
                  : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {analytics.revenus.evolution >= 0 ? '+' : ''}{analytics.revenus.evolution}%
              </div>
            )}
          </div>
          <MiniBarChart data={chartData} height={120} />
          <div className="flex justify-between mt-2">
            {chartData.map((d) => (
              <span key={d.mois} className="flex-1 text-center text-[9px] text-slate-400 dark:text-slate-600">
                {d.mois}
              </span>
            ))}
          </div>
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
              {currentMonthLabel}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {analytics ? formatMAD(analytics.revenus.ceMois) : '—'}
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card rounded-2xl p-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-4">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-xl text-center transition-all hover:-translate-y-0.5 group ${a.color}`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{a.icon}</span>
                <span className="text-xs font-semibold leading-tight">{t(a.labelKey)}</span>
              </Link>
            ))}
          </div>

          {/* Invoice status breakdown */}
          <div className="mt-5 space-y-2.5">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t('dashboard.invoiceStatus')}
            </p>
            {[
              {
                label: t('statuses.payee'),
                value: analytics?.factures.payee ?? 0,
                total: analytics?.factures.total ?? 1,
                color: 'bg-green-500',
              },
              {
                label: t('statuses.envoyee'),
                value: analytics?.factures.envoyee ?? 0,
                total: analytics?.factures.total ?? 1,
                color: 'bg-blue-500',
              },
              {
                label: t('statuses.enRetard'),
                value: analytics?.factures.enRetard ?? 0,
                total: analytics?.factures.total ?? 1,
                color: 'bg-red-500',
              },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{row.value}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${row.color}`}
                    style={{ width: `${(row.value / Math.max(row.total, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent invoices */}
        <div className="card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.recentInvoices')}</h2>
            <Link
              href="/dashboard/factures"
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              {t('common.viewAll')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))
            ) : analytics?.facturesRecentes.length ? (
              analytics.facturesRecentes.map((f) => (
                <Link
                  key={f.id}
                  href={`/dashboard/factures`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{f.clientNom}</p>
                    <p className="text-xs text-slate-400">{f.numero}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{formatMAD(f.totalTTC)}</span>
                    <StatusBadge variant={f.statut as any} dot />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">{t('common.noResults')}</p>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.recentActivity')}</h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-3/4" />
                    <div className="h-2.5 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-1/3" />
                  </div>
                </div>
              ))
            ) : analytics?.activite.length ? (
              analytics.activite.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ACTIVITY_COLORS[a.type] ?? 'bg-slate-400'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{a.message}</p>
                    <span className="text-xs text-slate-400">{formatRelativeTime(a.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">{t('common.noResults')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
