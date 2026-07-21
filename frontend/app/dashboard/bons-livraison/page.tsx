'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  Truck, Plus, Pencil, Trash2, Copy, Send, CheckCircle,
  Link, X, FileText, Layers,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui/PageHeader'
import { StatsCard } from '@/components/dashboard/ui/StatsCard'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import { SearchFilter } from '@/components/dashboard/ui/SearchFilter'
import { ActionMenu } from '@/components/dashboard/ui/ActionMenu'
import { Pagination } from '@/components/dashboard/ui/Pagination'
import { EmptyState } from '@/components/dashboard/ui/EmptyState'
import { Modal, ConfirmModal } from '@/components/dashboard/ui/Modal'
import { PlanLimitModal } from '@/components/billing/PlanLimitModal'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/hooks/useAuth'
import { bonsLivraisonApi, clientsApi, devisApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import { canDo } from '@/lib/permissions'

const BonLivraisonDownloadButton = dynamic(
  () => import('@/components/pdf/BonLivraisonDownloadButton'),
  { ssr: false },
)

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiClient {
  id: string
  nom: string
  nomEntreprise: string | null
  email: string | null
}

interface ApiDevisSimple {
  id: string
  reference: string
  statut: string
}

interface BLLigne {
  id?: string
  description: string
  quantite: number
  unite: string | null
  ordre: number
}

interface ApiBL {
  id: string
  reference: string
  statut: string
  publicToken: string
  clientId: string
  devisId: string | null
  factureId: string | null
  notes: string | null
  dateLivraison: string | null
  createdAt: string
  updatedAt: string
  client: { id: string; nom: string; nomEntreprise: string | null; email: string | null; telephone: string | null; ice: string | null }
  devis: { id: string; reference: string } | null
  facture: { id: string; numeroFacture: string } | null
  lignes: BLLigne[]
  _count?: { lignes: number }
}

interface BLForm {
  clientId: string
  devisId: string
  notes: string
  dateLivraison: string
  lignes: { description: string; quantite: number; unite: string; ordre: number }[]
}

const EMPTY_FORM: BLForm = {
  clientId: '',
  devisId: '',
  notes: '',
  dateLivraison: '',
  lignes: [{ description: '', quantite: 1, unite: '', ordre: 0 }],
}

type BLStatut = 'brouillon' | 'envoye' | 'accepte'

const STATUT_CONFIG: Record<string, { variant: BLStatut; label: string }> = {
  BROUILLON: { variant: 'brouillon', label: 'Brouillon' },
  ENVOYE:    { variant: 'envoye',    label: 'Envoyé' },
  LIVRE:     { variant: 'accepte',   label: 'Livré' },
}

const PAGE_SIZE = 10

// ── Component ─────────────────────────────────────────────────────────────────

export default function BonsLivraisonPage() {
  const { t, dir } = useTranslation()
  const { user, entreprise } = useAuth()
  const { toasts, success, error, removeToast } = useToast()
  const router = useRouter()
  const role = user?.role?.toLowerCase() ?? ''
  const removed: string[] = user?.permissionsRetirees ?? []
  const ent = entreprise as any // JWT returns full Entreprise; type is narrower than runtime

  const [items, setItems] = useState<ApiBL[]>([])
  const [clients, setClients] = useState<ApiClient[]>([])
  const [devisList, setDevisList] = useState<ApiDevisSimple[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<BLForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({})
  const [saving, setSaving] = useState(false)

  const [selected, setSelected] = useState<ApiBL | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiBL | null>(null)
  const [convertTarget, setConvertTarget] = useState<ApiBL | null>(null)
  const [limitModal, setLimitModal] = useState<{ limite: number; actuel: number } | null>(null)

  // Multi-select for grouping
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [grouperOpen, setGrouperOpen] = useState(false)
  const [grouping, setGrouping] = useState(false)

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : ''

  // ── Data fetching ──────────────────────────────────────────────────────────

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await bonsLivraisonApi.list({
        ...(filterStatut ? { statut: filterStatut } : {}),
        ...(search ? { recherche: search } : {}),
      })
      setItems(res.data?.data ?? res.data ?? [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }, [filterStatut, search])

  useEffect(() => { loadItems() }, [loadItems])

  useEffect(() => {
    clientsApi.list().then(r => setClients(r.data?.data ?? r.data ?? []))
    devisApi.list({ statut: 'ACCEPTE' }).then(r => setDevisList(r.data?.data ?? r.data ?? []))
  }, [])

  // ── Pagination ─────────────────────────────────────────────────────────────

  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const byStatut = (s: string) => items.filter(i => i.statut === s).length

  // ── Form helpers ───────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (bl: ApiBL) => {
    setEditingId(bl.id)
    setForm({
      clientId: bl.clientId,
      devisId: bl.devisId ?? '',
      notes: bl.notes ?? '',
      dateLivraison: bl.dateLivraison ? bl.dateLivraison.slice(0, 10) : '',
      lignes: bl.lignes.length > 0
        ? bl.lignes.map(l => ({ description: l.description, quantite: Number(l.quantite), unite: l.unite ?? '', ordre: l.ordre }))
        : [{ description: '', quantite: 1, unite: '', ordre: 0 }],
    })
    setFormErrors({})
    setModalOpen(true)
  }

  const handleLigneChange = (i: number, field: string, val: string | number) => {
    setForm(f => {
      const lignes = [...f.lignes]
      lignes[i] = { ...lignes[i], [field]: field === 'quantite' ? Number(val) : val }
      return { ...f, lignes }
    })
  }

  const addLigne = () => {
    setForm(f => ({
      ...f,
      lignes: [...f.lignes, { description: '', quantite: 1, unite: '', ordre: f.lignes.length }],
    }))
  }

  const removeLigne = (i: number) => {
    setForm(f => ({ ...f, lignes: f.lignes.filter((_, idx) => idx !== i) }))
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!form.clientId) errors.clientId = t('pages.bonsLivraison.form.clientRequired')
    if (form.lignes.length === 0 || form.lignes.every(l => !l.description.trim())) {
      errors.lignes = t('pages.bonsLivraison.form.lignesRequired')
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        clientId: form.clientId,
        devisId: form.devisId || undefined,
        notes: form.notes || undefined,
        dateLivraison: form.dateLivraison || undefined,
        lignes: form.lignes
          .filter(l => l.description.trim())
          .map((l, i) => ({ description: l.description, quantite: l.quantite, unite: l.unite || undefined, ordre: i })),
      }
      if (editingId) {
        await bonsLivraisonApi.update(editingId, payload)
        success(t('pages.bonsLivraison.editSuccess'))
      } else {
        await bonsLivraisonApi.create(payload)
        success(t('pages.bonsLivraison.createSuccess'))
      }
      setModalOpen(false)
      loadItems()
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string | string[]; errors?: { limite?: number; actuel?: number } } } }
      if (e?.response?.status === 402) {
        const errs = e.response!.data?.errors
        setLimitModal({ limite: errs?.limite ?? 5, actuel: errs?.actuel ?? 5 })
      } else {
        const msg = e?.response?.data?.message
        error('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erreur lors de la sauvegarde.'))
      }
    } finally { setSaving(false) }
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleEnvoyer = async (bl: ApiBL) => {
    setActionLoading(`envoyer_${bl.id}`)
    try {
      await bonsLivraisonApi.envoyer(bl.id)
      success(t('pages.bonsLivraison.envoyerSuccess'))
      loadItems()
      if (selected?.id === bl.id) setSelected(s => s ? { ...s, statut: 'ENVOYE' } : s)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      error('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erreur.'))
    } finally { setActionLoading(null) }
  }

  const handleMarquerLivre = async (bl: ApiBL) => {
    setActionLoading(`livre_${bl.id}`)
    try {
      await bonsLivraisonApi.marquerLivre(bl.id)
      success(t('pages.bonsLivraison.livreSuccess'))
      loadItems()
      if (selected?.id === bl.id) setSelected(s => s ? { ...s, statut: 'LIVRE' } : s)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      error('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erreur.'))
    } finally { setActionLoading(null) }
  }

  const handleDupliquer = async (bl: ApiBL) => {
    setActionLoading(`dup_${bl.id}`)
    try {
      await bonsLivraisonApi.dupliquer(bl.id)
      success(t('pages.bonsLivraison.dupliquerSuccess'))
      loadItems()
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string | string[]; errors?: { limite?: number; actuel?: number } } } }
      if (e?.response?.status === 402) {
        const errs = e.response!.data?.errors
        setLimitModal({ limite: errs?.limite ?? 5, actuel: errs?.actuel ?? 5 })
      } else {
        const msg = e?.response?.data?.message
        error('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erreur.'))
      }
    } finally { setActionLoading(null) }
  }

  const handleConvertir = async () => {
    if (!convertTarget) return
    setActionLoading(`conv_${convertTarget.id}`)
    try {
      await bonsLivraisonApi.convertirEnFacture(convertTarget.id)
      success(t('pages.bonsLivraison.convertirSuccess'))
      setConvertTarget(null)
      loadItems()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      error('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erreur.'))
    } finally { setActionLoading(null) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setActionLoading(`del_${deleteTarget.id}`)
    try {
      await bonsLivraisonApi.delete(deleteTarget.id)
      success(t('pages.bonsLivraison.deleteSuccess'))
      setDeleteTarget(null)
      if (selected?.id === deleteTarget.id) setSelected(null)
      loadItems()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      error('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erreur.'))
    } finally { setActionLoading(null) }
  }

  const handleCopyLink = (bl: ApiBL) => {
    navigator.clipboard.writeText(`${baseUrl}/public/bl/${bl.publicToken}`)
    success('Lien copié dans le presse-papier.')
  }

  // ── Multi-select helpers ───────────────────────────────────────────────────

  const toggleSelect = (bl: ApiBL, e: React.MouseEvent) => {
    e.stopPropagation()
    if (bl.factureId) return // already invoiced — not selectable
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(bl.id) ? next.delete(bl.id) : next.add(bl.id)
      return next
    })
  }

  const selectedBLs = items.filter(bl => selectedIds.has(bl.id))

  const grouperValidation = (() => {
    if (selectedBLs.length < 2) return null
    const uniqueClients = new Set(selectedBLs.map(bl => bl.clientId))
    if (uniqueClients.size > 1) return { error: t('pages.bonsLivraison.grouperMixedClients') }
    if (selectedBLs.some(bl => bl.statut === 'BROUILLON')) return { error: t('pages.bonsLivraison.grouperNeedStatus') }
    if (selectedBLs.some(bl => bl.factureId)) return { error: t('pages.bonsLivraison.grouperAlreadyInvoiced') }
    return { clientId: selectedBLs[0].clientId, clientNom: selectedBLs[0].client.nom }
  })()

  const handleGrouper = async () => {
    if (!grouperValidation || grouperValidation.error) return
    setGrouping(true)
    try {
      const res = await bonsLivraisonApi.grouperEnFacture({
        blIds: Array.from(selectedIds),
        clientId: grouperValidation.clientId!,
      })
      const facture = res.data?.data ?? res.data
      success(t('pages.bonsLivraison.grouperSuccess'))
      setGrouperOpen(false)
      setSelectedIds(new Set())
      router.push('/dashboard/factures')
      void facture
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string | string[]; errors?: { limite?: number; actuel?: number } } } }
      if (e?.response?.status === 402) {
        const errs = e.response!.data?.errors
        setGrouperOpen(false)
        setLimitModal({ limite: errs?.limite ?? 5, actuel: errs?.actuel ?? 5 })
      } else {
        const msg = e?.response?.data?.message
        error('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erreur lors du groupement.'))
      }
    } finally { setGrouping(false) }
  }

  // ── PDF data builder ───────────────────────────────────────────────────────

  const buildPDFData = (bl: ApiBL) => ({
    reference: bl.reference,
    createdAt: bl.createdAt,
    dateLivraison: bl.dateLivraison,
    notes: bl.notes,
    client: {
      nom: bl.client.nom,
      nomEntreprise: bl.client.nomEntreprise,
      email: bl.client.email,
      telephone: bl.client.telephone,
      ice: bl.client.ice,
    },
    entreprise: {
      nom: ent?.nom ?? '',
      logo: ent?.logo ?? null,
      email: ent?.email ?? null,
      telephone: ent?.telephone ?? null,
      adresse: ent?.adresse ?? null,
      ville: ent?.ville ?? null,
      couleurPrimaire: ent?.couleurPrimaire ?? null,
      ice: ent?.ice ?? null,
      rc: ent?.rc ?? null,
    },
    lignes: bl.lignes.map(l => ({ description: l.description, quantite: Number(l.quantite), unite: l.unite, ordre: l.ordre })),
    devisRef: bl.devis?.reference ?? null,
  })

  const makeActions = (bl: ApiBL) => {
    const canManage = canDo('bons-livraison.manage', role, removed)
    const canConvert = canDo('factures.create', role, removed)
    return [
      { label: t('pages.bonsLivraison.actions.voirPublic'), icon: Link, onClick: () => handleCopyLink(bl) },
      ...(canManage && bl.statut === 'BROUILLON' ? [{ label: t('pages.bonsLivraison.actions.envoyer'), icon: Send, onClick: () => handleEnvoyer(bl) }] : []),
      ...(canManage && bl.statut === 'ENVOYE' ? [{ label: t('pages.bonsLivraison.actions.marquerLivre'), icon: CheckCircle, onClick: () => handleMarquerLivre(bl) }] : []),
      ...(canConvert && bl.statut === 'LIVRE' ? [{ label: t('pages.bonsLivraison.actions.convertir'), icon: FileText, onClick: () => setConvertTarget(bl) }] : []),
      ...(canManage && bl.statut !== 'LIVRE' ? [{ label: t('pages.bonsLivraison.actions.dupliquer'), icon: Copy, onClick: () => handleDupliquer(bl) }] : []),
      ...(canManage && bl.statut !== 'LIVRE' ? [{ label: t('pages.bonsLivraison.actions.supprimer'), icon: Trash2, danger: true, onClick: () => setDeleteTarget(bl) }] : []),
    ]
  }

  const fmtDate = (d?: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div dir={dir} className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <PageHeader
        title={t('pages.bonsLivraison.title')}
        sub={t('pages.bonsLivraison.sub')}
        actions={canDo('bons-livraison.manage', role, removed) ? (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('pages.bonsLivraison.add')}
          </button>
        ) : undefined}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard label={t('pages.bonsLivraison.stats.total')} value={loading ? '—' : items.length} icon={Truck} color="blue" />
        <StatsCard label={t('pages.bonsLivraison.stats.brouillon')} value={loading ? '—' : byStatut('BROUILLON')} icon={Pencil} color="teal" />
        <StatsCard label={t('pages.bonsLivraison.stats.envoye')} value={loading ? '—' : byStatut('ENVOYE')} icon={Send} color="orange" />
        <StatsCard label={t('pages.bonsLivraison.stats.livre')} value={loading ? '—' : byStatut('LIVRE')} icon={CheckCircle} color="green" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter
          value={search}
          onChange={v => { setSearch(v); setPage(1) }}
          placeholder={t('pages.bonsLivraison.searchPlaceholder')}
        />
        <select
          value={filterStatut}
          onChange={e => { setFilterStatut(e.target.value); setPage(1) }}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="BROUILLON">{t('pages.bonsLivraison.statuts.BROUILLON')}</option>
          <option value="ENVOYE">{t('pages.bonsLivraison.statuts.ENVOYE')}</option>
          <option value="LIVRE">{t('pages.bonsLivraison.statuts.LIVRE')}</option>
        </select>
      </div>

      {/* Grouper action bar */}
      {selectedIds.size >= 2 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 rounded-2xl">
          <Layers className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300 flex-1">
            {selectedIds.size} BL sélectionnés
            {grouperValidation?.error && (
              <span className="ml-2 text-amber-600 dark:text-amber-400 font-normal">— {grouperValidation.error}</span>
            )}
          </span>
          {!grouperValidation?.error && (
            <button
              onClick={() => setGrouperOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              {t('pages.bonsLivraison.actions.grouper')}
            </button>
          )}
          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Truck}
          title={t('pages.bonsLivraison.empty.title')}
          desc={t('pages.bonsLivraison.empty.desc')}
          action={canDo('bons-livraison.manage', role, removed) ? {
            label: t('pages.bonsLivraison.add'),
            onClick: openCreate,
          } : undefined}
        />
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-4 py-3 w-10" />
                    {['reference','client','devis','date','livraison','statut','actions'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t(`pages.bonsLivraison.col.${col}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginated.map(bl => {
                    const cfg = STATUT_CONFIG[bl.statut] ?? STATUT_CONFIG.BROUILLON
                    const isSelected = selectedIds.has(bl.id)
                    const isInvoiced = !!bl.factureId
                    return (
                      <tr
                        key={bl.id}
                        className={cn(
                          'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer',
                          isSelected && 'bg-primary-50/60 dark:bg-primary-950/30',
                        )}
                        onClick={() => setSelected(bl)}
                      >
                        <td className="px-4 py-3 w-10" onClick={e => e.stopPropagation()}>
                          {!isInvoiced && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              onClick={e => toggleSelect(bl, e)}
                              className="w-4 h-4 rounded accent-primary-600 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{bl.reference}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-900 dark:text-white">{bl.client.nom}</p>
                          {bl.client.nomEntreprise && <p className="text-xs text-slate-500 dark:text-slate-400">{bl.client.nomEntreprise}</p>}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{bl.devis?.reference ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{fmtDate(bl.createdAt)}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{fmtDate(bl.dateLivraison)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge variant={cfg.variant} label={cfg.label} />
                            {isInvoiced && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                                <FileText className="w-3 h-3" />
                                {bl.facture?.numeroFacture ?? t('pages.bonsLivraison.facture')}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <ActionMenu items={makeActions(bl)} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map(bl => {
                const cfg = STATUT_CONFIG[bl.statut] ?? STATUT_CONFIG.BROUILLON
                const isSelected = selectedIds.has(bl.id)
                const isInvoiced = !!bl.factureId
                return (
                  <div
                    key={bl.id}
                    className={cn(
                      'p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer',
                      isSelected && 'bg-primary-50/60 dark:bg-primary-950/30',
                    )}
                    onClick={() => setSelected(bl)}
                  >
                    {!isInvoiced && (
                      <div onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          onClick={e => toggleSelect(bl, e)}
                          className="w-4 h-4 rounded accent-primary-600 cursor-pointer"
                        />
                      </div>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{bl.reference}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{bl.client.nom}</p>
                      {isInvoiced && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                          {bl.facture?.numeroFacture ?? t('pages.bonsLivraison.facture')}
                        </p>
                      )}
                    </div>
                    <StatusBadge variant={cfg.variant} label={cfg.label} />
                    <div onClick={e => e.stopPropagation()}>
                      <ActionMenu items={makeActions(bl)} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {items.length > PAGE_SIZE && (
            <Pagination page={page} total={items.length} perPage={PAGE_SIZE} onChange={setPage} />
          )}
        </>
      )}

      {/* ── Detail modal ── */}
      {selected && (
        <Modal
          open
          onClose={() => setSelected(null)}
          title={selected.reference}
          size="lg"
        >
          <div className="space-y-5">
            {/* Status */}
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge
                variant={STATUT_CONFIG[selected.statut]?.variant ?? 'brouillon'}
                label={STATUT_CONFIG[selected.statut]?.label ?? selected.statut}
              />
              {selected.devis && (
                <span className="text-xs text-slate-500 dark:text-slate-400">Devis : {selected.devis.reference}</span>
              )}
              {selected.facture && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                  <FileText className="w-3.5 h-3.5" />
                  {t('pages.bonsLivraison.facture')} — {selected.facture.numeroFacture}
                </span>
              )}
            </div>

            {/* Client + dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Client</p>
                <p className="font-medium text-slate-900 dark:text-white">{selected.client.nom}</p>
                {selected.client.nomEntreprise && <p className="text-slate-500 dark:text-slate-400 text-xs">{selected.client.nomEntreprise}</p>}
                {selected.client.ice && <p className="text-slate-500 dark:text-slate-400 text-xs">ICE: {selected.client.ice}</p>}
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Dates</p>
                <p className="text-slate-700 dark:text-slate-300">Créé : {fmtDate(selected.createdAt)}</p>
                {selected.dateLivraison && <p className="text-slate-700 dark:text-slate-300">Livraison : {fmtDate(selected.dateLivraison)}</p>}
              </div>
            </div>

            {/* Lines */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {t('pages.bonsLivraison.publicPage.lignes')}
              </p>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-slate-500 dark:text-slate-400">Désignation</th>
                      <th className="px-3 py-2 text-right text-xs text-slate-500 dark:text-slate-400">Qté</th>
                      <th className="px-3 py-2 text-right text-xs text-slate-500 dark:text-slate-400">Unité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selected.lignes.map((l, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-slate-900 dark:text-white">{l.description}</td>
                        <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">{Number(l.quantite)}</td>
                        <td className="px-3 py-2 text-right text-slate-500 dark:text-slate-400">{l.unite || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selected.notes && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400">
                {selected.notes}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {selected.lignes.length > 0 && entreprise && (
                <BonLivraisonDownloadButton data={buildPDFData(selected)} label={t('pages.bonsLivraison.actions.telecharger')} />
              )}
              {canDo('bons-livraison.manage', role, removed) && selected.statut !== 'LIVRE' && (
                <button
                  onClick={() => { setSelected(null); openEdit(selected) }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" /> Modifier
                </button>
              )}
              {canDo('bons-livraison.manage', role, removed) && selected.statut === 'BROUILLON' && (
                <button
                  onClick={() => handleEnvoyer(selected)}
                  disabled={!!actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" /> {t('pages.bonsLivraison.actions.envoyer')}
                </button>
              )}
              {canDo('bons-livraison.manage', role, removed) && selected.statut === 'ENVOYE' && (
                <button
                  onClick={() => handleMarquerLivre(selected)}
                  disabled={!!actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-60"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> {t('pages.bonsLivraison.actions.marquerLivre')}
                </button>
              )}
              {canDo('factures.create', role, removed) && selected.statut === 'LIVRE' && (
                <button
                  onClick={() => { setSelected(null); setConvertTarget(selected) }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-all"
                >
                  <FileText className="w-3.5 h-3.5" /> {t('pages.bonsLivraison.actions.convertir')}
                </button>
              )}
              <button
                onClick={() => handleCopyLink(selected)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <Link className="w-3.5 h-3.5" /> {t('pages.bonsLivraison.actions.voirPublic')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Create / Edit modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Modifier le bon de livraison' : t('pages.bonsLivraison.add')}
        size="lg"
      >
        <div className="space-y-5">
          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t('pages.bonsLivraison.form.client')} <span className="text-red-500">*</span>
            </label>
            <select
              value={form.clientId}
              onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
              className={cn(
                'w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500',
                formErrors.clientId ? 'border-red-400' : 'border-slate-200 dark:border-slate-700',
              )}
            >
              <option value="">{t('pages.bonsLivraison.form.clientPlaceholder')}</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.nom}{c.nomEntreprise ? ` — ${c.nomEntreprise}` : ''}</option>
              ))}
            </select>
            {formErrors.clientId && <p className="text-xs text-red-500 mt-1">{formErrors.clientId}</p>}
          </div>

          {/* Devis lié */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t('pages.bonsLivraison.form.devis')}
            </label>
            <select
              value={form.devisId}
              onChange={e => setForm(f => ({ ...f, devisId: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t('pages.bonsLivraison.form.devisPlaceholder')}</option>
              {devisList.map(d => (
                <option key={d.id} value={d.id}>{d.reference}</option>
              ))}
            </select>
          </div>

          {/* Date livraison + Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('pages.bonsLivraison.form.dateLivraison')}
              </label>
              <input
                type="date"
                value={form.dateLivraison}
                onChange={e => setForm(f => ({ ...f, dateLivraison: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('pages.bonsLivraison.form.notes')}
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder={t('pages.bonsLivraison.form.notesPlaceholder')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Lines */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('pages.bonsLivraison.form.lignes')} <span className="text-red-500">*</span>
            </label>
            {formErrors.lignes && <p className="text-xs text-red-500 mb-2">{formErrors.lignes}</p>}
            <div className="space-y-2">
              {form.lignes.map((ligne, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={ligne.description}
                    onChange={e => handleLigneChange(i, 'description', e.target.value)}
                    placeholder={t('pages.bonsLivraison.form.descPlaceholder')}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={ligne.quantite}
                    onChange={e => handleLigneChange(i, 'quantite', e.target.value)}
                    className="w-20 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Qté"
                  />
                  <input
                    type="text"
                    value={ligne.unite}
                    onChange={e => handleLigneChange(i, 'unite', e.target.value)}
                    placeholder={t('pages.bonsLivraison.form.unite')}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {form.lignes.length > 1 && (
                    <button onClick={() => removeLigne(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addLigne}
              className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> {t('pages.bonsLivraison.form.addLigne')}
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold disabled:opacity-60 transition-all inline-flex items-center gap-2"
            >
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editingId ? 'Enregistrer' : t('pages.bonsLivraison.add')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete confirm ── */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('pages.bonsLivraison.deleteTitle')}
        message={t('pages.bonsLivraison.deleteMessage').replace('{reference}', deleteTarget?.reference ?? '')}
        confirmLabel="Supprimer"
        danger
      />

      {/* ── Convert confirm ── */}
      <ConfirmModal
        open={!!convertTarget}
        onClose={() => setConvertTarget(null)}
        onConfirm={handleConvertir}
        title={t('pages.bonsLivraison.actions.convertir')}
        message={t('pages.bonsLivraison.convertirConfirm').replace('{reference}', convertTarget?.reference ?? '')}
        confirmLabel="Convertir"
      />

      {/* ── Grouper confirm modal ── */}
      {grouperOpen && grouperValidation && !grouperValidation.error && (
        <Modal
          open
          onClose={() => setGrouperOpen(false)}
          title={t('pages.bonsLivraison.grouperConfirmTitle')}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t('pages.bonsLivraison.grouperConfirmMessage')
                .replace('{count}', String(selectedBLs.length))
                .replace('{client}', grouperValidation.clientNom!)}
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 space-y-1">
              {selectedBLs.map(bl => (
                <div key={bl.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">{bl.reference}</span>
                  <StatusBadge
                    variant={STATUT_CONFIG[bl.statut]?.variant ?? 'brouillon'}
                    label={STATUT_CONFIG[bl.statut]?.label ?? bl.statut}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setGrouperOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleGrouper}
                disabled={grouping}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold disabled:opacity-60 transition-all"
              >
                {grouping && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                <Layers className="w-3.5 h-3.5" />
                {t('pages.bonsLivraison.actions.grouper')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Plan limit modal ── */}
      {limitModal && (
        <PlanLimitModal
          open={!!limitModal}
          onClose={() => setLimitModal(null)}
          resource="bons-livraison"
          limite={limitModal.limite}
          actuel={limitModal.actuel}
        />
      )}
    </div>
  )
}
