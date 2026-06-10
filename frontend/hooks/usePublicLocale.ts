'use client'

import { useState, useEffect } from 'react'
import { createTranslator, type Locale } from '@/lib/i18n'

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'fr'
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('ar')) return 'ar'
  if (lang.startsWith('en')) return 'en'
  return 'fr'
}

export function usePublicLocale() {
  const [locale, setLocale] = useState<Locale>('fr')

  useEffect(() => {
    setLocale(detectLocale())
  }, [])

  const { t } = createTranslator(locale)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  return { t, locale, dir }
}
