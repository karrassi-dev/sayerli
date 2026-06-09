'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Building2, Mail, Phone, MapPin, AlertCircle } from 'lucide-react'
import { publicDevisApi } from '@/lib/api'
import { cn } from '@/lib/utils'

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

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1').replace(/\/api\/v1\/?$/, '')
function logoUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_ORIGIN}${path}`
}

const STATUT_LABELS: Record<string, string> = {
  BROUILLON: 'Brouillon', ENVOYE: 'Envoyé', VU: 'Vu',
  ACCEPTE: 'Accepté', REFUSE: 'Refusé',
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PublicDevisPage() {
  const { token } = useParams<{ token: string }>()

  const [devis, setDevis] = useState<PublicDevis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responding, setResponding] = useState<'accept' | 'refuse' | null>(null)
  const [responded, setResponded] = useState<'accepted' | 'refused' | null>(null)

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
    setResponding(action)
    try {
      if (action === 'accept') {
        await publicDevisApi.accept(token)
        setResponded('accepted')
        setDevis(d => d ? { ...d, statut: 'ACCEPTE' } : d)
      } else {
        await publicDevisApi.refuse(token)
        setResponded('refused')
        setDevis(d => d ? { ...d, statut: 'REFUSE' } : d)
      }
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Une erreur est survenue.')
    } finally {
      setResponding(null)
    }
  }

  const brand = devis?.entreprise?.couleurPrimaire || '#2563eb'
  const canRespond = devis && (devis.statut === 'ENVOYE' || devis.statut === 'VU') && !responded
  const sousTotal = devis ? devis.lignes.reduce((s, l) => s + n(l.quantite) * n(l.prixUnitaire), 0) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Response banner */}
        {(responded || devis.statut === 'ACCEPTE' || devis.statut === 'REFUSE') && (
          <div className={cn(
            'mb-6 p-4 rounded-2xl flex items-center gap-3 text-white',
            (responded === 'accepted' || devis.statut === 'ACCEPTE') ? 'bg-green-500' : 'bg-red-500',
          )}>
            {(responded === 'accepted' || devis.statut === 'ACCEPTE') ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
            <div>
              <p className="font-bold text-sm">
                {(responded === 'accepted' || devis.statut === 'ACCEPTE') ? 'Devis accepté' : 'Devis refusé'}
              </p>
              <p className="text-xs opacity-90">Merci pour votre réponse. L&apos;entreprise a été notifiée.</p>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">

          {/* Header with brand color */}
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
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl" style={{ backgroundColor: brand }}>
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
                  'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
                )}>
                  {STATUT_LABELS[devis.statut] ?? devis.statut}
                </span>
              </div>
            </div>
          </div>

          {/* Company + Client info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-8 pb-6">
            {/* Company detail */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">De</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{devis.entreprise.nom}</p>
              {devis.entreprise.adresse && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" />{devis.entreprise.adresse}</p>
              )}
              {devis.entreprise.ice && <p className="text-xs text-slate-500">ICE: {devis.entreprise.ice}</p>}
            </div>
            {/* Client detail */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pour</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{devis.client.nom}</p>
              {devis.client.nomEntreprise && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5"><Building2 className="w-3 h-3 flex-shrink-0" />{devis.client.nomEntreprise}</p>
              )}
              {devis.client.email && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5"><Mail className="w-3 h-3 flex-shrink-0" />{devis.client.email}</p>
              )}
              {devis.client.telephone && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5"><Phone className="w-3 h-3 flex-shrink-0" />{devis.client.telephone}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="px-6 sm:px-8 pb-4 flex gap-4 text-sm text-slate-500">
            {devis.dateExpiration && (
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Expire le {formatDate(devis.dateExpiration)}</span>
            )}
          </div>

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
                    <tr key={l.id ?? i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
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

          {/* Accept / Refuse buttons */}
          {canRespond && (
            <div className="px-6 sm:px-8 pb-8">
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
                  Veuillez confirmer votre réponse à ce devis
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleRespond('accept')}
                    disabled={!!responding}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: brand }}
                  >
                    {responding === 'accept' ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : <CheckCircle className="w-4 h-4" />}
                    Accepter le devis
                  </button>
                  <button
                    onClick={() => handleRespond('refuse')}
                    disabled={!!responding}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-red-600 border-2 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {responding === 'refuse' ? (
                      <span className="w-4 h-4 border-2 border-red-300/50 border-t-red-600 rounded-full animate-spin" />
                    ) : <XCircle className="w-4 h-4" />}
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <p className="text-xs text-slate-400 text-center">Généré par <span className="font-semibold text-slate-500">Sayerli</span> — Logiciel de gestion pour PME marocaines</p>
          </div>
        </div>
      </div>
    </div>
  )
}
