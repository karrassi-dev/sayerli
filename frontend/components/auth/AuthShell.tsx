'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { LOCALES, type Locale } from '@/lib/i18n'
import { Logo } from '@/components/ui/LogoMark'
import { MoroccoMap } from './MoroccoMap'

const FEATURES = [
  { tKey: 'auth.leftFeat1Title', subKey: 'auth.leftFeat1Sub', icon: '⚡' },
  { tKey: 'auth.leftFeat2Title', subKey: 'auth.leftFeat2Sub', icon: '🇲🇦' },
  { tKey: 'auth.leftFeat3Title', subKey: 'auth.leftFeat3Sub', icon: '🔒' },
]

interface AuthShellProps {
  titleKey:   string
  subKey:     string
  children:   React.ReactNode
  isRegister?: boolean
}

export function AuthShell({ children, isRegister }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme }      = useTheme()
  const [mounted, setMounted]    = useState(false)
  useEffect(() => setMounted(true), [])

  const isRTL  = locale === 'ar'
  const isDark = !mounted || theme === 'dark'

  // ── Left panel ─────────────────────────────────────────────────────
  const leftBg = isDark
    ? 'linear-gradient(160deg, #0a0a0f 0%, #0d1117 50%, #0f172a 100%)'
    : 'linear-gradient(160deg, #f8fafc 0%, #eef2ff 60%, #e0e7ff 100%)'

  const leftText    = isDark ? '#f1f5f9'                    : '#1e1b4b'
  const leftSub     = isDark ? 'rgba(165,180,252,0.75)'     : 'rgba(79,70,229,0.65)'
  const leftFeatTx  = isDark ? 'rgba(241,245,249,0.88)'     : '#1e1b4b'
  const leftFeatSx  = isDark ? 'rgba(165,180,252,0.55)'     : 'rgba(79,70,229,0.55)'
  const leftIconBg  = isDark ? 'rgba(99,102,241,0.12)'      : 'rgba(99,102,241,0.08)'
  const leftIconBdr = isDark ? 'rgba(99,102,241,0.22)'      : 'rgba(99,102,241,0.18)'
  const leftGridCol = isDark ? 'rgba(99,102,241,0.05)'      : 'rgba(99,102,241,0.06)'
  const cardGlass   = isDark ? 'rgba(255,255,255,0.04)'     : 'rgba(255,255,255,0.70)'
  const cardGlassBd = isDark ? 'rgba(255,255,255,0.08)'     : 'rgba(99,102,241,0.15)'
  const langActBg   = isDark ? 'rgba(99,102,241,0.14)'      : 'rgba(99,102,241,0.10)'
  const langActClr  = isDark ? '#a5b4fc'                    : '#4f46e5'
  const langIdleClr = isDark ? 'rgba(241,245,249,0.34)'     : 'rgba(79,70,229,0.40)'

  // ── Right panel ────────────────────────────────────────────────────
  const rightBg    = isDark ? '#0a0a0f'                    : '#f8fafc'
  const cardBg     = isDark ? '#0f172a'                    : '#ffffff'
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)'     : 'rgba(99,102,241,0.10)'
  const cardShadow = isDark
    ? '0 24px 80px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset'
    : '0 8px 48px rgba(79,70,229,0.10), 0 1px 0 rgba(255,255,255,0.9) inset'
  const textSub    = isDark ? 'rgba(148,163,184,0.85)'     : 'rgba(71,85,105,0.75)'
  const btnBorder  = isDark ? 'rgba(255,255,255,0.09)'     : 'rgba(99,102,241,0.12)'
  const linkColor  = isDark ? '#818cf8'                    : '#4f46e5'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>

      {/* ══════════════════════ LEFT PANEL ══════════════════════ */}
      <motion.aside
        initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col relative overflow-hidden"
        style={{ width: '45%', minHeight: '100vh', background: leftBg, flexShrink: 0 }}
      >
        {/* Dot grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${leftGridCol} 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        {/* Top vignette */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 pointer-events-none"
          style={{ background: isDark ? 'linear-gradient(to bottom, rgba(10,10,15,0.85), transparent)' : 'linear-gradient(to bottom, rgba(248,250,252,0.85), transparent)' }}
        />
        {/* Bottom vignette */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{ background: isDark ? 'linear-gradient(to top, rgba(10,10,15,0.85), transparent)' : 'linear-gradient(to top, rgba(224,231,255,0.85), transparent)' }}
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12" style={{ minHeight: '100vh' }}>
          <Logo size={30} variant={isDark ? 'dark' : 'auto'} />

          {/* Morocco map */}
          <div className="flex-1 flex items-center justify-center py-6">
            <div style={{ width: '100%', maxWidth: 340, aspectRatio: '300/420' }}>
              <MoroccoMap />
            </div>
          </div>

          {/* Hero copy */}
          <div className="mb-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-bold mb-2"
              style={{ color: leftText, fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', lineHeight: 1.25 }}
            >
              {t('auth.leftHero')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ color: leftSub, fontSize: '0.82rem', lineHeight: 1.6 }}
            >
              {t('auth.leftSubHero')}
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              {FEATURES.map(({ tKey, subKey, icon }, i) => (
                <motion.div
                  key={tKey}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 + i * 0.1, duration: 0.45 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <span style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: leftIconBg, border: `1px solid ${leftIconBdr}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem',
                  }}>
                    {icon}
                  </span>
                  <div>
                    <p style={{ color: leftFeatTx, fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3 }}>
                      {t(tKey)}
                    </p>
                    <p style={{ color: leftFeatSx, fontSize: '0.73rem', lineHeight: 1.4 }}>
                      {t(subKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Made-in-Morocco glass card + language */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
                background: cardGlass, border: `1px solid ${cardGlassBd}`,
                borderRadius: 16, padding: '12px 16px', backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ fontSize: '1.35rem' }}>🇲🇦</span>
              <div>
                <p style={{ color: leftFeatTx, fontSize: '0.80rem', fontWeight: 600, lineHeight: 1.2 }}>
                  {t('auth.leftCard')}
                </p>
                <p style={{ color: leftFeatSx, fontSize: '0.70rem', lineHeight: 1.4 }}>
                  {t('auth.leftCardSub')}
                </p>
              </div>
            </motion.div>

            <div style={{ display: 'flex', gap: 4 }}>
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as Locale)}
                  style={{
                    padding: '5px 11px', borderRadius: 8,
                    fontSize: '0.76rem', fontWeight: 500,
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    color: locale === loc.code ? langActClr : langIdleClr,
                    background: locale === loc.code ? langActBg : 'transparent',
                  }}
                >
                  {loc.flag} {loc.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* ══════════════════════ RIGHT PANEL ══════════════════════ */}
      <main
        className="flex-1 flex flex-col"
        style={{ background: rightBg, minHeight: '100vh', overflowY: 'auto' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 shrink-0">
          <div className="lg:hidden">
            <Logo size={26} variant={isDark ? 'dark' : 'auto'} />
          </div>
          <div className="hidden lg:block" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', color: textSub }} className="hidden sm:inline">
              {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}
            </span>
            <Link
              href={isRegister ? '/login' : '/register'}
              className="text-sm font-semibold hover:underline hidden sm:inline"
              style={{ color: linkColor }}
            >
              {isRegister ? `${t('auth.signIn')} →` : `${t('auth.signUp')} →`}
            </Link>

            <div className="hidden sm:block w-px h-4 mx-1" style={{ background: btnBorder }} />

            <div className="flex gap-0.5 lg:hidden">
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as Locale)}
                  style={{
                    padding: '4px 8px', borderRadius: 7,
                    fontSize: '0.75rem', fontWeight: 500,
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    color: locale === loc.code ? '#4f46e5' : textSub,
                    background: locale === loc.code ? 'rgba(99,102,241,0.10)' : 'transparent',
                  }}
                >
                  {loc.flag}
                </button>
              ))}
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${btnBorder}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.06)',
                  color: textSub, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Form centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            style={{
              width: '100%', maxWidth: 520,
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: 24,
              padding: '1.875rem 2rem 1.75rem',
              boxShadow: cardShadow,
            }}
          >
            {children}
          </motion.div>

          <p className="mt-6 text-center" style={{ fontSize: '0.65rem', color: textSub, opacity: 0.55 }}>
            © {new Date().getFullYear()} Sayerli · Tous droits réservés
          </p>
        </div>
      </main>
    </div>
  )
}
