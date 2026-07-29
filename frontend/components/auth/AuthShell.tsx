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

const MOROCCO = `M 430 12 C 445 4 460 5 532 46 L 572 55 L 574 130 L 570 260
  L 566 390 L 562 498 C 545 508 520 520 480 530 L 400 538 L 330 542
  L 328 720 L 328 900 L 32 882 C 50 840 65 800 74 738
  C 85 700 105 650 124 594 C 140 560 158 542 169 528
  C 175 512 180 498 182 484 C 205 465 230 458 244 452
  C 265 440 280 418 286 396 C 291 374 295 350 296 330
  C 294 310 290 292 288 268 C 298 248 315 232 332 216
  C 348 200 362 186 368 166 C 376 150 386 136 393 122
  C 398 114 402 108 404 100 C 408 88 414 70 420 52
  C 424 34 427 18 430 12 Z`

function MoroccoSVG({ uid, w, h }: { uid: string; w: number; h: number }) {
  return (
    <svg viewBox="0 0 600 900" width={w} height={h} aria-hidden style={{ display: 'block' }}>
      <defs>
        <clipPath id={`cl${uid}`}><path d={MOROCCO} /></clipPath>
      </defs>
      <path d={MOROCCO} fill="rgba(184,146,42,0.05)" />
      <g clipPath={`url(#cl${uid})`}>
        {Array.from({ length: 42 }, (_, i) => {
          const y = i * 22
          const p = i * 0.62
          const desert = y > 460
          return (
            <path key={i}
              d={`M 0 ${y} Q ${140 + Math.sin(p) * 26} ${y - 8} ${295 + Math.cos(p * .9) * 16} ${y} Q ${445 + Math.sin(p + 1) * 13} ${y + 8} ${600} ${y}`}
              fill="none"
              stroke={`rgba(184,146,42,${desert ? 0.22 : 0.45})`}
              strokeWidth={desert ? 0.5 : 0.7}
            />
          )
        })}
      </g>
      <path d={MOROCCO} fill="none" stroke="rgba(196,154,46,0.80)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// Arch SVG viewBox: 620 × 280
// Outer arch: straight sides + pointed Moroccan curve to apex
const OUTER = `M 2 280 L 2 155 C 2 65 128 4 310 1 C 492 4 618 65 618 155 L 618 280`
const INNER = `M 16 280 L 16 159 C 16 74 134 18 310 15 C 486 18 604 74 604 159 L 604 280`

// 8-pointed star (proper Rub el Hizb style)
const STAR = `M 0,-12 L 1.9,-4.6 L 8.5,-8.5 L 4.6,-1.9 L 12,0 L 4.6,1.9 L 8.5,8.5 L 1.9,4.6 L 0,12 L -1.9,4.6 L -8.5,8.5 L -4.6,1.9 L -12,0 L -4.6,-1.9 L -8.5,-8.5 L -1.9,-4.6 Z`

interface AuthShellProps {
  titleKey: string
  subKey: string
  children: React.ReactNode
}

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
      style={{ background: '#080808' }}
    >
      {/* Morocco maps — fixed background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', left: -30, top: '50%', transform: 'translateY(-48%)', opacity: 0.72 }}>
          <MoroccoSVG uid="L" w={290} h={435} />
        </div>
        <div style={{ position: 'absolute', right: -20, bottom: '4%', opacity: 0.58 }}>
          <MoroccoSVG uid="R" w={230} h={345} />
        </div>
        {/* Diamond accent */}
        <svg aria-hidden style={{ position: 'absolute', right: '11%', bottom: '7%', width: 22, opacity: 0.28 }} viewBox="0 0 40 40">
          <polygon points="20,2 23,17 38,20 23,23 20,38 17,23 2,20 17,17" fill="#B8922A" />
        </svg>
      </div>

      {/* Nav bar */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 sm:px-8 py-3.5"
        style={{ background: 'rgba(8,8,8,0.82)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/" aria-label="Sayerli">
          <Logo size={28} variant="dark" />
        </Link>
        <div className="flex items-center gap-1">
          {LOCALES.map(loc => (
            <button
              key={loc.code}
              onClick={() => setLocale(loc.code as Locale)}
              className="text-sm px-2 py-1 rounded-lg transition-all font-medium"
              style={locale === loc.code
                ? { color: '#B8922A', background: 'rgba(184,146,42,0.10)' }
                : { color: 'rgba(255,255,255,0.36)' }}
            >
              {loc.flag}
            </button>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.34)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-col items-center justify-start pt-14 pb-10 min-h-screen px-3 sm:px-4">

        {/* ── Arch container ──────────────────────────────────────────── */}
        <div className="w-full relative" style={{ maxWidth: 620 }}>

          {/* TOP: Arch curve SVG (the pointed Moroccan arch top) */}
          <svg
            viewBox="0 0 620 280"
            preserveAspectRatio="xMidYMax meet"
            style={{ width: '100%', display: 'block', pointerEvents: 'none', marginBottom: -1 }}
            aria-hidden
          >
            {/* Outer glow */}
            <path d={OUTER} fill="none" stroke="rgba(184,146,42,0.18)" strokeWidth="10" strokeLinecap="round" />
            {/* Main arch border */}
            <path d={OUTER} fill="none" stroke="rgba(196,154,46,0.88)" strokeWidth="1.6" />
            {/* Inner double line */}
            <path d={INNER} fill="none" stroke="rgba(184,146,42,0.25)" strokeWidth="0.8" />

            {/* Small corner dots where arch meets sides */}
            <circle cx="2" cy="272" r="2.5" fill="none" stroke="rgba(196,154,46,0.55)" strokeWidth="0.8" />
            <circle cx="618" cy="272" r="2.5" fill="none" stroke="rgba(196,154,46,0.55)" strokeWidth="0.8" />
            <circle cx="16" cy="272" r="2" fill="none" stroke="rgba(184,146,42,0.25)" strokeWidth="0.6" />
            <circle cx="604" cy="272" r="2" fill="none" stroke="rgba(184,146,42,0.25)" strokeWidth="0.6" />

            {/* 8-pointed star at arch apex */}
            <g transform="translate(310, -1)">
              <circle r="17" fill="#080808" />
              <path d={STAR} fill="#C4962E" />
              <circle r="21" fill="none" stroke="rgba(196,154,46,0.42)" strokeWidth="0.8" />
            </g>
          </svg>

          {/* MIDDLE: Content with gold side borders */}
          <div style={{
            borderLeft: '1.6px solid rgba(196,154,46,0.88)',
            borderRight: '1.6px solid rgba(196,154,46,0.88)',
            padding: '1.5rem 2rem 2rem',
          }}>
            {/* Logo + flag */}
            <div className="flex flex-col items-center gap-1 mb-1">
              <Logo size={30} variant="dark" />
              <span className="text-base leading-none">🇲🇦</span>
            </div>

            {/* Serif headline */}
            <h1
              className={`${serif.className} text-center text-white`}
              style={{
                fontSize: 'clamp(1.85rem, 5vw, 2.7rem)',
                fontWeight: 700,
                lineHeight: 1.18,
                marginBottom: '0.35rem',
                marginTop: '0.75rem',
              }}
            >
              {t(titleKey)}
            </h1>

            {/* Gold subtitle */}
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#B8922A', marginBottom: '1.5rem' }}>
              {t(subKey)}
            </p>

            {/* Form */}
            {children}

            {/* Trust strip */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 mt-5"
              style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.30)' }}
            >
              <span>🔒 {t('auth.trustSSL')}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>⚡ {t('auth.trust2min')}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>🇲🇦 {t('auth.trustMaroc')}</span>
            </div>
          </div>

          {/* BOTTOM: closing bar */}
          <div style={{
            height: 22,
            borderLeft: '1.6px solid rgba(196,154,46,0.88)',
            borderRight: '1.6px solid rgba(196,154,46,0.88)',
            borderBottom: '1.6px solid rgba(196,154,46,0.88)',
          }} />
        </div>

        <p className="mt-5 text-xs text-center" style={{ color: 'rgba(255,255,255,0.14)' }}>
          {t('footer.copyright')}
        </p>
      </main>
    </div>
  )
}
