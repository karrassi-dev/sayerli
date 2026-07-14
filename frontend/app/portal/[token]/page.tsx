'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  FileText, Receipt, CheckCircle, XCircle, Clock, AlertCircle,
  Building2, Mail, Phone, Globe, Loader2, Check,
} from 'lucide-react'
import { portalApi } from '@/lib/api'
import { cn } from '@/lib/utils'

// ── Helpers ───────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0) }

function formatMAD(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface PortalDevis {
  id: string
  reference: string
  statut: string
  totalHT: number | string
  remise: number | string
  taxe: number | string
  totalTTC: number | string
  dateExpiration: string | null
  dateAcceptation: string | null
  dateRefus: string | null
  createdAt: string
  notes: string | null
  lienPublic: { token: string; expiration: string } | null
}

interface PortalPaiement {
  id: string
  montant: number | string
  methode: string
  datePaiement: string
  reference: string | null
}

interface PortalFacture {
  id: string
  numeroFacture: string
  statut: string
  totalHT: number | string
  taxe: number | string
  totalTTC: number | string
  montantPaye: number | string
  dateEcheance: string | null
  createdAt: string
  publicToken: string
  paiements: PortalPaiement[]
}

interface PortalData {
  id: string
  nom: string
  email: string | null
  telephone: string | null
  nomEntreprise: string | null
  entreprise: {
    nom: string
    logo: string | null
    couleurPrimaire: string | null
    email: string | null
    telephone: string | null
    adresse: string | null
    website: string | null
  }
  devis: PortalDevis[]
  factures: PortalFacture[]
}

// ── Status helpers ─────────────────────────────────────────────────────────────

const DEVIS_STATUS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ENVOYE:  { label: 'En attente',  color: 'bg-blue-100 text-blue-700',   icon: Clock },
  VU:      { label: 'Consulté',    color: 'bg-purple-100 text-purple-700', icon: Clock },
  ACCEPTE: { label: 'Accepté',     color: 'bg-green-100 text-green-700', icon: CheckCircle },
  REFUSE:  { label: 'Refusé',      color: 'bg-red-100 text-red-700',     icon: XCircle },
  EXPIRE:  { label: 'Expiré',      color: 'bg-slate-100 text-slate-500', icon: AlertCircle },
}

const FACTURE_STATUS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ENVOYEE:   { label: 'À régler',       color: 'bg-blue-100 text-blue-700',    icon: Clock },
  VUE:       { label: 'Vue',            color: 'bg-purple-100 text-purple-700', icon: Clock },
  PARTIELLE: { label: 'Paiement partiel', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
  EN_RETARD: { label: 'En retard',      color: 'bg-red-100 text-red-700',      icon: AlertCircle },
  PAYEE:     { label: 'Payée',          color: 'bg-green-100 text-green-700',  icon: CheckCircle },
}

function StatusBadge({ statut, type }: { statut: string; type: 'devis' | 'facture' }) {
  const map = type === 'devis' ? DEVIS_STATUS : FACTURE_STATUS
  const info = map[statut] ?? { label: statut, color: 'bg-slate-100 text-slate-500', icon: Clock }
  const Icon = info.icon
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', info.color)}>
      <Icon className="w-3 h-3" />
      {info.label}
    </span>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function PortalPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [accepting, setAccepting] = useState<string | null>(null)
  const [accepted, setAccepted] = useState<Set<string>>(new Set())

  const fetchPortal = useCallback(async () => {
    try {
      const res = await portalApi.get(token)
      setData(res.data?.data ?? res.data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchPortal() }, [fetchPortal])

  const handleAcceptDevis = async (devisId: string) => {
    setAccepting(devisId)
    try {
      await portalApi.acceptDevis(token, devisId)
      setAccepted(prev => new Set([...prev, devisId]))
      setData(prev => prev ? {
        ...prev,
        devis: prev.devis.map(d =>
          d.id === devisId ? { ...d, statut: 'ACCEPTE', dateAcceptation: new Date().toISOString() } : d
        ),
      } : prev)
    } catch {
      // silently ignore — UI will reflect current state on next load
    } finally {
      setAccepting(null)
    }
  }

  const primaryColor = data?.entreprise.couleurPrimaire || '#6366f1'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-slate-700 mb-2">Portail introuvable</h1>
          <p className="text-sm text-slate-500">
            Ce lien portail est invalide ou a été désactivé. Contactez votre prestataire.
          </p>
        </div>
      </div>
    )
  }

  const pendingDevis = data.devis.filter(d => ['ENVOYE', 'VU'].includes(d.statut))
  const otherDevis   = data.devis.filter(d => !['ENVOYE', 'VU'].includes(d.statut))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          {data.entreprise.logo ? (
            <img
              src={data.entreprise.logo}
              alt={data.entreprise.nom}
              className="h-9 w-auto object-contain rounded"
            />
          ) : (
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {data.entreprise.nom.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">{data.entreprise.nom}</p>
            <p className="text-xs text-slate-500">Espace client</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Bonjour, {data.nomEntreprise || data.nom} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Retrouvez ici tous vos devis et factures avec {data.entreprise.nom}.
          </p>
        </div>

        {/* Pending devis — action required */}
        {pendingDevis.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Devis en attente de réponse
            </h2>
            <div className="space-y-3">
              {pendingDevis.map(devis => (
                <DevisCard
                  key={devis.id}
                  devis={devis}
                  primaryColor={primaryColor}
                  accepting={accepting === devis.id}
                  justAccepted={accepted.has(devis.id)}
                  onAccept={() => handleAcceptDevis(devis.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Factures */}
        {data.factures.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Factures
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {data.factures.map(facture => {
                const hasPaiements = facture.paiements && facture.paiements.length > 0
                const restant = Math.max(0, n(facture.totalTTC) - n(facture.montantPaye))
                const METHODE: Record<string, string> = {
                  VIREMENT: 'Virement', CASH: 'Espèces', CHEQUE: 'Chèque',
                  CARTE: 'Carte', MOBILE: 'Mobile', AUTRE: 'Autre',
                }
                return (
                  <div key={facture.id}>
                    {/* Main facture row */}
                    <div className="flex items-center justify-between px-5 py-4 gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                          facture.statut === 'PAYEE' ? 'bg-green-100' : 'bg-slate-100'
                        )}>
                          <Receipt className={cn('w-4 h-4', facture.statut === 'PAYEE' ? 'text-green-600' : 'text-slate-500')} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{facture.numeroFacture}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {facture.dateEcheance ? `Échéance ${formatDate(facture.dateEcheance)}` : formatDate(facture.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold text-slate-900">{formatMAD(facture.totalTTC)}</p>
                          {facture.statut === 'PARTIELLE' && (
                            <p className="text-xs text-amber-600">Payé: {formatMAD(facture.montantPaye)}</p>
                          )}
                        </div>
                        <StatusBadge statut={facture.statut} type="facture" />
                        <a
                          href={`/public/factures/${facture.publicToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-slate-500 hover:text-slate-800 underline underline-offset-2 hidden sm:block"
                        >
                          Voir
                        </a>
                      </div>
                    </div>

                    {/* Payment history */}
                    {hasPaiements && (
                      <div className="px-5 pb-4 bg-slate-50/60">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 pt-1">
                          Historique des paiements
                        </p>
                        <div className="space-y-1.5">
                          {facture.paiements.map((p, pi) => (
                            <div key={p.id} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 text-slate-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                <span>{formatDate(p.datePaiement)}</span>
                                <span className="text-slate-300">·</span>
                                <span>{METHODE[p.methode] ?? p.methode}</span>
                                {p.reference && (
                                  <>
                                    <span className="text-slate-300">·</span>
                                    <span className="font-mono text-slate-400">{p.reference}</span>
                                  </>
                                )}
                              </div>
                              <span className="font-semibold text-green-600">{formatMAD(p.montant)}</span>
                            </div>
                          ))}
                        </div>
                        {/* Balance summary */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Total payé</span>
                          <span className="font-bold text-slate-700">{formatMAD(facture.montantPaye)}</span>
                        </div>
                        {restant > 0.01 && (
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-amber-600 font-medium">Reste à payer</span>
                            <span className="font-bold text-amber-600">{formatMAD(restant)}</span>
                          </div>
                        )}
                        {restant <= 0.01 && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Facture entièrement réglée
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Other devis (accepted/refused/expired) */}
        {otherDevis.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Devis passés
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {otherDevis.map((devis, i) => (
                <div
                  key={devis.id}
                  className={cn(
                    'flex items-center justify-between px-5 py-4 gap-4',
                    i < otherDevis.length - 1 && 'border-b border-slate-100',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{devis.reference}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(devis.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900 hidden sm:block">{formatMAD(devis.totalTTC)}</p>
                    <StatusBadge statut={devis.statut} type="devis" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.devis.length === 0 && data.factures.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Aucun document pour le moment.</p>
          </div>
        )}

        {/* Company contact footer */}
        <footer className="border-t border-slate-200 pt-6 pb-4">
          <p className="text-xs text-slate-400 mb-3">Contactez-nous</p>
          <div className="flex flex-wrap gap-4">
            {data.entreprise.email && (
              <a href={`mailto:${data.entreprise.email}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
                <Mail className="w-3.5 h-3.5" /> {data.entreprise.email}
              </a>
            )}
            {data.entreprise.telephone && (
              <a href={`tel:${data.entreprise.telephone}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
                <Phone className="w-3.5 h-3.5" /> {data.entreprise.telephone}
              </a>
            )}
            {data.entreprise.website && (
              <a href={data.entreprise.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
                <Globe className="w-3.5 h-3.5" /> Site web
              </a>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-6">Propulsé par Sayerli</p>
        </footer>
      </main>
    </div>
  )
}

// ── DevisCard — pending action ─────────────────────────────────────────────────

function DevisCard({
  devis,
  primaryColor,
  accepting,
  justAccepted,
  onAccept,
}: {
  devis: PortalDevis
  primaryColor: string
  accepting: boolean
  justAccepted: boolean
  onAccept: () => void
}) {
  const isExpired = devis.dateExpiration && new Date(devis.dateExpiration) < new Date()
  const canAccept = !isExpired && !justAccepted && devis.statut !== 'ACCEPTE'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${primaryColor}18` }}
          >
            <FileText className="w-5 h-5" style={{ color: primaryColor }} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{devis.reference}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {devis.dateExpiration ? `Valable jusqu'au ${formatDate(devis.dateExpiration)}` : formatDate(devis.createdAt)}
            </p>
          </div>
        </div>
        <StatusBadge statut={isExpired ? 'EXPIRE' : devis.statut} type="devis" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Montant TTC</p>
          <p className="text-xl font-bold text-slate-900">{formatMAD(devis.totalTTC)}</p>
          {n(devis.remise) > 0 && (
            <p className="text-xs text-slate-400">Remise: {formatMAD(devis.remise)}</p>
          )}
        </div>

        <div className="flex gap-2">
          {devis.lienPublic && (
            <a
              href={`/public/devis/${devis.lienPublic.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Détail
            </a>
          )}
          {canAccept && (
            <button
              onClick={onAccept}
              disabled={accepting}
              className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-70"
              style={{ backgroundColor: primaryColor }}
            >
              {accepting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {accepting ? 'En cours…' : 'Accepter'}
            </button>
          )}
          {(justAccepted || devis.statut === 'ACCEPTE') && (
            <span className="px-4 py-2 rounded-xl bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Accepté
            </span>
          )}
        </div>
      </div>

      {devis.notes && (
        <p className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">{devis.notes}</p>
      )}
    </div>
  )
}
