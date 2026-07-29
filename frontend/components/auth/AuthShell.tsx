'use client'

import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { LOCALES, type Locale } from '@/lib/i18n'
import { Logo } from '@/components/ui/LogoMark'

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

interface AuthShellProps {
  titleKey: string
  subKey: string
  children: React.ReactNode
}

// ─── Morocco + Western Sahara silhouette (viewBox 0 0 600 900) ───────────────
const M = `M 430 12 C 445 4 460 5 532 46 L 572 55 L 574 130 L 570 260
  L 566 390 L 562 498 C 545 508 520 520 480 530 L 400 538 L 330 542
  L 328 720 L 328 900 L 32 882 C 50 840 65 800 74 738
  C 85 700 105 650 124 594 C 140 560 158 542 169 528
  C 175 512 180 498 182 484 C 205 465 230 458 244 452
  C 265 440 280 418 286 396 C 291 374 295 350 296 330
  C 294 310 290 292 288 268 C 298 248 315 232 332 216
  C 348 200 362 186 368 166 C 376 150 386 136 393 122
  C 398 114 402 108 404 100 C 408 88 414 70 420 52
  C 424 34 427 18 430 12 Z`

// Inline SVG Morocco with topo lines — uid prevents clipPath ID conflicts
function MoroccoSVG({ uid, w, h }: { uid: string; w: number; h: number }) {
  return (
    <svg viewBox="0 0 600 900" width={w} height={h} aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <clipPath id={`cl${uid}`}><path d={M} /></clipPath>
      </defs>

      {/* Subtle fill */}
      <path d={M} fill="rgba(184,146,42,0.07)" />

      {/* Topo contour lines clipped to silhouette */}
      <g clipPath={`url(#cl${uid})`}>
        {Array.from({ length: 42 }, (_, i) => {
          const y   = i * 22
          const p   = i * 0.62
          const desert = y > 460
          return (
            <path
              key={i}
              d={`M 0 ${y} Q ${140 + Math.sin(p) * 26} ${y - 8} ${295 + Math.cos(p * .9) * 16} ${y} Q ${445 + Math.sin(p + 1) * 13} ${y + 8} ${600} ${y}`}
              fill="none"
              stroke={`rgba(184,146,42,${desert ? 0.28 : 0.52})`}
              strokeWidth={desert ? 0.5 : 0.75}
            />
          )
        })}
      </g>

      {/* Country outline — the most prominent element */}
      <path d={M} fill="none" stroke="rgba(196,154,46,0.85)" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

// Grain noise overlay
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export function AuthShell({ titleKey, subKey, children }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isRTL  = locale === 'ar'
  const isDark = !mounted || theme === 'dark'

  // ── Theme tokens ─────────────────────────────────────────────────────────
  const pageBg   = isDark ? '#06060A' : '#F6F1E7'
  const navBg    = isDark ? 'rgba(6,6,10,0.82)'      : 'rgba(246,241,231,0.88)'
  const navBrd   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const mapAlpha = isDark ? 0.72 : 0.60

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: pageBg }}
    >

      {/* ── Grain overlay ─────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[3]"
        style={{ backgroundImage: GRAIN, opacity: 0.06, mixBlendMode: 'overlay' }}
      />

      {/* ── Morocco silhouettes — inline SVG, fixed background ────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

        {/* Left map — medium, vertically centered, bleeds off left edge */}
        <div style={{
          position: 'absolute',
          left: -30,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: mapAlpha,
        }}>
          <MoroccoSVG uid="L" w={240} h={360} />
        </div>

        {/* Right map — slightly smaller, bottom-right */}
        <div style={{
          position: 'absolute',
          right: -20,
          bottom: '6%',
          opacity: mapAlpha * 0.85,
        }}>
          <MoroccoSVG uid="R" w={190} h={285} />
        </div>

        {/* Decorative 4-point diamond */}
        <svg aria-hidden style={{ position: 'absolute', right: '15%', bottom: '14%', width: 22, opacity: 0.36 }} viewBox="0 0 40 40">
          <polygon points="20,2 23,17 38,20 23,23 20,38 17,23 2,20 17,17" fill="#B8922A" />
        </svg>

        {/* Radial vignette keeps centre readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'radial-gradient(ellipse 60% 76% at 50% 50%, rgba(6,6,10,0) 14%, rgba(6,6,10,0.55) 58%, rgba(6,6,10,0.96) 100%)'
            : 'radial-gradient(ellipse 60% 76% at 50% 50%, rgba(246,241,231,0) 14%, rgba(246,241,231,0.52) 58%, rgba(246,241,231,0.97) 100%)',
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
              style={locale === loc.code
                ? { color: '#B8922A', background: 'rgba(184,146,42,0.10)' }
                : { color: isDark ? 'rgba(255,255,255,0.36)' : 'rgba(0,0,0,0.38)' }}
            >
              {loc.flag}
            </button>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-all"
              style={{ color: isDark ? 'rgba(255,255,255,0.34)' : 'rgba(0,0,0,0.38)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────── */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-16 pb-12 px-4">

        {/* Form card — always dark so text is always white/legible */}
        <div
          className="w-full"
          style={{
            maxWidth: 440,
            background: 'rgba(8,8,14,0.92)',
            borderTop: '2px solid rgba(184,146,42,0.55)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderTopColor: 'rgba(184,146,42,0.55)',
            backdropFilter: 'blur(28px)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Card inner */}
          <div style={{ padding: '2.25rem 2rem 2rem' }}>

            {/* Logo + flag */}
            <div className="flex flex-col items-center gap-1 mb-4">
              <Logo size={30} variant="dark" />
              <span className="text-base leading-none">🇲🇦</span>
            </div>

            {/* Serif headline */}
            <h1
              className={isRTL ? 'text-center text-white' : `${serif.className} text-center text-white`}
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.35rem' }}
            >
              {t(titleKey)}
            </h1>

            {/* Gold sub */}
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#B8922A', marginBottom: '1.75rem' }}>
              {t(subKey)}
            </p>

            {/* Thin gold divider */}
            <div style={{ height: 1, background: 'rgba(184,146,42,0.15)', marginBottom: '1.5rem' }} />

            {children}
          </div>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5"
          style={{ fontSize: '0.72rem', color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.38)' }}>
          <span>🔒 {t('auth.trustSSL')}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>⚡ {t('auth.trust2min')}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>🇲🇦 {t('auth.trustMaroc')}</span>
        </div>

        <p className="mt-3 text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.24)' }}>
          {t('footer.copyright')}
        </p>
      </main>
    </div>
  )
}
