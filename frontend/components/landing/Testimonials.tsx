'use client'

import { Gift, MessageCircle, Sparkles, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function Testimonials() {
  const { t } = useTranslation()

  const perks = [
    {
      icon: Gift,
      iconBg: 'bg-primary-100 dark:bg-primary-950/60',
      iconColor: 'text-primary-600 dark:text-primary-400',
      title: t('earlyAccess.perk1Title'),
      desc: t('earlyAccess.perk1Desc'),
    },
    {
      icon: MessageCircle,
      iconBg: 'bg-[#25D366]/10 dark:bg-[#25D366]/10',
      iconColor: 'text-[#25D366]',
      title: t('earlyAccess.perk2Title'),
      desc: t('earlyAccess.perk2Desc'),
    },
    {
      icon: Sparkles,
      iconBg: 'bg-amber-100 dark:bg-amber-950/60',
      iconColor: 'text-amber-600 dark:text-amber-400',
      title: t('earlyAccess.perk3Title'),
      desc: t('earlyAccess.perk3Desc'),
    },
  ]

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-primary-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            {t('earlyAccess.badge')}
          </span>
          <h2 className="section-title mb-4">{t('earlyAccess.title')}</h2>
          <p className="section-sub max-w-2xl mx-auto">{t('earlyAccess.sub')}</p>
        </div>

        {/* Perk cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {perks.map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
            <div
              key={title}
              className="card p-7 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 mb-4">
            <a
              href="https://wa.me/447476607473?text=Bonjour%2C%20je%20voudrais%20rejoindre%20l%27acc%C3%A8s%20fondateur%20de%20Sayerli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#1ebe5d] transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              {t('earlyAccess.ctaWhatsapp')}
            </a>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-950 border border-primary-200 dark:border-primary-800 transition-all hover:-translate-y-0.5"
            >
              {t('earlyAccess.ctaFree')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t('earlyAccess.ctaSub')}</p>
        </div>

      </div>
    </section>
  )
}
