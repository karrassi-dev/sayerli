'use client'

import { useTheme } from 'next-themes'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'
import { useCurrency } from '@/hooks/useCurrency'

// ── Theme-aware colours ───────────────────────────────────────────────────────

function useChartColors() {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'
  return {
    dark,
    grid:         dark ? '#1e293b' : '#f1f5f9',
    muted:        dark ? '#475569' : '#cbd5e1',
    text:         '#94a3b8',
    tooltipBg:    dark ? '#0f172a' : '#ffffff',
    tooltipBorder:dark ? '#1e293b' : '#e2e8f0',
    tooltipText:  dark ? '#f1f5f9' : '#0f172a',
  }
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

function ChartTooltip({
  active, payload, label, valueFormatter,
}: {
  active?: boolean
  payload?: { color: string; value: number; name?: string }[]
  label?: string
  valueFormatter?: (v: number) => string
}) {
  const c = useChartColors()
  if (!active || !payload?.length) return null
  const fmt = valueFormatter ?? String

  return (
    <div style={{
      background: c.tooltipBg,
      border: `1px solid ${c.tooltipBorder}`,
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.14)',
      minWidth: 120,
    }}>
      {label && (
        <p style={{ color: c.text, fontSize: 11, marginBottom: 4 }}>{label}</p>
      )}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 700, margin: 0 }}>
          {p.name && <span style={{ color: c.text, fontWeight: 500 }}>{p.name}: </span>}
          {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────

export function ChartSkeleton({ height = 180 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
      style={{ height }}
    />
  )
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 dark:text-slate-600">
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base">—</div>
      <p className="text-xs">{label}</p>
    </div>
  )
}

// ── 1. Revenue Area Chart ─────────────────────────────────────────────────────

export function RevenueAreaChart({
  data,
  loading,
}: {
  data: { mois: string; valeur: number }[]
  loading?: boolean
}) {
  const c = useChartColors()
  const { fmt: formatMAD } = useCurrency()

  if (loading) return <ChartSkeleton height={180} />
  if (!data.some(d => d.valeur > 0)) return <EmptyChart label="Aucun revenu enregistré" />

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
        <XAxis
          dataKey="mois"
          tick={{ fill: c.text, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          dy={4}
        />
        <YAxis
          tick={{ fill: c.text, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          width={38}
        />
        <Tooltip
          content={(props: any) => (
            <ChartTooltip {...props} valueFormatter={formatMAD} />
          )}
        />
        <Area
          type="monotone"
          dataKey="valeur"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#gradRevenue)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── 2. Payments Bar Chart ─────────────────────────────────────────────────────

export function PaymentsBarChart({
  data,
  loading,
}: {
  data: { mois: string; valeur: number }[]
  loading?: boolean
}) {
  const c = useChartColors()
  const { fmt: formatMAD } = useCurrency()

  if (loading) return <ChartSkeleton height={160} />
  if (!data.some(d => d.valeur > 0)) return <EmptyChart label="Aucun paiement enregistré" />

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
        <XAxis
          dataKey="mois"
          tick={{ fill: c.text, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          dy={4}
        />
        <YAxis
          tick={{ fill: c.text, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          width={38}
        />
        <Tooltip
          content={(props: any) => (
            <ChartTooltip {...props} valueFormatter={formatMAD} />
          )}
        />
        <Bar dataKey="valeur" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── 3. Invoice Donut Chart ────────────────────────────────────────────────────

interface FacturesStats {
  total: number
  payee: number
  envoyee: number
  enRetard: number
  partielle: number
  brouillon: number
}

const DONUT_COLORS = [
  { key: 'payee',    label: 'Payées',     color: '#22c55e' },
  { key: 'envoyee',  label: 'Envoyées',   color: '#3b82f6' },
  { key: 'enRetard', label: 'En retard',  color: '#ef4444' },
  { key: 'partielle',label: 'Partielles', color: '#f59e0b' },
  { key: 'brouillon',label: 'Brouillons', color: '#94a3b8' },
]

export function InvoiceDonutChart({
  stats,
  loading,
}: {
  stats: FacturesStats | null
  loading?: boolean
}) {
  if (loading || !stats) return <ChartSkeleton height={200} />

  const data = DONUT_COLORS
    .map(d => ({ ...d, value: stats[d.key as keyof FacturesStats] as number }))
    .filter(d => d.value > 0)

  if (!data.length) return <EmptyChart label="Aucune facture" />

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Donut */}
      <div style={{ height: 128, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="76%"
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={(props: any) => <ChartTooltip {...props} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Center label */}
      <p className="text-center -mt-1 mb-2.5">
        <span className="text-xl font-black text-slate-900 dark:text-white">{stats.total}</span>
        <span className="text-xs text-slate-400 ml-1">factures</span>
      </p>
      {/* Legend */}
      <div className="space-y-1">
        {data.map(d => (
          <div key={d.key} className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-slate-600 dark:text-slate-400">{d.label}</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 4. Quotes Conversion Chart ────────────────────────────────────────────────

interface DevisStats {
  total: number
  brouillon: number
  envoye: number
  vu: number
  accepte: number
  refuse: number
  tauxAcceptation: number
}

const QUOTES_COLORS = ['#94a3b8', '#3b82f6', '#22c55e', '#ef4444']

export function QuotesConversionChart({
  stats,
  loading,
}: {
  stats: DevisStats | null
  loading?: boolean
}) {
  const c = useChartColors()

  if (loading || !stats) return <ChartSkeleton height={160} />
  if (stats.total === 0) return <EmptyChart label="Aucun devis" />

  const data = [
    { name: 'Brouillons', value: stats.brouillon },
    { name: 'Envoyés',    value: stats.envoye + stats.vu },
    { name: 'Acceptés',   value: stats.accepte },
    { name: 'Refusés',    value: stats.refuse },
  ].filter(d => d.value > 0)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, bottom: 0, left: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: c.text, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: c.text, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip content={(props: any) => <ChartTooltip {...props} />} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((_, i) => (
            <Cell key={i} fill={QUOTES_COLORS[i] ?? '#94a3b8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── 5. Client Stats Visual (no historical data needed) ────────────────────────

export function ClientStatsVisual({
  total,
  actifs,
  nouveauxCeMois,
  loading,
}: {
  total: number
  actifs: number
  nouveauxCeMois: number
  loading?: boolean
}) {
  if (loading) return <ChartSkeleton height={160} />
  if (total === 0) return <EmptyChart label="Aucun client" />

  const activeRatio = total > 0 ? Math.round((actifs / total) * 100) : 0

  return (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      {/* Big number */}
      <div className="text-center">
        <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{total}</div>
        <p className="text-xs text-slate-400 mt-0.5">clients au total</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-teal-50 dark:bg-teal-950/30 rounded-xl p-2 text-center">
          <div className="text-lg font-black text-teal-600 dark:text-teal-400">{actifs}</div>
          <div className="text-[10px] text-teal-500 dark:text-teal-500 font-medium">Actifs</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-2 text-center">
          <div className="text-lg font-black text-purple-600 dark:text-purple-400">+{nouveauxCeMois}</div>
          <div className="text-[10px] text-purple-500 dark:text-purple-500 font-medium">Ce mois</div>
        </div>
      </div>

      {/* Active ratio bar */}
      <div className="mt-2">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Taux d'activité</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{activeRatio}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-700"
            style={{ width: `${activeRatio}%` }}
          />
        </div>
      </div>
    </div>
  )
}
