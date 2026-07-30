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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-indigo-500/10 dark:from-indigo-500/18 to-transparent blur-3xl" />
        <div className="absolute top-24 right-0 w-[500px] h-[500px] rounded-full bg-teal-400/8 dark:bg-teal-400/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-400/6 dark:bg-indigo-400/10 blur-3xl" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle,_#94a3b828_1px,_transparent_1px)] dark:[background-image:radial-gradient(circle,_#ffffff0f_1px,_transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="flex items-center justify-center gap-5 xl:gap-8">

          {/* ── Left floating cards ── */}
          <div
            className="hidden xl:flex flex-col gap-3 flex-shrink-0 w-[205px]"
            style={{ animation: 'fadeIn 0.7s ease-out 0.1s both' }}
          >
            <FeatureCard title="Devis & Factures" accent="#6366f1">
              <div className="space-y-2">
                {[['Design logo', '8 500'], ['Consultation', '3 200']].map(([l, a]) => (
                  <div key={l} className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{l}</span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{a} MAD</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 dark:border-white/6 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-800 dark:text-white">11 700 MAD</span>
                  <Chip color="#10b981">Envoyée ✓</Chip>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard title="Bon de Livraison" accent="#14b8a6">
              <div className="space-y-2">
                {([['Produit A — Qté 3', true], ['Produit B — Qté 5', true], ['Produit C — Qté 2', false]] as [string, boolean][]).map(([label, done]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-teal-500/15 dark:bg-teal-500/20' : 'bg-slate-100 dark:bg-white/5'}`}>
                      {done && <span className="text-teal-500 text-[8px] font-black">✓</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{label}</span>
                  </div>
                ))}
                <div className="pt-1">
                  <Chip color="#14b8a6">Signé & Livré</Chip>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard title="Catalogue" accent="#f59e0b">
              <div className="space-y-2">
                {[
                  { name: 'Pack Design', price: '8 000' },
                  { name: 'Site vitrine', price: '12 500' },
                  { name: 'Audit SEO', price: '4 500' },
                ].map(({ name, price }) => (
                  <div key={name} className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 truncate">{name}</span>
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">{price}</span>
                  </div>
                ))}
              </div>
            </FeatureCard>
          </div>

          {/* ── Center — hero copy ── */}
          <div className="flex-1 text-center" style={{ maxWidth: 660 }}>

            {/* Personas — styled inline, not a badge */}
            <div
              className="flex items-center justify-center gap-2 flex-wrap mb-10"
              style={{ animation: 'fadeIn 0.5s ease-out both' }}
            >
              <span className="text-xl leading-none">🇲🇦</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">{t('hero.p1')}</span>
              <span className="text-slate-300 dark:text-white/15 select-none">·</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-wide">{t('hero.p2')}</span>
              <span className="text-slate-300 dark:text-white/15 select-none">·</span>
              <span className="text-sm font-bold text-teal-600 dark:text-teal-400 tracking-wide">{t('hero.p3')}</span>
            </div>

            {/* Giant 3-line headline */}
            <h1
              className="font-black leading-[0.88] tracking-tighter mb-8"
              style={{ animation: 'fadeIn 0.55s ease-out 0.08s both' }}
            >
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-[4.75rem] text-slate-900 dark:text-white">
                {t('hero.line1')}
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-[4.75rem] bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 bg-clip-text text-transparent">
                {t('hero.line2')}
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-[4.75rem] text-slate-900 dark:text-white">
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

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
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
              className="flex items-center justify-center gap-3"
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

          {/* ── Right floating cards ── */}
          <div
            className="hidden xl:flex flex-col gap-3 flex-shrink-0 w-[205px]"
            style={{ animation: 'fadeIn 0.7s ease-out 0.2s both' }}
          >
            <FeatureCard title="Gestion d'équipe" accent="#8b5cf6">
              <div className="space-y-2">
                {[
                  { name: 'Yassine', role: 'Comptable', color: '#6366f1' },
                  { name: 'Sara',    role: 'Commercial', color: '#10b981' },
                  { name: 'Karim',   role: 'Admin',      color: '#f59e0b' },
                ].map(({ name, role, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                      style={{ background: color }}
                    >
                      {name[0]}
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 leading-none">{name}</div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FeatureCard>

            <FeatureCard title="Paiements & TVA" accent="#10b981">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Reçu ce mois</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">+8 400 MAD</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full w-4/5" style={{ background: 'linear-gradient(to right,#6366f1,#14b8a6)' }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500">TVA collectée</span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">3 280 MAD</span>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard title="Relances auto" accent="#f87171">
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30">
                  <span className="text-red-500 text-xs flex-shrink-0">⚠</span>
                  <span className="text-[9px] text-red-600 dark:text-red-400 font-medium">2 factures en retard</span>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <span className="text-teal-500 font-bold">✓</span>
                  Relance envoyée · il y a 2h
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <span className="text-teal-500 font-bold">✓</span>
                  Relance envoyée · il y a 1j
                </div>
              </div>
            </FeatureCard>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ── Theme-aware feature card ─────────────────────────────── */
function FeatureCard({
  title,
  accent,
  children,
}: {
  title: string
  accent: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-[#0f1117] border border-slate-100 dark:border-white/7 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accent }} />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{title}</span>
      </div>
      {children}
    </div>
  )
}

/* ── Mini status chip ─────────────────────────────────────── */
function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {children}
    </span>
  )
}
