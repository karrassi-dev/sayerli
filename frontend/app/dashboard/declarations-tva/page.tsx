'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Calculator, AlertCircle, Download, Info, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { declarationsTvaApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const DeclarationTVAPDF = dynamic(() => import('@/components/pdf/DeclarationTVAPDF'), { ssr: false })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(m => m.PDFDownloadLink as any), { ssr: false })

// ── Types ─────────────────────────────────────────────────────────────────────

interface Groupe { taux: number; baseHT: number; tva: number; count: number }
interface Conversion { devise: string; count: number; totalOriginal: number; totalMAD: number; taux: number }
interface FacturePartielle { numero: string; totalTTC: number; montantPaye: number; restant: number; devise: string }

interface TVAResult {
  regime: string
  entrepriseNom: string
  periode: { debut: string; fin: string }
  groupes: Groupe[]
  totalBaseHT: number
  totalTVA: number
  hasMultiDevise: boolean
  devises: string[]
  tauxUtilises: { EUR?: number; USD?: number }
  conversions: Conversion[]
  facturesPartielles: FacturePartielle[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)
}

function isoDate(d: Date) {
  return d.toISOString().split('T')[0]
}

function periodPresets() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  const startOfMonth    = new Date(y, m, 1)
  const endOfMonth      = new Date(y, m + 1, 0)
  const startOfLastMonth = new Date(y, m - 1, 1)
  const endOfLastMonth   = new Date(y, m, 0)

  const qStart = new Date(y, Math.floor(m / 3) * 3, 1)
  const qEnd   = new Date(y, Math.floor(m / 3) * 3 + 3, 0)

  return {
    moisCourant:   { debut: isoDate(startOfMonth),    fin: isoDate(endOfMonth) },
    moisPrecedent: { debut: isoDate(startOfLastMonth), fin: isoDate(endOfLastMonth) },
    trimestre:     { debut: isoDate(qStart),           fin: isoDate(qEnd) },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DeclarationsTVAPage() {
  const { t } = useTranslation()
  const { entreprise } = useAuth()

  const presets = periodPresets()

  const [debut, setDebut] = useState(presets.moisCourant.debut)
  const [fin, setFin]     = useState(presets.moisCourant.fin)
  const [tauxEUR, setTauxEUR] = useState(entreprise?.tauxEUR ? String(entreprise.tauxEUR) : '')
  const [tauxUSD, setTauxUSD] = useState(entreprise?.tauxUSD ? String(entreprise.tauxUSD) : '')

  const [result, setResult]   = useState<TVAResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const inputClass = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'
  const labelClass = 'text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block'

  const calculer = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, string | number> = { debut, fin }
      if (tauxEUR) params.tauxEUR = parseFloat(tauxEUR)
      if (tauxUSD) params.tauxUSD = parseFloat(tauxUSD)
      const res = await declarationsTvaApi.calculer(params as { debut: string; fin: string; tauxEUR?: number; tauxUSD?: number })
      setResult(res.data?.data ?? res.data)
    } catch {
      setError('Erreur lors du calcul. Vérifiez les dates sélectionnées.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-calculate on mount with current month
  useEffect(() => { calculer() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync taux from entreprise on load
  useEffect(() => {
    if (entreprise?.tauxEUR && !tauxEUR) setTauxEUR(String(entreprise.tauxEUR))
    if (entreprise?.tauxUSD && !tauxUSD) setTauxUSD(String(entreprise.tauxUSD))
  }, [entreprise]) // eslint-disable-line react-hooks/exhaustive-deps

  const needsRates = result?.hasMultiDevise && (!tauxEUR || !tauxUSD)
  const ratesFromSettings = !!(entreprise?.tauxEUR || entreprise?.tauxUSD)

  const generatedAt = new Date().toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const pdfData = result ? {
    entrepriseNom: result.entrepriseNom,
    periode: result.periode,
    regime: result.regime,
    groupes: result.groupes,
    totalBaseHT: result.totalBaseHT,
    totalTVA: result.totalTVA,
    conversions: result.conversions,
    facturesPartielles: result.facturesPartielles,
    generatedAt,
  } : null

  return (
    <div className="space-y-5 pb-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{t('declarationsTva.title')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('declarationsTva.subtitle')}</p>
          </div>
        </div>
        {/* Download PDF button */}
        {pdfData && typeof window !== 'undefined' && (
          <PDFDownloadLink
            document={<DeclarationTVAPDF {...pdfData} />}
            fileName={`declaration-tva-${debut}-${fin}.pdf`}
          >
            {({ loading: pdfLoading }: { loading: boolean }) => (
              <button
                disabled={pdfLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-all"
              >
                {pdfLoading
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Download className="w-3.5 h-3.5" />}
                {pdfLoading ? t('declarationsTva.downloadLoading') : t('declarationsTva.downloadPdf')}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {/* ── Filters card ── */}
      <div className="card rounded-2xl p-5 space-y-4">
        {/* Regime badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('declarationsTva.regime')} :</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
            {entreprise?.regimeTVA === 'DEBITS' ? t('declarationsTva.debits') : t('declarationsTva.encaissements')}
          </span>
          <a href="/dashboard/settings?tab=language" className="text-xs text-slate-400 hover:text-primary-500 underline underline-offset-2 transition-colors">
            {t('declarationsTva.changeSettings')}
          </a>
        </div>

        {/* Period presets */}
        <div>
          <p className={labelClass}>{t('declarationsTva.periode')}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {(['moisCourant', 'moisPrecedent', 'trimestre'] as const).map(key => (
              <button
                key={key}
                onClick={() => { setDebut(presets[key].debut); setFin(presets[key].fin) }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                  debut === presets[key].debut && fin === presets[key].fin
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400',
                )}
              >
                {t(`declarationsTva.${key}`)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{t('declarationsTva.debut')}</label>
              <input type="date" value={debut} onChange={e => setDebut(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t('declarationsTva.fin')}</label>
              <input type="date" value={fin} onChange={e => setFin(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Multi-devise warning + rate inputs */}
        {(result?.hasMultiDevise || needsRates) && (
          <div className={cn(
            'rounded-xl border p-4 space-y-3',
            needsRates
              ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30'
              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40',
          )}>
            <div className="flex items-start gap-2">
              <AlertCircle className={cn('w-4 h-4 flex-shrink-0 mt-0.5', needsRates ? 'text-amber-500' : 'text-slate-400')} />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('declarationsTva.deviseWarningTitle')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('declarationsTva.deviseWarningDesc')}</p>
                {ratesFromSettings && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {t('declarationsTva.tauxSavedNote')}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result?.devises.includes('EUR') || !result ? (
                <div>
                  <label className={labelClass}>{t('declarationsTva.tauxEURLabel')} ___ MAD</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">1 EUR =</span>
                    <input
                      type="number" min="0.01" step="0.01" placeholder="10.85"
                      value={tauxEUR}
                      onChange={e => setTauxEUR(e.target.value)}
                      className={inputClass}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">MAD</span>
                  </div>
                </div>
              ) : null}
              {result?.devises.includes('USD') || !result ? (
                <div>
                  <label className={labelClass}>{t('declarationsTva.tauxUSDLabel')} ___ MAD</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">1 USD =</span>
                    <input
                      type="number" min="0.01" step="0.01" placeholder="9.90"
                      value={tauxUSD}
                      onChange={e => setTauxUSD(e.target.value)}
                      className={inputClass}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">MAD</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        <button
          onClick={calculer}
          disabled={loading || !debut || !fin}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 transition-all"
        >
          {loading
            ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <RefreshCw className="w-3.5 h-3.5" />}
          {loading ? t('declarationsTva.calculerLoading') : t('declarationsTva.calculer')}
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <div className="space-y-4">

          {/* Main TVA table */}
          <div className="card rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('declarationsTva.taux')}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {debut} → {fin} · {result.regime === 'DEBITS' ? t('declarationsTva.debits') : t('declarationsTva.encaissements')}
              </p>
            </div>

            {result.groupes.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">{t('declarationsTva.noData')}</div>
            ) : (
              <>
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-3 gap-4 px-5 py-2 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  <span>{t('declarationsTva.taux')}</span>
                  <span className="text-right">{t('declarationsTva.baseHT')}</span>
                  <span className="text-right">{t('declarationsTva.tvaCollectee')}</span>
                </div>

                {result.groupes.map((g, i) => (
                  <div key={g.taux} className={cn(
                    'grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 px-5 py-3 border-b border-slate-100 dark:border-slate-800',
                    i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-800/20',
                  )}>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {g.taux === 0 ? 'Exonéré' : `${g.taux}%`}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">{g.count} opération{g.count > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{fmt(g.baseHT)} MAD</p>
                      <p className="text-xs text-slate-400 sm:hidden">Base HT</p>
                    </div>
                    <div className="text-right col-span-2 sm:col-span-1">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(g.tva)} MAD</p>
                      <p className="text-xs text-slate-400 sm:hidden">TVA collectée</p>
                    </div>
                  </div>
                ))}

                {/* Total row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 px-5 py-4 bg-emerald-50 dark:bg-emerald-950/30 border-t-2 border-emerald-200 dark:border-emerald-800">
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{fmt(result.totalBaseHT)} MAD</p>
                    <p className="text-xs text-slate-500">{t('declarationsTva.totalBaseHT')}</p>
                  </div>
                  <div className="text-right col-span-2 sm:col-span-1">
                    <p className="text-base font-black text-emerald-700 dark:text-emerald-300">{fmt(result.totalTVA)} MAD</p>
                    <p className="text-xs text-slate-500">{t('declarationsTva.totalTVA')}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Currency conversions */}
          {result.conversions.length > 0 && (
            <div className="card rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('declarationsTva.conversionsTitle')}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{t('declarationsTva.tvaIndicatif')}</p>
              </div>
              {result.conversions.map(c => (
                <div key={c.devise} className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{c.devise}</span>
                    <span className="text-xs text-slate-400 ml-2">1 {c.devise} = {c.taux} MAD</span>
                    <span className="text-xs text-slate-400 ml-2">· {c.count} opération{c.count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{formatCurrency(c.totalOriginal, c.devise)}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{fmt(c.totalMAD)} MAD</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Partial invoices */}
          {result.facturesPartielles.length > 0 && (
            <div className="card rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-bold text-slate-900 dark:text-white text-sm">{t('declarationsTva.partiellesTitle')}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{t('declarationsTva.partiellesDesc')}</p>
              </div>
              <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-2 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                <span>{t('declarationsTva.numero')}</span>
                <span className="text-right">{t('declarationsTva.totalTTC')}</span>
                <span className="text-right">{t('declarationsTva.paye')}</span>
                <span className="text-right">{t('declarationsTva.restant')}</span>
              </div>
              {result.facturesPartielles.map((f, i) => (
                <div key={f.numero} className={cn(
                  'grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 px-5 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0',
                  i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-800/20',
                )}>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 col-span-2 sm:col-span-1">{f.numero}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 text-right">{formatCurrency(f.totalTTC, f.devise)}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 text-right">{formatCurrency(f.montantPaye, f.devise)}</p>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 text-right col-span-2 sm:col-span-1">{formatCurrency(f.restant, f.devise)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer note */}
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            {t('declarationsTva.generatedAt')} {generatedAt} · Document à titre indicatif — vérifiez auprès de votre comptable.
          </p>

        </div>
      )}
    </div>
  )
}
