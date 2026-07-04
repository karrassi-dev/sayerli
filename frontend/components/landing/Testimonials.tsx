'use client'

import { Star } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const QUOTE_KEYS = [
  { key: 'q1', initial: 'Y', color: 'bg-primary-600' },
  { key: 'q2', initial: 'S', color: 'bg-teal-600' },
  { key: 'q3', initial: 'H', color: 'bg-purple-600' },
] as const

export function Testimonials() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section id="testimonials" ref={ref} className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-primary-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={cn('text-center mb-10 sm:mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            {t('testimonials.badge')}
          </span>
          <h2 className="section-title mb-4">{t('testimonials.title')}</h2>
          <p className="section-sub max-w-2xl mx-auto">{t('testimonials.sub')}</p>
        </div>

        {/* Cards */}
        <div className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-700 delay-100',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          {QUOTE_KEYS.map(({ key, initial, color }) => (
            <div
              key={key}
              className="card p-5 sm:p-7 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1">
                &ldquo;{t(`testimonials.${key}quote`)}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{t(`testimonials.${key}name`)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {t(`testimonials.${key}role`)} · {t(`testimonials.${key}city`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
