'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { LOCALES, type Locale } from '@/lib/i18n'
import { Logo } from '@/components/ui/LogoMark'

interface AuthShellProps {
  titleKey: string
  subKey: string
  children: React.ReactNode
}

// ─── Morocco silhouette (+ Western Sahara), viewBox 0 0 600 900 ──────────────
const MOROCCO = `
  M 430 12 C 445 4 460 5 532 46 L 572 55
  L 574 130 L 570 260 L 566 390 L 562 498
  C 545 508 520 520 480 530 L 400 538 L 330 542
  L 328 720 L 328 900 L 32 882
  C 50 840 65 800 74 738 C 85 700 105 650 124 594
  C 140 560 158 542 169 528 C 175 512 180 498 182 484
  C 205 465 230 458 244 452 C 265 440 280 418 286 396
  C 291 374 295 350 296 330 C 294 310 290 292 288 268
  C 298 248 315 232 332 216 C 348 200 362 186 368 166
  C 376 150 386 136 393 122 C 398 114 402 108 404 100
  C 408 88 414 70 420 52 C 424 34 427 18 430 12 Z
`

// ─── Topo contour lines clipped to Morocco shape ─────────────────────────────
function MoroccoSilhouette({
  id,
  transform = '',
}: {
  id: string
  transform?: string
}) {
  return (
    <g transform={transform}>
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={MOROCCO} />
        </clipPath>
      </defs>
      {/* Fill */}
      <path d={MOROCCO} fill="rgba(184,146,42,0.06)" />
      {/* Topo contour lines — clipped to shape */}
      <g clipPath={`url(#clip-${id})`}>
        {/* Atlas mountain lines — denser in upper half */}
        {Array.from({ length: 40 }, (_, i) => {
          const y = i * 23
          const p = i * 0.65
          return (
            <path
              key={`t${i}`}
              d={`M 0 ${y} Q ${150 + Math.sin(p) * 30} ${y - 8} ${300 + Math.cos(p * 0.8) * 20} ${y} Q ${450 + Math.sin(p + 1) * 15} ${y + 8} ${600} ${y}`}
              fill="none"
              stroke="rgba(184,146,42,0.55)"
              strokeWidth={y < 380 ? 0.6 : 0.35}
            />
          )
        })}
      </g>
      {/* Outline stroke */}
      <path d={MOROCCO} fill="none" stroke="rgba(184,146,42,0.7)" strokeWidth="1.5" />
    </g>
  )
}

// ─── Dashboard mockup shown blurred inside the arch ──────────────────────────
function DashboardMockup() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="w-full h-full -rotate-3 scale-110 origin-center blur-[2px] opacity-50 dark:opacity-40">
        {/* App header */}
        <div className="h-10 bg-slate-800 flex items-center px-4 gap-3 border-b border-white/5">
          <div className="w-20 h-3 rounded bg-white/25" />
          <div className="flex-1" />
          <div className="w-7 h-7 rounded-full bg-teal-500/40" />
        </div>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-36 shrink-0 bg-slate-900/90 p-3 space-y-1.5 border-r border-white/5">
            {['Dashboard', 'Clients', 'Devis', 'Factures', 'Catalogue'].map((item, i) => (
              <div
                key={item}
                className={`h-8 rounded-lg flex items-center px-3 ${i === 0 ? 'bg-teal-500/20' : 'bg-white/[0.03]'}`}
              >
                <div className={`h-2 rounded ${i === 0 ? 'w-16 bg-teal-400/50' : 'w-12 bg-white/15'}`} />
              </div>
            ))}
          </div>
          {/* Main area */}
          <div className="flex-1 bg-slate-950 p-3 space-y-2 overflow-hidden">
            <div className="grid grid-cols-3 gap-2">
              {[['CA Total', '120 500'], ['Factures', '34'], ['Clients', '18']].map(([label, val]) => (
                <div key={label} className="rounded-lg bg-slate-800/80 p-2">
                  <div className="w-12 h-1.5 rounded bg-white/10 mb-2" />
                  <div className="w-16 h-3 rounded bg-white/25" />
                </div>
              ))}
            </div>
            {/* Bar chart */}
            <div className="rounded-lg bg-slate-800/60 p-2 flex items-end gap-1 h-20">
              {[45, 62, 38, 80, 55, 92, 48, 74, 68, 85, 50, 77].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-teal-500/50"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            {/* Client list */}
            <div className="rounded-lg bg-slate-800/60 p-2 space-y-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-600 shrink-0" />
                  <div className="flex-1 h-1.5 rounded bg-white/10" />
                  <div className="w-10 h-1.5 rounded bg-white/15" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 8-pointed Moroccan star ─────────────────────────────────────────────────
function MoroccanStar({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 - 90) * Math.PI / 180
    const ri = i % 2 === 0 ? r : r * 0.42
    return `${cx + ri * Math.cos(a)},${cy + ri * Math.sin(a)}`
  }).join(' ')
  return <polygon points={pts} fill="url(#archGold)" opacity="0.90" />
}

// ─── Shell ───────────────────────────────────────────────────────────────────
export function AuthShell({ titleKey, subKey, children }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isRTL = locale === 'ar'

  // Arch geometry (viewBox 420 × 322)
  const AW = 420   // arch SVG width
  const R  = 165   // horseshoe radius
  const cx = 210   // centre x
  const cy = 278   // centre y of the arc circle
  const lx = cx - R   // 45
  const rx = cx + R   // 375
  const openY = Math.round(cy + R * 0.22)  // 314 — where jambs start

  const archPath = `M ${lx} ${openY + 2} L ${lx} ${openY} A ${R} ${R} 0 1 1 ${rx} ${openY} L ${rx} ${openY + 2}`
  const innerR = R - 14
  const innerOpenY = openY + 10
  const innerPath = `M ${lx + 14} ${openY + 2} L ${lx + 14} ${innerOpenY} A ${innerR} ${innerR} 0 1 1 ${rx - 14} ${innerOpenY} L ${rx - 14} ${openY + 2}`

  const jambPct = `${(lx / AW * 100).toFixed(2)}%`  // "10.71%"

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#0A0A0F] dark:bg-[#0A0A0F] light:bg-[#F5F0E8] relative overflow-x-hidden"
      style={{ backgroundColor: mounted && theme === 'light' ? '#F5F0E8' : '#0A0A0F' }}
    >
      {/* ── Morocco map silhouettes – fixed background ───────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Left map — large */}
        <svg
          viewBox="0 0 600 900"
          className="absolute"
          style={{ left: '-6%', top: '2%', width: '38%', maxWidth: 340, opacity: 0.9 }}
          aria-hidden
        >
          <MoroccoSilhouette id="left" />
        </svg>
        {/* Right map — smaller, bottom-right */}
        <svg
          viewBox="0 0 600 900"
          className="absolute"
          style={{ right: '-4%', bottom: '2%', width: '26%', maxWidth: 230, opacity: 0.75 }}
          aria-hidden
        >
          <MoroccoSilhouette id="right" />
        </svg>
        {/* Decorative 4-pointed diamond star — bottom right */}
        <svg
          viewBox="0 0 40 40"
          className="absolute hidden sm:block"
          style={{ right: '12%', bottom: '16%', width: 32, opacity: 0.45 }}
          aria-hidden
        >
          <polygon
            points="20,2 23,17 38,20 23,23 20,38 17,23 2,20 17,17"
            fill="rgba(184,146,42,0.8)"
          />
        </svg>
      </div>

      {/* ── Nav bar ──────────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-3.5"
        style={{ background: 'rgba(10,10,15,0.80)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/" aria-label="Sayerli">
          <Logo size={28} variant="dark" />
        </Link>
        <div className="flex items-center gap-1">
          {LOCALES.map(loc => (
            <button
              key={loc.code}
              onClick={() => setLocale(loc.code as Locale)}
              className={`text-sm px-2 py-1 rounded-lg transition-all ${
                locale === loc.code
                  ? 'bg-amber-900/40 text-amber-400 font-semibold'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {loc.flag}
            </button>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-16 pb-10 px-4">

        {/* ── Arch + form ──────────────────────────────────────────── */}
        <div className="w-full" style={{ maxWidth: AW }}>

          {/* ── Arch top SVG (horseshoe curve + 8-pointed star) ── */}
          <svg
            viewBox={`0 0 ${AW} ${openY + 2}`}
            width="100%"
            style={{ display: 'block', overflow: 'visible' }}
            aria-hidden
          >
            <defs>
              <linearGradient id="archGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#EAC96A" />
                <stop offset="40%"  stopColor="#C49A2E" />
                <stop offset="100%" stopColor="#7A5C14" />
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Outer horseshoe */}
            <path d={archPath} fill="none" stroke="url(#archGold)" strokeWidth="1.8" opacity="0.75" filter="url(#glow)" />
            {/* Inner hairline */}
            <path d={innerPath} fill="none" stroke="url(#archGold)" strokeWidth="0.7" opacity="0.30" />
            {/* Imposta band */}
            <line x1={lx - 12} y1={openY} x2={rx + 12} y2={openY} stroke="url(#archGold)" strokeWidth="0.8" opacity="0.28" />
            {/* 8-pointed star at keystone */}
            <MoroccanStar cx={cx} cy={cy - R - 18} r={13} />
          </svg>

          {/* ── Arch body (jambs + content) ─────────────────────── */}
          <div className="relative" style={{ marginTop: -1 }}>
            {/* Left jamb */}
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none z-[1]"
              style={{
                left: jambPct,
                background: 'linear-gradient(to bottom, #C49A2E 0%, #7A5C14 100%)',
                opacity: 0.68,
              }}
            />
            {/* Left jamb inner hairline */}
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none z-[1]"
              style={{
                left: `calc(${jambPct} + 14px)`,
                background: 'linear-gradient(to bottom, #C49A2E 0%, #7A5C14 100%)',
                opacity: 0.22,
              }}
            />
            {/* Right jamb */}
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none z-[1]"
              style={{
                right: jambPct,
                background: 'linear-gradient(to bottom, #C49A2E 0%, #7A5C14 100%)',
                opacity: 0.68,
              }}
            />
            {/* Right jamb inner hairline */}
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none z-[1]"
              style={{
                right: `calc(${jambPct} + 14px)`,
                background: 'linear-gradient(to bottom, #C49A2E 0%, #7A5C14 100%)',
                opacity: 0.22,
              }}
            />

            {/* Dashboard mockup — blurred background */}
            <DashboardMockup />

            {/* Dark overlay */}
            <div className="absolute inset-0 z-[2]" style={{ background: 'rgba(8,8,12,0.68)' }} />

            {/* Content */}
            <div
              className="relative z-10 text-white"
              style={{ padding: `1.5rem calc(${jambPct} + 1.75rem) 2rem` }}
            >
              {/* Logo + flag */}
              <div className="flex flex-col items-center gap-1 mb-1">
                <Logo size={32} variant="dark" />
                <span className="text-lg">🇲🇦</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl font-black text-white text-center leading-tight mb-1">
                {t(titleKey)}
              </h1>

              {/* Sub */}
              <p
                className="text-center text-sm mb-5"
                style={{ color: '#C49A2E' }}
              >
                {t(subKey)}
              </p>

              {children}
            </div>
          </div>
        </div>

        {/* ── Trust strip ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <span>🔒 {t('auth.trustSSL')}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span>⚡ {t('auth.trust2min')}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span>🇲🇦 {t('auth.trustMaroc')}</span>
        </div>

        {/* Footer */}
        <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {t('footer.copyright')}
        </p>
      </main>
    </div>
  )
}
