'use client'

import { TrendingUp, Users, Receipt, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const monthlyData = [38, 52, 44, 67, 58, 78, 65, 89, 72, 95, 84, 102]
const maxVal = Math.max(...monthlyData)

const KPI_ICONS = [TrendingUp, Receipt, Users, Clock]
const KPI_COLORS = [
  'text-primary-600 dark:text-primary-400',
  'text-teal-600 dark:text-teal-400',
  'text-purple-600 dark:text-purple-400',
  'text-amber-600 dark:text-amber-400',
]
const KPI_BG = [
  'bg-primary-50 dark:bg-primary-950/50',
  'bg-teal-50 dark:bg-teal-950/50',
  'bg-purple-50 dark:bg-purple-950/50',
  'bg-amber-50 dark:bg-amber-950/50',
]
const KPI_KEYS = ['kpi1', 'kpi2', 'kpi3', 'kpi4'] as const
const KPI_UP = [true, true, true, false]
const KPI_VALUES = ['84,200 MAD', '12 / 15', '47', '23,400 MAD']

const TOP_CLIENTS = [
  { name: 'Atlas Marketing', amount: 24000, pct: 85 },
  { name: 'Restaurant Atlas', amount: 18500, pct: 66 },
  { name: 'Boutique Rachidi', amount: 14200, pct: 50 },
  { name: 'Studio Design', amount: 9800, pct: 35 },
  { name: 'Rabat Consulting', amount: 7600, pct: 27 },
]

export function AnalyticsPreview() {
  const { t, tArray } = useTranslation()
  const { ref, visible } = useScrollAnimation()
  const months = tArray('analytics.months')

  return (
    <section ref={ref} className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-sm font-semibold mb-4">
            {t('analytics.badge')}
          </span>
          <h2 className="section-title mb-4">{t('analytics.title')}</h2>
          <p className="section-sub">{t('analytics.sub')}</p>
        </div>

        {/* KPI row */}
        <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          {KPI_KEYS.map((key, i) => {
            const Icon = KPI_ICONS[i]
            const up = KPI_UP[i]
            return (
              <div key={key} className="card p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${KPI_BG[i]} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${KPI_COLORS[i]}`} />
                  </div>
                  <div className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full', up ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30' : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30')}>
                    {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span className="hidden sm:inline">{t(`analytics.${key}.change`)}</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{KPI_VALUES[i]}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t(`analytics.${key}.label`)}</div>
              </div>
            )
          })}
        </div>

        <div className={cn('grid lg:grid-cols-3 gap-6 transition-all duration-700 delay-200', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          {/* Chart */}
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
            <div className="flex items-end gap-1.5 h-40 mb-3">
              {monthlyData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn('w-full rounded-t-md transition-all duration-700', i === monthlyData.length - 1 ? 'bg-gradient-to-t from-primary-600 to-primary-400' : 'bg-gradient-to-t from-primary-300 to-primary-200 dark:from-primary-800 dark:to-primary-700')}
                    style={{ height: `${(val / maxVal) * 100}%`, transitionDelay: `${i * 40}ms` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {(months.length === 12 ? months : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']).map((m, i) => (
                <span key={i} className="flex-1 text-center text-[10px] text-slate-400 dark:text-slate-600">{m}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('analytics.chart.tooltipMonth')}</span>
              <span className="ml-auto text-sm font-black text-slate-900 dark:text-white">{t('analytics.chart.tooltipValue')}</span>
            </div>
          </div>

          {/* Top clients */}
          <div className="card p-6 rounded-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('analytics.topClients.title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t('analytics.topClients.sub')}</p>
            <div className="space-y-4">
              {TOP_CLIENTS.map(({ name, amount, pct }, i) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[110px]">{name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{amount.toLocaleString()} MAD</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 transition-all duration-1000"
                      style={{ width: visible ? `${pct}%` : '0%', transitionDelay: `${300 + i * 80}ms` }}
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
