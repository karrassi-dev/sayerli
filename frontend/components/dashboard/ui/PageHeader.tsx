'use client'

import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  sub?: string
  actions?: ReactNode
  breadcrumb?: string
}

export function PageHeader({ title, sub, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1 font-medium uppercase tracking-wider">
            {breadcrumb}
          </p>
        )}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{title}</h1>
        {sub && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}
