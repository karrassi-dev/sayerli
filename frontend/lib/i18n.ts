import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'
import ar from '@/i18n/ar.json'

export type Locale = 'fr' | 'en' | 'ar'
export type Direction = 'ltr' | 'rtl'

export const LOCALES: { code: Locale; label: string; flag: string; dir: Direction }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
]

const translations = { fr, en, ar }

export type TranslationKeys = typeof fr

function getRawValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return current
}

export function createTranslator(locale: Locale) {
  const dict = translations[locale] as unknown as Record<string, unknown>
  function t(key: string): string {
    const val = getRawValue(dict, key)
    if (typeof val === 'string') return val
    if (Array.isArray(val)) return val.join('|||')
    return key
  }
  function tArray(key: string): string[] {
    const val = getRawValue(dict, key)
    if (Array.isArray(val)) return val as string[]
    return []
  }
  return { t, tArray }
}

export function getDirection(locale: Locale): Direction {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export const DEFAULT_LOCALE: Locale = 'fr'
