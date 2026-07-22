'use client'

import { useState, useEffect } from 'react'
import { List, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TocItem {
  id: string
  title: string
}

interface Props {
  items: TocItem[]
}

export function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!items.length) return

    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 },
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top: y, behavior: 'smooth' })
    setActiveId(id)
    setMobileOpen(false)
  }

  if (!items.length) return null

  return (
    <>
      {/* ── Mobile collapsible ─────────────────────────── */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary-500" />
            Table des matières
          </span>
          {mobileOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {mobileOpen && (
          <nav className="mt-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <ul className="space-y-0.5">
              {items.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => handleClick(e, id)}
                    className={cn(
                      'block py-2 px-3 text-sm rounded-lg transition-all',
                      activeId === id
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50',
                    )}
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* ── Desktop sticky sidebar ─────────────────────── */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <List className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Table des matières
            </span>
          </div>

          {/* Items */}
          <nav className="p-3">
            <ul className="space-y-0.5">
              {items.map(({ id, title }, i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => handleClick(e, id)}
                    className={cn(
                      'flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group',
                      activeId === id
                        ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-semibold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/40',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-150',
                        activeId === id
                          ? 'bg-primary-500 dark:bg-primary-400'
                          : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400 dark:group-hover:bg-slate-500',
                      )}
                    />
                    <span className="leading-snug">{title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
