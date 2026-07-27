'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function StatsBar() {
  const { t } = useTranslation()

  const stats = [
    { value: t('finalMegaCta.stat1.value'), label: t('finalMegaCta.stat1.label') },
    { value: t('finalMegaCta.stat2.value'), label: t('finalMegaCta.stat2.label') },
    { value: t('finalMegaCta.stat3.value'), label: t('finalMegaCta.stat3.label') },
    { value: t('finalMegaCta.stat4.value'), label: t('finalMegaCta.stat4.label') },
  ]

  return (
    <div className="border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-slate-200 dark:divide-white/8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center sm:px-6">
              <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-primary-600 bg-clip-text text-transparent leading-none mb-1">
                {value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
