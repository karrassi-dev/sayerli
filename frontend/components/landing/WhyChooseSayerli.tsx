'use client'

import { useEffect, useState } from 'react'
import { Clock, Table2, FileCheck, Banknote, HeartHandshake, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const CARDS = [
  { key: 'card1', icon: Clock,          num: '01', color: '#6366f1' },
  { key: 'card2', icon: Table2,         num: '02', color: '#ef4444' },
  { key: 'card3', icon: FileCheck,      num: '03', color: '#14b8a6' },
  { key: 'card4', icon: Banknote,       num: '04', color: '#10b981' },
  { key: 'card5', icon: HeartHandshake, num: '05', color: '#8b5cf6' },
  { key: 'card6', icon: TrendingUp,     num: '06', color: '#f59e0b' },
] as const

// Dot positions on 280×280 SVG (center 140,140)
// outer ring r=125 | middle r=95 | inner r=65
const DOTS = [
  { cx: 51.6,  cy: 51.6,  color: CARDS[0].color }, // 01 — outer upper-left  (225°)
  { cx: 45,    cy: 140,   color: CARDS[1].color }, // 02 — middle left        (180°)
  { cx: 51.6,  cy: 228.4, color: CARDS[2].color }, // 03 — outer lower-left  (135°)
  { cx: 207.2, cy: 72.8,  color: CARDS[3].color }, // 04 — middle upper-right (315°)
  { cx: 265,   cy: 140,   color: CARDS[4].color }, // 05 — outer right        (0°)
  { cx: 207.2, cy: 207.2, color: CARDS[5].color }, // 06 — middle lower-right (45°)
]

// Reactively track whether dark mode is active
function useDark() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

// ── Center orb — adapts to light / dark ─────────────────────────────
function CenterOrb({ dark }: { dark: boolean }) {
  const ringStroke = dark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.15)'
  const ringStrokeMid = dark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)'
  const ringStrokeOuter = dark ? 'rgba(255,255,255,0.055)' : 'rgba(99,102,241,0.09)'

  return (
    <div className="relative flex-shrink-0 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px] flex items-center justify-center">

      {/* Ambient glow blob */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: dark
            ? 'radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(139,92,246,0.18) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.07) 45%, transparent 72%)',
          filter: 'blur(24px)',
        }}
      />

      {/* SVG rings + dots */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 280" fill="none" aria-hidden="true">
        <circle cx="140" cy="140" r="125" stroke={ringStrokeOuter} strokeWidth="0.8" strokeDasharray="3 9" />
        <circle cx="140" cy="140" r="95"  stroke={ringStrokeMid}   strokeWidth="0.8" strokeDasharray="4 7" />
        <circle cx="140" cy="140" r="65"  stroke={ringStroke}      strokeWidth="0.8" strokeDasharray="2 8" />

        {DOTS.map(({ cx, cy, color }, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9"   fill={color} opacity={dark ? 0.15 : 0.2} />
            <circle cx={cx} cy={cy} r="4.5" fill={color} />
          </g>
        ))}
      </svg>

      {/* Center S card */}
      <div
        className="relative z-10 w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] rounded-2xl flex items-center justify-center"
        style={dark ? {
          background: 'linear-gradient(145deg, #1c1d35, #111220)',
          border: '1px solid rgba(99,102,241,0.35)',
          boxShadow: '0 0 28px rgba(99,102,241,0.35), 0 0 70px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
        } : {
          background: 'linear-gradient(145deg, #ffffff, #f0f1ff)',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 0 20px rgba(99,102,241,0.18), 0 4px 28px rgba(99,102,241,0.12)',
        }}
      >
        <span
          className="text-[2.6rem] sm:text-5xl font-black leading-none select-none"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          S
        </span>
      </div>
    </div>
  )
}

// ── Single feature row ───────────────────────────────────────────────
function FeatureItem({
  card,
  index,
  visible,
}: {
  card: (typeof CARDS)[number]
  index: number
  visible: boolean
}) {
  const { t } = useTranslation()
  const Icon = card.icon

  return (
    <div
      className="flex items-start gap-3 sm:gap-4 py-6 sm:py-7 border-b border-slate-200 dark:border-white/[0.06] last:border-0"
      style={{
        animation: visible
          ? `flipInUp 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms both`
          : 'none',
      }}
    >
      {/* Colored number */}
      <span
        className="text-xs font-black font-mono w-5 flex-shrink-0 mt-1 tabular-nums"
        style={{ color: card.color }}
      >
        {card.num}
      </span>

      {/* Vertical accent line */}
      <div
        className="w-px self-stretch flex-shrink-0 rounded-full"
        style={{
          background: `linear-gradient(to bottom, ${card.color}80, ${card.color}18)`,
          minHeight: 40,
        }}
      />

      {/* Icon box */}
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `${card.color}14`,
          border: `1px solid ${card.color}28`,
          boxShadow: `0 0 14px ${card.color}15`,
        }}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: card.color }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base lg:text-[17px] mb-1.5 leading-snug">
          {t(`whyChoose.${card.key}.title`)}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-white/40">
          {t(`whyChoose.${card.key}.desc`)}
        </p>
      </div>
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────────────
export function WhyChooseSayerli() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)
  const dark = useDark()

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden bg-white dark:bg-[#0a0b14]"
    >
      {/* Dot grid — light only */}
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Section ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: dark
            ? 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={cn(
            'text-center mb-14 sm:mb-20 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300">
            {t('whyChoose.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
            {t('whyChoose.title')}
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-slate-500 dark:text-white/42">
            {t('whyChoose.sub')}
          </p>
        </div>

        {/* ── Desktop: 3-col layout ── */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] gap-6 xl:gap-10 items-center">
          <div>
            {CARDS.slice(0, 3).map((card, i) => (
              <FeatureItem key={card.key} card={card} index={i} visible={visible} />
            ))}
          </div>

          <CenterOrb dark={dark} />

          <div>
            {CARDS.slice(3).map((card, i) => (
              <FeatureItem key={card.key} card={card} index={i + 3} visible={visible} />
            ))}
          </div>
        </div>

        {/* ── Mobile / tablet: orb + single column ── */}
        <div className="lg:hidden">
          <div
            className={cn(
              'flex justify-center mb-10 transition-all duration-700 delay-100',
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
            )}
          >
            <CenterOrb dark={dark} />
          </div>

          <div className="max-w-lg mx-auto">
            {CARDS.map((card, i) => (
              <FeatureItem key={card.key} card={card} index={i} visible={visible} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
