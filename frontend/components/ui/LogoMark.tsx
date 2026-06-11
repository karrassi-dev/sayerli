'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <Image
      src="/sayerlilogopng.png"
      alt="Sayerli"
      width={size}
      height={size}
      className={cn('flex-shrink-0', className)}
      priority
    />
  )
}

interface LogoProps {
  showText?: boolean
  size?: number
  /** 'auto' = dark text in light mode / white in dark mode (default)
   *  'dark'  = always white text (for dark backgrounds like footer) */
  variant?: 'auto' | 'dark'
  className?: string
}

export function Logo({ showText = true, size = 32, variant = 'auto', className }: LogoProps) {
  const textClass =
    variant === 'dark'
      ? 'text-white'
      : 'text-slate-900 dark:text-white'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoMark size={size} />
      {showText && (
        <span className={cn('font-black text-xl tracking-tight select-none', textClass)}>
          Sayerl<span className="text-[#06D6B0]">i</span>
        </span>
      )}
    </div>
  )
}
