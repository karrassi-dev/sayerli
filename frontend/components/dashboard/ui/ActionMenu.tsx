'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionItem {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'default' | 'danger'
  separator?: boolean
}

interface ActionMenuProps {
  items: ActionItem[]
  align?: 'left' | 'right'
}

export function ActionMenu({ items, align = 'right' }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={e => { e.stopPropagation(); setOpen(!open) }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className={cn(
          'absolute z-40 mt-1 w-44 card rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 overflow-hidden',
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i}>
                {item.separator && i > 0 && <div className="my-1 border-t border-slate-100 dark:border-slate-800" />}
                <button
                  onClick={() => { item.onClick(); setOpen(false) }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left',
                    item.variant === 'danger'
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                  {item.label}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
