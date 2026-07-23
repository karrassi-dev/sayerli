'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePublicLocale } from '@/hooks/usePublicLocale'
import {
  CheckCircle, Clock, Building2, Mail, Phone, MapPin,
  AlertCircle, CreditCard, Copy, X, ShieldCheck, Download, XCircle,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { publicFacturesApi } from '@/lib/api'
import { cn } from '@/lib/utils'

const FactureDownloadButton = dynamic(
  () => import('@/components/pdf/FactureDownloadButton'),
  { ssr: false },
)

const FactureSimpleDownloadButton = dynamic(
  () => import('@/components/pdf/FactureSimpleDownloadButton'),
  { ssr: false },
)

const RecuDownloadButton = dynamic(
  () => import('@/components/pdf/RecuDownloadButton'),
  { ssr: false },
)

// ── Types ────────────────────────────────────────────────────────────────────

interface Ligne {
  id: string
  description: string
  quantite: number | string
  prixUnitaire: number | string
  total: number | string
  ordre: number
}

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
  devise?: string
  totalHT: number | string
  taxe: number | string
  totalTTC: number | string
  remise: number | string
  rasActif: boolean
  rasTaux: number | string
  rasMontant: number | string
  montantPaye: number | string
  dateEcheance: string | null
  dateEnvoi: string | null
  notes: string | null
  createdAt: string
  dgiMode: boolean
  dgiStatut: string | null
  dgiClearanceId: string | null
  dgiRaisonRejet: string | null
  devis: { reference: string } | null
  client: { nom: string; email: string | null; telephone: string | null; nomEntreprise: string | null }
  lignes: Ligne[]
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

interface DeclarationForm {
  montant: string
  methode: string
  reference: string
  message: string
  datePaiement: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/\/api\/v1\/?$/, '')

function resolveLogoUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_ORIGIN}${path}`
}

const METHODES = [
  { value: 'VIREMENT', label: 'Virement bancaire' },
  { value: 'CASH',    label: 'Espèces' },
  { value: 'CHEQUE',  label: 'Chèque' },
  { value: 'CARTE',   label: 'Carte bancaire' },
  { value: 'AUTRE',   label: 'Autre' },
]

const EMPTY_FORM: DeclarationForm = {
  montant: '',
  methode: 'VIREMENT',
  reference: '',
  message: '',
  datePaiement: new Date().toISOString().split('T')[0],
}

// ── Declaration success screen ────────────────────────────────────────────────

function DeclarationSuccessScreen({
  facture,
  declaration,
  submittedAt,
  montantRestantAvant,
}: {
  facture: PublicFacture
  declaration: DeclarationForm
  submittedAt: Date
  montantRestantAvant: number
}) {
  const { t, dir } = usePublicLocale()
  const brand = facture.entreprise.couleurPrimaire || '#2563eb'
  const montantDeclare = parseFloat(declaration.montant) || 0
  const montantRestantApres = Math.max(0, montantRestantAvant - montantDeclare)
  const isFullyPaid = montantRestantApres < 0.01

  const pdfLogoUrl = facture.entreprise.logo
    ? facture.entreprise.logo.startsWith('http')
      ? facture.entreprise.logo
      : `${API_ORIGIN}${facture.entreprise.logo}`
    : null

  const pdfData = {
    numeroFacture: facture.numeroFacture,
    createdAt: facture.createdAt,
    dateEcheance: facture.dateEcheance,
    notes: facture.notes,
    totalHT: n(facture.totalHT),
    taxe: n(facture.taxe),
    totalTTC: n(facture.totalTTC),
    remise: n(facture.remise ?? 0),
    rasActif: facture.rasActif ?? false,
    rasTaux: n(facture.rasTaux ?? 30),
    rasMontant: n(facture.rasMontant ?? 0),
    devise: facture.devise ?? 'MAD',
    montantDejaPayeAvant: n(facture.montantPaye),
    devisReference: facture.devis?.reference ?? null,
    lignes: facture.lignes.map(l => ({
      description: l.description,
      quantite: n(l.quantite),
      prixUnitaire: n(l.prixUnitaire),
    })),
    client: facture.client,
    entreprise: { ...facture.entreprise, logoUrl: pdfLogoUrl },
    declaration: {
      montant: montantDeclare,
      methode: declaration.methode,
      reference: declaration.reference.trim(),
      message: declaration.message.trim(),
      datePaiement: declaration.datePaiement,
      submittedAt: submittedAt.toISOString(),
    },
  }

  const submittedStr = submittedAt.toLocaleString('fr-MA', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const methodeLabel = t(`public.facture.methodes.${declaration.methode}`) || declaration.methode

  return (
    <div dir={dir} className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-1" style={{ backgroundColor: brand }} />
          <div className="p-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-green-100">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 text-center mb-1">{t('public.facture.declarationSent')}</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              {t('public.facture.declarationDesc').replace('{company}', facture.entreprise.nom)}
            </p>

            <div className="rounded border border-blue-200 bg-blue-50 p-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{t('public.facture.montantDeclare')}</span>
                <span className="text-lg font-black text-blue-700">{formatMAD(montantDeclare)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">{t('public.facture.methode')}</p>
                  <p className="font-semibold text-gray-700">{methodeLabel}</p>
                </div>
                <div>
                  <p className="text-gray-400">{t('public.facture.date')}</p>
                  <p className="font-semibold text-gray-700">{formatDate(declaration.datePaiement)}</p>
                </div>
                {declaration.reference.trim() && (
                  <div className="col-span-2">
                    <p className="text-gray-400">{t('public.facture.reference')}</p>
                    <p className="font-semibold text-gray-700">{declaration.reference}</p>
                  </div>
                )}
              </div>
              <div className="text-xs text-blue-500">{t('public.facture.sentOn')} {submittedStr}</div>
            </div>

            <div className="rounded border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gray-900 px-4 py-2.5">
                <p className="text-xs font-bold text-white uppercase tracking-wider">{t('public.facture.balance')}</p>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>{t('public.facture.totalTTC')}</span>
                  <span>{formatMAD(facture.totalTTC)}</span>
                </div>
                {n(facture.montantPaye) > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>{t('public.facture.alreadyPaid')}</span>
                    <span>−{formatMAD(facture.montantPaye)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-blue-600 border-t border-gray-100 pt-2">
                  <span>{t('public.facture.thisDeclaration')}</span>
                  <span>−{formatMAD(montantDeclare)}</span>
                </div>
                <div className={cn(
                  'flex justify-between font-bold text-sm rounded px-3 py-2 mt-1',
                  isFullyPaid ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700',
                )}>
                  <span>{isFullyPaid ? `✓ ${t('public.facture.fullyPaid')}` : t('public.facture.remaining')}</span>
                  <span>{isFullyPaid ? formatMAD(0) : formatMAD(montantRestantApres)}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <FactureDownloadButton
                data={pdfData}
                brand={brand}
                label={t('public.facture.downloadReceipt')}
                loadingLabel={t('public.pdfGenerating')}
              />
              <p className="mt-3 text-xs text-gray-400">{t('public.facture.downloadReceiptDesc')}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center">
          {t('public.generatedBy')} — {t('public.generatedBySub')}
        </p>
      </div>
    </div>
  )
}

// ── DGI Download Banner ───────────────────────────────────────────────────────

function DGIBanner({ facture, token }: { facture: PublicFacture; token: string }) {
  const { t } = usePublicLocale()
  const [downloading, setDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const res = await publicFacturesApi.documentUrl(token)
      const url = res.data?.data?.url ?? res.data?.url
      if (url) window.open(url, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  if (facture.statut === 'CLEARANCE_EN_COURS') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
        <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 animate-pulse" />
        <p className="text-sm text-yellow-700 font-medium">{t('dgi.statusPending')}</p>
      </div>
    )
  }

  if (facture.statut === 'REJETEE_DGI') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700 font-bold">{t('dgi.statusRejected')}</p>
        </div>
        {facture.dgiRaisonRejet && (
          <p className="text-xs text-red-600 ml-8">{t('dgi.rejectionReason')} : {facture.dgiRaisonRejet}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Certified badge */}
      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-emerald-700">{t('dgi.certifiedBadge')}</p>
          {facture.dgiClearanceId && (
            <p className="text-xs text-emerald-600 font-mono mt-0.5 truncate">
              {t('dgi.clearanceId')} : {facture.dgiClearanceId}
            </p>
          )}
        </div>
      </div>

      {/* Stub warning */}
      <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-700">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>{t('dgi.stubWarning')}</span>
      </div>

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-all"
        >
          {downloading
            ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Download className="w-4 h-4" />}
          {t('dgi.downloadPDF')}
        </button>
      </div>
    </div>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
      className="flex-shrink-0 p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
      title="Copier"
    >
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

// ── Declaration modal ─────────────────────────────────────────────────────────

function DeclarationModal({
  open, onClose, onSubmit, facture, loading,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: DeclarationForm) => void
  facture: PublicFacture
  loading: boolean
}) {
  const rasMonModal = facture.rasActif
    ? (n(facture.rasMontant) > 0 ? n(facture.rasMontant) : Math.round(n(facture.totalTTC) * n(facture.rasTaux ?? 30)) / 100)
    : 0
  const netAPayerModal = facture.rasActif
    ? n(facture.totalTTC) - rasMonModal
    : n(facture.totalTTC)
  const [form, setForm] = useState<DeclarationForm>({
    ...EMPTY_FORM,
    montant: String(Math.max(0, netAPayerModal - n(facture.montantPaye))),
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const restant = Math.max(0, netAPayerModal - n(facture.montantPaye))

  const validate = () => {
    const e: Record<string, string> = {}
    const m = parseFloat(form.montant) || 0
    if (!form.montant || m <= 0) e.montant = 'Le montant doit être supérieur à 0.'
    else if (m > restant + 0.01) e.montant = `Le montant ne peut pas dépasser ${formatMAD(restant)}.`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  if (!open) return null

  const inputClass = 'w-full px-3 py-2.5 rounded border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all'
  const labelClass = 'text-xs font-semibold text-gray-700 mb-1.5 block'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Déclarer un paiement</h3>
            <p className="text-xs text-gray-400 mt-0.5">Facture {facture.numeroFacture}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-xs text-amber-700">Reste à payer : <strong>{formatMAD(restant, facture.devise)}</strong></p>
          </div>

          <div>
            <label className={labelClass}>Montant payé (MAD) *</label>
            <input
              type="number" step="0.01" min="0.01" max={restant}
              value={form.montant}
              onChange={e => { setForm(f => ({ ...f, montant: e.target.value })); delete errors.montant; setErrors({ ...errors }) }}
              className={cn(inputClass, errors.montant && 'border-red-400')}
              placeholder="0.00"
            />
            {errors.montant && <p className="text-xs text-red-500 mt-1">{errors.montant}</p>}
          </div>

          <div>
            <label className={labelClass}>Date du paiement</label>
            <input
              type="date" value={form.datePaiement} max={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(f => ({ ...f, datePaiement: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Méthode de paiement</label>
            <select value={form.methode} onChange={e => setForm(f => ({ ...f, methode: e.target.value }))} className={inputClass}>
              {METHODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Référence de paiement (optionnel)</label>
            <input
              type="text" value={form.reference}
              onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
              className={inputClass} placeholder="N° de virement, chèque..."
            />
          </div>

          <div>
            <label className={labelClass}>Message (optionnel)</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className={cn(inputClass, 'resize-none')} rows={2}
              placeholder="Remarques sur le paiement..."
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={() => { if (validate()) onSubmit(form) }} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-all"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PublicFacturePage() {
  const { token } = useParams<{ token: string }>()

  const [facture, setFacture] = useState<PublicFacture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [declarationOpen, setDeclarationOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [submittedDeclaration, setSubmittedDeclaration] = useState<DeclarationForm | null>(null)
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null)
  const [montantRestantSnapshot, setMontantRestantSnapshot] = useState(0)

  useEffect(() => {
    if (!token) return
    publicFacturesApi.get(token)
      .then(res => setFacture(res.data?.data ?? res.data))
      .catch(err => setError(err?.response?.data?.message ?? 'Ce lien est invalide ou a expiré.'))
      .finally(() => setLoading(false))
  }, [token])

  const handleDeclare = async (form: DeclarationForm) => {
    setSubmitting(true)
    try {
      const netAP = facture
        ? (facture.rasActif ? n(facture.totalTTC) - n(facture.rasMontant) : n(facture.totalTTC))
        : 0
      const restantAvant = facture ? Math.max(0, netAP - n(facture.montantPaye)) : 0
      await publicFacturesApi.declarer(token, {
        montant: parseFloat(form.montant),
        methode: form.methode,
        reference: form.reference.trim() || undefined,
        message: form.message.trim() || undefined,
        datePaiement: form.datePaiement || undefined,
      })
      setSubmittedDeclaration(form)
      setSubmittedAt(new Date())
      setMontantRestantSnapshot(restantAvant)
      setDeclarationOpen(false)
      setDone(true)
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Une erreur est survenue.')
      setDeclarationOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !facture) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Lien invalide</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!facture) return null

  if (done && submittedDeclaration && submittedAt) {
    return (
      <DeclarationSuccessScreen
        facture={facture}
        declaration={submittedDeclaration}
        submittedAt={submittedAt}
        montantRestantAvant={montantRestantSnapshot}
      />
    )
  }

  const brand = facture.entreprise.couleurPrimaire || '#2563eb'
  const template = facture.entreprise.templateDocument ?? 'classic'
  // If rasActif but rasMontant is 0 (edge case), recompute from rasTaux
  const effectiveRasMontant = facture.rasActif
    ? (n(facture.rasMontant) > 0
        ? n(facture.rasMontant)
        : Math.round(n(facture.totalTTC) * n(facture.rasTaux ?? 30)) / 100)
    : 0
  const netAPayer = facture.rasActif
    ? n(facture.totalTTC) - effectiveRasMontant
    : n(facture.totalTTC)
  const montantRestant = Math.max(0, netAPayer - n(facture.montantPaye))
  const isPayee = facture.statut === 'PAYEE'
  const canDeclare = ['ENVOYEE', 'VUE', 'PARTIELLE', 'EN_RETARD'].includes(facture.statut) && montantRestant > 0.01
  const hasBankInfo = facture.entreprise.titulaireCompte || facture.entreprise.rib || facture.entreprise.iban || facture.entreprise.banque
  const isOverdue = facture.dateEcheance && new Date(facture.dateEcheance) < new Date() && !isPayee

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

  const pdfLogoUrl = facture.entreprise.logo
    ? facture.entreprise.logo.startsWith('http')
      ? facture.entreprise.logo
      : `${API_ORIGIN}${facture.entreprise.logo}`
    : null

  const simplePdfData = {
    numeroFacture: facture.numeroFacture,
    createdAt: facture.createdAt,
    dateEcheance: facture.dateEcheance,
    notes: facture.notes,
    totalHT: n(facture.totalHT),
    taxe: n(facture.taxe),
    totalTTC: n(facture.totalTTC),
    remise: n(facture.remise ?? 0),
    rasActif: facture.rasActif ?? false,
    rasTaux: n(facture.rasTaux ?? 30),
    rasMontant: effectiveRasMontant,
    devisReference: facture.devis?.reference ?? null,
    template,
    lignes: facture.lignes.map(l => ({
      description: l.description,
      quantite: n(l.quantite),
      prixUnitaire: n(l.prixUnitaire),
    })),
    client: facture.client,
    entreprise: {
      nom: facture.entreprise.nom,
      email: facture.entreprise.email,
      telephone: facture.entreprise.telephone,
      adresse: facture.entreprise.adresse,
      logoUrl: pdfLogoUrl,
      couleurPrimaire: facture.entreprise.couleurPrimaire,
      ice: facture.entreprise.ice,
      rc: facture.entreprise.rc,
      activite: facture.entreprise.activite,
      titulaireCompte: facture.entreprise.titulaireCompte,
      banque: facture.entreprise.banque,
      rib: facture.entreprise.rib,
      iban: facture.entreprise.iban,
      swift: facture.entreprise.swift,
    },
  }

  // Shared logo node
  const logoNode = facture.entreprise.logo ? (
    <img src={resolveLogoUrl(facture.entreprise.logo)} alt={facture.entreprise.nom} className="h-12 w-auto object-contain flex-shrink-0" />
  ) : null

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* ── DOCUMENT ── */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">

          {/* Minimal: thin colored top line */}
          {template === 'minimal' && <div style={{ height: 3, backgroundColor: brand }} />}

          {/* ── HEADER — template-specific ── */}
          {isBanded ? (
            /* Corporate / Stripe / Bold: full colored or dark band */
            <div className="px-8 sm:px-12 py-6 flex items-start justify-between gap-6" style={{ backgroundColor: headerBandBg }}>
              <div className="flex items-center gap-4">
                {facture.entreprise.logo ? (
                  <div className="bg-white/20 rounded p-1 flex-shrink-0">
                    <img src={resolveLogoUrl(facture.entreprise.logo)} alt={facture.entreprise.nom} className="h-10 w-auto object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded flex items-center justify-center font-black text-xl flex-shrink-0"
                    style={{ backgroundColor: template === 'bold' ? brand : 'rgba(255,255,255,0.2)', color: 'white' }}>
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
                <p className="text-[10px] font-bold text-white/60 tracking-[0.2em]">FACTURE</p>
                <p className="text-2xl font-black text-white">{facture.numeroFacture}</p>
                {facture.devis && <p className="text-xs text-white/50 mt-1">Devis : {facture.devis.reference}</p>}
              </div>
            </div>
          ) : template === 'elegant' ? (
            /* Elegant: white header with left colored strip */
            <div className="flex">
              <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: brand }} />
              <div className="flex-1 px-8 sm:px-10 pt-8 pb-6 flex items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  {logoNode ?? (
                    <div className="w-12 h-12 rounded border-2 flex items-center justify-center font-black text-xl flex-shrink-0"
                      style={{ borderColor: brand, color: brand }}>
                      {facture.entreprise.nom.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{facture.entreprise.nom}</h1>
                    {facture.entreprise.email && <p className="text-sm text-gray-500">{facture.entreprise.email}</p>}
                    {facture.entreprise.telephone && <p className="text-sm text-gray-500">{facture.entreprise.telephone}</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-bold tracking-[0.2em] mb-1" style={{ color: brand }}>FACTURE</p>
                  <p className="text-2xl font-black text-gray-900">{facture.numeroFacture}</p>
                  {facture.devis && <p className="text-xs text-gray-400 mt-1">Devis : {facture.devis.reference}</p>}
                </div>
              </div>
            </div>
          ) : (
            /* Classic / Minimal: standard white header */
            <div className="px-8 sm:px-12 pt-10 pb-7 flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                {logoNode ?? (
                  <div className="w-12 h-12 rounded flex items-center justify-center text-white font-black text-xl flex-shrink-0"
                    style={{ backgroundColor: template === 'minimal' ? brand : '#111827' }}>
                    {facture.entreprise.nom.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{facture.entreprise.nom}</h1>
                  {facture.entreprise.email && <p className="text-sm text-gray-500">{facture.entreprise.email}</p>}
                  {facture.entreprise.telephone && <p className="text-sm text-gray-500">{facture.entreprise.telephone}</p>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">FACTURE</p>
                <p className="text-2xl font-black text-gray-900">{facture.numeroFacture}</p>
                {facture.devis && <p className="text-xs text-gray-400 mt-1">Devis : {facture.devis.reference}</p>}
              </div>
            </div>
          )}

          {!isBanded && <div className="border-t border-gray-200" />}

          {/* Emetteur / Destinataire */}
          <div className="px-8 sm:px-12 py-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className={cn('text-[10px] font-bold tracking-[0.2em] mb-3', labelClass)}
                style={labelColor ? { color: labelColor } : undefined}>ÉMETTEUR</p>
              <p className="text-sm font-semibold text-gray-900">{facture.entreprise.nom}</p>
              {facture.entreprise.activite && (
                <p className="text-xs text-gray-500 mt-0.5">{facture.entreprise.activite}</p>
              )}
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
              {facture.entreprise.rc && <p className="text-xs text-gray-500 mt-1">RC : {facture.entreprise.rc}</p>}
            </div>
            <div>
              <p className={cn('text-[10px] font-bold tracking-[0.2em] mb-3', labelClass)}
                style={labelColor ? { color: labelColor } : undefined}>DESTINATAIRE</p>
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

          {/* Dates */}
          <div className="px-8 sm:px-12 pb-7 flex flex-wrap gap-10 border-t border-gray-100 pt-5">
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] mb-1">DATE D&apos;ÉMISSION</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(facture.createdAt)}</p>
            </div>
            {facture.dateEcheance && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] mb-1">DATE D&apos;ÉCHÉANCE</p>
                <p className={cn(
                  'text-sm font-semibold',
                  isOverdue ? 'text-red-600' : 'text-gray-900',
                )}>{formatDate(facture.dateEcheance)}</p>
              </div>
            )}
          </div>

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
                {facture.lignes.map((l, i) => (
                  <tr key={l.id ?? i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-3 text-gray-900 font-medium border-b border-gray-100">{l.description}</td>
                    <td className="px-4 py-3 text-center text-gray-500 border-b border-gray-100 hidden sm:table-cell">{n(l.quantite)}</td>
                    <td className="px-4 py-3 text-right text-gray-500 border-b border-gray-100 hidden sm:table-cell">{formatMAD(n(l.prixUnitaire), facture.devise)}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 border-b border-gray-100">{formatMAD(n(l.quantite) * n(l.prixUnitaire), facture.devise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 sm:px-12 pb-8 flex justify-end">
            <div className="w-64 border border-gray-200 rounded overflow-hidden">
              <div className="flex justify-between text-sm text-gray-600 py-2 px-4 border-b border-gray-100">
                <span>Sous-total HT</span>
                <span>{formatMAD(facture.totalHT)}</span>
              </div>
              {n(facture.remise ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-red-600 py-2 px-4 border-b border-gray-100">
                  <span>Remise</span>
                  <span>−{formatMAD(facture.remise)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 py-2 px-4 border-b border-gray-100">
                <span>TVA {n(facture.taxe)}%</span>
                <span>{formatMAD(n(facture.totalTTC) - n(facture.totalHT))}</span>
              </div>
              <div className="flex justify-between font-bold px-4 py-3" style={{ ...totalBgStyle, color: totalTextColor }}>
                <span className="text-sm tracking-wide">TOTAL TTC</span>
                <span className="text-base">{formatMAD(facture.totalTTC)}</span>
              </div>
              {facture.rasActif && (
                <>
                  <div className="flex justify-between text-sm py-2 px-4 border-t border-orange-100 bg-orange-50 text-orange-700">
                    <span>Retenue à la source ({n(facture.rasTaux)}%)</span>
                    <span>−{formatMAD(effectiveRasMontant)}</span>
                  </div>
                  <div className="flex justify-between font-bold px-4 py-3 bg-orange-500 text-white">
                    <span className="text-sm tracking-wide">NET À PAYER</span>
                    <span className="text-base">{formatMAD(netAPayer, facture.devise)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bank info */}
          {hasBankInfo && (
            <div className="px-8 sm:px-12 pb-8">
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="bg-gray-900 px-5 py-3">
                  <p className="text-[10px] font-bold text-white tracking-[0.15em]">
                    INFORMATIONS DE PAIEMENT — VIREMENT BANCAIRE
                  </p>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {facture.entreprise.titulaireCompte && (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 tracking-[0.1em] mb-1">BÉNÉFICIAIRE</p>
                        <p className="text-sm font-semibold text-gray-900">{facture.entreprise.titulaireCompte}</p>
                      </div>
                      <CopyButton text={facture.entreprise.titulaireCompte} />
                    </div>
                  )}
                  {facture.entreprise.banque && (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 tracking-[0.1em] mb-1">BANQUE</p>
                        <p className="text-sm font-semibold text-gray-900">{facture.entreprise.banque}</p>
                      </div>
                      <CopyButton text={facture.entreprise.banque} />
                    </div>
                  )}
                  {facture.entreprise.rib && (
                    <div className="flex items-center justify-between gap-2 sm:col-span-2">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 tracking-[0.1em] mb-1">RIB</p>
                        <p className="text-sm font-mono font-semibold text-gray-900 tracking-wide">{facture.entreprise.rib}</p>
                      </div>
                      <CopyButton text={facture.entreprise.rib} />
                    </div>
                  )}
                  {facture.entreprise.iban && (
                    <div className="flex items-center justify-between gap-2 sm:col-span-2">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 tracking-[0.1em] mb-1">IBAN</p>
                        <p className="text-sm font-mono font-semibold text-gray-900 tracking-wide">{facture.entreprise.iban}</p>
                      </div>
                      <CopyButton text={facture.entreprise.iban} />
                    </div>
                  )}
                  {facture.entreprise.swift && (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 tracking-[0.1em] mb-1">BIC / SWIFT</p>
                        <p className="text-sm font-mono font-semibold text-gray-900">{facture.entreprise.swift}</p>
                      </div>
                      <CopyButton text={facture.entreprise.swift} />
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-[0.1em] mb-1">
                      RÉFÉRENCE À MENTIONNER LORS DU VIREMENT
                    </p>
                    <p className="text-base font-bold text-gray-900 font-mono">{facture.numeroFacture}</p>
                  </div>
                  <CopyButton text={facture.numeroFacture} />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {facture.notes && (
            <div className="px-8 sm:px-12 pb-8">
              <div className="border border-gray-200 rounded p-4">
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] mb-2">NOTES</p>
                <p className="text-sm text-gray-700 leading-relaxed">{facture.notes}</p>
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

          {isPayee ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded mb-5">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-700">Facture entièrement réglée</p>
                <p className="text-xs text-green-600 mt-0.5">{formatMAD(facture.totalTTC)} — Merci pour votre paiement</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 mb-1">{facture.rasActif ? 'Net à payer' : 'Total facture'}</p>
                <p className="text-sm font-semibold text-gray-900">{formatMAD(netAPayer, facture.devise)}</p>
                {facture.rasActif && (
                  <p className="text-xs text-orange-500 mt-0.5">TTC: {formatMAD(facture.totalTTC)} − RAS {n(facture.rasTaux)}%</p>
                )}
              </div>
              {n(facture.montantPaye) > 0 && (
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Déjà payé</p>
                  <p className="text-sm font-semibold text-green-600">{formatMAD(facture.montantPaye)}</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Reste à régler</p>
                <p className={cn(
                  'text-xl font-black',
                  isOverdue ? 'text-red-600' : 'text-gray-900',
                )}>{formatMAD(montantRestant, facture.devise)}</p>
              </div>
            </div>
          )}

          {facture.dgiMode ? (
            <DGIBanner facture={facture} token={token} />
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3">
            {!facture.dgiMode && (
            <FactureSimpleDownloadButton
              data={simplePdfData}
              template={template}
              label="Télécharger la facture PDF"
              loadingLabel="Génération..."
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded text-sm font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all"
            />
            )}
            {facture.paiements && facture.paiements.length > 0 && (
              <RecuDownloadButton
                data={{
                  numeroFacture: facture.numeroFacture,
                  client: { nom: facture.client.nom, nomEntreprise: facture.client.nomEntreprise, email: facture.client.email },
                  entreprise: {
                    nom: facture.entreprise.nom,
                    logoUrl: pdfLogoUrl,
                    adresse: facture.entreprise.adresse,
                    telephone: facture.entreprise.telephone,
                    email: facture.entreprise.email,
                    couleurPrimaire: facture.entreprise.couleurPrimaire,
                    ice: facture.entreprise.ice,
                  },
                  paiements: facture.paiements.map(p => ({
                    ...p,
                    montant: n(p.montant),
                  })),
                  totalTTC: n(facture.totalTTC),
                  montantPaye: n(facture.montantPaye),
                  rasActif: facture.rasActif ?? false,
                  rasTaux: n(facture.rasTaux ?? 30),
                  rasMontant: effectiveRasMontant,
                  generatedAt: new Date().toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' }),
                }}
                label="Télécharger le reçu (PDF)"
                loadingLabel="Génération…"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
              />
            )}
            {canDeclare && (
              <button
                onClick={() => setDeclarationOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: brand }}
              >
                <CreditCard className="w-4 h-4" />
                J&apos;ai effectué un paiement
              </button>
            )}
          </div>
        </div>

      </div>

      {declarationOpen && (
        <DeclarationModal
          open={declarationOpen}
          onClose={() => setDeclarationOpen(false)}
          onSubmit={handleDeclare}
          facture={facture}
          loading={submitting}
        />
      )}
    </div>
  )
}
