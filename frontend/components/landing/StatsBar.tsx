'use client'

import { CreditCard, Zap, ShieldCheck, Globe } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const ITEMS = [
  { icon: CreditCard, iconCls: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/50', key: 'stat1' },
  { icon: Zap,        iconCls: 'text-teal-500',   bg: 'bg-teal-50 dark:bg-teal-950/50',   key: 'stat2' },
  { icon: ShieldCheck,iconCls: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-950/50', key: 'stat3' },
  { icon: Globe,      iconCls: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-950/50',   key: 'stat4' },
] as const

export function StatsBar() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.1)

  return (
    <div ref={ref} className="relative border-y border-slate-100 dark:border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/40 via-white to-teal-50/40 dark:from-indigo-950/10 dark:via-transparent dark:to-teal-950/10" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-0 lg:divide-x divide-slate-100 dark:divide-white/5">
          {ITEMS.map(({ icon: Icon, iconCls, bg, key }, i) => (
            <div
              key={key}
              className={cn(
                'flex items-center gap-3.5 lg:px-8 transition-all duration-500',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
                <Icon className={cn('w-5 h-5', iconCls)} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-primary-600 bg-clip-text text-transparent leading-none mb-0.5">
                  {t(`finalMegaCta.${key}.value`)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  {t(`finalMegaCta.${key}.label`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
