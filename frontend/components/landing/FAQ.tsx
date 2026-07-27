'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const FAQ_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

export function FAQ() {
  const { t } = useTranslation()
  const [open, setOpen] = useState<number | null>(0)
  const { ref, visible } = useScrollAnimation()

  const items = FAQ_KEYS.map(k => ({
    q: t(`faq.q${k}`),
    a: t(`faq.a${k}`),
  }))

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-white dark:bg-transparent">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={cn('text-center mb-10 sm:mb-14 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
            {t('faq.badge')}
          </span>
          <h2 className="section-title mb-4">{t('faq.title')}</h2>
          <p className="section-sub">{t('faq.sub')}</p>
        </div>

        {/* Items */}
        <div className={cn('space-y-2.5 transition-all duration-700 delay-100', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          {items.map(({ q, a }, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={cn(
                  'rounded-2xl overflow-hidden transition-all duration-300',
                  isOpen
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                )}
                style={{
                  transitionDelay: visible ? `${i * 40}ms` : '0ms',
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className={cn(
                    'font-semibold text-sm sm:text-base leading-snug transition-colors',
                    isOpen ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'
                  )}>
                    {q}
                  </span>

                  {/* +/× rotating indicator */}
                  <div className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300',
                    isOpen
                      ? 'bg-indigo-600 text-white rotate-45'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  )}>
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Answer */}
                <div className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  isOpen ? 'max-h-96' : 'max-h-0'
                )}>
                  <p className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer link */}
        <div className={cn('mt-10 text-center transition-all duration-700 delay-300', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{t('faq.contact')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
          >
            <MessageCircle className="w-4 h-4" />
            {t('faq.contactLink')}
          </Link>
        </div>
      </div>
    </section>
  )
}
