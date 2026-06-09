'use client'

import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
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
    <section ref={ref} className="py-28 bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
            {t('faq.badge')}
          </span>
          <h2 className="section-title mb-4">{t('faq.title')}</h2>
          <p className="section-sub">{t('faq.sub')}</p>
        </div>

        <div className={cn('space-y-3 transition-all duration-700 delay-100', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          {items.map(({ q, a }, i) => (
            <div
              key={i}
              className={cn('card rounded-2xl overflow-hidden transition-all duration-300', open === i ? 'shadow-md' : 'hover:shadow-md')}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={cn('font-semibold text-sm sm:text-base transition-colors', open === i ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white')}>
                  {q}
                </span>
                <ChevronDown className={cn('w-5 h-5 flex-shrink-0 transition-all duration-300', open === i ? 'rotate-180 text-primary-600 dark:text-primary-400' : 'text-slate-400')} />
              </button>
              <div className={cn('overflow-hidden transition-all duration-300', open === i ? 'max-h-96' : 'max-h-0')}>
                <p className="px-5 pb-5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={cn('mt-10 text-center transition-all duration-700 delay-200', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <p className="text-slate-500 dark:text-slate-400 mb-3">{t('faq.contact')}</p>
          <a href="mailto:support@sayerli.ma" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            <MessageCircle className="w-4 h-4" />
            {t('faq.contactLink')}
          </a>
        </div>
      </div>
    </section>
  )
}
