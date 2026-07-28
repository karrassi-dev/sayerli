'use client'

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

// Dot coordinates for 280×280 SVG (center 140, 140)
// Outer ring r=125 | Middle ring r=95 | Inner ring r=65
const DOTS = [
  { cx: 51.6,  cy: 51.6,  r: 125, color: CARDS[0].color }, // 01: outer upper-left  (225°)
  { cx: 45,    cy: 140,   r: 95,  color: CARDS[1].color }, // 02: middle left        (180°)
  { cx: 51.6,  cy: 228.4, r: 125, color: CARDS[2].color }, // 03: outer lower-left  (135°)
  { cx: 207.2, cy: 72.8,  r: 95,  color: CARDS[3].color }, // 04: middle upper-right (315°)
  { cx: 265,   cy: 140,   r: 125, color: CARDS[4].color }, // 05: outer right        (0°)
  { cx: 207.2, cy: 207.2, r: 95,  color: CARDS[5].color }, // 06: middle lower-right (45°)
]

function CenterOrb() {
  return (
    <div className="relative flex-shrink-0 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px] flex items-center justify-center">
      {/* Purple ambient glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(139,92,246,0.18) 45%, transparent 72%)',
          filter: 'blur(24px)',
        }}
      />

      {/* SVG rings + dots */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 280 280"
        fill="none"
        aria-hidden="true"
      >
        {/* Dashed concentric rings */}
        <circle cx="140" cy="140" r="125" stroke="rgba(255,255,255,0.055)" strokeWidth="0.8" strokeDasharray="3 9" />
        <circle cx="140" cy="140" r="95"  stroke="rgba(255,255,255,0.065)" strokeWidth="0.8" strokeDasharray="4 7" />
        <circle cx="140" cy="140" r="65"  stroke="rgba(255,255,255,0.08)"  strokeWidth="0.8" strokeDasharray="2 8" />

        {/* Colored feature dots */}
        {DOTS.map(({ cx, cy, color }, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9"   fill={color} opacity="0.15" />
            <circle cx={cx} cy={cy} r="4.5" fill={color} />
          </g>
        ))}
      </svg>

      {/* Center S logo card */}
      <div
        className="relative z-10 w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #1c1d35, #111220)',
          border: '1px solid rgba(99,102,241,0.35)',
          boxShadow:
            '0 0 28px rgba(99,102,241,0.35), 0 0 70px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <span
          className="text-[2.6rem] sm:text-5xl font-black leading-none select-none"
          style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%)',
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
      className="flex items-start gap-3 sm:gap-4 py-6 sm:py-7 border-b border-white/[0.06] last:border-0"
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
          boxShadow: `0 0 16px ${card.color}18`,
        }}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: card.color }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h3 className="font-bold text-white text-sm sm:text-base lg:text-[17px] mb-1.5 leading-snug">
          {t(`whyChoose.${card.key}.title`)}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {t(`whyChoose.${card.key}.desc`)}
        </p>
      </div>
    </div>
  )
}

export function WhyChooseSayerli() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: '#0a0b14' }}
    >
      {/* Section-wide radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)',
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
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#818cf8',
            }}
          >
            {t('whyChoose.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            {t('whyChoose.title')}
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
            {t('whyChoose.sub')}
          </p>
        </div>

        {/* ── Desktop: 3-col layout ── */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] gap-6 xl:gap-10 items-center">

          {/* Left: cards 1–3 */}
          <div>
            {CARDS.slice(0, 3).map((card, i) => (
              <FeatureItem key={card.key} card={card} index={i} visible={visible} />
            ))}
          </div>

          {/* Center orb */}
          <CenterOrb />

          {/* Right: cards 4–6 */}
          <div>
            {CARDS.slice(3).map((card, i) => (
              <FeatureItem key={card.key} card={card} index={i + 3} visible={visible} />
            ))}
          </div>
        </div>

        {/* ── Mobile / tablet: orb at top + single column ── */}
        <div className="lg:hidden">
          {/* Orb centered */}
          <div
            className={cn(
              'flex justify-center mb-10 transition-all duration-700 delay-100',
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
            )}
          >
            <CenterOrb />
          </div>

          {/* All 6 items in a single column */}
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
