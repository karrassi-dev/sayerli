'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, LayoutDashboard } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn'

export function Hero() {
  const { t } = useTranslation()
  const loggedIn = useIsLoggedIn()

  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden pt-20">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="dark:hidden absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="hidden dark:block absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-indigo-500/8 dark:bg-indigo-500/14 blur-3xl" />
        <div className="absolute top-32 right-0 w-[400px] h-[400px] rounded-full bg-teal-400/6 dark:bg-teal-400/10 blur-3xl" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] dark:[background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* ── Copy block ── */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center pt-14 sm:pt-18 pb-12">

        {/* Personas — styled inline text, no badge */}
        <div
          className="flex items-center justify-center gap-2 flex-wrap mb-7"
          style={{ animation: 'fadeIn 0.5s ease-out both' }}
        >
          <span className="text-lg leading-none select-none">🇲🇦</span>
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">{t('hero.p1')}</span>
          <span className="text-slate-300 dark:text-white/12 select-none text-xs">·</span>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-300">{t('hero.p2')}</span>
          <span className="text-slate-300 dark:text-white/12 select-none text-xs">·</span>
          <span className="text-xs font-bold tracking-widest uppercase text-teal-600 dark:text-teal-400">{t('hero.p3')}</span>
        </div>

        {/* Headline */}
        <h1
          className="font-black leading-[0.88] tracking-tighter mb-7"
          style={{ animation: 'fadeIn 0.55s ease-out 0.08s both' }}
        >
          <span className="block text-5xl sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] text-slate-900 dark:text-white">
            {t('hero.line1')}
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 bg-clip-text text-transparent">
            {t('hero.line2')}
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] text-slate-900 dark:text-white">
            {t('hero.line3')}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed"
          style={{ animation: 'fadeIn 0.55s ease-out 0.18s both' }}
        >
          {t('hero.subheadline')}
        </p>

        {/* Single CTA */}
        <div style={{ animation: 'fadeIn 0.55s ease-out 0.28s both' }}>
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 group"
            >
              <LayoutDashboard className="w-4 h-4" />
              {t('hero.ctaDashboard')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Workflow diagram ── */}
      <div
        className="w-full"
        style={{ animation: 'fadeIn 0.6s ease-out 0.45s both' }}
      >
        <WorkflowDiagram t={t} />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Workflow diagram
   5-step linear flow: Client → Devis → BL → Facture → Paiement
   Animated: flowing dashes + twin particles on each connector
═══════════════════════════════════════════════════════════════ */
function WorkflowDiagram({ t }: { t: (k: string) => string }) {
  /* ViewBox geometry */
  const VW = 1400
  const VH = 260
  const ny  = 112   /* node center Y */
  const NW  = 152   /* node width   */
  const NH  = 50    /* node height  */
  const NR  = NH / 2 /* pill radius */

  /* 5 steps */
  const steps: { key: string; color: string; nx: number }[] = [
    { key: 'wfClients',   color: '#6366f1', nx: 152  },
    { key: 'wfDevis',     color: '#8b5cf6', nx: 416  },
    { key: 'wfBl',        color: '#f59e0b', nx: 700  },  /* center = 1400/2 */
    { key: 'wfFactures',  color: '#0ea5e9', nx: 984  },
    { key: 'wfPaiements', color: '#10b981', nx: 1248 },
  ]

  /* Connector segments (right edge of node i → left edge of node i+1) */
  const connectors = steps.slice(0, -1).map((s, i) => ({
    x1: s.nx    + NW / 2,
    x2: steps[i + 1].nx - NW / 2,
    color: s.color,
    nextColor: steps[i + 1].color,
  }))

  return (
    <>
      <style>{`
        @keyframes heroFlow {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -24; }
        }
        @keyframes heroFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes heroPulse {
          0%, 100% { r: 4; opacity: 0.9; }
          50%      { r: 5.5; opacity: 1; }
        }
      `}</style>

      {/* ── Mobile: vertical step list ── */}
      <div className="md:hidden px-6 pb-14 flex flex-col items-center gap-0">
        {steps.map((step, i) => (
          <React.Fragment key={step.key}>
            <div
              className="flex items-center gap-3 w-full max-w-xs px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/8 shadow-sm dark:shadow-none"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: step.color, boxShadow: `0 0 8px ${step.color}60` }}
              />
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {t(`hero.${step.key}`)}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-px h-7 my-0.5 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, ${step.color}, ${steps[i + 1].color})`,
                  opacity: 0.5,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Desktop: animated SVG ── */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="hidden md:block w-full"
        style={{ maxHeight: VH, display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle line grid */}
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48" fill="none"
              stroke="currentColor" strokeWidth="0.5"
              className="text-slate-300 dark:text-white/[0.04]"
            />
          </pattern>

          {/* Glow filter for particles + nodes */}
          <filter id="hero-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hero-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Invisible connector paths for animateMotion */}
          {connectors.map((c, i) => (
            <path key={i} id={`hcp-${i}`} d={`M ${c.x1},${ny} L ${c.x2},${ny}`} />
          ))}

          {/* Per-step gradient for node borders */}
          {steps.map((s, i) => (
            <radialGradient key={i} id={`ng-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.06" />
            </radialGradient>
          ))}
        </defs>

        {/* Grid background */}
        <rect width={VW} height={VH} fill="url(#hero-grid)" />

        {/* ═══ CONNECTORS ═══ */}
        {connectors.map((c, i) => {
          const lineDelay = `${0.9 + i * 0.15}s`
          const particleDelay1 = `${0.9 + i * 0.15}s`
          const particleDelay2 = `${0.9 + i * 0.15 + 0.7}s`

          return (
            <g key={i}>
              {/* Background track (always visible after fade) */}
              <line
                x1={c.x1} y1={ny} x2={c.x2} y2={ny}
                strokeWidth={1.5} stroke="currentColor" strokeOpacity={0.12} fill="none"
                className="text-slate-900 dark:text-white"
                style={{ animation: `heroFade 0.5s ease ${lineDelay} both` }}
              />

              {/* Flowing animated dash */}
              <line
                x1={c.x1} y1={ny} x2={c.x2} y2={ny}
                stroke={c.color}
                strokeWidth={2}
                fill="none"
                strokeDasharray="5 19"
                strokeOpacity={0.55}
                style={{
                  animation: [
                    `heroFade 0.5s ease ${lineDelay} both`,
                    `heroFlow 1.4s linear ${lineDelay} infinite`,
                  ].join(', '),
                }}
              />

              {/* Primary glowing particle */}
              <circle r={4} fill={c.color} filter="url(#hero-glow-sm)">
                <animateMotion
                  dur="1.4s"
                  repeatCount="indefinite"
                  begin={particleDelay1}
                  calcMode="linear"
                >
                  <mpath href={`#hcp-${i}`} />
                </animateMotion>
              </circle>

              {/* Secondary particle (offset by half period) */}
              <circle r={2.5} fill={c.color} fillOpacity={0.55} filter="url(#hero-glow-sm)">
                <animateMotion
                  dur="1.4s"
                  repeatCount="indefinite"
                  begin={particleDelay2}
                  calcMode="linear"
                >
                  <mpath href={`#hcp-${i}`} />
                </animateMotion>
              </circle>
            </g>
          )
        })}

        {/* ═══ NODES ═══ */}
        {steps.map((step, i) => {
          const nodeDelay = `${0.45 + i * 0.13}s`
          const label = t(`hero.${step.key}`)

          return (
            <g
              key={step.key}
              style={{ animation: `heroFade 0.5s ease ${nodeDelay} both` }}
            >
              {/* Ambient glow behind node */}
              <rect
                x={step.nx - NW / 2 - 8} y={ny - NH / 2 - 8}
                width={NW + 16} height={NH + 16}
                rx={NR + 8}
                fill={step.color} fillOpacity={0.1}
                filter="url(#hero-glow)"
              />

              {/* Node card background */}
              <rect
                x={step.nx - NW / 2} y={ny - NH / 2}
                width={NW} height={NH}
                rx={NR}
                className="fill-white dark:fill-[#0e1118]"
                stroke={step.color}
                strokeWidth={1.5}
                strokeOpacity={0.45}
              />

              {/* Colored filled left section */}
              <rect
                x={step.nx - NW / 2} y={ny - NH / 2}
                width={NH} height={NH}
                rx={NR}
                fill={step.color}
                fillOpacity={0.12}
              />

              {/* Colored dot inside the left zone */}
              <circle
                cx={step.nx - NW / 2 + NH / 2}
                cy={ny}
                r={7}
                fill={step.color}
                filter="url(#hero-glow-sm)"
              />

              {/* Step label */}
              <text
                x={step.nx - NW / 2 + NH + 8}
                y={ny}
                textAnchor="start"
                dominantBaseline="central"
                fontSize={12.5}
                fontWeight={700}
                className="fill-slate-800 dark:fill-white"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {label}
              </text>
            </g>
          )
        })}

        {/* ═══ STEP LABELS BELOW ═══ */}
        {steps.map((step, i) => {
          const subDelay = `${0.6 + i * 0.13}s`
          return (
            <text
              key={`sub-${step.key}`}
              x={step.nx} y={ny + NH / 2 + 22}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill={step.color}
              fillOpacity={0.7}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.04em',
                animation: `heroFade 0.5s ease ${subDelay} both`,
              }}
            >
              0{i + 1}
            </text>
          )
        })}

        {/* ═══ CONNECTOR ARROW TIPS ═══ */}
        {connectors.map((c, i) => {
          const arrowX = c.x2
          const arrowDelay = `${1.1 + i * 0.15}s`
          return (
            <polygon
              key={`arrow-${i}`}
              points={`${arrowX},${ny} ${arrowX - 7},${ny - 4} ${arrowX - 7},${ny + 4}`}
              fill={c.nextColor}
              fillOpacity={0.5}
              style={{ animation: `heroFade 0.4s ease ${arrowDelay} both` }}
            />
          )
        })}

        {/* ═══ BOTTOM LABEL ═══ */}
        <text
          x={VW / 2} y={VH - 18}
          textAnchor="middle"
          fontSize={9} fontWeight={700}
          className="fill-slate-300 dark:fill-white/12"
          style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '5px' }}
        >
          SAYERLI WORKFLOW
        </text>
      </svg>
    </>
  )
}
