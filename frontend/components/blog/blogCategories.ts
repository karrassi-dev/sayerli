import { Receipt, Truck, Briefcase, Calculator, Users, BarChart3, type LucideIcon } from 'lucide-react'

export const CATEGORY_KEYS = [
  'facturation',
  'devis',
  'autoEntrepreneur',
  'tva',
  'freelance',
  'comparatifs',
] as const

export type CategoryKey = typeof CATEGORY_KEYS[number]

export interface CategoryMeta {
  icon: LucideIcon
  gradient: string
  pill: string
  activePill: string
  badge: string
  border: string
}

export const CAT_META: Record<CategoryKey, CategoryMeta> = {
  facturation: {
    icon: Receipt,
    gradient: 'from-blue-500 to-blue-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400',
    activePill: 'bg-blue-600 border-blue-600 text-white',
    badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900',
    border: 'hover:border-blue-200 dark:hover:border-blue-800',
  },
  devis: {
    icon: Truck,
    gradient: 'from-amber-500 to-orange-500',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400',
    activePill: 'bg-amber-500 border-amber-500 text-white',
    badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900',
    border: 'hover:border-amber-200 dark:hover:border-amber-800',
  },
  autoEntrepreneur: {
    icon: Briefcase,
    gradient: 'from-green-500 to-emerald-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400',
    activePill: 'bg-green-600 border-green-600 text-white',
    badge: 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900',
    border: 'hover:border-green-200 dark:hover:border-green-800',
  },
  tva: {
    icon: Calculator,
    gradient: 'from-purple-500 to-violet-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400',
    activePill: 'bg-purple-600 border-purple-600 text-white',
    badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900',
    border: 'hover:border-purple-200 dark:hover:border-purple-800',
  },
  freelance: {
    icon: Users,
    gradient: 'from-teal-500 to-teal-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-300 dark:hover:border-teal-700 hover:text-teal-600 dark:hover:text-teal-400',
    activePill: 'bg-teal-600 border-teal-600 text-white',
    badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900',
    border: 'hover:border-teal-200 dark:hover:border-teal-800',
  },
  comparatifs: {
    icon: BarChart3,
    gradient: 'from-rose-500 to-pink-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-400',
    activePill: 'bg-rose-600 border-rose-600 text-white',
    badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900',
    border: 'hover:border-rose-200 dark:hover:border-rose-800',
  },
}
