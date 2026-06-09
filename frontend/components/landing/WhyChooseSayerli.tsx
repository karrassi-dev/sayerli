'use client'

import { Clock, Table2, FileCheck, Banknote, HeartHandshake, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const ICONS = [Clock, Table2, FileCheck, Banknote, HeartHandshake, TrendingUp]
const COLORS = [
  'from-blue-500 to-primary-600',
  'from-red-500 to-rose-600',
  'from-teal-500 to-emerald-600',
  'from-green-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
]
const BG = [
  'bg-blue-50 dark:bg-blue-950/30',
  'bg-red-50 dark:bg-red-950/30',
  'bg-teal-50 dark:bg-teal-950/30',
  'bg-green-50 dark:bg-green-950/30',
  'bg-purple-50 dark:bg-purple-950/30',
  'bg-orange-50 dark:bg-orange-950/30',
]
const DELAYS = [0, 50, 100, 150, 200, 250]
const CARD_KEYS = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'] as const

export function WhyChooseSayerli() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
            {t('whyChoose.badge')}
          </span>
          <h2 className="section-title mb-4">{t('whyChoose.title')}</h2>
          <p className="section-sub">{t('whyChoose.sub')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARD_KEYS.map((key, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={key}
                className={cn(
                  'group relative card p-7 rounded-2xl cursor-default transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/8',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                )}
                style={{ transitionDelay: `${DELAYS[i]}ms` }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${COLORS[i]} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />
                <div className={`relative w-12 h-12 rounded-xl ${BG[i]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-6 h-6 bg-gradient-to-br ${COLORS[i]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className="relative font-bold text-slate-900 dark:text-white text-lg mb-3 leading-snug">
                  {t(`whyChoose.${key}.title`)}
                </h3>
                <p className="relative text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {t(`whyChoose.${key}.desc`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
