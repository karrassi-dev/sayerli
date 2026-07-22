'use client'

import { UserPlus, FileText, ThumbsUp, Truck, Receipt, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const ICONS = [UserPlus, FileText, ThumbsUp, Truck, Receipt, BarChart3]
const COLORS = [
  'from-blue-500 to-primary-600',
  'from-teal-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
  'from-green-500 to-emerald-600',
  'from-amber-500 to-yellow-600',
]
const STEP_KEYS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'] as const

export function WorkflowTimeline() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-28 bg-slate-50 dark:bg-slate-900/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            {t('workflow.badge')}
          </span>
          <h2 className="section-title mb-4">{t('workflow.title')}</h2>
          <p className="section-sub">{t('workflow.sub')}</p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block relative">
          <div className="absolute top-10 left-[calc(8.33%+1.5rem)] right-[calc(8.33%+1.5rem)] h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 via-orange-300 to-amber-300 dark:from-blue-700 dark:via-purple-700 dark:via-orange-700 dark:to-amber-700" />
          <div className="grid grid-cols-6 gap-4">
            {STEP_KEYS.map((key, i) => {
              const Icon = ICONS[i]
              return (
                <div
                  key={key}
                  className={cn('flex flex-col items-center text-center transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative mb-5">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${COLORS[i]} flex items-center justify-center shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 leading-snug">
                    {t(`workflow.${key}.title`)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t(`workflow.${key}.desc`)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden relative">
          <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-amber-300 dark:from-blue-700 dark:via-purple-700 dark:to-amber-700" />
          <div className="space-y-8">
            {STEP_KEYS.map((key, i) => {
              const Icon = ICONS[i]
              return (
                <div
                  key={key}
                  className={cn('flex gap-5 transition-all duration-700', visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8')}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex-shrink-0 relative">
                    <div className={`w-[4.5rem] h-[4.5rem] rounded-2xl bg-gradient-to-br ${COLORS[i]} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t(`workflow.${key}.title`)}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t(`workflow.${key}.desc`)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
