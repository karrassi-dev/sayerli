'use client'

import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Zap } from 'lucide-react'
import { Modal } from '@/components/dashboard/ui/Modal'

interface PlanLimitModalProps {
  open: boolean
  onClose: () => void
  resource: 'clients' | 'devis' | 'factures' | 'utilisateurs'
  limite: number
  actuel: number
}

const RESOURCE_LABELS: Record<string, { label: string; upgrade: string }> = {
  clients:      { label: 'clients',               upgrade: 'clients illimités' },
  devis:        { label: 'devis ce mois',          upgrade: 'devis illimités' },
  factures:     { label: 'factures ce mois',       upgrade: 'factures illimitées' },
  utilisateurs: { label: 'membres d\'équipe',      upgrade: "plus d'utilisateurs" },
}

export function PlanLimitModal({ open, onClose, resource, limite, actuel }: PlanLimitModalProps) {
  const router = useRouter()
  const info = RESOURCE_LABELS[resource]
  const pct = limite > 0 ? Math.min(100, Math.round((actuel / limite) * 100)) : 100

  const handleUpgrade = () => {
    onClose()
    router.push('/dashboard/settings?tab=billing')
  }

  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center text-center pb-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-amber-500" />
        </div>

        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">
          Limite atteinte
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Vous avez atteint la limite de <span className="font-semibold text-slate-700 dark:text-slate-300">{limite} {info.label}</span> de votre plan actuel.
        </p>

        {/* Usage bar */}
        <div className="w-full mb-5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="capitalize">{info.label}</span>
            <span className="font-semibold text-red-500">{actuel} / {limite}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Upgrade suggestion */}
        <div className="w-full p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 mb-5 text-left">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span className="text-xs font-bold text-primary-700 dark:text-primary-300">Passez au plan Pro</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Obtenez <span className="font-semibold">{info.upgrade}</span> à partir de 299 MAD/mois.
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            Voir les plans
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  )
}
