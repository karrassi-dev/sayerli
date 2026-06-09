'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'

interface PaginationProps {
  page: number
  total: number
  perPage?: number
  onChange: (page: number) => void
}

export function Pagination({ page, total, perPage = 10, onChange }: PaginationProps) {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t('common.showingResults').replace('{start}', String(start)).replace('{end}', String(end)).replace('{total}', String(total))}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === 'number' && onChange(p)}
            disabled={p === '...'}
            className={cn('w-8 h-8 rounded-lg text-xs font-semibold transition-all',
              p === page ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : p === '...' ? 'text-slate-400 cursor-default' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
