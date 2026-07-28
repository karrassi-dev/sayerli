'use client'

import { TrendingUp, Users, Receipt, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const monthlyData = [38, 52, 44, 67, 58, 78, 65, 89, 72, 95, 84, 102]
const maxVal = Math.max(...monthlyData)

const KPI_ICONS = [TrendingUp, Receipt, Users, Clock]
const KPI_COLORS = [
  { text: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-950/50', glow: '#6366f1' },
  { text: 'text-teal-600 dark:text-teal-400',      bg: 'bg-teal-50 dark:bg-teal-950/50',      glow: '#14b8a6' },
  { text: 'text-purple-600 dark:text-purple-400',  bg: 'bg-purple-50 dark:bg-purple-950/50',  glow: '#8b5cf6' },
  { text: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-950/50',    glow: '#f59e0b' },
]
const KPI_KEYS = ['kpi1', 'kpi2', 'kpi3', 'kpi4'] as const
const KPI_UP   = [true, true, true, false]
const KPI_VALUES = ['84,200 MAD', '12 / 15', '47', '23,400 MAD']

const TOP_CLIENTS = [
  { name: 'Atlas Marketing',  amount: 24000, pct: 85 },
  { name: 'Restaurant Atlas', amount: 18500, pct: 66 },
  { name: 'Boutique Rachidi', amount: 14200, pct: 50 },
  { name: 'Studio Design',    amount: 9800,  pct: 35 },
  { name: 'Rabat Consulting', amount: 7600,  pct: 27 },
]


export function AnalyticsPreview() {
  const { t, tArray } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.08)
  const months = tArray('analytics.months')

  return (
    <section ref={ref} className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-14 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-sm font-semibold mb-4">
            {t('analytics.badge')}
          </span>
          <h2 className="section-title mb-4">{t('analytics.title')}</h2>
          <p className="section-sub">{t('analytics.sub')}</p>
        </div>

        {/* ── KPI row — 3D flip-in ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPI_KEYS.map((key, i) => {
            const Icon  = KPI_ICONS[i]
            const color = KPI_COLORS[i]
            const up    = KPI_UP[i]
            return (
              <div
                key={key}
                className="card p-5 rounded-2xl group hover:-translate-y-1 hover:shadow-xl transition-transform duration-300"
                style={{
                  animation: visible
                    ? `flipInUp 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`
                    : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${color.text}`} />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
                    up
                      ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
                      : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
                  )}>
                    {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span className="hidden sm:inline">{t(`analytics.${key}.change`)}</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">
                  {KPI_VALUES[i]}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t(`analytics.${key}.label`)}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Chart + Top clients ── */}
        <div
          className="grid lg:grid-cols-3 gap-6"
          style={{ animation: visible ? 'flipInUp 0.7s cubic-bezier(0.16,1,0.3,1) 340ms both' : 'none' }}
        >
          {/* Bar chart */}
          <div className="lg:col-span-2 card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{t('analytics.chart.title')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('analytics.chart.sub')}</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                {t('analytics.chart.badge')}
              </div>
            </div>

            {/* Bars — spring grow from bottom */}
            <div className="flex items-end gap-1.5 h-40 mb-3">
              {monthlyData.map((val, i) => {
                const isLast = i === monthlyData.length - 1
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 relative overflow-hidden rounded-t-md">
                    {/* Shimmer on last bar */}
                    {isLast && visible && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                          animation: 'shimmer 2.2s 1.2s ease-in-out infinite',
                        }}
                      />
                    )}
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        /* Spring grow: height transitions from 0 → target when visible */
                        height: visible ? `${(val / maxVal) * 100}%` : '0%',
                        background: isLast
                          ? 'linear-gradient(to top, #6366f1, #818cf8)'
                          : (i % 2 === 0 ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.15)'),
                        transition: `height 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 55}ms`,
                      }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Month labels */}
            <div className="flex justify-between">
              {(months.length === 12 ? months : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']).map((m, i) => (
                <span key={i} className="flex-1 text-center text-[10px] text-slate-400 dark:text-slate-600">{m}</span>
              ))}
            </div>

            {/* Tooltip row */}
            <div className="mt-4 flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('analytics.chart.tooltipMonth')}</span>
              <span className="ml-auto text-sm font-black text-slate-900 dark:text-white">{t('analytics.chart.tooltipValue')}</span>
            </div>
          </div>

          {/* Top clients — progress bars fill on visible */}
          <div className="card p-6 rounded-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('analytics.topClients.title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t('analytics.topClients.sub')}</p>
            <div className="space-y-4">
              {TOP_CLIENTS.map(({ name, amount, pct }, i) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[110px]">{name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{amount.toLocaleString()} MAD</span>
                  </div>
                  {/* Spring fill */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-teal-500"
                      style={{
                        width: visible ? `${pct}%` : '0%',
                        transition: `width 1.2s cubic-bezier(0.34, 1.3, 0.64, 1) ${350 + i * 90}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
