'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Users, FileText, Receipt, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const FLOATING_ICONS = [Users, FileText, Receipt, TrendingUp]
const FLOATING_COLORS = [
  'from-blue-500 to-primary-600',
  'from-green-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
]
const FLOATING_POS = ['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8']
const FLOATING_KEYS = ['floating1', 'floating2', 'floating3', 'floating4'] as const
const STAT_KEYS = ['stat1', 'stat2', 'stat3', 'stat4'] as const

export function FinalMegaCta() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('relative rounded-3xl overflow-hidden transition-all duration-700', visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95')}>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-primary-950 dark:from-slate-950 dark:via-slate-900 dark:to-primary-950" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute top-0 left-1/3 w-96 h-64 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-48 bg-teal-600/15 rounded-full blur-3xl" />

          {/* Floating cards */}
          {FLOATING_KEYS.map((key, i) => {
            const Icon = FLOATING_ICONS[i]
            return (
              <div
                key={key}
                className={cn('hidden lg:flex absolute items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 z-10', FLOATING_POS[i])}
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${FLOATING_COLORS[i]} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-xs">{t(`finalMegaCta.${key}.label`)}</div>
                  <div className="text-slate-400 text-xs">{t(`finalMegaCta.${key}.sub`)}</div>
                </div>
              </div>
            )
          })}

          {/* Content */}
          <div className="relative z-20 text-center py-20 px-6 sm:px-12 lg:py-28 lg:px-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              {t('finalMegaCta.badge')}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight max-w-4xl mx-auto">
              {t('finalMegaCta.title')}{' '}
              <span className="relative">
                <span className="relative z-10 text-slate-400 line-through decoration-red-400">
                  {t('finalMegaCta.strikethrough')}
                </span>
              </span>
              .
            </h2>

            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('finalMegaCta.sub')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-bold text-base transition-all shadow-2xl shadow-primary-500/30 hover:-translate-y-0.5 group"
              >
                {t('finalMegaCta.ctaPrimary')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base transition-all border border-white/20 hover:-translate-y-0.5">
                <Calendar className="w-4 h-4" />
                {t('finalMegaCta.ctaSecondary')}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8">
              {STAT_KEYS.map(key => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-black text-white">{t(`finalMegaCta.${key}.value`)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t(`finalMegaCta.${key}.label`)}</div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-slate-600">{t('finalMegaCta.disclaimer')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
