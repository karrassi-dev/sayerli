'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useSearchParams } from 'next/navigation'
import { AlertCircle, Clock } from 'lucide-react'
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
    ice: string | null; activite: string | null; rc: string | null
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0) }

function fmt(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
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

// ── Inner component ───────────────────────────────────────────────────────────

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
        <div className="max-w-xs w-full bg-white rounded-xl shadow-sm p-8 text-center">
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
        <div className="max-w-xs w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Aucun paiement</p>
          <p className="text-xs text-gray-400">Il n&apos;y a pas encore de reçu disponible pour cette facture.</p>
        </div>
      </div>
    )
  }

  // Find target payment
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
  const logoUrl = facture.entreprise.logo ? resolveLogoUrl(facture.entreprise.logo) : null

  const pdfLogoUrl = facture.entreprise.logo
    ? facture.entreprise.logo.startsWith('http')
      ? facture.entreprise.logo
      : `${API_ORIGIN}${facture.entreprise.logo}`
    : null

  const generatedAt = new Date().toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })

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
      rc: facture.entreprise.rc,
    },
    paiements: [{ ...paiement, montant: n(paiement.montant) }],
    totalTTC,
    montantPaye: cumulPaye,
    generatedAt,
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* ── DOCUMENT — matches PDF layout exactly ── */}
        <div className="bg-white shadow-md">

          {/* ── HEADER: Logo + Company name (like CIH BANK header) ── */}
          <div className="px-10 pt-7 pb-5 flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt={facture.entreprise.nom} className="h-12 w-auto object-contain flex-shrink-0" />
            ) : (
              <div
                className="w-12 h-12 flex items-center justify-center text-white font-black text-xl flex-shrink-0 rounded"
                style={{ backgroundColor: brand }}
              >
                {facture.entreprise.nom.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-2xl font-black text-gray-900 leading-tight tracking-tight">
                {facture.entreprise.nom}
              </p>
              {facture.entreprise.activite && (
                <p className="text-xs text-gray-400 mt-0.5">{facture.entreprise.activite}</p>
              )}
            </div>
          </div>

          {/* ── TWO-BAR STRIPE (like CIH bank) ── */}
          <div className="h-3" style={{ backgroundColor: brand }} />
          <div className="h-1" style={{ backgroundColor: brand, opacity: 0.35 }} />

          {/* ── TITLE ── */}
          <div className="py-6 text-center">
            <h1 className="text-lg font-bold" style={{ color: brand }}>Reçu de Paiement</h1>
          </div>

          {/* ── SERVICE BLOCK (company logo + facture label) ── */}
          <div className="mx-10 mb-6 border border-gray-200 rounded flex items-center gap-4 px-4 py-3">
            {logoUrl ? (
              <div className="w-14 h-14 border border-gray-200 rounded flex items-center justify-center flex-shrink-0 bg-white p-1">
                <img src={logoUrl} alt={facture.entreprise.nom} className="h-full w-auto object-contain" />
              </div>
            ) : (
              <div
                className="w-14 h-14 rounded flex items-center justify-center text-white font-black text-xl flex-shrink-0"
                style={{ backgroundColor: brand }}
              >
                {facture.entreprise.nom.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Paiement Facture {facture.numeroFacture}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{facture.entreprise.nom}</p>
              {facture.entreprise.adresse && (
                <p className="text-xs text-gray-400">{facture.entreprise.adresse}</p>
              )}
            </div>
          </div>

          {/* ── INFO GRID (left: client / right: payment details) ── */}
          <div className="mx-10 mb-6 grid grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <p className="text-xs text-gray-900">
                <span className="font-semibold">Client :</span> {facture.client.nom}
              </p>
              {facture.client.nomEntreprise && (
                <p className="text-xs text-gray-900">
                  <span className="font-semibold">Entreprise :</span> {facture.client.nomEntreprise}
                </p>
              )}
              {facture.client.email && (
                <p className="text-xs text-gray-900">
                  <span className="font-semibold">Email :</span> {facture.client.email}
                </p>
              )}
              {facture.entreprise.ice && (
                <p className="text-xs text-gray-900">
                  <span className="font-semibold">ICE :</span> {facture.entreprise.ice}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-900">
                <span className="font-semibold">Montant Total :</span> {fmt(paiement.montant)}
              </p>
              <p className="text-xs text-gray-900">
                <span className="font-semibold">Méthode :</span> {METHODE_LABELS[paiement.methode] ?? paiement.methode}
              </p>
              {paiement.reference && (
                <p className="text-xs text-gray-900">
                  <span className="font-semibold">Référence :</span> {paiement.reference}
                </p>
              )}
              <p className="text-xs text-gray-900">
                <span className="font-semibold">Date Paiement :</span> {fmtDate(paiement.datePaiement)}
              </p>
            </div>
          </div>

          {/* ── DETAILS TABLE ── */}
          <div className="mx-10 mb-6">
            <p className="text-sm font-bold mb-2" style={{ color: brand }}>Détails du paiement</p>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ backgroundColor: brand }}>
                  <th className="text-left text-white font-semibold px-3 py-2.5">Description</th>
                  <th className="text-left text-white font-semibold px-3 py-2.5">Référence</th>
                  <th className="text-right text-white font-semibold px-3 py-2.5">Montant</th>
                  <th className="text-right text-white font-semibold px-3 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2.5 text-gray-800">
                    {METHODE_LABELS[paiement.methode] ?? paiement.methode}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 font-mono">
                    {paiement.reference || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                    {fmt(paiement.montant)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-600">
                    {fmtDate(paiement.datePaiement)}
                  </td>
                </tr>
                {/* Cumul row */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-3 py-2 text-gray-500 text-[11px]" colSpan={2}>
                    Cumul payé sur cette facture
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-gray-900 text-[11px]">
                    {fmt(cumulPaye)}
                  </td>
                  <td></td>
                </tr>
                {/* Remaining row */}
                <tr className={isFullyPaid ? 'bg-green-50' : 'bg-amber-50'}>
                  <td
                    className={`px-3 py-2 text-[11px] font-semibold ${isFullyPaid ? 'text-green-700' : 'text-amber-700'}`}
                    colSpan={2}
                  >
                    {isFullyPaid ? '✓ Facture entièrement réglée' : 'Reste à payer'}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-bold text-[11px] ${isFullyPaid ? 'text-green-700' : 'text-amber-700'}`}
                  >
                    {isFullyPaid ? '0,00 MAD' : fmt(restant)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── NOTE ── */}
          <div className="mx-10 mb-8">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              <span className="font-semibold">N.B :</span> Ce reçu a été généré automatiquement par{' '}
              <span className="font-semibold">{facture.entreprise.nom}</span> via Sayerli.
              Pour toute question, contactez-nous à{' '}
              {facture.entreprise.email
                ? <span className="font-semibold">{facture.entreprise.email}</span>
                : 'notre service client'}.
            </p>
          </div>

          {/* ── DOCUMENT FOOTER ── */}
          <div className="border-t border-gray-200 px-10 py-3 flex justify-between items-center bg-gray-50">
            <p className="text-[10px] text-gray-400">
              Généré le {generatedAt} · Ref. {facture.numeroFacture}
            </p>
            <p className="text-[10px] text-gray-400">sayerli.com</p>
          </div>
        </div>

        {/* ── DOWNLOAD BUTTON ── */}
        <div className="bg-white shadow-sm rounded p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">Télécharger ce reçu en PDF</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Ce fichier PDF est identique au document ci-dessus.
            </p>
          </div>
          <RecuDownloadButton
            data={recuData}
            label="Télécharger (PDF)"
            loadingLabel="Génération…"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: brand }}
          />
        </div>

      </div>
    </div>
  )
}

export default function PublicRecuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <RecuContent />
    </Suspense>
  )
}
