'use client'

import { MessageCircle } from 'lucide-react'

const WA_URL =
  'https://wa.me/447476607473?text=Bonjour%2C%20je%20voudrais%20en%20savoir%20plus%20sur%20Sayerli'

export function FloatingWhatsApp() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Sayerli sur WhatsApp"
      className="fixed right-4 sm:right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:-translate-y-1 transition-all duration-300"
      style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </a>
  )
}
