'use client'

import { Shield, Lock, Database, Cloud, Users } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const ITEMS = [
  { key: 'item1', icon: Shield,   color: '#6366f1', spark: '#818cf8', delay: 0   },
  { key: 'item2', icon: Lock,     color: '#14b8a6', spark: '#2dd4bf', delay: 80  },
  { key: 'item3', icon: Database, color: '#8b5cf6', spark: '#a78bfa', delay: 40  },
  { key: 'item4', icon: Cloud,    color: '#f97316', spark: '#fb923c', delay: 120 },
  { key: 'item5', icon: Users,    color: '#22c55e', spark: '#4ade80', delay: 160 },
] as const

const BANNER_ICONS = ['🔒', '☁️', '🛡️', '📦', '✅']
const BANNER_KEYS  = ['encrypted', 'cloud', 'auth', 'backup', 'multitenant'] as const

export function TrustSecurity() {
  const { t }   = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden bg-white dark:bg-[#0a0a0f]"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div
          className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full opacity-20 dark:opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(-30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full opacity-15 dark:opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)', filter: 'blur(60px)', transform: 'translate(25%, 25%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={cn(
            'text-center mb-14 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-5">
            <Shield className="w-3.5 h-3.5" />
            {t('security.badge')}
          </span>
          <h2 className="section-title mb-4">{t('security.title')}</h2>
          <p className="section-sub">{t('security.sub')}</p>
        </div>

        {/* Row 1: 2 large cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {ITEMS.slice(0, 2).map(({ key, icon: Icon, color, spark, delay }) => (
            <div
              key={key}
              className="group relative rounded-2xl p-7 overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-default"
              style={{
                animation: visible ? `flipInUp 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` : 'none',
                boxShadow: `0 0 0 1px ${color}10, 0 2px 8px rgba(0,0,0,0.04)`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${color}28, 0 20px 50px rgba(${color === '#6366f1' ? '99,102,241' : '20,184,166'},0.12)` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${color}10, 0 2px 8px rgba(0,0,0,0.04)` }}
            >
              {/* Top gradient accent */}
              <div
                className="absolute top-0 inset-x-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(to right, ${color}, ${spark}, transparent)` }}
              />

              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top right, ${color}18 0%, transparent 65%)`, transform: 'translate(20%, -20%)' }}
              />

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${color}14`, width: 52, height: 52, border: `1px solid ${color}22` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className="text-end">
                  <div className="text-2xl font-black mb-0.5" style={{ color }}>
                    {t(`security.${key}.stat`)}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {t(`security.${key}.statLabel`)}
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 relative z-10">
                {t(`security.${key}.title`)}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">
                {t(`security.${key}.desc`)}
              </p>

              {/* Bottom accent slide */}
              <div
                className="absolute bottom-0 start-0 h-0.5 rounded-b-2xl transition-all duration-500 group-hover:w-full"
                style={{ background: `linear-gradient(to right, ${color}, ${spark})`, width: '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Row 2: 3 smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ITEMS.slice(2).map(({ key, icon: Icon, color, spark, delay }) => (
            <div
              key={key}
              className="group relative rounded-2xl p-6 overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-default"
              style={{
                animation: visible ? `flipInUp 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` : 'none',
                boxShadow: `0 0 0 1px ${color}10, 0 2px 6px rgba(0,0,0,0.03)`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${color}28, 0 16px 40px ${color}12` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${color}10, 0 2px 6px rgba(0,0,0,0.03)` }}
            >
              {/* Top gradient accent */}
              <div
                className="absolute top-0 inset-x-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(to right, ${color}, ${spark}, transparent)` }}
              />

              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top right, ${color}18 0%, transparent 65%)`, transform: 'translate(20%, -20%)' }}
              />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${color}14`, border: `1px solid ${color}22` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-end">
                  <div className="text-base font-black mb-0.5" style={{ color }}>
                    {t(`security.${key}.stat`)}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {t(`security.${key}.statLabel`)}
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white mb-2 relative z-10">
                {t(`security.${key}.title`)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">
                {t(`security.${key}.desc`)}
              </p>

              <div
                className="absolute bottom-0 start-0 h-0.5 rounded-b-2xl transition-all duration-500 group-hover:w-full"
                style={{ background: `linear-gradient(to right, ${color}, ${spark})`, width: '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Trust banner */}
        <div
          className={cn(
            'mt-8 transition-all duration-700 delay-300',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          <div
            className="flex flex-wrap items-center justify-center gap-5 py-5 px-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
            style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.06), 0 4px 20px rgba(0,0,0,0.04)' }}
          >
            {BANNER_KEYS.map((key, i) => (
              <div
                key={key}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                style={{
                  animation: visible
                    ? `revealUp 0.5s cubic-bezier(0.16,1,0.3,1) ${200 + i * 70}ms both`
                    : 'none',
                }}
              >
                <span className="text-base leading-none">{BANNER_ICONS[i]}</span>
                <span>{t(`security.banner.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
