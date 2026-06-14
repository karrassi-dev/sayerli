'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

export function Pricing() {
  const { t, tArray } = useTranslation()
  const [yearly, setYearly] = useState(false)

  const plans = [
    {
      key: 'starter',
      name: t('pricing.starter.name'),
      price: t('pricing.starter.price'),
      desc: t('pricing.starter.desc'),
      features: tArray('pricing.starter.features'),
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
      popular: false,
      cta: t('pricing.cta'),
      href: '/register',
    },
  ]

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            {t('pricing.badge')}
          </span>
          <h2 className="section-title mb-4">{t('pricing.title')}</h2>
          <p className="section-sub mb-8">{t('pricing.sub')}</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                !yearly
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2',
                yearly
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {t('pricing.yearly')}
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-semibold">
                {t('pricing.yearlyDiscount')}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map(({ key, name, price, desc, features, popular, cta, href }) => {
            const numPrice = parseInt(price)
            // yearly shows the per-month equivalent at -20%, not the annual total
            const displayPrice = yearly && numPrice > 0
              ? Math.round(numPrice * 0.8)
              : numPrice

            return (
              <div
                key={key}
                className={cn(
                  'relative rounded-2xl transition-all duration-300',
                  popular
                    ? 'bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-2xl shadow-primary-500/30 scale-105 z-10'
                    : 'card hover:shadow-xl hover:-translate-y-1'
                )}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold shadow-lg">
                      <Zap className="w-3 h-3" />
                      {t('pricing.popular')}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className={cn('text-xl font-bold mb-1', popular ? 'text-white' : 'text-slate-900 dark:text-white')}>
                      {name}
                    </h3>
                    <p className={cn('text-sm', popular ? 'text-primary-200' : 'text-slate-500 dark:text-slate-400')}>
                      {desc}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      {yearly && numPrice > 0 && (
                        <span className={cn('text-lg line-through opacity-50 font-medium', popular ? 'text-primary-200' : 'text-slate-400')}>
                          {numPrice}
                        </span>
                      )}
                      <span className={cn('text-4xl font-black', popular ? 'text-white' : 'text-slate-900 dark:text-white')}>
                        {displayPrice}
                      </span>
                      <span className={cn('text-sm font-medium', popular ? 'text-primary-200' : 'text-slate-500')}>
                        MAD
                      </span>
                      <span className={cn('text-sm', popular ? 'text-primary-200' : 'text-slate-400')}>
                        /mois
                      </span>
                    </div>
                    {yearly && numPrice > 0 && (
                      <p className={cn('text-xs mt-1', popular ? 'text-primary-200' : 'text-slate-400')}>
                        facturé annuellement · économisez 20%
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {features.map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <div className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                          popular ? 'bg-primary-500' : 'bg-primary-50 dark:bg-primary-950'
                        )}>
                          <Check className={cn('w-3 h-3', popular ? 'text-white' : 'text-primary-600 dark:text-primary-400')} />
                        </div>
                        <span className={cn('text-sm', popular ? 'text-primary-100' : 'text-slate-600 dark:text-slate-300')}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={href}
                    className={cn(
                      'block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all',
                      popular
                        ? 'bg-white text-primary-600 hover:bg-primary-50 shadow-lg'
                        : 'btn-primary'
                    )}
                  >
                    {cta}
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
