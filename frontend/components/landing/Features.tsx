'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Users, FileText, Truck, Receipt, CreditCard,
  BarChart3, UserCog, Globe, BookOpen, Bell, Layers, Check,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const INTERVAL_MS = 3800

const FEATURES = [
  { key: 'crm',           icon: Users,      color: '#3b82f6', num: '01' },
  { key: 'devis',         icon: FileText,   color: '#14b8a6', num: '02' },
  { key: 'bonsLivraison', icon: Truck,      color: '#f59e0b', num: '03' },
  { key: 'factures',      icon: Receipt,    color: '#8b5cf6', num: '04' },
  { key: 'paiements',     icon: CreditCard, color: '#f97316', num: '05' },
  { key: 'analytics',     icon: BarChart3,  color: '#ec4899', num: '06' },
  { key: 'team',          icon: UserCog,    color: '#64748b', num: '07' },
  { key: 'portal',        icon: Globe,      color: '#6366f1', num: '08' },
  { key: 'catalogue',     icon: BookOpen,   color: '#22c55e', num: '09' },
  { key: 'relances',      icon: Bell,       color: '#ef4444', num: '10' },
] as const

// ── Always-dark mini product mocks ───────────────────────────────────
const D = {
  bg:     '#0d0f18',
  card:   'rgba(255,255,255,0.055)',
  border: 'rgba(255,255,255,0.08)',
  text:   'rgba(255,255,255,0.85)',
  muted:  'rgba(255,255,255,0.36)',
  dim:    'rgba(255,255,255,0.04)',
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${D.border}` }}>
      <span className="text-[10px]" style={{ color: D.muted }}>{label}</span>
      <span className="text-[10px] font-semibold" style={{ color: color ?? D.text }}>{value}</span>
    </div>
  )
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>
      {label}
    </span>
  )
}

function FeatureMock({ featureKey, color }: { featureKey: string; color: string }) {
  const barData = [38, 52, 44, 67, 58, 78, 65, 89]
  const maxBar = Math.max(...barData)

  const mocks: Record<string, React.ReactNode> = {

    crm: (
      <div className="space-y-2.5">
        <div className="rounded-xl p-3" style={{ background: D.card, border: `1px solid ${color}25` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold" style={{ color: D.text }}>Hassan Oujda</span>
            <Pill label="ENTREPRISE" color={color} />
          </div>
          <Row label="ICE" value="001234567000012" />
          <Row label="IF Fiscal" value="12345678" />
          <Row label="Email" value="h.oujda@express.ma" />
        </div>
        <div className="space-y-1.5">
          {[
            { name: 'Boutique Rachidi', type: 'PARTICULIER', c: '#8b5cf6' },
            { name: 'Studio Design',    type: 'FREELANCE',   c: '#22c55e' },
          ].map(({ name, type, c }) => (
            <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: D.card, border: `1px solid ${D.border}` }}>
              <span className="text-[10px] font-medium" style={{ color: D.text }}>{name}</span>
              <Pill label={type} color={c} />
            </div>
          ))}
        </div>
      </div>
    ),

    devis: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono mb-0.5" style={{ color: D.muted }}>DEV-2026-0042</div>
            <div className="text-xs font-bold" style={{ color: D.text }}>Atlas Marketing</div>
          </div>
          <Pill label="En attente" color="#f59e0b" />
        </div>
        <div className="space-y-1" style={{ borderTop: `1px solid ${D.border}`, paddingTop: 8 }}>
          {[
            { desc: 'Design logo',        prix: '5 000' },
            { desc: 'Site vitrine',        prix: '12 000' },
            { desc: 'Réseaux sociaux ×3', prix: '7 000' },
          ].map(({ desc, prix }) => (
            <div key={desc} className="flex justify-between items-center text-[10px] py-0.5">
              <span style={{ color: D.muted }}>{desc}</span>
              <span className="font-semibold" style={{ color: D.text }}>{prix} MAD</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-1" style={{ borderTop: `1px solid ${D.border}` }}>
          <span className="text-[10px]" style={{ color: D.muted }}>Total TTC</span>
          <span className="text-sm font-black" style={{ color }}>24 000 MAD</span>
        </div>
        <div className="flex gap-2 pt-1">
          <button className="flex-1 py-1.5 rounded-lg text-[10px] font-bold" style={{ background: '#25d366', color: '#fff' }}>📱 WhatsApp</button>
          <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold" style={{ background: D.card, color: D.muted, border: `1px solid ${D.border}` }}>✉ Email</button>
        </div>
      </div>
    ),

    bonsLivraison: (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono mb-0.5" style={{ color: D.muted }}>BL-2026-0018</div>
            <div className="text-xs font-bold" style={{ color: D.text }}>Atlas Marketing</div>
          </div>
          <Pill label="Envoyé" color={color} />
        </div>
        <div className="space-y-2">
          {['Design logo', 'Site vitrine', 'Réseaux sociaux ×3'].map((item, i) => (
            <div key={item} className="flex items-center gap-2.5 py-1.5" style={{ borderBottom: `1px solid ${D.border}` }}>
              <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                <Check className="w-2.5 h-2.5" style={{ color }} />
              </div>
              <span className="text-[10px] flex-1" style={{ color: D.text }}>{item}</span>
            </div>
          ))}
        </div>
        <button className="w-full py-2 rounded-lg text-[10px] font-bold" style={{ background: color, color: '#fff' }}>
          ✓ Marquer comme livré → Facture
        </button>
      </div>
    ),

    factures: (
      <div className="space-y-2.5">
        <div className="rounded-xl p-3" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[9px] font-mono" style={{ color: D.muted }}>FAC-2026-0031</div>
            <Pill label="✓ Payée" color="#10b981" />
          </div>
          <div className="text-xs font-bold mb-1" style={{ color: D.text }}>Atlas Marketing</div>
          <div className="text-xl font-black" style={{ color }}>24 000 MAD</div>
        </div>
        <Row label="Émise le"    value="01/07/2026" />
        <Row label="Payée le"    value="15/07/2026" color="#10b981" />
        <Row label="Mode"        value="Virement bancaire" />
        <div className="flex gap-2 pt-1">
          <button className="flex-1 py-1.5 rounded-lg text-[10px] font-bold" style={{ background: color, color: '#fff' }}>PDF</button>
          <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold" style={{ background: D.card, color: D.muted, border: `1px solid ${D.border}` }}>Reçu</button>
        </div>
      </div>
    ),

    paiements: (
      <div className="space-y-2.5">
        <div className="rounded-xl p-4 text-center" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
          <div className="text-[10px] mb-1" style={{ color: D.muted }}>Paiement reçu</div>
          <div className="text-2xl font-black mb-0.5" style={{ color }}>+24 000</div>
          <div className="text-[10px] font-semibold" style={{ color: D.muted }}>MAD</div>
        </div>
        <Row label="Facture"  value="FAC-2026-0031" />
        <Row label="Client"   value="Atlas Marketing" />
        <Row label="Mode"     value="Virement bancaire" />
        <Row label="Date"     value="15/07/2026" color="#10b981" />
        <button className="w-full py-2 rounded-lg text-[10px] font-bold mt-1" style={{ background: color, color: '#fff' }}>
          ↓ Télécharger le reçu PDF
        </button>
      </div>
    ),

    analytics: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: 'CA ce mois',   v: '84 200 MAD', c: color },
            { l: 'Recouvrement', v: '94%',          c: '#10b981' },
            { l: 'En attente',   v: '23 400 MAD',  c: '#f59e0b' },
            { l: 'Clients actifs',v: '47',           c: '#8b5cf6' },
          ].map(({ l, v, c }) => (
            <div key={l} className="rounded-lg p-2.5" style={{ background: D.card, border: `1px solid ${D.border}` }}>
              <div className="text-[9px] mb-0.5" style={{ color: D.muted }}>{l}</div>
              <div className="text-sm font-black" style={{ color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-1 h-14 pt-1">
          {barData.map((val, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${(val / maxBar) * 100}%`,
                background: i === barData.length - 1
                  ? `linear-gradient(to top, ${color}, ${color}cc)`
                  : `${color}28`,
              }}
            />
          ))}
        </div>
      </div>
    ),

    team: (
      <div className="space-y-2">
        {[
          { name: 'Hassan Rachidi', role: 'Admin',      color: '#6366f1', initial: 'HR' },
          { name: 'Aicha Tazi',     role: 'Commercial', color: '#14b8a6', initial: 'AT' },
          { name: 'Karim Alami',    role: 'Comptable',  color: '#f59e0b', initial: 'KA' },
        ].map(({ name, role, color: rc, initial }) => (
          <div key={name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: D.card, border: `1px solid ${D.border}` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${rc}, ${rc}bb)` }}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold truncate" style={{ color: D.text }}>{name}</div>
            </div>
            <Pill label={role} color={rc} />
          </div>
        ))}
        <button className="w-full py-2 rounded-xl text-[10px] font-bold mt-1" style={{ background: `${color}18`, color, border: `1px solid ${color}25` }}>
          + Inviter un membre
        </button>
      </div>
    ),

    portal: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: D.dim, border: `1px solid ${D.border}` }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-[9px] font-mono truncate" style={{ color: D.muted }}>sayerli.com/portal/abc…</span>
        </div>
        <div className="rounded-xl p-3" style={{ background: D.card, border: `1px solid ${D.border}` }}>
          <div className="text-[10px] mb-0.5" style={{ color: D.muted }}>Bienvenue</div>
          <div className="text-xs font-bold mb-2.5" style={{ color: D.text }}>Atlas Marketing</div>
          <div className="rounded-lg p-2.5" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono" style={{ color: D.muted }}>DEV-2026-0042</span>
              <Pill label="En attente" color="#f59e0b" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: D.text }}>24 000 MAD</span>
              <button className="text-[9px] font-bold px-2 py-1 rounded-md" style={{ background: color, color: '#fff' }}>Accepter</button>
            </div>
          </div>
        </div>
      </div>
    ),

    catalogue: (
      <div className="space-y-1.5">
        {[
          { name: 'Design logo',      prix: '5 000',  unit: 'unité' },
          { name: 'Site vitrine',     prix: '12 000', unit: 'projet' },
          { name: 'Formation PHP',    prix: '8 000',  unit: 'jour' },
          { name: 'Réseaux sociaux',  prix: '3 500',  unit: '/mois' },
        ].map(({ name, prix, unit }) => (
          <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: D.card, border: `1px solid ${D.border}` }}>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold truncate" style={{ color: D.text }}>{name}</div>
              <div className="text-[9px]" style={{ color: D.muted }}>{unit}</div>
            </div>
            <span className="text-[10px] font-bold flex-shrink-0" style={{ color }}>{prix} MAD</span>
            <button className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${color}22`, color }}>+</button>
          </div>
        ))}
      </div>
    ),

    relances: (
      <div className="space-y-2.5">
        <div className="rounded-xl p-3" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">📧</span>
            <div>
              <div className="text-[10px] font-bold" style={{ color }}>Rappel automatique</div>
              <div className="text-[9px]" style={{ color: D.muted }}>Hassan Oujda · FAC-2026-0029</div>
            </div>
          </div>
          <div className="text-xs font-black" style={{ color: D.text }}>23 400 MAD en retard</div>
        </div>
        <div className="space-y-1.5">
          {[
            { day: 'J−3', label: 'Rappel préventif', done: true },
            { day: 'J+0', label: 'Échéance atteinte', done: true },
            { day: 'J+7', label: 'Relance urgente',   done: false },
          ].map(({ day, label, done }) => (
            <div key={day} className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: D.card, border: `1px solid ${D.border}` }}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black flex-shrink-0"
                style={{ background: done ? `${color}22` : D.dim, color: done ? color : D.muted }}
              >
                {done ? '✓' : '○'}
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-bold" style={{ color: done ? D.text : D.muted }}>{day}</span>
                <span className="text-[9px] ms-1.5" style={{ color: D.muted }}>{label}</span>
              </div>
              {done && <Pill label="Envoyé" color={color} />}
            </div>
          ))}
        </div>
      </div>
    ),
  }

  return (
    <div
      className="rounded-2xl p-4 overflow-hidden h-full"
      style={{ background: D.bg, border: `1px solid ${D.border}` }}
    >
      {mocks[featureKey] ?? mocks.crm}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function Features() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)
  const [active, setActive] = useState(0)
  const [progKey, setProgKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(() => {
    setActive(p => (p + 1) % FEATURES.length)
    setProgKey(k => k + 1)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, INTERVAL_MS)
  }, [advance])

  useEffect(() => {
    if (!visible) return
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [visible, resetTimer])

  const select = (i: number) => {
    setActive(i)
    setProgKey(k => k + 1)
    resetTimer()
  }

  const feature = FEATURES[active]

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-50 dark:bg-[#07080e]"
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none dark:hidden"
        style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Ambient color blob (follows active feature) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full pointer-events-none opacity-[0.07] dark:opacity-[0.14] transition-all duration-700"
        style={{ background: `radial-gradient(ellipse, ${feature.color} 0%, transparent 68%)`, filter: 'blur(60px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={cn(
            'text-center mb-14 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold mb-5 bg-primary-50 dark:bg-[rgba(99,102,241,0.12)] border-primary-200 dark:border-[rgba(99,102,241,0.3)] text-primary-700 dark:text-[#818cf8]">
            <Layers className="w-3.5 h-3.5" />
            {t('features.badge')}
          </span>
          <h2 className="section-title mb-4">{t('features.title')}</h2>
          <p className="section-sub">{t('features.sub')}</p>
        </div>

        {/* ── Mobile: horizontal pills ── */}
        <div className="lg:hidden mb-6 overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-2 w-max">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <button
                  key={f.key}
                  onClick={() => select(i)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200"
                  style={active === i
                    ? { background: `${f.color}18`, border: `1px solid ${f.color}40`, color: f.color }
                    : { background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', color: 'rgb(100 116 139)' }
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{f.num}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Main layout: list + detail panel ── */}
        <div
          className={cn(
            'grid lg:grid-cols-[260px,1fr] xl:grid-cols-[280px,1fr] gap-6 items-start transition-all duration-700 delay-100',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >

          {/* ── Left: feature list ── */}
          <nav className="hidden lg:flex flex-col gap-0.5 sticky top-24">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              const isActive = active === i
              return (
                <button
                  key={f.key}
                  onClick={() => select(i)}
                  className="group relative w-full text-start rounded-xl transition-all duration-200"
                  style={isActive ? { background: `${f.color}10` } : {}}
                >
                  {/* Active left border */}
                  {isActive && (
                    <div
                      className="absolute start-0 top-2 bottom-2 w-0.5 rounded-full"
                      style={{ background: f.color }}
                    />
                  )}

                  <div className="flex items-center gap-3 px-4 py-2.5">
                    {/* Number */}
                    <span
                      className="text-[10px] font-mono font-bold w-5 flex-shrink-0 text-center"
                      style={{ color: isActive ? f.color : 'rgb(148 163 184)' }}
                    >
                      {f.num}
                    </span>

                    {/* Icon */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{ background: isActive ? `${f.color}18` : 'transparent' }}
                    >
                      <Icon
                        className="w-3.5 h-3.5 transition-colors duration-200"
                        style={{ color: isActive ? f.color : 'rgb(148 163 184)' }}
                      />
                    </div>

                    {/* Title */}
                    <span
                      className="text-sm font-semibold flex-1 text-start leading-snug transition-colors duration-200"
                      style={{ color: isActive ? f.color : 'rgb(100 116 139)' }}
                    >
                      {t(`features.${f.key}.title`)}
                    </span>
                  </div>

                  {/* Progress bar on active */}
                  {isActive && (
                    <div className="absolute bottom-0 start-10 end-3 h-px overflow-hidden rounded-full" style={{ background: 'rgba(148,163,184,0.15)' }}>
                      <div
                        key={progKey}
                        className="h-full rounded-full"
                        style={{
                          background: f.color,
                          animation: `progFill ${INTERVAL_MS}ms linear both`,
                        }}
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </nav>

          {/* ── Right: detail panel ── */}
          <div
            key={active}
            className="step-in bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden"
            style={{ boxShadow: `0 0 0 1px ${feature.color}12, 0 8px 40px rgba(0,0,0,0.07)` }}
          >
            {/* Colored top accent */}
            <div
              className="h-0.5 w-full"
              style={{ background: `linear-gradient(to right, ${feature.color}, ${feature.color}66, transparent)` }}
            />

            <div className="grid sm:grid-cols-2 gap-0">

              {/* Text side */}
              <div className="p-7 sm:p-8 flex flex-col justify-center border-b sm:border-b-0 sm:border-e border-slate-100 dark:border-slate-800">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0"
                  style={{
                    background: `${feature.color}14`,
                    border: `1px solid ${feature.color}25`,
                    boxShadow: `0 0 20px ${feature.color}18`,
                  }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>

                {/* Number tag */}
                <span
                  className="text-xs font-bold tracking-widest mb-3 block"
                  style={{ color: `${feature.color}99` }}
                >
                  {feature.num} / 10
                </span>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 leading-snug">
                  {t(`features.${feature.key}.title`)}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t(`features.${feature.key}.desc`)}
                </p>

                {/* Navigation dots */}
                <div className="flex items-center gap-1.5 mt-8">
                  {FEATURES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => select(i)}
                      className="rounded-full transition-all duration-200"
                      style={{
                        width:      active === i ? 16 : 6,
                        height:     6,
                        background: active === i ? feature.color : 'rgb(203 213 225)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Mock UI side */}
              <div
                className="p-5 sm:p-6 flex items-center"
                style={{ background: D.bg }}
              >
                <div className="w-full">
                  {/* Mock header bar */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                    <div
                      className="ms-2 flex-1 h-5 rounded px-2 flex items-center"
                      style={{ background: D.dim, border: `1px solid ${D.border}` }}
                    >
                      <span className="text-[9px] font-mono" style={{ color: D.muted }}>
                        sayerli.com/dashboard/{feature.key === 'bonsLivraison' ? 'bons-livraison' : feature.key}
                      </span>
                    </div>
                  </div>

                  <FeatureMock featureKey={feature.key} color={feature.color} />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── Mobile: active detail card ── */}
        <div key={`mob-${active}`} className="lg:hidden mt-6 step-in">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden"
            style={{ boxShadow: `0 0 0 1px ${feature.color}12, 0 4px 24px rgba(0,0,0,0.06)` }}
          >
            <div
              className="h-0.5 w-full"
              style={{ background: `linear-gradient(to right, ${feature.color}, ${feature.color}44, transparent)` }}
            />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${feature.color}14`, border: `1px solid ${feature.color}25` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest" style={{ color: `${feature.color}99` }}>
                    {feature.num} / 10
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                {t(`features.${feature.key}.desc`)}
              </p>
              <div className="rounded-xl overflow-hidden" style={{ background: D.bg }}>
                <div className="p-4">
                  <FeatureMock featureKey={feature.key} color={feature.color} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
