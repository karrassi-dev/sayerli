'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Package, Plus, Pencil, Trash2, Search, Tag, Wrench, AlertCircle, Box } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui/PageHeader'
import { StatsCard } from '@/components/dashboard/ui/StatsCard'
import { ActionMenu } from '@/components/dashboard/ui/ActionMenu'
import { Pagination } from '@/components/dashboard/ui/Pagination'
import { EmptyState } from '@/components/dashboard/ui/EmptyState'
import { Modal, ConfirmModal } from '@/components/dashboard/ui/Modal'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { catalogueApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import { formatMAD } from '@/lib/mock-data'

type TypeItem = 'PRODUIT' | 'SERVICE'

interface CatalogueItem {
  id: string
  nom: string
  description: string | null
  type: TypeItem
  prixUnitaire: number
  unite: string | null
  actif: boolean
  createdAt: string
}

interface ItemForm {
  nom: string
  description: string
  type: TypeItem
  prixUnitaire: string
  unite: string
}

const EMPTY_FORM: ItemForm = { nom: '', description: '', type: 'SERVICE', prixUnitaire: '', unite: 'forfait' }

const UNITES = ['heure', 'jour', 'forfait', 'piece', 'mois', 'annee', 'page', 'mot', 'm2', 'kg']
const PER_PAGE = 8

function ItemFormFields({ form, errors, onChange }: {
  form: ItemForm
  errors: Record<string, string>
  onChange: (f: keyof ItemForm, v: string) => void
}) {
  const { t } = useTranslation()
  const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'
  const lbl = 'text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block'

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div>
        <label className={lbl}>{t('pages.catalogue.form.type')}</label>
        <div className="grid grid-cols-2 gap-2">
          {(['SERVICE', 'PRODUIT'] as TypeItem[]).map(v => {
            const active = form.type === v
            const Icon = v === 'SERVICE' ? Wrench : Box
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChange('type', v)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all',
                  active
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                )}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400')} />
                {t(v === 'SERVICE' ? 'pages.catalogue.form.typeService' : 'pages.catalogue.form.typeProduit')}
              </button>
            )
          })}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className={lbl}>{t('pages.catalogue.form.nom')} <span className="text-red-500">*</span></label>
        <input
          autoFocus
          type="text"
          value={form.nom}
          onChange={e => onChange('nom', e.target.value)}
          placeholder={t('pages.catalogue.form.nomPlaceholder')}
          className={inp}
        />
        {errors.nom && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" />{errors.nom}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={lbl}>{t('pages.catalogue.form.description')}</label>
        <textarea
          value={form.description}
          onChange={e => onChange('description', e.target.value)}
          placeholder={t('pages.catalogue.form.descPlaceholder')}
          rows={2}
          className={cn(inp, 'resize-none')}
        />
      </div>

      {/* Price + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{t('pages.catalogue.form.prix')}</label>
          <input
            type="number"
            min="0"
            step="any"
            value={form.prixUnitaire}
            onChange={e => onChange('prixUnitaire', e.target.value)}
            placeholder="0.00"
            className={cn(inp, 'text-right')}
          />
        </div>
        <div>
          <label className={lbl}>{t('pages.catalogue.form.unite')}</label>
          <select
            value={form.unite}
            onChange={e => onChange('unite', e.target.value)}
            className={inp}
          >
            {UNITES.map(u => (
              <option key={u} value={u}>{t(`pages.catalogue.form.unites.${u}`)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function CataloguePage() {
  const { t } = useTranslation()
  const { toasts, success, error: toastError, removeToast } = useToast()

  const [items, setItems] = useState<CatalogueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'ALL' | TypeItem>('ALL')
  const [page, setPage] = useState(1)

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CatalogueItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CatalogueItem | null>(null)

  const [form, setForm] = useState<ItemForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchItems = useCallback(async (q?: string, type?: string) => {
    setLoading(true)
    try {
      const res = await catalogueApi.list(q, type === 'ALL' ? undefined : type)
      const data = res.data?.data ?? res.data
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleSearch = (v: string) => {
    setSearch(v)
    setPage(1)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetchItems(v.trim() || undefined, typeFilter), 350)
  }

  const handleTypeFilter = (v: 'ALL' | TypeItem) => {
    setTypeFilter(v)
    setPage(1)
    fetchItems(search.trim() || undefined, v)
  }

  const stats = {
    total: items.length,
    produits: items.filter(i => i.type === 'PRODUIT').length,
    services: items.filter(i => i.type === 'SERVICE').length,
  }

  const paginated = items.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nom.trim()) e.nom = t('pages.catalogue.form.nomRequired')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onChange = (f: keyof ItemForm, v: string) => {
    setForm(prev => ({ ...prev, [f]: v }))
    if (errors[f]) setErrors(e => { const n = { ...e }; delete n[f]; return n })
  }

  const openCreate = () => { setForm(EMPTY_FORM); setErrors({}); setCreateOpen(true) }
  const openEdit = (item: CatalogueItem) => {
    setForm({
      nom: item.nom,
      description: item.description ?? '',
      type: item.type,
      prixUnitaire: String(item.prixUnitaire),
      unite: item.unite ?? 'forfait',
    })
    setErrors({})
    setEditTarget(item)
  }

  const handleCreate = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await catalogueApi.create({
        nom: form.nom.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        prixUnitaire: parseFloat(form.prixUnitaire) || 0,
        unite: form.unite,
      })
      setCreateOpen(false)
      success(t('pages.catalogue.createSuccess'))
      fetchItems(search.trim() || undefined, typeFilter)
    } catch {
      toastError('Erreur', 'Impossible de créer l\'article.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!editTarget || !validate()) return
    setSaving(true)
    try {
      await catalogueApi.update(editTarget.id, {
        nom: form.nom.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        prixUnitaire: parseFloat(form.prixUnitaire) || 0,
        unite: form.unite,
      })
      setEditTarget(null)
      success(t('pages.catalogue.editSuccess'))
      fetchItems(search.trim() || undefined, typeFilter)
    } catch {
      toastError('Erreur', 'Impossible de modifier l\'article.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await catalogueApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      success(t('pages.catalogue.deleteSuccess'))
      fetchItems(search.trim() || undefined, typeFilter)
    } catch {
      toastError('Erreur', 'Impossible de supprimer l\'article.')
    } finally {
      setDeleting(false)
    }
  }

  const formFooter = (onSubmit: () => void) => (
    <>
      <button
        onClick={() => { setCreateOpen(false); setEditTarget(null) }}
        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        {t('common.cancel')}
      </button>
      <button
        onClick={onSubmit}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {t('common.save')}
      </button>
    </>
  )

  const typeBadge = (type: TypeItem) => (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
      type === 'SERVICE'
        ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
    )}>
      {type === 'SERVICE' ? <Wrench className="w-2.5 h-2.5" /> : <Box className="w-2.5 h-2.5" />}
      {t(`pages.catalogue.types.${type}`)}
    </span>
  )

  return (
    <div>
      <PageHeader
        title={t('pages.catalogue.title')}
        sub={t('pages.catalogue.sub')}
        actions={
          <button className="btn-primary text-sm" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            {t('pages.catalogue.add')}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard label={t('pages.catalogue.stats.total')} value={loading ? '—' : stats.total} icon={Package} color="blue" />
        <StatsCard label={t('pages.catalogue.stats.services')} value={loading ? '—' : stats.services} icon={Wrench} color="teal" />
        <StatsCard label={t('pages.catalogue.stats.produits')} value={loading ? '—' : stats.produits} icon={Box} color="orange" />
      </div>

      {/* Search + Type filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder={t('pages.catalogue.searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
          />
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['ALL', 'SERVICE', 'PRODUIT'] as const).map(v => (
            <button
              key={v}
              onClick={() => handleTypeFilter(v)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
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

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Package}
            title={t('pages.catalogue.empty.title')}
            desc={t('pages.catalogue.empty.desc')}
            action={{ label: t('pages.catalogue.add'), onClick: openCreate }}
            color="blue"
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    {[t('pages.catalogue.col.name'), t('pages.catalogue.col.type'), t('pages.catalogue.col.desc'), t('pages.catalogue.col.price'), t('pages.catalogue.col.unit'), ''].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {paginated.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                            item.type === 'SERVICE' ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-amber-50 dark:bg-amber-950/30')}>
                            {item.type === 'SERVICE'
                              ? <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              : <Box className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.nom}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{typeBadge(item.type)}</td>
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{formatMAD(item.prixUnitaire)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {t(`pages.catalogue.form.unites.${item.unite ?? 'forfait'}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <ActionMenu items={[
                          { label: t('common.edit'), icon: Pencil, onClick: () => openEdit(item) },
                          { label: t('common.delete'), icon: Trash2, onClick: () => setDeleteTarget(item), variant: 'danger', separator: true },
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map(item => (
                <div key={item.id} className="p-4 flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    item.type === 'SERVICE' ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-amber-50 dark:bg-amber-950/30')}>
                    {item.type === 'SERVICE'
                      ? <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      : <Box className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.nom}</p>
                      {typeBadge(item.type)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{formatMAD(item.prixUnitaire)}</span>
                      <span className="text-xs text-slate-400">/ {t(`pages.catalogue.form.unites.${item.unite ?? 'forfait'}`)}</span>
                    </div>
                    {item.description && <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>}
                  </div>
                  <ActionMenu items={[
                    { label: t('common.edit'), icon: Pencil, onClick: () => openEdit(item) },
                    { label: t('common.delete'), icon: Trash2, onClick: () => setDeleteTarget(item), variant: 'danger', separator: true },
                  ]} />
                </div>
              ))}
            </div>

            <div className="px-4 py-3">
              <Pagination page={page} total={items.length} perPage={PER_PAGE} onChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t('pages.catalogue.create')} footer={formFooter(handleCreate)}>
        <ItemFormFields form={form} errors={errors} onChange={onChange} />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={t('pages.catalogue.edit')} footer={formFooter(handleEdit)}>
        <ItemFormFields form={form} errors={errors} onChange={onChange} />
      </Modal>

      <ConfirmModal
        open={!!deleteTarget && !deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('pages.catalogue.deleteTitle')}
        message={t('pages.catalogue.deleteMessage').replace('{nom}', deleteTarget?.nom ?? '')}
        confirmLabel={t('common.delete')}
        danger
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
