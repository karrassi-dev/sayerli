'use client'

import { Shield, Lock, Database, Cloud, Users } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const ITEMS = [
  { key: 'item1', icon: Shield,   color: '#6366f1', delay: 0   },
  { key: 'item2', icon: Lock,     color: '#14b8a6', delay: 80  },
  { key: 'item3', icon: Database, color: '#8b5cf6', delay: 40  },
  { key: 'item4', icon: Cloud,    color: '#f97316', delay: 120 },
  { key: 'item5', icon: Users,    color: '#22c55e', delay: 160 },
] as const

const BANNER_ICONS = ['🔒', '☁️', '🛡️', '📦', '✅']
const BANNER_KEYS  = ['encrypted', 'cloud', 'auth', 'backup', 'multitenant'] as const

export function TrustSecurity() {
  const { t }   = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)

  return (
    <section ref={ref} className="py-16 sm:py-24 overflow-hidden bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-14 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
            {t('security.badge')}
          </span>
          <h2 className="section-title mb-4">{t('security.title')}</h2>
          <p className="section-sub">{t('security.sub')}</p>
        </div>

        {/* ── Row 1: 2 large cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {ITEMS.slice(0, 2).map(({ key, icon: Icon, color, delay }, i) => (
            <div
              key={key}
              className="group relative rounded-2xl p-7 overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-400"
              style={{
                animation: visible ? `popIn 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both` : 'none',
              }}
            >
              {/* Colored corner glow */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top right, ${color}18 0%, transparent 65%)`, transform: 'translate(20%, -20%)' }}
              />

              <div className="flex items-start justify-between mb-5 relative">
                {/* Icon */}
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${color}15`, width: 52, height: 52 }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>

                {/* Stat */}
                <div className="text-right">
                  <div className="text-xl font-black mb-0.5" style={{ color }}>
                    {t(`security.${key}.stat`)}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">{t(`security.${key}.statLabel`)}</div>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 relative">{t(`security.${key}.title`)}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed relative">{t(`security.${key}.desc`)}</p>

              {/* Bottom accent line that slides in on hover */}
              <div
                className="absolute bottom-0 left-0 h-0.5 rounded-b-2xl transition-all duration-500 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${color}, ${color}60)`, width: '0%' }}
              />
            </div>
          ))}
        </div>

        {/* ── Row 2: 3 smaller cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ITEMS.slice(2).map(({ key, icon: Icon, color, delay }, i) => (
            <div
              key={key}
              className="group relative rounded-2xl p-6 overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-400"
              style={{
                animation: visible ? `popIn 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both` : 'none',
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top right, ${color}18 0%, transparent 65%)`, transform: 'translate(20%, -20%)' }}
              />

              <div className="flex items-start justify-between mb-4 relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-right">
                  <div className="text-base font-black mb-0.5" style={{ color }}>
                    {t(`security.${key}.stat`)}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">{t(`security.${key}.statLabel`)}</div>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white mb-2 relative">{t(`security.${key}.title`)}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed relative">{t(`security.${key}.desc`)}</p>

              <div
                className="absolute bottom-0 left-0 h-0.5 rounded-b-2xl transition-all duration-500 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${color}, ${color}60)`, width: '0%' }}
              />
            </div>
          ))}
        </div>

        {/* ── Trust banner ── */}
        <div
          className={cn(
            'mt-8 flex flex-wrap items-center justify-center gap-5 py-5 px-8 rounded-2xl',
            'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800',
            'transition-all duration-700 delay-300',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          {BANNER_KEYS.map((key, i) => (
            <div
              key={key}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
              style={{
                animation: visible ? `revealUp 0.5s cubic-bezier(0.16,1,0.3,1) ${200 + i * 60}ms both` : 'none',
              }}
            >
              <span>{BANNER_ICONS[i]}</span>
              <span>{t(`security.banner.${key}`)}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
