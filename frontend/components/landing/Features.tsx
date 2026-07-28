'use client'

import { useState } from 'react'
import {
  Users, FileText, Truck, Receipt, CreditCard,
  BarChart3, UserCog, Globe, BookOpen, Bell,
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
  { key: 'team',          icon: UserCog,    color: '#94a3b8', num: '07' },
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
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #07080e 0%, #0d0f1e 55%, #080a12 100%)' }}
    >
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Center ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-12"
        style={{ background: 'radial-gradient(ellipse, #6366f125 0%, transparent 68%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-12 sm:mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span
            className="inline-block px-4 py-1.5 rounded-full border text-sm font-semibold mb-5"
            style={{ background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.3)', color: '#818cf8' }}
          >
            {t('features.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('features.sub')}
          </p>
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
                  'relative rounded-2xl p-5 overflow-hidden cursor-default',
                  visible ? 'opacity-100' : 'opacity-0',
                )}
                style={{
                  /* entrance stagger via animation */
                  animation: visible
                    ? `revealUp 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 45}ms both`
                    : 'none',
                  /* hover physics — cubic-bezier overshoot gives the spring feel */
                  background: on
                    ? `linear-gradient(145deg, #141826 0%, #0f1320 100%)`
                    : '#10131e',
                  border: `1px solid ${on ? `${color}45` : 'rgba(255,255,255,0.06)'}`,
                  transform: on ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: on
                    ? `0 28px 56px rgba(0,0,0,0.45), 0 0 0 1px ${color}28, 0 0 36px ${color}18`
                    : '0 2px 8px rgba(0,0,0,0.25)',
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {/* Top gradient line — always visible, fully lit on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
                    opacity: on ? 1 : 0.28,
                    transition: 'opacity 0.3s ease',
                  }}
                />

                {/* Radial glow overlay that fades in on hover */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${color}1a 0%, transparent 60%)`,
                    opacity: on ? 1 : 0,
                    transition: 'opacity 0.35s ease',
                  }}
                />

                {/* Large decorative number — purely decorative */}
                <div
                  className="absolute bottom-1 right-2 font-black select-none pointer-events-none leading-none"
                  style={{
                    fontSize: '5.5rem',
                    color: on ? `${color}12` : 'rgba(255,255,255,0.025)',
                    transition: 'color 0.35s ease',
                  }}
                >
                  {num}
                </div>

                {/* Visible content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: on ? `${color}25` : `${color}10`,
                      boxShadow: on ? `0 0 22px ${color}40` : 'none',
                      transform: on ? 'scale(1.15) rotate(-4deg)' : 'scale(1) rotate(0deg)',
                      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: on ? color : `${color}99`,
                        transition: 'color 0.25s ease',
                      }}
                    />
                  </div>

                  {/* Number tag */}
                  <div
                    className="text-[10px] font-bold mb-1.5 tracking-widest"
                    style={{
                      color: on ? color : 'rgba(255,255,255,0.2)',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {num}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-sm font-bold leading-snug mb-2"
                    style={{
                      color: on ? '#fff' : 'rgba(255,255,255,0.75)',
                      transition: 'color 0.25s ease',
                    }}
                  >
                    {t(`features.${key}.title`)}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: on ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.28)',
                      transition: 'color 0.25s ease',
                      lineHeight: '1.65',
                    }}
                  >
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
