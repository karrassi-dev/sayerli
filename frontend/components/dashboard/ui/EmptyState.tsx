'use client'

import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  desc: string
  action?: { label: string; onClick: () => void }
  color?: 'blue' | 'teal' | 'purple' | 'orange'
}

const COLOR_MAP = {
  blue:   { outer: 'bg-blue-50 dark:bg-blue-950/30', inner: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-500 dark:text-blue-400', btn: 'bg-primary-600 hover:bg-primary-700' },
  teal:   { outer: 'bg-teal-50 dark:bg-teal-950/30', inner: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-500 dark:text-teal-400', btn: 'bg-teal-600 hover:bg-teal-700' },
  purple: { outer: 'bg-purple-50 dark:bg-purple-950/30', inner: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-500 dark:text-purple-400', btn: 'bg-purple-600 hover:bg-purple-700' },
  orange: { outer: 'bg-orange-50 dark:bg-orange-950/30', inner: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-500 dark:text-orange-400', btn: 'bg-orange-600 hover:bg-orange-700' },
}

export function EmptyState({ icon: Icon, title, desc, action, color = 'blue' }: EmptyStateProps) {
  const c = COLOR_MAP[color]
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className={`w-20 h-20 rounded-2xl ${c.outer} flex items-center justify-center mb-5`}>
        <div className={`w-12 h-12 rounded-xl ${c.inner} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed mb-6">{desc}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all ${c.btn}`}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
