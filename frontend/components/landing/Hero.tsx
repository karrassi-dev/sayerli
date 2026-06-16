'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Zap, LayoutDashboard } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useIsLoggedIn } from '@/hooks/useIsLoggedIn'

export function Hero() {
  const { t } = useTranslation()
  const loggedIn = useIsLoggedIn()

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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center" id="demo">
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
              {loggedIn ? (
                <Link href="/dashboard" className="btn-primary text-base px-8 py-4 group">
                  <LayoutDashboard className="w-4 h-4" />
                  {t('hero.ctaDashboard')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary text-base px-8 py-4 group">
                    {t('hero.cta')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/login" className="btn-secondary text-base px-8 py-4">
                    {t('hero.ctaSecondary')}
                  </Link>
                </>
              )}
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

          {/* Right — Demo video */}
          <div className="relative w-full">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-teal-500/20 rounded-3xl blur-2xl" />

              {/* Browser chrome wrapper */}
              <div className="relative card rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-slate-500 font-medium">Sayerli — Démonstration</span>
                  </div>
                </div>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/fRcj5U3i7-g?rel=0&modestbranding=1"
                    title="Sayerli — Démonstration"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
