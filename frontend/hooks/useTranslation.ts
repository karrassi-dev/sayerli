'use client'

import { useContext } from 'react'
import { LanguageContext } from '@/components/providers/LanguageProvider'

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    // Return safe defaults during SSR (before provider mounts)
    const { t, tArray } = { t: (k: string) => k, tArray: (_k: string) => [] as string[] }
    return { locale: 'fr' as const, setLocale: () => {}, t, tArray, dir: 'ltr' as const }
  }
  return ctx
}
