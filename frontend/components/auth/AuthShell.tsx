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
  titleKey: string
  subKey:   string
  children: React.ReactNode
  /** True on register page — shows "Se connecter" in top bar */
  isRegister?: boolean
}

export function AuthShell({ children, isRegister }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isRTL  = locale === 'ar'
  const isDark = !mounted || theme === 'dark'

  // Right panel background
  const rightBg     = isDark ? '#080714' : '#f4f2ff'
  const textMain    = isDark ? 'rgba(245,243,255,0.92)' : '#1e1743'
  const textSub     = isDark ? 'rgba(245,243,255,0.45)' : 'rgba(30,23,67,0.52)'
  const cardBg      = isDark ? '#13112a' : '#ffffff'
  const cardShadow  = isDark
    ? '0 24px 80px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset'
    : '0 8px 48px rgba(30,23,67,0.13), 0 1px 0 rgba(255,255,255,0.9) inset'
  const cardBorder  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(30,23,67,0.08)'
  const btnBorder   = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(30,23,67,0.10)'
  const linkColor   = isDark ? '#a78bfa' : '#5b4ef5'

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          LEFT PANEL — always dark, Morocco brand identity
      ═══════════════════════════════════════════════════════════════ */}
      <motion.aside
        initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col relative overflow-hidden"
        style={{
          width: '45%',
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #050816 0%, #0a0d1e 50%, #0f172a 100%)',
          flexShrink: 0,
        }}
      >
        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124,108,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,108,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px',
          }}
        />

        {/* Top vignette */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(5,8,22,0.9), transparent)' }}
        />
        {/* Bottom vignette */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(5,8,22,0.9), transparent)' }}
        />

        {/* Left panel content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12" style={{ minHeight: '100vh' }}>

          {/* Logo */}
          <Logo size={30} variant="dark" />

          {/* Morocco map — fills the centre */}
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
              style={{
                color: '#f5f3ff',
                fontSize: 'clamp(1.35rem, 2vw, 1.75rem)',
                lineHeight: 1.25,
              }}
            >
              {t('auth.leftHero')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ color: 'rgba(167,139,250,0.7)', fontSize: '0.82rem', lineHeight: 1.6 }}
            >
              {t('auth.leftSubHero')}
            </motion.p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
              {FEATURES.map(({ tKey, subKey, icon }, i) => (
                <motion.div
                  key={tKey}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 + i * 0.1, duration: 0.45 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <span
                    style={{
                      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(124,108,255,0.12)',
                      border: '1px solid rgba(124,108,255,0.22)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem',
                    }}
                  >
                    {icon}
                  </span>
                  <div>
                    <p style={{ color: '#f5f3ff', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3 }}>
                      {t(tKey)}
                    </p>
                    <p style={{ color: 'rgba(167,139,250,0.55)', fontSize: '0.73rem', lineHeight: 1.4 }}>
                      {t(subKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom: "Made in Morocco" glass card + lang */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '12px 16px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: '1.35rem' }}>🇲🇦</span>
              <div>
                <p style={{ color: '#f5f3ff', fontSize: '0.80rem', fontWeight: 600, lineHeight: 1.2 }}>
                  {t('auth.leftCard')}
                </p>
                <p style={{ color: 'rgba(167,139,250,0.55)', fontSize: '0.70rem', lineHeight: 1.4 }}>
                  {t('auth.leftCardSub')}
                </p>
              </div>
            </motion.div>

            {/* Language selector */}
            <div style={{ display: 'flex', gap: 4 }}>
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as Locale)}
                  style={{
                    padding: '5px 11px', borderRadius: 8,
                    fontSize: '0.76rem', fontWeight: 500,
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    color: locale === loc.code ? '#a78bfa' : 'rgba(245,243,255,0.34)',
                    background: locale === loc.code ? 'rgba(124,108,255,0.14)' : 'transparent',
                  }}
                >
                  {loc.flag} {loc.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT PANEL — form, theme-aware
      ═══════════════════════════════════════════════════════════════ */}
      <main
        className="flex-1 flex flex-col"
        style={{ background: rightBg, minHeight: '100vh', overflowY: 'auto' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 shrink-0">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Logo size={26} variant={isDark ? 'dark' : 'auto'} />
          </div>
          <div className="hidden lg:block" />

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Already have account / don't have account */}
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

            {/* Separator */}
            <div className="hidden sm:block w-px h-4 mx-1" style={{ background: btnBorder }} />

            {/* Mobile language */}
            <div className="flex gap-0.5 lg:hidden">
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as Locale)}
                  style={{
                    padding: '4px 8px', borderRadius: 7,
                    fontSize: '0.75rem', fontWeight: 500,
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    color: locale === loc.code ? '#7c6cff' : textSub,
                    background: locale === loc.code ? 'rgba(124,108,255,0.10)' : 'transparent',
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
                  border: `1px solid ${btnBorder}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(30,23,67,0.04)',
                  color: textSub, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Form centred */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            style={{
              width: '100%',
              maxWidth: 520,
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: 24,
              padding: '1.875rem 2rem 1.75rem',
              boxShadow: cardShadow,
            }}
          >
            {children}
          </motion.div>

          {/* Copyright */}
          <p className="mt-6 text-center" style={{ fontSize: '0.65rem', color: textSub, opacity: 0.55 }}>
            © {new Date().getFullYear()} Sayerli · Tous droits réservés
          </p>
        </div>
      </main>
    </div>
  )
}
