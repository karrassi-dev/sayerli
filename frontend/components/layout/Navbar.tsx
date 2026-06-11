'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, Globe, ChevronDown } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { LOCALES, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/LogoMark'

export function Navbar() {
  const { t, locale, setLocale } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#features', label: t('nav.features') },
    { href: '#how-it-works', label: t('nav.howItWorks') },
    { href: '#pricing', label: t('nav.pricing') },
    { href: '#testimonials', label: t('nav.testimonials') },
    { href: '/contact', label: t('nav.contact') },
  ]

  const currentLocale = LOCALES.find(l => l.code === locale)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass shadow-sm shadow-black/5'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="Sayerli">
            <Logo size={32} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLocale?.flag}</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-1 right-0 w-36 card shadow-xl overflow-hidden z-50">
                  {LOCALES.map(loc => (
                    <button
                      key={loc.code}
                      onClick={() => { setLocale(loc.code as Locale); setLangOpen(false) }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left',
                        locale === loc.code
                          ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <span>{loc.flag}</span>
                      <span>{loc.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2">
              {t('nav.startFree')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden glass rounded-2xl mb-2 p-4 space-y-2 border border-slate-200 dark:border-slate-700">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 space-y-1">
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  onClick={() => { setLocale(loc.code as Locale); setMobileOpen(false) }}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all text-left',
                    locale === loc.code
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  {loc.flag} {loc.label}
                </button>
              ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block btn-secondary text-center"
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block btn-primary text-center"
              >
                {t('nav.startFree')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
