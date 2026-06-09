'use client'

import { Shield, Lock, Database, Cloud, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const ICONS = [Shield, Lock, Database, Cloud, Users]
const COLORS = [
  'from-blue-500 to-primary-600',
  'from-teal-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
  'from-green-500 to-emerald-600',
]
const BG = [
  'bg-blue-50 dark:bg-blue-950/40',
  'bg-teal-50 dark:bg-teal-950/40',
  'bg-purple-50 dark:bg-purple-950/40',
  'bg-orange-50 dark:bg-orange-950/40',
  'bg-green-50 dark:bg-green-950/40',
]
const ITEM_KEYS = ['item1', 'item2', 'item3', 'item4', 'item5'] as const
const BANNER_KEYS = ['encrypted', 'cloud', 'auth', 'backup', 'multitenant'] as const
const BANNER_ICONS = ['🔒', '☁️', '🛡️', '📦', '✅']

export function TrustSecurity() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
            {t('security.badge')}
          </span>
          <h2 className="section-title mb-4">{t('security.title')}</h2>
          <p className="section-sub">{t('security.sub')}</p>
        </div>

        <div className="space-y-6">
          {/* Row 1: 2 large */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ITEM_KEYS.slice(0, 2).map((key, i) => {
              const Icon = ICONS[i]
              return (
                <div
                  key={key}
                  className={cn('group card rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${BG[i]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <div className={`w-6 h-6 bg-gradient-to-br ${COLORS[i]} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black bg-gradient-to-r ${COLORS[i]} bg-clip-text text-transparent`}>
                        {t(`security.${key}.stat`)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{t(`security.${key}.statLabel`)}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{t(`security.${key}.title`)}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t(`security.${key}.desc`)}</p>
                </div>
              )
            })}
          </div>

          {/* Row 2: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ITEM_KEYS.slice(2).map((key, i) => {
              const Icon = ICONS[i + 2]
              return (
                <div
                  key={key}
                  className={cn('group card rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}
                  style={{ transitionDelay: `${(i + 2) * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${BG[i + 2]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <div className={`w-5 h-5 bg-gradient-to-br ${COLORS[i + 2]} rounded-md flex items-center justify-center`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-base font-black bg-gradient-to-r ${COLORS[i + 2]} bg-clip-text text-transparent`}>
                        {t(`security.${key}.stat`)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{t(`security.${key}.statLabel`)}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{t(`security.${key}.title`)}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{t(`security.${key}.desc`)}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Trust banner */}
        <div className={cn('mt-10 flex flex-wrap items-center justify-center gap-6 py-5 px-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 transition-all duration-700 delay-500', visible ? 'opacity-100' : 'opacity-0')}>
          {BANNER_KEYS.map((key, i) => (
            <div key={key} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>{BANNER_ICONS[i]}</span>
              <span>{t(`security.banner.${key}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
