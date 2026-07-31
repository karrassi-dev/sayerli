'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, ExternalLink } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

/* ─── Keyframes ─────────────────────────────────────────── */
const KF = `
  @keyframes aTicker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes aFadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes aFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes aSlideR  { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
  @keyframes aSlideL  { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
  @keyframes aScaleIn { from{opacity:0;transform:scale(0.45)} to{opacity:1;transform:scale(1)} }
  @keyframes aPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes aCheck   { from{opacity:0;transform:scale(0.2) rotate(-25deg)} to{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes aFly     { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(30px,-14px) scale(0.45)} }
  @keyframes aOrb     { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,-16px)} }
`

/* ─── Ticker data ────────────────────────────────────────── */
const TICKER = [
  { e: '✉', t: 'Relance envoyée — Atlas Corp' },
  { e: '💰', t: 'Paiement reçu — 15 600 MAD' },
  { e: '✓',  t: 'Devis accepté — Amal Tech SARL' },
  { e: '📋', t: 'Facture générée automatiquement' },
  { e: '🔔', t: 'Rappel J-3 — Maroc Invest' },
  { e: '📦', t: 'BL converti en facture en 1 clic' },
  { e: '🎉', t: 'Client a accepté le devis' },
  { e: '⚡', t: '3 relances envoyées à 07:00' },
]

/* ─── Theme helper ───────────────────────────────────────── */
type T = {
  bg: string; text: string; muted: string; faint: string
  cardBg: string; cardBdr: string; cardSep: string; cardShadow: string
  rowBg: string; rowBdr: string
  isDark: boolean
}

function tok(isDark: boolean): T {
  return {
    isDark,
    bg:        isDark ? '#07080f' : '#f0f2ff',
    text:      isDark ? '#ffffff' : '#0f172a',
    muted:     isDark ? 'rgba(148,163,184,0.82)' : 'rgba(71,85,105,0.88)',
    faint:     isDark ? 'rgba(100,116,139,0.5)'  : 'rgba(100,116,139,0.45)',
    cardBg:    isDark ? 'rgba(255,255,255,0.028)' : 'rgba(255,255,255,0.88)',
    cardBdr:   isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(15,23,42,0.09)',
    cardSep:   isDark ? 'rgba(255,255,255,0.05)'  : 'rgba(15,23,42,0.06)',
    cardShadow: isDark
      ? '0 0 0 1px rgba(255,255,255,0.025), 0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 1px 3px rgba(15,23,42,0.06), 0 8px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
    rowBg:  isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.035)',
    rowBdr: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.07)',
  }
}

/* ─── Main export ────────────────────────────────────────── */
export function AutomationSection() {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const { ref, visible } = useScrollAnimation(0.04)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const tk = tok(!mounted || resolvedTheme !== 'light')

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: tk.bg }}
    >
      <style>{KF}</style>

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div style={{
          position: 'absolute', inset: 0,
          background: tk.isDark
            ? 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.13), transparent)'
            : 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(99,102,241,0.07), transparent)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: tk.isDark
            ? 'linear-gradient(rgba(255,255,255,0.014) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.014) 1px,transparent 1px)'
            : 'linear-gradient(rgba(99,102,241,0.038) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.038) 1px,transparent 1px)',
          backgroundSize: '72px 72px',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 480, height: 480,
          borderRadius: '50%', filter: 'blur(120px)',
          background: tk.isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.05)',
          animation: 'aOrb 16s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '8%', width: 380, height: 380,
          borderRadius: '50%', filter: 'blur(100px)',
          background: tk.isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',
          animation: 'aOrb 20s ease-in-out infinite 6s',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-14 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>

          {/* Live ticker */}
          <div className="overflow-hidden mb-10" style={{
            maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          }}>
            <div className="inline-flex gap-4 whitespace-nowrap" style={{ animation: 'aTicker 30s linear infinite' }}>
              {[...TICKER, ...TICKER].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0" style={{
                  background: tk.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
                  border: `1px solid ${tk.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.07)'}`,
                  fontSize: 12, color: tk.faint,
                }}>
                  <span>{item.e}</span>
                  <span style={{ fontWeight: 500 }}>{item.t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full" style={{
            background: tk.isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${tk.isDark ? 'rgba(245,158,11,0.22)' : 'rgba(245,158,11,0.18)'}`,
          }}>
            <span style={{ color: tk.isDark ? '#fbbf24' : '#d97706', fontSize: 11 }}>✦</span>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: tk.isDark ? '#fbbf24' : '#d97706' }}>
              {t('automation.badge')}
            </span>
          </div>

          <h2 className="font-black tracking-tight leading-[1.06] mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)' }}>
            <span style={{ color: tk.text }}>{t('automation.titleLine1')} </span>
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 55%, #fb923c 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{t('automation.titleLine2')}</span>
          </h2>

          <p style={{ fontSize: 16, color: tk.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            {t('automation.sub')}
          </p>
        </div>

        {/* ── Bento grid ── */}
        <div className={cn('transition-all duration-700 delay-150', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
            <div className="md:col-span-7">
              <Card color="#3b82f6" tag={t('automation.item1.tag')} title={t('automation.item1.title')} tk={tk} delay="0s" minH={300}>
                <CardRappels tk={tk} />
              </Card>
            </div>
            <div className="md:col-span-5">
              <Card color="#f97316" tag={t('automation.item4.tag')} title={t('automation.item4.title')} tk={tk} delay="0.08s" minH={300}>
                <CardPortail tk={tk} />
              </Card>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card color="#14b8a6" tag={t('automation.item2.tag')} title={t('automation.item2.title')} tk={tk} delay="0.16s" minH={250}>
              <CardBL tk={tk} />
            </Card>
            <Card color="#8b5cf6" tag={t('automation.item3.tag')} title={t('automation.item3.title')} tk={tk} delay="0.24s" minH={250}>
              <CardPaiements tk={tk} />
            </Card>
            <Card color="#f59e0b" tag={t('automation.item5.tag')} title={t('automation.item5.title')} tk={tk} delay="0.32s" minH={250}>
              <CardCatalogue tk={tk} />
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Shared bento card ──────────────────────────────────── */
function Card({ children, color, tag, title, tk, delay, minH }: {
  children: React.ReactNode
  color: string; tag: string; title: string
  tk: T; delay: string; minH: number
}) {
  return (
    <div style={{
      position: 'relative', borderRadius: 20, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', minHeight: minH,
      background: tk.cardBg,
      border: `1px solid ${tk.cardBdr}`,
      backdropFilter: 'blur(24px)',
      boxShadow: tk.cardShadow,
      animation: `aFadeUp 0.55s ease ${delay} both`,
    }}>
      {/* Top accent strip */}
      <div style={{ height: 2, flexShrink: 0, background: `linear-gradient(90deg, ${color}, ${color}55, transparent 70%)` }} />

      {/* Corner glows */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 220, height: 220, pointerEvents: 'none',
        background: `radial-gradient(circle at 0% 0%, ${color}14, transparent 65%)` }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 180, height: 180, pointerEvents: 'none',
        background: `radial-gradient(circle at 100% 100%, ${color}10, transparent 65%)` }} />

      {/* Header */}
      <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative', zIndex: 2 }}>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
          padding: '3px 9px', borderRadius: 20,
          background: `${color}1a`, color, border: `1px solid ${color}30`,
        }}>{tag}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: tk.isDark ? 'rgba(255,255,255,0.88)' : 'rgba(15,23,42,0.85)' }}>{title}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '2px 18px 18px', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

/* ─── Row helper ─────────────────────────────────────────── */
function Row({ children, delay, style }: { children: React.ReactNode; delay: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 11px', borderRadius: 12, gap: 10,
      animation: `aFadeUp 0.4s ease ${delay} both`,
      ...style,
    }}>
      {children}
    </div>
  )
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
      background: `${color}20`, color, border: `1px solid ${color}35`,
    }}>{label}</span>
  )
}

/* ─── Card A: Rappels automatiques ──────────────────────── */
function CardRappels({ tk }: { tk: T }) {
  const rows = [
    { ref: 'FAC-2026-041', client: 'Atlas Corp',   amt: '8 400 MAD',  d: '200ms'  },
    { ref: 'FAC-2026-038', client: 'Maroc Invest', amt: '12 600 MAD', d: '750ms'  },
    { ref: 'FAC-2026-035', client: 'Amal Tech',    amt: '5 200 MAD',  d: '1300ms' },
  ]
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1" style={{ animation: 'aFadeIn 0.4s ease 100ms both' }}>
        <Bell className="w-4 h-4 text-blue-400" />
        <span style={{ fontSize: 12, fontWeight: 600, color: tk.muted }}>3 factures en retard détectées</span>
      </div>

      {rows.map(r => (
        <div key={r.ref} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
          borderRadius: 12, animation: `aFadeUp 0.4s ease ${r.d} both`,
          background: tk.rowBg, border: `1px solid ${tk.rowBdr}`,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, fontFamily: 'monospace', color: tk.faint, marginBottom: 2 }}>{r.ref}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: tk.text }}>{r.client}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#ef4444', marginTop: 2 }}>⚡ En retard · {r.amt}</div>
          </div>
          <div className="flex items-center gap-2">
            <span style={{
              display: 'inline-block', fontSize: 18,
              animation: `aFly 0.6s ease ${parseInt(r.d) + 900}ms both`,
            }}>✉️</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#34d399',
              animation: `aFadeIn 0.35s ease ${parseInt(r.d) + 1700}ms both`,
            }}>✓ Relancé</span>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 4, textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#34d399',
        animation: 'aFadeIn 0.4s ease 3.8s both',
      }}>
        ✅ 3 rappels envoyés automatiquement à 07:00
      </div>
    </div>
  )
}

/* ─── Card B: Portail client ─────────────────────────────── */
function CardPortail({ tk }: { tk: T }) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* URL bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        borderRadius: 10, background: tk.rowBg, border: `1px solid ${tk.rowBdr}`,
        animation: 'aFadeUp 0.4s ease 150ms both',
      }}>
        <ExternalLink style={{ width: 13, height: 13, color: tk.faint, flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: tk.faint, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          lien.sayerli.com/portal/aml-t3x9k
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#f97316', flexShrink: 0 }}>Copié ✓</span>
      </div>

      {/* Portal mockup */}
      <div style={{
        borderRadius: 14, overflow: 'hidden',
        border: '2px solid rgba(249,115,22,0.35)',
        background: tk.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
        animation: 'aFadeUp 0.4s ease 500ms both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#f97316' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white' }}>A</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Portail — Amal Tech SARL</span>
        </div>
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 10, background: tk.rowBg, border: `1px solid ${tk.rowBdr}`,
            animation: 'aFadeUp 0.35s ease 950ms both',
          }}>
            <div>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: tk.faint }}>DEV-2026-0048</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: tk.text }}>15 600 MAD</div>
            </div>
            <button style={{
              fontSize: 11, fontWeight: 700, padding: '7px 14px', borderRadius: 10,
              background: '#f97316', color: 'white', border: 'none', cursor: 'default',
              animation: 'aPulse 1.6s ease 1.6s infinite',
            }}>Accepter →</button>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10,
            background: tk.isDark ? 'rgba(52,211,153,0.1)' : 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.25)',
            animation: 'aFadeUp 0.4s ease 2.8s both',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🎉</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>Devis accepté par le client</div>
              <div style={{ fontSize: 10, color: tk.faint }}>Notification reçue instantanément</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Card C: BL → Facture ───────────────────────────────── */
function CardBL({ tk }: { tk: T }) {
  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <div className="flex items-center justify-center gap-3 flex-wrap flex-1 py-2">

        {/* BL card */}
        <div style={{
          padding: '12px 14px', borderRadius: 14, width: 130,
          background: tk.isDark ? 'rgba(217,119,6,0.18)' : 'rgba(254,251,235,0.9)',
          border: '1px solid rgba(217,119,6,0.3)',
          animation: 'aSlideR 0.5s ease 200ms both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>📦</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: tk.isDark ? '#fcd34d' : '#92400e' }}>Bon de Livraison</span>
          </div>
          <div style={{ fontSize: 9, fontFamily: 'monospace', color: tk.faint, marginBottom: 3 }}>BL-2026-0048</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: tk.text, marginBottom: 6 }}>15 600 MAD</div>
          <Pill label="✓ Livré" color="#10b981" />
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, animation: 'aScaleIn 0.4s ease 950ms both' }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: '#14b8a6' }}>1 clic</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 28, height: 2, background: '#14b8a6', borderRadius: 1 }} />
            <div style={{ borderLeft: '6px solid #14b8a6', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
          </div>
          <span style={{ fontSize: 9, color: tk.faint }}>auto</span>
        </div>

        {/* Facture card */}
        <div style={{
          padding: '12px 14px', borderRadius: 14, width: 130,
          background: tk.isDark ? 'rgba(5,150,105,0.18)' : 'rgba(240,253,249,0.9)',
          border: '1px solid rgba(5,150,105,0.3)',
          animation: 'aSlideL 0.5s ease 1250ms both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>📋</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: tk.isDark ? '#6ee7b7' : '#065f46' }}>Facture</span>
          </div>
          <div style={{ fontSize: 9, fontFamily: 'monospace', color: tk.faint, marginBottom: 3 }}>FAC-2026-0048</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: tk.text, marginBottom: 6 }}>15 600 MAD</div>
          <Pill label="✉ Envoyée" color="#3b82f6" />
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '7px 12px', borderRadius: 10, flexShrink: 0,
        background: tk.isDark ? 'rgba(20,184,166,0.1)' : 'rgba(20,184,166,0.07)',
        border: '1px solid rgba(20,184,166,0.22)',
        animation: 'aFadeIn 0.4s ease 2.2s both',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14b8a6', flexShrink: 0, animation: 'aPulse 1.5s ease infinite' }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: '#14b8a6' }}>Lignes & prix reportés — Zéro ressaisie</span>
      </div>
    </div>
  )
}

/* ─── Card D: Suivi paiements ────────────────────────────── */
function CardPaiements({ tk }: { tk: T }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Invoice header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '10px 12px', borderRadius: 12, background: tk.rowBg, border: `1px solid ${tk.rowBdr}`,
        animation: 'aFadeUp 0.4s ease 150ms both',
      }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: 'monospace', color: tk.faint, marginBottom: 3 }}>FAC-2026-0048</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: tk.text }}>Amal Tech SARL</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: tk.text }}>15 600 MAD</div>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, marginTop: 4, display: 'inline-block',
            background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)',
            animation: 'aScaleIn 0.4s ease 2.6s both',
          }}>✓ Payée</span>
        </div>
      </div>

      {/* Payment rows */}
      {[
        { label: 'Acompte 50%', amt: '7 800 MAD', d: '550ms' },
        { label: 'Solde final',  amt: '7 800 MAD', d: '1200ms' },
      ].map(p => (
        <div key={p.label} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', borderRadius: 10, background: tk.rowBg, border: `1px solid ${tk.rowBdr}`,
          animation: `aFadeUp 0.35s ease ${p.d} both`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: `aCheck 0.4s ease ${parseInt(p.d) + 600}ms both`,
            }}>
              <Check style={{ width: 11, height: 11, color: '#a78bfa' }} />
            </div>
            <span style={{ fontSize: 12, color: tk.muted }}>{p.label}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: tk.text }}>{p.amt}</span>
        </div>
      ))}

      {/* Receipt row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10,
        background: tk.isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.06)',
        border: '1px solid rgba(139,92,246,0.22)',
        animation: 'aFadeUp 0.4s ease 2.6s both',
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>🧾</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa' }}>Reçu de paiement généré</div>
          <div style={{ fontSize: 10, color: tk.faint }}>Envoyé à client@amaltech.ma</div>
        </div>
        <Check style={{ width: 14, height: 14, color: '#34d399', flexShrink: 0 }} />
      </div>
    </div>
  )
}

/* ─── Card E: Catalogue ──────────────────────────────────── */
function CardCatalogue({ tk }: { tk: T }) {
  const items = [
    { n: 'Consulting Web',  p: '3 500 MAD', u: 'jour',    d: '300ms'  },
    { n: 'Formation React', p: '2 100 MAD', u: 'session', d: '850ms'  },
    { n: 'Hébergement VPS', p: '500 MAD',   u: 'mois',    d: '1400ms' },
  ]
  return (
    <div className="flex flex-col gap-2">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 2, animation: 'aFadeIn 0.4s ease 100ms both',
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: tk.text }}>Nouveau devis</span>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
          background: 'rgba(245,158,11,0.14)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.28)',
        }}>+ Depuis catalogue</span>
      </div>

      {items.map((item, i) => (
        <Row key={item.n} delay={item.d} style={{ background: tk.rowBg, border: `1px solid ${tk.rowBdr}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0,
              background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: '#f59e0b',
            }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: tk.text }}>{item.n}</div>
              <div style={{ fontSize: 10, color: tk.faint }}>{item.u}</div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: tk.text }}>{item.p}</span>
        </Row>
      ))}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 4px', borderTop: `1px solid ${tk.cardSep}`,
        animation: 'aFadeUp 0.4s ease 2.3s both',
      }}>
        <span style={{ fontSize: 11, color: tk.faint }}>Total HT</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: tk.text }}>6 100 MAD</span>
      </div>

      <div style={{ animation: 'aFadeUp 0.4s ease 2.7s both' }}>
        <div style={{
          textAlign: 'center', padding: '9px', borderRadius: 12, cursor: 'default',
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          color: 'white', fontSize: 12, fontWeight: 700,
          boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
        }}>⚡ Devis prêt à envoyer en 1 clic</div>
      </div>
    </div>
  )
}
