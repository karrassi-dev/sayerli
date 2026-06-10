'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import {
  CheckCircle, XCircle, Clock, Building2, Mail, Phone, MapPin,
  AlertCircle, Eye, FileText,
} from 'lucide-react'
import { publicDevisApi } from '@/lib/api'
import { cn } from '@/lib/utils'

const DevisDownloadButton = dynamic(
  () => import('@/components/pdf/DevisDownloadButton'),
  { ssr: false },
)

// ── Types ──────────────────────────────────────────────────────────────────────

interface Ligne {
  id: string
  description: string
  quantite: number | string
  prixUnitaire: number | string
  total: number | string
  ordre: number
}

interface PublicDevis {
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
  notes: string | null
  createdAt: string
  client: { nom: string; email: string | null; telephone: string | null; nomEntreprise: string | null }
  lignes: Ligne[]
  entreprise: {
    nom: string; email: string | null; telephone: string | null
    adresse: string | null; logo: string | null; couleurPrimaire: string | null
    ice: string | null; rc: string | null; website: string | null
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : v }

function formatMAD(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateTime(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/\/api\/v1\/?$/, '')
function logoUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_ORIGIN}${path}`
}

function isExpired(devis: PublicDevis) {
  if (!devis.dateExpiration) return false
  return new Date(devis.dateExpiration) < new Date()
}

// ── Confirmation Modal ─────────────────────────────────────────────────────────

function ConfirmModal({
  open, onClose, onConfirm, title, message, confirmLabel, danger, loading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel: string
  danger?: boolean
  loading?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all',
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700',
            )}
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status Gate Component ──────────────────────────────────────────────────────

function StatusGate({ statut, brand }: { statut: string; brand: string }) {
  const configs: Record<string, { icon: React.ElementType; color: string; bg: string; title: string; desc: string }> = {
    ACCEPTE: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
      title: 'Devis accepté',
      desc: 'Ce devis a déjà été accepté. Merci de votre confiance.',
    },
    REFUSE: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950/30',
      title: 'Devis refusé',
      desc: 'Ce devis a été refusé.',
    },
    EXPIRE: {
      icon: Clock,
      color: 'text-slate-500',
      bg: 'bg-slate-50 dark:bg-slate-800',
      title: 'Devis expiré',
      desc: 'Ce devis a expiré. Contactez l\'entreprise pour un nouveau devis.',
    },
    BROUILLON: {
      icon: FileText,
      color: 'text-slate-500',
      bg: 'bg-slate-50 dark:bg-slate-800',
      title: 'Devis non disponible',
      desc: 'Ce devis n\'est pas encore disponible.',
    },
  }

  const cfg = configs[statut]
  if (!cfg) return null
  const Icon = cfg.icon

  return (
    <div className={cn('p-5 rounded-2xl flex items-start gap-4 mb-4', cfg.bg)}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg)}>
        <Icon className={cn('w-6 h-6', cfg.color)} />
      </div>
      <div>
        <p className={cn('font-bold text-sm', cfg.color)}>{cfg.title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{cfg.desc}</p>
      </div>
    </div>
  )
}

// ── Refused Screen ────────────────────────────────────────────────────────────

function RefusedScreen() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-100 dark:bg-red-950/40">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Devis refusé</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Votre réponse a été enregistrée. L&apos;entreprise a été notifiée.
        </p>
        <p className="mt-6 text-xs text-slate-400">
          Généré par <span className="font-semibold text-slate-500">Sayerli</span>
        </p>
      </div>
    </div>
  )
}

// ── Accepted Screen ───────────────────────────────────────────────────────────

function AcceptedScreen({ devis, acceptedAt }: { devis: PublicDevis; acceptedAt: Date }) {
  const brand = devis.entreprise.couleurPrimaire || '#2563eb'

  const pdfLogoUrl = devis.entreprise.logo
    ? devis.entreprise.logo.startsWith('http')
      ? devis.entreprise.logo
      : `${API_ORIGIN}${devis.entreprise.logo}`
    : null

  const pdfData = {
    reference: devis.reference,
    createdAt: devis.createdAt,
    dateExpiration: devis.dateExpiration,
    dateAcceptation: acceptedAt.toISOString(),
    notes: devis.notes,
    totalHT: parseFloat(String(devis.totalHT)) || 0,
    remise: parseFloat(String(devis.remise)) || 0,
    taxe: parseFloat(String(devis.taxe)) || 0,
    totalTTC: parseFloat(String(devis.totalTTC)) || 0,
    lignes: devis.lignes.map(l => ({
      description: l.description,
      quantite: parseFloat(String(l.quantite)) || 0,
      prixUnitaire: parseFloat(String(l.prixUnitaire)) || 0,
      total: parseFloat(String(l.total)) || 0,
    })),
    client: devis.client,
    entreprise: { ...devis.entreprise, logoUrl: pdfLogoUrl },
  }

  const acceptedStr = acceptedAt.toLocaleString('fr-MA', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Main card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
          {/* Brand top bar */}
          <div className="h-1.5" style={{ backgroundColor: brand }} />

          <div className="p-8 text-center">
            {/* Checkmark */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-green-100 dark:bg-green-950/40">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Devis accepté !</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Merci. Votre acceptation a bien été enregistrée.
              <br />
              <span className="font-semibold text-slate-600 dark:text-slate-300">{devis.entreprise.nom}</span> a été notifié et vous contactera prochainement.
            </p>

            {/* Acceptance info */}
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 mb-6">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-green-700 dark:text-green-400">{devis.reference}</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">Accepté le {acceptedStr}</p>
              </div>
            </div>

            {/* Download button */}
            <DevisDownloadButton data={pdfData} brand={brand} />

            <p className="mt-6 text-xs text-slate-400">
              Le PDF inclut le détail complet du devis et la confirmation d&apos;acceptation.
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center">
          Généré par <span className="font-semibold text-slate-500">Sayerli</span> — Logiciel de gestion pour PME marocaines
        </p>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function PublicDevisPage() {
  const { token } = useParams<{ token: string }>()

  const [devis, setDevis] = useState<PublicDevis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<'accept' | 'refuse' | null>(null)
  const [responding, setResponding] = useState(false)
  const [done, setDone] = useState<'accepted' | 'refused' | null>(null)
  const [acceptedAt, setAcceptedAt] = useState<Date | null>(null)

  useEffect(() => {
    if (!token) return
    publicDevisApi.get(token)
      .then(res => {
        const data = res.data?.data ?? res.data
        setDevis(data)
      })
      .catch(err => {
        const msg = err?.response?.data?.message
        setError(msg ?? 'Ce lien est invalide ou a expiré.')
      })
      .finally(() => setLoading(false))
  }, [token])

  const handleRespond = async (action: 'accept' | 'refuse') => {
    setResponding(true)
    try {
      if (action === 'accept') {
        await publicDevisApi.accept(token)
        setAcceptedAt(new Date())
        setDone('accepted')
      } else {
        await publicDevisApi.refuse(token)
        setDone('refused')
      }
      setConfirming(null)
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Une erreur est survenue.')
      setConfirming(null)
    } finally {
      setResponding(false)
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  // ── Link invalid ──
  if (error || !devis) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lien invalide</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{error ?? 'Ce lien de devis est invalide ou a expiré.'}</p>
        </div>
      </div>
    )
  }

  // ── Full success screen after responding ──
  if (done === 'refused') return <RefusedScreen />
  if (done === 'accepted' && acceptedAt && devis) return <AcceptedScreen devis={devis} acceptedAt={acceptedAt} />

  const brand = devis.entreprise.couleurPrimaire || '#2563eb'
  const expired = isExpired(devis)

  // ── Full-page gates — no quote content rendered ──
  if (devis.statut === 'BROUILLON') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Devis non disponible</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ce devis n&apos;est pas encore disponible. Contactez l&apos;entreprise pour plus d&apos;informations.</p>
        </div>
      </div>
    )
  }

  if (expired && devis.statut !== 'ACCEPTE' && devis.statut !== 'REFUSE') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Devis expiré</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ce devis a expiré le {formatDate(devis.dateExpiration)}. Contactez l&apos;entreprise pour obtenir un nouveau devis.</p>
        </div>
      </div>
    )
  }

  const canRespond = devis.statut === 'ENVOYE' || devis.statut === 'VU'
  const sousTotal = devis.lignes.reduce((s, l) => s + n(l.quantite) * n(l.prixUnitaire), 0)

  // Inline status banner only for already-resolved states shown with content
  const gateStatus: string | null =
    devis.statut === 'ACCEPTE' ? 'ACCEPTE' :
    devis.statut === 'REFUSE'  ? 'REFUSE'  :
    null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Status gate banner */}
        {gateStatus && <StatusGate statut={gateStatus} brand={brand} />}

        {/* Quote card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">

          {/* Brand header */}
          <div className="p-6 sm:p-8" style={{ borderTop: `4px solid ${brand}` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {devis.entreprise.logo ? (
                  <img
                    src={logoUrl(devis.entreprise.logo)}
                    alt={devis.entreprise.nom}
                    className="h-12 w-auto object-contain rounded-lg"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl"
                    style={{ backgroundColor: brand }}
                  >
                    {devis.entreprise.nom.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="font-black text-lg text-slate-900 dark:text-white">{devis.entreprise.nom}</h1>
                  {devis.entreprise.email && <p className="text-xs text-slate-500">{devis.entreprise.email}</p>}
                  {devis.entreprise.telephone && <p className="text-xs text-slate-500">{devis.entreprise.telephone}</p>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">DEVIS</span>
                <p className="font-black text-xl text-slate-900 dark:text-white">{devis.reference}</p>
                <span className={cn(
                  'inline-block mt-1 text-xs px-2.5 py-1 rounded-full font-semibold',
                  devis.statut === 'ACCEPTE' ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400' :
                  devis.statut === 'REFUSE'  ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' :
                  devis.statut === 'VU'      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
                )}>
                  {devis.statut === 'BROUILLON' ? 'Brouillon' :
                   devis.statut === 'ENVOYE'    ? 'Envoyé' :
                   devis.statut === 'VU'         ? 'Vu' :
                   devis.statut === 'ACCEPTE'   ? 'Accepté' :
                   devis.statut === 'REFUSE'    ? 'Refusé' : devis.statut}
                </span>
              </div>
            </div>
          </div>

          {/* Company + Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-8 pb-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">De</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{devis.entreprise.nom}</p>
              {devis.entreprise.adresse && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />{devis.entreprise.adresse}
                </p>
              )}
              {devis.entreprise.ice && <p className="text-xs text-slate-500">ICE: {devis.entreprise.ice}</p>}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pour</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{devis.client.nom}</p>
              {devis.client.nomEntreprise && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 flex-shrink-0" />{devis.client.nomEntreprise}
                </p>
              )}
              {devis.client.email && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />{devis.client.email}
                </p>
              )}
              {devis.client.telephone && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />{devis.client.telephone}
                </p>
              )}
            </div>
          </div>

          {/* Expiry date */}
          {devis.dateExpiration && (
            <div className="px-6 sm:px-8 pb-4">
              <span className={cn(
                'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg',
                expired
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                  : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400',
              )}>
                <Clock className="w-3.5 h-3.5" />
                {expired ? 'Expiré le ' : 'Expire le '}
                {formatDate(devis.dateExpiration)}
              </span>
            </div>
          )}

          {/* Items table */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Désignation</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Qté</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">P.U</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {devis.lignes.map((l, i) => (
                    <tr key={l.id ?? i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{l.description}</td>
                      <td className="px-4 py-3 text-center text-slate-500 hidden sm:table-cell">{n(l.quantite)}</td>
                      <td className="px-4 py-3 text-right text-slate-500 hidden sm:table-cell">{formatMAD(l.prixUnitaire)}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{formatMAD(n(l.quantite) * n(l.prixUnitaire))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="ml-auto w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Sous-total</span>
                <span>{formatMAD(sousTotal)}</span>
              </div>
              {n(devis.remise) > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Remise</span>
                  <span>−{formatMAD(devis.remise)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>TVA {n(devis.taxe)}%</span>
                <span>{formatMAD(n(devis.totalTTC) - n(devis.totalHT))}</span>
              </div>
              <div className="flex justify-between font-black text-base text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2">
                <span>Total TTC</span>
                <span style={{ color: brand }}>{formatMAD(devis.totalTTC)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {devis.notes && (
            <div className="px-6 sm:px-8 pb-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Notes</p>
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{devis.notes}</p>
              </div>
            </div>
          )}

          {/* ── Action buttons ── */}
          {canRespond && (
            <div className="px-6 sm:px-8 pb-8 border-t border-slate-100 dark:border-slate-800">
              <div className="pt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 text-center">
                  Veuillez confirmer votre réponse à ce devis.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setConfirming('accept')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: brand }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accepter le devis
                  </button>
                  <button
                    onClick={() => setConfirming('refuse')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-red-600 border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all active:scale-[0.98]"
                  >
                    <XCircle className="w-4 h-4" />
                    Refuser le devis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Already responded — show only accepted/refused state (when user hasn't just responded in this session) */}
          {!canRespond && (devis.statut === 'ACCEPTE' || devis.statut === 'REFUSE') && (
            <div className="px-6 sm:px-8 pb-6">
              <div className={cn(
                'flex items-center gap-3 p-4 rounded-xl',
                devis.statut === 'ACCEPTE'
                  ? 'bg-green-50 dark:bg-green-950/30'
                  : 'bg-red-50 dark:bg-red-950/30',
              )}>
                {devis.statut === 'ACCEPTE'
                  ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                }
                <div>
                  <p className={cn('text-sm font-bold', devis.statut === 'ACCEPTE' ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                    {devis.statut === 'ACCEPTE' ? 'Devis accepté' : 'Devis refusé'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {devis.statut === 'ACCEPTE' && devis.dateAcceptation && `Le ${formatDateTime(devis.dateAcceptation)}`}
                    {devis.statut === 'REFUSE' && devis.dateRefus && `Le ${formatDateTime(devis.dateRefus)}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* View indicator */}
          {(devis.statut === 'ENVOYE' || devis.statut === 'VU') && !expired && (
            <div className="px-6 sm:px-8 pb-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                <span>Ce devis a été consulté</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <p className="text-xs text-slate-400 text-center">
              Généré par <span className="font-semibold text-slate-500">Sayerli</span> — Logiciel de gestion pour PME marocaines
            </p>
          </div>
        </div>
      </div>

      {/* Accept confirmation modal */}
      <ConfirmModal
        open={confirming === 'accept'}
        onClose={() => setConfirming(null)}
        onConfirm={() => handleRespond('accept')}
        title="Confirmer l'acceptation"
        message="En acceptant ce devis, vous confirmez votre accord avec les termes et les montants indiqués. Cette action ne peut pas être annulée."
        confirmLabel="Accepter le devis"
        loading={responding}
      />

      {/* Refuse confirmation modal */}
      <ConfirmModal
        open={confirming === 'refuse'}
        onClose={() => setConfirming(null)}
        onConfirm={() => handleRespond('refuse')}
        title="Refuser le devis ?"
        message="Êtes-vous sûr de vouloir refuser ce devis ? L'entreprise sera notifiée de votre décision."
        confirmLabel="Refuser"
        danger
        loading={responding}
      />
    </div>
  )
}
