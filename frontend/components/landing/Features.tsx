'use client'

import { useState } from 'react'
import {
  Users, FileText, Truck, Receipt, CreditCard,
  BarChart3, UserCog, Globe, BookOpen, Bell, Layers,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const FEATURES = [
  { key: 'crm',           icon: Users,      color: '#3b82f6', num: '01' },
  { key: 'devis',         icon: FileText,   color: '#14b8a6', num: '02' },
  { key: 'bonsLivraison', icon: Truck,      color: '#f59e0b', num: '03' },
  { key: 'factures',      icon: Receipt,    color: '#8b5cf6', num: '04' },
  { key: 'paiements',     icon: CreditCard, color: '#f97316', num: '05' },
  { key: 'analytics',     icon: BarChart3,  color: '#ec4899', num: '06' },
  { key: 'team',          icon: UserCog,    color: '#64748b', num: '07' },
  { key: 'portal',        icon: Globe,      color: '#6366f1', num: '08' },
  { key: 'catalogue',     icon: BookOpen,   color: '#22c55e', num: '09' },
  { key: 'relances',      icon: Bell,       color: '#ef4444', num: '10' },
]

export function Features() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-16 sm:py-24 overflow-hidden bg-slate-50 dark:bg-[#07080e]"
    >
      {/* Dot grid — light mode: dark dots, dark mode: white dots */}
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.055) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Center ambient glow — visible on dark, subtle on light */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none opacity-[0.07] dark:opacity-[0.18]"
        style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 68%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-12 sm:mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold mb-5 bg-primary-50 dark:bg-[rgba(99,102,241,0.12)] border-primary-200 dark:border-[rgba(99,102,241,0.3)] text-primary-700 dark:text-[#818cf8]">
            <Layers className="w-3.5 h-3.5" />
            {t('features.badge')}
          </span>
          <h2 className="section-title mb-4">{t('features.title')}</h2>
          <p className="section-sub">{t('features.sub')}</p>
        </div>

        {/* ── Grid: 5 cols desktop, 2 cols tablet, 1 col mobile ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {FEATURES.map(({ key, icon: Icon, color, num }, i) => {
            const on = hovered === i
            return (
              <div
                key={key}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'group relative rounded-2xl p-5 overflow-hidden cursor-default',
                  'bg-white dark:bg-[#0f1220]',
                  'border border-slate-200 dark:border-[rgba(255,255,255,0.06)]',
                  visible ? 'opacity-100' : 'opacity-0',
                )}
                style={{
                  animation: visible
                    ? `flipInUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both`
                    : 'none',
                  /* Hover overrides — undefined falls back to Tailwind class */
                  ...(on ? {
                    border: `1px solid ${color}50`,
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 24px 48px rgba(0,0,0,0.10), 0 0 0 1px ${color}25, 0 0 30px ${color}12`,
                  } : {}),
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {/* Top gradient accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    opacity: on ? 1 : 0.22,
                    transition: 'opacity 0.3s ease',
                  }}
                />

                {/* Radial color wash on hover */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${color}14 0%, transparent 65%)`,
                    opacity: on ? 1 : 0,
                  }}
                />

                {/* Large decorative number — faint in both modes */}
                <div
                  className="absolute bottom-1 right-2 font-black select-none pointer-events-none leading-none text-slate-200 dark:text-[rgba(255,255,255,0.025)]"
                  style={{
                    fontSize: '5.5rem',
                    transition: 'color 0.35s ease',
                    color: on ? `${color}20` : undefined,
                  }}
                >
                  {num}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: on ? `${color}22` : `${color}12`,
                      boxShadow: on ? `0 0 20px ${color}35` : 'none',
                      transform: on ? 'scale(1.15) rotate(-4deg)' : 'scale(1) rotate(0deg)',
                      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: on ? color : `${color}aa`, transition: 'color 0.25s ease' }}
                    />
                  </div>

                  {/* Number tag */}
                  <div
                    className="text-[10px] font-bold mb-1.5 tracking-widest text-slate-300 dark:text-[rgba(255,255,255,0.2)]"
                    style={{ color: on ? color : undefined, transition: 'color 0.25s ease' }}
                  >
                    {num}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold leading-snug mb-2 text-slate-900 dark:text-[rgba(255,255,255,0.82)]">
                    {t(`features.${key}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-[rgba(255,255,255,0.32)]" style={{ lineHeight: '1.65' }}>
                    {t(`features.${key}.desc`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
