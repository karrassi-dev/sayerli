'use client'

import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { ...toast, id }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const success = (title: string, message?: string) => addToast({ type: 'success', title, message })
  const error = (title: string, message?: string) => addToast({ type: 'error', title, message })
  const info = (title: string, message?: string) => addToast({ type: 'info', title, message })

  return { toasts, success, error, info, removeToast }
}
