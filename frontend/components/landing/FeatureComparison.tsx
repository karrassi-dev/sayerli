'use client'

import { Check, X, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

type CellValue = boolean | 'partial'

const ROW_VALUES: { excel: CellValue; generic: CellValue; sayerli: CellValue }[] = [
  { excel: false,     generic: 'partial', sayerli: true },  // CRM clients (ICE, IF Fiscal)
  { excel: false,     generic: 'partial', sayerli: true },  // Devis multi-devises
  { excel: false,     generic: false,     sayerli: true },  // Bons de livraison
  { excel: false,     generic: 'partial', sayerli: true },  // Factures + reçu PDF
  { excel: false,     generic: false,     sayerli: true },  // Suivi paiements (partiel, acompte)
  { excel: false,     generic: 'partial', sayerli: true },  // Analytics temps réel
  { excel: false,     generic: false,     sayerli: true },  // Relances automatiques
  { excel: false,     generic: 'partial', sayerli: true },  // Multi-utilisateurs & rôles
  { excel: false,     generic: false,     sayerli: true },  // Catalogue de services
  { excel: false,     generic: false,     sayerli: true },  // Portail client
  { excel: false,     generic: 'partial', sayerli: true },  // Notifications & rappels
  { excel: 'partial', generic: false,     sayerli: true },  // Export Journal des Ventes
  { excel: false,     generic: false,     sayerli: true },  // Adapté marché marocain
]

function Cell({ value }: { value: CellValue }) {
  if (value === true) return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
      </div>
    </div>
  )
  if (value === 'partial') return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
        <Minus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      </div>
    </div>
  )
  return (
    <div className="flex justify-center">
      <div className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
        <X className="w-3.5 h-3.5 text-red-400 dark:text-red-500" />
      </div>
    </div>
  )
}

export function FeatureComparison() {
  const { t, tArray } = useTranslation()
  const { ref, visible } = useScrollAnimation()
  const features = tArray('comparison.features')

  return (
    <section ref={ref} className="py-28 bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
            {t('comparison.badge')}
          </span>
          <h2 className="section-title mb-4">{t('comparison.title')}</h2>
          <p className="section-sub">{t('comparison.sub')}</p>
        </div>

        <div className={cn('transition-all duration-700 delay-100', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <div className="card rounded-2xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="p-4 col-span-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('comparison.headers.feature')}
                </span>
              </div>
              {(['excel', 'generic', ''] as const).map((col, i) => (
                <div key={i} className={cn('p-4 text-center', i === 2 ? 'bg-gradient-to-b from-primary-600 to-primary-700' : '')}>
                  {i === 2 ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                        <span className="text-white font-black text-xs">S</span>
                      </div>
                      <span className="text-white font-black text-sm">{t('comparison.headers.sayerli')}</span>
                      <span className="text-xs text-primary-200 bg-primary-500/50 px-2 py-0.5 rounded-full">{t('comparison.recommended')}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {t(`comparison.headers.${col}`)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            {ROW_VALUES.map(({ excel, generic, sayerli }, i) => (
              <div
                key={i}
                className={cn('grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors', i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-900/50')}
              >
                <div className="p-3.5 sm:p-4 flex items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {features[i] || ''}
                  </span>
                </div>
                <div className="p-3.5 sm:p-4 flex items-center justify-center"><Cell value={excel} /></div>
                <div className="p-3.5 sm:p-4 flex items-center justify-center"><Cell value={generic} /></div>
                <div className="p-3.5 sm:p-4 flex items-center justify-center bg-primary-600/5 dark:bg-primary-600/10"><Cell value={sayerli} /></div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"><Check className="w-3 h-3 text-green-600 dark:text-green-400" /></div>
              {t('comparison.legend.available')}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center"><Minus className="w-3 h-3 text-amber-600 dark:text-amber-400" /></div>
              {t('comparison.legend.partial')}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center"><X className="w-3 h-3 text-red-400" /></div>
              {t('comparison.legend.unavailable')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
