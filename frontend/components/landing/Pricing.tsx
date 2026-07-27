'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

export function Pricing() {
  const { t, tArray } = useTranslation()
  const { ref, visible } = useScrollAnimation()
  const [yearly, setYearly] = useState(false)

  const plans = [
    {
      key: 'starter',
      name: t('pricing.starter.name'),
      price: t('pricing.starter.price'),
      desc: t('pricing.starter.desc'),
      features: tArray('pricing.starter.features'),
      excluded: tArray('pricing.starter.excluded'),
      popular: false,
      cta: t('pricing.ctaFree'),
      href: '/register',
    },
    {
      key: 'pro',
      name: t('pricing.pro.name'),
      price: t('pricing.pro.price'),
      desc: t('pricing.pro.desc'),
      features: tArray('pricing.pro.features'),
      excluded: tArray('pricing.pro.excluded'),
      popular: true,
      cta: t('pricing.cta'),
      href: '/register',
    },
    {
      key: 'business',
      name: t('pricing.business.name'),
      price: t('pricing.business.price'),
      desc: t('pricing.business.desc'),
      features: tArray('pricing.business.features'),
      excluded: tArray('pricing.business.excluded'),
      popular: false,
      cta: t('pricing.cta'),
      href: '/register',
    },
  ]

  return (
    <section id="pricing" ref={ref} className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={cn('text-center mb-10 sm:mb-12 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
            {t('pricing.badge')}
          </span>
          <h2 className="section-title mb-4">{t('pricing.title')}</h2>
          <p className="section-sub mb-8">{t('pricing.sub')}</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'px-5 py-2 text-sm font-semibold rounded-lg transition-all',
                !yearly ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              )}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all',
                yearly ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              )}
            >
              {t('pricing.yearly')}
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors',
                yearly ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
              )}>
                {t('pricing.yearlyDiscount')}
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 lg:gap-6 items-start">
          {plans.map(({ key, name, price, desc, features, excluded, popular, cta, href }, cardIdx) => {
            const numPrice = parseInt(price)
            const displayPrice = yearly && numPrice > 0 ? Math.round(numPrice * 0.8) : numPrice

            return (
              <div
                key={key}
                className={cn(
                  'relative rounded-2xl flex flex-col transition-all duration-500',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                  popular
                    ? 'shadow-2xl shadow-indigo-500/20'
                    : 'hover:shadow-xl hover:-translate-y-1'
                )}
                style={{
                  transitionDelay: `${cardIdx * 80}ms`,
                  background: popular
                    ? 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)'
                    : undefined,
                  border: popular ? '1px solid rgba(99,102,241,0.4)' : undefined,
                }}
              >
                {/* Popular glow ring */}
                {popular && (
                  <div className="absolute -inset-px rounded-2xl pointer-events-none"
                    style={{ background: 'linear-gradient(160deg, rgba(99,102,241,0.6), rgba(59,130,246,0.3))', zIndex: -1, filter: 'blur(8px)' }} />
                )}

                {/* Popular badge */}
                {popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg whitespace-nowrap">
                      <Zap className="w-3 h-3 fill-current" />
                      {t('pricing.popular')}
                    </span>
                  </div>
                )}

                <div className={cn(
                  'rounded-2xl p-6 flex flex-col flex-1',
                  !popular && 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                )}>
                  {/* Header */}
                  <div className="mb-5">
                    <h3 className={cn('text-lg font-black mb-1', popular ? 'text-white' : 'text-slate-900 dark:text-white')}>
                      {name}
                    </h3>
                    <p className={cn('text-sm', popular ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400')}>
                      {desc}
                    </p>
                  </div>

                  {/* Price */}
                  <div className={cn('mb-6 pb-6', popular ? 'border-b border-white/10' : 'border-b border-slate-100 dark:border-slate-800')}>
                    <div className="flex items-baseline gap-1.5">
                      {yearly && numPrice > 0 && (
                        <span className={cn('text-lg line-through font-medium', popular ? 'text-indigo-300' : 'text-slate-400')}>
                          {numPrice}
                        </span>
                      )}
                      <span className={cn('text-5xl font-black leading-none', popular ? 'text-white' : 'text-slate-900 dark:text-white')}>
                        {displayPrice === 0 ? '0' : displayPrice}
                      </span>
                      <div>
                        <div className={cn('text-sm font-semibold', popular ? 'text-indigo-200' : 'text-slate-500')}>MAD</div>
                        <div className={cn('text-xs', popular ? 'text-indigo-300' : 'text-slate-400')}>/mois</div>
                      </div>
                    </div>
                    {yearly && numPrice > 0 && (
                      <p className={cn('text-xs mt-2', popular ? 'text-indigo-300' : 'text-slate-400')}>
                        {t('pricing.yearlyBilledNote')}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {features.map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <div className={cn(
                          'w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                          popular ? 'bg-white/15' : 'bg-indigo-50 dark:bg-indigo-950/60'
                        )}>
                          <Check className={cn('w-2.5 h-2.5', popular ? 'text-white' : 'text-indigo-600 dark:text-indigo-400')} />
                        </div>
                        <span className={cn('text-sm leading-relaxed', popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-300')}>
                          {feature}
                        </span>
                      </li>
                    ))}
                    {excluded.map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <div className={cn(
                          'w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                          popular ? 'bg-white/5' : 'bg-slate-100 dark:bg-slate-800'
                        )}>
                          <X className={cn('w-2.5 h-2.5', popular ? 'text-indigo-400' : 'text-slate-400')} />
                        </div>
                        <span className={cn('text-sm line-through', popular ? 'text-indigo-400' : 'text-slate-400')}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all group',
                      popular
                        ? 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                    )}
                  >
                    {cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
