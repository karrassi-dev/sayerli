'use client'

import { Star, Quote } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function Testimonials() {
  const { t } = useTranslation()

  const testimonials = [
    {
      name: t('testimonials.t1.name'),
      company: t('testimonials.t1.company'),
      text: t('testimonials.t1.text'),
      avatar: 'KF',
      color: 'from-blue-500 to-primary-600',
    },
    {
      name: t('testimonials.t2.name'),
      company: t('testimonials.t2.company'),
      text: t('testimonials.t2.text'),
      avatar: 'NB',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      name: t('testimonials.t3.name'),
      company: t('testimonials.t3.company'),
      text: t('testimonials.t3.text'),
      avatar: 'YA',
      color: 'from-purple-500 to-violet-600',
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
            {t('testimonials.badge')}
          </span>
          <h2 className="section-title mb-4">{t('testimonials.title')}</h2>
          <p className="section-sub">{t('testimonials.sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, company, text, avatar, color }) => (
            <div
              key={name}
              className="card p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-slate-200 dark:text-slate-700" />
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pl-4 italic">
                  &ldquo;{text}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{avatar}</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">{name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
