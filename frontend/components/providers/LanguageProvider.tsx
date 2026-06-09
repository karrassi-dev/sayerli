'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { Locale, DEFAULT_LOCALE, createTranslator, getDirection } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  tArray: (key: string) => string[]
  dir: 'ltr' | 'rtl'
}

export const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const saved = localStorage.getItem('sayerli_locale') as Locale | null
    if (saved && ['fr', 'en', 'ar'].includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('sayerli_locale', newLocale)
    document.documentElement.dir = getDirection(newLocale)
    document.documentElement.lang = newLocale
  }

  useEffect(() => {
    document.documentElement.dir = getDirection(locale)
    document.documentElement.lang = locale
  }, [locale])

  const { t, tArray } = createTranslator(locale)
  const dir = getDirection(locale)

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tArray, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}
