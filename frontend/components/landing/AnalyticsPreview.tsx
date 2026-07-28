'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, Receipt, Clock, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

// ── Static demo data ─────────────────────────────────────────────────
const MONTHLY = [38, 52, 44, 67, 58, 78, 65, 89, 72, 95, 84, 102]
const MAX_VAL = Math.max(...MONTHLY)
const Y_TICKS = [100, 75, 50, 25, 0]

const TOP_CLIENTS = [
  { name: 'Atlas Marketing',  initials: 'AM', amount: 24000, pct: 85, color: '#6366f1' },
  { name: 'Restaurant Atlas', initials: 'RA', amount: 18500, pct: 66, color: '#14b8a6' },
  { name: 'Boutique Rachidi', initials: 'BR', amount: 14200, pct: 50, color: '#8b5cf6' },
  { name: 'Studio Design',    initials: 'SD', amount: 9800,  pct: 35, color: '#f59e0b' },
  { name: 'Rabat Consulting', initials: 'RC', amount: 7600,  pct: 27, color: '#06b6d4' },
] as const

const KPI_CONFIG = [
  {
    key:       'kpi1' as const,
    rawValue:  84200,
    suffix:    'MAD',
    icon:      TrendingUp,
    color:     '#6366f1',
    sparkColor:'#818cf8',
    glow:      'rgba(99,102,241,0.18)',
    up:        true,
    sparkline: [62, 68, 71, 75, 79, 82, 84] as number[],
    isLive:    true,
  },
  {
    key:       'kpi2' as const,
    rawValue:  12,
    suffix:    '/ 15',
    icon:      Receipt,
    color:     '#14b8a6',
    sparkColor:'#2dd4bf',
    glow:      'rgba(20,184,166,0.18)',
    up:        true,
    sparkline: [7, 9, 8, 10, 11, 11, 12] as number[],
    isLive:    false,
  },
  {
    key:       'kpi3' as const,
    rawValue:  47,
    suffix:    '',
    icon:      Users,
    color:     '#8b5cf6',
    sparkColor:'#a78bfa',
    glow:      'rgba(139,92,246,0.18)',
    up:        true,
    sparkline: [38, 40, 42, 43, 45, 46, 47] as number[],
    isLive:    false,
  },
  {
    key:       'kpi4' as const,
    rawValue:  23400,
    suffix:    'MAD',
    icon:      Clock,
    color:     '#f59e0b',
    sparkColor:'#fbbf24',
    glow:      'rgba(245,158,11,0.18)',
    up:        false,
    sparkline: [28, 26, 25, 25, 24, 24, 23] as number[],
    isLive:    false,
  },
] as const

// ── Count-up hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [val, setVal] = useState(0)
  const rafRef = useRef<number | undefined>(undefined)
  useEffect(() => {
    if (!trigger) { setVal(0); return }
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const ease = 1 - (1 - p) ** 3
      setVal(Math.round(ease * target))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [trigger, target, duration])
  return val
}

// ── Sparkline SVG ────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 88, H = 30
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - 4 - ((v - mn) / rng) * (H - 10),
  ])
  const line = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`
    const [px, py] = pts[i - 1]
    const cx = ((px + x) / 2).toFixed(1)
    return `${acc} C${cx},${py.toFixed(1)} ${cx},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`
  }, '')
  const fill = `${line} L${W},${H} L0,${H} Z`
  const gid = `sk_${color.replace('#', '')}`
  const last = pts[pts.length - 1]
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} opacity="0.4" style={{ animation: 'pulseDot 2s ease-in-out infinite' }} />
    </svg>
  )
}

// ── KPI Card ─────────────────────────────────────────────────────────
function KpiCard({
  cfg,
  index,
  visible,
}: {
  cfg: (typeof KPI_CONFIG)[number]
  index: number
  visible: boolean
}) {
  const { t } = useTranslation()
  const counted = useCountUp(cfg.rawValue, 1500 + index * 120, visible)
  const Icon = cfg.icon
  const display = cfg.rawValue >= 1000 ? counted.toLocaleString('fr-MA') : String(counted)

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group cursor-default"
      style={{
        animation: visible ? `flipInUp 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 95}ms both` : 'none',
        boxShadow: `0 0 0 1px ${cfg.color}18, 0 2px 12px ${cfg.glow}`,
      }}
    >
      {/* Top gradient accent bar */}
      <div
        className="absolute top-0 inset-x-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(to right, ${cfg.color}, ${cfg.sparkColor}, transparent)` }}
      />

      {/* Ambient corner glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-60"
        style={{ background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)` }}
      />

      {/* Icon + trend badge */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
          style={{ background: `${cfg.color}18` }}
        >
          <Icon className="w-5 h-5" style={{ color: cfg.color }} />
        </div>
        <div
          className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            background: cfg.up ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
            color: cfg.up ? '#10b981' : '#f59e0b',
          }}
        >
          {cfg.up
            ? <ArrowUpRight className="w-3 h-3" />
            : <ArrowDownRight className="w-3 h-3" />
          }
          {t(`analytics.${cfg.key}.change`)}
        </div>
      </div>

      {/* Animated count-up value */}
      <div className="relative z-10 leading-none mb-1">
        <span className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">
          {display}
        </span>
        {cfg.suffix && (
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ms-1.5">
            {cfg.suffix}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium relative z-10 mb-4">
        {t(`analytics.${cfg.key}.label`)}
      </p>

      {/* Sparkline */}
      <div className="relative z-10 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkline data={cfg.sparkline} color={cfg.sparkColor} />
      </div>

      {/* Live pulsing dot on first card */}
      {cfg.isLive && (
        <div className="absolute bottom-3.5 end-3.5 flex items-center gap-1 z-10">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"
            style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
          />
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Live
          </span>
        </div>
      )}
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────────────
export function AnalyticsPreview() {
  const { t, tArray } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.07)
  const months = tArray('analytics.months')
  const displayMonths = months.length === 12
    ? months
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-50 dark:bg-[#07080f]"
    >
      {/* Ambient background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
            transform: 'translate(-50%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, transparent 70%)',
            filter: 'blur(70px)',
            transform: 'translate(30%, 30%)',
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full opacity-15 dark:opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div
          className={cn(
            'text-center mb-14 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-5">
            <BarChart3 className="w-3.5 h-3.5" />
            {t('analytics.badge')}
          </span>
          <h2 className="section-title mb-4">{t('analytics.title')}</h2>
          <p className="section-sub">{t('analytics.sub')}</p>
        </div>

        {/* ── KPI cards row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {KPI_CONFIG.map((cfg, i) => (
            <KpiCard key={cfg.key} cfg={cfg} index={i} visible={visible} />
          ))}
        </div>

        {/* ── Chart + Top clients bento ── */}
        <div
          className="grid lg:grid-cols-3 gap-5"
          style={{
            animation: visible ? 'flipInUp 0.7s cubic-bezier(0.16,1,0.3,1) 400ms both' : 'none',
          }}
        >

          {/* ── Revenue bar chart ── */}
          <div
            className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6"
            style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 4px 28px rgba(0,0,0,0.05)' }}
          >
            {/* Chart header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-7">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t('analytics.chart.title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('analytics.chart.sub')}
                </p>
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                {t('analytics.chart.badge')}
              </div>
            </div>

            {/* Chart: y-axis + bars grid */}
            <div className="flex gap-3">

              {/* Y-axis labels */}
              <div className="flex flex-col justify-between h-44 w-8 flex-shrink-0 text-end">
                {Y_TICKS.map(v => (
                  <span
                    key={v}
                    className="text-[9px] font-medium text-slate-400 dark:text-slate-600 leading-none"
                  >
                    {v === 0 ? '0' : `${v}k`}
                  </span>
                ))}
              </div>

              {/* Bars + grid lines */}
              <div className="flex-1 min-w-0">
                {/* Grid area with bars */}
                <div className="relative h-44">

                  {/* Horizontal grid lines */}
                  {Y_TICKS.map((v, j) => (
                    <div
                      key={v}
                      className="absolute inset-x-0 pointer-events-none"
                      style={{
                        top: `${(j / (Y_TICKS.length - 1)) * 100}%`,
                        borderTop: `1px ${j === Y_TICKS.length - 1 ? 'solid' : 'dashed'} ${
                          j === Y_TICKS.length - 1
                            ? 'rgba(99,102,241,0.2)'
                            : 'rgba(148,163,184,0.1)'
                        }`,
                      }}
                    />
                  ))}

                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end gap-1">
                    {MONTHLY.map((val, i) => {
                      const isLast = i === MONTHLY.length - 1
                      const isPeak = val === MAX_VAL
                      const pct = (val / MAX_VAL) * 100

                      return (
                        <div
                          key={i}
                          className="flex-1 h-full flex flex-col items-center justify-end relative"
                        >
                          {/* Peak label on the tallest/last bar */}
                          {(isLast && isPeak) && (
                            <div
                              className="absolute top-0 inset-x-0 flex justify-center z-10 pointer-events-none"
                              style={{
                                animation: visible
                                  ? 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.5s both'
                                  : 'none',
                                opacity: visible ? undefined : 0,
                              }}
                            >
                              <span className="block text-[7px] sm:text-[8px] font-black text-white/90 text-center pt-1.5 leading-tight">
                                102k
                              </span>
                            </div>
                          )}

                          {/* Bar itself */}
                          <div
                            className="w-full relative overflow-hidden"
                            style={{
                              height: visible ? `${pct}%` : '0%',
                              background: isLast
                                ? 'linear-gradient(to top, #4338ca, #818cf8)'
                                : i % 2 === 0
                                ? 'rgba(99,102,241,0.22)'
                                : 'rgba(99,102,241,0.13)',
                              transition: `height 1.1s cubic-bezier(0.34,1.56,0.64,1) ${i * 55}ms`,
                              borderRadius: '3px 3px 0 0',
                            }}
                          >
                            {/* Shimmer on last bar */}
                            {isLast && visible && (
                              <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  background:
                                    'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                                  animation: 'shimmer 2.5s 1.8s ease-in-out infinite',
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Month labels */}
                <div className="flex justify-between mt-2">
                  {displayMonths.map((m, i) => (
                    <span
                      key={i}
                      className={cn(
                        'flex-1 text-center text-[9px] font-medium',
                        i === MONTHLY.length - 1
                          ? 'text-indigo-500 dark:text-indigo-400 font-bold'
                          : 'text-slate-400 dark:text-slate-600',
                      )}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom insight row */}
            <div className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
              />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('analytics.chart.tooltipMonth')}
              </span>
              <span className="ms-auto text-sm font-black text-slate-900 dark:text-white">
                {t('analytics.chart.tooltipValue')}
              </span>
            </div>
          </div>

          {/* ── Top clients card ── */}
          <div
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6"
            style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.06), 0 4px 28px rgba(0,0,0,0.04)' }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {t('analytics.topClients.title')}
              </h3>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {t('analytics.topClients.sub')}
            </p>

            {/* Clients list */}
            <div className="space-y-4">
              {TOP_CLIENTS.map(({ name, initials, amount, pct, color }, i) => (
                <div key={name}>
                  <div className="flex items-center gap-3 mb-2">
                    {/* Rank bubble */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
                    >
                      {i + 1}
                    </div>

                    {/* Name + amount */}
                    <div className="flex-1 min-w-0 flex items-baseline justify-between gap-1">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {name}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 tabular-nums">
                        {amount.toLocaleString()}
                        <span className="text-slate-400 dark:text-slate-600 font-medium"> MAD</span>
                      </span>
                    </div>
                  </div>

                  {/* Animated progress bar */}
                  <div className="ms-10 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: visible ? `${pct}%` : '0%',
                        background: `linear-gradient(to right, ${color}, ${color}88)`,
                        transition: `width 1.2s cubic-bezier(0.34,1.3,0.64,1) ${450 + i * 110}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total CA footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Total top 5
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                74,100 <span className="text-xs font-semibold text-slate-400">MAD</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
