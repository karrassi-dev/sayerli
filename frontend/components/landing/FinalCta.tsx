'use client'

import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function FinalCta() {
  const { t } = useTranslation()

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600" />
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:30px_30px]" />
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
              🇲🇦 Sayerli — Made in Morocco
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
              {t('cta.sub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-600 font-bold text-base hover:bg-primary-50 transition-all shadow-xl hover:-translate-y-0.5 group"
              >
                {t('cta.btn')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base transition-all border border-white/20 hover:-translate-y-0.5">
                <Play className="w-4 h-4" />
                {t('cta.btnSecondary')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
