'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  FileText, Receipt, CheckCircle, XCircle, Clock, AlertCircle,
  Mail, Phone, Globe, Loader2, Check, ArrowRight, ExternalLink,
  ChevronRight,
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
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const METHODE_LABELS: Record<string, string> = {
  VIREMENT: 'Virement bancaire', CASH: 'Espèces', CHEQUE: 'Chèque',
  CARTE: 'Carte bancaire', MOBILE: 'Mobile', AUTRE: 'Autre',
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface PortalPaiement {
  id: string
  montant: number | string
  methode: string
  datePaiement: string
  reference: string | null
}

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

// ── Status config ─────────────────────────────────────────────────────────────

const DEVIS_STATUS: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  ENVOYE:  { label: 'En attente',  bg: 'bg-blue-50',   text: 'text-blue-700',   icon: Clock },
  VU:      { label: 'Consulté',    bg: 'bg-purple-50',  text: 'text-purple-700', icon: Clock },
  ACCEPTE: { label: 'Accepté',     bg: 'bg-emerald-50', text: 'text-emerald-700',icon: CheckCircle },
  REFUSE:  { label: 'Refusé',      bg: 'bg-red-50',     text: 'text-red-600',    icon: XCircle },
  EXPIRE:  { label: 'Expiré',      bg: 'bg-slate-100',  text: 'text-slate-500',  icon: AlertCircle },
}

const FACTURE_STATUS: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  ENVOYEE:   { label: 'À régler',   bg: 'bg-blue-50',   text: 'text-blue-700',   icon: Clock },
  VUE:       { label: 'Vue',        bg: 'bg-purple-50',  text: 'text-purple-700', icon: Clock },
  PARTIELLE: { label: 'Partielle',  bg: 'bg-amber-50',   text: 'text-amber-700',  icon: AlertCircle },
  EN_RETARD: { label: 'En retard',  bg: 'bg-red-50',     text: 'text-red-600',    icon: AlertCircle },
  PAYEE:     { label: 'Payée',      bg: 'bg-emerald-50', text: 'text-emerald-700',icon: CheckCircle },
}

function Badge({ label, bg, text, icon: Icon }: { label: string; bg: string; text: string; icon: React.ElementType }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', bg, text)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, count, color }: {
  icon: React.ElementType; title: string; count: number; color: string
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <span className="text-sm text-slate-400">({count})</span>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function PortalPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData]       = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [accepting, setAccepting] = useState<string | null>(null)
  const [accepted, setAccepted]   = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'devis' | 'factures' | 'recus'>('factures')

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
    } catch { /* silently ignore */ }
    finally { setAccepting(null) }
  }

  const brand = data?.entreprise.couleurPrimaire || '#6366f1'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-slate-700 mb-2">Portail introuvable</h1>
          <p className="text-sm text-slate-500">Ce lien portail est invalide ou a été désactivé.</p>
        </div>
      </div>
    )
  }

  // Build flat list of receipts (one per payment)
  const allRecus: { facture: PortalFacture; paiement: PortalPaiement }[] = []
  data.factures.forEach(f => {
    f.paiements?.forEach(p => allRecus.push({ facture: f, paiement: p }))
  })
  allRecus.sort((a, b) => new Date(b.paiement.datePaiement).getTime() - new Date(a.paiement.datePaiement).getTime())

  const tabs = [
    { key: 'factures' as const, label: 'Factures',  count: data.factures.length, icon: Receipt },
    { key: 'devis'    as const, label: 'Devis',     count: data.devis.length,    icon: FileText },
    { key: 'recus'    as const, label: 'Reçus',     count: allRecus.length,      icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {data.entreprise.logo ? (
            <img src={data.entreprise.logo} alt={data.entreprise.nom} className="h-8 w-auto object-contain rounded" />
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: brand }}>
              {data.entreprise.nom.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{data.entreprise.nom}</p>
            <p className="text-xs text-slate-400">Espace client</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* ── WELCOME ── */}
        <div className="pt-2">
          <h1 className="text-xl font-bold text-slate-900">
            Bonjour, {data.nomEntreprise || data.nom} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Retrouvez ici tous vos documents avec {data.entreprise.nom}.
          </p>
        </div>

        {/* ── SUMMARY CARDS ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-2xl font-black text-slate-900">{data.factures.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Facture{data.factures.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-2xl font-black text-slate-900">{data.devis.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Devis</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-2xl font-black text-emerald-600">{allRecus.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Reçu{allRecus.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-semibold transition-all',
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <tab.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  'text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0',
                  activeTab === tab.key ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500',
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── FACTURES TAB ── */}
        {activeTab === 'factures' && (
          <section>
            <SectionHeader icon={Receipt} title="Factures" count={data.factures.length} color={brand} />
            {data.factures.length === 0 ? (
              <EmptyState message="Aucune facture pour le moment." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.factures.map(facture => {
                  const status = FACTURE_STATUS[facture.statut] ?? { label: facture.statut, bg: 'bg-slate-100', text: 'text-slate-500', icon: Clock }
                  const montantPaye = n(facture.montantPaye)
                  const totalTTC   = n(facture.totalTTC)
                  const restant    = Math.max(0, totalTTC - montantPaye)
                  const progress   = totalTTC > 0 ? Math.min(100, (montantPaye / totalTTC) * 100) : 0
                  const isOverdue  = facture.statut === 'EN_RETARD'
                  const isPayee    = facture.statut === 'PAYEE'
                  return (
                    <div key={facture.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      {/* Top accent */}
                      <div className="h-1" style={{ backgroundColor: isPayee ? '#10b981' : isOverdue ? '#ef4444' : brand }} />
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                              isPayee ? 'bg-emerald-100' : isOverdue ? 'bg-red-100' : 'bg-slate-100')}>
                              <Receipt className={cn('w-4 h-4', isPayee ? 'text-emerald-600' : isOverdue ? 'text-red-500' : 'text-slate-500')} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{facture.numeroFacture}</p>
                              <p className="text-xs text-slate-400">
                                {facture.dateEcheance
                                  ? `Échéance ${formatDate(facture.dateEcheance)}`
                                  : formatDate(facture.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Badge {...status} />
                        </div>

                        {/* Amount */}
                        <div className="mb-3">
                          <p className="text-xl font-black text-slate-900">{formatMAD(totalTTC)}</p>
                          {facture.statut === 'PARTIELLE' && (
                            <p className="text-xs text-amber-600 mt-0.5">
                              Payé {formatMAD(montantPaye)} · Reste {formatMAD(restant)}
                            </p>
                          )}
                        </div>

                        {/* Progress bar for partial */}
                        {facture.statut === 'PARTIELLE' && (
                          <div className="h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                        )}
                        {isPayee && (
                          <div className="h-1.5 bg-emerald-100 rounded-full mb-3 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-full" />
                          </div>
                        )}

                        {/* Action */}
                        <a
                          href={`/public/factures/${facture.publicToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Voir la facture
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ── DEVIS TAB ── */}
        {activeTab === 'devis' && (
          <section>
            <SectionHeader icon={FileText} title="Devis" count={data.devis.length} color={brand} />
            {data.devis.length === 0 ? (
              <EmptyState message="Aucun devis pour le moment." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.devis.map(devis => {
                  const isExpired    = !!(devis.dateExpiration && new Date(devis.dateExpiration) < new Date())
                  const effectifStatut = isExpired && devis.statut !== 'ACCEPTE' ? 'EXPIRE' : devis.statut
                  const status = DEVIS_STATUS[effectifStatut] ?? { label: effectifStatut, bg: 'bg-slate-100', text: 'text-slate-500', icon: Clock }
                  const canAccept = !isExpired && !accepted.has(devis.id) && !['ACCEPTE', 'REFUSE', 'EXPIRE'].includes(devis.statut)
                  const isAccepted = accepted.has(devis.id) || devis.statut === 'ACCEPTE'
                  return (
                    <div key={devis.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="h-1" style={{ backgroundColor: isAccepted ? '#10b981' : brand }} />
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${brand}18` }}>
                              <FileText className="w-4 h-4" style={{ color: brand }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{devis.reference}</p>
                              <p className="text-xs text-slate-400">
                                {devis.dateExpiration
                                  ? `Valable jusqu'au ${formatDate(devis.dateExpiration)}`
                                  : formatDate(devis.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Badge {...status} />
                        </div>

                        {/* Amount */}
                        <div className="mb-3">
                          <p className="text-xl font-black text-slate-900">{formatMAD(devis.totalTTC)}</p>
                          {n(devis.remise) > 0 && (
                            <p className="text-xs text-slate-400 mt-0.5">Remise : {formatMAD(devis.remise)}</p>
                          )}
                        </div>

                        {/* Notes */}
                        {devis.notes && (
                          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-3">
                            {devis.notes}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          {devis.lienPublic && (
                            <a
                              href={`/public/devis/${devis.lienPublic.token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Voir le détail
                            </a>
                          )}
                          {canAccept && (
                            <button
                              onClick={() => handleAcceptDevis(devis.id)}
                              disabled={accepting === devis.id}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-semibold transition-all disabled:opacity-70"
                              style={{ backgroundColor: brand }}
                            >
                              {accepting === devis.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Check className="w-3.5 h-3.5" />}
                              {accepting === devis.id ? 'En cours…' : 'Accepter'}
                            </button>
                          )}
                          {isAccepted && (
                            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" /> Accepté
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ── REÇUS TAB ── */}
        {activeTab === 'recus' && (
          <section>
            <SectionHeader icon={CheckCircle} title="Reçus de paiement" count={allRecus.length} color="#10b981" />
            {allRecus.length === 0 ? (
              <EmptyState message="Aucun reçu disponible pour le moment." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allRecus.map(({ facture, paiement }) => {
                  const recuUrl = `/public/factures/${facture.publicToken}/recu?p=${paiement.id}`
                  return (
                    <div key={paiement.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="h-1 bg-emerald-500" />
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{facture.numeroFacture}</p>
                            <p className="text-xs text-slate-400">{formatDate(paiement.datePaiement)}</p>
                          </div>
                          <span className="ml-auto text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex-shrink-0">
                            Reçu
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="mb-3">
                          <p className="text-xl font-black text-emerald-600">{formatMAD(paiement.montant)}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {METHODE_LABELS[paiement.methode] ?? paiement.methode}
                            {paiement.reference ? ` · ${paiement.reference}` : ''}
                          </p>
                        </div>

                        {/* CTA */}
                        <a
                          href={recuUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          Voir &amp; télécharger le reçu
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer className="border-t border-slate-200 pt-5 pb-6">
          <p className="text-xs text-slate-400 mb-3 font-medium">Nous contacter</p>
          <div className="flex flex-wrap gap-3">
            {data.entreprise.email && (
              <a href={`mailto:${data.entreprise.email}`}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
                <Mail className="w-3.5 h-3.5" /> {data.entreprise.email}
              </a>
            )}
            {data.entreprise.telephone && (
              <a href={`tel:${data.entreprise.telephone}`}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
                <Phone className="w-3.5 h-3.5" /> {data.entreprise.telephone}
              </a>
            )}
            {data.entreprise.website && (
              <a href={data.entreprise.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
                <Globe className="w-3.5 h-3.5" /> Site web
              </a>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-5">Propulsé par Sayerli</p>
        </footer>

      </main>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 py-12 text-center">
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}
