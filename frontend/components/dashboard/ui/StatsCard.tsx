'use client'

import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  trend?: number
  color?: 'blue' | 'teal' | 'purple' | 'orange' | 'green' | 'red'
  loading?: boolean
}

const COLOR_MAP = {
  blue:   { icon: 'bg-blue-50 dark:bg-blue-950/50', grad: 'from-blue-500 to-primary-600', text: 'text-primary-600 dark:text-primary-400' },
  teal:   { icon: 'bg-teal-50 dark:bg-teal-950/50', grad: 'from-teal-500 to-emerald-600', text: 'text-teal-600 dark:text-teal-400' },
  purple: { icon: 'bg-purple-50 dark:bg-purple-950/50', grad: 'from-purple-500 to-violet-600', text: 'text-purple-600 dark:text-purple-400' },
  orange: { icon: 'bg-orange-50 dark:bg-orange-950/50', grad: 'from-orange-500 to-amber-600', text: 'text-orange-600 dark:text-orange-400' },
  green:  { icon: 'bg-green-50 dark:bg-green-950/50', grad: 'from-green-500 to-emerald-600', text: 'text-green-600 dark:text-green-400' },
  red:    { icon: 'bg-red-50 dark:bg-red-950/50', grad: 'from-red-500 to-rose-600', text: 'text-red-600 dark:text-red-400' },
}

export function StatsCard({ label, value, sub, icon: Icon, trend, color = 'blue', loading }: StatsCardProps) {
  const c = COLOR_MAP[color]

  if (loading) {
    return (
      <div className="card p-5 rounded-2xl animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="w-16 h-6 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="w-24 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 mb-1" />
        <div className="w-32 h-4 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    )
  }

  return (
    <div className="card p-5 rounded-2xl hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', c.icon)}>
          <div className={cn('w-5 h-5 bg-gradient-to-br rounded-lg flex items-center justify-center', c.grad)}>
            <Icon className="w-3 h-3 text-white" />
          </div>
        </div>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full',
            trend >= 0 ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
          )}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{value}</div>
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
      {sub && <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>}
    </div>
  )
}
