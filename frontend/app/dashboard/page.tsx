'use client'

import React, { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, Users, Receipt, CreditCard, Wallet,
  Plus, ArrowRight, Clock, X, User, Building2, Briefcase,
  Bell, AlertCircle, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import { dashboardApi, facturesApi } from '@/lib/api'
import { useCurrency } from '@/hooks/useCurrency'
import { cn, toWhatsAppNumber, formatCurrency } from '@/lib/utils'
import { PermissionKey } from '@/lib/role-permissions'
import { canDo } from '@/lib/permissions'

// ── Constants ─────────────────────────────────────────────────────────────────

const QUICK_ACTIONS: { href: string; icon: React.ElementType; labelKey: string; color: string; permission: PermissionKey }[] = [
  { href: '/dashboard/devis?action=create',     icon: Receipt,    labelKey: 'dashboard.newQuote',   color: 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-950', permission: 'devis.create' },
  { href: '/dashboard/factures?action=create',  icon: CreditCard, labelKey: 'dashboard.newInvoice', color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-950',             permission: 'factures.create' },
  { href: '/dashboard/clients?action=create',   icon: Users,      labelKey: 'dashboard.newClient',  color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950',   permission: 'clients.create' },
  { href: '/dashboard/paiements?action=create', icon: Wallet,     labelKey: 'dashboard.payments',   color: 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950',  permission: 'paiements.create' },
]

const ACTIVITY_COLORS: Record<string, string> = {
  PAIEMENT_RECU:     'bg-green-500',
  FACTURE_PAYEE:     'bg-green-500',
  DEVIS_ACCEPTE:     'bg-blue-500',
  FACTURE_CREEE:     'bg-purple-500',
  DEVIS_ENVOYE:      'bg-teal-500',
  FACTURE_PARTIELLE: 'bg-amber-500',
  DEVIS_REFUSE:      'bg-red-400',
  RAPPEL_ECHEANCE:   'bg-orange-500',
  DEVIS_VU:          'bg-indigo-400',
}

const EMPTY_MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
  .map(mois => ({ mois, valeur: 0 }))

// Deterministic skeleton heights to avoid hydration mismatch
const BAR_SKELETON = [35, 58, 42, 72, 48, 80, 62, 75, 52, 68, 44, 70]

type TypeClientFilter = 'ALL' | 'PARTICULIER' | 'ENTREPRISE' | 'FREELANCE'

const TYPE_FILTERS: { value: TypeClientFilter; icon: React.ElementType; labelKey: string }[] = [
  { value: 'ALL',         icon: Users,     labelKey: 'dashboard.filterAll'         },
  { value: 'PARTICULIER', icon: User,      labelKey: 'dashboard.filterParticulier' },
  { value: 'ENTREPRISE',  icon: Building2, labelKey: 'dashboard.filterEntreprise'  },
  { value: 'FREELANCE',   icon: Briefcase, labelKey: 'dashboard.filterFreelance'   },
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardAnalytics {
  clients:  { total: number; nouveauxCeMois: number; actifs: number }
  devis:    { total: number; brouillon: number; envoye: number; vu: number; accepte: number; refuse: number; tauxAcceptation: number }
  factures: { total: number; brouillon: number; envoyee: number; payee: number; partielle: number; enRetard: number; totalRevenus: number }
  paiements:{ total: number; ceMois: number; moisDernier: number; moyenne: number; count: number }
  revenus:  { mensuel: { mois: string; valeur: number }[]; ceMois: number; moisDernier: number; evolution: number }
  caEnAttente: number
  tauxRecouvrement: number
  parDevise: { devise: string; caTotal: number; caPaye: number; caEnAttente: number }[]
  top5Clients: { clientId: string; nom: string; total: number }[]
  facturesEnRetard: { id: string; numero: string; clientNom: string; clientTelephone: string | null; totalTTC: number; montantPaye: number; dateEcheance: string | null; publicToken: string }[]
  facturesRecentes: { id: string; numero: string; clientNom: string; totalTTC: number; statut: string }[]
  activite: { id: string; type: string; message: string; lien: string | null; lu: boolean; createdAt: string }[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string, t: (k: string) => string): string {
  const now = new Date()
  const d   = new Date(dateStr)
  const ms  = now.getTime() - d.getTime()
  const min = Math.floor(ms / 60000)
  const hr  = Math.floor(ms / 3600000)
  const day = Math.floor(ms / 86400000)
  if (min < 2)   return t('dashboard.instant')
  if (min < 60)  return t('dashboard.minutesAgo').replace('{min}', String(min))
  if (hr  < 24)  return t('dashboard.hoursAgo').replace('{h}', String(hr))
  if (day === 1) return t('dashboard.yesterday')
  if (day < 7)   return t('dashboard.daysAgo').replace('{j}', String(day))
  return d.toLocaleDateString('fr-MA', { day: '2-digit', month: 'short' })
}

function daysOverdue(dateEcheance: string | null): number {
  if (!dateEcheance) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(dateEcheance).getTime()) / 86400000))
}

// ── Pure-CSS sub-components ───────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bg-slate-100 dark:bg-slate-800 rounded animate-pulse', className)} />
}

function TrendBadge({ value }: { value: number }) {
  const up = value >= 0
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0',
      up ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
         : 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400',
    )}>
      {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {up ? '+' : ''}{value}%
    </span>
  )
}

// KPI card — big number + optional micro-sparkline (last 6 months, CSS bars)
function KpiCard({
  label, value, sub, trend, spark, loading,
}: {
  label: string
  value: string | number
  sub?: string
  trend?: number
  spark?: { valeur: number }[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="card rounded-2xl p-5 space-y-3">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
        {spark !== undefined && (
          <div className="flex items-end gap-0.5 h-9 pt-1">
            {BAR_SKELETON.slice(0, 6).map((h, i) => (
              <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${h}%` } as React.CSSProperties} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const sparkMax = spark ? Math.max(...spark.slice(-6).map(d => d.valeur), 1) : 1

  return (
    <div className="card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{label}</p>
        {trend !== undefined && trend !== 0 && <TrendBadge value={trend} />}
      </div>
      <p className="mt-2 text-[26px] font-black text-slate-900 dark:text-white tabular-nums leading-none tracking-tight">
        {value}
      </p>
      {sub && <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{sub}</p>}
      {spark && (
        <div className="flex items-end gap-0.5 h-9 mt-4">
          {spark.slice(-6).map((d, i) => (
            <div
              key={i}
              className="flex-1 bg-primary-400/30 dark:bg-primary-400/20 rounded-sm"
              style={{ height: `${Math.max((d.valeur / sparkMax) * 100, 6)}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 12-month CSS bar chart — current month highlighted, hover tooltip
function RevenueChart({
  data, loading, formatMAD,
}: {
  data: { mois: string; valeur: number }[]
  loading: boolean
  formatMAD: (v: number) => string
}) {
  const currentMonth = new Date().getMonth()
  const max = Math.max(...data.map(d => d.valeur), 1)

  if (loading) {
    return (
      <div className="flex items-end gap-1.5" style={{ height: 120 }}>
        {BAR_SKELETON.map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${h}%` } as React.CSSProperties} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-end gap-1.5" style={{ height: 120 }}>
      {data.map((d, i) => {
        const isCurrent = i === currentMonth
        const h = Math.max((d.valeur / max) * 100, 2)
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
            <div
              className={cn(
                'w-full rounded-t relative',
                isCurrent
                  ? 'bg-primary-500 dark:bg-primary-400'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors',
              )}
              style={{ height: `${h}%` }}
            >
              {d.valeur > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                    {formatMAD(d.valeur)}
                  </div>
                </div>
              )}
            </div>
            <span className={cn(
              'text-[9px] font-medium',
              isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-600',
            )}>
              {d.mois}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Invoice status — thin stacked bar + clean list (replaces the donut)
function InvoiceBreakdown({
  stats, loading, t,
}: {
  stats: DashboardAnalytics['factures'] | null
  loading: boolean
  t: (k: string) => string
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-1.5 w-full rounded-full" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center justify-between gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const total = Math.max(stats.total, 1)
  const rows = [
    { key: 'payee',     label: 'Payée',                       n: stats.payee,     bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
    { key: 'partielle', label: 'Partielle',                   n: stats.partielle, bar: 'bg-amber-400',   dot: 'bg-amber-400'   },
    { key: 'envoyee',   label: 'Envoyée',                     n: stats.envoyee,   bar: 'bg-blue-400',    dot: 'bg-blue-400'    },
    { key: 'enRetard',  label: t('dashboard.overdue'),        n: stats.enRetard,  bar: 'bg-red-400',     dot: 'bg-red-400'     },
    { key: 'brouillon', label: t('dashboard.stageBrouillon'), n: stats.brouillon, bar: 'bg-slate-300 dark:bg-slate-600', dot: 'bg-slate-400' },
  ]

  return (
    <div>
      {/* Stacked bar */}
      <div className="h-1.5 rounded-full overflow-hidden flex mb-5">
        {rows.map(r => (
          <div
            key={r.key}
            className={`${r.bar} transition-all duration-700`}
            style={{ width: `${(r.n / total) * 100}%` }}
          />
        ))}
      </div>
      {/* List */}
      <div className="space-y-3">
        {rows.map(r => {
          const pct = Math.round((r.n / total) * 100)
          return (
            <div key={r.key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`} />
                <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{r.label}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 tabular-nums">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.n}</span>
                <span className="text-[10px] text-slate-400 w-6 text-right">{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Devis pipeline — 5 pill stages with chevrons, no library
function Pipeline({
  devis, loading, t,
}: {
  devis: DashboardAnalytics['devis'] | null
  loading: boolean
  t: (k: string) => string
}) {
  const stages = [
    { key: 'brouillon', labelKey: 'dashboard.stageBrouillon', n: devis?.brouillon ?? 0, bg: 'bg-slate-100 dark:bg-slate-800',         num: 'text-slate-900 dark:text-white',           lbl: 'text-slate-500 dark:text-slate-400'    },
    { key: 'envoye',    labelKey: 'dashboard.stageEnvoye',    n: devis?.envoye ?? 0,    bg: 'bg-blue-50 dark:bg-blue-950/40',          num: 'text-blue-700 dark:text-blue-300',         lbl: 'text-blue-600 dark:text-blue-400'      },
    { key: 'vu',        labelKey: 'dashboard.stageVu',        n: devis?.vu ?? 0,        bg: 'bg-indigo-50 dark:bg-indigo-950/40',      num: 'text-indigo-700 dark:text-indigo-300',     lbl: 'text-indigo-600 dark:text-indigo-400'  },
    { key: 'accepte',   labelKey: 'dashboard.stageAccepte',   n: devis?.accepte ?? 0,   bg: 'bg-emerald-50 dark:bg-emerald-950/40',    num: 'text-emerald-700 dark:text-emerald-300',   lbl: 'text-emerald-600 dark:text-emerald-400'},
    { key: 'refuse',    labelKey: 'dashboard.stageRefuse',    n: devis?.refuse ?? 0,    bg: 'bg-red-50 dark:bg-red-950/30',            num: 'text-red-600 dark:text-red-300',           lbl: 'text-red-500 dark:text-red-400'        },
  ]

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        {stages.map((s, i) => (
          <React.Fragment key={s.key}>
            <Skeleton className="flex-1 h-14 rounded-xl" />
            {i < stages.length - 1 && <Skeleton className="w-4 h-4 rounded flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-stretch gap-2">
      {stages.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={`flex-1 rounded-xl px-3 py-3 ${s.bg}`}>
            <p className={`text-2xl font-black tabular-nums leading-none ${s.num}`}>{s.n}</p>
            <p className={`text-[10px] font-semibold mt-1.5 ${s.lbl}`}>{t(s.labelKey)}</p>
          </div>
          {/* Chevron between main stages, divider before "Refusé" */}
          {i < 3 && <div className="flex items-center flex-shrink-0"><ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" /></div>}
          {i === 3 && <div className="flex items-center flex-shrink-0"><div className="w-px h-8 bg-slate-200 dark:bg-slate-700" /></div>}
        </React.Fragment>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

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
  const visibleActions = QUICK_ACTIONS.filter(a => canDo(a.permission, role, removed))

  const showProfileBanner =
    !bannerDismissed &&
    entreprise !== null &&
    ['freelancer', 'auto-entrepreneur'].includes(entreprise.typeCompte ?? '') &&
    !entreprise.activite

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setLoading(true)
    dashboardApi
      .analytics(typeFilter === 'ALL' ? undefined : typeFilter)
      .then(res => setAnalytics(res.data?.data ?? res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [typeFilter])

  const monthlyData = analytics?.revenus.mensuel ?? EMPTY_MONTHS

  // Currency conversion
  const defaultDevise   = entreprise?.devise ?? 'MAD'
  const tauxEUR         = entreprise?.tauxEUR ?? null
  const tauxUSD         = entreprise?.tauxUSD ?? null
  const hasMultiDevise  = (analytics?.parDevise?.length ?? 0) > 1
  const ratesConfigured = tauxEUR !== null && tauxUSD !== null

  function toMAD(amount: number, devise: string) {
    if (devise === 'EUR') return amount * (tauxEUR ?? 1)
    if (devise === 'USD') return amount * (tauxUSD ?? 1)
    return amount
  }
  function toMADRate(devise: string) {
    if (devise === 'EUR') return tauxEUR ?? 1
    if (devise === 'USD') return tauxUSD ?? 1
    return 1
  }
  function convert(amount: number, from: string) {
    return toMAD(amount, from) / toMADRate(defaultDevise)
  }

  const convertedCA = analytics && hasMultiDevise && ratesConfigured
    ? analytics.parDevise.reduce((s, d) => s + convert(d.caPaye, d.devise), 0) : null
  const convertedEnAttente = analytics && hasMultiDevise && ratesConfigured
    ? analytics.parDevise.reduce((s, d) => s + convert(d.caEnAttente, d.devise), 0) : null

  const isNewUser = !loading && analytics !== null && analytics.clients.total === 0

  return (
    <div className="space-y-4 pb-8">

      {/* ── Profile completion banner ─────────────────────────────────────────── */}
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
            <Link href="/dashboard/settings?tab=company" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors">
              {t('completeProfile.cta')}
            </Link>
            <button onClick={() => setBannerDismissed(true)} className="p-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('dashboard.welcome')}, {user?.nom?.split(' ')[0] ?? ''} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">{t('dashboard.overview')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
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

      {/* ── Empty state ───────────────────────────────────────────────────────── */}
      {isNewUser ? (
        <div className="card rounded-2xl p-10 text-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Bienvenue sur Sayerli 🎉</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Commencez par configurer votre espace en 3 étapes simples.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { href: '/dashboard/clients?action=create',  icon: Users,      label: '1. Ajouter un client',   bg: 'bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50', iconBg: 'bg-purple-100 dark:bg-purple-900/50', iconColor: 'text-purple-600 dark:text-purple-400' },
              { href: '/dashboard/devis?action=create',    icon: Receipt,    label: '2. Créer un devis',      bg: 'bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-950/50', iconBg: 'bg-primary-100 dark:bg-primary-900/50', iconColor: 'text-primary-600 dark:text-primary-400' },
              { href: '/dashboard/factures?action=create', icon: CreditCard, label: '3. Envoyer une facture', bg: 'bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-950/50', iconBg: 'bg-teal-100 dark:bg-teal-900/50', iconColor: 'text-teal-600 dark:text-teal-400' },
            ].map(step => (
              <Link key={step.href} href={step.href} className={`flex flex-col items-center gap-3 p-5 rounded-xl transition-colors ${step.bg}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.iconBg}`}>
                  <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{step.label}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>

          {/* ── Row 1 · KPI cards ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              loading={loading}
              label={t('dashboard.totalRevenue')}
              value={analytics
                ? convertedCA !== null ? formatCurrency(convertedCA, defaultDevise) : formatMAD(analytics.paiements.total)
                : '—'}
              sub={analytics
                ? convertedEnAttente !== null
                  ? `${formatCurrency(convertedEnAttente, defaultDevise)} ${t('dashboard.caEnAttenteDesc')}`
                  : hasMultiDevise && !ratesConfigured
                    ? t('dashboard.tauxNonConfig')
                    : `${formatMAD(analytics.caEnAttente)} ${t('dashboard.caEnAttenteDesc')}`
                : undefined}
              trend={analytics?.revenus.evolution}
              spark={monthlyData}
            />
            <KpiCard
              loading={loading}
              label={t('dashboard.caEnAttente')}
              value={analytics ? formatMAD(analytics.caEnAttente) : '—'}
              sub={analytics ? `${analytics.tauxRecouvrement}% ${t('dashboard.tauxRecouvrement')}` : undefined}
            />
            <KpiCard
              loading={loading}
              label={t('dashboard.clients')}
              value={analytics?.clients.total ?? '—'}
              sub={analytics ? `${analytics.clients.actifs} actifs · +${analytics.clients.nouveauxCeMois} ${t('dashboard.thisMonth')}` : undefined}
            />
            <KpiCard
              loading={loading}
              label={t('dashboard.quotes')}
              value={analytics ? `${analytics.devis.accepte}/${analytics.devis.total}` : '—'}
              sub={analytics ? `${analytics.devis.tauxAcceptation}% ${t('dashboard.accepted')}` : undefined}
            />
          </div>

          {/* ── Per-devise breakdown ────────────────────────────────────────────── */}
          {analytics && analytics.parDevise.length > 1 && (
            <div className="card rounded-2xl p-4 sm:p-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t('dashboard.devisesTitle')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {analytics.parDevise.map(d => (
                  <div key={d.devise} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase">{d.devise}</span>
                    <div className="mt-1.5 space-y-0.5">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>{t('dashboard.caTotal')}</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(d.caTotal, d.devise)}</span></div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>{t('dashboard.paye')}</span><span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(d.caPaye, d.devise)}</span></div>
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>{t('dashboard.enAttente')}</span><span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(d.caEnAttente, d.devise)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Row 2 · Revenue bars + Invoice breakdown ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Revenue CSS bar chart */}
            <div className="lg:col-span-2 card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.revenueChart')}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.revenueChartSub').replace('{year}', String(currentYear))}</p>
                </div>
                {analytics && analytics.revenus.evolution !== 0 && <TrendBadge value={analytics.revenus.evolution} />}
              </div>

              <RevenueChart data={monthlyData} loading={loading} formatMAD={formatMAD} />

              {/* Ce mois vs mois dernier */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2.5">
                  <p className="text-[10px] font-medium text-slate-400 capitalize">
                    {new Date().toLocaleDateString(undefined, { month: 'long' })}
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {analytics ? formatMAD(analytics.revenus.ceMois) : '—'}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2.5">
                  <p className="text-[10px] font-medium text-slate-400">{t('dashboard.revenuMoisDernier')}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {analytics ? formatMAD(analytics.revenus.moisDernier) : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice breakdown */}
            <div className="card rounded-2xl p-5">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{t('dashboard.invoiceStatus')}</h2>
              <p className="text-xs text-slate-400 mb-5">{t('dashboard.invoiceStatusSub')}</p>
              <InvoiceBreakdown stats={analytics?.factures ?? null} loading={loading} t={t} />
            </div>
          </div>

          {/* ── Row 3 · Devis pipeline ──────────────────────────────────────────── */}
          <div className="card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.pipeline')}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.pipelineSub')}</p>
              </div>
              {analytics && (
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full tabular-nums">
                  {analytics.devis.total} total
                </span>
              )}
            </div>
            <Pipeline devis={analytics?.devis ?? null} loading={loading} t={t} />
            {/* Acceptance progress bar */}
            {analytics && analytics.devis.total > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${(analytics.devis.accepte / analytics.devis.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums flex-shrink-0">
                  {analytics.devis.tauxAcceptation}% {t('dashboard.conversionRate')}
                </span>
              </div>
            )}
          </div>

          {/* ── Row 4 · Quick actions + Recent invoices ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Quick actions */}
            <div className="card rounded-2xl p-5">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-4">{t('dashboard.quickActions')}</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {visibleActions.map(a => {
                  const Icon = a.icon
                  return (
                    <Link
                      key={a.href}
                      href={a.href}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-xl text-center transition-all hover:-translate-y-0.5 group ${a.color}`}
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold leading-tight">{t(a.labelKey)}</span>
                    </Link>
                  )
                })}
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
              <div className="space-y-1">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)
                ) : analytics?.facturesRecentes.length ? (
                  analytics.facturesRecentes.map(f => (
                    <Link
                      key={f.id}
                      href={`/dashboard/factures?id=${f.id}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{f.clientNom}</p>
                        <p className="text-[10px] text-slate-400 tabular-nums">{f.numero}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{formatMAD(f.totalTTC)}</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Top 5 clients */}
            <div className="card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.top5Clients')}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.top5Desc')}</p>
                </div>
                <Link href="/dashboard/clients" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  {t('common.viewAll')} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 rounded-xl" />)}</div>
              ) : analytics?.top5Clients.length ? (() => {
                const max = analytics.top5Clients[0].total
                return (
                  <div className="space-y-3">
                    {analytics.top5Clients.map((c, i) => (
                      <div key={c.clientId} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-300 dark:text-slate-600 w-4 flex-shrink-0 tabular-nums">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{c.nom}</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white flex-shrink-0 ms-2 tabular-nums">{formatMAD(c.total)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-teal-500"
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.facturesEnRetard')}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {analytics ? `${analytics.factures.enRetard} ${t('dashboard.overdue')}` : '—'}
                  </p>
                </div>
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              </div>
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
              ) : analytics?.facturesEnRetard.length ? (
                <div className="space-y-2">
                  {analytics.facturesEnRetard.map(f => {
                    const days  = daysOverdue(f.dateEcheance)
                    const phone = toWhatsAppNumber(f.clientTelephone)
                    const reste = Math.max(0, f.totalTTC - f.montantPaye)
                    const url   = `${typeof window !== 'undefined' ? window.location.origin : 'https://sayerli.com'}/public/factures/${f.publicToken}`
                    const msg   = f.montantPaye > 0
                      ? [`Bonjour ${f.clientNom},`, '', `Nous avons bien reçu votre paiement de *${formatMAD(f.montantPaye)}* sur votre facture *${f.numero}* d'un montant total de *${formatMAD(f.totalTTC)}*.`, '', `Il reste un solde de *${formatMAD(reste)}* à régler. Pourriez-vous régulariser ce solde dans les meilleurs délais ?`, '', `Consultez votre facture ici : ${url}`, '', 'Merci pour votre confiance.'].join('\n')
                      : [`Bonjour ${f.clientNom},`, '', `Nous vous contactons au sujet de votre facture *${f.numero}* d'un montant de *${formatMAD(f.totalTTC)}*.`, '', `Nous n'avons pas encore reçu votre règlement. Pourriez-vous régulariser cette situation dans les meilleurs délais ?`, '', `Consultez votre facture ici : ${url}`, '', 'Merci pour votre confiance.'].join('\n')

                    const canRelancer = canDo('factures.relance', role, removed)

                    const handleRelancer = async () => {
                      setRelancingId(f.id)
                      try {
                        await facturesApi.relancer(f.id)
                        if (phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
                      } catch {
                        // backend rejected — do not open WhatsApp
                      } finally {
                        setRelancingId(null)
                      }
                    }

                    return (
                      <div
                        key={f.id}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl border',
                          days === 0 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/40'
                            : days <= 6 ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40'
                            : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40',
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{f.clientNom}</span>
                            <span className="text-[10px] text-slate-400 flex-shrink-0 tabular-nums">{f.numero}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 tabular-nums">
                              {f.montantPaye > 0 ? `${formatMAD(reste)} ${t('dashboard.restant')}` : formatMAD(f.totalTTC)}
                            </span>
                            {f.montantPaye > 0 && (
                              <span className="text-[10px] text-green-600 dark:text-green-400 flex-shrink-0 tabular-nums">
                                {formatMAD(f.montantPaye)} {t('dashboard.payeLabel')}
                              </span>
                            )}
                            {days > 0 && (
                              <span className={cn(
                                'text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 tabular-nums',
                                days <= 6
                                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                                  : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
                              )}>
                                {days} {t('dashboard.joursRetard')}
                              </span>
                            )}
                          </div>
                        </div>
                        {canRelancer && (
                          <button
                            onClick={handleRelancer}
                            disabled={relancingId === f.id}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-colors disabled:opacity-60"
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
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-xs text-slate-400">{t('dashboard.aucunRetard')}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Row 6 · Activity feed ───────────────────────────────────────────── */}
          <div className="card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('dashboard.recentActivity')}</h2>
              <div className="flex items-center gap-3">
                <Link href="/dashboard/activite" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  Voir tout <ArrowRight className="w-3 h-3" />
                </Link>
                <Clock className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
            </div>
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-4/5" />
                      <Skeleton className="h-2.5 w-1/3" />
                    </div>
                  </div>
                ))
              ) : analytics?.activite.length ? (
                analytics.activite.map(a => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${ACTIVITY_COLORS[a.type] ?? 'bg-slate-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">{a.message}</p>
                      <span className="text-[10px] text-slate-400">{formatRelativeTime(a.createdAt, t)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">{t('common.noResults')}</p>
              )}
            </div>
          </div>

        </>
      )}
    </div>
  )
}
