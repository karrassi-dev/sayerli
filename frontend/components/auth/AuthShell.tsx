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

export function AuthShell({ titleKey, subKey, children }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen flex">
      {/* ── Form panel ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Sayerli">
            <Logo size={32} />
          </Link>
          <div className="flex items-center gap-2">
            {LOCALES.map(loc => (
              <button
                key={loc.code}
                onClick={() => setLocale(loc.code as Locale)}
                className={`text-sm px-2 py-1 rounded-lg transition-all ${
                  locale === loc.code
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-semibold'
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
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t(titleKey)}</h1>
              <p className="text-slate-500 dark:text-slate-400">{t(subKey)}</p>
            </div>

            {/* Trust signals — mobile only */}
            <div className="lg:hidden flex flex-col gap-2 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              {FEATURES.map(({ emoji, key }) => (
                <div key={key} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-base">{emoji}</span>
                  <span className="font-medium">{t(key)}</span>
                </div>
              ))}
            </div>

            {children}
          </div>
        </div>

        <div className="px-6 py-4 text-center">
          <p className="text-xs text-slate-400">{t('footer.copyright')}</p>
        </div>
      </div>

      {/* ── Visual panel — desktop only ─────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 text-center px-12 max-w-sm">
          <div className="text-5xl mb-6">🇲🇦</div>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            {t('auth.panelLine1')}<br />
            <span className="text-primary-200">{t('auth.panelLine2')}</span><br />
            {t('auth.panelLine3')}
          </h2>
          <p className="text-primary-200 text-base leading-relaxed mb-10">
            {t('auth.panelSub')}
          </p>

          {/* Product facts */}
          <div className="flex flex-col gap-3">
            {FEATURES.map(({ emoji, key }) => (
              <div
                key={key}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl px-5 py-3.5 backdrop-blur-sm transition-colors"
              >
                <span className="text-xl flex-shrink-0">{emoji}</span>
                <span className="text-white font-semibold text-sm text-start">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
