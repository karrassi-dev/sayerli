'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { publicFacturesApi } from '@/lib/api'

const RecuDownloadButton = dynamic(
  () => import('@/components/pdf/RecuDownloadButton'),
  { ssr: false },
)

// ── Types ─────────────────────────────────────────────────────────────────────

interface PublicPaiement {
  id: string
  montant: number | string
  methode: string
  datePaiement: string
  reference: string | null
}

interface PublicFacture {
  id: string
  numeroFacture: string
  statut: string
  totalTTC: number | string
  montantPaye: number | string
  client: { nom: string; email: string | null; telephone: string | null; nomEntreprise: string | null }
  paiements: PublicPaiement[]
  entreprise: {
    nom: string; email: string | null; telephone: string | null
    adresse: string | null; logo: string | null; couleurPrimaire: string | null
    ice: string | null; activite: string | null
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0) }

function fmt(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })
}

const METHODE_LABELS: Record<string, string> = {
  VIREMENT: 'Virement bancaire',
  CASH:     'Espèces',
  CHEQUE:   'Chèque',
  CARTE:    'Carte bancaire',
  MOBILE:   'Mobile',
  AUTRE:    'Autre',
}

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/\/api\/v1\/?$/, '')

function resolveLogoUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_ORIGIN}${path}`
}

// ── Inner component (needs useSearchParams) ───────────────────────────────────

function RecuContent() {
  const { token } = useParams<{ token: string }>()
  const searchParams = useSearchParams()
  const paiementId = searchParams.get('p')

  const [facture, setFacture] = useState<PublicFacture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    publicFacturesApi.get(token)
      .then(res => setFacture(res.data?.data ?? res.data))
      .catch(err => setError(err?.response?.data?.message ?? 'Ce lien est invalide ou a expiré.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !facture) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-xs w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Lien invalide</p>
          <p className="text-xs text-gray-400">{error ?? 'Ce reçu est introuvable.'}</p>
        </div>
      </div>
    )
  }

  if (!facture.paiements || facture.paiements.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-xs w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Aucun paiement</p>
          <p className="text-xs text-gray-400">Il n&apos;y a pas encore de reçu disponible pour cette facture.</p>
        </div>
      </div>
    )
  }

  // Find the target payment — by ID if given, otherwise the latest
  const sorted = [...facture.paiements].sort(
    (a, b) => new Date(a.datePaiement).getTime() - new Date(b.datePaiement).getTime()
  )
  const paiement = paiementId
    ? (sorted.find(p => p.id === paiementId) ?? sorted[sorted.length - 1])
    : sorted[sorted.length - 1]

  // Cumulative paid up to and including this payment
  const targetIdx = sorted.findIndex(p => p.id === paiement.id)
  const cumulPaye = sorted.slice(0, targetIdx + 1).reduce((s, p) => s + n(p.montant), 0)

  const totalTTC = n(facture.totalTTC)
  const restant = Math.max(0, totalTTC - cumulPaye)
  const isFullyPaid = restant < 0.01
  const brand = facture.entreprise.couleurPrimaire || '#16a34a'

  const pdfLogoUrl = facture.entreprise.logo
    ? facture.entreprise.logo.startsWith('http')
      ? facture.entreprise.logo
      : `${API_ORIGIN}${facture.entreprise.logo}`
    : null

  const generatedAt = new Date().toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })

  const recuData = {
    numeroFacture: facture.numeroFacture,
    client: { nom: facture.client.nom, nomEntreprise: facture.client.nomEntreprise, email: facture.client.email },
    entreprise: {
      nom: facture.entreprise.nom,
      logoUrl: pdfLogoUrl,
      adresse: facture.entreprise.adresse,
      telephone: facture.entreprise.telephone,
      email: facture.entreprise.email,
      couleurPrimaire: brand,
      ice: facture.entreprise.ice,
    },
    paiements: [{ ...paiement, montant: n(paiement.montant) }],
    totalTTC,
    montantPaye: cumulPaye,
    generatedAt,
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-sm space-y-3">

        {/* ── RECEIPT CARD ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Brand strip */}
          <div className="h-1.5" style={{ backgroundColor: brand }} />

          {/* Company header */}
          <div className="px-6 pt-5 pb-4 flex items-center gap-3 border-b border-gray-100">
            {facture.entreprise.logo ? (
              <img
                src={resolveLogoUrl(facture.entreprise.logo)}
                alt={facture.entreprise.nom}
                className="h-9 w-auto object-contain flex-shrink-0"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-base flex-shrink-0"
                style={{ backgroundColor: brand }}
              >
                {facture.entreprise.nom.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{facture.entreprise.nom}</p>
              {facture.entreprise.email && (
                <p className="text-[11px] text-gray-400 truncate">{facture.entreprise.email}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="px-6 pt-5 pb-3 text-center">
            <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-1">Reçu de paiement</p>
            <p className="text-xs font-semibold text-gray-500">{facture.numeroFacture}</p>
          </div>

          {/* Client */}
          <div className="px-6 pb-4 text-center">
            <p className="text-sm font-bold text-gray-900">{facture.client.nom}</p>
            {facture.client.nomEntreprise && (
              <p className="text-xs text-gray-400 mt-0.5">{facture.client.nomEntreprise}</p>
            )}
          </div>

          {/* Amount block */}
          <div className="mx-5 mb-5 rounded-xl overflow-hidden" style={{ backgroundColor: isFullyPaid ? '#f0fdf4' : '#f8fafc', border: `1.5px solid ${isFullyPaid ? '#86efac' : '#e2e8f0'}` }}>
            <div className="px-5 py-5 text-center">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: brand }}>
                Montant reçu
              </p>
              <p className="text-3xl font-black" style={{ color: brand }}>
                {fmt(paiement.montant)}
              </p>
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-gray-600">
                  {METHODE_LABELS[paiement.methode] ?? paiement.methode}
                </p>
                {paiement.reference && (
                  <p className="text-[11px] text-gray-400 font-mono">{paiement.reference}</p>
                )}
                <p className="text-[11px] text-gray-400">{fmtDate(paiement.datePaiement)}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mx-5 mb-5 border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-xs text-gray-400">Total facture</span>
              <span className="text-xs font-semibold text-gray-700">{fmt(totalTTC)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-xs text-gray-400">Cumul payé</span>
              <span className="text-xs font-semibold text-emerald-600">{fmt(cumulPaye)}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-xs text-gray-400">Reste à payer</span>
              <span className={`text-xs font-bold ${isFullyPaid ? 'text-emerald-600' : 'text-red-500'}`}>
                {isFullyPaid ? '—' : fmt(restant)}
              </span>
            </div>
          </div>

          {/* Paid badge */}
          {isFullyPaid ? (
            <div className="mx-5 mb-5 rounded-xl bg-emerald-50 border border-emerald-200 py-3 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black text-emerald-700 tracking-wide">PAYÉ INTÉGRALEMENT</span>
            </div>
          ) : (
            <div className="mx-5 mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="text-xs text-amber-700 text-center">
                Reste <strong>{fmt(restant)}</strong> à régler sur cette facture.
              </p>
            </div>
          )}

          {/* Download */}
          <div className="px-5 pb-5">
            <RecuDownloadButton
              data={recuData}
              label="Télécharger ce reçu (PDF)"
              loadingLabel="Génération…"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: brand }}
            />
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 text-center">
              Reçu émis par <span className="font-semibold text-gray-500">{facture.entreprise.nom}</span> via Sayerli
            </p>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 text-center">
          sayerli.com · Logiciel de facturation pour PME marocaines
        </p>
      </div>
    </div>
  )
}

// ── Page wrapper (Suspense required for useSearchParams) ──────────────────────

export default function PublicRecuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <RecuContent />
    </Suspense>
  )
}
