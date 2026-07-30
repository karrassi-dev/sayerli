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
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="dark:hidden absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-white" />
        <div className="hidden dark:block absolute inset-0 bg-[#0a0a0f]" />

        {/* Gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-indigo-500/10 dark:from-indigo-500/18 to-transparent blur-3xl" />
        <div className="absolute top-24 right-0 w-[500px] h-[500px] rounded-full bg-teal-400/8 dark:bg-teal-400/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-400/6 dark:bg-indigo-400/10 blur-3xl" />

        {/* Dot grid */}
        <div className="absolute inset-0 [background-image:radial-gradient(circle,_#94a3b828_1px,_transparent_1px)] dark:[background-image:radial-gradient(circle,_#ffffff0f_1px,_transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left — Copy ── */}
          <div className="text-center lg:text-start">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/70 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8"
              style={{ animation: 'fadeIn 0.5s ease-out both' }}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              {t('hero.badge')}
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-black leading-[1.05] tracking-tight mb-6"
              style={{ animation: 'fadeIn 0.55s ease-out 0.08s both' }}
            >
              <span className="bg-gradient-to-r from-indigo-600 via-primary-600 to-teal-500 bg-clip-text text-transparent">
                {t('hero.headline')}
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">
                {t('hero.headlineSub')}
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              style={{ animation: 'fadeIn 0.55s ease-out 0.18s both' }}
            >
              {t('hero.subheadline')}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
              style={{ animation: 'fadeIn 0.55s ease-out 0.28s both' }}
            >
              {loggedIn ? (
                <Link href="/dashboard" className="btn-primary text-base px-8 py-4 group">
                  <LayoutDashboard className="w-4 h-4" />
                  {t('hero.ctaDashboard')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-primary-600 hover:from-indigo-700 hover:to-primary-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
                  >
                    {t('hero.cta')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 font-semibold text-base hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {t('hero.ctaSecondary')}
                  </Link>
                </>
              )}
            </div>

            {/* Social proof */}
            <div
              className="flex items-center gap-3"
              style={{ animation: 'fadeIn 0.55s ease-out 0.38s both' }}
            >
              <div className="flex -space-x-2 flex-shrink-0">
                {(['#6366f1', '#10b981', '#f59e0b', '#ec4899'] as const).map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: color, zIndex: 4 - i }}
                  >
                    {['Y', 'S', 'K', 'M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm leading-none">★</span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('hero.socialProof')}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right — ecosystem diagram ── */}
          <div
            className="hidden lg:block"
            style={{ animation: 'fadeIn 0.7s ease-out 0.2s both, float 6s ease-in-out 1s infinite' }}
          >
            <EcosystemPreview />
          </div>

          {/* ── Mobile stats strip ── */}
          <div
            className="lg:hidden flex justify-center gap-8 -mt-4"
            style={{ animation: 'fadeIn 0.55s ease-out 0.5s both' }}
          >
            {[
              { value: '0 MAD', label: 'Pour démarrer' },
              { value: '2 min', label: 'Premier devis' },
              { value: '100%', label: 'Sécurisé' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-black bg-gradient-to-r from-indigo-600 to-primary-600 bg-clip-text text-transparent">{value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

/* ── Ecosystem orchestration diagram ───────────────────────────────── */
function EcosystemPreview() {
  const card: React.CSSProperties = {
    position: 'absolute',
    zIndex: 5,
    background: 'rgba(10,12,22,0.97)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 14,
    padding: 14,
    backdropFilter: 'blur(14px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
  }

  return (
    <div className="relative select-none" style={{ width: 520, height: 565, margin: '0 auto' }}>

      {/* Dark background + central orb */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ background: '#06090f' }}>
        <div className="absolute" style={{
          top: '38%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 460, height: 460,
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.32) 0%, rgba(6,182,212,0.18) 38%, transparent 65%)',
          filter: 'blur(52px)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
      </div>

      {/* SVG connection lines */}
      <svg className="absolute inset-0 pointer-events-none" width="520" height="565" style={{ zIndex: 3 }}>
        <defs>
          <marker id="ai" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(99,102,241,0.6)" />
          </marker>
          <marker id="at" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(20,184,166,0.6)" />
          </marker>
        </defs>
        {/* Card1 → Card2 */}
        <path d="M252,138 C270,138 280,118 297,118" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5" strokeDasharray="5,3" fill="none" markerEnd="url(#ai)" />
        {/* Card1 → Card3 */}
        <line x1="148" y1="228" x2="160" y2="288" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5" markerEnd="url(#ai)" />
        {/* Card2 → Card4 */}
        <line x1="388" y1="208" x2="386" y2="288" stroke="rgba(20,184,166,0.45)" strokeWidth="1.5" markerEnd="url(#at)" />
        {/* Card3 → Card5 */}
        <line x1="162" y1="398" x2="160" y2="432" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" markerEnd="url(#ai)" />
        {/* Card4 → Card6 */}
        <line x1="384" y1="396" x2="382" y2="430" stroke="rgba(20,184,166,0.4)" strokeWidth="1.5" markerEnd="url(#at)" />
        {/* Card5 → Card6 */}
        <line x1="250" y1="470" x2="278" y2="468" stroke="rgba(99,102,241,0.38)" strokeWidth="1.5" markerEnd="url(#ai)" />
        {/* Endpoint dots */}
        <circle cx="148" cy="228" r="3" fill="rgba(99,102,241,0.65)" />
        <circle cx="388" cy="208" r="3" fill="rgba(20,184,166,0.65)" />
        <circle cx="162" cy="398" r="3" fill="rgba(99,102,241,0.5)" />
        <circle cx="384" cy="396" r="3" fill="rgba(20,184,166,0.5)" />
      </svg>

      {/* ── Multi-devises badge (top center) ── */}
      <div className="absolute" style={{ top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10, whiteSpace: 'nowrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '5px 14px', borderRadius: 20,
          background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.38)',
          color: '#2dd4bf', fontSize: 11, fontWeight: 600,
        }}>✓ Multi-devises</span>
      </div>

      {/* ── Floating currency bubbles ── */}
      {/* MAD pill left of badge */}
      <div className="absolute" style={{ top: 22, left: 148, zIndex: 8 }}>
        <span style={{ padding: '4px 10px', borderRadius: 14, background: 'rgba(99,102,241,0.13)', border: '1px solid rgba(99,102,241,0.3)', color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 600 }}>MAD</span>
      </div>
      {/* € right of badge */}
      <div className="absolute" style={{ top: 15, left: 355, zIndex: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(99,102,241,0.13)', border: '1px solid rgba(99,102,241,0.28)', color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>€</div>
      </div>
      {/* $ far right */}
      <div className="absolute" style={{ top: 9, left: 438, zIndex: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.28)', color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>$</div>
      </div>
      {/* € right edge */}
      <div className="absolute" style={{ top: 70, left: 490, zIndex: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)', color: 'rgba(255,255,255,0.35)', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>€</div>
      </div>
      {/* MAD left side */}
      <div className="absolute" style={{ top: 158, left: 14, zIndex: 8 }}>
        <span style={{ padding: '3px 8px', borderRadius: 12, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)', color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600 }}>MAD</span>
      </div>
      {/* € bottom left */}
      <div className="absolute" style={{ top: 205, left: 10, zIndex: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', color: 'rgba(255,255,255,0.28)', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>€</div>
      </div>

      {/* ── CARD 1: Devis & Factures ── */}
      <div style={{ ...card, top: 50, left: 42, width: 210 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.92)', marginBottom: 10 }}>Devis & Factures</div>
        {[
          ['Design logo',   '12 500 MAD'],
          ['Site web',      '12 500 MAD'],
          ['Consultation',  '1 500 MAD'],
        ].map(([label, amount]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)' }}>{label}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.48)' }}>{amount}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.92)' }}>12 500 MAD</span>
          <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 8, background: 'rgba(16,185,129,0.18)', color: '#10b981', fontWeight: 600 }}>Envoyée</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 9, color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 4 }}>↓ Télécharger PDF</div>
      </div>

      {/* ── CARD 2: TVA & Dépenses ── */}
      <div style={{ ...card, top: 50, left: 295, width: 186 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.92)', marginBottom: 10 }}>TVA & Dépenses</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 50, marginBottom: 10 }}>
          {[38,55,42,70,52,75,48,65].map((h, i) => (
            <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', height: `${h}%`, background: i % 2 === 0 ? 'rgba(99,102,241,0.55)' : 'rgba(20,184,166,0.5)' }} />
          ))}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginBottom: 6 }}>8 300 MAD</div>
        <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontWeight: 600 }}>Statut</span>
      </div>

      {/* ORCHESTRATION label */}
      <div className="absolute" style={{ top: 270, left: 20, zIndex: 8 }}>
        <span style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.48)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-block' }}>
          ORCHESTRATION
        </span>
      </div>

      {/* ── CARD 3: Comptable & Team ── */}
      <div style={{ ...card, top: 288, left: 75, width: 186 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.92)', marginBottom: 10 }}>Comptable & Team</div>
        {[
          { name: 'Yassine', role: 'Comptable', color: '#6366f1' },
          { name: 'Sara',    role: 'Commercial', color: '#10b981' },
        ].map(({ name, role, color }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: color + '25', border: `1.5px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color, flexShrink: 0 }}>
              {name[0]}
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              {name} <span style={{ color: 'rgba(255,255,255,0.32)', fontSize: 10 }}>({role})</span>
            </span>
          </div>
        ))}
      </div>

      {/* ── CARD 4: Bon de Livraison ── */}
      <div style={{ ...card, top: 288, left: 288, width: 186 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.92)', marginBottom: 10 }}>Bon de Livraison</div>
        {[
          { w: '68%', a: 3, b: 0 },
          { w: '55%', a: 3, b: 0 },
          { w: '42%', a: 0, b: 0 },
        ].map(({ w, a, b }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', width: w }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.38)', minWidth: 14 }}>{a}</span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.38)', minWidth: 14 }}>{b}</span>
          </div>
        ))}
      </div>

      {/* ── CARD 5: Clients ── */}
      <div style={{ ...card, top: 430, left: 75, width: 172 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.92)', marginBottom: 10 }}>Clients</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)' }} />
          <div>
            <div style={{ height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.18)', width: 80, marginBottom: 5 }} />
            <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', width: 55 }} />
          </div>
        </div>
      </div>

      {/* ── CARD 6: Paiement ── */}
      <div style={{ ...card, top: 428, left: 278, width: 206 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>Paiement</span>
          <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: 'rgba(16,185,129,0.18)', color: '#10b981', fontWeight: 600 }}>Reçu</span>
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Status</div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', marginBottom: 10 }}>
          <div style={{ height: '100%', borderRadius: 2, width: '78%', background: 'linear-gradient(to right, #6366f1, #14b8a6)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)' }}>
          <span style={{ color: '#10b981', fontSize: 11, fontWeight: 700 }}>✓</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>Paiement reçu — 5 000 MAD</span>
        </div>
      </div>

      {/* Outer glow */}
      <div className="absolute -inset-6 -z-10 rounded-3xl" style={{
        background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, rgba(20,184,166,0.08) 50%, transparent 70%)',
        filter: 'blur(24px)',
      }} />
    </div>
  )
}
