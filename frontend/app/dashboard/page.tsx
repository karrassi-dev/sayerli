'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Receipt, CreditCard, Plus, ArrowRight, Clock, BarChart2, PieChart, X, User, Building2, Briefcase, Bell, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { StatsCard } from '@/components/dashboard/ui/StatsCard'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import {
  RevenueAreaChart,
  PaymentsBarChart,
  InvoiceDonutChart,
  QuotesConversionChart,
  ClientStatsVisual,
  ChartSkeleton,
} from '@/components/dashboard/ui/Charts'
import { dashboardApi, facturesApi } from '@/lib/api'
import { useCurrency } from '@/hooks/useCurrency'
import { cn, toWhatsAppNumber } from '@/lib/utils'
import { PermissionKey } from '@/lib/role-permissions'
import { canDo } from '@/lib/permissions'

// ── Constants ────────────────────────────────────────────────────────────────

const QUICK_ACTIONS: { href: string; icon: string; labelKey: string; color: string; permission: PermissionKey }[] = [
  { href: '/dashboard/devis?action=create',    icon: '📄', labelKey: 'dashboard.newQuote',   color: 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-950', permission: 'devis.create' },
  { href: '/dashboard/factures?action=create', icon: '🧾', labelKey: 'dashboard.newInvoice', color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-950',                 permission: 'factures.create' },
  { href: '/dashboard/clients?action=create',  icon: '👤', labelKey: 'dashboard.newClient',  color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950',       permission: 'clients.create' },
  { href: '/dashboard/paiements?action=create',icon: '💰', labelKey: 'dashboard.payments',   color: 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950',       permission: 'paiements.create' },
]

const ACTIVITY_COLORS: Record<string, string> = {
  PAIEMENT_RECU:    'bg-green-500',
  FACTURE_PAYEE:    'bg-green-500',
  DEVIS_ACCEPTE:    'bg-blue-500',
  FACTURE_CREEE:    'bg-purple-500',
  DEVIS_ENVOYE:     'bg-teal-500',
  FACTURE_PARTIELLE:'bg-amber-500',
  DEVIS_REFUSE:     'bg-red-400',
  RAPPEL_ECHEANCE:  'bg-orange-500',
  DEVIS_VU:         'bg-indigo-400',
}

const EMPTY_MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
  .map(mois => ({ mois, valeur: 0 }))

type TypeClientFilter = 'ALL' | 'PARTICULIER' | 'ENTREPRISE' | 'FREELANCE'

const TYPE_FILTERS: { value: TypeClientFilter; icon: React.ElementType; labelKey: string }[] = [
  { value: 'ALL',         icon: Users,     labelKey: 'dashboard.filterAll'         },
  { value: 'PARTICULIER', icon: User,      labelKey: 'dashboard.filterParticulier' },
  { value: 'ENTREPRISE',  icon: Building2, labelKey: 'dashboard.filterEntreprise'  },
  { value: 'FREELANCE',   icon: Briefcase, labelKey: 'dashboard.filterFreelance'   },
]

// ── Types ────────────────────────────────────────────────────────────────────

interface DashboardAnalytics {
  clients:  { total: number; nouveauxCeMois: number; actifs: number }
  devis:    { total: number; brouillon: number; envoye: number; vu: number; accepte: number; refuse: number; tauxAcceptation: number }
  factures: { total: number; brouillon: number; envoyee: number; payee: number; partielle: number; enRetard: number; totalRevenus: number }
  paiements:{ total: number; ceMois: number; moisDernier: number; moyenne: number; count: number }
  revenus:  { mensuel: { mois: string; valeur: number }[]; ceMois: number; moisDernier: number; evolution: number }
  caEnAttente: number
  tauxRecouvrement: number
  top5Clients: { clientId: string; nom: string; total: number }[]
  facturesEnRetard: { id: string; numero: string; clientNom: string; clientTelephone: string | null; totalTTC: number; montantPaye: number; dateEcheance: string | null; publicToken: string }[]
  facturesRecentes: { id: string; numero: string; clientNom: string; totalTTC: number; statut: string }[]
  activite: { id: string; type: string; message: string; lien: string | null; lu: boolean; createdAt: string }[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const d   = new Date(dateStr)
  const ms  = now.getTime() - d.getTime()
  const min = Math.floor(ms / 60000)
  const hr  = Math.floor(ms / 3600000)
  const day = Math.floor(ms / 86400000)
  if (min < 2)  return "À l'instant"
  if (min < 60) return `il y a ${min}min`
  if (hr  < 24) return `il y a ${hr}h`
  if (day === 1) return 'Hier'
  if (day < 7)  return `Il y a ${day}j`
  return d.toLocaleDateString('fr-MA', { day: '2-digit', month: 'short' })
}

function daysOverdue(dateEcheance: string | null): number {
  if (!dateEcheance) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(dateEcheance).getTime()) / 86400000))
}

// ── Card shell ───────────────────────────────────────────────────────────────

function CardHeader({ title, sub, badge }: {
  title: string
  sub?: string
  badge?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h2>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {badge}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, entreprise } = useAuth()
  const { fmt: formatMAD } = useCurrency()
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [typeFilter, setTypeFilter] = useState<TypeClientFilter>('ALL')
  const [relancingId, setRelancingId] = useState<string | null>(null)

  const removed = user?.permissionsRetirees ?? []
  const role    = user?.role ?? ''

  const visibleQuickActions = QUICK_ACTIONS.filter(a => canDo(a.permission, role, removed))

  const showProfileBanner =
    !bannerDismissed &&
    entreprise !== null &&
    ['freelancer', 'auto-entrepreneur'].includes(entreprise.typeCompte ?? '') &&
    !entreprise.activite

  const currentYear       = new Date().getFullYear()
  const currentMonthLabel = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  useEffect(() => {
    setLoading(true)
    dashboardApi
      .analytics(typeFilter === 'ALL' ? undefined : typeFilter)
      .then(res => setAnalytics(res.data?.data ?? res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [typeFilter])

  const monthlyData = analytics?.revenus.mensuel ?? EMPTY_MONTHS

  return (
    <div className="space-y-5 pb-8">

      {/* ── Profile completion banner ───────────────────────────────────────── */}
      {showProfileBanner && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <span className="text-lg flex-shrink-0 mt-0.5 sm:mt-0">✏️</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{t('completeProfile.title')}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">{t('completeProfile.desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ps-7 sm:ps-0">
            <Link
              href="/dashboard/settings?tab=company"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            >
              {t('completeProfile.cta')}
            </Link>
            <button
              onClick={() => setBannerDismissed(true)}
              className="p-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('dashboard.welcome')}, {user?.nom?.split(' ')[0] ?? ''} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{t('dashboard.overview')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Client type filter pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {TYPE_FILTERS.map(({ value, icon: Icon, labelKey }) => {
              const active = typeFilter === value
              return (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                    active
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">{t(labelKey)}</span>
                </button>
              )
            })}
          </div>
          {canDo('devis.create', role, removed) && (
            <Link href="/dashboard/devis?action=create" className="btn-primary text-sm hidden sm:flex">
              <Plus className="w-4 h-4" />
              {t('dashboard.newQuote')}
            </Link>
          )}
        </div>
      </div>

      {/* ── Row 1 · KPI cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          loading={loading}
          label={t('dashboard.totalRevenue')}
          value={analytics ? formatMAD(analytics.paiements.total) : '—'}
          sub={analytics ? `${formatMAD(analytics.caEnAttente)} ${t('dashboard.caEnAttenteDesc')}` : undefined}
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
          sub={analytics ? `${analytics.tauxRecouvrement}% ${t('dashboard.tauxRecouvrement')}` : undefined}
          icon={CreditCard}
          color="orange"
        />
      </div>

      {/* ── Row 2 · Revenue area + Invoice donut ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Revenue area chart */}
        <div className="lg:col-span-2 card rounded-2xl p-5">
          <CardHeader
            title={t('dashboard.revenueChart')}
            sub={`${currentYear} — En MAD`}
            badge={
              analytics && analytics.revenus.evolution !== 0 ? (
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  analytics.revenus.evolution >= 0
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
                    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {analytics.revenus.evolution >= 0 ? '+' : ''}{analytics.revenus.evolution}%
                </div>
              ) : null
            }
          />
          <div style={{ height: 180 }}>
            <RevenueAreaChart data={monthlyData} loading={loading} />
          </div>
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">{currentMonthLabel}</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {analytics ? formatMAD(analytics.revenus.ceMois) : '—'}
            </span>
          </div>
        </div>

        {/* Invoice donut */}
        <div className="card rounded-2xl p-5">
          <CardHeader
            title={t('dashboard.invoiceStatus')}
            sub="Répartition des factures"
            badge={<PieChart className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
          />
          <div style={{ height: 240 }}>
            <InvoiceDonutChart stats={analytics?.factures ?? null} loading={loading} />
          </div>
        </div>
      </div>

      {/* ── Row 3 · Three analytics charts ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

        {/* Payments monthly */}
        <div className="card rounded-2xl p-5">
          <CardHeader
            title="Paiements reçus"
            sub={`${currentYear} — mensuel`}
            badge={<BarChart2 className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
          />
          <div style={{ height: 160 }}>
            <PaymentsBarChart data={monthlyData} loading={loading} />
          </div>
        </div>

        {/* Quote conversion */}
        <div className="card rounded-2xl p-5">
          <CardHeader
            title="Conversion devis"
            sub={analytics ? `${analytics.devis.tauxAcceptation}% acceptés` : '—'}
            badge={<Receipt className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
          />
          <div style={{ height: 160 }}>
            <QuotesConversionChart stats={analytics?.devis ?? null} loading={loading} />
          </div>
        </div>

        {/* Client stats */}
        <div className="card rounded-2xl p-5">
          <CardHeader
            title="Aperçu clients"
            sub="Actifs · Nouveaux · Total"
            badge={<Users className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
          />
          <div style={{ height: 160 }}>
            {loading ? (
              <ChartSkeleton height={160} />
            ) : (
              <ClientStatsVisual
                total={analytics?.clients.total ?? 0}
                actifs={analytics?.clients.actifs ?? 0}
                nouveauxCeMois={analytics?.clients.nouveauxCeMois ?? 0}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Row 4 · Quick actions + Recent invoices ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Quick actions */}
        <div className="card rounded-2xl p-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-4">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {visibleQuickActions.map(a => (
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
        </div>

        {/* Recent invoices */}
        <div className="lg:col-span-2 card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.recentInvoices')}</h2>
            <Link href="/dashboard/factures" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              {t('common.viewAll')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1.5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))
            ) : analytics?.facturesRecentes.length ? (
              analytics.facturesRecentes.map(f => (
                <Link
                  key={f.id}
                  href="/dashboard/factures"
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
      </div>

      {/* ── Row 5 · Top 5 clients + Factures en retard ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

        {/* Top 5 clients */}
        <div className="card rounded-2xl p-5">
          <CardHeader
            title={t('dashboard.top5Clients')}
            sub={t('dashboard.top5Desc')}
            badge={<Users className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
          />
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : analytics?.top5Clients.length ? (() => {
            const max = analytics.top5Clients[0].total
            return (
              <div className="space-y-3">
                {analytics.top5Clients.map((c, i) => (
                  <div key={c.clientId} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-4 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{c.nom}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex-shrink-0 ms-2">{formatMAD(c.total)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-teal-500 transition-all"
                          style={{ width: `${max > 0 ? (c.total / max) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })() : (
            <p className="text-xs text-slate-400 text-center py-6">{t('common.noResults')}</p>
          )}
        </div>

        {/* Factures en retard */}
        <div className="card rounded-2xl p-5">
          <CardHeader
            title={t('dashboard.facturesEnRetard')}
            sub={analytics ? `${analytics.factures.enRetard} ${t('dashboard.overdue')}` : '—'}
            badge={<AlertCircle className="w-4 h-4 text-red-400" />}
          />
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : analytics?.facturesEnRetard.length ? (
            <div className="space-y-2">
              {analytics.facturesEnRetard.map(f => {
                const days = daysOverdue(f.dateEcheance)
                const phone = toWhatsAppNumber(f.clientTelephone)
                const reste = Math.max(0, f.totalTTC - f.montantPaye)
                const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://sayerli.com'}/public/factures/${f.publicToken}`
                const msg = f.montantPaye > 0
                  ? [
                      `Bonjour ${f.clientNom},`,
                      '',
                      `Nous avons bien reçu votre paiement de *${formatMAD(f.montantPaye)}* sur votre facture *${f.numero}* d'un montant total de *${formatMAD(f.totalTTC)}*.`,
                      '',
                      `Il reste un solde de *${formatMAD(reste)}* à régler. Pourriez-vous régulariser ce solde dans les meilleurs délais ?`,
                      '',
                      `Consultez votre facture ici : ${url}`,
                      '',
                      'Merci pour votre confiance.',
                    ].join('\n')
                  : [
                      `Bonjour ${f.clientNom},`,
                      '',
                      `Nous vous contactons au sujet de votre facture *${f.numero}* d'un montant de *${formatMAD(f.totalTTC)}*.`,
                      '',
                      `Nous n'avons pas encore reçu votre règlement. Pourriez-vous régulariser cette situation dans les meilleurs délais ?`,
                      '',
                      `Consultez votre facture ici : ${url}`,
                      '',
                      'Merci pour votre confiance.',
                    ].join('\n')

                const canRelancer = canDo('factures.relance', role, removed)

                const handleRelancer = async () => {
                  setRelancingId(f.id)
                  try {
                    await facturesApi.relancer(f.id)
                    if (phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
                  } catch {
                    // backend rejected (403, rate limit, etc.) — do not open WhatsApp
                  } finally {
                    setRelancingId(null)
                  }
                }

                return (
                  <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{f.clientNom}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{f.numero}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">
                          {f.montantPaye > 0 ? `${formatMAD(reste)} restant` : formatMAD(f.totalTTC)}
                        </span>
                        {f.montantPaye > 0 && (
                          <span className="text-[10px] text-green-600 dark:text-green-400 flex-shrink-0">
                            {formatMAD(f.montantPaye)} payé
                          </span>
                        )}
                        {days > 0 && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex-shrink-0">
                            {days} {t('dashboard.joursRetard')}
                          </span>
                        )}
                      </div>
                    </div>
                    {canRelancer && (
                      <button
                        onClick={handleRelancer}
                        disabled={relancingId === f.id}
                        title={t('dashboard.relancer')}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-all bg-[#25D366] hover:bg-[#1ebe5d] text-white disabled:opacity-60"
                      >
                        {relancingId === f.id
                          ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <Bell className="w-3 h-3" />
                        }
                        <span className="hidden sm:inline">{t('dashboard.relancer')}</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-2 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-xs">{t('dashboard.aucunRetard')}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Row 6 · Recent activity ─────────────────────────────────────────── */}
      <div className="card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.recentActivity')}</h2>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-4/5" />
                  <div className="h-2.5 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-1/3" />
                </div>
              </div>
            ))
          ) : analytics?.activite.length ? (
            analytics.activite.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ACTIVITY_COLORS[a.type] ?? 'bg-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">{a.message}</p>
                  <span className="text-[10px] text-slate-400">{formatRelativeTime(a.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 col-span-4 text-center py-4">{t('common.noResults')}</p>
          )}
        </div>
      </div>

    </div>
  )
}
