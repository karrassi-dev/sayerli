'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { CheckCircle, AlertCircle, Building2, Mail, Phone, MapPin, Download } from 'lucide-react'
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
  totalHT: number | string
  taxe: number | string
  totalTTC: number | string
  remise: number | string
  montantPaye: number | string
  dateEcheance: string | null
  dateEnvoi: string | null
  notes: string | null
  createdAt: string
  devis: { reference: string } | null
  client: { nom: string; email: string | null; telephone: string | null; nomEntreprise: string | null }
  lignes: { id: string; description: string; quantite: number | string; prixUnitaire: number | string; total: number | string; ordre: number }[]
  paiements: PublicPaiement[]
  entreprise: {
    nom: string; email: string | null; telephone: string | null
    adresse: string | null; logo: string | null; couleurPrimaire: string | null
    templateDocument: string | null
    ice: string | null; rc: string | null; website: string | null
    activite: string | null
    titulaireCompte: string | null; banque: string | null
    rib: string | null; iban: string | null; swift: string | null
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0) }

function formatMAD(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateLong(d: string | null | undefined) {
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PublicRecuPage() {
  const { token } = useParams<{ token: string }>()

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
        <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !facture) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Lien invalide</h2>
          <p className="text-sm text-gray-500">{error ?? 'Ce reçu est introuvable.'}</p>
        </div>
      </div>
    )
  }

  if (!facture.paiements || facture.paiements.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Aucun paiement enregistré</h2>
          <p className="text-sm text-gray-500">Il n&apos;y a pas encore de reçu disponible pour cette facture.</p>
        </div>
      </div>
    )
  }

  const brand = facture.entreprise.couleurPrimaire || '#16a34a'
  const montantPaye = n(facture.montantPaye)
  const totalTTC = n(facture.totalTTC)
  const restant = Math.max(0, totalTTC - montantPaye)
  const isFullyPaid = restant < 0.01
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
    paiements: facture.paiements.map(p => ({ ...p, montant: n(p.montant) })),
    totalTTC,
    montantPaye,
    generatedAt,
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* ── DOCUMENT ── */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-8 sm:px-12 py-6 flex items-start justify-between gap-6" style={{ backgroundColor: brand }}>
            <div className="flex items-center gap-4">
              {facture.entreprise.logo ? (
                <div className="bg-white/20 rounded p-1 flex-shrink-0">
                  <img
                    src={resolveLogoUrl(facture.entreprise.logo)}
                    alt={facture.entreprise.nom}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded flex items-center justify-center font-black text-xl flex-shrink-0 bg-white/20 text-white"
                >
                  {facture.entreprise.nom.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-white">{facture.entreprise.nom}</h1>
                {facture.entreprise.email && <p className="text-sm text-white/70">{facture.entreprise.email}</p>}
                {facture.entreprise.telephone && <p className="text-sm text-white/70">{facture.entreprise.telephone}</p>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-bold text-white/60 tracking-[0.2em]">REÇU DE PAIEMENT</p>
              <p className="text-2xl font-black text-white">{facture.numeroFacture}</p>
              <p className="text-xs text-white/50 mt-1">Émis le {generatedAt}</p>
            </div>
          </div>

          {/* Client + Entreprise info */}
          <div className="px-8 sm:px-12 py-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-3">ÉMETTEUR</p>
              <p className="text-sm font-semibold text-gray-900">{facture.entreprise.nom}</p>
              {facture.entreprise.activite && <p className="text-xs text-gray-500 mt-0.5">{facture.entreprise.activite}</p>}
              {facture.entreprise.adresse && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />{facture.entreprise.adresse}
                </p>
              )}
              {facture.entreprise.email && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />{facture.entreprise.email}
                </p>
              )}
              {facture.entreprise.telephone && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />{facture.entreprise.telephone}
                </p>
              )}
              {facture.entreprise.ice && <p className="text-xs text-gray-500 mt-1">ICE : {facture.entreprise.ice}</p>}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-3">CLIENT</p>
              <p className="text-sm font-semibold text-gray-900">{facture.client.nom}</p>
              {facture.client.nomEntreprise && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 flex-shrink-0" />{facture.client.nomEntreprise}
                </p>
              )}
              {facture.client.email && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />{facture.client.email}
                </p>
              )}
              {facture.client.telephone && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />{facture.client.telephone}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Payment history */}
          <div className="px-8 sm:px-12 py-6">
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4">HISTORIQUE DES PAIEMENTS</p>

            <div className="rounded overflow-hidden border border-gray-200">
              {/* Table head */}
              <div className="grid grid-cols-12 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <span className="col-span-3 text-[10px] font-bold text-gray-500 tracking-[0.1em]">DATE</span>
                <span className="col-span-3 text-[10px] font-bold text-gray-500 tracking-[0.1em]">MÉTHODE</span>
                <span className="col-span-4 text-[10px] font-bold text-gray-500 tracking-[0.1em]">RÉFÉRENCE</span>
                <span className="col-span-2 text-[10px] font-bold text-gray-500 tracking-[0.1em] text-right">MONTANT</span>
              </div>
              {/* Rows */}
              {facture.paiements.map((p, i) => (
                <div
                  key={p.id ?? i}
                  className={`grid grid-cols-12 px-4 py-3 border-b border-gray-100 last:border-0 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                >
                  <span className="col-span-3 text-xs text-gray-700">{formatDate(p.datePaiement)}</span>
                  <span className="col-span-3 text-xs text-gray-600">{METHODE_LABELS[p.methode] ?? p.methode}</span>
                  <span className="col-span-4 text-xs text-gray-400 italic">{p.reference || '—'}</span>
                  <span className="col-span-2 text-xs font-bold text-emerald-600 text-right">{formatMAD(p.montant)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="px-8 sm:px-12 pb-6">
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="flex justify-between px-5 py-3 border-b border-gray-100 text-sm text-gray-600">
                <span>Total facture TTC</span>
                <span className="font-semibold text-gray-900">{formatMAD(totalTTC)}</span>
              </div>
              <div className="flex justify-between px-5 py-3 border-b border-gray-100 text-sm">
                <span className="font-semibold text-gray-700">Total payé</span>
                <span className="font-bold text-emerald-600">{formatMAD(montantPaye)}</span>
              </div>
              {!isFullyPaid && (
                <div className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-gray-600">Reste à payer</span>
                  <span className="font-bold text-red-600">{formatMAD(restant)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Badge */}
          {isFullyPaid ? (
            <div className="mx-8 sm:mx-12 mb-8 rounded-lg border-2 border-emerald-200 bg-emerald-50 py-5 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-base font-black text-emerald-700">PAYÉ INTÉGRALEMENT</span>
              </div>
              <p className="text-xs text-emerald-600">Merci pour votre confiance — {facture.entreprise.nom}</p>
            </div>
          ) : (
            <div className="mx-8 sm:mx-12 mb-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm text-amber-700">
                Paiement partiel reçu. Il reste <strong>{formatMAD(restant)}</strong> à régler.
              </p>
            </div>
          )}

          {/* Document footer */}
          <div className="px-8 sm:px-12 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400 tracking-wide">
              Reçu généré automatiquement par <span className="font-semibold text-gray-500">{facture.entreprise.nom}</span> via{' '}
              <span className="font-semibold text-gray-500">Sayerli</span>
            </p>
            <p className="text-[10px] text-gray-400">Généré le {generatedAt}</p>
          </div>
        </div>

        {/* ── DOWNLOAD BAR ── */}
        <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Télécharger ce reçu en PDF</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Dernière mise à jour : {facture.paiements.length > 0
                ? formatDateLong(facture.paiements[facture.paiements.length - 1].datePaiement)
                : generatedAt}
            </p>
          </div>
          <RecuDownloadButton
            data={recuData}
            label="Télécharger le reçu (PDF)"
            loadingLabel="Génération…"
            className="inline-flex items-center gap-2 px-5 py-3 rounded text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
          />
        </div>

        <p className="text-xs text-gray-400 text-center">
          Généré par Sayerli · Logiciel de gestion pour PME marocaines
        </p>
      </div>
    </div>
  )
}
