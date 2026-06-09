'use client'

import { cn } from '@/lib/utils'

interface MiniBarChartProps {
  data: { mois: string; valeur: number }[]
  color?: string
  height?: number
}

export function MiniBarChart({ data, color = 'primary', height = 80 }: MiniBarChartProps) {
  const max = Math.max(...data.map(d => d.valeur), 1)
  const colorClass = color === 'primary' ? 'from-primary-500 to-primary-400' : color === 'teal' ? 'from-teal-500 to-teal-400' : color

  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
          <div
            className={cn('w-full rounded-t-sm bg-gradient-to-t transition-all duration-500', colorClass, d.valeur === 0 ? 'opacity-20' : 'opacity-90 hover:opacity-100')}
            style={{ height: `${(d.valeur / max) * (height - 16)}px` }}
          />
          {/* Tooltip */}
          {d.valeur > 0 && (
            <div className="absolute bottom-full mb-1 hidden group-hover:block z-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
              {d.mois}: {d.valeur.toLocaleString()} MAD
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

export function Sparkline({ data, height = 40, width = 100 }: SparklineProps) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="text-primary-500"
      />
    </svg>
  )
}
