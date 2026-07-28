'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { VideoModal } from '@/components/ui/VideoModal'

export function FinalCta() {
  const { t } = useTranslation()
  const [videoOpen, setVideoOpen] = useState(false)

  const trustItems = [
    t('cta.trust1'),
    t('cta.trust2'),
    t('cta.trust3'),
  ]

  return (
    <>
      <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Outer ambient glow under the card */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.35) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">

            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600" />

            {/* Subtle dot grid overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Top bloom */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.12)', filter: 'blur(40px)' }}
            />

            {/* Bottom-right glow accent */}
            <div
              className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'rgba(20,184,166,0.35)', filter: 'blur(50px)' }}
            />

            {/* Shimmer sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
                animation: 'shimmer 6s 1s ease-in-out infinite',
              }}
            />

            {/* Content */}
            <div className="relative px-6 py-14 sm:px-16 sm:py-20">

              {/* Morocco badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-semibold mb-7 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 opacity-80" />
                {t('cta.badge')}
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
                {t('cta.title')}
              </h2>
              <p className="text-primary-100 text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                {t('cta.sub')}
              </p>

              {/* Trust row */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 text-sm text-white/70">
                {trustItems.map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-300 flex-shrink-0" />
                    {item}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-white text-primary-600 font-bold text-sm sm:text-base hover:bg-primary-50 transition-all shadow-2xl shadow-black/30 hover:-translate-y-1 active:translate-y-0 group"
                >
                  {t('cta.btn')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setVideoOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base transition-all border border-white/25 hover:-translate-y-1 active:translate-y-0 backdrop-blur-sm"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {t('cta.btnSecondary')}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    </>
  )
}
