'use client'

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

            {/* Trust chips */}
            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2"
              style={{ animation: 'fadeIn 0.55s ease-out 0.38s both' }}
            >
              {[
                t('hero.stat1'),
                t('hero.stat2'),
                `2 min — ${t('hero.stat3')}`,
              ].map(text => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 flex-shrink-0" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right — always-dark product preview ── */}
          <div
            className="hidden lg:block"
            style={{ animation: 'fadeIn 0.7s ease-out 0.2s both, float 6s ease-in-out 1s infinite' }}
          >
            <ProductPreview />
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

/* ── Always-dark dashboard preview ──────────────────────────────────── */
function ProductPreview() {
  return (
    <div className="relative select-none">
      {/* Outer glow */}
      <div className="absolute -inset-6 bg-gradient-to-br from-indigo-500/15 via-transparent to-teal-500/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* Browser frame — intentionally always dark */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#0f1117',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
      >
        {/* Chrome bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ background: '#181a22', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <div className="flex-1 mx-3">
            <div className="rounded-md px-3 py-1 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>sayerli.com/dashboard</span>
            </div>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-5">

          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'CA ce mois', value: '84 200', unit: 'MAD', accent: '#10b981', change: '+18%' },
              { label: 'Factures',   value: '12',     unit: 'envoyées', accent: '#6366f1', change: '+3' },
              { label: 'Clients',    value: '47',     unit: 'actifs',  accent: '#f59e0b', change: '+5' },
            ].map(({ label, value, unit, accent, change }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{ background: '#181a22', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${accent}18`, color: accent }}
                  >{change}</span>
                </div>
                <div className="text-lg font-black" style={{ color: 'rgba(255,255,255,0.88)' }}>{value}</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{unit}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: '#181a22', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Chiffre d'affaires 2026
              </span>
              <span
                className="text-[9px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
              >+34% vs 2025</span>
            </div>
            <div className="flex items-end gap-1 h-14">
              {[30, 48, 38, 65, 50, 80, 62, 90, 72, 85, 68, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background: i === 11
                      ? 'linear-gradient(to top, #4f46e5, #818cf8)'
                      : 'rgba(99,102,241,0.28)',
                  }}
                />
              ))}
            </div>
            <div className="flex mt-1.5">
              {['J','F','M','A','M','J','J','A','S','O','N','D'].map(m => (
                <span key={m} className="flex-1 text-center text-[8px]" style={{ color: 'rgba(255,255,255,0.18)' }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Recent items */}
          <div className="space-y-1">
            {[
              { ref: 'FAC-2026-0031', name: 'Atlas Marketing',  amount: '8 400 MAD',  status: 'Payée',     color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
              { ref: 'DEV-2026-0052', name: 'Groupe Tazi SARL', amount: '24 000 MAD', status: 'Accepté',   color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
              { ref: 'FAC-2026-0030', name: 'Rachidi Boutique', amount: '12 000 MAD', status: 'En retard', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
            ].map(({ ref, name, amount, status, color, bg }) => (
              <div
                key={ref}
                className="flex items-center justify-between p-2.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div>
                  <div className="text-[9px] font-mono mb-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>{ref}</div>
                  <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.78)' }}>{name}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{amount}</div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ color, background: bg }}
                >{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating chip — payment */}
      <div
        className="absolute -top-4 -right-5 rounded-xl p-3"
        style={{
          background: 'rgba(13,15,20,0.92)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          minWidth: 178,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(16,185,129,0.15)' }}
          >
            <span className="text-xs font-bold" style={{ color: '#10b981' }}>✓</span>
          </div>
          <div>
            <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>+8 400 MAD</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>Paiement reçu</div>
          </div>
        </div>
      </div>

      {/* Floating chip — devis accepted */}
      <div
        className="absolute -bottom-5 -left-5 rounded-xl p-3"
        style={{
          background: 'rgba(13,15,20,0.92)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          minWidth: 188,
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>Devis accepté</span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}
          >DEV-0052</span>
        </div>
        <div className="text-[10px] mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>Groupe Tazi · 24 000 MAD</div>
        <div className="rounded-full h-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-1 rounded-full w-4/5" style={{ background: 'linear-gradient(to right, #6366f1, #14b8a6)' }} />
        </div>
      </div>
    </div>
  )
}
