import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMAD(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date, locale = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

// Normalizes any Moroccan phone format to WhatsApp's international format (no + or spaces).
// Handles: +212XXXXXXXXX, 00212XXXXXXXXX, 0XXXXXXXXX, XXXXXXXXX
export function toWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw) return null
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return null
  if (digits.startsWith('00212')) return digits.slice(2)
  if (digits.startsWith('212')) return digits
  if (digits.startsWith('0') && digits.length === 10) return '212' + digits.slice(1)
  if (digits.length === 9) return '212' + digits
  return null
}
