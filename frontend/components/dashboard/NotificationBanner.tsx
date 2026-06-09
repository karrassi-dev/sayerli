'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, FileText, Receipt, CreditCard, AlertTriangle, Eye, ClipboardCheck, CheckCheck } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const DURATION = 5000

const TYPE_CONFIG: Record<string, {
  icon: React.ElementType
  iconColor: string
  bg: string
  border: string
  bar: string
}> = {
  DEVIS_ENVOYE:      { icon: FileText,       iconColor: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-950/60',    border: 'border-l-blue-500',   bar: 'bg-blue-500' },
  DEVIS_ACCEPTE:     { icon: CheckCheck,     iconColor: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-950/60',  border: 'border-l-green-500',  bar: 'bg-green-500' },
  DEVIS_REFUSE:      { icon: FileText,       iconColor: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-950/60',      border: 'border-l-red-500',    bar: 'bg-red-500' },
  DEVIS_VU:          { icon: Eye,            iconColor: 'text-purple-600 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-950/60',border: 'border-l-purple-500', bar: 'bg-purple-500' },
  FACTURE_CREEE:     { icon: Receipt,        iconColor: 'text-slate-600 dark:text-slate-400',  bg: 'bg-white dark:bg-slate-800',        border: 'border-l-slate-400',  bar: 'bg-slate-400' },
  FACTURE_ENVOYEE:   { icon: Receipt,        iconColor: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-950/60',    border: 'border-l-blue-500',   bar: 'bg-blue-500' },
  FACTURE_VUE:       { icon: Eye,            iconColor: 'text-purple-600 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-950/60',border: 'border-l-purple-500', bar: 'bg-purple-500' },
  FACTURE_PAYEE:     { icon: CreditCard,     iconColor: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-950/60',  border: 'border-l-green-500',  bar: 'bg-green-500' },
  FACTURE_PARTIELLE: { icon: CreditCard,     iconColor: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950/60',  border: 'border-l-amber-500',  bar: 'bg-amber-500' },
  RAPPEL_ECHEANCE:   { icon: AlertTriangle,  iconColor: 'text-orange-600 dark:text-orange-400',bg: 'bg-orange-50 dark:bg-orange-950/60',border: 'border-l-orange-500', bar: 'bg-orange-500' },
  PAIEMENT_RECU:     { icon: CreditCard,     iconColor: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-950/60',  border: 'border-l-green-500',  bar: 'bg-green-500' },
  DECLARATION_RECUE: { icon: ClipboardCheck, iconColor: 'text-teal-600 dark:text-teal-400',    bg: 'bg-teal-50 dark:bg-teal-950/60',    border: 'border-l-teal-500',   bar: 'bg-teal-500' },
}

export interface BannerItem {
  id: string
  type: string
  message: string
  lien?: string
}

function Banner({ item, onDismiss }: { item: BannerItem; onDismiss: () => void }) {
  const { t } = useTranslation()
  const router = useRouter()
  const [progress, setProgress] = useState(100)
  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.FACTURE_CREEE
  const Icon = cfg.icon

  const dismiss = useCallback(() => onDismiss(), [onDismiss])

  useEffect(() => {
    const start = Date.now()
    const tick = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / DURATION) * 100)
      setProgress(pct)
      if (pct === 0) { clearInterval(tick); dismiss() }
    }, 50)
    return () => clearInterval(tick)
  }, [dismiss])

  return (
    <div
      onClick={() => { dismiss(); if (item.lien) router.push(item.lien) }}
      className={cn(
        'pointer-events-auto w-80 rounded-xl border-l-4 shadow-2xl overflow-hidden cursor-pointer',
        'animate-slide-up backdrop-blur-sm',
        cfg.bg, cfg.border
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/60 dark:bg-black/20')}>
          <Icon className={cn('w-4 h-4', cfg.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-xs font-bold mb-0.5', cfg.iconColor)}>
            {t(`notifications.types.${item.type}`)}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug line-clamp-2">
            {item.message}
          </p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); dismiss() }}
          className="flex-shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="h-0.5 bg-black/10 dark:bg-white/10">
        <div className={cn('h-full transition-none', cfg.bar)} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export function NotificationBannerContainer({
  banners,
  onDismiss,
}: {
  banners: BannerItem[]
  onDismiss: (id: string) => void
}) {
  const { dir } = useTranslation()
  if (banners.length === 0) return null

  return (
    <div className={cn(
      'fixed bottom-4 z-[100] flex flex-col gap-2 pointer-events-none',
      dir === 'rtl' ? 'right-4' : 'left-4'
    )}>
      {banners.map(b => (
        <Banner key={b.id} item={b} onDismiss={() => onDismiss(b.id)} />
      ))}
    </div>
  )
}
