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

export function AuthShell({ titleKey, subKey, children }: AuthShellProps) {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen flex">
      {/* Form panel */}
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
            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t(titleKey)}</h1>
              <p className="text-slate-500 dark:text-slate-400">{t(subKey)}</p>
            </div>
            {children}
          </div>
        </div>

        <div className="px-6 py-4 text-center">
          <p className="text-xs text-slate-400">{t('footer.copyright')}</p>
        </div>
      </div>

      {/* Visual panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 text-center px-12">
          <div className="text-5xl mb-6">🇲🇦</div>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            {t('auth.panelLine1')}<br />
            <span className="text-primary-200">{t('auth.panelLine2')}</span><br />
            {t('auth.panelLine3')}
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed">
            {t('auth.panelSub')}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '500+', labelKey: 'auth.statUsers' },
              { value: '12K+', labelKey: 'auth.statInvoices' },
              { value: '8M+',  labelKey: 'auth.statRevenue' },
            ].map(({ value, labelKey }) => (
              <div key={labelKey} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-xs text-primary-200">{t(labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
