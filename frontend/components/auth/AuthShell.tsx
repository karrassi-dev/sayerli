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
  weight: ['400', '600', '700'],
  display: 'swap',
})

// 8-pointed Rub el Hizb star (48 × 48 tile)
const STAR48 = `M 24,4 L 27.2,16.3 L 38.1,9.9 L 31.7,20.8 L 44,24
  L 31.7,27.2 L 38.1,38.1 L 27.2,31.7 L 24,44
  L 20.8,31.7 L 9.9,38.1 L 16.3,27.2 L 4,24
  L 16.3,20.8 L 9.9,9.9 L 20.8,16.3 Z`

const FEATURES = [
  { icon: '⚡', key: 'feat1' },
  { icon: '🔒', key: 'feat2' },
  { icon: '🇲🇦', key: 'feat3' },
]

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
  const isDark = !mounted || theme === 'dark'

  // Right-panel colours — fully theme-aware
  const rightBg    = isDark ? '#0F0E18' : '#E4DDD0'   // warm tan makes white card pop
  const cardBg     = isDark ? '#1C1B2C' : '#FFFFFF'
  const cardBdr    = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(30,20,10,0.11)'
  const cardShadow = isDark
    ? '0 24px 80px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset'
    : '0 8px 40px rgba(30,20,10,0.14), 0 1px 0 rgba(255,255,255,0.9) inset'
  const subText    = isDark ? 'rgba(245,240,232,0.50)' : 'rgba(26,20,10,0.52)'
  const mainText   = isDark ? '#F5F0E8' : '#1A1206'

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ minHeight: '100vh', display: 'flex', background: rightBg }}
    >

      {/* ═══════════════════════════════════════════════════════════════
          LEFT PANEL — always dark, Moroccan brand identity
      ═══════════════════════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ width: '42%', minHeight: '100vh', background: '#0D0C14', flexShrink: 0 }}
      >
        {/* Zellige geometric tile pattern */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.065 }}
        >
          <defs>
            <pattern id="zl" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d={STAR48} fill="none" stroke="#C49228" strokeWidth="0.7" />
              <line x1="0"  y1="0"  x2="9.9"  y2="9.9"  stroke="#C49228" strokeWidth="0.35" />
              <line x1="48" y1="0"  x2="38.1" y2="9.9"  stroke="#C49228" strokeWidth="0.35" />
              <line x1="0"  y1="48" x2="9.9"  y2="38.1" stroke="#C49228" strokeWidth="0.35" />
              <line x1="48" y1="48" x2="38.1" y2="38.1" stroke="#C49228" strokeWidth="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zl)" />
        </svg>

        {/* Ambient gold orbs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,146,40,0.14) 0%, transparent 68%)',
            top: '-12%', left: '-18%',
          }} />
          <div style={{
            position: 'absolute', width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,146,40,0.09) 0%, transparent 68%)',
            bottom: '8%', right: '-12%',
          }} />
        </div>

        {/* Morocco map — official SVG, tinted gold */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/morocco-maps.svg"
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            width: '88%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.18,
            // Turn green fill → warm gold on dark background
            filter: 'sepia(1) saturate(2.8) hue-rotate(-22deg) brightness(0.82)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />

        {/* Bottom fade */}
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 180,
          background: 'linear-gradient(to bottom, transparent, #0D0C14)',
          pointerEvents: 'none',
        }} />

        {/* Left panel content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12 justify-between">

          {/* Logo */}
          <Logo size={34} variant="dark" />

          {/* Brand text + features */}
          <div>
            <div className="mb-2">
              {/* Small gold label */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(196,146,40,0.12)', border: '1px solid rgba(196,146,40,0.25)',
                borderRadius: 50, padding: '3px 12px', marginBottom: 16,
                color: '#C49228', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C49228', display: 'inline-block' }} />
                SAYERLI · MAROC
              </span>
            </div>

            <h1
              className={serif.className}
              style={{
                color: '#F5F0E8',
                fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
                fontWeight: 700,
                lineHeight: 1.18,
                marginBottom: '0.5rem',
              }}
            >
              {t(titleKey)}
            </h1>

            <p style={{ color: '#C49228', fontSize: '0.85rem', marginBottom: '2.25rem' }}>
              {t(subKey)}
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FEATURES.map(({ icon, key }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(196,146,40,0.10)',
                    border: '1px solid rgba(196,146,40,0.20)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem',
                  }}>
                    {icon}
                  </span>
                  <span style={{ color: 'rgba(245,240,232,0.62)', fontSize: '0.84rem', fontWeight: 500 }}>
                    {t(`auth.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Language selector + copyright */}
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as Locale)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    color: locale === loc.code ? '#C49228' : 'rgba(245,240,232,0.34)',
                    background: locale === loc.code ? 'rgba(196,146,40,0.12)' : 'transparent',
                  }}
                >
                  {loc.flag} {loc.code.toUpperCase()}
                </button>
              ))}
            </div>
            <p style={{ color: 'rgba(245,240,232,0.20)', fontSize: '0.70rem' }}>
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT PANEL — form, theme-aware
      ═══════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col" style={{ background: rightBg, minHeight: '100vh' }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          {/* Mobile: logo */}
          <div className="lg:hidden">
            <Logo size={26} variant={isDark ? 'dark' : 'auto'} />
          </div>
          <div className="hidden lg:block" />

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Language (mobile only) */}
            <div className="flex gap-0.5 lg:hidden">
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as Locale)}
                  style={{
                    padding: '4px 8px', borderRadius: 7, fontSize: '0.75rem',
                    fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    color: locale === loc.code ? '#C49228' : subText,
                    background: locale === loc.code ? 'rgba(196,146,40,0.10)' : 'transparent',
                  }}
                >
                  {loc.flag}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,24,40,0.09)'}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,24,40,0.04)',
                  color: subText, cursor: 'pointer',
                }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile: compact brand header */}
        <div className="lg:hidden text-center px-6 pb-4">
          <h1
            className={serif.className}
            style={{ color: mainText, fontSize: 'clamp(1.65rem, 6vw, 2.1rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.3rem' }}
          >
            {t(titleKey)}
          </h1>
          <p style={{ color: '#C49228', fontSize: '0.78rem' }}>{t(subKey)}</p>
        </div>

        {/* Form area — vertically centred */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          {/* Card */}
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              background: cardBg,
              border: `1px solid ${cardBdr}`,
              borderRadius: 20,
              padding: '1.875rem 2rem 1.75rem',
              boxShadow: cardShadow,
            }}
          >
            {children}
          </div>

          {/* Trust strip */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: 20,
              fontSize: '0.68rem',
              color: subText,
            }}
          >
            <span>🔒 {t('auth.trustSSL')}</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>⚡ {t('auth.trust2min')}</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>🇲🇦 {t('auth.trustMaroc')}</span>
          </div>

          {/* Mobile copyright */}
          <p className="lg:hidden mt-4 text-center" style={{ fontSize: '0.65rem', color: subText, opacity: 0.6 }}>
            {t('footer.copyright')}
          </p>
        </div>
      </main>
    </div>
  )
}
