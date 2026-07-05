'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { VideoModal } from '@/components/ui/VideoModal'

export function VideoDemoButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary text-base px-8 py-4 group inline-flex items-center gap-2"
      >
        <span className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
          <Play className="w-3 h-3 text-primary-600 dark:text-primary-400 fill-current ml-0.5" />
        </span>
        Voir une démo
      </button>
      {open && <VideoModal onClose={() => setOpen(false)} />}
    </>
  )
}
