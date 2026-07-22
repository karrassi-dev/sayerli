'use client'

import { Star, Quote } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const QUOTES = [
  { key: 'q1', initial: 'Y', color: 'bg-blue-600', ring: 'ring-blue-200 dark:ring-blue-900' },
  { key: 'q2', initial: 'S', color: 'bg-teal-600',  ring: 'ring-teal-200 dark:ring-teal-900' },
  { key: 'q3', initial: 'H', color: 'bg-violet-600', ring: 'ring-violet-200 dark:ring-violet-900' },
] as const

export function Testimonials() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section id="testimonials" ref={ref} className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-primary-950/20" />
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gradient-to-bl from-teal-100/40 to-transparent dark:from-teal-950/20 dark:to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={cn(
          'text-center mb-14 transition-all duration-700',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-5">
            <span className="flex gap-0.5">
              {[0,1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
            </span>
            {t('testimonials.badge')}
          </span>
          <h2 className="section-title mb-3">{t('testimonials.title')}</h2>
          <p className="section-sub max-w-xl mx-auto">{t('testimonials.sub')}</p>
        </div>

        {/* Cards */}
        <div className={cn(
          'grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-700 delay-150',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          {QUOTES.map(({ key, initial, color, ring }) => (
            <div
              key={key}
              className="relative bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-6 sm:p-7 flex flex-col gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Quote icon */}
              <div className="absolute top-5 right-5 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-slate-900 dark:text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1">
                {[0,1,2,3,4].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex-1">
                &ldquo;{t(`testimonials.${key}quote`)}&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-700/60" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-4',
                  color, ring
                )}>
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {t(`testimonials.${key}name`)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {t(`testimonials.${key}role`)} · {t(`testimonials.${key}city`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust signal */}
        <div className={cn(
          'mt-12 text-center transition-all duration-700 delay-300',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Rejoint par des freelancers, auto-entrepreneurs et PME à travers tout le Maroc 🇲🇦
          </p>
        </div>

      </div>
    </section>
  )
}
