'use client'

import { useAuth } from './useAuth'
import { formatCurrency } from '@/lib/utils'

export function useCurrency() {
  const { entreprise } = useAuth()
  const devise = entreprise?.devise ?? 'MAD'
  const fmt = (amount: number) => formatCurrency(amount, devise)
  return { devise, fmt }
}
