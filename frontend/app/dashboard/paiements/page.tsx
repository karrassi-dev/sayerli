'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CreditCard, TrendingUp, Clock, CheckCircle,
  Eye, Trash2, Plus, Calendar, Hash,
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
import { paiementsApi, facturesApi } from '@/lib/api'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiPaiement {
  id: string
  factureId: string
  montant: number | string
  methode: string
  reference: string | null
  datePaiement: string
  notes: string | null
  createdAt: string
  facture: {
    id: string
    numeroFacture: string
    totalTTC: number | string
    montantPaye: number | string
    client: { id: string; nom: string; nomEntreprise: string | null; email: string | null }
  }
}

interface ApiFacture {
  id: string
  numeroFacture: string
  statut: string
  totalTTC: number | string
  montantPaye: number | string
  client: { id: string; nom: string; nomEntreprise: string | null }
}

interface ApiStats {
  totalRecu: number
  ceMois: number
  cetteAnnee: number
  enAttente: number
}

interface PaiementForm {
  factureId: string
  montant: string
  methode: string
  reference: string
  datePaiement: string
  notes: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function n(v: number | string | null | undefined): number {
  return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0)
}

function formatMAD(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function methodeUI(m: string): 'cash' | 'virement' | 'carte' | 'cheque' | 'mobile' {
  return m.toLowerCase() as 'cash' | 'virement' | 'carte' | 'cheque' | 'mobile'
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PER_PAGE = 10

const METHOD_ICONS: Record<string, string> = {
  CASH: '💵', VIREMENT: '🏦', CARTE: '💳', CHEQUE: '📝', MOBILE: '📱',
}

const METHODS = ['CASH', 'VIREMENT', 'CARTE', 'CHEQUE', 'MOBILE']

const EMPTY_FORM: PaiementForm = {
  factureId: '',
  montant: '',
  methode: 'VIREMENT',
  reference: '',
  datePaiement: todayISO(),
  notes: '',
}

const PAYABLE_STATUTS = ['ENVOYEE', 'PARTIELLE', 'EN_RETARD']

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaiementsPage() {
  const { t } = useTranslation()
  const { toasts, success, error: toastError, removeToast } = useToast()

  const [paiements, setPaiements] = useState<ApiPaiement[]>([])
  const [stats, setStats] = useState<ApiStats | null>(null)
  const [facturesPayables, setFacturesPayables] = useState<ApiFacture[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'table' | 'timeline'>('table')

  const [selected, setSelected] = useState<ApiPaiement | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ApiPaiement | null>(null)

  const [form, setForm] = useState<PaiementForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // ── Fetchers ───────────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, sRes] = await Promise.all([
        paiementsApi.list(),
        paiementsApi.stats(),
      ])
      const pData = pRes.data?.data ?? pRes.data ?? []
      const sData = sRes.data?.data ?? sRes.data ?? {}
      setPaiements(Array.isArray(pData) ? pData : [])
      setStats(sData)
    } catch {
      toastError('Erreur', 'Impossible de charger les paiements.')
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFacturesPayables = useCallback(async () => {
    try {
      const res = await facturesApi.list()
      const data: ApiFacture[] = res.data?.data ?? res.data ?? []
      setFacturesPayables(
        Array.isArray(data) ? data.filter(f => PAYABLE_STATUTS.includes(f.statut)) : [],
      )
    } catch {
      // silent — form will show empty
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const [pendingCreate, setPendingCreate] = useState(false)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('action') === 'create') {
      setPendingCreate(true)
      window.history.replaceState(null, '', '/dashboard/paiements')
    }
  }, [])
  useEffect(() => {
    if (pendingCreate && !loading) { setPendingCreate(false); openCreate() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCreate, loading])

  // ── Derived ────────────────────────────────────────────────────────────────

  const filtered = paiements.filter(p => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      p.facture.client.nom.toLowerCase().includes(q) ||
      p.facture.numeroFacture.toLowerCase().includes(q) ||
      (p.reference ?? '').toLowerCase().includes(q)
    const matchMethod = !filters.methode || p.methode === filters.methode.toUpperCase()
    return matchSearch && matchMethod
  })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // ── Form helpers ───────────────────────────────────────────────────────────

  function selectedFacture(id: string) {
    return facturesPayables.find(f => f.id === id) ?? null
  }

  function restantFacture(facture: ApiFacture | null) {
    if (!facture) return 0
    return Math.max(0, n(facture.totalTTC) - n(facture.montantPaye))
  }

  function validateForm(isEdit = false): boolean {
    const errors: Record<string, string> = {}
    if (!isEdit && !form.factureId) errors.factureId = t('pages.paiements.form.factureRequired')
    const montant = parseFloat(form.montant)
    if (!form.montant) {
      errors.montant = t('pages.paiements.form.montantRequired')
    } else if (isNaN(montant) || montant <= 0) {
      errors.montant = t('pages.paiements.form.montantInvalid')
    } else if (!isEdit) {
      const facture = selectedFacture(form.factureId)
      const restant = restantFacture(facture)
      if (montant > restant + 0.01) errors.montant = t('pages.paiements.form.montantExceeds')
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function openCreate() {
    setForm({ ...EMPTY_FORM, datePaiement: todayISO() })
    setFormErrors({})
    fetchFacturesPayables()
    setCreateOpen(true)
  }

  async function handleCreate() {
    if (!validateForm(false)) return
    setSaving(true)
    try {
      await paiementsApi.create({
        factureId: form.factureId,
        montant: parseFloat(form.montant),
        methode: form.methode,
        reference: form.reference.trim() || undefined,
        datePaiement: form.datePaiement || undefined,
        notes: form.notes.trim() || undefined,
      })
      success(t('pages.paiements.createSuccess'))
      setCreateOpen(false)
      fetchAll()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Impossible d\'enregistrer le paiement.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await paiementsApi.delete(deleteTarget.id)
      success(t('pages.paiements.deleteSuccess'))
      setDeleteTarget(null)
      if (selected?.id === deleteTarget.id) setSelected(null)
      fetchAll()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : 'Impossible d\'annuler le paiement.')
    }
  }

  // ── Form field update helpers ─────────────────────────────────────────────

  function setField(key: keyof PaiementForm, val: string) {
    setForm(f => ({ ...f, [key]: val }))
    setFormErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  function handleFactureSelect(factureId: string) {
    const facture = selectedFacture(factureId)
    const restant = restantFacture(facture)
    setForm(f => ({
      ...f,
      factureId,
      montant: restant > 0 ? String(Number(restant.toFixed(2))) : '',
    }))
    setFormErrors(e => { const n = { ...e }; delete n.factureId; delete n.montant; return n })
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const currentMonthLabel = new Date().toLocaleDateString('fr-MA', { month: 'long', year: 'numeric' })

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <PageHeader
        title={t('pages.paiements.title')}
        sub={t('pages.paiements.sub')}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setView('table')}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', view === 'table' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}
              >
                Tableau
              </button>
              <button
                onClick={() => setView('timeline')}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', view === 'timeline' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}
              >
                Timeline
              </button>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t('pages.paiements.addPaiement')}
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard
          label={t('pages.paiements.stats.totalRecu')}
          value={loading ? '—' : formatMAD(stats?.totalRecu ?? 0)}
          sub="Total encaissé"
          icon={TrendingUp}
          color="teal"
        />
        <StatsCard
          label={t('pages.paiements.stats.enAttente')}
          value={loading ? '—' : formatMAD(stats?.enAttente ?? 0)}
          sub="Factures impayées"
          icon={Clock}
          color="orange"
        />
        <StatsCard
          label={t('pages.paiements.stats.ceMois')}
          value={loading ? '—' : formatMAD(stats?.ceMois ?? 0)}
          sub={currentMonthLabel}
          icon={CheckCircle}
          color="blue"
        />
      </div>

      {view === 'table' ? (
        <>
          <SearchFilter
            value={search}
            onChange={v => { setSearch(v); setPage(1) }}
            placeholder={t('pages.paiements.searchPlaceholder')}
            filters={[{
              key: 'methode',
              label: t('pages.paiements.col.methode'),
              options: [
                { value: 'CASH', label: t('methodes.cash') },
                { value: 'VIREMENT', label: t('methodes.virement') },
                { value: 'CARTE', label: t('methodes.carte') },
                { value: 'CHEQUE', label: t('methodes.cheque') },
                { value: 'MOBILE', label: t('methodes.mobile') },
              ],
            }]}
            activeFilters={filters}
            onFilterChange={(k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1) }}
          />

          <div className="card rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm">Chargement…</div>
            ) : paginated.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title={t('pages.paiements.empty.title')}
                desc={t('pages.paiements.empty.desc')}
                color="teal"
              />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        {[
                          t('pages.paiements.col.client'),
                          t('pages.paiements.col.facture'),
                          t('pages.paiements.col.methode'),
                          t('pages.paiements.col.montant'),
                          t('pages.paiements.col.date'),
                          t('pages.paiements.col.reference'),
                          '',
                        ].map((h, i) => (
                          <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                      {paginated.map(p => (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer"
                          onClick={() => setSelected(p)}
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">
                                  {p.facture.client.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">{p.facture.client.nom}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm font-mono text-primary-600 dark:text-primary-400 font-semibold">{p.facture.numeroFacture}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{METHOD_ICONS[p.methode] ?? '💰'}</span>
                              <StatusBadge variant={methodeUI(p.methode)} />
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm font-black text-green-600 dark:text-green-400">{formatMAD(p.montant)}</span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(p.datePaiement)}</td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{p.reference ?? '—'}</span>
                          </td>
                          <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                            <ActionMenu
                              align="right"
                              items={[
                                { label: 'Voir', icon: Eye, onClick: () => setSelected(p) },
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
                  {paginated.map(p => (
                    <div key={p.id} className="p-4 cursor-pointer" onClick={() => setSelected(p)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {p.facture.client.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.facture.client.nom}</p>
                            <p className="text-xs font-mono text-primary-600 dark:text-primary-400">{p.facture.numeroFacture}</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-green-600 dark:text-green-400">{formatMAD(p.montant)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{METHOD_ICONS[p.methode] ?? '💰'}</span>
                          <StatusBadge variant={methodeUI(p.methode)} size="sm" />
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(p.datePaiement)}</span>
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
        </>
      ) : (
        /* Timeline view */
        <div className="card rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-6">{t('pages.paiements.timeline.title')}</h2>
          {paiements.length === 0 && !loading ? (
            <EmptyState icon={CreditCard} title={t('pages.paiements.empty.title')} desc={t('pages.paiements.empty.desc')} color="teal" />
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-6">
                {paiements.slice(0, 20).map(p => (
                  <div key={p.id} className="relative flex gap-4 pl-12">
                    <div className="absolute left-0 w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/50 border-2 border-green-200 dark:border-green-800 flex items-center justify-center flex-shrink-0 z-10">
                      <span className="text-base">{METHOD_ICONS[p.methode] ?? '💰'}</span>
                    </div>
                    <div
                      className="flex-1 card rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelected(p)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.facture.client.nom}</p>
                          <p className="text-xs font-mono text-primary-600 dark:text-primary-400 mt-0.5">{p.facture.numeroFacture}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge variant={methodeUI(p.methode)} size="sm" />
                            {p.reference && <span className="text-xs font-mono text-slate-400">{p.reference}</span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-black text-green-600 dark:text-green-400">{formatMAD(p.montant)}</p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 justify-end">
                            <Calendar className="w-3 h-3" />
                            {formatDate(p.datePaiement)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={t('pages.paiements.detail.title')} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black">
                  {selected.facture.client.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white">{selected.facture.client.nom}</p>
                <p className="text-2xl font-black text-green-600 dark:text-green-400 mt-0.5">{formatMAD(selected.montant)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{t('pages.paiements.detail.facture')}</p>
                <p className="text-sm font-mono font-semibold text-primary-600 dark:text-primary-400">{selected.facture.numeroFacture}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{t('pages.paiements.col.methode')}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{METHOD_ICONS[selected.methode] ?? '💰'}</span>
                  <StatusBadge variant={methodeUI(selected.methode)} size="sm" />
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{t('pages.paiements.col.date')}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(selected.datePaiement)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{t('pages.paiements.detail.reference')}</p>
                <p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  {selected.reference ?? '—'}
                </p>
              </div>
            </div>

            {selected.notes && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{t('pages.paiements.detail.notes')}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{selected.notes}</p>
              </div>
            )}

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-xs text-slate-400 mb-2">Progression facture</p>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500">{formatMAD(selected.facture.montantPaye)} payé</span>
                <span className="text-slate-400">/ {formatMAD(selected.facture.totalTTC)}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (n(selected.facture.montantPaye) / n(selected.facture.totalTTC)) * 100)}%` }}
                />
              </div>
            </div>

          </div>
        )}
      </Modal>

      {/* ── Create Modal ──────────────────────────────────────────────────────── */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t('pages.paiements.create')}
        size="md"
        footer={
          <>
            <button
              onClick={() => setCreateOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              {saving ? 'Enregistrement…' : t('pages.paiements.create')}
            </button>
          </>
        }
      >
        <PaiementFormFields
          form={form}
          errors={formErrors}
          isEdit={false}
          facturesPayables={facturesPayables}
          onFieldChange={setField}
          onFactureSelect={handleFactureSelect}
          t={t}
        />
      </Modal>

      {/* ── Delete Modal ──────────────────────────────────────────────────────── */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('pages.paiements.deleteTitle')}
        message={
          deleteTarget
            ? t('pages.paiements.deleteMessage').replace('{montant}', formatMAD(deleteTarget.montant))
            : ''
        }
        confirmLabel="Annuler le paiement"
        danger
      />
    </div>
  )
}

// ── PaiementFormFields ────────────────────────────────────────────────────────

interface FormFieldsProps {
  form: PaiementForm
  errors: Record<string, string>
  isEdit: boolean
  facturesPayables: ApiFacture[]
  onFieldChange: (key: keyof PaiementForm, val: string) => void
  onFactureSelect: (id: string) => void
  t: (key: string) => string
}

function PaiementFormFields({ form, errors, isEdit, facturesPayables, onFieldChange, onFactureSelect, t }: FormFieldsProps) {
  const selectedFacture = facturesPayables.find(f => f.id === form.factureId) ?? null
  const restant = selectedFacture
    ? Math.max(0, parseFloat(String(selectedFacture.totalTTC)) - parseFloat(String(selectedFacture.montantPaye)))
    : 0

  const fieldClass = (err?: string) =>
    cn(
      'w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all',
      err
        ? 'border-red-300 dark:border-red-600 focus:ring-red-500/20'
        : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-400',
    )

  const METHODS = ['CASH', 'VIREMENT', 'CARTE', 'CHEQUE', 'MOBILE']
  const methodLabels: Record<string, string> = {
    CASH: t('methodes.cash'),
    VIREMENT: t('methodes.virement'),
    CARTE: t('methodes.carte'),
    CHEQUE: t('methodes.cheque'),
    MOBILE: t('methodes.mobile'),
  }

  return (
    <div className="space-y-4">
      {/* Invoice selector (only in create mode) */}
      {!isEdit && (
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t('pages.paiements.form.facture')} <span className="text-red-500">*</span>
          </label>
          {facturesPayables.length === 0 ? (
            <p className="text-sm text-slate-400 italic">{t('pages.paiements.form.noPayableInvoices')}</p>
          ) : (
            <select
              value={form.factureId}
              onChange={e => onFactureSelect(e.target.value)}
              className={fieldClass(errors.factureId)}
            >
              <option value="">{t('pages.paiements.form.facturePlaceholder')}</option>
              {facturesPayables.map(f => {
                const restantF = Math.max(0, parseFloat(String(f.totalTTC)) - parseFloat(String(f.montantPaye)))
                return (
                  <option key={f.id} value={f.id}>
                    {f.numeroFacture} — {f.client.nom} — Restant: {restantF.toFixed(2)} MAD
                  </option>
                )
              })}
            </select>
          )}
          {errors.factureId && <p className="text-xs text-red-500 mt-1">{errors.factureId}</p>}
        </div>
      )}

      {/* Client (auto-filled, visible only in create) */}
      {!isEdit && selectedFacture && (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">{t('pages.paiements.form.client')}</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedFacture.client.nom}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-0.5">{t('pages.paiements.form.restant')}</p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">{restant.toFixed(2)} MAD</p>
          </div>
        </div>
      )}

      {/* Montant */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          {t('pages.paiements.form.montant')} <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={form.montant}
          onChange={e => onFieldChange('montant', e.target.value)}
          className={fieldClass(errors.montant)}
          placeholder="0.00"
        />
        {errors.montant && <p className="text-xs text-red-500 mt-1">{errors.montant}</p>}
      </div>

      {/* Methode + Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t('pages.paiements.form.methode')} <span className="text-red-500">*</span>
          </label>
          <select
            value={form.methode}
            onChange={e => onFieldChange('methode', e.target.value)}
            className={fieldClass()}
          >
            {METHODS.map(m => (
              <option key={m} value={m}>{methodLabels[m]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t('pages.paiements.form.datePaiement')} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.datePaiement}
            onChange={e => onFieldChange('datePaiement', e.target.value)}
            className={fieldClass()}
          />
        </div>
      </div>

      {/* Reference */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          {t('pages.paiements.form.reference')}
        </label>
        <input
          type="text"
          value={form.reference}
          onChange={e => onFieldChange('reference', e.target.value)}
          className={fieldClass()}
          placeholder={t('pages.paiements.form.referencePlaceholder')}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          {t('pages.paiements.form.notes')}
        </label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={e => onFieldChange('notes', e.target.value)}
          className={cn(fieldClass(), 'resize-none')}
        />
      </div>
    </div>
  )
}
