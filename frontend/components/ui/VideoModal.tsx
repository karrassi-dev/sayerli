'use client'

import { X } from 'lucide-react'

const VIDEO_URL =
  'https://www.youtube.com/embed/fRcj5U3i7-g?rel=0&modestbranding=1&autoplay=1'

export function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div
        className="relative w-full max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1.5 text-sm transition-colors"
        >
          <X className="w-4 h-4" /> Fermer
        </button>
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ paddingBottom: '56.25%' }}
        >
          <iframe
            src={VIDEO_URL}
            title="Sayerli — Démonstration"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
