'use client'

import { Package, Bot, Kanban, Globe, BarChart2, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const ICONS = [Package, Bot, Kanban, Globe, BarChart2, Smartphone]
const COLORS = [
  'from-blue-500 to-primary-600',
  'from-purple-500 to-violet-600',
  'from-teal-500 to-emerald-600',
  'from-green-500 to-emerald-600',
  'from-orange-500 to-amber-600',
  'from-red-500 to-rose-600',
]
const BG = [
  'bg-blue-50 dark:bg-blue-950/40',
  'bg-purple-50 dark:bg-purple-950/40',
  'bg-teal-50 dark:bg-teal-950/40',
  'bg-green-50 dark:bg-green-950/40',
  'bg-orange-50 dark:bg-orange-950/40',
  'bg-red-50 dark:bg-red-950/40',
]
const ITEM_KEYS = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] as const

export function FutureVision() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-28 bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            {t('roadmap.badge')}
          </span>
          <h2 className="section-title mb-4">{t('roadmap.title')}</h2>
          <p className="section-sub">{t('roadmap.sub')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEM_KEYS.map((key, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={key}
                className={cn('group relative card rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[i]} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-300`} />
                <div className="relative flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl ${BG[i]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <div className={`w-6 h-6 bg-gradient-to-br ${COLORS[i]} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                      {t('roadmap.comingSoon')}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-600 font-medium">{t(`roadmap.${key}.quarter`)}</span>
                  </div>
                </div>
                <h3 className="relative font-bold text-slate-900 dark:text-white mb-2">{t(`roadmap.${key}.title`)}</h3>
                <p className="relative text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t(`roadmap.${key}.desc`)}</p>
              </div>
            )
          })}
        </div>

        <div className={cn('mt-12 text-center transition-all duration-700 delay-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">{t('roadmap.notifyText')}</p>
          <div className="inline-flex items-center gap-2 flex-wrap justify-center">
            <input
              type="email"
              placeholder={t('roadmap.emailPlaceholder')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-56"
            />
            <button className="btn-primary py-2.5 text-sm">{t('roadmap.notifyBtn')}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
