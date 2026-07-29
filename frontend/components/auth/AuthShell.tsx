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

// ─── Morocco + Western Sahara silhouette ─────────────────────────────────────
// ViewBox 0 0 600 900 — x: -18°W→-1°W, y: 36°N→21°N
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

// ─── Morocco map with topo lines clipped to silhouette ───────────────────────
function MoroccoMap({ uid }: { uid: string }) {
  return (
    <svg
      viewBox="0 0 600 900"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden
    >
      <defs>
        <clipPath id={`mc-${uid}`}>
          <path d={MOROCCO} />
        </clipPath>
      </defs>

      {/* Silhouette fill */}
      <path d={MOROCCO} fill="rgba(184,146,42,0.07)" />

      {/* Topo contour lines — clipped inside Morocco */}
      <g clipPath={`url(#mc-${uid})`}>
        {Array.from({ length: 45 }, (_, i) => {
          const y = i * 21
          const p = i * 0.6
          const inDesert = y > 480
          return (
            <path
              key={i}
              d={`M 0 ${y} Q ${120+Math.sin(p)*28} ${y-9} ${280+Math.cos(p*.9)*18} ${y} Q ${430+Math.sin(p+1)*14} ${y+9} ${600} ${y}`}
              fill="none"
              stroke={`rgba(184,146,42,${inDesert ? 0.30 : 0.55})`}
              strokeWidth={inDesert ? 0.5 : 0.75}
            />
          )
        })}
      </g>

      {/* Outline stroke — the most visible element */}
      <path
        d={MOROCCO}
        fill="none"
        stroke="rgba(196,154,46,0.90)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Horseshoe arch SVG ───────────────────────────────────────────────────────
function ArchDecoration() {
  const W = 500, H = 760
  const R = 200, cx = 250, cy = 332
  const overY = Math.round(cy + R * 0.22)  // 376 — horseshoe over-extension
  const lx = cx - R   // 50
  const rx = cx + R   // 450

  // 8-pointed star at keystone
  const starY = cy - R - 24  // 108
  const starR = 16
  const starPts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 - 90) * Math.PI / 180
    const r = i % 2 === 0 ? starR : starR * 0.42
    return `${cx + r * Math.cos(a)},${starY + r * Math.sin(a)}`
  }).join(' ')

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="pointer-events-none select-none"
      aria-hidden
    >
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#F0D070" />
          <stop offset="40%" stopColor="#C49A2E" />
          <stop offset="100%" stopColor="#7A5C14" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer horseshoe */}
      <path
        d={`M ${lx} ${H} L ${lx} ${overY} A ${R} ${R} 0 1 1 ${rx} ${overY} L ${rx} ${H}`}
        fill="none" stroke="url(#ag)" strokeWidth="2.2" opacity="0.80"
        filter="url(#glow)"
      />
      {/* Inner hairline */}
      <path
        d={`M ${lx+18} ${H} L ${lx+18} ${overY+14} A ${R-18} ${R-18} 0 1 1 ${rx-18} ${overY+14} L ${rx-18} ${H}`}
        fill="none" stroke="url(#ag)" strokeWidth="0.8" opacity="0.28"
      />
      {/* Imposta band */}
      <line x1={lx-14} y1={overY} x2={rx+14} y2={overY}
        stroke="url(#ag)" strokeWidth="1" opacity="0.32" />
      {/* 8-pointed star */}
      <polygon points={starPts} fill="url(#ag)" opacity="0.88" />
    </svg>
  )
}

// ─── Shell ───────────────────────────────────────────────────────────────────
export function AuthShell({ titleKey, subKey, children }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isRTL = locale === 'ar'

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-x-hidden"
      style={{ backgroundColor: '#08080E' }}
    >

      {/* ── Full-page Morocco maps ─────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

        {/* LEFT — large, anchored to left edge, full height */}
        <div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: '44vw',
            height: '100vh',
            minWidth: 280,
          }}
        >
          <MoroccoMap uid="L" />
        </div>

        {/* RIGHT — medium, anchored to right edge, shifted down */}
        <div
          className="absolute"
          style={{
            right: 0,
            top: '8vh',
            width: '32vw',
            height: '92vh',
            minWidth: 200,
          }}
        >
          <MoroccoMap uid="R" />
        </div>

        {/* Decorative small diamond — bottom right area */}
        <svg
          viewBox="0 0 40 40"
          style={{ position: 'absolute', right: '14%', bottom: '12%', width: 28, opacity: 0.5 }}
          aria-hidden
        >
          <polygon points="20,2 23,17 38,20 23,23 20,38 17,23 2,20 17,17" fill="rgba(196,154,46,0.85)" />
        </svg>

        {/* Vignette — keeps centre dark so form is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 58% 80% at 50% 48%, rgba(8,8,14,0.0) 30%, rgba(8,8,14,0.72) 75%, rgba(8,8,14,0.96) 100%)',
        }} />
      </div>

      {/* ── Nav bar ───────────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-3.5"
        style={{
          background: 'rgba(8,8,14,0.75)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
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
                  ? 'font-semibold'
                  : 'opacity-40 hover:opacity-70'
              }`}
              style={locale === loc.code ? { color: '#C49A2E', background: 'rgba(196,154,46,0.12)' } : { color: '#fff' }}
            >
              {loc.flag}
            </button>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-all hover:bg-white/5"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-16 pb-10 px-4">

        {/* Arch + form stack */}
        <div className="relative w-full" style={{ maxWidth: 500 }}>

          {/* Arch — sits behind the form */}
          <div
            className="hidden sm:block absolute left-1/2 z-0"
            style={{ transform: 'translateX(-50%)', top: -28, width: 500 }}
          >
            <ArchDecoration />
          </div>

          {/* Form card */}
          <div className="relative z-10 pt-10 pb-6 px-8 sm:px-14 text-white">

            {/* Logo + flag */}
            <div className="flex flex-col items-center gap-1 mb-3">
              <Logo size={34} variant="dark" />
              <span className="text-xl">🇲🇦</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-black text-white text-center leading-tight mb-1">
              {t(titleKey)}
            </h1>

            {/* Sub */}
            <p className="text-center text-sm mb-6" style={{ color: '#C49A2E' }}>
              {t(subKey)}
            </p>

            {children}
          </div>
        </div>

        {/* Trust strip */}
        <div className="flex items-center gap-3 mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
          <span>🔒 {t('auth.trustSSL')}</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <span>⚡ {t('auth.trust2min')}</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <span>🇲🇦 {t('auth.trustMaroc')}</span>
        </div>

        <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>
          {t('footer.copyright')}
        </p>
      </main>
    </div>
  )
}
