'use client'

import { Clock, Table2, FileCheck, Banknote, HeartHandshake, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const CARDS = [
  { key: 'card1', icon: Clock,         num: '01', color: '#6366f1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.18)', glow: 'rgba(99,102,241,0.12)' },
  { key: 'card2', icon: Table2,        num: '02', color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.18)',  glow: 'rgba(239,68,68,0.10)'  },
  { key: 'card3', icon: FileCheck,     num: '03', color: '#14b8a6', bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.18)', glow: 'rgba(20,184,166,0.10)' },
  { key: 'card4', icon: Banknote,      num: '04', color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.18)', glow: 'rgba(16,185,129,0.10)' },
  { key: 'card5', icon: HeartHandshake,num: '05', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.18)', glow: 'rgba(139,92,246,0.10)' },
  { key: 'card6', icon: TrendingUp,    num: '06', color: '#f97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.18)', glow: 'rgba(249,115,22,0.10)' },
] as const

export function WhyChooseSayerli() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-white dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={cn('text-center mb-10 sm:mb-14 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
            {t('whyChoose.badge')}
          </span>
          <h2 className="section-title mb-4">{t('whyChoose.title')}</h2>
          <p className="section-sub">{t('whyChoose.sub')}</p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CARDS.map(({ key, icon: Icon, num, color, bg, border, glow }, i) => (
            <div
              key={key}
              className={cn(
                'group relative rounded-2xl p-6 sm:p-7 overflow-hidden cursor-default transition-all duration-500',
                'bg-white dark:bg-slate-900/60',
                'hover:-translate-y-1.5',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
              style={{
                border: `1px solid ${border}`,
                transitionDelay: `${i * 60}ms`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${glow}, 0 1px 3px rgba(0,0,0,0.04)` }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              {/* Background accent */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${color}05 0%, transparent 60%)` }} />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl transition-all duration-300"
                style={{ background: `linear-gradient(to right, ${color}, transparent)`, opacity: 0.5 }} />

              {/* Large background number */}
              <div
                className="absolute -bottom-2 -right-1 text-[5rem] font-black leading-none select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                style={{ color: `${color}12` }}
              >{num}</div>

              {/* Icon */}
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              {/* Content */}
              <div className="relative">
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
