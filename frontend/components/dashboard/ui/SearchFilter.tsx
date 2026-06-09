'use client'

import { Search, Filter, X } from 'lucide-react'
import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'

interface FilterOption { value: string; label: string }

interface SearchFilterProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  filters?: { key: string; label: string; options: FilterOption[] }[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  actions?: ReactNode
}

export function SearchFilter({ value, onChange, placeholder, filters, activeFilters = {}, onFilterChange, actions }: SearchFilterProps) {
  const { t } = useTranslation()
  const [filterOpen, setFilterOpen] = useState(false)
  const activeCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? t('common.search')}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
        />
        {value && (
          <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter button */}
      {filters && filters.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
              filterOpen || activeCount > 0
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <Filter className="w-4 h-4" />
            {t('common.filter')}
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">{activeCount}</span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute top-full mt-2 right-0 z-30 w-64 card rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 space-y-4">
              {filters.map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">{f.label}</label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => onFilterChange?.(f.key, '')}
                      className={cn('text-xs px-2.5 py-1 rounded-full border transition-all',
                        !activeFilters[f.key] ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      )}
                    >
                      {t('common.all')}
                    </button>
                    {f.options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => onFilterChange?.(f.key, opt.value)}
                        className={cn('text-xs px-2.5 py-1 rounded-full border transition-all',
                          activeFilters[f.key] === opt.value ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => setFilterOpen(false)} className="w-full text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 hover:text-primary-600 dark:hover:text-primary-400">
                {t('common.close')}
              </button>
            </div>
          )}
        </div>
      )}

      {actions}
    </div>
  )
}
