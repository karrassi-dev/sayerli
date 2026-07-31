'use client'

import { useState, useEffect } from 'react'
import { Bell, FileText, CreditCard, Mail, Zap, Check, ExternalLink } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const AUTO_MS = 4500

const ITEMS = [
  { key: 'item1', icon: Bell,       color: '#3b82f6' },
  { key: 'item2', icon: FileText,   color: '#14b8a6' },
  { key: 'item3', icon: CreditCard, color: '#8b5cf6' },
  { key: 'item4', icon: Mail,       color: '#f97316' },
  { key: 'item5', icon: Zap,        color: '#f59e0b' },
] as const

const KF = `
  @keyframes aFadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes aSlideR  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes aSlideL  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes aScaleIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  @keyframes aPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
  @keyframes aCheck   { from{opacity:0;transform:scale(0.3) rotate(-20deg)} 60%{transform:scale(1.25) rotate(5deg)} to{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes aFly     { 0%{opacity:1;transform:translate(0,0) scale(1)} 65%{opacity:0.9;transform:translate(16px,-6px) scale(0.75)} 100%{opacity:0;transform:translate(36px,-14px) scale(0.5)} }
  @keyframes aOrbDrift{ 0%,100%{transform:translate(0,0)} 33%{transform:translate(14px,-12px)} 66%{transform:translate(-10px,14px)} }
`

/* ─────────────────────────────────────────────────────────
   Main section
───────────────────────────────────────────────────────── */
export function AutomationSection() {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const { ref, visible } = useScrollAnimation(0.05)

  const [mounted,  setMounted]  = useState(false)
  const [active,   setActive]   = useState(0)
  const [paused,   setPaused]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme !== 'light'

  /* Auto-cycle */
  useEffect(() => {
    if (!visible || paused) return
    setProgress(0)
    const start = Date.now()
    const tick = setInterval(() => {
      const pct = ((Date.now() - start) / AUTO_MS) * 100
      if (pct >= 100) {
        setActive(a => (a + 1) % ITEMS.length)
        setPanelKey(k => k + 1)
        clearInterval(tick)
      } else {
        setProgress(pct)
      }
    }, 16)
    return () => clearInterval(tick)
  }, [active, paused, visible])

  const handleSelect = (i: number) => {
    if (i !== active) { setActive(i); setPanelKey(k => k + 1) }
    setPaused(true)
  }
  const handleResume = () => { setPaused(false); setPanelKey(k => k + 1) }

  const color      = ITEMS[active].color
  const ActiveIcon = ITEMS[active].icon
  const RING_R     = 14
  const RING_C     = 2 * Math.PI * RING_R

  /* ── Theme tokens ── */
  const bg        = isDark ? '#07080f' : '#f4f6ff'
  const textMain  = isDark ? '#ffffff' : '#0f172a'
  const textSub   = isDark ? 'rgba(148,163,184,0.85)' : 'rgba(71,85,105,0.9)'
  const textMuted = isDark ? 'rgba(100,116,139,0.6)'  : 'rgba(100,116,139,0.55)'

  const cardActiveBg  = isDark ? `linear-gradient(135deg, ${color}16, ${color}07)` : `linear-gradient(135deg, ${color}0d, ${color}05)`
  const cardIdleBg    = isDark ? 'rgba(255,255,255,0.022)' : 'rgba(255,255,255,0.75)'
  const cardActiveBdr = isDark ? `${color}28` : `${color}32`
  const cardIdleBdr   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.09)'

  const panelBg  = isDark ? 'rgba(255,255,255,0.028)' : 'rgba(255,255,255,0.95)'
  const panelBdr = isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(15,23,42,0.09)'
  const panelSep = isDark ? 'rgba(255,255,255,0.05)'  : 'rgba(15,23,42,0.06)'
  const panelShadow = isDark
    ? `0 0 0 1px rgba(255,255,255,0.03), 0 32px 90px rgba(0,0,0,0.55), 0 0 70px ${color}18`
    : `0 4px 6px -1px rgba(15,23,42,0.07), 0 12px 48px rgba(15,23,42,0.09), 0 0 50px ${color}10`

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: bg }}
    >
      <style>{KF}</style>

      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0" style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)'
            : 'linear-gradient(rgba(99,102,241,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.045) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        <div className="absolute top-1/3 left-1/5 w-[520px] h-[520px] rounded-full blur-[130px]"
          style={{ background: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.05)', animation: 'aOrbDrift 14s ease-in-out infinite' }} />
        <div className="absolute bottom-1/3 right-1/5 w-[420px] h-[420px] rounded-full blur-[110px]"
          style={{ background: isDark ? 'rgba(139,92,246,0.07)' : 'rgba(139,92,246,0.04)', animation: 'aOrbDrift 18s ease-in-out infinite 5s' }} />
        {/* Active-color reactive glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[220px] rounded-full blur-[120px]"
          style={{ background: `${color}${isDark ? '0c' : '07'}`, transition: 'background 0.9s ease' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-16 sm:mb-20 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full" style={{
            background: isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${isDark ? 'rgba(245,158,11,0.22)' : 'rgba(245,158,11,0.2)'}`,
          }}>
            <span style={{ color: isDark ? '#fbbf24' : '#d97706', fontSize: 11 }}>✦</span>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: isDark ? '#fbbf24' : '#d97706' }}>
              {t('automation.badge')}
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-black tracking-tight leading-[1.08] mb-5" style={{ fontSize: 'clamp(1.9rem,4vw,3.1rem)' }}>
            <span style={{ color: textMain }}>{t('automation.titleLine1')} </span>
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #fb923c 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {t('automation.titleLine2')}
            </span>
          </h2>

          <p style={{ fontSize: 16, color: textSub, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            {t('automation.sub')}
          </p>
        </div>

        {/* ── Interactive panel ── */}
        <div className={cn('transition-all duration-700 delay-200', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <div className="flex flex-col lg:flex-row gap-5">

            {/* ── LEFT: Premium stepper ── */}
            <div className="lg:w-[42%] flex flex-col gap-2">
              {ITEMS.map(({ key, icon: Icon, color: c }, i) => {
                const isActive = active === i
                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(i)}
                    className="relative w-full text-left rounded-2xl overflow-hidden transition-all duration-300 group"
                    style={{
                      background: isActive ? cardActiveBg : cardIdleBg,
                      border: `1px solid ${isActive ? cardActiveBdr : cardIdleBdr}`,
                      boxShadow: isActive
                        ? isDark ? `0 0 0 1px ${c}18, 0 8px 32px ${c}14` : `0 0 0 1px ${c}22, 0 4px 24px ${c}12`
                        : 'none',
                    }}
                  >
                    {/* Accent left bar */}
                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                        style={{ background: `linear-gradient(to bottom, ${c}, ${c}50)` }} />
                    )}

                    <div className="px-4 py-3.5">
                      <div className="flex items-center gap-3">

                        {/* Progress ring */}
                        <div className="relative flex-shrink-0 w-9 h-9">
                          {isActive && !paused && (
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r={RING_R} fill="none" stroke={`${c}22`} strokeWidth="2.5" />
                              <circle cx="18" cy="18" r={RING_R} fill="none" stroke={c} strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray={RING_C}
                                strokeDashoffset={RING_C * (1 - progress / 100)}
                                style={{ transition: 'stroke-dashoffset 16ms linear' }}
                              />
                            </svg>
                          )}
                          <div className="absolute inset-[5px] rounded-full flex items-center justify-center" style={{
                            background: isActive ? `${c}22` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
                            border: `1px solid ${isActive ? c + '38' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
                          }}>
                            <Icon className="w-3.5 h-3.5" style={{ color: isActive ? c : isDark ? 'rgba(100,116,139,0.6)' : 'rgba(100,116,139,0.5)' }} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span style={{
                              fontSize: 13, fontWeight: 700,
                              color: isActive ? textMain : isDark ? 'rgba(148,163,184,0.65)' : 'rgba(71,85,105,0.75)',
                            }}>
                              {t(`automation.${key}.title`)}
                            </span>
                            <span style={{
                              fontSize: 9, fontWeight: 800, letterSpacing: '0.04em',
                              padding: '2px 8px', borderRadius: 20,
                              background: `${c}18`, color: c, border: `1px solid ${c}28`,
                            }}>
                              {t(`automation.${key}.tag`)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded content */}
                      {isActive && (
                        <div className="mt-3 pl-12" style={{ animation: 'aFadeUp 0.3s ease both' }}>
                          <p style={{ fontSize: 12, lineHeight: 1.65, marginBottom: 10, color: isDark ? 'rgba(148,163,184,0.78)' : 'rgba(71,85,105,0.82)' }}>
                            {t(`automation.${key}.desc`)}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(['detail1', 'detail2', 'detail3'] as const).map(d => (
                              <span key={d} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                fontSize: 10, fontWeight: 600,
                                padding: '3px 10px', borderRadius: 8,
                                background: `${c}12`, color: c, border: `1px solid ${c}22`,
                              }}>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: c, flexShrink: 0 }} />
                                {t(`automation.${key}.${d}`)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}

              {paused && (
                <button onClick={handleResume} style={{
                  fontSize: 11, textAlign: 'center', padding: '6px 0',
                  color: textMuted, transition: 'color 0.2s',
                }}>
                  ▶ {t('automation.resumeAuto')}
                </button>
              )}
            </div>

            {/* ── RIGHT: Premium glass preview ── */}
            <div className="lg:flex-1">
              <div
                className="relative h-full min-h-[440px] rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: panelBg,
                  border: `1px solid ${panelBdr}`,
                  backdropFilter: 'blur(24px)',
                  boxShadow: panelShadow,
                  transition: 'box-shadow 0.7s ease',
                }}
              >
                {/* Top accent gradient strip */}
                <div className="flex-shrink-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, ${color}, ${color}65, transparent 75%)`, transition: 'background 0.5s' }} />

                {/* Panel header row */}
                <div className="flex-shrink-0 flex items-center justify-between px-5 py-3"
                  style={{ borderBottom: `1px solid ${panelSep}` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}22`, border: `1px solid ${color}38` }}>
                      <ActiveIcon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? 'rgba(226,232,240,0.85)' : 'rgba(15,23,42,0.8)' }}>
                      {t(`automation.${ITEMS[active].key}.title`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#34d399' : '#059669' }}>
                      {t('automation.activeLabel')}
                    </span>
                  </div>
                </div>

                {/* Animated preview content */}
                <div className="flex-1 p-5 sm:p-6 overflow-hidden">
                  <PreviewPanel activeIdx={active} panelKey={panelKey} />
                </div>

                {/* Ambient corner glow */}
                <div className="absolute bottom-0 right-0 w-56 h-56 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 80% 80%, ${color}22, transparent 65%)`, transition: 'background 0.5s' }} />
              </div>
            </div>
          </div>

          {/* Mobile pagination dots */}
          <div className="flex justify-center items-center gap-2 mt-5 lg:hidden">
            {ITEMS.map(({ color: c }, i) => (
              <button key={i} onClick={() => handleSelect(i)} style={{
                width: active === i ? 24 : 8, height: 8, borderRadius: 4,
                background: active === i ? c : isDark ? 'rgba(100,116,139,0.25)' : 'rgba(100,116,139,0.2)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   Preview dispatcher — key forces remount on tab switch
───────────────────────────────────────────────────────── */
function PreviewPanel({ activeIdx, panelKey }: { activeIdx: number; panelKey: number }) {
  return (
    <div className="h-full">
      {activeIdx === 0 && <Preview1 key={panelKey} />}
      {activeIdx === 1 && <Preview2 key={panelKey} />}
      {activeIdx === 2 && <Preview3 key={panelKey} />}
      {activeIdx === 3 && <Preview4 key={panelKey} />}
      {activeIdx === 4 && <Preview5 key={panelKey} />}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Preview 1 — Rappels automatiques
───────────────────────────────────────────────────────── */
function Preview1() {
  const rows = [
    { ref: 'FAC-2026-041', client: 'Atlas Corp',   amt: '8 400 MAD',  d: 200  },
    { ref: 'FAC-2026-038', client: 'Maroc Invest', amt: '12 600 MAD', d: 900  },
    { ref: 'FAC-2026-035', client: 'Amal Tech',    amt: '5 200 MAD',  d: 1600 },
  ]
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1" style={{ animation: 'aFadeIn 0.4s ease both' }}>
        <Bell className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">3 factures en retard détectées</span>
      </div>
      {rows.map(row => (
        <div key={row.ref}
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60"
          style={{ animation: `aFadeUp 0.4s ease ${row.d}ms both` }}>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-slate-400">{row.ref}</div>
            <div className="text-sm font-semibold text-slate-800 dark:text-white">{row.client}</div>
            <span className="text-[10px] font-semibold text-red-500">⚡ En retard · {row.amt}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', fontSize: 16, animation: `aFly 0.5s ease ${row.d + 700}ms both` }}>✉️</span>
            <span className="text-[10px] font-bold text-emerald-500" style={{ animation: `aFadeIn 0.3s ease ${row.d + 1400}ms both` }}>✓ Relancé</span>
          </div>
        </div>
      ))}
      <p className="pt-1 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400"
        style={{ animation: 'aFadeIn 0.4s ease 3.4s both' }}>
        ✅ 3 rappels envoyés automatiquement à 07:00
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Preview 2 — BL → Facture
───────────────────────────────────────────────────────── */
function Preview2() {
  return (
    <div className="flex flex-col justify-center h-full gap-5">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 p-4 w-40"
          style={{ animation: 'aSlideR 0.5s ease 200ms both' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">📦</span>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">Bon de Livraison</span>
          </div>
          <div className="text-[10px] text-amber-600/60 font-mono mb-1">BL-2026-0048</div>
          <div className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-2">15 600 MAD</div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">✓ Livré</span>
        </div>

        <div className="flex flex-col items-center gap-1" style={{ animation: 'aScaleIn 0.4s ease 900ms both' }}>
          <span className="text-[10px] font-bold text-teal-500">1 clic</span>
          <div className="flex items-center">
            <div className="h-0.5 w-8 bg-teal-400 dark:bg-teal-500" />
            <div className="border-l-[7px] border-l-teal-400 dark:border-l-teal-500 border-y-[4px] border-y-transparent" />
          </div>
          <span className="text-[10px] text-slate-400">auto-converti</span>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 p-4 w-40"
          style={{ animation: 'aSlideL 0.5s ease 1200ms both' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">📋</span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">Facture</span>
          </div>
          <div className="text-[10px] text-emerald-600/60 font-mono mb-1">FAC-2026-0048</div>
          <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-2">15 600 MAD</div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">✉ Envoyée</span>
        </div>
      </div>

      <div className="text-center" style={{ animation: 'aFadeUp 0.4s ease 2s both' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">Lignes & prix reportés automatiquement — Zéro ressaisie</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Preview 3 — Suivi paiements
───────────────────────────────────────────────────────── */
function Preview3() {
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40"
        style={{ animation: 'aFadeUp 0.4s ease 100ms both' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[10px] font-mono text-slate-400 mb-0.5">FAC-2026-0048</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">Amal Tech SARL</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-900 dark:text-white">15 600 MAD</div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
              style={{ animation: 'aScaleIn 0.4s ease 2.4s both' }}>
              ✓ Payée
            </span>
          </div>
        </div>
        {[
          { label: 'Acompte 50%', amt: '7 800 MAD', d: 500  },
          { label: 'Solde final',  amt: '7 800 MAD', d: 1300 },
        ].map(p => (
          <div key={p.label}
            className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700/60"
            style={{ animation: `aFadeUp 0.35s ease ${p.d}ms both` }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center"
                style={{ animation: `aCheck 0.4s ease ${p.d + 500}ms both` }}>
                <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-300">{p.label}</span>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{p.amt}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40"
        style={{ animation: 'aFadeUp 0.4s ease 2.6s both' }}>
        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-sm flex-shrink-0">🧾</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-purple-700 dark:text-purple-300">Reçu de paiement généré</div>
          <div className="text-[10px] text-purple-500/70">Envoyé à client@amaltech.ma</div>
        </div>
        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Preview 4 — Portail client
───────────────────────────────────────────────────────── */
function Preview4() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
        style={{ animation: 'aFadeUp 0.4s ease 100ms both' }}>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate flex-1">lien.sayerli.com/portal/aml-t3x9k</span>
        <span className="text-[10px] font-semibold text-orange-500 flex-shrink-0">Copié ✓</span>
      </div>

      <div className="rounded-xl border-2 border-orange-200 dark:border-orange-800/40 bg-white dark:bg-slate-800/50 overflow-hidden"
        style={{ animation: 'aFadeUp 0.4s ease 500ms both' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-500">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black text-white">A</div>
          <span className="text-xs font-bold text-white">Portail — Amal Tech SARL</span>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50"
            style={{ animation: 'aFadeUp 0.3s ease 900ms both' }}>
            <div>
              <div className="text-[10px] font-mono text-slate-400">DEV-2026-0048</div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">15 600 MAD</div>
            </div>
            <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-orange-500 text-white cursor-default"
              style={{ animation: 'aPulse 1.5s ease 1.5s infinite' }}>
              Accepter →
            </button>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/40"
            style={{ animation: 'aFadeUp 0.4s ease 2.6s both' }}>
            <span className="text-base flex-shrink-0">🎉</span>
            <div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Devis accepté par le client</div>
              <div className="text-[10px] text-emerald-600/70">Notification reçue instantanément</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Preview 5 — Catalogue de services
───────────────────────────────────────────────────────── */
function Preview5() {
  const items = [
    { name: 'Consulting Web',  price: '3 500 MAD', unit: 'jour',    d: 300  },
    { name: 'Formation React', price: '2 100 MAD', unit: 'session', d: 900  },
    { name: 'Hébergement VPS', price: '500 MAD',   unit: 'mois',    d: 1500 },
  ]
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between" style={{ animation: 'aFadeIn 0.4s ease both' }}>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Nouveau devis</span>
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/40">
          + Depuis catalogue
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.name}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60"
            style={{ animation: `aSlideR 0.4s ease ${item.d}ms both` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-[10px] font-black text-amber-600 dark:text-amber-400">
                {i + 1}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-white">{item.name}</div>
                <div className="text-[10px] text-slate-400">{item.unit}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.price}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60"
        style={{ animation: 'aFadeUp 0.4s ease 2.2s both' }}>
        <span className="text-xs text-slate-500 dark:text-slate-400">Total HT</span>
        <span className="text-sm font-black text-slate-900 dark:text-white">6 100 MAD</span>
      </div>

      <div style={{ animation: 'aFadeUp 0.4s ease 2.6s both' }}>
        <div className="py-2 text-center rounded-xl bg-amber-500 text-white text-xs font-bold cursor-default">
          ⚡ Devis prêt à envoyer en 1 clic
        </div>
      </div>
    </div>
  )
}
