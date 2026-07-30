'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { ArrowRight, LayoutDashboard } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn'

export function Hero() {
  const { t } = useTranslation()
  const loggedIn = useIsLoggedIn()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isDark = !mounted || resolvedTheme !== 'light'

  return (
    <section className="relative overflow-hidden pt-20">

      {/* ── Page background ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="dark:hidden absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="hidden dark:block absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-indigo-500/8 dark:bg-indigo-500/14 blur-3xl" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] dark:[background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* ── Workflow diagram — shown FIRST ── */}
      <WorkflowDiagram t={t} isDark={isDark} />

      {/* ── Copy block — shown BELOW the diagram ── */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center pt-12 pb-16">

        {/* Personas */}
        <div
          className="flex items-center justify-center gap-2 flex-wrap mb-7"
          style={{ animation: 'fadeIn 0.5s ease-out both' }}
        >
          <span className="text-lg leading-none select-none">🇲🇦</span>
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">{t('hero.p1')}</span>
          <span className="text-slate-300 dark:text-white/12 text-xs select-none">·</span>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-300">{t('hero.p2')}</span>
          <span className="text-slate-300 dark:text-white/12 text-xs select-none">·</span>
          <span className="text-xs font-bold tracking-widest uppercase text-teal-600 dark:text-teal-400">{t('hero.p3')}</span>
        </div>

        {/* Headline */}
        <h1
          className="font-black leading-[0.88] tracking-tighter mb-7"
          style={{ animation: 'fadeIn 0.55s ease-out 0.08s both' }}
        >
          <span className="block text-5xl sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] text-slate-900 dark:text-white">{t('hero.line1')}</span>
          <span className="block text-5xl sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 bg-clip-text text-transparent">{t('hero.line2')}</span>
          <span className="block text-5xl sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] text-slate-900 dark:text-white">{t('hero.line3')}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed"
          style={{ animation: 'fadeIn 0.55s ease-out 0.18s both' }}
        >
          {t('hero.subheadline')}
        </p>

        {/* CTA */}
        <div style={{ animation: 'fadeIn 0.55s ease-out 0.28s both' }}>
          {loggedIn ? (
            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 group">
              <LayoutDashboard className="w-4 h-4" />
              {t('hero.ctaDashboard')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Rich node-graph workflow diagram — dark + light mode aware
   11 connections: Dépenses + Export + full original graph
═══════════════════════════════════════════════════════════ */
function WorkflowDiagram({ t, isDark }: { t: (k: string) => string; isDark: boolean }) {
  const W = 1180
  const H = 680

  /* Theme tokens */
  const bg         = isDark ? '#0c0d1e' : '#f1f5f9'
  const textMain   = isDark ? 'white' : '#0f172a'
  const textSub    = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(15,23,42,0.48)'
  const cardBg     = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.82)'
  const cardBdr    = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(15,23,42,0.1)'
  const cardShadow = isDark ? 'none' : '0 2px 12px rgba(15,23,42,0.07)'
  const starClr    = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(100,116,139,0.18)'
  const taglineClr = isDark ? 'rgba(255,255,255,0.36)' : 'rgba(15,23,42,0.42)'

  /* Card layout (top, left, w, h) — w/h used for geometry only */
  const pos = {
    depenses: { top: 88,  left: 14,  w: 200, h: 108 },
    client:   { top: 88,  left: 435, w: 215, h: 108 },
    tva:      { top: 88,  left: 883, w: 260, h: 130 },
    devis:    { top: 254, left: 8,   w: 200, h: 132 },
    facture:  { top: 254, left: 252, w: 200, h: 132 },
    bl:       { top: 254, left: 496, w: 212, h: 132 },
    paie:     { top: 254, left: 752, w: 212, h: 132 },
    cat:      { top: 450, left: 8,   w: 205, h: 162 },
    team:     { top: 450, left: 370, w: 222, h: 162 },
    relance:  { top: 450, left: 696, w: 222, h: 140 },
    exp:      { top: 450, left: 968, w: 200, h: 140 },
  }

  const e = (p: typeof pos.client) => ({
    cx: p.left + p.w / 2,
    cy: p.top  + p.h / 2,
    T: p.top,
    B: p.top  + p.h,
    L: p.left,
    R: p.left + p.w,
  })
  type Edges = ReturnType<typeof e>
  const N = Object.fromEntries(
    (Object.entries(pos) as [string, typeof pos.client][]).map(([k, v]) => [k, e(v)])
  ) as Record<keyof typeof pos, Edges>

  /* All connections */
  const conns: {
    id: string; d: string; color: string
    dashed: boolean; dur: string; del: string
    particle: boolean; markerColor: string
  }[] = [
    /* ── Main horizontal flow ── */
    { id:'c0', d:`M ${N.devis.R},${N.devis.cy} L ${N.facture.L},${N.facture.cy}`,
      color:'#8b5cf6', dashed:false, dur:'1.1s', del:'0.9s', particle:true, markerColor:'#8b5cf6' },
    { id:'c1', d:`M ${N.facture.R},${N.facture.cy} L ${N.bl.L},${N.bl.cy}`,
      color:'#10b981', dashed:false, dur:'1.1s', del:'1.0s', particle:true, markerColor:'#10b981' },
    { id:'c2', d:`M ${N.bl.R},${N.bl.cy} L ${N.paie.L},${N.paie.cy}`,
      color:'#f59e0b', dashed:false, dur:'1.1s', del:'1.1s', particle:true, markerColor:'#f59e0b' },
    /* ── Devis → Client (curve up) ── */
    { id:'c3', d:`M ${N.devis.cx},${N.devis.T} C ${N.devis.cx},${N.devis.T-52} ${N.client.cx},${N.client.B+52} ${N.client.cx},${N.client.B}`,
      color:'#6366f1', dashed:false, dur:'2.2s', del:'0.8s', particle:true, markerColor:'#6366f1' },
    /* ── Client → Facture (dashed, curve down) ── */
    { id:'c4', d:`M ${N.client.cx},${N.client.B} C ${N.client.cx},${N.client.B+48} ${N.facture.cx},${N.facture.T-48} ${N.facture.cx},${N.facture.T}`,
      color:'#6366f1', dashed:true, dur:'2.2s', del:'0.9s', particle:false, markerColor:'#6366f1' },
    /* ── Paiement → TVA (curve right-up) ── */
    { id:'c5', d:`M ${N.paie.R},${N.paie.cy} C ${N.paie.R+55},${N.paie.cy} ${N.tva.cx},${N.tva.B+55} ${N.tva.cx},${N.tva.B}`,
      color:'#10b981', dashed:false, dur:'2.8s', del:'1.2s', particle:true, markerColor:'#10b981' },
    /* ── Catalogue → Devis (dashed, straight up) ── */
    { id:'c6', d:`M ${N.cat.cx},${N.cat.T} L ${N.devis.cx},${N.devis.B}`,
      color:'#8b5cf6', dashed:true, dur:'1.8s', del:'1.4s', particle:false, markerColor:'#8b5cf6' },
    /* ── Facture → Team (dashed, curve down) ── */
    { id:'c7', d:`M ${N.facture.cx},${N.facture.B} C ${N.facture.cx},${N.facture.B+44} ${N.team.cx},${N.team.T-44} ${N.team.cx},${N.team.T}`,
      color:'#6366f1', dashed:true, dur:'2.5s', del:'1.5s', particle:false, markerColor:'#6366f1' },
    /* ── BL → Relance (dashed, curve down) ── */
    { id:'c8', d:`M ${N.bl.cx},${N.bl.B} C ${N.bl.cx},${N.bl.B+44} ${N.relance.cx},${N.relance.T-44} ${N.relance.cx},${N.relance.T}`,
      color:'#f59e0b', dashed:true, dur:'2.5s', del:'1.5s', particle:false, markerColor:'#f59e0b' },
    /* ── NEW: Dépenses → TVA (wide arc over top — TVA déductible) ── */
    { id:'c9', d:`M ${N.depenses.R},${N.depenses.cy} C ${N.depenses.R+180},${N.depenses.T-60} ${N.tva.L-180},${N.tva.T-60} ${N.tva.L},${N.tva.cy}`,
      color:'#ef4444', dashed:true, dur:'3.0s', del:'1.6s', particle:false, markerColor:'#ef4444' },
    /* ── NEW: Export → TVA (S-curve up — data to accountant) ── */
    { id:'c10', d:`M ${N.exp.cx},${N.exp.T} C ${N.exp.cx},${Math.round((N.exp.T+N.tva.B)/2)} ${N.tva.cx},${Math.round((N.exp.T+N.tva.B)/2)} ${N.tva.cx},${N.tva.B}`,
      color:'#0ea5e9', dashed:false, dur:'2.6s', del:'1.3s', particle:true, markerColor:'#0ea5e9' },
  ]

  const markerColors = ['#8b5cf6', '#10b981', '#f59e0b', '#6366f1', '#ef4444', '#0ea5e9']

  const cBase: React.CSSProperties = {
    position: 'absolute',
    borderRadius: 14,
    border: `1px solid ${cardBdr}`,
    padding: 14,
    zIndex: 5,
    background: cardBg,
    backdropFilter: 'blur(12px)',
    boxShadow: cardShadow,
  }
  const fa = (del: string): React.CSSProperties => ({
    animation: `wfCardIn 0.55s ease ${del} both`,
  })

  const iconBox = (color: string, emoji: string) => (
    <div style={{
      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
      background: color + '28', border: `1px solid ${color}45`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
    }}>{emoji}</div>
  )

  const badge = (label: string, color: string) => (
    <span style={{
      display: 'inline-block', fontSize: 10, fontWeight: 700,
      padding: '2px 10px', borderRadius: 20,
      background: color + '20', color,
      border: `1px solid ${color}35`,
    }}>{label}</span>
  )

  const itemBg  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.05)'
  const itemBdr = isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(15,23,42,0.1)'

  return (
    <>
      <style>{`
        @keyframes wfCardIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes wfLineIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes wfFlow    { from { stroke-dashoffset:0; } to { stroke-dashoffset:-24; } }
        @keyframes wfSpark   { 0%,100%{opacity:0.2;transform:scale(1);} 50%{opacity:0.7;transform:scale(1.3);} }
      `}</style>

      {/* Outer wrapper — theme-aware background */}
      <div style={{ width: '100%', background: bg, position: 'relative' }}>

        {/* Sparkles */}
        {[
          [8,14],[18,82],[12,42],[9,65],[15,28],[11,90],
          [7,55],[16,35],[13,75],[10,5],[8,95],[14,48],
        ].map(([top, left], i) => (
          <div key={i} style={{
            position:'absolute', top:`${top}%`, left:`${left}%`,
            color: starClr, fontSize: i % 3 === 0 ? 10 : 7,
            animation:`wfSpark ${2 + (i % 4) * 0.8}s ease-in-out ${i * 0.4}s infinite`,
            pointerEvents:'none', zIndex:1, userSelect:'none',
          }}>✦</div>
        ))}

        {/* Horizontal scroll wrapper for mobile */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ position:'relative', width: W, height: H, margin:'0 auto', padding:'18px 0 32px' }}>

            {/* ── TAGLINE (replaces tab pills) ── */}
            <div style={{
              textAlign: 'center', padding: '0 12px', marginBottom: 28,
              animation: 'wfLineIn 0.5s ease 0.4s both',
            }}>
              <p style={{
                margin: 0, fontSize: 12, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: taglineClr,
              }}>
                {t('hero.wfTagline')}
              </p>
            </div>

            {/* ── SVG CONNECTION LAYER ── */}
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:3 }}>
              <defs>
                {markerColors.map((color, i) => (
                  <marker key={i} id={`wfArr${i}`} markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7 Z" fill={color} fillOpacity="0.75" />
                  </marker>
                ))}
                {conns.map(c => (
                  <path key={c.id} id={c.id} d={c.d} fill="none" />
                ))}
                <filter id="wfGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {conns.map((c) => {
                const markerIdx = markerColors.indexOf(c.markerColor)
                const flowAnim  = c.dashed ? '' : `, wfFlow 1.5s linear ${c.del} infinite`
                return (
                  <path
                    key={c.id}
                    d={c.d}
                    stroke={c.color}
                    strokeWidth={c.dashed ? 1.5 : 2}
                    fill="none"
                    strokeOpacity={isDark ? 0.6 : 0.7}
                    strokeDasharray={c.dashed ? '4 11' : '7 17'}
                    markerEnd={`url(#wfArr${markerIdx >= 0 ? markerIdx : 0})`}
                    style={{ animation: `wfLineIn 0.5s ease ${c.del} both${flowAnim}` }}
                  />
                )
              })}

              {conns.filter(c => c.particle).map(c => {
                const dur2 = (parseFloat(c.dur) * 0.5).toFixed(1) + 's'
                const del2 = (parseFloat(c.del) + parseFloat(dur2)).toFixed(1) + 's'
                return (
                  <React.Fragment key={c.id + 'p'}>
                    <circle r="4.5" fill={c.color} filter="url(#wfGlow)" fillOpacity="0.95">
                      <animateMotion dur={c.dur} repeatCount="indefinite" begin={c.del} calcMode="linear">
                        <mpath href={`#${c.id}`} />
                      </animateMotion>
                    </circle>
                    <circle r="2.5" fill={c.color} filter="url(#wfGlow)" fillOpacity="0.5">
                      <animateMotion dur={c.dur} repeatCount="indefinite" begin={del2} calcMode="linear">
                        <mpath href={`#${c.id}`} />
                      </animateMotion>
                    </circle>
                  </React.Fragment>
                )
              })}
            </svg>

            {/* ═══════════ CARDS ═══════════ */}

            {/* Dépenses — top-left (red) */}
            <div style={{ ...cBase, ...pos.depenses,
              background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(254,242,242,0.9)',
              borderColor: isDark ? 'rgba(239,68,68,0.32)' : 'rgba(239,68,68,0.22)',
              ...fa('0.52s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                {iconBox('#ef4444', '💸')}
                <span style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfDepenses')}</span>
              </div>
              <div style={{ fontSize:10, color:textSub, marginBottom:4 }}>Maroc Telecom</div>
              <div style={{ fontSize:16, fontWeight:800, color:textMain, marginBottom:8 }}>1 200 MAD</div>
              {badge('Enregistrée', '#10b981')}
            </div>

            {/* Client */}
            <div style={{ ...cBase, ...pos.client, ...fa('0.55s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                {iconBox('#6366f1', '👤')}
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:textMain, lineHeight:1.2 }}>Client</div>
                  <div style={{ fontSize:11, color:textSub, marginTop:3 }}>Amal Tech SARL</div>
                </div>
              </div>
            </div>

            {/* Paiements & TVA */}
            <div style={{ ...cBase, ...pos.tva, ...fa('0.6s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                {iconBox('#10b981', '📊')}
                <span style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfTva')}</span>
              </div>
              {([
                ['TVA collectée',  '2 600,00 MAD', false],
                ['TVA déductible', '1 300,00 MAD', false],
                ['Net à déclarer', '1 300,00 MAD', true],
              ] as [string, string, boolean][]).map(([label, val, bold]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:10, color:textSub }}>{label}</span>
                  <span style={{ fontSize:10, fontWeight: bold ? 800 : 500, color: bold ? textMain : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.65)') }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Devis — purple */}
            <div style={{ ...cBase, ...pos.devis,
              background: isDark ? 'rgba(124,58,237,0.22)' : 'rgba(245,243,255,0.9)',
              borderColor: isDark ? 'rgba(124,58,237,0.38)' : 'rgba(124,58,237,0.2)',
              ...fa('0.65s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                {iconBox('#8b5cf6', '📄')}
                <span style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfDevis')}</span>
              </div>
              <div style={{ fontSize:10, color:textSub, marginBottom:4 }}>DEV-2026-0048</div>
              <div style={{ fontSize:16, fontWeight:800, color:textMain, marginBottom:8 }}>15 600 MAD</div>
              {badge('Accepté', '#10b981')}
            </div>

            {/* Facture — green */}
            <div style={{ ...cBase, ...pos.facture,
              background: isDark ? 'rgba(5,150,105,0.2)' : 'rgba(240,253,249,0.9)',
              borderColor: isDark ? 'rgba(5,150,105,0.38)' : 'rgba(5,150,105,0.22)',
              ...fa('0.72s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                {iconBox('#10b981', '📋')}
                <span style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfFactures')}</span>
              </div>
              <div style={{ fontSize:10, color:textSub, marginBottom:4 }}>FAC-2026-0048</div>
              <div style={{ fontSize:16, fontWeight:800, color:textMain, marginBottom:8 }}>15 600 MAD</div>
              {badge('Payée', '#10b981')}
            </div>

            {/* Bon de Livraison — amber */}
            <div style={{ ...cBase, ...pos.bl,
              background: isDark ? 'rgba(217,119,6,0.2)' : 'rgba(255,251,235,0.9)',
              borderColor: isDark ? 'rgba(217,119,6,0.38)' : 'rgba(217,119,6,0.22)',
              ...fa('0.79s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                {iconBox('#f59e0b', '📦')}
                <span style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfBl')}</span>
              </div>
              <div style={{ fontSize:10, color:textSub, marginBottom:12 }}>BL-2026-0048</div>
              {badge('Livré', '#10b981')}
            </div>

            {/* Paiement */}
            <div style={{ ...cBase, ...pos.paie, ...fa('0.86s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                {iconBox('#6b7280', '💳')}
                <span style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfPaiements')}</span>
              </div>
              <div style={{ fontSize:10, color:textSub, marginBottom:4 }}>PAY-2026-0048</div>
              <div style={{ fontSize:16, fontWeight:800, color:textMain, marginBottom:8 }}>15 600 MAD</div>
              {badge('Reçu le 24/05/2026', '#10b981')}
            </div>

            {/* Catalogue */}
            <div style={{ ...cBase, ...pos.cat,
              background: isDark ? 'rgba(124,58,237,0.14)' : 'rgba(245,243,255,0.85)',
              borderColor: isDark ? 'rgba(124,58,237,0.28)' : 'rgba(124,58,237,0.16)',
              ...fa('1.0s') }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {iconBox('#8b5cf6', '📦')}
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfCatalogue')}</div>
                    <div style={{ fontSize:10, color:textSub }}>Produits & Services</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize:11, color:textSub, marginBottom:10 }}>87 articles</div>
              <div style={{ display:'flex', gap:6 }}>
                {(['🪑', '🪔', '⌨️'] as string[]).map((emoji, i) => (
                  <div key={i} style={{
                    width:38, height:38, borderRadius:8,
                    background: itemBg, border: `1px solid ${itemBdr}`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
                  }}>{emoji}</div>
                ))}
                <div style={{
                  width:38, height:38, borderRadius:8,
                  background: itemBg, border: `1px solid ${itemBdr}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.4)',
                  fontSize:16, fontWeight:700,
                }}>+</div>
              </div>
            </div>

            {/* Gestion d'équipe */}
            <div style={{ ...cBase, ...pos.team, ...fa('1.05s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                {iconBox('#6366f1', '👥')}
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfTeam')}</div>
                  <div style={{ fontSize:10, color:textSub }}>Équipe & Accès</div>
                </div>
              </div>
              <div style={{ fontSize:11, color:textSub, marginBottom:10 }}>7 membres</div>
              <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                {(['YB','MA','KH','AA'] as string[]).map((initials, i) => (
                  <div key={i} style={{
                    width:32, height:32, borderRadius:'50%',
                    background: (['#6366f1','#f59e0b','#10b981','#6b7280'] as string[])[i],
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:10, fontWeight:800, color:'white',
                    border:'1.5px solid rgba(255,255,255,0.15)',
                  }}>{initials}</div>
                ))}
                <div style={{
                  width:32, height:32, borderRadius:'50%',
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
                  border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.12)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:700,
                  color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.45)',
                }}>+3</div>
              </div>
            </div>

            {/* Relance automatique */}
            <div style={{ ...cBase, ...pos.relance, ...fa('1.1s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                {iconBox('#f59e0b', '🔔')}
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfRelance')}</div>
                  <div style={{ fontSize:10, color:textSub }}>Prochaine relance</div>
                </div>
              </div>
              <div style={{ fontSize:11, color:textSub, marginBottom:6 }}>FAC-2026-0047</div>
              <div style={{ fontSize:12, fontWeight:700, color:'#f59e0b' }}>Dans 2 jours</div>
            </div>

            {/* Export — sky blue */}
            <div style={{ ...cBase, ...pos.exp,
              background: isDark ? 'rgba(14,165,233,0.12)' : 'rgba(240,249,255,0.9)',
              borderColor: isDark ? 'rgba(14,165,233,0.32)' : 'rgba(14,165,233,0.2)',
              ...fa('1.15s') }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                {iconBox('#0ea5e9', '📤')}
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:textMain }}>{t('hero.wfExport')}</div>
                  <div style={{ fontSize:10, color:textSub }}>Excel · PDF · CSV</div>
                </div>
              </div>
              <div style={{ fontSize:11, color:textSub, marginBottom:6 }}>Journal Q2 2026</div>
              {badge('→ Comptable', '#0ea5e9')}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
