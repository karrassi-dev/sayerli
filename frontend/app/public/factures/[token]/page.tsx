'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePublicLocale } from '@/hooks/usePublicLocale'
import {
  CheckCircle, Clock, Building2, Mail, Phone, MapPin,
  AlertCircle, Eye, FileText, CreditCard, Copy, Banknote,
  ChevronDown, ChevronUp, X,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { publicFacturesApi } from '@/lib/api'
import { cn } from '@/lib/utils'

const FactureDownloadButton = dynamic(
  () => import('@/components/pdf/FactureDownloadButton'),
  { ssr: false },
)

// ── Types ───────────────────────────────────────────────────────────────────

interface Ligne {
  id: string
  description: string
  quantite: number | string
  prixUnitaire: number | string
  total: number | string
  ordre: number
}

interface DevisLie {
  reference: string
  totalHT: number | string
  taxe: number | string
  totalTTC: number | string
  createdAt: string
  dateExpiration: string | null
  lignes: Ligne[]
}

interface PublicFacture {
  id: string
  numeroFacture: string
  statut: string
  totalHT: number | string
  taxe: number | string
  totalTTC: number | string
  montantPaye: number | string
  dateEcheance: string | null
  dateEnvoi: string | null
  notes: string | null
  createdAt: string
  devis: DevisLie | null
  client: { nom: string; email: string | null; telephone: string | null; nomEntreprise: string | null }
  lignes: Ligne[]
  entreprise: {
    nom: string; email: string | null; telephone: string | null
    adresse: string | null; logo: string | null; couleurPrimaire: string | null
    ice: string | null; rc: string | null; website: string | null
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

// ── Helpers ─────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : v }

function formatMAD(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })
}

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/\/api\/v1\/?$/, '')
function logoUrl(path: string) {
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

// ── Success screen ───────────────────────────────────────────────────────────

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
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">

        {/* Main card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-1.5" style={{ backgroundColor: brand }} />

          <div className="p-8">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-green-100 dark:bg-green-950/40">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white text-center mb-1">{t('public.facture.declarationSent')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              {t('public.facture.declarationDesc').replace('{company}', facture.entreprise.nom)}
            </p>

            {/* Declaration summary */}
            <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{t('public.facture.montantDeclare')}</span>
                <span className="text-lg font-black text-blue-700 dark:text-blue-300">{formatMAD(montantDeclare)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">{t('public.facture.methode')}</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{methodeLabel}</p>
                </div>
                <div>
                  <p className="text-slate-400">{t('public.facture.date')}</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(declaration.datePaiement)}</p>
                </div>
                {declaration.reference.trim() && (
                  <div className="col-span-2">
                    <p className="text-slate-400">{t('public.facture.reference')}</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{declaration.reference}</p>
                  </div>
                )}
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400">{t('public.facture.sentOn')} {submittedStr}</div>
            </div>

            {/* Balance summary */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
              <div className="bg-slate-800 dark:bg-slate-950 px-4 py-2.5">
                <p className="text-xs font-bold text-white uppercase tracking-wider">{t('public.facture.balance')}</p>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>{t('public.facture.totalTTC')}</span>
                  <span>{formatMAD(facture.totalTTC)}</span>
                </div>
                {n(facture.montantPaye) > 0 && (
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>{t('public.facture.alreadyPaid')}</span>
                    <span>−{formatMAD(facture.montantPaye)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-blue-600 dark:text-blue-400 border-t border-slate-100 dark:border-slate-700 pt-2">
                  <span>{t('public.facture.thisDeclaration')}</span>
                  <span>−{formatMAD(montantDeclare)}</span>
                </div>
                <div className={cn(
                  'flex justify-between font-bold text-sm rounded-lg px-3 py-2 mt-1',
                  isFullyPaid
                    ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                    : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400',
                )}>
                  <span>{isFullyPaid ? `✓ ${t('public.facture.fullyPaid')}` : t('public.facture.remaining')}</span>
                  <span>{isFullyPaid ? formatMAD(0) : formatMAD(montantRestantApres)}</span>
                </div>
              </div>
            </div>

            {/* Download button */}
            <div className="text-center">
              <FactureDownloadButton
                data={pdfData}
                brand={brand}
                label={t('public.facture.downloadReceipt')}
                loadingLabel={t('public.pdfGenerating')}
              />
              <p className="mt-3 text-xs text-slate-400">
                {t('public.facture.downloadReceiptDesc')}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center">
          {t('public.generatedBy')} — {t('public.generatedBySub')}
        </p>
      </div>
    </div>
  )
}

// ── Linked devis card ────────────────────────────────────────────────────────

function DevisLieCard({ devis, brand }: { devis: DevisLie; brand: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brand}1a` }}>
            <FileText className="w-5 h-5" style={{ color: brand }} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Devis lié à cette facture</h2>
            <p className="text-xs text-slate-400 mt-0.5">Référence : <span className="font-semibold text-slate-600 dark:text-slate-300">{devis.reference}</span></p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-400 mb-0.5">Date du devis</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(devis.createdAt)}</p>
          </div>
          {devis.dateExpiration && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-400 mb-0.5">Valide jusqu'au</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(devis.dateExpiration)}</p>
            </div>
          )}
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${brand}12` }}>
            <p className="text-xs mb-0.5" style={{ color: brand }}>Montant TTC</p>
            <p className="text-sm font-bold" style={{ color: brand }}>{formatMAD(devis.totalTTC)}</p>
          </div>
        </div>

        {devis.lignes.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <span>Prestations du devis ({devis.lignes.length})</span>
              {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expanded && (
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
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Payment info card ────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
      title="Copier"
    >
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function BankInfoCard({ facture }: { facture: PublicFacture }) {
  const e = facture.entreprise
  const hasBankInfo = e.titulaireCompte || e.banque || e.rib || e.iban
  if (!hasBankInfo) return null

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
            <Banknote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Informations de paiement</h2>
            <p className="text-xs text-slate-400 mt-0.5">Effectuez votre virement sur le compte ci-dessous</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-3">
        {e.titulaireCompte && (
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Nom du bénéficiaire</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{e.titulaireCompte}</p>
            </div>
            <CopyButton text={e.titulaireCompte} />
          </div>
        )}
        {e.banque && (
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Banque</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{e.banque}</p>
            </div>
            <CopyButton text={e.banque} />
          </div>
        )}
        {e.rib && (
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">RIB</p>
              <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white tracking-wide">{e.rib}</p>
            </div>
            <CopyButton text={e.rib} />
          </div>
        )}
        {e.iban && (
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">IBAN</p>
              <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white tracking-wide">{e.iban}</p>
            </div>
            <CopyButton text={e.iban} />
          </div>
        )}
        {e.swift && (
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">BIC / SWIFT</p>
              <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white tracking-wide">{e.swift}</p>
            </div>
            <CopyButton text={e.swift} />
          </div>
        )}
        <div className="flex items-center justify-between gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-0.5">Référence de paiement</p>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300 font-mono">{facture.numeroFacture}</p>
          </div>
          <CopyButton text={facture.numeroFacture} />
        </div>
      </div>
    </div>
  )
}

// ── Declaration form ─────────────────────────────────────────────────────────

function DeclarationModal({
  open,
  onClose,
  onSubmit,
  facture,
  loading,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: DeclarationForm) => void
  facture: PublicFacture
  loading: boolean
}) {
  const [form, setForm] = useState<DeclarationForm>({
    ...EMPTY_FORM,
    montant: String(Math.max(0, n(facture.totalTTC) - n(facture.montantPaye))),
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const restant = Math.max(0, n(facture.totalTTC) - n(facture.montantPaye))

  const validate = () => {
    const e: Record<string, string> = {}
    const m = parseFloat(form.montant) || 0
    if (!form.montant || m <= 0) e.montant = 'Le montant doit être supérieur à 0.'
    else if (m > restant + 0.01) e.montant = `Le montant ne peut pas dépasser ${formatMAD(restant)}.`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onSubmit(form)
  }

  if (!open) return null

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all'
  const labelClass = 'text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Déclarer un paiement</h3>
            <p className="text-xs text-slate-400 mt-0.5">Facture {facture.numeroFacture}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Remaining amount info */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Reste à payer : <strong>{formatMAD(restant)}</strong>
            </p>
          </div>

          {/* Montant */}
          <div>
            <label className={labelClass}>Montant payé (MAD) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={restant}
              value={form.montant}
              onChange={e => { setForm(f => ({ ...f, montant: e.target.value })); delete errors.montant; setErrors({ ...errors }) }}
              className={cn(inputClass, errors.montant && 'border-red-400 focus:ring-red-500/40')}
              placeholder="0.00"
            />
            {errors.montant && <p className="text-xs text-red-500 mt-1">{errors.montant}</p>}
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Date du paiement</label>
            <input
              type="date"
              value={form.datePaiement}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(f => ({ ...f, datePaiement: e.target.value }))}
              className={inputClass}
            />
          </div>

          {/* Méthode */}
          <div>
            <label className={labelClass}>Méthode de paiement</label>
            <select
              value={form.methode}
              onChange={e => setForm(f => ({ ...f, methode: e.target.value }))}
              className={inputClass}
            >
              {METHODES.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Référence */}
          <div>
            <label className={labelClass}>Référence de paiement (optionnel)</label>
            <input
              type="text"
              value={form.reference}
              onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
              className={inputClass}
              placeholder="N° de virement, chèque..."
            />
          </div>

          {/* Message */}
          <div>
            <label className={labelClass}>Message (optionnel)</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className={cn(inputClass, 'resize-none')}
              rows={2}
              placeholder="Remarques sur le paiement..."
            />
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-all"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

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
  const [linesExpanded, setLinesExpanded] = useState(false)

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
      const restantAvant = facture ? Math.max(0, n(facture.totalTTC) - n(facture.montantPaye)) : 0
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

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  // ── Error ──
  if (error && !facture) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lien invalide</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!facture) return null

  // ── Declaration sent ──
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
  const montantRestant = Math.max(0, n(facture.totalTTC) - n(facture.montantPaye))
  const pctPaid = n(facture.totalTTC) > 0
    ? Math.min(100, (n(facture.montantPaye) / n(facture.totalTTC)) * 100)
    : 0
  const isPayee = facture.statut === 'PAYEE'
  const canDeclare = ['ENVOYEE', 'VUE', 'PARTIELLE', 'EN_RETARD'].includes(facture.statut) && montantRestant > 0.01

  const statutLabel: Record<string, { label: string; color: string; bg: string }> = {
    BROUILLON:   { label: 'Brouillon',    color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-800' },
    ENVOYEE:     { label: 'Envoyée',      color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-950/50' },
    VUE:         { label: 'Consultée',    color: 'text-purple-600',  bg: 'bg-purple-100 dark:bg-purple-950/50' },
    PARTIELLE:   { label: 'Part. payée',  color: 'text-amber-700',   bg: 'bg-amber-100 dark:bg-amber-950/50' },
    PAYEE:       { label: 'Payée',        color: 'text-green-600',   bg: 'bg-green-100 dark:bg-green-950/50' },
    EN_RETARD:   { label: 'En retard',    color: 'text-red-600',     bg: 'bg-red-100 dark:bg-red-950/50' },
    ANNULEE:     { label: 'Annulée',      color: 'text-slate-400',   bg: 'bg-slate-100 dark:bg-slate-800' },
  }
  const st = statutLabel[facture.statut] ?? statutLabel.ENVOYEE

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Invoice card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">

          {/* Brand header */}
          <div className="p-6 sm:p-8" style={{ borderTop: `4px solid ${brand}` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {facture.entreprise.logo ? (
                  <img
                    src={logoUrl(facture.entreprise.logo)}
                    alt={facture.entreprise.nom}
                    className="h-12 w-auto object-contain rounded-lg"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl flex-shrink-0"
                    style={{ backgroundColor: brand }}
                  >
                    {facture.entreprise.nom.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="font-black text-lg text-slate-900 dark:text-white">{facture.entreprise.nom}</h1>
                  {facture.entreprise.email && <p className="text-xs text-slate-500">{facture.entreprise.email}</p>}
                  {facture.entreprise.telephone && <p className="text-xs text-slate-500">{facture.entreprise.telephone}</p>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FACTURE</span>
                <p className="font-black text-xl text-slate-900 dark:text-white">{facture.numeroFacture}</p>
                <span className={cn('inline-block mt-1 text-xs px-2.5 py-1 rounded-full font-semibold', st.bg, st.color)}>
                  {st.label}
                </span>
              </div>
            </div>
          </div>

          {/* Company + Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-8 pb-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">De</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{facture.entreprise.nom}</p>
              {facture.entreprise.adresse && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />{facture.entreprise.adresse}
                </p>
              )}
              {facture.entreprise.ice && <p className="text-xs text-slate-500">ICE: {facture.entreprise.ice}</p>}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pour</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{facture.client.nom}</p>
              {facture.client.nomEntreprise && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 flex-shrink-0" />{facture.client.nomEntreprise}
                </p>
              )}
              {facture.client.email && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />{facture.client.email}
                </p>
              )}
              {facture.client.telephone && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />{facture.client.telephone}
                </p>
              )}
            </div>
          </div>

          {/* Dates row */}
          <div className="flex flex-wrap gap-3 px-6 sm:px-8 pb-6">
            {facture.createdAt && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5" />
                Émise le {formatDate(facture.createdAt)}
              </span>
            )}
            {facture.dateEcheance && (
              <span className={cn(
                'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg',
                new Date(facture.dateEcheance) < new Date() && facture.statut !== 'PAYEE'
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                  : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400',
              )}>
                <Clock className="w-3.5 h-3.5" />
                Échéance {formatDate(facture.dateEcheance)}
              </span>
            )}
          </div>

          {/* Payment progress */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Progression du paiement</span>
                <span className="text-xs font-bold" style={{ color: brand }}>{Math.round(pctPaid)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-3">
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{ width: `${pctPaid}%`, backgroundColor: brand }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-slate-400">Total TTC</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{formatMAD(facture.totalTTC)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Payé</p>
                  <p className="text-sm font-black text-green-600 mt-0.5">{formatMAD(facture.montantPaye)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Reste dû</p>
                  <p className={cn('text-sm font-black mt-0.5', montantRestant > 0 ? 'text-red-600' : 'text-green-600')}>
                    {formatMAD(montantRestant)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 sm:px-8 pb-2">
            <button
              onClick={() => setLinesExpanded(v => !v)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <span>Détail des prestations ({facture.lignes.length})</span>
              {linesExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {linesExpanded && (
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
                    {facture.lignes.map((l, i) => (
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
          )}

          {/* Totals */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="ml-auto w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Sous-total HT</span>
                <span>{formatMAD(facture.totalHT)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>TVA {n(facture.taxe)}%</span>
                <span>{formatMAD(n(facture.totalTTC) - n(facture.totalHT))}</span>
              </div>
              <div className="flex justify-between font-black text-base text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2">
                <span>Total TTC</span>
                <span style={{ color: brand }}>{formatMAD(facture.totalTTC)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {facture.notes && (
            <div className="px-6 sm:px-8 pb-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Notes</p>
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{facture.notes}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          {canDeclare && (
            <div className="px-6 sm:px-8 pb-8 border-t border-slate-100 dark:border-slate-800">
              <div className="pt-6 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Vous avez effectué un paiement ? Déclarez-le pour en informer l&apos;entreprise.
                </p>
                <button
                  onClick={() => setDeclarationOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: brand }}
                >
                  <CreditCard className="w-4 h-4" />
                  J&apos;ai effectué un paiement
                </button>
              </div>
            </div>
          )}

          {/* Already paid */}
          {isPayee && (
            <div className="px-6 sm:px-8 pb-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-bold text-green-700 dark:text-green-400">Facture entièrement réglée</p>
              </div>
            </div>
          )}

          {/* View indicator */}
          {(facture.statut === 'VUE' || facture.statut === 'ENVOYEE') && (
            <div className="px-6 sm:px-8 pb-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                <span>Cette facture a été consultée</span>
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

        {/* Linked devis */}
        {facture.devis && <DevisLieCard devis={facture.devis} brand={brand} />}

        {/* Banking info */}
        <BankInfoCard facture={facture} />

      </div>

      {/* Declaration modal */}
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
