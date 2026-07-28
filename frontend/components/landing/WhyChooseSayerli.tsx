'use client'

import { Clock, Table2, FileCheck, Banknote, HeartHandshake, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const CARDS = [
  { key: 'card1', icon: Clock,          num: '01', color: '#6366f1', glow: 'rgba(99,102,241,0.15)',  spark: '#818cf8' },
  { key: 'card2', icon: Table2,         num: '02', color: '#ef4444', glow: 'rgba(239,68,68,0.15)',   spark: '#f87171' },
  { key: 'card3', icon: FileCheck,      num: '03', color: '#14b8a6', glow: 'rgba(20,184,166,0.15)',  spark: '#2dd4bf' },
  { key: 'card4', icon: Banknote,       num: '04', color: '#10b981', glow: 'rgba(16,185,129,0.15)',  spark: '#34d399' },
  { key: 'card5', icon: HeartHandshake, num: '05', color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)', spark: '#a78bfa' },
  { key: 'card6', icon: TrendingUp,     num: '06', color: '#f97316', glow: 'rgba(249,115,22,0.15)', spark: '#fb923c' },
] as const

export function WhyChooseSayerli() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden bg-white dark:bg-[#0a0a0f]">

      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Dot grid */}
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Color blobs */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(70px)', transform: 'translate(20%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-15 dark:opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, transparent 70%)', filter: 'blur(60px)', transform: 'translate(-20%, 20%)' }}
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-5">
            {t('whyChoose.badge')}
          </span>
          <h2 className="section-title mb-4">{t('whyChoose.title')}</h2>
          <p className="section-sub">{t('whyChoose.sub')}</p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CARDS.map(({ key, icon: Icon, num, color, glow, spark }, i) => (
            <div
              key={key}
              className="group relative rounded-2xl p-6 sm:p-7 overflow-hidden cursor-default bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
              style={{
                animation: visible
                  ? `flipInUp 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 75}ms both`
                  : 'none',
                boxShadow: `0 0 0 1px ${color}10, 0 2px 8px rgba(0,0,0,0.04)`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 0 0 1px ${color}30, 0 20px 50px ${glow}`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 0 0 1px ${color}10, 0 2px 8px rgba(0,0,0,0.04)`
              }}
            >
              {/* Top gradient accent */}
              <div
                className="absolute top-0 inset-x-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(to right, ${color}, ${spark}, transparent)` }}
              />

              {/* Corner ambient glow */}
              <div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
              />

              {/* Hover background wash */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(135deg, ${color}06 0%, transparent 60%)` }}
              />

              {/* Large decorative number */}
              <div
                className="absolute -bottom-2 -right-1 text-[5.5rem] font-black leading-none select-none pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                style={{ color: `${color}10` }}
              >
                {num}
              </div>

              {/* Icon */}
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                style={{
                  background: `${color}12`,
                  border: `1px solid ${color}22`,
                  boxShadow: `0 0 0 0 ${color}30`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <span
                  className="text-[10px] font-bold tracking-widest mb-2 block"
                  style={{ color: `${color}90` }}
                >
                  {num}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2.5 leading-snug">
                  {t(`whyChoose.${key}.title`)}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {t(`whyChoose.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
