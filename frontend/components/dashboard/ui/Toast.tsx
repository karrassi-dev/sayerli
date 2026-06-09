'use client'

import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toast as ToastType } from '@/hooks/useToast'

const CONFIG = {
  success: { icon: CheckCircle, color: 'border-l-green-500 bg-green-50 dark:bg-green-950/30', iconColor: 'text-green-600 dark:text-green-400', titleColor: 'text-green-800 dark:text-green-200' },
  error:   { icon: XCircle,     color: 'border-l-red-500 bg-red-50 dark:bg-red-950/30',     iconColor: 'text-red-600 dark:text-red-400',     titleColor: 'text-red-800 dark:text-red-200' },
  info:    { icon: Info,         color: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30',  iconColor: 'text-blue-600 dark:text-blue-400',   titleColor: 'text-blue-800 dark:text-blue-200' },
  warning: { icon: AlertTriangle, color: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/30', iconColor: 'text-amber-600 dark:text-amber-400', titleColor: 'text-amber-800 dark:text-amber-200' },
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastType[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const c = CONFIG[toast.type]
        const Icon = c.icon
        return (
          <div key={toast.id} className={cn('pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-xl backdrop-blur-sm animate-slide-up', c.color)}>
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', c.iconColor)} />
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-semibold', c.titleColor)}>{toast.title}</p>
              {toast.message && <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{toast.message}</p>}
            </div>
            <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
