'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { Logo } from '@/components/ui/LogoMark'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo size={36} variant="dark" />
            </div>
            <p className="text-sm leading-relaxed">{t('footer.tagline')}</p>
            <p className="text-sm mt-4">{t('footer.madeIn')}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('footer.product')}</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#features', label: t('footer.features') },
                { href: '#pricing', label: t('footer.pricing') },
                { href: '#', label: t('footer.changelog') },
              ].map(item => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('footer.company')}</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#', label: t('footer.about') },
                { href: '#', label: t('footer.blog') },
                { href: '#', label: t('footer.careers') },
                { href: '/contact', label: t('footer.contact') },
              ].map(item => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('footer.legal')}</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/legal/privacy', label: t('footer.privacy') },
                { href: '/legal/terms', label: t('footer.terms') },
                { href: '/legal/refund', label: t('footer.refund') },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">{t('footer.copyright')}</p>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
