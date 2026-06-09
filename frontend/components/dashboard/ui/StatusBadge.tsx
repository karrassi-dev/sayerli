'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'

type BadgeVariant =
  | 'actif' | 'inactif' | 'en_attente' | 'desactive'
  | 'brouillon' | 'envoye' | 'vu' | 'accepte' | 'refuse'
  | 'payee' | 'partielle' | 'en_retard' | 'envoyee'
  | 'admin' | 'manager' | 'commercial' | 'comptable'
  | 'cash' | 'virement' | 'carte' | 'cheque' | 'mobile'

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  actif:      'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  inactif:    'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  en_attente: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  desactive:  'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  brouillon:  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  envoye:     'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  vu:         'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  accepte:    'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  refuse:     'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  payee:      'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  partielle:  'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  en_retard:  'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  envoyee:    'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  admin:      'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800',
  manager:    'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  commercial: 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  comptable:  'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  cash:       'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  virement:   'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  carte:      'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  cheque:     'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  mobile:     'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
}

const VARIANT_DOT: Partial<Record<BadgeVariant, string>> = {
  actif: 'bg-green-500', inactif: 'bg-slate-400',
  brouillon: 'bg-slate-400', envoye: 'bg-blue-500',
  vu: 'bg-purple-500', accepte: 'bg-green-500',
  refuse: 'bg-red-500', payee: 'bg-green-500',
  partielle: 'bg-amber-500', en_retard: 'bg-red-500',
  envoyee: 'bg-blue-500',
}

interface StatusBadgeProps {
  variant: BadgeVariant
  label?: string
  dot?: boolean
  size?: 'sm' | 'md'
}

export function StatusBadge({ variant, label, dot, size = 'md' }: StatusBadgeProps) {
  const { t } = useTranslation()

  const defaultLabels: Partial<Record<BadgeVariant, string>> = {
    actif: t('statuses.actif'), inactif: t('statuses.inactif'),
    en_attente: t('statuses.enAttente'), desactive: t('statuses.desactive'),
    brouillon: t('statuses.brouillon'), envoye: t('statuses.envoye'),
    vu: t('statuses.vu'), accepte: t('statuses.accepte'),
    refuse: t('statuses.refuse'), payee: t('statuses.payee'),
    partielle: t('statuses.partielle'), en_retard: t('statuses.enRetard'),
    envoyee: t('statuses.envoyee'),
    admin: t('roles.admin'), manager: t('roles.manager'),
    commercial: t('roles.commercial'), comptable: t('roles.comptable'),
    cash: t('methodes.cash'), virement: t('methodes.virement'),
    carte: t('methodes.carte'), cheque: t('methodes.cheque'), mobile: t('methodes.mobile'),
  }

  const displayLabel = label ?? defaultLabels[variant] ?? variant

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-medium',
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
      VARIANT_STYLES[variant]
    )}>
      {dot && VARIANT_DOT[variant] && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', VARIANT_DOT[variant])} />
      )}
      {displayLabel}
    </span>
  )
}
