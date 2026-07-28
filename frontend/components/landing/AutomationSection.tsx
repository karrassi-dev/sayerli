'use client'

import { Bell, FileText, CreditCard, Mail, Zap } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const ITEMS = [
  { key: 'item1', icon: Bell,       color: '#3b82f6', dotColor: '#3b82f6' },
  { key: 'item2', icon: FileText,   color: '#14b8a6', dotColor: '#14b8a6' },
  { key: 'item3', icon: CreditCard, color: '#8b5cf6', dotColor: '#8b5cf6' },
  { key: 'item4', icon: Mail,       color: '#f97316', dotColor: '#f97316' },
  { key: 'item5', icon: Zap,        color: '#f59e0b', dotColor: '#f59e0b' },
] as const

const TAG_COLORS: Record<string, string> = {
  item1: 'rgba(59,130,246,0.15)',
  item2: 'rgba(20,184,166,0.15)',
  item3: 'rgba(139,92,246,0.15)',
  item4: 'rgba(249,115,22,0.15)',
  item5: 'rgba(245,158,11,0.15)',
}

export function AutomationSection() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)

  return (
    <section ref={ref} className="py-16 sm:py-24 overflow-hidden bg-white dark:bg-[#07080f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-14 sm:mb-20 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
            {t('automation.badge')}
          </span>
          <h2 className="section-title mb-4">{t('automation.title')}</h2>
          <p className="section-sub">{t('automation.sub')}</p>
        </div>

        {/* ── Desktop: alternating timeline ── */}
        <div className="hidden lg:block relative">
          {/* Center vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.25) 15%, rgba(99,102,241,0.18) 85%, transparent)' }} />

          <div className="space-y-10">
            {ITEMS.map(({ key, icon: Icon, color, dotColor }, i) => {
              const isLeft = i % 2 === 0
              const delay = i * 110

              return (
                <div key={key} className="grid grid-cols-[1fr_64px_1fr] items-center gap-0">

                  {/* Left column */}
                  <div className="pr-8 flex justify-end">
                    {isLeft ? (
                      <div
                        className="w-full max-w-[380px] rounded-2xl p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                        style={{
                          animation: visible
                            ? `slideInLeft 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`
                            : 'none',
                        }}
                      >
                        <ItemContent
                          itemKey={key} icon={Icon} color={color} tagBg={TAG_COLORS[key]}
                          idx={i} t={t}
                        />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="flex justify-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-black z-10 relative flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                        boxShadow: `0 0 0 4px ${color}18, 0 0 20px ${color}30`,
                        animation: visible
                          ? `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay + 50}ms both`
                          : 'none',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="pl-8 flex justify-start">
                    {!isLeft ? (
                      <div
                        className="w-full max-w-[380px] rounded-2xl p-6 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                        style={{
                          animation: visible
                            ? `slideInRight 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`
                            : 'none',
                        }}
                      >
                        <ItemContent
                          itemKey={key} icon={Icon} color={color} tagBg={TAG_COLORS[key]}
                          idx={i} t={t}
                        />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        </div>

        {/* ── Mobile: single column with left border ── */}
        <div className="lg:hidden relative">
          {/* Left border line */}
          <div className="absolute left-5 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.3) 10%, rgba(99,102,241,0.2) 90%, transparent)' }} />

          <div className="space-y-6 pl-14">
            {ITEMS.map(({ key, icon: Icon, color }, i) => (
              <div key={key} className="relative">
                {/* Dot on the left line */}
                <div
                  className="absolute -left-[2.35rem] top-5 w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                    boxShadow: `0 0 0 3px ${color}18`,
                    animation: visible
                      ? `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 100 + 50}ms both`
                      : 'none',
                  }}
                >
                  {i + 1}
                </div>

                <div
                  className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none"
                  style={{
                    animation: visible
                      ? `slideInRight 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms both`
                      : 'none',
                  }}
                >
                  <ItemContent
                    itemKey={key} icon={Icon} color={color} tagBg={TAG_COLORS[key]}
                    idx={i} t={t}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── Card content shared between desktop and mobile ── */
function ItemContent({
  itemKey, icon: Icon, color, tagBg, idx, t,
}: {
  itemKey: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  tagBg: string
  idx: number
  t: (key: string) => string
}) {
  return (
    <>
      <div className="flex items-start gap-4 mb-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          style={{ background: `${color}18`, boxShadow: `0 0 0 1px ${color}22` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>

        {/* Title + tag */}
        <div className="min-w-0 pt-0.5">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
              {t(`automation.${itemKey}.title`)}
            </h3>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
              style={{ background: tagBg, color }}
            >
              {t(`automation.${itemKey}.tag`)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
        {t(`automation.${itemKey}.desc`)}
      </p>

      {/* Detail chips */}
      <div className="flex flex-wrap gap-2">
        {(['detail1', 'detail2', 'detail3'] as const).map(d => (
          <span
            key={d}
            className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
          >
            {t(`automation.${itemKey}.${d}`)}
          </span>
        ))}
      </div>

      {/* Active badge */}
      <div className="mt-4 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
          {t('automation.activeLabel')}
        </span>
      </div>
    </>
  )
}
