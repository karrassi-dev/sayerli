'use client'

import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { LOCALES, type Locale } from '@/lib/i18n'
import { Logo } from '@/components/ui/LogoMark'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
})

interface AuthShellProps {
  titleKey: string
  subKey: string
  children: React.ReactNode
}

// ─── Arch geometry ────────────────────────────────────────────────────────────
const AW     = 500               // arch SVG width
const R      = 195               // horseshoe radius
const CX     = 250               // centre x
const CY     = 298               // arc circle centre y
const OPEN_Y = Math.round(CY + R * 0.22)  // ~341 — where jambs start
const LX     = CX - R           // 55
const RX     = CX + R           // 445
const JMAIN  = `${(LX / AW * 100).toFixed(2)}%`            // "11.00%"
const JINNER = `${((LX + 18) / AW * 100).toFixed(2)}%`     // "14.60%"

// ─── Grain noise overlay (SVG fractalNoise) ───────────────────────────────────
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

// ─── Morocco map (real SVG from /public, tinted gold via CSS filter) ──────────
// Filter recipe: grayscale → sepia → saturate → hue-rotate → darken
const GOLD_FILTER = 'grayscale(1) sepia(0.90) saturate(7) hue-rotate(12deg) brightness(0.70) contrast(1.15)'

function MoroccoImg({ style }: { style: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/morocco-maps.svg"
      alt=""
      aria-hidden
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
        filter: GOLD_FILTER,
        opacity: 0.70,
        ...style,
      }}
    />
  )
}

// ─── Smoked-glass dashboard preview (blurred, tilted) ────────────────────────
function DashboardPreview() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div style={{ transform: 'rotate(4deg) scale(1.16)', transformOrigin: 'center', filter: 'blur(9px)', opacity: 0.28, width: '100%', height: '100%' }}>
        {/* App header */}
        <div style={{ height: 36, background: 'rgba(20,20,30,0.95)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ width: 64, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.18)' }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(13,148,136,0.45)' }} />
        </div>
        <div style={{ display: 'flex', height: '100%' }}>
          {/* Sidebar */}
          <div style={{ width: 118, background: 'rgba(10,10,18,0.97)', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 5, borderRight: '1px solid rgba(255,255,255,0.04)' }}>
            {[1, 0, 0, 0, 0].map((active, i) => (
              <div key={i} style={{ height: 30, borderRadius: 7, padding: '0 10px', display: 'flex', alignItems: 'center', background: active ? 'rgba(13,148,136,0.18)' : 'transparent' }}>
                <div style={{ width: active ? 48 : 32, height: 6, borderRadius: 3, background: active ? 'rgba(13,148,136,0.55)' : 'rgba(255,255,255,0.10)' }} />
              </div>
            ))}
          </div>
          {/* Content */}
          <div style={{ flex: 1, background: 'rgba(6,6,10,0.99)', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ width: 38, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.10)', marginBottom: 7 }} />
                  <div style={{ width: 56, height: 11, borderRadius: 3, background: 'rgba(255,255,255,0.20)' }} />
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px', flex: 1, display: 'flex', alignItems: 'flex-end', gap: 5 }}>
              {[42, 62, 34, 82, 55, 92, 47, 72, 66, 88, 50, 78].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0', background: 'rgba(13,148,136,0.48)' }} />
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.09)' }} />
                  <div style={{ width: 40, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.14)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Arch top SVG (horseshoe curve + 8-pointed keystone star) ────────────────
function ArchTop() {
  const starY = CY - R - 22
  const sR = 14
  const starPts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 - 90) * Math.PI / 180
    const r = i % 2 === 0 ? sR : sR * 0.42
    return `${CX + r * Math.cos(a)},${starY + r * Math.sin(a)}`
  }).join(' ')

  const outerD = `M ${LX} ${OPEN_Y + 1} L ${LX} ${OPEN_Y} A ${R} ${R} 0 1 1 ${RX} ${OPEN_Y} L ${RX} ${OPEN_Y + 1}`
  const iR = R - 18
  const innerD = `M ${LX + 18} ${OPEN_Y + 1} L ${LX + 18} ${OPEN_Y + 14} A ${iR} ${iR} 0 1 1 ${RX - 18} ${OPEN_Y + 14} L ${RX - 18} ${OPEN_Y + 1}`

  return (
    <svg
      viewBox={`0 0 ${AW} ${OPEN_Y + 1}`}
      width="100%"
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#EAC85A" />
          <stop offset="40%" stopColor="#B8922A" />
          <stop offset="100%" stopColor="#7A5C14" />
        </linearGradient>
        <filter id="ag-glow" x="-28%" y="-28%" width="156%" height="156%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer horseshoe stroke */}
      <path d={outerD} fill="none" stroke="url(#ag)" strokeWidth="2" opacity="0.90" filter="url(#ag-glow)" />
      {/* Inner hairline */}
      <path d={innerD} fill="none" stroke="url(#ag)" strokeWidth="0.8" opacity="0.30" />
      {/* Imposta band */}
      <line x1={LX - 16} y1={OPEN_Y} x2={RX + 16} y2={OPEN_Y} stroke="url(#ag)" strokeWidth="1.1" opacity="0.34" />
      {/* 8-pointed Moroccan star */}
      <polygon points={starPts} fill="url(#ag)" opacity="0.94" />
    </svg>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────
export function AuthShell({ titleKey, subKey, children }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isRTL  = locale === 'ar'
  const isDark = !mounted || theme === 'dark'
  const bg     = isDark ? '#06060A' : '#F5F0E3'
  const navBg  = isDark ? 'rgba(6,6,10,0.80)' : 'rgba(245,240,227,0.85)'
  const navBrd = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: bg }}
    >
      {/* ── Grain texture ─────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{ backgroundImage: GRAIN, opacity: 0.065, mixBlendMode: 'overlay' }}
      />

      {/* ── Morocco maps (fixed background) ───────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

        {/* Left — large, anchored left */}
        <div style={{ position: 'absolute', left: 0, top: '2%', width: '46vw', height: '96vh' }}>
          <MoroccoImg style={{}} />
        </div>

        {/* Right — medium, anchored bottom-right */}
        <div style={{ position: 'absolute', right: 0, bottom: '2%', width: '33vw', height: '78vh' }}>
          <MoroccoImg style={{}} />
        </div>

        {/* Decorative 4-pointed diamond */}
        <svg
          style={{ position: 'absolute', right: '13%', bottom: '13%', width: 26, opacity: 0.42 }}
          viewBox="0 0 40 40" aria-hidden
        >
          <polygon points="20,2 23,17 38,20 23,23 20,38 17,23 2,20 17,17" fill="#B8922A" />
        </svg>

        {/* Radial vignette keeps centre dark → arch is focal point */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'radial-gradient(ellipse 54% 72% at 50% 50%, rgba(6,6,10,0) 18%, rgba(6,6,10,0.62) 66%, rgba(6,6,10,0.96) 100%)'
            : 'radial-gradient(ellipse 54% 72% at 50% 50%, rgba(245,240,227,0) 18%, rgba(245,240,227,0.60) 66%, rgba(245,240,227,0.95) 100%)',
        }} />
      </div>

      {/* ── Nav bar ───────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 sm:px-8 py-3.5"
        style={{ background: navBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${navBrd}` }}
      >
        <Link href="/" aria-label="Sayerli">
          <Logo size={28} variant={isDark ? 'dark' : 'auto'} />
        </Link>
        <div className="flex items-center gap-1">
          {LOCALES.map(loc => (
            <button
              key={loc.code}
              onClick={() => setLocale(loc.code as Locale)}
              className="text-sm px-2 py-1 rounded-lg transition-all font-medium"
              style={
                locale === loc.code
                  ? { color: '#B8922A', background: 'rgba(184,146,42,0.10)' }
                  : { color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)' }
              }
            >
              {loc.flag}
            </button>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-all"
              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.38)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────── */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-14 pb-10 px-3 sm:px-4">

        {/* Arch + form — max 500px on desktop, 94vw on mobile */}
        <div className="w-full" style={{ maxWidth: AW }}>

          {/* Arch top curve */}
          <ArchTop />

          {/* Arch body: jambs + dashboard preview + form */}
          <div className="relative" style={{ marginTop: -1 }}>

            {/* Outer left jamb */}
            <div style={{ position: 'absolute', left: JMAIN, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #C49A2E 0%, rgba(184,146,42,0.15) 100%)', opacity: 0.88 }} />
            {/* Inner left hairline */}
            <div style={{ position: 'absolute', left: JINNER, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, #C49A2E 0%, rgba(184,146,42,0.08) 100%)', opacity: 0.28 }} />
            {/* Outer right jamb */}
            <div style={{ position: 'absolute', right: JMAIN, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #C49A2E 0%, rgba(184,146,42,0.15) 100%)', opacity: 0.88 }} />
            {/* Inner right hairline */}
            <div style={{ position: 'absolute', right: JINNER, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, #C49A2E 0%, rgba(184,146,42,0.08) 100%)', opacity: 0.28 }} />

            {/* Smoked dashboard preview (always dark for legibility) */}
            <DashboardPreview />

            {/* Dark overlay — arch interior is always dark */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,10,0.74)' }} />

            {/* Form content */}
            <div
              className="relative"
              style={{
                zIndex: 10,
                padding: `2rem calc(${JMAIN} + 18px) 2.5rem`,
              }}
            >
              {/* Logo + flag */}
              <div className="flex flex-col items-center gap-1 mb-3">
                <Logo size={32} variant="dark" />
                <span className="text-lg leading-none">🇲🇦</span>
              </div>

              {/* Display headline — Cormorant Garamond serif */}
              <h1
                className={isRTL ? '' : serif.className}
                style={{
                  fontSize: 'clamp(1.55rem, 3.8vw, 2.15rem)',
                  fontWeight: 700,
                  color: '#fff',
                  textAlign: 'center',
                  lineHeight: 1.18,
                  marginBottom: '0.45rem',
                  fontFamily: isRTL ? 'inherit' : undefined,
                }}
              >
                {t(titleKey)}
              </h1>

              {/* Sub headline */}
              <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#B8922A', marginBottom: '1.5rem' }}>
                {t(subKey)}
              </p>

              {children}
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-5"
          style={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.38)' }}
        >
          <span>🔒 {t('auth.trustSSL')}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>⚡ {t('auth.trust2min')}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>🇲🇦 {t('auth.trustMaroc')}</span>
        </div>

        <p className="mt-4 text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.26)' }}>
          {t('footer.copyright')}
        </p>
      </main>
    </div>
  )
}
