'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

// Conservative estimate of max dropdown height (used for up/down decision)
const MENU_HEIGHT_ESTIMATE = 220

export function ActionMenu({ items, align = 'right' }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const [upward, setUpward] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const computePosition = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const goUp = spaceBelow < MENU_HEIGHT_ESTIMATE && rect.top > MENU_HEIGHT_ESTIMATE

    setUpward(goUp)

    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      width: '11rem',
      transformOrigin: goUp
        ? align === 'right' ? 'bottom right' : 'bottom left'
        : align === 'right' ? 'top right'    : 'top left',
    }

    if (align === 'right') {
      base.right = window.innerWidth - rect.right
    } else {
      base.left = rect.left
    }

    if (goUp) {
      base.bottom = window.innerHeight - rect.top + 4
    } else {
      base.top = rect.bottom + 4
    }

    setMenuStyle(base)
  }, [align])

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!open) computePosition()
    setOpen(v => !v)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on scroll or resize (covers all ancestor scrollable containers)
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className={cn(
            'card rounded-xl border border-slate-100 dark:border-slate-800 py-1 overflow-hidden',
            'shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]',
            upward ? 'action-menu-up' : 'action-menu-down',
          )}
        >
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i}>
                {item.separator && i > 0 && (
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                )}
                <button
                  onClick={() => { item.onClick(); setOpen(false) }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left',
                    item.variant === 'danger'
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                  )}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                  {item.label}
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </>
  )
}
