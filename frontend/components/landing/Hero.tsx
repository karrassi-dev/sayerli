'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Zap } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-primary-100 to-teal-50 dark:from-primary-950/40 dark:to-teal-950/20 blur-3xl opacity-60" />
        <div className="absolute top-32 right-0 w-96 h-96 rounded-full bg-teal-100 dark:bg-teal-950/30 blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-primary-100 dark:bg-primary-950/30 blur-3xl opacity-40" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              {t('hero.badge')}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4">
              <span className="gradient-text">{t('hero.headline')}</span>
              <br />
              <span className="text-slate-900 dark:text-white">{t('hero.headlineSub')}</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.subheadline')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/register" className="btn-primary text-base px-8 py-4 group">
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-4">
                {t('hero.ctaSecondary')}
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
              {[
                { icon: CheckCircle, value: '✓', label: t('hero.stat1') },
                { icon: MapPin, value: '🇲🇦', label: t('hero.stat2') },
                { icon: Zap, value: '2 min', label: t('hero.stat3') },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard preview */}
          <div className="relative animate-float lg:block hidden">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-teal-500/20 rounded-3xl blur-2xl" />

              {/* Main card */}
              <div className="relative card rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10 border border-slate-200 dark:border-slate-700">
                {/* Header bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-slate-500 font-medium">sayerli.com/dashboard</span>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-5 bg-white dark:bg-slate-900">
                  {/* Top row stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Clients', value: '47', color: 'bg-blue-500' },
                      { label: 'Devis', value: '12', color: 'bg-teal-500' },
                      { label: "CA (MAD)", value: '84K', color: 'bg-purple-500' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                        <div className={`w-6 h-1.5 rounded-full ${color} mb-2`} />
                        <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
                        <div className="text-xs text-slate-500">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart mockup */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
                    <div className="flex items-end gap-2 h-20">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 72].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-primary-600 to-primary-400 opacity-80"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {['Jan', 'Mar', 'Mai', 'Jul', 'Sep', 'Nov'].map(m => (
                        <span key={m} className="text-[10px] text-slate-400">{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Recent invoices */}
                  <div className="space-y-2">
                    {[
                      { name: 'Atlas Marketing', amount: '8,400 MAD', status: 'Payée', color: 'text-green-600 bg-green-50 dark:bg-green-950/30' },
                      { name: 'Boutique Rachidi', amount: '12,000 MAD', status: 'En attente', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30' },
                      { name: 'Restaurant Atlas', amount: '5,200 MAD', status: 'Brouillon', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
                    ].map(({ name, amount, status, color }) => (
                      <div key={name} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{name}</div>
                          <div className="text-xs text-slate-500">{amount}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${color}`}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 card shadow-lg p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">+8,400 MAD</div>
                    <div className="text-xs text-slate-500">Paiement reçu</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 card shadow-lg p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">Devis envoyé</div>
                <div className="text-xs text-slate-500">Atlas Marketing</div>
                <div className="mt-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
