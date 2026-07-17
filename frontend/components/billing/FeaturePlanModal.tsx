'use client'

import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'

const PLAN_BADGE: Record<string, string> = {
  PRO:      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  BUSINESS: 'bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300',
}

interface FeaturePlanModalProps {
  open: boolean
  onClose: () => void
  featureName: string
  requiredPlan: 'PRO' | 'BUSINESS'
  title?: string
}

export function FeaturePlanModal({
  open,
  onClose,
  featureName,
  requiredPlan,
  title = 'Fonctionnalité non incluse dans votre plan',
}: FeaturePlanModalProps) {
  const router = useRouter()

  if (!open) return null

  const handleUpgrade = () => {
    onClose()
    router.push('/dashboard/settings?tab=billing')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-6 h-6 text-amber-500" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white text-center mb-2">
          {title}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-1">
          <strong className="text-slate-700 dark:text-slate-200">{featureName}</strong>{' '}
          est réservé au plan{' '}
          <span className={`inline-block font-bold px-1.5 py-0.5 rounded text-xs ${PLAN_BADGE[requiredPlan]}`}>
            {requiredPlan}
          </span>.
        </p>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-6">
          Passez au plan {requiredPlan} pour accéder à cette fonctionnalité et débloquer toutes ses options.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all"
          >
            <Zap className="w-4 h-4" />
            Upgrader
          </button>
        </div>
      </div>
    </div>
  )
}
