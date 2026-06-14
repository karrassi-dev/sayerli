'use client'

import { MessageCircle } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const WHATSAPP_LINK = 'https://wa.me/447476607473?text=Bonjour%2C%20je%20souhaite%20changer%20mon%20plan%20Sayerli.'

export function UpgradeBanner() {
  const { t, locale } = useTranslation()
  const isRtl = locale === 'ar'

  // Duplicate text so the loop is seamless
  const text = `${t('upgradeBanner.text')} · +447476607473 · ${t('upgradeBanner.text')} · +447476607473 · `

  return (
    <div
      className="relative w-full overflow-hidden flex items-center"
      style={{
        background: 'linear-gradient(90deg, #7c3aed, #4f46e5, #0891b2, #4f46e5, #7c3aed)',
        height: '40px',
        backgroundSize: '300% 100%',
      }}
    >
      {/* Scrolling text track */}
      <div className="flex-1 overflow-hidden h-full flex items-center">
        <div
          className={`flex whitespace-nowrap ${isRtl ? 'animate-marquee-rtl' : 'animate-marquee-ltr'}`}
          aria-hidden="true"
        >
          <span className="text-white/95 text-[13px] font-medium tracking-wide px-4">
            {text}
          </span>
          {/* Second copy for seamless loop */}
          <span className="text-white/95 text-[13px] font-medium tracking-wide px-4">
            {text}
          </span>
        </div>
      </div>

      {/* Fixed WhatsApp CTA — right side (or left for AR) */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          absolute flex items-center gap-1.5
          bg-white text-indigo-700 text-xs font-bold
          px-3 py-1.5 rounded-full
          hover:bg-indigo-50 active:scale-95
          transition-all duration-150 shadow-sm
          flex-shrink-0 z-10
          ${isRtl ? 'left-3' : 'right-3'}
        `}
      >
        <MessageCircle className="w-3.5 h-3.5 text-green-600" />
        {t('upgradeBanner.cta')}
      </a>

      {/* Fade edges so text blends smoothly into the CTA button */}
      <div
        className={`absolute inset-y-0 w-20 pointer-events-none z-[5] ${isRtl ? 'left-0' : 'right-0'}`}
        style={{
          background: isRtl
            ? 'linear-gradient(to right, rgba(79,70,229,0.95), transparent)'
            : 'linear-gradient(to left, rgba(79,70,229,0.95), transparent)',
        }}
      />
    </div>
  )
}
