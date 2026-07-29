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

// CSS filter chain: turns the green Morocco SVG into burnished gold
const GOLD_FILTER =
  'grayscale(1) sepia(0.90) saturate(7) hue-rotate(12deg) brightness(0.70) contrast(1.15)'

// SVG fractalNoise grain — used as background-image on an overlay div
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"

export function AuthShell({ titleKey, subKey, children }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isRTL  = locale === 'ar'
  const isDark = !mounted || theme === 'dark'
  const bg     = isDark ? '#06060A' : '#F5F0E3'
  const navBg  = isDark ? 'rgba(6,6,10,0.82)' : 'rgba(245,240,227,0.88)'
  const navBrd = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: bg }}
    >

      {/* ── Grain overlay ───────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[3]"
        style={{ backgroundImage: GRAIN_URI, opacity: 0.065, mixBlendMode: 'overlay' }}
      />

      {/* ── Morocco maps — CSS background-image (more reliable than <img>) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

        {/* Left map — large, anchored left */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: '0%',
            width: '48vw',
            height: '100vh',
            backgroundImage: "url('/morocco-maps.svg')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center left',
            filter: GOLD_FILTER,
            opacity: isDark ? 0.72 : 0.55,
          }}
        />

        {/* Right map — medium, anchored bottom-right */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: 0,
            bottom: '0%',
            width: '34vw',
            height: '80vh',
            backgroundImage: "url('/morocco-maps.svg')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center right',
            filter: GOLD_FILTER,
            opacity: isDark ? 0.58 : 0.42,
          }}
        />

        {/* Decorative 4-pointed diamond star */}
        <svg
          aria-hidden
          style={{ position: 'absolute', right: '14%', bottom: '12%', width: 24, opacity: 0.38 }}
          viewBox="0 0 40 40"
        >
          <polygon points="20,2 23,17 38,20 23,23 20,38 17,23 2,20 17,17" fill="#B8922A" />
        </svg>

        {/* Radial vignette — darkens centre for form readability */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? 'radial-gradient(ellipse 56% 74% at 50% 50%, rgba(6,6,10,0) 16%, rgba(6,6,10,0.60) 62%, rgba(6,6,10,0.96) 100%)'
              : 'radial-gradient(ellipse 56% 74% at 50% 50%, rgba(245,240,227,0) 16%, rgba(245,240,227,0.58) 62%, rgba(245,240,227,0.96) 100%)',
          }}
        />
      </div>

      {/* ── Nav bar ─────────────────────────────────────────────────── */}
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
                  : { color: isDark ? 'rgba(255,255,255,0.36)' : 'rgba(0,0,0,0.36)' }
              }
            >
              {loc.flag}
            </button>
          ))}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-all"
              style={{ color: isDark ? 'rgba(255,255,255,0.34)' : 'rgba(0,0,0,0.36)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-16 pb-12 px-4">

        {/* Glass card — replaces the arch as form container */}
        <div
          className="w-full"
          style={{
            maxWidth: 460,
            background: isDark ? 'rgba(6,6,10,0.78)' : 'rgba(245,240,227,0.82)',
            border: `1px solid ${isDark ? 'rgba(184,146,42,0.12)' : 'rgba(184,146,42,0.18)'}`,
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            padding: '2.25rem 2rem 2rem',
          }}
        >
          {/* Logo + flag */}
          <div className="flex flex-col items-center gap-1 mb-4">
            <Logo size={32} variant="dark" />
            <span className="text-lg leading-none">🇲🇦</span>
          </div>

          {/* Display headline — Cormorant Garamond */}
          <h1
            className={isRTL ? '' : serif.className}
            style={{
              fontSize: 'clamp(1.55rem, 4vw, 2.1rem)',
              fontWeight: 700,
              color: '#fff',
              textAlign: 'center',
              lineHeight: 1.18,
              marginBottom: '0.4rem',
            }}
          >
            {t(titleKey)}
          </h1>

          {/* Sub */}
          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#B8922A', marginBottom: '1.5rem' }}>
            {t(subKey)}
          </p>

          {children}
        </div>

        {/* Trust strip */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-5"
          style={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.36)' }}
        >
          <span>🔒 {t('auth.trustSSL')}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>⚡ {t('auth.trust2min')}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>🇲🇦 {t('auth.trustMaroc')}</span>
        </div>

        <p className="mt-4 text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.24)' }}>
          {t('footer.copyright')}
        </p>
      </main>
    </div>
  )
}
