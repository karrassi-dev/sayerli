'use client'

import { UserPlus, BookUser, FileText, Truck, CreditCard } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.2)',
    key: 'step1',
  },
  {
    number: '02',
    icon: BookUser,
    color: '#14b8a6',
    glow: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.2)',
    key: 'step2',
  },
  {
    number: '03',
    icon: FileText,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.2)',
    key: 'step3',
  },
  {
    number: '04',
    icon: Truck,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.2)',
    key: 'step4',
  },
  {
    number: '05',
    icon: CreditCard,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.2)',
    key: 'step5',
  },
] as const

export function HowItWorks() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section id="how-it-works" ref={ref} className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={cn(
          'text-center mb-16 transition-all duration-700',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
            {t('howItWorks.badge')}
          </span>
          <h2 className="section-title mb-4">{t('howItWorks.title')}</h2>
          <p className="section-sub max-w-2xl mx-auto">{t('howItWorks.sub')}</p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={cn(
                  'relative group rounded-2xl p-5 overflow-hidden transition-all duration-500',
                  'hover:-translate-y-1 hover:shadow-xl',
                  'bg-white dark:bg-slate-900/60 border',
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                )}
                style={{
                  borderColor: visible ? step.border : 'transparent',
                  transitionDelay: `${idx * 80}ms`,
                  boxShadow: `0 1px 3px rgba(0,0,0,0.06)`,
                }}
              >
                {/* Large background step number */}
                <div
                  className="absolute -bottom-3 -right-2 text-[5.5rem] font-black leading-none select-none pointer-events-none"
                  style={{ color: step.glow }}
                >
                  {step.number}
                </div>

                {/* Subtle top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                  style={{ background: `linear-gradient(to right, ${step.color}60, ${step.color}00)` }}
                />

                {/* Icon */}
                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
                  style={{ background: step.glow, border: `1px solid ${step.border}` }}
                >
                  <Icon className="w-5 h-5" style={{ color: step.color }} />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {t(`howItWorks.${step.key}.title`)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    {t(`howItWorks.${step.key}.desc`)}
                  </p>
                  <span
                    className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: step.glow, color: step.color, border: `1px solid ${step.border}` }}
                  >
                    {t(`howItWorks.${step.key}.chip`)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Connector arrow row — desktop only */}
        <div className={cn(
          'hidden lg:flex items-center justify-center gap-1 mt-8 transition-all duration-700 delay-500',
          visible ? 'opacity-100' : 'opacity-0'
        )}>
          {STEPS.map((step, idx) => (
            <div key={step.number} className="flex items-center gap-1">
              <span
                className="text-[10px] font-bold px-3 py-1 rounded-full"
                style={{ background: step.glow, color: step.color, border: `1px solid ${step.border}` }}
              >
                {t(`howItWorks.${step.key}.chip`)}
              </span>
              {idx < STEPS.length - 1 && (
                <span className="text-slate-300 dark:text-slate-700 text-sm mx-0.5">→</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
