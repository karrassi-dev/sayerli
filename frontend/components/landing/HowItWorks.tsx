'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { UserPlus, FileText, ThumbsUp, Truck, Receipt, BarChart3, Check, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const INTERVAL_MS = 4200

const STEPS = [
  { key: 'step1', icon: UserPlus,   color: '#6366f1', ring: 'rgba(99,102,241,0.25)',  num: '01' },
  { key: 'step2', icon: FileText,   color: '#14b8a6', ring: 'rgba(20,184,166,0.25)',  num: '02' },
  { key: 'step3', icon: ThumbsUp,   color: '#10b981', ring: 'rgba(16,185,129,0.25)',  num: '03' },
  { key: 'step4', icon: Truck,      color: '#f59e0b', ring: 'rgba(245,158,11,0.25)',  num: '04' },
  { key: 'step5', icon: Receipt,    color: '#8b5cf6', ring: 'rgba(139,92,246,0.25)',  num: '05' },
  { key: 'step6', icon: BarChart3,  color: '#06b6d4', ring: 'rgba(6,182,212,0.25)',   num: '06' },
] as const

/* ── Always-dark product mock per step ─────────────────────────────── */
function StepMock({ step }: { step: number }) {
  const d = {
    text:   'rgba(255,255,255,0.85)',
    muted:  'rgba(255,255,255,0.38)',
    dim:    'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.08)',
  }

  const Row = ({ label, value, check }: { label: string; value: string; check?: boolean }) => (
    <div className="rounded-lg px-3 py-2" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
      <div className="text-[10px] mb-0.5" style={{ color: d.muted }}>{label}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: d.text }}>{value}</span>
        {check && <Check className="w-3 h-3 flex-shrink-0" style={{ color: '#10b981' }} />}
      </div>
    </div>
  )

  const mocks = [
    /* ── 1. Créer le client ── */
    <div className="space-y-2.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold" style={{ color: d.text }}>Nouveau client</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(99,102,241,0.18)', color: '#818cf8' }}>ENTREPRISE</span>
      </div>
      <Row label="Nom complet"  value="Hassan Oujda"           check />
      <Row label="ICE"          value="001234567000012"         check />
      <Row label="IF Fiscal"    value="12345678"                check />
      <Row label="Email"        value="h.oujda@imprimerie.ma"          />
      <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white mt-1" style={{ background: '#6366f1' }}>
        + Ajouter le client
      </button>
    </div>,

    /* ── 2. Envoyer le devis ── */
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] font-mono mb-0.5" style={{ color: d.muted }}>DEV-2026-0052</div>
          <div className="text-sm font-bold" style={{ color: d.text }}>Atlas Marketing</div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(20,184,166,0.15)', color: '#2dd4bf' }}>Brouillon</span>
      </div>
      {[
        { desc: 'Design logo',         prix: '5 000' },
        { desc: 'Site vitrine',        prix: '12 000' },
        { desc: 'Réseaux sociaux ×3', prix: '7 000' },
      ].map(({ desc, prix }) => (
        <div key={desc} className="flex justify-between items-center text-xs py-1.5" style={{ borderBottom: `1px solid ${d.border}` }}>
          <span style={{ color: 'rgba(255,255,255,0.62)' }}>{desc}</span>
          <span className="font-semibold" style={{ color: d.text }}>{prix} MAD</span>
        </div>
      ))}
      <div className="flex justify-between items-center pt-1">
        <span className="text-xs" style={{ color: d.muted }}>Total TTC</span>
        <span className="text-base font-black" style={{ color: '#2dd4bf' }}>24 000 MAD</span>
      </div>
      <div className="flex gap-2 pt-1">
        <button className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: '#25d366', color: '#fff' }}>📱 WhatsApp</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ background: d.dim, color: 'rgba(255,255,255,0.6)', border: `1px solid ${d.border}` }}>✉ Email</button>
      </div>
    </div>,

    /* ── 3. Client accepte ── */
    <div className="space-y-3">
      <div className="flex flex-col items-center py-2">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(16,185,129,0.15)' }}>
          <span className="text-2xl">✓</span>
        </div>
        <div className="text-sm font-bold mb-1" style={{ color: '#10b981' }}>Devis accepté !</div>
        <div className="text-xs text-center" style={{ color: d.muted }}>Hassan Oujda vient d'accepter le devis</div>
      </div>
      <div className="rounded-xl p-3 space-y-1.5" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="flex justify-between text-xs">
          <span style={{ color: d.muted }}>Référence</span>
          <span className="font-semibold" style={{ color: d.text }}>DEV-2026-0052</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: d.muted }}>Montant</span>
          <span className="font-semibold" style={{ color: '#10b981' }}>24 000 MAD</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: d.muted }}>Accepté à</span>
          <span style={{ color: d.text }}>14:32</span>
        </div>
      </div>
      <button className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5" style={{ background: '#f59e0b', color: '#fff' }}>
        <Truck className="w-3.5 h-3.5" /> Créer le bon de livraison →
      </button>
    </div>,

    /* ── 4. Bon de livraison ── */
    <div className="space-y-2.5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] font-mono mb-0.5" style={{ color: d.muted }}>BL-2026-0018</div>
          <div className="text-sm font-bold" style={{ color: d.text }}>Atlas Marketing</div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>Envoyé</span>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: d.muted }}>Articles livrés</div>
      {['Design logo', 'Site vitrine', 'Réseaux sociaux'].map((item, i) => (
        <div key={item} className="flex items-center gap-2.5 py-1.5" style={{ borderBottom: `1px solid ${d.border}` }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
            <span className="text-[9px] font-bold" style={{ color: '#fbbf24' }}>{i + 1}</span>
          </div>
          <span className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{item}</span>
          <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10b981' }} />
        </div>
      ))}
      <button className="w-full py-2.5 rounded-xl text-xs font-bold mt-1" style={{ background: '#f59e0b', color: '#fff' }}>
        ✓ Marquer comme livré
      </button>
    </div>,

    /* ── 5. Convertir en facture ── */
    <div className="space-y-3">
      <div className="flex items-center gap-2 justify-center mb-2">
        <div className="px-3 py-2 rounded-xl text-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)' }}>
          <div className="text-[9px] mb-0.5" style={{ color: d.muted }}>Bon de livraison</div>
          <div className="text-xs font-bold" style={{ color: '#fbbf24' }}>BL-2026-0018</div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <ChevronRight className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          <span className="text-[9px] font-bold" style={{ color: '#8b5cf6' }}>1 clic</span>
        </div>
        <div className="px-3 py-2 rounded-xl text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.22)' }}>
          <div className="text-[9px] mb-0.5" style={{ color: d.muted }}>Facture</div>
          <div className="text-xs font-bold" style={{ color: '#a78bfa' }}>FAC-2026-0031</div>
        </div>
      </div>
      <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
        {[
          { l: 'Client',      v: 'Atlas Marketing' },
          { l: 'Lignes',      v: '3 lignes copiées ✓' },
          { l: 'Montant TTC', v: '24 000 MAD' },
          { l: 'Numéro',      v: 'FAC-2026-0031' },
        ].map(({ l, v }) => (
          <div key={l} className="flex items-center justify-between text-xs">
            <span style={{ color: d.muted }}>{l}</span>
            <span className="font-semibold" style={{ color: d.text }}>{v}</span>
          </div>
        ))}
      </div>
      <button className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5" style={{ background: '#8b5cf6', color: '#fff' }}>
        <Receipt className="w-3.5 h-3.5" /> Facture créée — zéro ressaisie ✓
      </button>
    </div>,

    /* ── 6. Encaisser & analyser ── */
    <div className="space-y-2.5">
      <div className="rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.2)' }}>
            <span className="text-xs" style={{ color: '#10b981' }}>✓</span>
          </div>
          <span className="text-sm font-bold" style={{ color: '#10b981' }}>+24 000 MAD encaissé</span>
        </div>
        <span className="text-[10px]" style={{ color: d.muted }}>FAC-2026-0031 · Virement bancaire</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { l: 'CA ce mois',    v: '84 200 MAD', c: '#10b981' },
          { l: 'Recouvrement',  v: '94%',        c: '#06b6d4' },
          { l: 'En attente',    v: '12 400 MAD', c: '#f59e0b' },
          { l: 'Clients actifs',v: '47',          c: '#8b5cf6' },
        ].map(({ l, v, c }) => (
          <div key={l} className="rounded-xl p-2.5" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
            <div className="text-[10px] mb-1" style={{ color: d.muted }}>{l}</div>
            <div className="text-sm font-black" style={{ color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1 h-10 px-1">
        {[38, 52, 41, 68, 55, 84].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? 'linear-gradient(to top, #06b6d4, #38bdf8)' : 'rgba(6,182,212,0.22)' }} />
        ))}
      </div>
    </div>,
  ]

  return mocks[step] ?? mocks[0]
}

/* ── Main component ──────────────────────────────────────────────────── */
export function HowItWorks() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)
  const [active, setActive] = useState(0)
  const [progKey, setProgKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(() => {
    setActive(p => (p + 1) % STEPS.length)
    setProgKey(k => k + 1)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, INTERVAL_MS)
  }, [advance])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  const selectStep = (i: number) => {
    setActive(i)
    setProgKey(k => k + 1)
    resetTimer()
  }

  const step = STEPS[active]

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #08090f, #0c0e14)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-20"
          style={{ background: `radial-gradient(ellipse, ${step.color}40 0%, transparent 70%)`, transition: 'background 0.6s ease' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-12 sm:mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full border text-sm font-semibold mb-5"
            style={{ background: `${step.color}15`, borderColor: `${step.color}35`, color: step.color, transition: 'all 0.4s ease' }}>
            {t('howItWorks.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            {t('howItWorks.title')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('howItWorks.sub')}
          </p>
        </div>

        {/* ── Mobile: horizontal step pills ── */}
        <div className="lg:hidden mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 w-max">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <button
                  key={s.key}
                  onClick={() => selectStep(i)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  style={active === i
                    ? { background: `${s.color}20`, border: `1px solid ${s.color}45`, color: s.color }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }
                  }
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {s.num}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Body ── */}
        <div className={cn('transition-all duration-700 delay-150', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

            {/* ── Left: step list (desktop only) ── */}
            <div className="hidden lg:flex flex-col gap-1 w-[260px] flex-shrink-0">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const isActive = active === i
                return (
                  <button
                    key={s.key}
                    onClick={() => selectStep(i)}
                    className="group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-200 w-full"
                    style={isActive
                      ? { background: `${s.color}12`, border: `1px solid ${s.color}30` }
                      : { background: 'transparent', border: '1px solid transparent' }
                    }
                  >
                    {/* Icon circle */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={isActive
                        ? { background: s.color, boxShadow: `0 0 12px ${s.color}50` }
                        : { background: 'rgba(255,255,255,0.06)' }
                      }
                    >
                      <Icon className="w-4 h-4" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold mb-0.5" style={{ color: isActive ? s.color : 'rgba(255,255,255,0.25)' }}>
                        {s.num}
                      </div>
                      <div className="text-sm font-semibold leading-snug truncate" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.45)' }}>
                        {t(`workflow.${s.key}.title`)}
                      </div>
                    </div>

                    {/* Active indicator dot */}
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{ background: isActive ? s.color : 'transparent' }} />
                  </button>
                )
              })}
            </div>

            {/* ── Right: product mock + description ── */}
            <div className="flex-1 w-full min-w-0">
              <div className="flex flex-col sm:flex-row lg:flex-row gap-5">

                {/* Product mock */}
                <div className="w-full sm:w-[280px] lg:w-[300px] flex-shrink-0">
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: '#0f1117',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${step.color}12`,
                      transition: 'box-shadow 0.5s ease',
                    }}
                  >
                    {/* Chrome bar */}
                    <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: '#181a22', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
                      <div className="flex-1 mx-2 rounded px-2 py-0.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>sayerli.com/dashboard</span>
                      </div>
                    </div>

                    {/* Step content — key triggers step-in animation on change */}
                    <div className="p-4 min-h-[280px] flex flex-col">
                      <div key={active} className="step-in flex-1">
                        <StepMock step={active} />
                      </div>
                    </div>

                    {/* Auto-progress bar */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', height: 2 }}>
                      <div
                        key={progKey}
                        className="prog-fill h-full rounded-full"
                        style={{ background: step.color, transition: 'background 0.4s ease' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Step info — desktop: right of mock, mobile: below mock */}
                <div className="flex flex-col justify-center py-2 sm:py-4">
                  {/* Step badge */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold mb-4 w-fit"
                    style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}30`, transition: 'all 0.4s ease' }}
                  >
                    <step.icon className="w-3 h-3" />
                    {step.num} / {String(STEPS.length).padStart(2, '0')}
                  </div>

                  {/* Title */}
                  <h3
                    key={`title-${active}`}
                    className="step-in text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3 leading-tight"
                  >
                    {t(`workflow.${step.key}.title`)}
                  </h3>

                  {/* Description */}
                  <p
                    key={`desc-${active}`}
                    className="step-in text-sm sm:text-base text-slate-400 leading-relaxed mb-6 max-w-sm"
                  >
                    {t(`workflow.${step.key}.desc`)}
                  </p>

                  {/* Step dots */}
                  <div className="flex gap-2">
                    {STEPS.map((s, i) => (
                      <button
                        key={s.key}
                        onClick={() => selectStep(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: active === i ? 24 : 8,
                          height: 8,
                          background: active === i ? step.color : 'rgba(255,255,255,0.15)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: current step info ── */}
        <div className="lg:hidden mt-5">
          <h3 key={`m-title-${active}`} className="step-in text-xl font-black text-white mb-2">
            {t(`workflow.${step.key}.title`)}
          </h3>
          <p key={`m-desc-${active}`} className="step-in text-sm text-slate-400 leading-relaxed mb-4">
            {t(`workflow.${step.key}.desc`)}
          </p>
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <button key={s.key} onClick={() => selectStep(i)} className="rounded-full transition-all duration-300"
                style={{ width: active === i ? 24 : 8, height: 8, background: active === i ? step.color : 'rgba(255,255,255,0.15)' }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
