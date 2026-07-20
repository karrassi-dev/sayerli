'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import {
  CheckCircle, XCircle, Clock, Building2, Mail, Phone, MapPin,
  AlertCircle, FileText,
} from 'lucide-react'
import { publicDevisApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import { usePublicLocale } from '@/hooks/usePublicLocale'

const DevisDownloadButton = dynamic(
  () => import('@/components/pdf/DevisDownloadButton'),
  { ssr: false },
)

// ── Types ─────────────────────────────────────────────────────────────────────

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
  devise?: string
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
    templateDocument: string | null
    ice: string | null; rc: string | null; website: string | null
    activite: string | null
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : v }

const CURRENCY_LOCALE: Record<string, string> = { MAD: 'fr-MA', EUR: 'fr-FR', USD: 'en-US' }
function formatMAD(v: number | string, devise = 'MAD') {
  const locale = CURRENCY_LOCALE[devise] ?? 'fr-MA'
  const currency = CURRENCY_LOCALE[devise] ? devise : 'MAD'
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v))
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

function resolveLogoUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_ORIGIN}${path}`
}

function isExpired(devis: PublicDevis) {
  if (!devis.dateExpiration) return false
  return new Date(devis.dateExpiration) < new Date()
}

// ── Confirm modal ─────────────────────────────────────────────────────────────

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
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm} disabled={loading}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-semibold text-white disabled:opacity-60 transition-all',
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

// ── Refused screen ────────────────────────────────────────────────────────────

function RefusedScreen() {
  const { t, dir } = usePublicLocale()
  return (
    <div dir={dir} className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-100">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">{t('public.devis.refused')}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{t('public.devis.refusedDesc')}</p>
        <p className="mt-6 text-xs text-gray-400">{t('public.generatedBy')}</p>
      </div>
    </div>
  )
}

// ── Accepted screen ───────────────────────────────────────────────────────────

function AcceptedScreen({ devis, acceptedAt }: { devis: PublicDevis; acceptedAt: Date }) {
  const { t, dir } = usePublicLocale()
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
    devise: devis.devise ?? 'MAD',
    template: devis.entreprise.templateDocument ?? 'classic',
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
    <div dir={dir} className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-1" style={{ backgroundColor: brand }} />
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-green-100">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{t('public.devis.accepted')}</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {t('public.devis.acceptedDesc')}
              <br />
              <span className="font-semibold text-gray-700">{devis.entreprise.nom}</span>{' '}
              {t('public.devis.notifiedSoon')}
            </p>
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded bg-green-50 border border-green-200 mb-6">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-green-700">{devis.reference}</p>
                <p className="text-xs text-green-600 mt-0.5">{t('public.devis.acceptedOn')} {acceptedStr}</p>
              </div>
            </div>
            <DevisDownloadButton
              data={pdfData}
              brand={brand}
              label={t('public.devis.downloadPdf')}
              loadingLabel={t('public.pdfGenerating')}
            />
            <p className="mt-6 text-xs text-gray-400">{t('public.devis.downloadPdfDesc')}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400 text-center">
          {t('public.generatedBy')} — {t('public.generatedBySub')}
        </p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !devis) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Lien invalide</h2>
          <p className="text-sm text-gray-500">{error ?? 'Ce lien de devis est invalide ou a expiré.'}</p>
        </div>
      </div>
    )
  }

  if (done === 'refused') return <RefusedScreen />
  if (done === 'accepted' && acceptedAt && devis) return <AcceptedScreen devis={devis} acceptedAt={acceptedAt} />

  const brand = devis.entreprise.couleurPrimaire || '#2563eb'
  const expired = isExpired(devis)

  // Simple info screens for non-viewable states
  if (devis.statut === 'BROUILLON') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Devis non disponible</h2>
          <p className="text-sm text-gray-500">Ce devis n&apos;est pas encore disponible. Contactez l&apos;entreprise pour plus d&apos;informations.</p>
        </div>
      </div>
    )
  }

  if (expired && devis.statut !== 'ACCEPTE' && devis.statut !== 'REFUSE') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Devis expiré</h2>
          <p className="text-sm text-gray-500">Ce devis a expiré le {formatDate(devis.dateExpiration)}. Contactez l&apos;entreprise pour obtenir un nouveau devis.</p>
        </div>
      </div>
    )
  }

  const canRespond = devis.statut === 'ENVOYE' || devis.statut === 'VU'
  const sousTotal = devis.lignes.reduce((s, l) => s + n(l.quantite) * n(l.prixUnitaire), 0)
  const template = devis.entreprise.templateDocument ?? 'classic'

  // Template-specific styles
  const isBanded = ['stripe', 'corporate', 'bold'].includes(template)
  const headerBandBg = template === 'bold' ? '#111827' : brand
  const tableHeadBg = template === 'minimal' ? 'transparent'
    : (template === 'bold' || template === 'classic') ? '#111827' : brand
  const tableHeadTextColor = template === 'minimal' ? brand : 'white'
  const tableHeadBorderStyle = template === 'minimal' ? `2px solid ${brand}` : undefined
  const totalBg = (template === 'classic' || template === 'bold') ? '#111827' : brand
  const totalTextColor = template === 'minimal' ? brand : 'white'
  const totalBgStyle = template === 'minimal' ? undefined : { backgroundColor: totalBg }
  const labelColor = ['minimal', 'elegant', 'bold'].includes(template) ? brand : undefined
  const labelClass = ['minimal', 'elegant', 'bold'].includes(template) ? '' : 'text-gray-400'

  const pdfLogoUrl = devis.entreprise.logo
    ? devis.entreprise.logo.startsWith('http')
      ? devis.entreprise.logo
      : `${API_ORIGIN}${devis.entreprise.logo}`
    : null

  const logoNode = devis.entreprise.logo ? (
    <img src={resolveLogoUrl(devis.entreprise.logo)} alt={devis.entreprise.nom} className="h-12 w-auto object-contain flex-shrink-0" />
  ) : null

  const pdfData = {
    reference: devis.reference,
    createdAt: devis.createdAt,
    dateExpiration: devis.dateExpiration,
    dateAcceptation: devis.dateAcceptation ?? new Date().toISOString(),
    notes: devis.notes,
    totalHT: parseFloat(String(devis.totalHT)) || 0,
    remise: parseFloat(String(devis.remise)) || 0,
    taxe: parseFloat(String(devis.taxe)) || 0,
    totalTTC: parseFloat(String(devis.totalTTC)) || 0,
    template,
    lignes: devis.lignes.map(l => ({
      description: l.description,
      quantite: parseFloat(String(l.quantite)) || 0,
      prixUnitaire: parseFloat(String(l.prixUnitaire)) || 0,
      total: parseFloat(String(l.total)) || 0,
    })),
    client: devis.client,
    entreprise: { ...devis.entreprise, logoUrl: pdfLogoUrl },
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* ── DOCUMENT ── */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">

          {/* Minimal: thin colored top line */}
          {template === 'minimal' && <div style={{ height: 3, backgroundColor: brand }} />}

          {/* ── HEADER — template-specific ── */}
          {isBanded ? (
            <div className="px-8 sm:px-12 py-6 flex items-start justify-between gap-6" style={{ backgroundColor: headerBandBg }}>
              <div className="flex items-center gap-4">
                {devis.entreprise.logo ? (
                  <div className="bg-white/20 rounded p-1 flex-shrink-0">
                    <img src={resolveLogoUrl(devis.entreprise.logo)} alt={devis.entreprise.nom} className="h-10 w-auto object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded flex items-center justify-center font-black text-xl flex-shrink-0"
                    style={{ backgroundColor: template === 'bold' ? brand : 'rgba(255,255,255,0.2)', color: 'white' }}>
                    {devis.entreprise.nom.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold text-white">{devis.entreprise.nom}</h1>
                  {devis.entreprise.activite && <p className="text-sm text-white/60">{devis.entreprise.activite}</p>}
                  {devis.entreprise.email && <p className="text-sm text-white/70">{devis.entreprise.email}</p>}
                  {devis.entreprise.telephone && <p className="text-sm text-white/70">{devis.entreprise.telephone}</p>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-bold text-white/60 tracking-[0.2em]">DEVIS</p>
                <p className="text-2xl font-black text-white">{devis.reference}</p>
                <p className="text-xs text-white/50 mt-1">{formatDate(devis.createdAt)}</p>
              </div>
            </div>
          ) : template === 'elegant' ? (
            <div className="flex">
              <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: brand }} />
              <div className="flex-1 px-8 sm:px-10 pt-8 pb-6 flex items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  {logoNode ?? (
                    <div className="w-12 h-12 rounded border-2 flex items-center justify-center font-black text-xl flex-shrink-0"
                      style={{ borderColor: brand, color: brand }}>
                      {devis.entreprise.nom.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{devis.entreprise.nom}</h1>
                    {devis.entreprise.activite && <p className="text-xs text-gray-400">{devis.entreprise.activite}</p>}
                    {devis.entreprise.email && <p className="text-sm text-gray-500">{devis.entreprise.email}</p>}
                    {devis.entreprise.telephone && <p className="text-sm text-gray-500">{devis.entreprise.telephone}</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-bold tracking-[0.2em] mb-1" style={{ color: brand }}>DEVIS</p>
                  <p className="text-2xl font-black text-gray-900">{devis.reference}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(devis.createdAt)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-8 sm:px-12 pt-10 pb-7 flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                {logoNode ?? (
                  <div className="w-12 h-12 rounded flex items-center justify-center text-white font-black text-xl flex-shrink-0"
                    style={{ backgroundColor: template === 'minimal' ? brand : '#111827' }}>
                    {devis.entreprise.nom.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{devis.entreprise.nom}</h1>
                  {devis.entreprise.activite && <p className="text-xs text-gray-400">{devis.entreprise.activite}</p>}
                  {devis.entreprise.email && <p className="text-sm text-gray-500">{devis.entreprise.email}</p>}
                  {devis.entreprise.telephone && <p className="text-sm text-gray-500">{devis.entreprise.telephone}</p>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">DEVIS</p>
                <p className="text-2xl font-black text-gray-900">{devis.reference}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(devis.createdAt)}</p>
              </div>
            </div>
          )}

          {!isBanded && <div className="border-t border-gray-200" />}

          {/* Emetteur / Destinataire */}
          <div className="px-8 sm:px-12 py-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className={cn('text-[10px] font-bold tracking-[0.2em] mb-3', labelClass)}
                style={labelColor ? { color: labelColor } : undefined}>ÉMETTEUR</p>
              <p className="text-sm font-semibold text-gray-900">{devis.entreprise.nom}</p>
              {devis.entreprise.activite && (
                <p className="text-xs text-gray-500 mt-0.5">{devis.entreprise.activite}</p>
              )}
              {devis.entreprise.adresse && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />{devis.entreprise.adresse}
                </p>
              )}
              {devis.entreprise.email && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />{devis.entreprise.email}
                </p>
              )}
              {devis.entreprise.telephone && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />{devis.entreprise.telephone}
                </p>
              )}
              {devis.entreprise.ice && <p className="text-xs text-gray-500 mt-1">ICE : {devis.entreprise.ice}</p>}
              {devis.entreprise.rc && <p className="text-xs text-gray-500 mt-1">RC : {devis.entreprise.rc}</p>}
            </div>
            <div>
              <p className={cn('text-[10px] font-bold tracking-[0.2em] mb-3', labelClass)}
                style={labelColor ? { color: labelColor } : undefined}>DESTINATAIRE</p>
              <p className="text-sm font-semibold text-gray-900">{devis.client.nom}</p>
              {devis.client.nomEntreprise && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 flex-shrink-0" />{devis.client.nomEntreprise}
                </p>
              )}
              {devis.client.email && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />{devis.client.email}
                </p>
              )}
              {devis.client.telephone && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />{devis.client.telephone}
                </p>
              )}
            </div>
          </div>

          {/* Validity */}
          {devis.dateExpiration && (
            <div className="px-8 sm:px-12 pb-6 flex gap-10 border-t border-gray-100 pt-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] mb-1">VALABLE JUSQU&apos;AU</p>
                <p className={cn(
                  'text-sm font-semibold',
                  expired ? 'text-red-600' : 'text-gray-900',
                )}>{formatDate(devis.dateExpiration)}</p>
              </div>
            </div>
          )}

          {/* Items table */}
          <div className="px-8 sm:px-12 pb-8">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: tableHeadBg !== 'transparent' ? tableHeadBg : undefined, borderBottom: tableHeadBorderStyle }}>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.15em]" style={{ color: tableHeadTextColor }}>DÉSIGNATION</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold tracking-[0.15em] w-16 hidden sm:table-cell" style={{ color: tableHeadTextColor }}>QTÉ</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold tracking-[0.15em] w-28 hidden sm:table-cell" style={{ color: tableHeadTextColor }}>P.U. HT</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold tracking-[0.15em] w-28" style={{ color: tableHeadTextColor }}>TOTAL HT</th>
                </tr>
              </thead>
              <tbody>
                {devis.lignes.map((l, i) => (
                  <tr key={l.id ?? i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-3 text-gray-900 font-medium border-b border-gray-100">{l.description}</td>
                    <td className="px-4 py-3 text-center text-gray-500 border-b border-gray-100 hidden sm:table-cell">{n(l.quantite)}</td>
                    <td className="px-4 py-3 text-right text-gray-500 border-b border-gray-100 hidden sm:table-cell">{formatMAD(n(l.prixUnitaire), devis.devise)}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 border-b border-gray-100">{formatMAD(n(l.quantite) * n(l.prixUnitaire), devis.devise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 sm:px-12 pb-8 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
                <span>Sous-total</span>
                <span>{formatMAD(sousTotal, devis.devise)}</span>
              </div>
              {n(devis.remise) > 0 && (
                <div className="flex justify-between text-sm text-red-500 py-2 border-b border-gray-100">
                  <span>Remise</span>
                  <span>−{formatMAD(devis.remise, devis.devise)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
                <span>TVA {n(devis.taxe)}%</span>
                <span>{formatMAD(n(devis.totalTTC) - n(devis.totalHT), devis.devise)}</span>
              </div>
              <div className="flex justify-between font-bold px-4 py-3 mt-2" style={{ ...totalBgStyle, color: totalTextColor }}>
                <span className="text-sm tracking-wide">TOTAL TTC</span>
                <span className="text-base">{formatMAD(devis.totalTTC, devis.devise)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {devis.notes && (
            <div className="px-8 sm:px-12 pb-8">
              <div className="border border-gray-200 rounded p-4">
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] mb-2">NOTES</p>
                <p className="text-sm text-gray-700 leading-relaxed">{devis.notes}</p>
              </div>
            </div>
          )}

          {/* Document footer */}
          <div className="px-8 sm:px-12 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 text-center tracking-wide">
              Généré par <span className="font-semibold text-gray-500">Sayerli</span> · Logiciel de gestion pour PME marocaines
            </p>
          </div>
        </div>

        {/* ── ACTION BAR ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">

          {/* Pending: accept / refuse */}
          {canRespond && (
            <>
              <p className="text-sm text-gray-500 text-center mb-5">
                Veuillez confirmer votre réponse à ce devis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setConfirming('accept')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: brand }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Accepter le devis
                </button>
                <button
                  onClick={() => setConfirming('refuse')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded text-sm font-bold text-red-600 border-2 border-red-200 hover:bg-red-50 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Refuser le devis
                </button>
              </div>
            </>
          )}

          {/* Already accepted */}
          {devis.statut === 'ACCEPTE' && (
            <>
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded mb-5">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-700">Devis accepté</p>
                  {devis.dateAcceptation && (
                    <p className="text-xs text-green-600 mt-0.5">Le {formatDateTime(devis.dateAcceptation)}</p>
                  )}
                </div>
              </div>
              <DevisDownloadButton
                data={pdfData}
                brand={brand}
                label="Télécharger le devis PDF"
                loadingLabel="Génération..."
              />
            </>
          )}

          {/* Already refused */}
          {devis.statut === 'REFUSE' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-600">Devis refusé</p>
                {devis.dateRefus && (
                  <p className="text-xs text-red-500 mt-0.5">Le {formatDateTime(devis.dateRefus)}</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <ConfirmModal
        open={confirming === 'accept'}
        onClose={() => setConfirming(null)}
        onConfirm={() => handleRespond('accept')}
        title="Confirmer l'acceptation"
        message="En acceptant ce devis, vous confirmez votre accord avec les termes et les montants indiqués. Cette action ne peut pas être annulée."
        confirmLabel="Accepter le devis"
        loading={responding}
      />

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
