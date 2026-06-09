'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CreditCard, CheckCircle, XCircle, Clock, AlertCircle,
  Building2, Eye, ExternalLink,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui/PageHeader'
import { StatsCard } from '@/components/dashboard/ui/StatsCard'
import { Modal, ConfirmModal } from '@/components/dashboard/ui/Modal'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { EmptyState } from '@/components/dashboard/ui/EmptyState'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { facturesApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────────────

interface Declaration {
  id: string
  montant: number | string
  methode: string
  reference: string | null
  message: string | null
  datePaiement: string
  statut: 'PENDING' | 'APPROVED' | 'REJECTED'
  raisonRejet: string | null
  reviewedAt: string | null
  createdAt: string
  facture: {
    id: string
    numeroFacture: string
    totalTTC: number | string
    montantPaye: number | string
    statut: string
    publicToken: string
    client: { id: string; nom: string; nomEntreprise: string | null; email: string | null }
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : v }

function formatMAD(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const METHODE_LABELS: Record<string, string> = {
  VIREMENT: 'Virement bancaire',
  CASH:     'Espèces',
  CHEQUE:   'Chèque',
  CARTE:    'Carte bancaire',
  MOBILE:   'Mobile',
  AUTRE:    'Autre',
}

// ── Statut badge ───────────────────────────────────────────────────────────────

function StatutBadge({ statut }: { statut: string }) {
  const configs: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
    PENDING:  { icon: Clock,         label: 'En attente',  color: 'text-amber-700 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950/30' },
    APPROVED: { icon: CheckCircle,   label: 'Approuvée',   color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-950/30' },
    REJECTED: { icon: XCircle,       label: 'Rejetée',     color: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-950/30' },
  }
  const cfg = configs[statut] ?? configs.PENDING
  const Icon = cfg.icon
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full', cfg.bg, cfg.color)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function DeclarationsPage() {
  const { t } = useTranslation()
  const { success, error: toastError, toasts, removeToast } = useToast()

  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')

  const [selected, setSelected] = useState<Declaration | null>(null)
  const [approveTarget, setApproveTarget] = useState<Declaration | null>(null)
  const [rejectTarget, setRejectTarget] = useState<Declaration | null>(null)
  const [rejectRaison, setRejectRaison] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchDeclarations = useCallback(async () => {
    setLoading(true)
    setApiError(false)
    try {
      const res = await facturesApi.declarations()
      const data = res.data?.data ?? res.data
      setDeclarations(Array.isArray(data) ? data : [])
    } catch {
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDeclarations() }, [fetchDeclarations])

  const filtered = declarations.filter(d => filter === 'ALL' || d.statut === filter)

  const pendingCount = declarations.filter(d => d.statut === 'PENDING').length
  const approvedCount = declarations.filter(d => d.statut === 'APPROVED').length
  const rejectedCount = declarations.filter(d => d.statut === 'REJECTED').length

  const handleApprove = async () => {
    if (!approveTarget) return
    setActionLoading(`approve_${approveTarget.id}`)
    try {
      await facturesApi.approveDeclaration(approveTarget.id)
      setApproveTarget(null)
      setSelected(null)
      success('Déclaration approuvée', 'Le paiement a été enregistré sur la facture.')
      fetchDeclarations()
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toastError('Erreur', msg ?? 'Impossible d\'approuver cette déclaration.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectTarget) return
    setActionLoading(`reject_${rejectTarget.id}`)
    try {
      await facturesApi.rejectDeclaration(rejectTarget.id, rejectRaison.trim() || undefined)
      setRejectTarget(null)
      setSelected(null)
      setRejectRaison('')
      success('Déclaration rejetée', 'Le client sera informé du refus.')
      fetchDeclarations()
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toastError('Erreur', msg ?? 'Impossible de rejeter cette déclaration.')
    } finally {
      setActionLoading(null)
    }
  }

  const FILTERS: { value: typeof filter; label: string; count?: number }[] = [
    { value: 'PENDING',  label: 'En attente', count: pendingCount },
    { value: 'ALL',      label: 'Toutes' },
    { value: 'APPROVED', label: 'Approuvées', count: approvedCount },
    { value: 'REJECTED', label: 'Rejetées', count: rejectedCount },
  ]

  return (
    <div>
      <PageHeader
        title="Déclarations de paiement"
        sub="Examinez les paiements déclarés par vos clients."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard label="En attente" value={loading ? '—' : pendingCount} icon={Clock} color="orange" />
        <StatsCard label="Approuvées" value={loading ? '—' : approvedCount} icon={CheckCircle} color="green" />
        <StatsCard label="Rejetées" value={loading ? '—' : rejectedCount} icon={XCircle} color="purple" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all',
              filter === f.value
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
            )}
          >
            {f.label}
            {f.count !== undefined && f.count > 0 && (
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-full font-bold',
                filter === f.value ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500',
              )}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
          </div>
        ) : apiError ? (
          <EmptyState icon={CreditCard} title="Erreur de chargement" desc="Impossible de charger les déclarations." color="purple" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title={filter === 'PENDING' ? 'Aucune déclaration en attente' : 'Aucune déclaration'}
            desc="Les déclarations de paiement de vos clients apparaîtront ici."
            color="blue"
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(declaration => {
              const restantFacture = Math.max(0, n(declaration.facture.totalTTC) - n(declaration.facture.montantPaye))
              return (
                <div
                  key={declaration.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer"
                  onClick={() => setSelected(declaration)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{formatMAD(declaration.montant)}</span>
                          <span className="text-xs text-slate-400">{METHODE_LABELS[declaration.methode] ?? declaration.methode}</span>
                          {declaration.reference && (
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {declaration.reference}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <p className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{declaration.facture.client.nom}</span>
                            {declaration.facture.client.nomEntreprise && ` · ${declaration.facture.client.nomEntreprise}`}
                          </p>
                          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                          <span className="text-xs text-slate-400 font-mono hidden sm:inline">{declaration.facture.numeroFacture}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Déclaré le {formatDateTime(declaration.createdAt)}
                          {declaration.statut === 'PENDING' && restantFacture > 0 && (
                            <span className="ml-2 text-amber-600 dark:text-amber-400">· Reste à payer : {formatMAD(restantFacture)}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <StatutBadge statut={declaration.statut} />
                      {declaration.statut === 'PENDING' && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={e => { e.stopPropagation(); setApproveTarget(declaration) }}
                            disabled={!!actionLoading}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-all"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setRejectTarget(declaration); setRejectRaison('') }}
                            disabled={!!actionLoading}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-60 transition-all"
                          >
                            Rejeter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Déclaration de paiement" size="sm">
        {selected && (
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Statut</span>
              <StatutBadge statut={selected.statut} />
            </div>

            {/* Amount & method */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Montant déclaré</p>
                <p className="font-black text-slate-900 dark:text-white">{formatMAD(selected.montant)}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Méthode</p>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{METHODE_LABELS[selected.methode] ?? selected.methode}</p>
              </div>
            </div>

            {/* Date */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-xs text-slate-400 mb-1">Date du paiement déclaré</p>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{formatDate(selected.datePaiement)}</p>
            </div>

            {/* Reference */}
            {selected.reference && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">Référence</p>
                <p className="font-mono font-semibold text-slate-900 dark:text-white text-sm">{selected.reference}</p>
              </div>
            )}

            {/* Message */}
            {selected.message && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Message du client</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{selected.message}</p>
              </div>
            )}

            {/* Invoice info */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Facture</p>
                <Link
                  href={`/dashboard/factures`}
                  className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline"
                  onClick={() => setSelected(null)}
                >
                  <ExternalLink className="w-3 h-3" />
                  Voir
                </Link>
              </div>
              <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{selected.facture.numeroFacture}</p>
              <p className="text-xs text-slate-500">{selected.facture.client.nom}</p>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Total TTC: <strong>{formatMAD(selected.facture.totalTTC)}</strong></span>
                <span>Payé: <strong className="text-green-600">{formatMAD(selected.facture.montantPaye)}</strong></span>
              </div>
            </div>

            {/* Rejection reason */}
            {selected.statut === 'REJECTED' && selected.raisonRejet && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-xs text-red-600 dark:text-red-400 mb-1">Raison du rejet</p>
                <p className="text-sm text-red-700 dark:text-red-300">{selected.raisonRejet}</p>
              </div>
            )}

            {/* Review date */}
            {selected.reviewedAt && (
              <p className="text-xs text-slate-400 text-center">
                Traité le {formatDateTime(selected.reviewedAt)}
              </p>
            )}

            {/* Actions */}
            {selected.statut === 'PENDING' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setApproveTarget(selected)}
                  disabled={!!actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approuver
                </button>
                <button
                  onClick={() => { setRejectTarget(selected); setRejectRaison('') }}
                  disabled={!!actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-60 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeter
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve confirm */}
      <ConfirmModal
        open={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApprove}
        title="Approuver la déclaration ?"
        message={`Confirmer la réception de ${approveTarget ? formatMAD(approveTarget.montant) : ''} pour la facture ${approveTarget?.facture.numeroFacture ?? ''}. Un paiement sera enregistré automatiquement.`}
        confirmLabel="Approuver"
      />

      {/* Reject modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectRaison('') }}
        title="Rejeter la déclaration"
        size="sm"
        footer={
          <>
            <button
              onClick={() => { setRejectTarget(null); setRejectRaison('') }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading?.startsWith('reject') ?? false}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-all"
            >
              {(actionLoading?.startsWith('reject') ?? false) && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Rejeter
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Souhaitez-vous rejeter cette déclaration de {rejectTarget ? formatMAD(rejectTarget.montant) : ''} ?
          </p>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Raison du rejet (optionnel)
            </label>
            <textarea
              value={rejectRaison}
              onChange={e => setRejectRaison(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 transition-all resize-none"
              placeholder="Montant incorrect, virement non reçu..."
            />
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
