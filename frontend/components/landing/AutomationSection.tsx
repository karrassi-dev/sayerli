'use client'

import { useState, useEffect } from 'react'
import { Bell, FileText, CreditCard, Mail, Zap, Check, ChevronRight, ExternalLink } from 'lucide-react'
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
  @keyframes aFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes aSlideR  { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes aSlideL  { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes aScaleIn { from{opacity:0;transform:scale(0.55)} to{opacity:1;transform:scale(1)} }
  @keyframes aPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
  @keyframes aCheck   { from{opacity:0;transform:scale(0.4) rotate(-15deg)} 60%{transform:scale(1.2) rotate(4deg)} to{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes aFly     { 0%{opacity:1;transform:translate(0,0) scale(1)} 65%{opacity:0.9;transform:translate(14px,-5px) scale(0.8)} 100%{opacity:0;transform:translate(32px,-11px) scale(0.55)} }
`

export function AutomationSection() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)
  const [active,   setActive]   = useState(0)
  const [paused,   setPaused]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [panelKey, setPanelKey] = useState(0)

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

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-white dark:bg-[#07080f]">
      <style>{KF}</style>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-12 sm:mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
            {t('automation.badge')}
          </span>
          <h2 className="section-title mb-4">{t('automation.title')}</h2>
          <p className="section-sub">{t('automation.sub')}</p>
        </div>

        {/* ── Interactive panel ── */}
        <div className={cn('transition-all duration-700 delay-150', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">

            {/* LEFT — list */}
            <div className="lg:w-[40%] space-y-2">
              {ITEMS.map(({ key, icon: Icon, color }, i) => (
                <button
                  key={key}
                  onClick={() => handleSelect(i)}
                  className={cn(
                    'w-full text-left rounded-2xl px-4 py-4 border transition-all duration-300 group',
                    active !== i && 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                  )}
                  style={active === i ? {
                    background: `linear-gradient(135deg, ${color}12, ${color}06)`,
                    borderColor: `${color}38`,
                    boxShadow: `0 4px 20px ${color}15`,
                  } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${color}18`, border: `1px solid ${color}28` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('font-semibold text-sm', active === i ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300')}>
                          {t(`automation.${key}.title`)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                          style={{ background: `${color}16`, color }}>
                          {t(`automation.${key}.tag`)}
                        </span>
                      </div>
                      {active === i && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {t(`automation.${key}.desc`)}
                        </p>
                      )}
                    </div>

                    <ChevronRight
                      className={cn('w-4 h-4 flex-shrink-0 transition-opacity', active === i ? 'opacity-100' : 'opacity-0')}
                      style={{ color }}
                    />
                  </div>

                  {/* Progress bar */}
                  {active === i && !paused && (
                    <div className="mt-3 h-[3px] rounded-full overflow-hidden" style={{ background: `${color}20` }}>
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, background: color, transition: 'width 16ms linear' }} />
                    </div>
                  )}
                  {active === i && paused && (
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
                      <span className="text-[10px] font-medium" style={{ color }}>{t('automation.activeLabel')}</span>
                    </div>
                  )}
                </button>
              ))}

              {paused && (
                <button
                  onClick={handleResume}
                  className="w-full text-center text-xs text-slate-400 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 py-1.5 transition-colors"
                >
                  ▶ {t('automation.resumeAuto')}
                </button>
              )}
            </div>

            {/* RIGHT — animated preview */}
            <div className="lg:flex-1">
              <div className="h-full min-h-[360px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden flex flex-col">

                {/* Window chrome */}
                <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <span className="ml-3 text-xs text-slate-400 dark:text-slate-500 font-mono flex-1 truncate">
                    sayerli.com — {t(`automation.${ITEMS[active].key}.title`)}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t('automation.activeLabel')}</span>
                  </div>
                </div>

                <div className="flex-1 p-5 sm:p-6 overflow-hidden">
                  <PreviewPanel activeIdx={active} panelKey={panelKey} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile pagination dots */}
          <div className="flex justify-center items-center gap-2 mt-5 lg:hidden">
            {ITEMS.map(({ color }, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: active === i ? 24 : 8, background: active === i ? color : '#cbd5e1' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Preview dispatcher — key forces remount on tab switch ── */
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

/* ── Preview 1: Rappels automatiques ── */
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
        <div
          key={row.ref}
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
          style={{ animation: `aFadeUp 0.4s ease ${row.d}ms both` }}
        >
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-slate-400">{row.ref}</div>
            <div className="text-sm font-semibold text-slate-800 dark:text-white">{row.client}</div>
            <span className="text-[10px] font-semibold text-red-500">⚡ En retard · {row.amt}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', fontSize: 16, animation: `aFly 0.5s ease ${row.d + 700}ms both` }}>✉️</span>
            <span className="text-[10px] font-bold text-emerald-500" style={{ animation: `aFadeIn 0.3s ease ${row.d + 1350}ms both` }}>✓ Relancé</span>
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

/* ── Preview 2: BL → Facture ── */
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

/* ── Preview 3: Suivi paiements ── */
function Preview3() {
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
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
            className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700"
            style={{ animation: `aFadeUp 0.35s ease ${p.d}ms both` }}
          >
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

      <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50"
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

/* ── Preview 4: Portail client ── */
function Preview4() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        style={{ animation: 'aFadeUp 0.4s ease 100ms both' }}>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate flex-1">lien.sayerli.com/portal/aml-t3x9k</span>
        <span className="text-[10px] font-semibold text-orange-500 flex-shrink-0">Copié ✓</span>
      </div>

      <div className="rounded-xl border-2 border-orange-200 dark:border-orange-800/40 bg-white dark:bg-slate-800/60 overflow-hidden"
        style={{ animation: 'aFadeUp 0.4s ease 500ms both' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-500">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black text-white">A</div>
          <span className="text-xs font-bold text-white">Portail — Amal Tech SARL</span>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
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

          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50"
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

/* ── Preview 5: Catalogue de services ── */
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
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50">
          + Depuis catalogue
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
            style={{ animation: `aSlideR 0.4s ease ${item.d}ms both` }}
          >
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

      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700"
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
