'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Receipt, Plus, Eye, Pencil, Trash2, Send, CreditCard,
  TrendingUp, Clock, AlertTriangle, X, AlertCircle, Link,
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
import { facturesApi, clientsApi, paiementsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiClient {
  id: string
  nom: string
  nomEntreprise: string | null
  email: string | null
}

interface FactureLigne {
  id?: string
  description: string
  quantite: number | string
  prixUnitaire: number | string
  total: number | string
  ordre: number
}

interface ApiFacture {
  id: string
  numeroFacture: string
  statut: string
  totalHT: number | string
  taxe: number | string
  totalTTC: number | string
  montantPaye: number | string
  dateEcheance: string | null
  notes: string | null
  devisId: string | null
  publicToken: string
  createdAt: string
  client: { id: string; nom: string; email: string | null; nomEntreprise: string | null }
  lignes?: FactureLigne[]
  devis?: { id: string; reference: string } | null
  paiements?: { id: string; montant: number | string; methode: string; reference: string | null; datePaiement: string }[]
  _count?: { lignes: number; paiements: number; declarationsPaiement: number }
}

interface LigneForm {
  description: string
  quantite: string
  prixUnitaire: string
}

interface FactureForm {
  clientId: string
  dateEcheance: string
  taxe: string
  notes: string
  lignes: LigneForm[]
}

interface PaiementForm {
  montant: string
  methode: string
  reference: string
  datePaiement: string
  notes: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMPTY_LIGNE: LigneForm = { description: '', quantite: '1', prixUnitaire: '' }
const EMPTY_FORM: FactureForm = {
  clientId: '', dateEcheance: '', taxe: '20', notes: '', lignes: [{ ...EMPTY_LIGNE }],
}
const EMPTY_PAIEMENT: PaiementForm = {
  montant: '', methode: 'VIREMENT', reference: '', datePaiement: new Date().toISOString().split('T')[0], notes: '',
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
  return statut.toLowerCase()
}

function calcLigne(l: LigneForm) {
  return (parseFloat(l.quantite) || 0) * (parseFloat(l.prixUnitaire) || 0)
}

function calcTotaux(lignes: LigneForm[], taxePct: number) {
  const sousTotal = lignes.reduce((s, l) => s + calcLigne(l), 0)
  const totalTTC = sousTotal + sousTotal * (taxePct / 100)
  return { sousTotal, totalTTC }
}

// ── Form component ─────────────────────────────────────────────────────────────

function FactureFormFields({
  form, errors, clients, onChange, onLigneChange, addLigne, removeLigne,
}: {
  form: FactureForm
  errors: Record<string, string>
  clients: ApiClient[]
  onChange: (field: keyof Omit<FactureForm, 'lignes'>, val: string) => void
  onLigneChange: (i: number, field: keyof LigneForm, val: string) => void
  addLigne: () => void
  removeLigne: (i: number) => void
}) {
  const { t } = useTranslation()
  const inputClass = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'
  const labelClass = 'text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block'

  const taxePct = parseFloat(form.taxe) || 0
  const { sousTotal, totalTTC } = calcTotaux(form.lignes, taxePct)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>
            {t('pages.factures.form.client')} <span className="text-red-500">*</span>
          </label>
          <select value={form.clientId} onChange={e => onChange('clientId', e.target.value)} className={inputClass}>
            <option value="">{t('pages.factures.form.clientPlaceholder')}</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.nom}{c.nomEntreprise ? ` — ${c.nomEntreprise}` : ''}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" />{errors.clientId}</p>}
        </div>
        <div>
          <label className={labelClass}>{t('pages.factures.form.dateEcheance')}</label>
          <input type="date" value={form.dateEcheance} onChange={e => onChange('dateEcheance', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('pages.factures.form.taxe')}</label>
          <input type="number" min="0" max="100" step="1" value={form.taxe} onChange={e => onChange('taxe', e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Lines */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass}>{t('pages.factures.col.lines')}</label>
          {errors.lignes && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle className="w-3 h-3" />{errors.lignes}</p>}
        </div>

        <div className="hidden sm:grid grid-cols-[1fr_60px_90px_80px_28px] gap-2 mb-1 px-1">
          {[t('pages.factures.form.designation'), t('pages.factures.form.quantite'), t('pages.factures.form.prixUnitaire'), t('pages.factures.form.total'), ''].map((h, i) => (
            <span key={i} className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        <div className="space-y-2">
          {form.lignes.map((ligne, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_60px_90px_80px_28px] gap-2 items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <input
                type="text"
                placeholder={t('pages.factures.form.designation')}
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
          {t('pages.factures.form.addLine')}
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>{t('pages.factures.form.notes')}</label>
        <textarea
          value={form.notes}
          onChange={e => onChange('notes', e.target.value)}
          rows={2}
          placeholder={t('pages.factures.form.notesPlaceholder')}
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      {/* Totals */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="ml-auto w-full sm:w-64 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>{t('pages.factures.form.sousTotal')}</span>
            <span className="font-medium">{formatMAD(sousTotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>TVA {taxePct}%</span>
            <span>{formatMAD(totalTTC - sousTotal)}</span>
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

export default function FacturesPage() {
  const { t } = useTranslation()
  const { toasts, success, error: toastError, removeToast } = useToast()

  const [facturesList, setFacturesList] = useState<ApiFacture[]>([])
  const [clients, setClients] = useState<ApiClient[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState<ApiFacture | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiFacture | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ApiFacture | null>(null)
  const [paymentTarget, setPaymentTarget] = useState<ApiFacture | null>(null)

  const [form, setForm] = useState<FactureForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [paiementForm, setPaiementForm] = useState<PaiementForm>(EMPTY_PAIEMENT)
  const [paiementErrors, setPaiementErrors] = useState<Record<string, string>>({})
  const [savingPaiement, setSavingPaiement] = useState(false)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Load data ──
  const fetchFactures = useCallback(async (q?: string, statut?: string) => {
    setLoading(true)
    setApiError(false)
    try {
      const res = await facturesApi.list({
        ...(q && { recherche: q }),
        ...(statut && { statut: statut.toUpperCase() as never }),
      })
      const data = res.data?.data ?? res.data
      setFacturesList(Array.isArray(data) ? data : [])
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
    fetchFactures()
    fetchClients()
  }, [fetchFactures, fetchClients])

  const [pendingCreate, setPendingCreate] = useState(false)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('action') === 'create') {
      setPendingCreate(true)
      window.history.replaceState(null, '', '/dashboard/factures')
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
    searchTimer.current = setTimeout(() => fetchFactures(v.trim() || undefined, filters.statut), 400)
  }

  const handleFilterChange = (k: string, v: string) => {
    const next = { ...filters, [k]: v }
    setFilters(next)
    setPage(1)
    fetchFactures(search.trim() || undefined, v)
  }

  const filtered = facturesList.filter(f => !filters.statut || f.statut === filters.statut.toUpperCase())
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // ── Stats ──
  const totalPaid = facturesList.reduce((s, f) => s + n(f.montantPaye), 0)
  const pending = facturesList
    .filter(f => f.statut === 'ENVOYEE' || f.statut === 'PARTIELLE')
    .reduce((s, f) => s + Math.max(0, n(f.totalTTC) - n(f.montantPaye)), 0)
  const overdueCount = facturesList.filter(f => f.statut === 'EN_RETARD').length

  // ── Form validation ──
  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.clientId) errors.clientId = t('pages.factures.form.clientRequired')
    if (form.lignes.length === 0) errors.lignes = t('pages.factures.form.lignesRequired')
    form.lignes.forEach((l, i) => {
      if (!l.description.trim()) errors[`desc_${i}`] = t('pages.factures.form.designationRequired')
    })
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const toApiPayload = () => ({
    clientId: form.clientId,
    dateEcheance: form.dateEcheance || undefined,
    taxe: parseFloat(form.taxe) || 0,
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
      await facturesApi.create(toApiPayload())
      setCreateOpen(false)
      success(t('pages.factures.createSuccess'))
      fetchFactures(search.trim() || undefined, filters.statut)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Une erreur est survenue.'))
    } finally {
      setSaving(false)
    }
  }

  const openEdit = async (f: ApiFacture) => {
    let full = f
    if (!f.lignes) {
      try {
        const res = await facturesApi.get(f.id)
        full = res.data?.data ?? res.data
      } catch { /* use what we have */ }
    }
    setForm({
      clientId: full.client.id,
      dateEcheance: full.dateEcheance ? full.dateEcheance.split('T')[0] : '',
      taxe: String(n(full.taxe)),
      notes: full.notes ?? '',
      lignes: (full.lignes ?? [{ description: '', quantite: 1, prixUnitaire: 0, total: 0, ordre: 0 }]).map(l => ({
        description: l.description,
        quantite: String(n(l.quantite)),
        prixUnitaire: String(n(l.prixUnitaire)),
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
      await facturesApi.update(editTarget.id, toApiPayload())
      setEditTarget(null)
      success(t('pages.factures.editSuccess'))
      fetchFactures(search.trim() || undefined, filters.statut)
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
      await facturesApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      success(t('pages.factures.deleteSuccess'))
      fetchFactures(search.trim() || undefined, filters.statut)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Impossible de supprimer cette facture.'))
    }
  }

  const handleSend = async (f: ApiFacture) => {
    setActionLoading(`send_${f.id}`)
    try {
      const res = await facturesApi.send(f.id)
      const data = res.data?.data ?? res.data
      const url = `${window.location.origin}/public/factures/${data.publicToken}`
      await navigator.clipboard.writeText(url).catch(() => {})
      success(t('pages.factures.sendSuccess'))
      fetchFactures(search.trim() || undefined, filters.statut)
      setSelected(null)
    } catch { toastError('Erreur', 'Impossible d\'envoyer cette facture.') }
    finally { setActionLoading(null) }
  }

  const handleCopyLink = async (f: ApiFacture) => {
    setActionLoading(`link_${f.id}`)
    try {
      const res = await facturesApi.send(f.id)
      const data = res.data?.data ?? res.data
      const url = `${window.location.origin}/public/factures/${data.publicToken}`
      await navigator.clipboard.writeText(url).catch(() => {})
      success(t('pages.factures.linkCopied'))
    } catch { toastError('Erreur', t('pages.factures.linkError')) }
    finally { setActionLoading(null) }
  }

  const handleOpenDetail = async (f: ApiFacture) => {
    if (f.lignes) { setSelected(f); return }
    try {
      const res = await facturesApi.get(f.id)
      setSelected(res.data?.data ?? res.data)
    } catch { setSelected(f) }
  }

  const openPaiement = async (f: ApiFacture) => {
    let full = f
    if (!f.lignes) {
      try {
        const res = await facturesApi.get(f.id)
        full = res.data?.data ?? res.data
      } catch { /* use what we have */ }
    }
    setPaiementForm({
      ...EMPTY_PAIEMENT,
      montant: String(Math.max(0, n(full.totalTTC) - n(full.montantPaye))),
    })
    setPaiementErrors({})
    setSelected(null)
    setPaymentTarget(full)
  }

  const validatePaiement = (restant: number) => {
    const errors: Record<string, string> = {}
    const montant = parseFloat(paiementForm.montant) || 0
    if (!paiementForm.montant) errors.montant = t('pages.factures.payment.montantRequired')
    else if (montant <= 0) errors.montant = t('pages.factures.payment.montantInvalid')
    else if (montant > restant + 0.01) errors.montant = t('pages.factures.payment.montantExceeds')
    setPaiementErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePaiement = async () => {
    if (!paymentTarget) return
    const restant = Math.max(0, n(paymentTarget.totalTTC) - n(paymentTarget.montantPaye))
    if (!validatePaiement(restant)) return
    setSavingPaiement(true)
    try {
      await paiementsApi.create({
        factureId: paymentTarget.id,
        montant: parseFloat(paiementForm.montant),
        methode: paiementForm.methode,
        reference: paiementForm.reference.trim() || undefined,
        datePaiement: paiementForm.datePaiement || undefined,
        notes: paiementForm.notes.trim() || undefined,
      })
      setPaymentTarget(null)
      success(t('pages.factures.paymentSuccess'))
      fetchFactures(search.trim() || undefined, filters.statut)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Impossible d\'enregistrer le paiement.'))
    } finally {
      setSavingPaiement(false)
    }
  }

  // ── Form helpers ──
  const handleFormChange = (field: keyof Omit<FactureForm, 'lignes'>, val: string) => {
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
    { value: 'ENVOYEE', label: t('statuses.envoyee') },
    { value: 'PAYEE', label: t('statuses.payee') },
    { value: 'PARTIELLE', label: t('statuses.partielle') },
    { value: 'EN_RETARD', label: t('statuses.enRetard') },
  ]

  const inputClass = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'
  const labelClass = 'text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block'

  return (
    <div>
      <PageHeader
        title={t('pages.factures.title')}
        sub={t('pages.factures.sub')}
        actions={
          <button className="btn-primary text-sm" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            {t('pages.factures.createFacture')}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard
          label={t('pages.factures.stats.paid')}
          value={loading ? '—' : formatMAD(totalPaid)}
          sub={`${facturesList.filter(f => f.statut === 'PAYEE').length} factures`}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          label={t('pages.factures.stats.pending')}
          value={loading ? '—' : formatMAD(pending)}
          sub={`${facturesList.filter(f => f.statut === 'ENVOYEE' || f.statut === 'PARTIELLE').length} factures`}
          icon={Clock}
          color="blue"
        />
        <StatsCard
          label={t('pages.factures.stats.overdue')}
          value={loading ? '—' : overdueCount}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          label={t('pages.factures.stats.total')}
          value={loading ? '—' : facturesList.length}
          icon={Receipt}
          color="purple"
        />
      </div>

      {/* Search & Filters */}
      <SearchFilter
        value={search}
        onChange={handleSearch}
        placeholder={t('pages.factures.searchPlaceholder')}
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
          <EmptyState icon={Receipt} title="Erreur de chargement" desc="Impossible de charger les factures." color="purple" />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={t('pages.factures.empty.title')}
            desc={t('pages.factures.empty.desc')}
            action={{ label: t('pages.factures.createFacture'), onClick: openCreate }}
            color="purple"
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    {[
                      t('pages.factures.col.number'),
                      t('pages.factures.col.client'),
                      t('pages.factures.col.amount'),
                      t('pages.factures.col.paid'),
                      t('pages.factures.col.statut'),
                      t('pages.factures.col.dueDate'),
                      '',
                    ].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {paginated.map(facture => {
                    const isOverdue = facture.statut === 'EN_RETARD'
                    const pctPaid = n(facture.totalTTC) > 0
                      ? Math.min(100, (n(facture.montantPaye) / n(facture.totalTTC)) * 100)
                      : 0
                    return (
                      <tr
                        key={facture.id}
                        className={cn(
                          'hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer',
                          isOverdue && 'bg-red-50/30 dark:bg-red-950/10',
                        )}
                        onClick={() => handleOpenDetail(facture)}
                      >
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-mono font-semibold text-slate-900 dark:text-white">{facture.numeroFacture}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{facture.client.nom}</p>
                          <p className="text-xs text-slate-400">{facture.client.nomEntreprise || '—'}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{formatMAD(facture.totalTTC)}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">{formatMAD(facture.montantPaye)}</span>
                              <span className={facture.statut === 'PAYEE' ? 'text-green-600' : 'text-amber-600'}>
                                {Math.round(pctPaid)}%
                              </span>
                            </div>
                            <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                              <div
                                className={cn('h-1.5 rounded-full transition-all', facture.statut === 'PAYEE' ? 'bg-green-500' : 'bg-amber-500')}
                                style={{ width: `${pctPaid}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge variant={toStatutUI(facture.statut) as never} dot />
                        </td>
                        <td className={cn('px-4 py-3.5 text-xs', isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500')}>
                          {formatDate(facture.dateEcheance)}
                        </td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <ActionMenu items={[
                            { label: t('common.view'), icon: Eye, onClick: () => handleOpenDetail(facture) },
                            ...(facture.statut === 'BROUILLON' ? [{ label: t('pages.factures.actions.send'), icon: Send, onClick: () => handleSend(facture) }] : []),
                            ...(facture.statut !== 'BROUILLON' ? [{ label: t('pages.factures.actions.copyLink'), icon: Link, onClick: () => handleCopyLink(facture) }] : []),
                            ...(facture.statut === 'BROUILLON' || facture.statut === 'ENVOYEE' ? [{ label: t('common.edit'), icon: Pencil, onClick: () => openEdit(facture) }] : []),
                            ...(facture.statut !== 'PAYEE' && facture.statut !== 'BROUILLON' ? [{ label: t('pages.factures.actions.recordPayment'), icon: CreditCard, onClick: () => openPaiement(facture) }] : []),
                            ...(facture.statut === 'BROUILLON' ? [{ label: t('common.delete'), icon: Trash2, onClick: () => setDeleteTarget(facture), variant: 'danger' as const, separator: true }] : []),
                          ]} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map(facture => (
                <div
                  key={facture.id}
                  className={cn('p-4 cursor-pointer', facture.statut === 'EN_RETARD' && 'bg-red-50/40 dark:bg-red-950/10')}
                  onClick={() => handleOpenDetail(facture)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-slate-500">{facture.numeroFacture}</span>
                    <StatusBadge variant={toStatutUI(facture.statut) as never} dot size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{facture.client.nom}</p>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{formatMAD(facture.totalTTC)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{t('pages.factures.col.dueDate')}: {formatDate(facture.dateEcheance)}</p>
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
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.numeroFacture ?? ''} size="lg">
        {selected && (() => {
          const restant = Math.max(0, n(selected.totalTTC) - n(selected.montantPaye))
          const pctPaid = n(selected.totalTTC) > 0
            ? Math.min(100, (n(selected.montantPaye) / n(selected.totalTTC)) * 100)
            : 0
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">{t('pages.factures.col.client')}</p>
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

              {/* Payment progress */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">{t('pages.factures.stats.paid')}</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatMAD(selected.montantPaye)} / {formatMAD(selected.totalTTC)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={cn('h-2 rounded-full transition-all', selected.statut === 'PAYEE' ? 'bg-green-500' : 'bg-amber-500')}
                    style={{ width: `${pctPaid}%` }}
                  />
                </div>
                {restant > 0 && (
                  <p className="text-xs text-slate-400 mt-1.5">
                    Reste à payer : <span className="font-semibold text-slate-600 dark:text-slate-300">{formatMAD(restant)}</span>
                  </p>
                )}
              </div>

              {/* Lines */}
              {selected.lignes && selected.lignes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('pages.factures.col.lines')}</p>
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
                  <p className="text-xs text-slate-400 mb-1">{t('pages.factures.form.notes')}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selected.notes}</p>
                </div>
              )}

              {selected.devis && (
                <div className="text-xs text-slate-500">
                  <span className="font-medium">{t('pages.factures.col.devis')} :</span> {selected.devis.reference}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                {selected.dateEcheance && (
                  <div><span className="font-medium">Échéance :</span> {formatDate(selected.dateEcheance)}</div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selected.statut === 'BROUILLON' && (
                  <button
                    onClick={() => handleSend(selected)}
                    disabled={actionLoading === `send_${selected.id}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 transition-all"
                  >
                    {actionLoading === `send_${selected.id}` ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {t('pages.factures.actions.send')}
                  </button>
                )}
                {selected.statut !== 'BROUILLON' && (
                  <button
                    onClick={() => handleCopyLink(selected)}
                    disabled={actionLoading === `link_${selected.id}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 transition-all"
                  >
                    {actionLoading === `link_${selected.id}` ? <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /> : <Link className="w-3.5 h-3.5" />}
                    {t('pages.factures.actions.copyLink')}
                  </button>
                )}
                {(selected.statut === 'BROUILLON' || selected.statut === 'ENVOYEE') && (
                  <button
                    onClick={() => openEdit(selected)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    {t('common.edit')}
                  </button>
                )}
                {selected.statut !== 'PAYEE' && selected.statut !== 'BROUILLON' && (
                  <button
                    onClick={() => openPaiement(selected)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    {t('pages.factures.actions.recordPayment')}
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
          )
        })()}
      </Modal>

      {/* Payment modal */}
      <Modal
        open={!!paymentTarget}
        onClose={() => setPaymentTarget(null)}
        title={t('pages.factures.payment.title')}
        size="sm"
        footer={
          <>
            <button
              onClick={() => setPaymentTarget(null)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handlePaiement}
              disabled={savingPaiement}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {savingPaiement && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <CreditCard className="w-4 h-4" />
              {t('pages.factures.actions.recordPayment')}
            </button>
          </>
        }
      >
        {paymentTarget && (() => {
          const restant = Math.max(0, n(paymentTarget.totalTTC) - n(paymentTarget.montantPaye))
          return (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">{paymentTarget.numeroFacture}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{paymentTarget.client.nom}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{t('pages.factures.payment.restant')}</p>
                  <p className="text-sm font-black text-amber-600 dark:text-amber-400">{formatMAD(restant)}</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  {t('pages.factures.payment.montant')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" min="0.01" step="0.01"
                  value={paiementForm.montant}
                  onChange={e => { setPaiementForm(f => ({ ...f, montant: e.target.value })); setPaiementErrors(e2 => { const n2 = { ...e2 }; delete n2.montant; return n2 }) }}
                  className={inputClass}
                  placeholder="0.00"
                />
                {paiementErrors.montant && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" />{paiementErrors.montant}</p>}
              </div>

              <div>
                <label className={labelClass}>{t('pages.factures.payment.methode')}</label>
                <select
                  value={paiementForm.methode}
                  onChange={e => setPaiementForm(f => ({ ...f, methode: e.target.value }))}
                  className={inputClass}
                >
                  {['CASH', 'VIREMENT', 'CARTE', 'CHEQUE', 'MOBILE'].map(m => (
                    <option key={m} value={m}>{t(`methodes.${m.toLowerCase()}`)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t('pages.factures.payment.reference')}</label>
                  <input
                    type="text"
                    value={paiementForm.reference}
                    onChange={e => setPaiementForm(f => ({ ...f, reference: e.target.value }))}
                    placeholder={t('pages.factures.payment.referencePlaceholder')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('pages.factures.payment.date')}</label>
                  <input
                    type="date"
                    value={paiementForm.datePaiement}
                    onChange={e => setPaiementForm(f => ({ ...f, datePaiement: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('pages.factures.payment.notes')}</label>
                <textarea
                  value={paiementForm.notes}
                  onChange={e => setPaiementForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className={cn(inputClass, 'resize-none')}
                  placeholder="..."
                />
              </div>
            </div>
          )
        })()}
      </Modal>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t('pages.factures.create')}
        size="lg"
        footer={formFooter(handleCreate)}
      >
        <FactureFormFields
          form={form} errors={formErrors} clients={clients}
          onChange={handleFormChange} onLigneChange={handleLigneChange}
          addLigne={addLigne} removeLigne={removeLigne}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={t('pages.factures.edit')}
        size="lg"
        footer={formFooter(handleEdit)}
      >
        <FactureFormFields
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
        title={t('pages.factures.deleteTitle')}
        message={t('pages.factures.deleteMessage').replace('{num}', deleteTarget?.numeroFacture ?? '')}
        confirmLabel={t('common.delete')}
        danger
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
