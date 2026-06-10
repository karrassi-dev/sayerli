'use client'

import { useState } from 'react'
import {
  Download, FileSpreadsheet, FileText,
  Users, File, Receipt, CreditCard, Calendar,
  CheckSquare, Square, ChevronRight,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

/* ─── types ─────────────────────────────────────────────────── */

type EntityKey = 'clients' | 'devis' | 'factures' | 'paiements'
type Period    = 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear' | 'all' | 'custom'
type Format    = 'excel' | 'pdf'

interface ExportData {
  clients?:   any[]
  devis?:     any[]
  factures?:  any[]
  paiements?: any[]
}

/* ─── helpers ────────────────────────────────────────────────── */

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtMoney(v: string | number | null | undefined) {
  if (v === null || v === undefined || v === '') return '—'
  const n = Number(v)
  return n.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MAD'
}

const STATUS_FR: Record<string, string> = {
  BROUILLON: 'Brouillon', ENVOYE: 'Envoyé', VU: 'Vu', ACCEPTE: 'Accepté', REFUSE: 'Refusé',
  ENVOYEE: 'Envoyée', PAYEE: 'Payée', PARTIELLE: 'Partielle', EN_RETARD: 'En retard', ANNULEE: 'Annulée',
  CASH: 'Espèces', VIREMENT: 'Virement', CARTE: 'Carte', CHEQUE: 'Chèque', MOBILE: 'Mobile', AUTRE: 'Autre',
}

function getDateRange(period: Period, customFrom?: string, customTo?: string) {
  if (period === 'custom') return { dateDebut: customFrom, dateFin: customTo }
  const today = new Date()
  const fmt   = (d: Date) => d.toISOString().split('T')[0]
  switch (period) {
    case 'thisMonth':
      return { dateDebut: fmt(new Date(today.getFullYear(), today.getMonth(), 1)), dateFin: fmt(today) }
    case 'lastMonth': {
      const s = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const e = new Date(today.getFullYear(), today.getMonth(), 0)
      return { dateDebut: fmt(s), dateFin: fmt(e) }
    }
    case 'last3Months': {
      const d = new Date(today); d.setMonth(d.getMonth() - 3)
      return { dateDebut: fmt(d), dateFin: fmt(today) }
    }
    case 'thisYear':
      return { dateDebut: fmt(new Date(today.getFullYear(), 0, 1)), dateFin: fmt(today) }
    default:
      return {}
  }
}

function periodLabel(period: Period, t: (k: string) => string, customFrom?: string, customTo?: string): string {
  if (period === 'custom') {
    if (customFrom && customTo) return `${fmtDate(customFrom)} — ${fmtDate(customTo)}`
    return t('export.periods.custom')
  }
  return t(`export.periods.${period}`)
}

async function generateExcel(data: ExportData, entrepriseName: string, periode: string) {
  const XLSX = (await import('xlsx')).default

  const wb = XLSX.utils.book_new()

  /* Info sheet */
  const info = XLSX.utils.aoa_to_sheet([
    ['Export Sayerli'],
    ['Entreprise',    entrepriseName],
    ['Période',       periode],
    ['Généré le',     fmtDate(new Date().toISOString())],
  ])
  XLSX.utils.book_append_sheet(wb, info, 'Informations')

  if (data.clients) {
    const rows = [
      ['Nom', 'Email', 'Téléphone', 'Entreprise', 'Statut', 'Date création'],
      ...data.clients.map(c => [
        c.nom, c.email || '', c.telephone || '', c.nomEntreprise || '',
        c.actif ? 'Actif' : 'Inactif', fmtDate(c.createdAt),
      ]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 18 }, { wch: 26 }, { wch: 10 }, { wch: 16 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Clients')
  }

  if (data.devis) {
    const rows = [
      ['Référence', 'Client', 'Statut', 'Total HT', 'Total TTC', 'Expiration', 'Date création'],
      ...data.devis.map(d => [
        d.reference, d.client?.nom || '', STATUS_FR[d.statut] || d.statut,
        fmtMoney(d.totalHT), fmtMoney(d.totalTTC),
        fmtDate(d.dateExpiration), fmtDate(d.createdAt),
      ]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [{ wch: 18 }, { wch: 26 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Devis')
  }

  if (data.factures) {
    const rows = [
      ['N° Facture', 'Client', 'Statut', 'Total TTC', 'Payé', 'Reste', 'Échéance', 'Date création'],
      ...data.factures.map(f => [
        f.numeroFacture, f.client?.nom || '', STATUS_FR[f.statut] || f.statut,
        fmtMoney(f.totalTTC), fmtMoney(f.montantPaye),
        fmtMoney(Number(f.totalTTC) - Number(f.montantPaye)),
        fmtDate(f.dateEcheance), fmtDate(f.createdAt),
      ]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [{ wch: 16 }, { wch: 26 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Factures')
  }

  if (data.paiements) {
    const rows = [
      ['Facture', 'Client', 'Montant', 'Méthode', 'Référence', 'Date paiement'],
      ...data.paiements.map(p => [
        p.facture?.numeroFacture || '', p.facture?.client?.nom || '',
        fmtMoney(p.montant), STATUS_FR[p.methode] || p.methode,
        p.reference || '', fmtDate(p.datePaiement),
      ]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [{ wch: 16 }, { wch: 26 }, { wch: 18 }, { wch: 14 }, { wch: 22 }, { wch: 16 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Paiements')
  }

  const filename = `export-sayerli-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
}

async function generatePDF(data: ExportData, meta: { entrepriseName: string; periode: string; generatedAt: string }) {
  const { pdf }              = await import('@react-pdf/renderer')
  const { default: ExportPDF } = await import('@/components/pdf/ExportPDF')
  const React                = (await import('react')).default

  const blob = await pdf(React.createElement(ExportPDF, { data, meta })).toBlob()
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `export-sayerli-${new Date().toISOString().split('T')[0]}.pdf`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

/* ─── entity cards ───────────────────────────────────────────── */

const ENTITIES: { key: EntityKey; icon: typeof Users; color: string; gradient: string }[] = [
  { key: 'clients',   icon: Users,       color: 'text-blue-600',   gradient: 'from-blue-500 to-blue-600' },
  { key: 'devis',     icon: File,        color: 'text-teal-600',   gradient: 'from-teal-500 to-teal-600' },
  { key: 'factures',  icon: Receipt,     color: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  { key: 'paiements', icon: CreditCard,  color: 'text-green-600',  gradient: 'from-green-500 to-green-600' },
]

const PERIOD_KEYS: Period[] = ['thisMonth', 'lastMonth', 'last3Months', 'thisYear', 'all', 'custom']

/* ─── page component ─────────────────────────────────────────── */

export default function ExportPage() {
  const { t }         = useTranslation()
  const { entreprise } = useAuth()

  const [selected, setSelected] = useState<Set<EntityKey>>(
    new Set(['clients', 'devis', 'factures', 'paiements'])
  )
  const [period,      setPeriod]     = useState<Period>('thisMonth')
  const [customFrom,  setCustomFrom] = useState('')
  const [customTo,    setCustomTo]   = useState('')
  const [format,      setFormat]     = useState<Format>('excel')
  const [loading,     setLoading]    = useState(false)
  const [error,       setError]      = useState('')

  const toggleEntity = (key: EntityKey) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const handleExport = async () => {
    if (selected.size === 0) { setError(t('export.selectAtLeastOne')); return }
    setError('')
    setLoading(true)

    try {
      const { dateDebut, dateFin } = getDateRange(period, customFrom, customTo)
      const params: Record<string, string> = { types: [...selected].join(',') }
      if (dateDebut) params.dateDebut = dateDebut
      if (dateFin)   params.dateFin   = dateFin

      const res  = await api.get('/export/data', { params })
      const data: ExportData = res.data.data

      const periode     = periodLabel(period, t, customFrom, customTo)
      const entName     = entreprise?.nom || 'Sayerli'
      const generatedAt = fmtDate(new Date().toISOString())

      if (format === 'excel') {
        await generateExcel(data, entName, periode)
      } else {
        await generatePDF(data, { entrepriseName: entName, periode, generatedAt })
      }
    } catch {
      setError('Une erreur est survenue lors de la génération. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all'

  return (
    <div dir="ltr" className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {t('export.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('export.subtitle')}
        </p>
      </div>

      {/* Step 1 — entities */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center">1</span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('export.step1Title')}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ENTITIES.map(({ key, icon: Icon, color, gradient }) => {
            const active = selected.has(key)
            return (
              <button
                key={key}
                onClick={() => toggleEntity(key)}
                className={cn(
                  'relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 text-center transition-all duration-200',
                  active
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                {/* Check indicator */}
                <span className={cn(
                  'absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center transition-all',
                  active ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                )}>
                  {active && <span className="w-2 h-2 rounded-sm bg-white block" />}
                </span>

                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={cn('text-sm font-semibold', active ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300')}>
                  {t(`export.entities.${key}`)}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                  {t(`export.entities.${key}Desc`)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2 — period */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center">2</span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('export.step2Title')}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIOD_KEYS.map(key => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
                period === key
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              )}
            >
              {key === 'custom' && <Calendar className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
              {t(`export.periods.${key}`)}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
                {t('export.from')}
              </label>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className={inputCls} />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 mt-5 flex-shrink-0" />
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
                {t('export.to')}
              </label>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className={inputCls} />
            </div>
          </div>
        )}
      </div>

      {/* Step 3 — format */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center">3</span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('export.step3Title')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Excel */}
          <button
            onClick={() => setFormat('excel')}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
              format === 'excel'
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/40'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
              format === 'excel' ? 'bg-green-100 dark:bg-green-950/50' : 'bg-slate-100 dark:bg-slate-800'
            )}>
              <FileSpreadsheet className={cn('w-5 h-5', format === 'excel' ? 'text-green-600' : 'text-slate-500')} />
            </div>
            <div className="min-w-0">
              <p className={cn('text-sm font-bold', format === 'excel' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-200')}>
                Excel <span className="font-normal text-slate-400">.xlsx</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {t('export.formats.excelDesc')}
              </p>
            </div>
          </button>

          {/* PDF */}
          <button
            onClick={() => setFormat('pdf')}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
              format === 'pdf'
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/40'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
              format === 'pdf' ? 'bg-red-100 dark:bg-red-950/50' : 'bg-slate-100 dark:bg-slate-800'
            )}>
              <FileText className={cn('w-5 h-5', format === 'pdf' ? 'text-red-600' : 'text-slate-500')} />
            </div>
            <div className="min-w-0">
              <p className={cn('text-sm font-bold', format === 'pdf' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-200')}>
                PDF <span className="font-normal text-slate-400">.pdf</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {t('export.formats.pdfDesc')}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={loading || selected.size === 0}
        className={cn(
          'w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all',
          'bg-primary-500 hover:bg-primary-600 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-primary-200 dark:shadow-none'
        )}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('export.loading')}
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            {t('export.button')}
            {format === 'excel' ? ' (.xlsx)' : ' (.pdf)'}
          </>
        )}
      </button>

      {/* Summary chips */}
      {selected.size > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {[...selected].map(k => (
            <span key={k} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
              {t(`export.entities.${k}`)}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-500">
            {periodLabel(period, t, customFrom, customTo)}
          </span>
          <span className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium',
            format === 'excel' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
          )}>
            {format === 'excel' ? 'Excel' : 'PDF'}
          </span>
        </div>
      )}
    </div>
  )
}
