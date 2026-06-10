'use client'

import { createTranslator } from '@/lib/i18n'

export function usePublicLocale() {
  const { t } = createTranslator('fr')
  return { t, locale: 'fr' as const, dir: 'ltr' as const }
}
