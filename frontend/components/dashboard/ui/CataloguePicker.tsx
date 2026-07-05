'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Wrench, Box } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { catalogueApi } from '@/lib/api'
import { formatMAD } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type TypeItem = 'PRODUIT' | 'SERVICE'

interface CatalogueItem {
  id: string
  nom: string
  description: string | null
  type: TypeItem
  prixUnitaire: number
  unite: string | null
}

interface Props {
  onSelect: (item: { description: string; prixUnitaire: string }) => void
  onClose: () => void
}

export function CataloguePicker({ onSelect, onClose }: Props) {
  const { t } = useTranslation()
  const [items, setItems] = useState<CatalogueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'ALL' | TypeItem>('ALL')
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetch = async (q?: string, type?: string) => {
    setLoading(true)
    try {
      const res = await catalogueApi.list(q, type === 'ALL' ? undefined : type)
      const data = res.data?.data ?? res.data
      setItems(Array.isArray(data) ? data : [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch(); inputRef.current?.focus() }, [])

  const handleSearch = (v: string) => {
    setSearch(v)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetch(v.trim() || undefined, typeFilter), 300)
  }

  const handleType = (v: 'ALL' | TypeItem) => {
    setTypeFilter(v)
    fetch(search.trim() || undefined, v)
  }

  const filtered = items.filter(i => typeFilter === 'ALL' || i.type === typeFilter)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t('pages.devis.form.cataloguePickerTitle')}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search + filter */}
        <div className="px-4 py-3 space-y-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder={t('pages.catalogue.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['ALL', 'SERVICE', 'PRODUIT'] as const).map(v => (
              <button
                key={v}
                onClick={() => handleType(v)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  typeFilter === v
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )}
              >
                {v === 'ALL' ? t('pages.catalogue.filter.all') :
                 v === 'SERVICE' ? t('pages.catalogue.filter.service') :
                 t('pages.catalogue.filter.produit')}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {loading ? (
            <div className="space-y-2 px-1">
              {[1,2,3,4].map(i => <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-sm text-slate-400">{t('pages.devis.form.cataloguePickerEmpty')}</div>
          ) : (
            <div className="space-y-1">
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    const desc = item.description
                      ? `${item.nom} — ${item.description}`
                      : item.nom
                    onSelect({ description: desc, prixUnitaire: String(item.prixUnitaire) })
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:border-primary-200 dark:hover:border-primary-800 border border-transparent transition-all text-left group"
                >
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                    item.type === 'SERVICE' ? 'bg-blue-50 dark:bg-blue-950/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50' : 'bg-amber-50 dark:bg-amber-950/30 group-hover:bg-amber-100 dark:group-hover:bg-amber-950/50')}>
                    {item.type === 'SERVICE'
                      ? <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      : <Box className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.nom}</p>
                    {item.description && <p className="text-xs text-slate-400 truncate">{item.description}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary-600 dark:text-primary-400">{formatMAD(item.prixUnitaire)}</p>
                    <p className="text-xs text-slate-400">{t(`pages.catalogue.form.unites.${item.unite ?? 'forfait'}`)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
