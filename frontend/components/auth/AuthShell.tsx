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

const FEATURES = [
  { emoji: '⚡', key: 'auth.feat1' },
  { emoji: '🔒', key: 'auth.feat2' },
  { emoji: '🇲🇦', key: 'auth.feat3' },
] as const

// ─── Morocco map background ──────────────────────────────────────────────────
// ViewBox 0 0 600 900 maps:
//   x: -18°W (x=0) → -1°W (x=600)   ~35.3 px/°lon
//   y:  36°N (y=0) →  21°N (y=900)   ~60   px/°lat
// Silhouette traces Morocco + Western Sahara (administered territory) clockwise
// from Tangier, along the Mediterranean, down the Algeria border, across the
// Mauritania border, then north along the Atlantic coast back to Tangier.
const MOROCCO_PATH = `
  M 430 12
  C 445 4 460 5 532 46 L 572 55
  L 574 130 L 570 260 L 566 390 L 562 498
  C 545 508 520 520 480 530 L 400 538 L 330 542
  L 328 720 L 328 900 L 32 882
  C 50 840 65 800 74 738
  C 85 700 105 650 124 594
  C 140 560 158 542 169 528
  C 175 512 180 498 182 484
  C 205 465 230 458 244 452
  C 265 440 280 418 286 396
  C 291 374 295 350 296 330
  C 294 310 290 292 288 268
  C 298 248 315 232 332 216
  C 348 200 362 186 368 166
  C 376 150 386 136 393 122
  C 398 114 402 108 404 100
  C 408 88 414 70 420 52
  C 424 34 427 18 430 12 Z
`

function MoroccoMap() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 900"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="desertFade" x1="0" y1="480" x2="0" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#92400E" stopOpacity="0" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0.10" />
        </linearGradient>
      </defs>

      {/* Country silhouette */}
      <path
        d={MOROCCO_PATH}
        className="fill-amber-500/[0.04] dark:fill-amber-400/[0.06] stroke-amber-600/20 dark:stroke-amber-500/25"
        strokeWidth="1"
      />

      {/* Atlas mountain range — wavy contour lines, central-north band */}
      {Array.from({ length: 12 }, (_, i) => {
        const y = 118 + i * 22
        const p = i * 0.72
        return (
          <path
            key={`a${i}`}
            d={`M 162 ${y} Q ${228 + Math.sin(p) * 18} ${y - 7} ${300 + Math.cos(p * 0.9) * 14} ${y} Q ${378 + Math.sin(p + 1) * 12} ${y + 7} ${446 + Math.cos(p) * 10} ${y} Q ${514} ${y - 4} ${562} ${y}`}
            fill="none"
            strokeWidth="0.5"
            className="stroke-amber-700/[0.07] dark:stroke-amber-400/[0.10]"
          />
        )
      })}

      {/* Sahara desert dune ripples — southern band */}
      {Array.from({ length: 22 }, (_, i) => {
        const y = 555 + i * 16
        const p = i * 1.15
        const dx = Math.sin(p) * 28
        return (
          <path
            key={`d${i}`}
            d={`M 10 ${y} Q ${68 + dx} ${y - 8} ${138 + dx * 0.55} ${y} Q ${208 + dx * 0.28} ${y + 8} ${278} ${y} Q ${338 - dx * 0.2} ${y - 5} ${395} ${y}`}
            fill="none"
            strokeWidth="0.4"
            className="stroke-amber-600/[0.08] dark:stroke-amber-400/[0.13]"
          />
        )
      })}

      {/* Desert gradient glow in the south */}
      <rect x="0" y="480" width="600" height="420" fill="url(#desertFade)" />

      {/* Geographic grid — latitude lines */}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`lat${i}`}
          x1="0" y1={i * 112}
          x2="600" y2={i * 112}
          strokeWidth="0.3"
          strokeDasharray="3 10"
          className="stroke-slate-400/[0.09] dark:stroke-slate-300/[0.07]"
        />
      ))}
      {/* Geographic grid — longitude lines */}
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`lon${i}`}
          x1={i * 100} y1="0"
          x2={i * 100} y2="900"
          strokeWidth="0.3"
          strokeDasharray="3 10"
          className="stroke-slate-400/[0.09] dark:stroke-slate-300/[0.07]"
        />
      ))}
    </svg>
  )
}

// ─── Moroccan horseshoe arch ─────────────────────────────────────────────────
// Arche outrepassée: the circular arc extends ~22% past the centre line,
// creating the characteristic "horseshoe" flare before the jambs.
function MoroccanArch() {
  const W = 444
  const H = 690
  const R = 180
  const cx = W / 2
  const cy = 298
  const openY = cy + R * 0.22   // extends past 180°
  const lx = cx - R
  const rx = cx + R

  // 8-pointed star at the keystone
  const starY = cy - R - 28
  const starR = 15
  const starPts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 - 90) * Math.PI / 180
    const r = i % 2 === 0 ? starR : starR * 0.42
    return `${cx + r * Math.cos(a)},${starY + r * Math.sin(a)}`
  }).join(' ')

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="pointer-events-none select-none"
      aria-hidden
    >
      <defs>
        <linearGradient id="archGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#EAC96A" />
          <stop offset="40%"  stopColor="#C49A2E" />
          <stop offset="100%" stopColor="#7A5C14" />
        </linearGradient>
        <filter id="archGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer stroke */}
      <path
        d={`M ${lx} ${H} L ${lx} ${openY} A ${R} ${R} 0 1 1 ${rx} ${openY} L ${rx} ${H}`}
        fill="none"
        stroke="url(#archGold)"
        strokeWidth="1.8"
        opacity="0.68"
        filter="url(#archGlow)"
      />
      {/* Inner hairline (double-border effect) */}
      <path
        d={`M ${lx + 16} ${H} L ${lx + 16} ${openY + 12} A ${R - 16} ${R - 16} 0 1 1 ${rx - 16} ${openY + 12} L ${rx - 16} ${H}`}
        fill="none"
        stroke="url(#archGold)"
        strokeWidth="0.7"
        opacity="0.26"
      />
      {/* Imposta band at spring line */}
      <line
        x1={lx - 10} y1={openY}
        x2={rx + 10} y2={openY}
        stroke="url(#archGold)"
        strokeWidth="0.8"
        opacity="0.28"
      />
      {/* 8-pointed Moroccan star */}
      <polygon points={starPts} fill="url(#archGold)" opacity="0.80" />
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
      className="min-h-screen relative bg-[#F8F6F0] dark:bg-[#07070C]"
    >
      {/* ── Morocco map — fixed, full-viewport background ────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <MoroccoMap />
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#F8F6F0] dark:from-[#07070C] to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F8F6F0] dark:from-[#07070C] to-transparent" />
        {/* Side vignettes */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F8F6F0] dark:from-[#07070C] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F8F6F0] dark:from-[#07070C] to-transparent" />
      </div>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#F8F6F0]/80 dark:bg-[#07070C]/80 backdrop-blur-sm border-b border-slate-200/40 dark:border-white/[0.05]">
        <Link href="/" aria-label="Sayerli">
          <Logo size={30} />
        </Link>
        <div className="flex items-center gap-1.5">
          {LOCALES.map(loc => (
            <button
              key={loc.code}
              onClick={() => setLocale(loc.code as Locale)}
              className={`text-sm px-2 py-1 rounded-lg transition-all ${
                locale === loc.code
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {loc.flag}
            </button>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="relative z-10 min-h-screen flex justify-center items-start pt-20 pb-16 px-4">
        <div className="w-full max-w-md">

          {/* Arch sits behind the form on sm+ screens */}
          <div className="relative">
            <div className="hidden sm:block absolute -top-10 left-1/2 -translate-x-1/2 z-0">
              <MoroccanArch />
            </div>

            {/* Form content */}
            <div className="relative z-10">
              {/* Logo + heading */}
              <div className="text-center mb-7 mt-1">
                <div className="flex justify-center mb-5">
                  <Logo size={36} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1.5">
                  {t(titleKey)}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t(subKey)}
                </p>
              </div>

              {/* Trust feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {FEATURES.map(({ emoji, key }) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40"
                  >
                    <span>{emoji}</span>
                    <span>{t(key)}</span>
                  </span>
                ))}
              </div>

              {children}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-slate-400 dark:text-slate-600">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
