'use client'

import { Star } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const FEATURED = { initial: 'Y', gradient: 'from-indigo-500 to-primary-600', key: 'q1' }

const SECONDARY = [
  { initial: 'S', gradient: 'from-teal-500 to-emerald-600', key: 'q2' },
  { initial: 'H', gradient: 'from-violet-500 to-purple-600', key: 'q3' },
] as const

function Stars() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[0, 1, 2, 3, 4].map(i => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

function Avatar({ initial, gradient }: { initial: string; gradient: string }) {
  return (
    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 bg-gradient-to-br', gradient)}>
      {initial}
    </div>
  )
}

export function Testimonials() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section id="testimonials" ref={ref} className="py-24 sm:py-32 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-y-0 left-0 right-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/8 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={cn(
          'text-center mb-14 transition-all duration-700',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-5">
            <span className="flex gap-0.5">
              {[0,1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
            </span>
            {t('testimonials.badge')}
          </span>
          <h2 className="section-title mb-3">{t('testimonials.title')}</h2>
          <p className="section-sub max-w-xl mx-auto">{t('testimonials.sub')}</p>
        </div>

        {/* Featured testimonial */}
        <div className={cn(
          'mb-5 transition-all duration-700 delay-100',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <div className="relative bg-gradient-to-br from-indigo-600 to-primary-700 rounded-2xl p-8 sm:p-10 overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] [background-size:40px_40px]" />
            {/* Glow */}
            <div className="absolute top-0 right-0 w-72 h-48 bg-white/8 rounded-full blur-3xl" />

            <div className="relative">
              {/* Giant quote mark */}
              <div className="text-8xl font-black text-white/10 leading-none mb-2 select-none">&ldquo;</div>

              <Stars />

              <blockquote className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl font-medium">
                &ldquo;{t(`testimonials.${FEATURED.key}quote`)}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4">
                <Avatar initial={FEATURED.initial} gradient={FEATURED.gradient} />
                <div>
                  <div className="font-bold text-white">{t(`testimonials.${FEATURED.key}name`)}</div>
                  <div className="text-sm text-primary-200">
                    {t(`testimonials.${FEATURED.key}role`)} · {t(`testimonials.${FEATURED.key}city`)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary testimonials */}
        <div className={cn(
          'grid sm:grid-cols-2 gap-5 transition-all duration-700 delay-200',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          {SECONDARY.map(({ key, initial, gradient }) => (
            <div
              key={key}
              className="bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Stars />

              <blockquote className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">
                &ldquo;{t(`testimonials.${key}quote`)}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                <Avatar initial={initial} gradient={gradient} />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {t(`testimonials.${key}name`)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t(`testimonials.${key}role`)} · {t(`testimonials.${key}city`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust signal */}
        <div className={cn(
          'mt-10 text-center transition-all duration-700 delay-300',
          visible ? 'opacity-100' : 'opacity-0'
        )}>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Rejoint par des freelancers, auto-entrepreneurs et PME à travers tout le Maroc 🇲🇦
          </p>
        </div>

      </div>
    </section>
  )
}
