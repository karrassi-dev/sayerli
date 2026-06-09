'use client'

import { X } from 'lucide-react'
import { ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  footer?: ReactNode
}

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizeMap = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden', sizeMap[size])}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmer', danger = false }: {
  open: boolean; onClose: () => void; onConfirm: () => void
  title: string; message: string; confirmLabel?: string; danger?: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={
      <>
        <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Annuler</button>
        <button onClick={() => { onConfirm(); onClose() }} className={cn('px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all', danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700')}>
          {confirmLabel}
        </button>
      </>
    }>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{message}</p>
    </Modal>
  )
}
