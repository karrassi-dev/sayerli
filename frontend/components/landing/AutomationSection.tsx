'use client'

import { Bell, FileText, CreditCard, Mail, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const ICONS = [Bell, FileText, CreditCard, Mail, Zap]
const COLORS = [
  'from-blue-500 to-primary-600',
  'from-teal-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
  'from-amber-500 to-yellow-600',
]
const TAG_COLORS = [
  'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
  'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300',
  'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
  'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
  'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
]
const ITEM_KEYS = ['item1', 'item2', 'item3', 'item4', 'item5'] as const

export function AutomationSection() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
            {t('automation.badge')}
          </span>
          <h2 className="section-title mb-4">{t('automation.title')}</h2>
          <p className="section-sub">{t('automation.sub')}</p>
        </div>

        <div className="space-y-6">
          {ITEM_KEYS.map((key, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={key}
                className={cn(
                  'group card rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${COLORS[i]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {t(`automation.${key}.title`)}
                      </h3>
                      <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-semibold', TAG_COLORS[i])}>
                        {t(`automation.${key}.tag`)}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4 max-w-2xl">
                      {t(`automation.${key}.desc`)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(['detail1', 'detail2', 'detail3'] as const).map(d => (
                        <span key={d} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {t(`automation.${key}.${d}`)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-green-700 dark:text-green-400 whitespace-nowrap">
                      {t('automation.activeLabel')}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
