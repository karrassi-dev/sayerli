'use client'

import { Check, X, Minus, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

type CellValue = boolean | 'partial'

const ROW_VALUES: { excel: CellValue; generic: CellValue; sayerli: CellValue }[] = [
  { excel: false,     generic: 'partial', sayerli: true },
  { excel: false,     generic: 'partial', sayerli: true },
  { excel: false,     generic: false,     sayerli: true },
  { excel: false,     generic: 'partial', sayerli: true },
  { excel: false,     generic: false,     sayerli: true },
  { excel: false,     generic: 'partial', sayerli: true },
  { excel: false,     generic: false,     sayerli: true },
  { excel: false,     generic: 'partial', sayerli: true },
  { excel: false,     generic: false,     sayerli: true },
  { excel: false,     generic: false,     sayerli: true },
  { excel: false,     generic: 'partial', sayerli: true },
  { excel: 'partial', generic: false,     sayerli: true },
  { excel: false,     generic: false,     sayerli: true },
]

function Cell({ value, isSayerli }: { value: CellValue; isSayerli?: boolean }) {
  if (value === true) return (
    <div className="flex justify-center">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center"
        style={isSayerli
          ? { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }
          : undefined}
      >
        <Check
          className="w-3.5 h-3.5"
          style={{ color: isSayerli ? '#818cf8' : undefined }}
          color={!isSayerli ? '#22c55e' : undefined}
        />
      </div>
    </div>
  )
  if (value === 'partial') return (
    <div className="flex justify-center">
      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
        <Minus className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
      </div>
    </div>
  )
  return (
    <div className="flex justify-center">
      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      </div>
    </div>
  )
}

export function FeatureComparison() {
  const { t, tArray } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)
  const features = tArray('comparison.features')

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-50 dark:bg-[#07080f]"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={cn(
            'text-center mb-14 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-5">
            <Zap className="w-3.5 h-3.5" />
            {t('comparison.badge')}
          </span>
          <h2 className="section-title mb-4">{t('comparison.title')}</h2>
          <p className="section-sub">{t('comparison.sub')}</p>
        </div>

        {/* Table */}
        <div
          className={cn('transition-all duration-700 delay-100', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}
        >
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div
              className="rounded-2xl overflow-hidden min-w-[540px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 8px 40px rgba(0,0,0,0.07)' }}
            >

              {/* Table header */}
              <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800">
                {/* Feature label column */}
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('comparison.headers.feature')}
                  </span>
                </div>

                {/* Excel */}
                <div className="px-3 py-4 text-center bg-slate-50 dark:bg-slate-800/60 border-s border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {t('comparison.headers.excel')}
                  </span>
                </div>

                {/* Generic tools */}
                <div className="px-3 py-4 text-center bg-slate-50 dark:bg-slate-800/60 border-s border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {t('comparison.headers.generic')}
                  </span>
                </div>

                {/* Sayerli — highlighted */}
                <div
                  className="px-3 py-4 text-center border-s border-indigo-400/30"
                  style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.15), rgba(99,102,241,0.08))' }}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center shadow-md shadow-primary-500/30">
                      <span className="text-white font-black text-sm">S</span>
                    </div>
                    <span className="text-sm font-black text-primary-600 dark:text-primary-400">
                      {t('comparison.headers.sayerli')}
                    </span>
                    <span className="text-[10px] font-bold text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-full border border-primary-200 dark:border-primary-800">
                      {t('comparison.recommended')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rows */}
              {ROW_VALUES.map(({ excel, generic, sayerli }, i) => (
                <div
                  key={i}
                  className={cn(
                    'grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/80 last:border-0',
                    'hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors duration-150',
                    i % 2 !== 0 ? 'bg-slate-50/50 dark:bg-slate-800/20' : 'bg-white dark:bg-slate-900',
                  )}
                  style={{
                    animation: visible
                      ? `flipInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${120 + i * 40}ms both`
                      : 'none',
                  }}
                >
                  {/* Feature name */}
                  <div className="px-5 py-3.5 flex items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {features[i] || ''}
                    </span>
                  </div>

                  {/* Excel cell */}
                  <div className="py-3.5 flex items-center justify-center border-s border-slate-100 dark:border-slate-800/60">
                    <Cell value={excel} />
                  </div>

                  {/* Generic cell */}
                  <div className="py-3.5 flex items-center justify-center border-s border-slate-100 dark:border-slate-800/60">
                    <Cell value={generic} />
                  </div>

                  {/* Sayerli cell — highlighted column */}
                  <div
                    className="py-3.5 flex items-center justify-center border-s border-indigo-400/20"
                    style={{ background: 'rgba(99,102,241,0.05)' }}
                  >
                    <Cell value={sayerli} isSayerli />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-5 mt-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                {t('comparison.legend.available')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Minus className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                </div>
                {t('comparison.legend.partial')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <X className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                </div>
                {t('comparison.legend.unavailable')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
