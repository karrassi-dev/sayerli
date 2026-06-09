'use client'

import { Users, FileText, Receipt, CreditCard, BarChart3, UserCog } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const FEATURE_ICONS = [Users, FileText, Receipt, CreditCard, BarChart3, UserCog]
const FEATURE_COLORS = [
  'from-blue-500 to-primary-600',
  'from-teal-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
  'from-pink-500 to-rose-600',
  'from-slate-500 to-slate-700',
]

const FEATURE_BG = [
  'bg-blue-50 dark:bg-blue-950/30',
  'bg-teal-50 dark:bg-teal-950/30',
  'bg-purple-50 dark:bg-purple-950/30',
  'bg-orange-50 dark:bg-orange-950/30',
  'bg-pink-50 dark:bg-pink-950/30',
  'bg-slate-50 dark:bg-slate-800/50',
]

export function Features() {
  const { t } = useTranslation()

  const features = [
    { key: 'crm', title: t('features.crm.title'), desc: t('features.crm.desc') },
    { key: 'devis', title: t('features.devis.title'), desc: t('features.devis.desc') },
    { key: 'factures', title: t('features.factures.title'), desc: t('features.factures.desc') },
    { key: 'paiements', title: t('features.paiements.title'), desc: t('features.paiements.desc') },
    { key: 'analytics', title: t('features.analytics.title'), desc: t('features.analytics.desc') },
    { key: 'team', title: t('features.team.title'), desc: t('features.team.desc') },
  ]

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
            {t('features.badge')}
          </span>
          <h2 className="section-title mb-4">{t('features.title')}</h2>
          <p className="section-sub">{t('features.sub')}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ key, title, desc }, i) => {
            const Icon = FEATURE_ICONS[i]
            return (
              <div
                key={key}
                className="group card p-6 rounded-2xl hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${FEATURE_BG[i]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`w-6 h-6 bg-gradient-to-br ${FEATURE_COLORS[i]} rounded-md flex items-center justify-center`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
