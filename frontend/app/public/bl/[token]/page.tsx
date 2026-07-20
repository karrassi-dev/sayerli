'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { CheckCircle, Package, Truck } from 'lucide-react'
import { publicBLApi } from '@/lib/api'

const BonLivraisonDownloadButton = dynamic(
  () => import('@/components/pdf/BonLivraisonDownloadButton'),
  { ssr: false },
)

// ── Types ─────────────────────────────────────────────────────────────────────

interface PublicBL {
  id: string
  reference: string
  statut: string
  publicToken: string
  dateLivraison: string | null
  notes: string | null
  createdAt: string
  client: {
    nom: string
    nomEntreprise: string | null
    email: string | null
    telephone: string | null
    adresse: string | null
    ice: string | null
  }
  devis: { id: string; reference: string } | null
  lignes: { description: string; quantite: number | string; unite: string | null; ordre: number }[]
  entreprise: {
    nom: string
    logo: string | null
    email: string | null
    telephone: string | null
    adresse: string | null
    ville: string | null
    couleurPrimaire: string | null
    ice: string | null
    rc: string | null
    website: string | null
  }
}

function fmtDate(d?: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function n(v: number | string) {
  return typeof v === 'string' ? parseFloat(v) || 0 : v ?? 0
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PublicBLPage() {
  const { token } = useParams<{ token: string }>()

  const [bl, setBL] = useState<PublicBL | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!token) return
    publicBLApi.get(token)
      .then(res => {
        const data = res.data?.data ?? res.data
        setBL(data)
        if (data.statut === 'LIVRE') setConfirmed(true)
      })
      .catch(err => setError(err?.response?.data?.message ?? 'Ce lien est invalide ou a expiré.'))
      .finally(() => setLoading(false))
  }, [token])

  const handleConfirmer = async () => {
    if (!token) return
    setConfirming(true)
    try {
      const res = await publicBLApi.confirmerReception(token)
      const data = res.data?.data ?? res.data
      if (data?.statut === 'LIVRE' || data?.message) {
        setConfirmed(true)
        setBL(prev => prev ? { ...prev, statut: 'LIVRE' } : prev)
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message ?? 'Erreur lors de la confirmation.')
    } finally { setConfirming(false) }
  }

  const brand = bl?.entreprise.couleurPrimaire || '#16a34a'

  const pdfData = bl ? {
    reference: bl.reference,
    createdAt: bl.createdAt,
    dateLivraison: bl.dateLivraison,
    notes: bl.notes,
    client: bl.client,
    entreprise: bl.entreprise,
    lignes: bl.lignes.map(l => ({ ...l, quantite: n(l.quantite) })),
    devisRef: bl.devis?.reference ?? null,
  } : null

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !bl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Lien invalide</h1>
          <p className="text-sm text-gray-500">{error ?? 'Ce bon de livraison est introuvable.'}</p>
        </div>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header band */}
      <div style={{ backgroundColor: brand, height: 6 }} />

      {/* Company header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {bl.entreprise.logo ? (
            <img src={bl.entreprise.logo} alt={bl.entreprise.nom} className="w-10 h-10 rounded-xl object-contain border border-gray-100" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: brand }}>
              {bl.entreprise.nom.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-gray-900 text-sm">{bl.entreprise.nom}</p>
            {bl.entreprise.email && <p className="text-xs text-gray-400">{bl.entreprise.email}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Doc title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-3" style={{ backgroundColor: brand }}>
            <Truck className="w-4 h-4" />
            BON DE LIVRAISON
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{bl.reference}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Émis le {fmtDate(bl.createdAt)}
            {bl.dateLivraison && ` · Livraison prévue le ${fmtDate(bl.dateLivraison)}`}
          </p>
          {bl.devis && (
            <p className="text-xs text-gray-400 mt-1">Devis associé : {bl.devis.reference}</p>
          )}
        </div>

        {/* Client info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Destinataire</p>
          <p className="font-semibold text-gray-900">{bl.client.nom}</p>
          {bl.client.nomEntreprise && <p className="text-sm text-gray-500">{bl.client.nomEntreprise}</p>}
          {bl.client.ice && <p className="text-xs text-gray-400">ICE : {bl.client.ice}</p>}
          {bl.client.email && <p className="text-xs text-gray-400">{bl.client.email}</p>}
        </div>

        {/* Lines */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Articles livrés</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-2.5 text-left text-xs text-gray-400 font-semibold">Désignation</th>
                <th className="px-5 py-2.5 text-right text-xs text-gray-400 font-semibold">Qté</th>
                <th className="px-5 py-2.5 text-right text-xs text-gray-400 font-semibold">Unité</th>
              </tr>
            </thead>
            <tbody>
              {bl.lignes.map((l, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-gray-50/50' : ''}>
                  <td className="px-5 py-3 text-sm text-gray-900">{l.description}</td>
                  <td className="px-5 py-3 text-sm text-gray-700 text-right font-medium">{n(l.quantite)}</td>
                  <td className="px-5 py-3 text-sm text-gray-400 text-right">{l.unite || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {bl.notes && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-800">
            <p className="font-semibold text-xs uppercase tracking-wider text-amber-600 mb-1">Notes</p>
            {bl.notes}
          </div>
        )}

        {/* Confirmation section */}
        {confirmed ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-emerald-800 mb-1">Livraison confirmée</h2>
            <p className="text-sm text-emerald-600">Vous avez confirmé la réception de cette livraison.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              En cliquant sur ce bouton, vous confirmez avoir reçu tous les articles listés ci-dessus.
            </p>
            <button
              onClick={handleConfirmer}
              disabled={confirming}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
              style={{ backgroundColor: brand }}
            >
              {confirming
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <CheckCircle className="w-4 h-4" />
              }
              {confirming ? 'Confirmation...' : "J'ai reçu les articles"}
            </button>
          </div>
        )}

        {/* Download PDF */}
        {pdfData && (
          <div className="flex justify-center">
            <BonLivraisonDownloadButton
              data={pdfData}
              label="Télécharger le bon de livraison (PDF)"
            />
          </div>
        )}

        {/* Signature block hint */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Signature client</p>
          <p className="text-xs text-gray-300 italic">À signer et retourner au fournisseur sur la version imprimée</p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 pb-4">
          Document généré par {bl.entreprise.nom} via sayerli.com
        </p>
      </div>
    </div>
  )
}
