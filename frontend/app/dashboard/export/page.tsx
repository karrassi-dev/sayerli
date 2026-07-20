'use client'

import { useState } from 'react'
import {
  Download, FileSpreadsheet, FileText,
  Users, File, Receipt, CreditCard, Calendar,
  CheckSquare, Square, ChevronRight, BookOpen,
  GripVertical, RotateCcw,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { canDo } from '@/lib/permissions'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

/* ─── types ─────────────────────────────────────────────────── */

type EntityKey  = 'clients' | 'devis' | 'factures' | 'paiements'
type Period     = 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear' | 'all' | 'custom'
type Format     = 'excel' | 'pdf'
type ExportMode = 'general' | 'journal'

interface ExportData {
  clients?:   any[]
  devis?:     any[]
  factures?:  any[]
  paiements?: any[]
}

interface JournalColState { key: string; enabled: boolean }

/* ─── journal column definitions ─────────────────────────────── */

const JOURNAL_COL_DEFS: { key: string; label: string; width: number; isNumber?: boolean }[] = [
  { key: 'dateFacture',    label: 'Date Facture',         width: 14 },
  { key: 'numeroFacture',  label: 'N° Facture',           width: 18 },
  { key: 'client',         label: 'Client',               width: 24 },
  { key: 'entreprise',     label: 'Entreprise Client',    width: 24 },
  { key: 'ice',            label: 'ICE Client',           width: 16 },
  { key: 'ifFiscal',       label: 'IF Fiscal',            width: 14 },
  { key: 'montantHT',      label: 'Montant HT (MAD)',     width: 18, isNumber: true },
  { key: 'tva',            label: 'TVA %',                width: 8  },
  { key: 'montantTVA',     label: 'Montant TVA (MAD)',    width: 18, isNumber: true },
  { key: 'montantTTC',     label: 'Montant TTC (MAD)',    width: 18, isNumber: true },
  { key: 'montantPaye',    label: 'Montant Payé (MAD)',   width: 18, isNumber: true },
  { key: 'resteAPayer',    label: 'Reste à Payer (MAD)',  width: 18, isNumber: true },
  { key: 'statut',         label: 'Statut',               width: 16 },
]

const DEFAULT_JOURNAL_COLS: JournalColState[] = JOURNAL_COL_DEFS.map(c => ({ key: c.key, enabled: true }))

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

/* ─── excel generators ───────────────────────────────────────── */

async function generateExcel(data: ExportData, entrepriseName: string, periode: string) {
  const xlsxMod = await import('xlsx')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX = (xlsxMod as any).default ?? xlsxMod

  const wb = XLSX.utils.book_new()
  const today = fmtDate(new Date().toISOString())

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function makeSheet(headers: string[], rows: any[][], colWidths: { wch: number }[]) {
    const ws = XLSX.utils.aoa_to_sheet([
      [`Export Sayerli — ${entrepriseName}`],
      [`Période : ${periode}   ·   Généré le : ${today}`],
      [],
      headers,
      ...rows,
    ])
    ws['!cols'] = colWidths
    return ws
  }

  if (data.clients) {
    const ws = makeSheet(
      ['Nom', 'Email', 'Téléphone', 'Entreprise', 'Statut', 'Date création'],
      data.clients.map(c => [
        c.nom, c.email || '', c.telephone || '', c.nomEntreprise || '',
        c.actif ? 'Actif' : 'Inactif', fmtDate(c.createdAt),
      ]),
      [{ wch: 26 }, { wch: 30 }, { wch: 18 }, { wch: 26 }, { wch: 10 }, { wch: 16 }],
    )
    XLSX.utils.book_append_sheet(wb, ws, 'Clients')
  }

  if (data.devis) {
    const ws = makeSheet(
      ['Référence', 'Client', 'Statut', 'Total HT', 'Total TTC', 'Expiration', 'Date création'],
      data.devis.map(d => [
        d.reference, d.client?.nom || '', STATUS_FR[d.statut] || d.statut,
        fmtMoney(d.totalHT), fmtMoney(d.totalTTC),
        fmtDate(d.dateExpiration), fmtDate(d.createdAt),
      ]),
      [{ wch: 18 }, { wch: 26 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 15 }],
    )
    XLSX.utils.book_append_sheet(wb, ws, 'Devis')
  }

  if (data.factures) {
    const ws = makeSheet(
      ['N° Facture', 'Client', 'Statut', 'Total TTC', 'Payé', 'Reste', 'Échéance', 'Date création'],
      data.factures.map(f => [
        f.numeroFacture, f.client?.nom || '', STATUS_FR[f.statut] || f.statut,
        fmtMoney(f.totalTTC), fmtMoney(f.montantPaye),
        fmtMoney(Number(f.totalTTC) - Number(f.montantPaye)),
        fmtDate(f.dateEcheance), fmtDate(f.createdAt),
      ]),
      [{ wch: 16 }, { wch: 26 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 15 }],
    )
    XLSX.utils.book_append_sheet(wb, ws, 'Factures')
  }

  if (data.paiements) {
    const ws = makeSheet(
      ['Facture', 'Client', 'Montant', 'Méthode', 'Référence', 'Date paiement'],
      data.paiements.map(p => [
        p.facture?.numeroFacture || '', p.facture?.client?.nom || '',
        fmtMoney(p.montant), STATUS_FR[p.methode] || p.methode,
        p.reference || '', fmtDate(p.datePaiement),
      ]),
      [{ wch: 16 }, { wch: 26 }, { wch: 18 }, { wch: 14 }, { wch: 22 }, { wch: 16 }],
    )
    XLSX.utils.book_append_sheet(wb, ws, 'Paiements')
  }

  const filename = `export-sayerli-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getJournalCellValue(f: any, key: string): string | number {
  const ht         = Number(f.totalHT)    || 0
  const ttc        = Number(f.totalTTC)   || 0
  const paye       = Number(f.montantPaye)|| 0
  const tva        = Number(f.taxe)       || 0
  const montantTva = ttc - ht
  const reste      = ttc - paye

  const STATUS_JV: Record<string, string> = {
    ENVOYEE: 'Envoyée', PAYEE: 'Payée', PARTIELLE: 'Paiement partiel',
    EN_RETARD: 'En retard', VUE: 'Vue', ANNULEE: 'Annulée',
  }

  switch (key) {
    case 'dateFacture':   return fmtDate(f.createdAt)
    case 'numeroFacture': return f.numeroFacture
    case 'client':        return f.client?.nom || ''
    case 'entreprise':    return f.client?.nomEntreprise || '—'
    case 'ice':           return f.client?.ice || '—'
    case 'ifFiscal':      return f.client?.ifFiscal || '—'
    case 'montantHT':     return ht
    case 'tva':           return `${tva}%`
    case 'montantTVA':    return montantTva
    case 'montantTTC':    return ttc
    case 'montantPaye':   return paye
    case 'resteAPayer':   return reste
    case 'statut':        return STATUS_JV[f.statut] || f.statut
    default:              return ''
  }
}

async function generateJournalDesVentes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factures: any[],
  entrepriseName: string,
  periode: string,
  columns: JournalColState[],
) {
  const xlsxMod = await import('xlsx')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX = (xlsxMod as any).default ?? xlsxMod

  const today = fmtDate(new Date().toISOString())
  const activeCols = columns.filter(c => c.enabled)

  const headers = activeCols.map(c => JOURNAL_COL_DEFS.find(d => d.key === c.key)!.label)
  const rows    = factures.map(f => activeCols.map(c => getJournalCellValue(f, c.key)))

  const ws = XLSX.utils.aoa_to_sheet([
    [`Journal des Ventes — ${entrepriseName}`],
    [`Période : ${periode}   ·   Généré le : ${today}`],
    [`Note : ICE et IF Fiscal sont renseignés automatiquement depuis la fiche client.`],
    [],
    headers,
    ...rows,
  ])

  ws['!cols'] = activeCols.map(c => ({ wch: JOURNAL_COL_DEFS.find(d => d.key === c.key)!.width }))

  const numColIndices = activeCols.reduce<number[]>((acc, c, i) => {
    if (JOURNAL_COL_DEFS.find(d => d.key === c.key)?.isNumber) acc.push(i)
    return acc
  }, [])

  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  for (let R = 5; R <= range.e.r; R++) {
    for (const C of numColIndices) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })]
      if (cell && typeof cell.v === 'number') cell.z = '#,##0.00'
    }
  }

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Journal des Ventes')

  const filename = `journal-ventes-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
}

async function generatePDF(data: ExportData, meta: {
  entrepriseName: string; periode: string; generatedAt: string
  logo?: string | null; adresse?: string | null; ville?: string | null
  telephone?: string | null; email?: string | null
  ice?: string | null; rc?: string | null; couleurPrimaire?: string | null
}) {
  const { pdf }              = await import('@react-pdf/renderer')
  const { default: ExportPDF } = await import('@/components/pdf/ExportPDF')
  const React                = (await import('react')).default

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(React.createElement(ExportPDF, { data, meta }) as any).toBlob()
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
  const { t }          = useTranslation()
  const { entreprise, user } = useAuth()
  const removed = user?.permissionsRetirees ?? []
  const role    = user?.role ?? ''

  const [exportMode,      setExportMode]      = useState<ExportMode>('general')
  const [selected,        setSelected]        = useState<Set<EntityKey>>(
    new Set(['clients', 'devis', 'factures', 'paiements'])
  )
  const [period,          setPeriod]          = useState<Period>('thisMonth')
  const [customFrom,      setCustomFrom]      = useState('')
  const [customTo,        setCustomTo]        = useState('')
  const [format,          setFormat]          = useState<Format>('excel')
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')

  /* journal column configurator state */
  const [journalCols,     setJournalCols]     = useState<JournalColState[]>(DEFAULT_JOURNAL_COLS)
  const [dragIdx,         setDragIdx]         = useState<number | null>(null)
  const [dragOverIdx,     setDragOverIdx]     = useState<number | null>(null)

  const toggleEntity = (key: EntityKey) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const toggleJournalCol = (key: string) =>
    setJournalCols(prev => prev.map(c => c.key === key ? { ...c, enabled: !c.enabled } : c))

  const handleColDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return
    setJournalCols(prev => {
      const next = [...prev]
      const [moved] = next.splice(dragIdx, 1)
      next.splice(targetIdx, 0, moved)
      return next
    })
  }

  const resetJournalCols = () => setJournalCols(DEFAULT_JOURNAL_COLS)

  const enabledJournalCols = journalCols.filter(c => c.enabled)

  const handleExport = async () => {
    if (exportMode === 'general' && selected.size === 0) { setError(t('export.selectAtLeastOne')); return }
    if (exportMode === 'journal' && enabledJournalCols.length === 0) { setError('Sélectionnez au moins une colonne.'); return }
    setError('')
    setLoading(true)

    try {
      const { dateDebut, dateFin } = getDateRange(period, customFrom, customTo)
      const periode  = periodLabel(period, t, customFrom, customTo)
      const entName  = entreprise?.nom || 'Sayerli'

      if (exportMode === 'journal') {
        const params: Record<string, string> = { types: 'factures' }
        if (dateDebut) params.dateDebut = dateDebut
        if (dateFin)   params.dateFin   = dateFin
        const res = await api.get('/export/data', { params })
        const allFactures = (res.data.data ?? res.data)?.factures ?? []
        const factures = allFactures.filter((f: { statut: string }) =>
          !['BROUILLON', 'ANNULEE'].includes(f.statut)
        )
        await generateJournalDesVentes(factures, entName, periode, journalCols)
        return
      }

      const params: Record<string, string> = { types: [...selected].join(',') }
      if (dateDebut) params.dateDebut = dateDebut
      if (dateFin)   params.dateFin   = dateFin

      const res  = await api.get('/export/data', { params })
      const data: ExportData = res.data.data
      const generatedAt = fmtDate(new Date().toISOString())

      if (format === 'excel') {
        await generateExcel(data, entName, periode)
      } else {
        let company: Record<string, string | null> = {}
        try {
          const compRes = await api.get('/settings/company')
          company = compRes.data.data ?? compRes.data ?? {}
        } catch { /* non-blocking */ }
        await generatePDF(data, {
          entrepriseName: entName,
          periode,
          generatedAt,
          logo: company.logo ?? null,
          adresse: company.adresse ?? null,
          ville: company.ville ?? null,
          telephone: company.telephone ?? null,
          email: company.email ?? null,
          ice: company.ice ?? null,
          rc: company.rc ?? null,
          couleurPrimaire: company.couleurPrimaire ?? null,
        })
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

      {/* Export mode selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setExportMode('general')}
          className={cn(
            'flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all',
            exportMode === 'general'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300',
          )}
        >
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
            exportMode === 'general' ? 'bg-primary-100 dark:bg-primary-900' : 'bg-slate-100 dark:bg-slate-800',
          )}>
            <FileSpreadsheet className={cn('w-4 h-4', exportMode === 'general' ? 'text-primary-600' : 'text-slate-500')} />
          </div>
          <div>
            <p className={cn('text-sm font-bold', exportMode === 'general' ? 'text-primary-700 dark:text-primary-300' : 'text-slate-800 dark:text-slate-200')}>
              Export général
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Clients, devis, factures, paiements — format libre
            </p>
          </div>
        </button>

        <button
          onClick={() => { setExportMode('journal'); setPeriod('all') }}
          className={cn(
            'flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all',
            exportMode === 'journal'
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300',
          )}
        >
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
            exportMode === 'journal' ? 'bg-teal-100 dark:bg-teal-900' : 'bg-slate-100 dark:bg-slate-800',
          )}>
            <BookOpen className={cn('w-4 h-4', exportMode === 'journal' ? 'text-teal-600' : 'text-slate-500')} />
          </div>
          <div>
            <p className={cn('text-sm font-bold', exportMode === 'journal' ? 'text-teal-700 dark:text-teal-300' : 'text-slate-800 dark:text-slate-200')}>
              Journal des ventes
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Format comptable — HT, TVA, TTC, payé, reste à payer
            </p>
          </div>
        </button>
      </div>

      {/* Step 1 — entities (hidden in journal mode) */}
      <div className={cn('bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm', exportMode === 'journal' && 'hidden')}>
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

      {/* Step 3 — Journal column configurator (journal mode only) */}
      {exportMode === 'journal' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Colonnes à exporter</h2>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                {enabledJournalCols.length}/{journalCols.length}
              </span>
            </div>
            <button
              onClick={resetJournalCols}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 ml-8">
            Glissez pour réordonner · cochez/décochez pour inclure ou exclure
          </p>

          <div className="space-y-1.5">
            {journalCols.map((col, idx) => {
              const def = JOURNAL_COL_DEFS.find(d => d.key === col.key)!
              const isDragTarget = dragOverIdx === idx && dragIdx !== null && dragIdx !== idx

              return (
                <div
                  key={col.key}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={e => { e.preventDefault(); setDragOverIdx(idx) }}
                  onDrop={() => { handleColDrop(idx); setDragIdx(null); setDragOverIdx(null) }}
                  onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all select-none',
                    isDragTarget
                      ? 'border-teal-400 bg-teal-50 dark:bg-teal-950/30 shadow-sm'
                      : dragIdx === idx
                        ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 opacity-50'
                        : col.enabled
                          ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 cursor-grab active:cursor-grabbing'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 cursor-grab active:cursor-grabbing'
                  )}
                >
                  {/* Drag handle */}
                  <GripVertical className={cn(
                    'w-4 h-4 flex-shrink-0',
                    col.enabled ? 'text-slate-300 dark:text-slate-600' : 'text-slate-200 dark:text-slate-700'
                  )} />

                  {/* Toggle */}
                  <button
                    onClick={() => toggleJournalCol(col.key)}
                    className="flex-shrink-0 transition-transform active:scale-90"
                  >
                    {col.enabled
                      ? <CheckSquare className="w-4 h-4 text-teal-500" />
                      : <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    }
                  </button>

                  {/* Label */}
                  <span className={cn(
                    'text-sm font-medium flex-1 transition-colors',
                    col.enabled ? 'text-slate-800 dark:text-slate-200' : 'text-slate-300 dark:text-slate-600 line-through'
                  )}>
                    {def.label}
                  </span>

                  {/* Type badge */}
                  {def.isNumber && col.enabled && (
                    <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      MAD
                    </span>
                  )}

                  {/* Position badge */}
                  <span className={cn(
                    'text-xs w-5 text-right font-mono flex-shrink-0',
                    col.enabled ? 'text-slate-300 dark:text-slate-600' : 'text-slate-200 dark:text-slate-700'
                  )}>
                    {idx + 1}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Preview of enabled column order */}
          {enabledJournalCols.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 font-medium">Aperçu de l&apos;ordre des colonnes</p>
              <div className="flex flex-wrap gap-1.5">
                {enabledJournalCols.map((col, i) => (
                  <span key={col.key} className="flex items-center gap-1 text-[11px] bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full font-medium">
                    <span className="text-teal-400 dark:text-teal-600">{i + 1}.</span>
                    {JOURNAL_COL_DEFS.find(d => d.key === col.key)!.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3 — format (hidden in journal mode, always Excel) */}
      <div className={cn('bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm', exportMode === 'journal' && 'hidden')}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center">3</span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('export.step3Title')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
        disabled={
          loading ||
          !canDo('export', role, removed) ||
          (exportMode === 'general' && selected.size === 0) ||
          (exportMode === 'journal' && enabledJournalCols.length === 0)
        }
        className={cn(
          'w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all',
          exportMode === 'journal'
            ? 'bg-teal-500 hover:bg-teal-600 shadow-sm shadow-teal-200 dark:shadow-none'
            : 'bg-primary-500 hover:bg-primary-600 shadow-sm shadow-primary-200 dark:shadow-none',
          'active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed'
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
            {exportMode === 'journal' ? ' (.xlsx)' : format === 'excel' ? ' (.xlsx)' : ' (.pdf)'}
          </>
        )}
      </button>

      {/* Summary chips */}
      {(exportMode === 'general' ? selected.size > 0 : enabledJournalCols.length > 0) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {exportMode === 'general'
            ? [...selected].map(k => (
                <span key={k} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {t(`export.entities.${k}`)}
                </span>
              ))
            : (
                <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/30 text-xs text-teal-600 dark:text-teal-400 font-medium border border-teal-200 dark:border-teal-800">
                  {enabledJournalCols.length} colonne{enabledJournalCols.length > 1 ? 's' : ''}
                </span>
              )
          }
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-500">
            {periodLabel(period, t, customFrom, customTo)}
          </span>
          {exportMode === 'general' && (
            <span className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium',
              format === 'excel' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
            )}>
              {format === 'excel' ? 'Excel' : 'PDF'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
