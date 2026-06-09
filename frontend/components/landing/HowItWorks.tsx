'use client'

import { UserPlus, Users, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    { icon: UserPlus, title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc'), color: 'from-primary-500 to-primary-600' },
    { icon: Users, title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc'), color: 'from-teal-500 to-teal-600' },
    { icon: TrendingUp, title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc'), color: 'from-purple-500 to-purple-600' },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
            {t('howItWorks.badge')}
          </span>
          <h2 className="section-title mb-4">{t('howItWorks.title')}</h2>
          <p className="section-sub">{t('howItWorks.sub')}</p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary-300 via-teal-300 to-purple-300 dark:from-primary-700 dark:via-teal-700 dark:to-purple-700" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={title} className="text-center group">
                {/* Step number + icon */}
                <div className="relative inline-flex flex-col items-center mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
