'use client'

import { UserPlus, BookUser, FileText, Truck, CreditCard, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    number: 1,
    icon: UserPlus,
    gradient: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/25',
    chipBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900',
    key: 'step1',
  },
  {
    number: 2,
    icon: BookUser,
    gradient: 'from-violet-500 to-violet-600',
    shadow: 'shadow-violet-500/25',
    chipBg: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900',
    key: 'step2',
  },
  {
    number: 3,
    icon: FileText,
    gradient: 'from-teal-500 to-teal-600',
    shadow: 'shadow-teal-500/25',
    chipBg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900',
    key: 'step3',
  },
  {
    number: 4,
    icon: Truck,
    gradient: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/25',
    chipBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900',
    key: 'step4',
  },
  {
    number: 5,
    icon: CreditCard,
    gradient: 'from-green-500 to-emerald-600',
    shadow: 'shadow-green-500/25',
    chipBg: 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900',
    key: 'step5',
  },
] as const

const STATUS_JOURNEY = [
  { label: 'Brouillon', color: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400' },
  { label: 'Devis envoyé', color: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' },
  { label: 'Accepté', color: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300' },
  { label: 'BL livré', color: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' },
  { label: 'Facturée', color: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300' },
  { label: 'Payée ✓', color: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 font-semibold' },
]

export function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
            {t('howItWorks.badge')}
          </span>
          <h2 className="section-title mb-4">{t('howItWorks.title')}</h2>
          <p className="section-sub max-w-2xl mx-auto">{t('howItWorks.sub')}</p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Desktop connector line */}
          <div
            className="hidden lg:block absolute top-[1.875rem] h-px bg-gradient-to-r from-blue-300 via-teal-300 via-amber-300 to-green-300 dark:from-blue-800 dark:via-teal-800 dark:via-amber-800 dark:to-green-800"
            style={{ left: 'calc(10% + 28px)', right: 'calc(10% + 28px)' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              const isLast = idx === STEPS.length - 1
              return (
                <div key={step.number} className="relative group flex flex-col">

                  {/* Mobile connector (vertical) */}
                  {!isLast && (
                    <div className="lg:hidden absolute left-[1.875rem] top-[3.75rem] w-px h-full bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-700" />
                  )}

                  {/* Mobile layout: horizontal icon + content */}
                  <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">

                    {/* Icon bubble */}
                    <div className="relative flex-shrink-0">
                      <div className={cn(
                        'w-[3.75rem] h-[3.75rem] rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg z-10 relative',
                        'group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-300',
                        step.gradient, step.shadow
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black flex items-center justify-center shadow-md z-20">
                        {step.number}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="lg:mt-5 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 lg:mb-2">
                        {t(`howItWorks.${step.key}.title`)}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                        {t(`howItWorks.${step.key}.desc`)}
                      </p>
                      <span className={cn('inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full', step.chipBg)}>
                        {t(`howItWorks.${step.key}.chip`)}
                      </span>
                    </div>

                  </div>

                  {/* Desktop arrow between cards */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-3 top-[1.375rem] z-10 w-6 h-6 items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Status journey bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-xs text-slate-400 dark:text-slate-500 mr-2 font-medium">Statut :</span>
          {STATUS_JOURNEY.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={cn('text-[11px] px-2.5 py-1 rounded-full', s.color)}>
                {s.label}
              </span>
              {i < STATUS_JOURNEY.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
