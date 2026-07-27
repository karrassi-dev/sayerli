'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { LOCALES, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/LogoMark'
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn'

export function Navbar() {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const loggedIn = useIsLoggedIn()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const navLinks = [
    { href: '/#how-it-works', label: t('nav.howItWorks') },
    { href: '/fonctionnalites', label: t('nav.features') },
    { href: '/#pricing', label: t('nav.pricing') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/faq', label: t('nav.faq') },
  ]

  const currentLocale = LOCALES.find(l => l.code === locale)

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-5">
      <div className="max-w-6xl mx-auto">

        {/* ── Pill container ── */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-white/8 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.35)]">

          {/* Logo */}
          <Link href="/" aria-label="Sayerli" className="flex-shrink-0 me-6">
            <Logo size={28} />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 ms-4">

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/8 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                <span className="text-base leading-none">{currentLocale?.flag}</span>
                <span>{currentLocale?.label}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', langOpen && 'rotate-180')} />
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute top-full mt-2 right-0 w-38 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-xl shadow-xl overflow-hidden z-20">
                    {LOCALES.map(loc => (
                      <button
                        key={loc.code}
                        onClick={() => { setLocale(loc.code as Locale); setLangOpen(false) }}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left',
                          locale === loc.code
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                        )}
                      >
                        <span className="text-base">{loc.flag}</span>
                        <span>{loc.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Auth CTA */}
            {loggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-500/30 group"
              >
                {t('nav.dashboard')}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-500/30 group"
                >
                  {t('nav.startFree')}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/8 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* ── Mobile dropdown ── */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-white/8 rounded-2xl shadow-xl overflow-hidden">

            {/* Nav links */}
            <div className="p-2 space-y-0.5">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Language + Auth */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-100 dark:border-white/6 space-y-3">

              <div className="flex flex-wrap gap-1.5">
                {LOCALES.map(loc => (
                  <button
                    key={loc.code}
                    onClick={() => { setLocale(loc.code as Locale); setMobileOpen(false) }}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all',
                      locale === loc.code
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/8'
                    )}
                  >
                    {loc.flag} {loc.label}
                  </button>
                ))}
              </div>

              {loggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
                >
                  {t('nav.dashboard')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-xl"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
                  >
                    {t('nav.startFree')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </header>
  )
}
