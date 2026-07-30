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
        <div className="dark:hidden absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-white" />
        <div className="hidden dark:block absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-indigo-500/10 dark:from-indigo-500/18 to-transparent blur-3xl" />
        <div className="absolute top-24 right-0 w-[500px] h-[500px] rounded-full bg-teal-400/8 dark:bg-teal-400/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-400/6 dark:bg-indigo-400/10 blur-3xl" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle,_#94a3b828_1px,_transparent_1px)] dark:[background-image:radial-gradient(circle,_#ffffff0f_1px,_transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* ── Copy block ── */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center pt-16 sm:pt-20 pb-10">

        {/* Personas — styled inline text, not a pill badge */}
        <div
          className="flex items-center justify-center gap-2 flex-wrap mb-8"
          style={{ animation: 'fadeIn 0.5s ease-out both' }}
        >
          <span className="text-xl leading-none">🇲🇦</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">{t('hero.p1')}</span>
          <span className="text-slate-300 dark:text-white/15 select-none">·</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wide">{t('hero.p2')}</span>
          <span className="text-slate-300 dark:text-white/15 select-none">·</span>
          <span className="text-sm font-bold text-teal-600 dark:text-teal-400 tracking-wide">{t('hero.p3')}</span>
        </div>

        {/* 3-line headline */}
        <h1
          className="font-black leading-[0.88] tracking-tighter mb-8"
          style={{ animation: 'fadeIn 0.55s ease-out 0.08s both' }}
        >
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-slate-900 dark:text-white">
            {t('hero.line1')}
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 bg-clip-text text-transparent">
            {t('hero.line2')}
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-slate-900 dark:text-white">
            {t('hero.line3')}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed"
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-primary-600 hover:from-indigo-700 hover:to-primary-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
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
        style={{ animation: 'fadeIn 0.7s ease-out 0.5s both' }}
      >
        <WorkflowDiagram t={t} />
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────
   Workflow diagram — Modern Treasury style
   Left:  Clients · Devis · Catalogue  (inputs)
   Center: Sayerli hub
   Right: Bon de Livraison · Factures · Paiements  (outputs)
────────────────────────────────────────────────────────────── */
function WorkflowDiagram({ t }: { t: (k: string) => string }) {
  const VW = 1400
  const VH = 390
  const cx  = 700          // center x
  const cy  = 195          // center y
  const lhx = 490          // left hub x (vertical bar)
  const rhx = 910          // right hub x
  const lnx = 225          // left node center x
  const rnx = 1175         // right node center x
  const NW  = 230          // node width
  const NH  = 40           // node height

  const leftNodes = [
    { key: 'wfClients',   color: '#6366f1', y: 100 },
    { key: 'wfDevis',     color: '#14b8a6', y: 195 },
    { key: 'wfCatalogue', color: '#f59e0b', y: 290 },
  ]
  const rightNodes = [
    { key: 'wfBl',        color: '#14b8a6', y: 100 },
    { key: 'wfFactures',  color: '#6366f1', y: 195 },
    { key: 'wfPaiements', color: '#10b981', y: 290 },
  ]

  return (
    <>
      <style>{`
        @keyframes wfLine {
          from { stroke-dashoffset: 500; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes wfAppear {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Mobile: 2-col feature chip grid ── */}
      <div className="md:hidden px-4 pb-14">
        <div className="grid grid-cols-2 gap-3">
          {[...leftNodes, ...rightNodes].map(({ key, color }) => (
            <div
              key={key}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/8 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none"
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              {t(`hero.${key}`)}
            </div>
          ))}
        </div>
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
          {/* Grid pattern */}
          <pattern id="wfGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              strokeWidth="0.5"
              stroke="currentColor"
              className="text-slate-200 dark:text-white/[0.04]"
            />
          </pattern>
          {/* Center gradient */}
          <linearGradient id="cGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          {/* Glow filter for center */}
          <filter id="cGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid background */}
        <rect width={VW} height={VH} fill="url(#wfGrid)" />

        {/* ── Trunk lines: center box → hubs ── */}
        <line
          x1={cx - 50} y1={cy} x2={lhx} y2={cy}
          strokeWidth={1.5} strokeDasharray="300"
          stroke="currentColor"
          className="text-slate-300 dark:text-white/20"
          fill="none"
          style={{ animation: 'wfLine 0.5s ease 0.65s both' }}
        />
        <line
          x1={cx + 50} y1={cy} x2={rhx} y2={cy}
          strokeWidth={1.5} strokeDasharray="300"
          stroke="currentColor"
          className="text-slate-300 dark:text-white/20"
          fill="none"
          style={{ animation: 'wfLine 0.5s ease 0.65s both' }}
        />

        {/* ── Vertical bus bars ── */}
        <line
          x1={lhx} y1={leftNodes[0].y} x2={lhx} y2={leftNodes[2].y}
          strokeWidth={1.5} strokeDasharray="240"
          stroke="currentColor"
          className="text-slate-300 dark:text-white/20"
          fill="none"
          style={{ animation: 'wfLine 0.4s ease 1.1s both' }}
        />
        <line
          x1={rhx} y1={rightNodes[0].y} x2={rhx} y2={rightNodes[2].y}
          strokeWidth={1.5} strokeDasharray="240"
          stroke="currentColor"
          className="text-slate-300 dark:text-white/20"
          fill="none"
          style={{ animation: 'wfLine 0.4s ease 1.1s both' }}
        />

        {/* ── Left branch connectors + nodes ── */}
        {leftNodes.map(({ key, color, y }, i) => (
          <g key={key}>
            {/* Connector line */}
            <line
              x1={lhx} y1={y} x2={lnx + NW / 2} y2={y}
              strokeWidth={1.5} strokeDasharray="300"
              stroke={color} strokeOpacity={0.5}
              fill="none"
              style={{ animation: `wfLine 0.35s ease ${1.4 + i * 0.1}s both` }}
            />
            {/* Junction dot */}
            <circle
              cx={lhx} cy={y} r={4}
              fill={color} fillOpacity={0.75}
              style={{ animation: `wfAppear 0.3s ease ${1.38 + i * 0.1}s both` }}
            />
            {/* Node */}
            <g style={{ animation: `wfAppear 0.4s ease ${1.55 + i * 0.1}s both` }}>
              <rect
                x={lnx - NW / 2} y={y - NH / 2}
                width={NW} height={NH} rx={10}
                stroke="currentColor" strokeWidth={1}
                fill="white"
                className="text-slate-200 dark:text-white/10 dark:fill-slate-900"
              />
              {/* Left accent bar */}
              <rect
                x={lnx - NW / 2} y={y - NH / 2}
                width={4} height={NH} rx={10}
                fill={color}
              />
              <text
                x={lnx + 8} y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13} fontWeight={600}
                fill="currentColor"
                className="text-slate-700 dark:text-slate-200"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {t(`hero.${key}`)}
              </text>
            </g>
          </g>
        ))}

        {/* ── Right branch connectors + nodes ── */}
        {rightNodes.map(({ key, color, y }, i) => (
          <g key={key}>
            <line
              x1={rhx} y1={y} x2={rnx - NW / 2} y2={y}
              strokeWidth={1.5} strokeDasharray="300"
              stroke={color} strokeOpacity={0.5}
              fill="none"
              style={{ animation: `wfLine 0.35s ease ${1.4 + i * 0.1}s both` }}
            />
            <circle
              cx={rhx} cy={y} r={4}
              fill={color} fillOpacity={0.75}
              style={{ animation: `wfAppear 0.3s ease ${1.38 + i * 0.1}s both` }}
            />
            <g style={{ animation: `wfAppear 0.4s ease ${1.55 + i * 0.1}s both` }}>
              <rect
                x={rnx - NW / 2} y={y - NH / 2}
                width={NW} height={NH} rx={10}
                stroke="currentColor" strokeWidth={1}
                fill="white"
                className="text-slate-200 dark:text-white/10 dark:fill-slate-900"
              />
              {/* Right accent bar */}
              <rect
                x={rnx + NW / 2 - 4} y={y - NH / 2}
                width={4} height={NH} rx={10}
                fill={color}
              />
              <text
                x={rnx - 8} y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13} fontWeight={600}
                fill="currentColor"
                className="text-slate-700 dark:text-slate-200"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {t(`hero.${key}`)}
              </text>
            </g>
          </g>
        ))}

        {/* ── Center Sayerli hub ── */}
        <g style={{ animation: 'wfAppear 0.6s ease 0.3s both' }}>
          {/* Glow halo */}
          <rect
            x={cx - 56} y={cy - 46}
            width={112} height={92} rx={24}
            fill="rgba(99,102,241,0.22)"
            filter="url(#cGlow)"
          />
          {/* Dark box */}
          <rect
            x={cx - 48} y={cy - 38}
            width={96} height={76} rx={18}
            fill="url(#cGrad)"
          />
          {/* S letter */}
          <text
            x={cx} y={cy - 7}
            textAnchor="middle" dominantBaseline="central"
            fontSize={28} fontWeight={900} fill="white"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >S</text>
          {/* SAYERLI subtext */}
          <text
            x={cx} y={cy + 20}
            textAnchor="middle" dominantBaseline="central"
            fontSize={8} fontWeight={500}
            fill="rgba(255,255,255,0.4)"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '2.5px' }}
          >SAYERLI</text>
        </g>

        {/* WORKFLOW label bottom center */}
        <text
          x={cx} y={VH - 16}
          textAnchor="middle"
          fontSize={9} fontWeight={700}
          fill="currentColor"
          className="text-slate-300 dark:text-white/15"
          style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '4px' }}
        >WORKFLOW</text>
      </svg>
    </>
  )
}
