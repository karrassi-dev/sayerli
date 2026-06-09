'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  FileText, Plus, Eye, Pencil, Trash2, Copy, Send, CheckCircle,
  Link, Minus, AlertCircle, X,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui/PageHeader'
import { StatsCard } from '@/components/dashboard/ui/StatsCard'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import { SearchFilter } from '@/components/dashboard/ui/SearchFilter'
import { ActionMenu } from '@/components/dashboard/ui/ActionMenu'
import { Pagination } from '@/components/dashboard/ui/Pagination'
import { EmptyState } from '@/components/dashboard/ui/EmptyState'
import { Modal, ConfirmModal } from '@/components/dashboard/ui/Modal'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { devisApi, clientsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiClient {
  id: string
  nom: string
  nomEntreprise: string | null
  email: string | null
}

interface Ligne {
  id?: string
  description: string
  quantite: number
  prixUnitaire: number
  total: number
  ordre: number
}

interface ApiDevis {
  id: string
  reference: string
  statut: string
  totalHT: number | string
  remise: number | string
  taxe: number | string
  totalTTC: number | string
  dateExpiration: string | null
  dateAcceptation: string | null
  notes: string | null
  createdAt: string
  client: { id: string; nom: string; email: string | null; nomEntreprise: string | null }
  lignes?: Ligne[]
  lienPublic?: { token: string; expiration: string } | null
  _count?: { lignes: number }
}

interface LigneForm {
  description: string
  quantite: string
  prixUnitaire: string
}

interface DevisForm {
  clientId: string
  dateExpiration: string
  taxe: string
  remise: string
  notes: string
  lignes: LigneForm[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMPTY_LIGNE: LigneForm = { description: '', quantite: '1', prixUnitaire: '' }
const EMPTY_FORM: DevisForm = {
  clientId: '', dateExpiration: '', taxe: '20', remise: '0', notes: '', lignes: [{ ...EMPTY_LIGNE }],
}
const PER_PAGE = 5

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : v }

function formatMAD(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function toStatutUI(statut: string): string {
  return statut.toLowerCase().replace('_', '_')
}

function calcLigne(l: LigneForm) {
  return (parseFloat(l.quantite) || 0) * (parseFloat(l.prixUnitaire) || 0)
}

function calcTotaux(lignes: LigneForm[], taxePct: number, remise: number) {
  const sousTotal = lignes.reduce((s, l) => s + calcLigne(l), 0)
  const totalHT = Math.max(0, sousTotal - remise)
  const totalTTC = totalHT + totalHT * (taxePct / 100)
  return { sousTotal, totalHT, totalTTC }
}

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1').replace(/\/api\/v1\/?$/, '')
function logoUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_ORIGIN}${path}`
}

// ── Form component ────────────────────────────────────────────────────────────

function DevisFormFields({
  form, errors, clients, onChange, onLigneChange, addLigne, removeLigne,
}: {
  form: DevisForm
  errors: Record<string, string>
  clients: ApiClient[]
  onChange: (field: keyof Omit<DevisForm, 'lignes'>, val: string) => void
  onLigneChange: (i: number, field: keyof LigneForm, val: string) => void
  addLigne: () => void
  removeLigne: (i: number) => void
}) {
  const { t } = useTranslation()
  const inputClass = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'
  const labelClass = 'text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block'

  const taxePct = parseFloat(form.taxe) || 0
  const remiseMtnt = parseFloat(form.remise) || 0
  const { sousTotal, totalHT, totalTTC } = calcTotaux(form.lignes, taxePct, remiseMtnt)

  return (
    <div className="space-y-5">
      {/* Client + dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>
            {t('pages.devis.form.client')} <span className="text-red-500">*</span>
          </label>
          <select
            value={form.clientId}
            onChange={e => onChange('clientId', e.target.value)}
            className={inputClass}
          >
            <option value="">{t('pages.devis.form.clientPlaceholder')}</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.nom}{c.nomEntreprise ? ` — ${c.nomEntreprise}` : ''}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" />{errors.clientId}</p>}
        </div>
        <div>
          <label className={labelClass}>{t('pages.devis.form.dateExpiration')}</label>
          <input type="date" value={form.dateExpiration} onChange={e => onChange('dateExpiration', e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>{t('pages.devis.form.taxe')}</label>
            <input type="number" min="0" max="100" step="1" value={form.taxe} onChange={e => onChange('taxe', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('pages.devis.form.remise')}</label>
            <input type="number" min="0" step="0.01" value={form.remise} onChange={e => onChange('remise', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Lines */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass}>{t('pages.devis.col.lines')}</label>
          {errors.lignes && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle className="w-3 h-3" />{errors.lignes}</p>}
        </div>

        {/* Header row */}
        <div className="hidden sm:grid grid-cols-[1fr_60px_90px_80px_28px] gap-2 mb-1 px-1">
          {[t('pages.devis.form.designation'), t('pages.devis.form.quantite'), t('pages.devis.form.prixUnitaire'), t('pages.devis.form.total'), ''].map((h, i) => (
            <span key={i} className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        <div className="space-y-2">
          {form.lignes.map((ligne, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_60px_90px_80px_28px] gap-2 items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <input
                type="text"
                placeholder={t('pages.devis.form.designation')}
                value={ligne.description}
                onChange={e => onLigneChange(i, 'description', e.target.value)}
                className={cn(inputClass, 'bg-white dark:bg-slate-800')}
              />
              <input
                type="number" min="0.001" step="any"
                placeholder="1"
                value={ligne.quantite}
                onChange={e => onLigneChange(i, 'quantite', e.target.value)}
                className={cn(inputClass, 'bg-white dark:bg-slate-800 text-center')}
              />
              <input
                type="number" min="0" step="any"
                placeholder="0.00"
                value={ligne.prixUnitaire}
                onChange={e => onLigneChange(i, 'prixUnitaire', e.target.value)}
                className={cn(inputClass, 'bg-white dark:bg-slate-800 text-right')}
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-white text-right px-2">
                {formatMAD(calcLigne(ligne))}
              </span>
              <button
                onClick={() => removeLigne(i)}
                disabled={form.lignes.length === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addLigne}
          className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('pages.devis.form.addLine')}
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>{t('pages.devis.form.notes')}</label>
        <textarea
          value={form.notes}
          onChange={e => onChange('notes', e.target.value)}
          rows={2}
          placeholder={t('pages.devis.form.notesPlaceholder')}
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      {/* Totals */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="ml-auto w-full sm:w-64 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>{t('pages.devis.form.sousTotal')}</span>
            <span className="font-medium">{formatMAD(sousTotal)}</span>
          </div>
          {remiseMtnt > 0 && (
            <div className="flex justify-between text-red-500">
              <span>{t('pages.devis.form.remise')}</span>
              <span>−{formatMAD(remiseMtnt)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>TVA {taxePct}%</span>
            <span>{formatMAD(totalTTC - totalHT)}</span>
          </div>
          <div className="flex justify-between font-black text-slate-900 dark:text-white text-base pt-1.5 border-t border-slate-200 dark:border-slate-700">
            <span>Total TTC</span>
            <span className="text-primary-600 dark:text-primary-400">{formatMAD(totalTTC)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DevisPage() {
  const { t } = useTranslation()
  const { toasts, success, error: toastError, removeToast } = useToast()

  const [devisList, setDevisList] = useState<ApiDevis[]>([])
  const [clients, setClients] = useState<ApiClient[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState<ApiDevis | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiDevis | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ApiDevis | null>(null)
  const [publicLink, setPublicLink] = useState<{ token: string; url: string } | null>(null)

  const [form, setForm] = useState<DevisForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Load data ──
  const fetchDevis = useCallback(async (q?: string, statut?: string) => {
    setLoading(true)
    setApiError(false)
    try {
      const res = await devisApi.list({
        ...(q && { recherche: q }),
        ...(statut && { statut: statut.toUpperCase() as never }),
      })
      const data = res.data?.data ?? res.data
      setDevisList(Array.isArray(data) ? data : [])
    } catch {
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchClients = useCallback(async () => {
    try {
      const res = await clientsApi.list()
      const data = res.data?.data ?? res.data
      setClients(Array.isArray(data) ? data : [])
    } catch { /* no-op */ }
  }, [])

  useEffect(() => {
    fetchDevis()
    fetchClients()
  }, [fetchDevis, fetchClients])

  const [pendingCreate, setPendingCreate] = useState(false)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('action') === 'create') {
      setPendingCreate(true)
      window.history.replaceState(null, '', '/dashboard/devis')
    }
  }, [])
  useEffect(() => {
    if (pendingCreate && !loading) { setPendingCreate(false); openCreate() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCreate, loading])

  const handleSearch = (v: string) => {
    setSearch(v)
    setPage(1)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetchDevis(v.trim() || undefined, filters.statut), 400)
  }

  const handleFilterChange = (k: string, v: string) => {
    const next = { ...filters, [k]: v }
    setFilters(next)
    setPage(1)
    fetchDevis(search.trim() || undefined, v)
  }

  // Client-side status filter (backend already filters but this also syncs)
  const filtered = devisList.filter(d => !filters.statut || d.statut === filters.statut.toUpperCase())
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const byStatus = (s: string) => devisList.filter(d => d.statut === s.toUpperCase()).length

  // ── Form validation ──
  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.clientId) errors.clientId = t('pages.devis.form.clientRequired')
    if (form.lignes.length === 0) errors.lignes = t('pages.devis.form.lignesRequired')
    form.lignes.forEach((l, i) => {
      if (!l.description.trim()) errors[`desc_${i}`] = t('pages.devis.form.designationRequired')
    })
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const toApiPayload = () => ({
    clientId: form.clientId,
    dateExpiration: form.dateExpiration || undefined,
    taxe: parseFloat(form.taxe) || 0,
    remise: parseFloat(form.remise) || 0,
    notes: form.notes.trim() || undefined,
    lignes: form.lignes.map(l => ({
      description: l.description.trim(),
      quantite: parseFloat(l.quantite) || 1,
      prixUnitaire: parseFloat(l.prixUnitaire) || 0,
    })),
  })

  // ── Handlers ──
  const openCreate = () => {
    setForm(EMPTY_FORM)
    setFormErrors({})
    setCreateOpen(true)
  }

  const handleCreate = async () => {
    if (!validateForm()) return
    setSaving(true)
    try {
      await devisApi.create(toApiPayload())
      setCreateOpen(false)
      success(t('pages.devis.createSuccess'))
      fetchDevis(search.trim() || undefined, filters.statut)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Une erreur est survenue.'))
    } finally {
      setSaving(false)
    }
  }

  const openEdit = async (d: ApiDevis) => {
    let full = d
    if (!d.lignes) {
      try {
        const res = await devisApi.get(d.id)
        full = res.data?.data ?? res.data
      } catch { /* use what we have */ }
    }
    setForm({
      clientId: full.client.id,
      dateExpiration: full.dateExpiration ? full.dateExpiration.split('T')[0] : '',
      taxe: String(n(full.taxe)),
      remise: String(n(full.remise)),
      notes: full.notes ?? '',
      lignes: (full.lignes ?? [{ description: '', quantite: 1, prixUnitaire: 0 }]).map(l => ({
        description: l.description,
        quantite: String(l.quantite),
        prixUnitaire: String(l.prixUnitaire),
      })),
    })
    setFormErrors({})
    setSelected(null)
    setEditTarget(full)
  }

  const handleEdit = async () => {
    if (!editTarget || !validateForm()) return
    setSaving(true)
    try {
      await devisApi.update(editTarget.id, toApiPayload())
      setEditTarget(null)
      success(t('pages.devis.editSuccess'))
      fetchDevis(search.trim() || undefined, filters.statut)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Une erreur est survenue.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await devisApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      success(t('pages.devis.deleteSuccess'))
      fetchDevis(search.trim() || undefined, filters.statut)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Impossible de supprimer ce devis.'))
    }
  }

  const handleSend = async (d: ApiDevis) => {
    setActionLoading(`send_${d.id}`)
    try {
      await devisApi.updateStatus(d.id, 'ENVOYE')
      success(t('pages.devis.sendSuccess'))
      fetchDevis(search.trim() || undefined, filters.statut)
      setSelected(null)
    } catch { toastError('Erreur', 'Impossible de mettre à jour le statut.') }
    finally { setActionLoading(null) }
  }

  const handleGenerateLink = async (d: ApiDevis) => {
    setActionLoading(`link_${d.id}`)
    try {
      const res = await devisApi.generateLink(d.id)
      const data = res.data?.data ?? res.data
      const token = data.token
      const url = `${window.location.origin}/public/devis/${token}`
      await navigator.clipboard.writeText(url).catch(() => {})
      setPublicLink({ token, url })
      success(t('pages.devis.linkGenerated'))
      fetchDevis(search.trim() || undefined, filters.statut)
    } catch { toastError('Erreur', 'Impossible de générer le lien.') }
    finally { setActionLoading(null) }
  }

  const handleConvert = async (d: ApiDevis) => {
    setActionLoading(`convert_${d.id}`)
    try {
      await devisApi.convertToInvoice(d.id)
      setSelected(null)
      success(t('pages.devis.convertSuccess'))
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Impossible de convertir.'))
    }
    finally { setActionLoading(null) }
  }

  const handleOpenDetail = async (d: ApiDevis) => {
    if (d.lignes) { setSelected(d); return }
    try {
      const res = await devisApi.get(d.id)
      setSelected(res.data?.data ?? res.data)
    } catch { setSelected(d) }
  }

  // ── Form helpers ──
  const handleFormChange = (field: keyof Omit<DevisForm, 'lignes'>, val: string) => {
    setForm(f => ({ ...f, [field]: val }))
    if (formErrors[field]) setFormErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const handleLigneChange = (i: number, field: keyof LigneForm, val: string) => {
    setForm(f => {
      const lignes = [...f.lignes]
      lignes[i] = { ...lignes[i], [field]: val }
      return { ...f, lignes }
    })
  }

  const addLigne = () => setForm(f => ({ ...f, lignes: [...f.lignes, { ...EMPTY_LIGNE }] }))
  const removeLigne = (i: number) => setForm(f => ({ ...f, lignes: f.lignes.filter((_, idx) => idx !== i) }))

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

  const statusFilters = [
    { value: 'BROUILLON', label: t('statuses.brouillon') },
    { value: 'ENVOYE', label: t('statuses.envoye') },
    { value: 'VU', label: t('statuses.vu') },
    { value: 'ACCEPTE', label: t('statuses.accepte') },
    { value: 'REFUSE', label: t('statuses.refuse') },
  ]

  return (
    <div>
      <PageHeader
        title={t('pages.devis.title')}
        sub={t('pages.devis.sub')}
        actions={
          <button className="btn-primary text-sm" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            {t('pages.devis.createDevis')}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard label={t('statuses.brouillon')} value={loading ? '—' : byStatus('BROUILLON')} icon={FileText} color="blue" />
        <StatsCard label={t('statuses.envoye')} value={loading ? '—' : byStatus('ENVOYE')} icon={Send} color="teal" />
        <StatsCard label={t('statuses.accepte')} value={loading ? '—' : byStatus('ACCEPTE')} icon={CheckCircle} color="green" />
        <StatsCard label={t('statuses.refuse')} value={loading ? '—' : byStatus('REFUSE')} icon={FileText} color="red" />
      </div>

      {/* Search & Filters */}
      <SearchFilter
        value={search}
        onChange={handleSearch}
        placeholder={t('pages.devis.searchPlaceholder')}
        filters={[{ key: 'statut', label: t('common.status'), options: statusFilters }]}
        activeFilters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
          </div>
        ) : apiError ? (
          <EmptyState icon={FileText} title="Erreur de chargement" desc="Impossible de charger les devis." color="teal" />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('pages.devis.empty.title')}
            desc={t('pages.devis.empty.desc')}
            action={{ label: t('pages.devis.createDevis'), onClick: openCreate }}
            color="teal"
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    {[t('pages.devis.col.reference'), t('pages.devis.col.client'), t('pages.devis.col.statut'), t('pages.devis.col.amount'), t('pages.devis.col.expiry'), ''].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {paginated.map(devis => (
                    <tr key={devis.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer" onClick={() => handleOpenDetail(devis)}>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white">{devis.reference}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{devis.client.nom}</p>
                        <p className="text-xs text-slate-400">{devis.client.nomEntreprise || '—'}</p>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge variant={toStatutUI(devis.statut) as never} dot /></td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatMAD(devis.totalTTC)}</p>
                        <p className="text-xs text-slate-400">HT: {formatMAD(devis.totalHT)}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(devis.dateExpiration)}</td>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <ActionMenu items={[
                          { label: t('common.view'), icon: Eye, onClick: () => handleOpenDetail(devis) },
                          ...(devis.statut === 'BROUILLON' || devis.statut === 'ENVOYE' ? [{ label: t('common.edit'), icon: Pencil, onClick: () => openEdit(devis) }] : []),
                          { label: t('pages.devis.actions.send'), icon: Send, onClick: () => handleSend(devis) },
                          { label: t('pages.devis.actions.duplicate'), icon: Link, onClick: () => handleGenerateLink(devis) },
                          ...(devis.statut === 'ACCEPTE' ? [{ label: t('pages.devis.actions.convert'), icon: CheckCircle, onClick: () => handleConvert(devis) }] : []),
                          ...(devis.statut === 'BROUILLON' ? [{ label: t('common.delete'), icon: Trash2, onClick: () => setDeleteTarget(devis), variant: 'danger' as const, separator: true }] : []),
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map(devis => (
                <div key={devis.id} className="p-4 cursor-pointer" onClick={() => handleOpenDetail(devis)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-slate-500">{devis.reference}</span>
                    <StatusBadge variant={toStatutUI(devis.statut) as never} dot size="sm" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{devis.client.nom}</p>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">{devis.client.nomEntreprise || '—'}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatMAD(devis.totalTTC)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3">
              <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.reference ?? ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t('pages.devis.col.client')}</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selected.client.nom}</p>
                <p className="text-xs text-slate-500">{selected.client.nomEntreprise || '—'}</p>
              </div>
              <StatusBadge variant={toStatutUI(selected.statut) as never} dot />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Total HT</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{formatMAD(selected.totalHT)}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">TVA {n(selected.taxe)}%</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{formatMAD(n(selected.totalTTC) - n(selected.totalHT))}</p>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-950/50 rounded-xl">
                <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">Total TTC</p>
                <p className="font-black text-primary-700 dark:text-primary-300 text-sm">{formatMAD(selected.totalTTC)}</p>
              </div>
            </div>

            {selected.lignes && selected.lignes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('pages.devis.col.lines')}</p>
                <div className="space-y-1.5">
                  {selected.lignes.map((l, i) => (
                    <div key={l.id ?? i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm">
                      <span className="text-slate-700 dark:text-slate-300 flex-1 truncate">{l.description}</span>
                      <span className="text-slate-500 mx-4 shrink-0">×{n(l.quantite)}</span>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0">{formatMAD(n(l.quantite) * n(l.prixUnitaire))}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.notes && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{t('pages.devis.form.notes')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{selected.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div><span className="font-medium">Expiration :</span> {formatDate(selected.dateExpiration)}</div>
              {selected.dateAcceptation && <div><span className="font-medium">Accepté :</span> {formatDate(selected.dateAcceptation)}</div>}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(selected.statut === 'BROUILLON' || selected.statut === 'ENVOYE') && (
                <button
                  onClick={() => openEdit(selected)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  {t('common.edit')}
                </button>
              )}
              {selected.statut === 'BROUILLON' && (
                <button
                  onClick={() => handleSend(selected)}
                  disabled={actionLoading === `send_${selected.id}`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 transition-all"
                >
                  {actionLoading === `send_${selected.id}` ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {t('pages.devis.actions.send')}
                </button>
              )}
              <button
                onClick={() => handleGenerateLink(selected)}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 transition-all"
              >
                <Link className="w-3.5 h-3.5" />
                {t('pages.devis.actions.duplicate')}
              </button>
              {selected.statut === 'ACCEPTE' && (
                <button
                  onClick={() => handleConvert(selected)}
                  disabled={actionLoading === `convert_${selected.id}`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-all"
                >
                  {actionLoading === `convert_${selected.id}` ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  {t('pages.devis.actions.convert')}
                </button>
              )}
              {selected.statut === 'BROUILLON' && (
                <button
                  onClick={() => { setDeleteTarget(selected); setSelected(null) }}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  {t('common.delete')}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Public link modal */}
      <Modal open={!!publicLink} onClose={() => setPublicLink(null)} title={t('pages.devis.linkGenerated')} size="sm">
        {publicLink && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">Partagez ce lien avec votre client :</p>
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 flex-1 break-all">{publicLink.url}</span>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(publicLink.url).catch(() => {})
                  success(t('pages.devis.linkCopied'))
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex-shrink-0"
              >
                <Copy className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t('pages.devis.create')}
        size="lg"
        footer={formFooter(handleCreate)}
      >
        <DevisFormFields
          form={form} errors={formErrors} clients={clients}
          onChange={handleFormChange} onLigneChange={handleLigneChange}
          addLigne={addLigne} removeLigne={removeLigne}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={t('pages.devis.edit')}
        size="lg"
        footer={formFooter(handleEdit)}
      >
        <DevisFormFields
          form={form} errors={formErrors} clients={clients}
          onChange={handleFormChange} onLigneChange={handleLigneChange}
          addLigne={addLigne} removeLigne={removeLigne}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('pages.devis.deleteTitle')}
        message={t('pages.devis.deleteMessage').replace('{ref}', deleteTarget?.reference ?? '')}
        confirmLabel={t('common.delete')}
        danger
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
