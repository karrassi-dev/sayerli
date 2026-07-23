'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Wallet, Plus, Pencil, Trash2, Search, Download,
  Image, X, Upload, Eye, AlertCircle, Receipt,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui/PageHeader'
import { StatsCard } from '@/components/dashboard/ui/StatsCard'
import { ActionMenu } from '@/components/dashboard/ui/ActionMenu'
import { Pagination } from '@/components/dashboard/ui/Pagination'
import { EmptyState } from '@/components/dashboard/ui/EmptyState'
import { Modal, ConfirmModal } from '@/components/dashboard/ui/Modal'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { PlanLimitModal } from '@/components/billing/PlanLimitModal'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/hooks/useAuth'
import { canDo } from '@/lib/permissions'
import { depensesApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import axios from 'axios'
import imageCompression from 'browser-image-compression'

// ── Types ──────────────────────────────────────────────────────────────────────

type CategorieDepense =
  | 'LOYER' | 'EQUIPEMENT' | 'TRANSPORT' | 'ABONNEMENTS' | 'MATIERES_PREMIERES'
  | 'SALAIRES' | 'MARKETING' | 'FOURNITURES' | 'SOUS_TRAITANCE' | 'AUTRE'

const CATEGORIES: CategorieDepense[] = [
  'LOYER', 'EQUIPEMENT', 'TRANSPORT', 'ABONNEMENTS', 'MATIERES_PREMIERES',
  'SALAIRES', 'MARKETING', 'FOURNITURES', 'SOUS_TRAITANCE', 'AUTRE',
]

const CATEGORIE_COLORS: Record<CategorieDepense, string> = {
  LOYER:             'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  EQUIPEMENT:        'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  TRANSPORT:         'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  ABONNEMENTS:       'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  MATIERES_PREMIERES:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  SALAIRES:          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  MARKETING:         'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  FOURNITURES:       'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300',
  SOUS_TRAITANCE:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  AUTRE:             'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300',
}

interface Depense {
  id: string
  montant: number
  devise: string
  categorie: CategorieDepense
  categoriePersonnalisee: string | null
  fournisseur: string | null
  description: string | null
  date: string
  receiptKey: string | null
  receiptUrl: string | null
  receiptSizeBytes: number | null
  createdAt: string
}

interface DepenseForm {
  montant: string
  devise: string
  categorie: CategorieDepense
  categoriePersonnalisee: string
  fournisseur: string
  description: string
  date: string
}

const EMPTY_FORM: DepenseForm = {
  montant: '',
  devise: 'MAD',
  categorie: 'AUTRE',
  categoriePersonnalisee: '',
  fournisseur: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
}

const PAGE_SIZE = 10

// ── Receipt Upload Component ──────────────────────────────────────────────────

interface ReceiptUploadProps {
  onUploaded: (key: string, url: string, sizeBytes: number) => void
  onError: (msg: string) => void
  currentUrl?: string | null
  onRemove: () => void
  t: (key: string) => string
}

function ReceiptUpload({ onUploaded, onError, currentUrl, onRemove, t }: ReceiptUploadProps) {
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading'>('idle')
  const [progress, setProgress] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      onError(t('pages.depenses.form.recuWrongType'))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      onError(t('pages.depenses.form.recuHint'))
      return
    }

    setStatus('compressing')
    setProgress(10)

    let compressed: File
    try {
      const blob = await imageCompression(file, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1600,
        fileType: 'image/webp',
        useWebWorker: true,
        initialQuality: 0.78,
      })
      compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
    } catch {
      onError('Erreur de compression.')
      setStatus('idle')
      return
    }

    if (compressed.size > 1.5 * 1024 * 1024) {
      onError(t('pages.depenses.form.recuTooLarge'))
      setStatus('idle')
      return
    }

    setProgress(40)
    setStatus('uploading')

    // Step 1: get presigned URL from backend
    let uploadUrl: string
    let key: string
    try {
      const res = await depensesApi.getUploadUrl()
      const payload = res.data?.data ?? res.data
      uploadUrl = payload.url
      key = payload.key
    } catch (e: any) {
      if (e?.response?.status === 402) {
        onError('Limite de plan atteinte.')
      } else {
        onError("Impossible d'obtenir l'URL d'upload. Vérifiez votre connexion.")
      }
      setStatus('idle')
      setProgress(0)
      return
    }

    setProgress(60)

    // Step 2: PUT directly to R2 — no extra headers to avoid CORS preflight issues
    try {
      await axios.put(uploadUrl, compressed, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(60 + Math.round((e.loaded / e.total) * 35))
        },
        transformRequest: [(data) => data], // prevent axios from modifying content-type
      })
    } catch {
      onError("Erreur lors de l'upload vers le stockage. Vérifiez la configuration R2 CORS.")
      setStatus('idle')
      setProgress(0)
      return
    }

    setProgress(100)
    const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''
    const publicUrl = `${r2Base}/${key}`
    onUploaded(key, publicUrl, compressed.size)
    setStatus('idle')
    setProgress(0)
  }, [onError, onUploaded, t])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  if (currentUrl) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <img src={currentUrl} alt="Reçu" className="w-full max-h-48 object-contain" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => status === 'idle' && inputRef.current?.click()}
      className={cn(
        'relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 py-8 px-4',
        status === 'idle'
          ? 'border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/10'
          : 'border-primary-300 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 cursor-not-allowed'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) processFile(f)
          e.target.value = ''
        }}
      />

      {status === 'idle' ? (
        <>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <Upload className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span>{t('pages.depenses.form.recuDrag')}</span>{' '}
              <span className="text-primary-600 dark:text-primary-400 font-medium">{t('pages.depenses.form.recuClick')}</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('pages.depenses.form.recuHint')}</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center animate-pulse">
            {status === 'compressing' ? (
              <Image className="w-5 h-5 text-primary-500" />
            ) : (
              <Upload className="w-5 h-5 text-primary-500" />
            )}
          </div>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
            {status === 'compressing'
              ? t('pages.depenses.form.recuCompress')
              : t('pages.depenses.form.recuUploading')}
          </p>
          <div className="w-full max-w-xs h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DepensesPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { toasts, success, error: toastError, removeToast } = useToast()
  const role = user?.role?.toLowerCase() ?? ''
  const removed: string[] = user?.permissionsRetirees ?? []

  const [items, setItems] = useState<Depense[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('')
  const [filterDateDebut, setFilterDateDebut] = useState('')
  const [filterDateFin, setFilterDateFin] = useState('')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<DepenseForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  // Receipt state within form
  const [receiptKey, setReceiptKey] = useState<string | null>(null)
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [receiptSizeBytes, setReceiptSizeBytes] = useState<number | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Depense | null>(null)
  const [limitModal, setLimitModal] = useState<{ limite: number; actuel: number } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Receipts this month count (for stats)
  const [receiptsThisMonth, setReceiptsThisMonth] = useState(0)

  const canEdit = canDo('depenses.create' as any, role, removed) ||
    ['admin', 'proprietaire', 'manager', 'daf', 'comptable', 'assistant'].includes(role)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await depensesApi.list({
        ...(filterCategorie ? { categorie: filterCategorie } : {}),
        ...(filterDateDebut ? { dateDebut: filterDateDebut } : {}),
        ...(filterDateFin ? { dateFin: filterDateFin } : {}),
        ...(search ? { recherche: search } : {}),
      })
      const list: Depense[] = res.data?.data ?? res.data ?? []
      setItems(list)
      // Count receipts uploaded this month
      const thisMonth = new Date()
      setReceiptsThisMonth(list.filter(d => {
        const created = new Date(d.createdAt)
        return d.receiptKey &&
          created.getMonth() === thisMonth.getMonth() &&
          created.getFullYear() === thisMonth.getFullYear()
      }).length)
    } catch {
      toastError('Erreur lors du chargement des dépenses.')
    } finally {
      setLoading(false)
    }
  }, [filterCategorie, filterDateDebut, filterDateFin, search]) // eslint-disable-line

  useEffect(() => { load() }, [load])

  // ── Stats ──────────────────────────────────────────────────────────────────

  const totalMontant = items.reduce((s, d) => s + Number(d.montant), 0)
  const now = new Date()
  const thisMontant = items
    .filter(d => {
      const date = new Date(d.date)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    .reduce((s, d) => s + Number(d.montant), 0)
  const withReceipts = items.filter(d => d.receiptKey).length
  const categoriesCount = new Set(items.map(d => d.categorie)).size

  // ── Pagination ─────────────────────────────────────────────────────────────

  const filtered = items // already filtered server-side
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Form ───────────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setReceiptKey(null)
    setReceiptUrl(null)
    setReceiptSizeBytes(null)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (dep: Depense) => {
    setEditingId(dep.id)
    setForm({
      montant: String(dep.montant),
      devise: dep.devise,
      categorie: dep.categorie,
      categoriePersonnalisee: dep.categoriePersonnalisee ?? '',
      fournisseur: dep.fournisseur ?? '',
      description: dep.description ?? '',
      date: dep.date.slice(0, 10),
    })
    setReceiptKey(dep.receiptKey)
    setReceiptUrl(dep.receiptUrl)
    setReceiptSizeBytes(dep.receiptSizeBytes)
    setFormErrors({})
    setModalOpen(true)
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.montant || isNaN(Number(form.montant)) || Number(form.montant) <= 0)
      errs.montant = 'Le montant est requis et doit être positif.'
    if (!form.categorie) errs.categorie = 'La catégorie est requise.'
    if (form.categorie === 'AUTRE' && !form.categoriePersonnalisee.trim())
      errs.categoriePersonnalisee = t('pages.depenses.form.categorieAutreRequired')
    if (!form.date) errs.date = 'La date est requise.'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        montant: Number(form.montant),
        devise: form.devise,
        categorie: form.categorie,
        ...(form.categorie === 'AUTRE' ? { categoriePersonnalisee: form.categoriePersonnalisee.trim() } : {}),
        fournisseur: form.fournisseur || undefined,
        description: form.description || undefined,
        date: form.date,
        ...(receiptKey ? { receiptKey, receiptUrl, receiptSizeBytes } : {}),
      }
      if (editingId) {
        await depensesApi.update(editingId, payload)
        success('Dépense mise à jour.')
      } else {
        await depensesApi.create(payload)
        success('Dépense enregistrée.')
      }
      setModalOpen(false)
      load()
    } catch (e: any) {
      if (e?.response?.status === 402) {
        const errs = e.response.data?.errors
        setLimitModal({ limite: errs?.limite ?? 0, actuel: errs?.actuel ?? 0 })
      } else {
        toastError('Erreur lors de la sauvegarde.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await depensesApi.delete(deleteTarget.id)
      success('Dépense supprimée.')
      setDeleteTarget(null)
      load()
    } catch {
      toastError('Erreur lors de la suppression.')
    }
  }

  const handleExport = async () => {
    try {
      const res = await depensesApi.export({
        ...(filterCategorie ? { categorie: filterCategorie } : {}),
        ...(filterDateDebut ? { dateDebut: filterDateDebut } : {}),
        ...(filterDateFin ? { dateFin: filterDateFin } : {}),
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `depenses-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toastError("Erreur lors de l'export.")
    }
  }

  const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'
  const lbl = 'text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block'

  const getCategorieLabel = (dep: Depense) =>
    dep.categorie === 'AUTRE' && dep.categoriePersonnalisee
      ? dep.categoriePersonnalisee
      : t(`pages.depenses.categories.${dep.categorie}`)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <PageHeader
        title={t('pages.depenses.title')}
        sub={t('pages.depenses.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('pages.depenses.export')}</span>
            </button>
            {canEdit && (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('pages.depenses.add')}</span>
              </button>
            )}
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          label={t('pages.depenses.stats.total')}
          value={`${totalMontant.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD`}
          icon={Wallet}
        />
        <StatsCard
          label={t('pages.depenses.stats.thisMonth')}
          value={`${thisMontant.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} MAD`}
          icon={Wallet}
          color="teal"
        />
        <StatsCard
          label={t('pages.depenses.stats.withReceipts')}
          value={String(withReceipts)}
          icon={Image}
          color="purple"
        />
        <StatsCard
          label={t('pages.depenses.stats.receiptsThisMonth')}
          value={String(receiptsThisMonth)}
          icon={Receipt}
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder={t('pages.depenses.filters.search')}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
            />
          </div>
          <select
            value={filterCategorie}
            onChange={e => { setFilterCategorie(e.target.value); setPage(1) }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
          >
            <option value="">{t('pages.depenses.filters.allCategories')}</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{t(`pages.depenses.categories.${c}`)}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterDateDebut}
            onChange={e => { setFilterDateDebut(e.target.value); setPage(1) }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
          />
          <input
            type="date"
            value={filterDateFin}
            onChange={e => { setFilterDateFin(e.target.value); setPage(1) }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title={t('pages.depenses.empty.title')}
            desc={t('pages.depenses.empty.sub')}
            action={canEdit ? { label: t('pages.depenses.add'), onClick: openCreate } : undefined}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {(['date', 'categorie', 'fournisseur', 'montant', 'recu', 'actions'] as const).map(col => (
                      <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t(`pages.depenses.table.${col}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginated.map(dep => (
                    <tr key={dep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {new Date(dep.date).toLocaleDateString('fr-MA')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', CATEGORIE_COLORS[dep.categorie])}>
                          {getCategorieLabel(dep)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {dep.fournisseur ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {Number(dep.montant).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} {dep.devise}
                      </td>
                      <td className="px-4 py-3">
                        {dep.receiptUrl ? (
                          <button
                            onClick={() => setPreviewUrl(dep.receiptUrl!)}
                            className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:opacity-80 transition-opacity flex-shrink-0"
                          >
                            <img src={dep.receiptUrl} alt="reçu" className="w-full h-full object-cover" />
                          </button>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <ActionMenu
                          items={[
                            ...(dep.receiptUrl ? [{
                              label: t('pages.depenses.viewReceipt'),
                              icon: Eye,
                              onClick: () => setPreviewUrl(dep.receiptUrl!),
                            }] : []),
                            ...(canEdit ? [
                              {
                                label: t('pages.depenses.edit'),
                                icon: Pencil,
                                onClick: () => openEdit(dep),
                              },
                              {
                                label: t('pages.depenses.delete'),
                                icon: Trash2,
                                variant: 'danger' as const,
                                onClick: () => setDeleteTarget(dep),
                              },
                            ] : []),
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map(dep => (
                <div key={dep.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', CATEGORIE_COLORS[dep.categorie])}>
                          {getCategorieLabel(dep)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(dep.date).toLocaleDateString('fr-MA')}
                        </span>
                      </div>
                      {dep.fournisseur && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{dep.fournisseur}</p>
                      )}
                      <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {Number(dep.montant).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} {dep.devise}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {dep.receiptUrl && (
                        <button
                          onClick={() => setPreviewUrl(dep.receiptUrl!)}
                          className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                          <img src={dep.receiptUrl} alt="reçu" className="w-full h-full object-cover" />
                        </button>
                      )}
                      <ActionMenu
                        items={[
                          ...(dep.receiptUrl ? [{
                            label: t('pages.depenses.viewReceipt'),
                            icon: Eye,
                            onClick: () => setPreviewUrl(dep.receiptUrl!),
                          }] : []),
                          ...(canEdit ? [
                            {
                              label: t('pages.depenses.edit'),
                              icon: Pencil,
                              onClick: () => openEdit(dep),
                            },
                            {
                              label: t('pages.depenses.delete'),
                              icon: Trash2,
                              variant: 'danger' as const,
                              onClick: () => setDeleteTarget(dep),
                            },
                          ] : []),
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <Pagination page={page} total={filtered.length} perPage={PAGE_SIZE} onChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { if (!saving) setModalOpen(false) }}
        title={editingId ? t('pages.depenses.edit') : t('pages.depenses.add')}
        size="md"
      >
        <div className="space-y-4">
          {/* Date + Montant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>{t('pages.depenses.form.date')}</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className={cn(inp, formErrors.date && 'border-red-400')}
              />
              {formErrors.date && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" />{formErrors.date}
                </p>
              )}
            </div>
            <div>
              <label className={lbl}>{t('pages.depenses.form.montant')}</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.montant}
                  onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
                  placeholder="0.00"
                  className={cn(inp, 'pr-16', formErrors.montant && 'border-red-400')}
                />
                <select
                  value={form.devise}
                  onChange={e => setForm(f => ({ ...f, devise: e.target.value }))}
                  className="absolute right-0 top-0 h-full px-2 bg-transparent text-xs text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 rounded-r-xl focus:outline-none"
                >
                  {['MAD', 'EUR', 'USD'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              {formErrors.montant && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" />{formErrors.montant}
                </p>
              )}
            </div>
          </div>

          {/* Categorie */}
          <div>
            <label className={lbl}>{t('pages.depenses.form.categorie')}</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, categorie: c, categoriePersonnalisee: c !== 'AUTRE' ? '' : f.categoriePersonnalisee }))}
                  className={cn(
                    'px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all',
                    form.categorie === c
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                >
                  {t(`pages.depenses.categories.${c}`)}
                </button>
              ))}
            </div>
            {form.categorie === 'AUTRE' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={form.categoriePersonnalisee}
                  onChange={e => setForm(f => ({ ...f, categoriePersonnalisee: e.target.value }))}
                  placeholder={t('pages.depenses.form.categorieAutrePlaceholder')}
                  className={cn(inp, formErrors.categoriePersonnalisee && 'border-red-400')}
                  autoFocus
                />
                {formErrors.categoriePersonnalisee && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />{formErrors.categoriePersonnalisee}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Fournisseur */}
          <div>
            <label className={lbl}>{t('pages.depenses.form.fournisseur')}</label>
            <input
              type="text"
              value={form.fournisseur}
              onChange={e => setForm(f => ({ ...f, fournisseur: e.target.value }))}
              placeholder={t('pages.depenses.form.fournisseurPlaceholder')}
              className={inp}
            />
          </div>

          {/* Description */}
          <div>
            <label className={lbl}>{t('pages.depenses.form.description')}</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder={t('pages.depenses.form.descriptionPlaceholder')}
              rows={2}
              className={cn(inp, 'resize-none')}
            />
          </div>

          {/* Receipt upload */}
          <div>
            <label className={lbl}>{t('pages.depenses.form.recu')}</label>
            <ReceiptUpload
              currentUrl={receiptUrl}
              onUploaded={(key, url, size) => {
                setReceiptKey(key)
                setReceiptUrl(url)
                setReceiptSizeBytes(size)
              }}
              onError={(msg) => toastError(msg)}
              onRemove={() => { setReceiptKey(null); setReceiptUrl(null); setReceiptSizeBytes(null) }}
              t={t}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editingId ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Receipt preview modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewUrl}
              alt="Reçu"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('pages.depenses.delete')}
        message={t('pages.depenses.deleteConfirm')}
        confirmLabel="Supprimer"
        danger
      />

      {/* Plan limit modal */}
      <PlanLimitModal
        open={!!limitModal}
        resource="depenses"
        limite={limitModal?.limite ?? 0}
        actuel={limitModal?.actuel ?? 0}
        onClose={() => setLimitModal(null)}
      />
    </div>
  )
}
