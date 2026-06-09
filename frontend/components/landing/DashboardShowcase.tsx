'use client'

import { useState } from 'react'
import { Users, FileText, Receipt, BarChart3, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

type TabId = 'clients' | 'devis' | 'factures' | 'analytics'

const TAB_ICONS = [Users, FileText, Receipt, BarChart3]
const TAB_COLORS = [
  'from-blue-500 to-primary-600',
  'from-teal-500 to-emerald-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
]
const TAB_IDS: TabId[] = ['clients', 'devis', 'factures', 'analytics']

// Mock screen data — only statuses are translated
const SCREEN_DATA: Record<TabId, { name: string; company: string; amount: string; statusKey: string }[]> = {
  clients: [
    { name: 'Hassan Oujda', company: 'Imprimerie Express', amount: '18,400 MAD', statusKey: 'actif' },
    { name: 'Aicha Rachidi', company: 'Boutique Mode', amount: '12,000 MAD', statusKey: 'actif' },
    { name: 'Karim Tazi', company: 'Studio Design', amount: '5,200 MAD', statusKey: 'enAttente' },
    { name: 'Nadia Alami', company: 'Consulting RH', amount: '9,800 MAD', statusKey: 'actif' },
  ],
  devis: [
    { name: 'DEV-2024-0042', company: 'Atlas Marketing', amount: '24,000 MAD', statusKey: 'accepte' },
    { name: 'DEV-2024-0041', company: 'Boutique Mode', amount: '8,500 MAD', statusKey: 'envoye' },
    { name: 'DEV-2024-0040', company: 'Studio Casablanca', amount: '15,000 MAD', statusKey: 'vu' },
    { name: 'DEV-2024-0039', company: 'Restaurant Atlas', amount: '42,000 MAD', statusKey: 'brouillon' },
  ],
  factures: [
    { name: 'FAC-2024-0018', company: 'Atlas Marketing', amount: '24,000 MAD', statusKey: 'payee' },
    { name: 'FAC-2024-0017', company: 'Boutique Mode', amount: '8,500 MAD', statusKey: 'partielle' },
    { name: 'FAC-2024-0016', company: 'Studio Design', amount: '15,000 MAD', statusKey: 'enRetard' },
    { name: 'FAC-2024-0015', company: 'Restaurant Atlas', amount: '6,200 MAD', statusKey: 'envoyee' },
  ],
  analytics: [
    { name: '', company: '', amount: '84,200 MAD', statusKey: 'actif' },
    { name: '', company: '', amount: '12 / 15', statusKey: 'envoye' },
    { name: '', company: '', amount: '8 / 11', statusKey: 'vu' },
    { name: '', company: '', amount: '23,400 MAD', statusKey: 'enAttente' },
  ],
}

const ANALYTICS_LABELS = ['kpi1.label', 'kpi2.label', 'kpi3.label', 'kpi4.label']

const STATUS_BADGE: Record<string, string> = {
  actif:     'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  enAttente: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  accepte:   'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  envoye:    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  vu:        'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  brouillon: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  payee:     'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  partielle: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  enRetard:  'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  envoyee:   'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
}

export function DashboardShowcase() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const { ref, visible } = useScrollAnimation()
  const tabId = TAB_IDS[active]

  return (
    <section ref={ref} className="py-28 overflow-hidden bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('text-center mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
            {t('dashboardShowcase.badge')}
          </span>
          <h2 className="section-title mb-4">{t('dashboardShowcase.title')}</h2>
          <p className="section-sub">{t('dashboardShowcase.sub')}</p>
        </div>

        {/* Tabs */}
        <div className={cn('flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 delay-100', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          {TAB_IDS.map((id, i) => {
            const Icon = TAB_ICONS[i]
            return (
              <button
                key={id}
                onClick={() => setActive(i)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  active === i
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                <Icon className="w-4 h-4" />
                {t(`dashboardShowcase.tabs.${id}.label`)}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className={cn('grid lg:grid-cols-2 gap-10 items-center transition-all duration-700 delay-200', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          {/* Left: description */}
          <div>
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg', `bg-gradient-to-br ${TAB_COLORS[active]}`)}>
              {(() => { const Icon = TAB_ICONS[active]; return <Icon className="w-6 h-6 text-white" /> })()}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-snug">
              {t(`dashboardShowcase.tabs.${tabId}.headline`)}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-6">
              {t(`dashboardShowcase.tabs.${tabId}.desc`)}
            </p>
            <ul className="space-y-3">
              {(['point1', 'point2', 'point3'] as const).map(p => (
                <li key={p} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {t(`dashboardShowcase.tabs.${tabId}.${p}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mock screen */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-teal-500/10 rounded-3xl blur-2xl" />
            <div className="relative card rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 bg-white dark:bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400">
                  app.sayerli.ma/{tabId}
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {t(`dashboardShowcase.tabs.${tabId}.label`)}
                  </span>
                  <div className="flex gap-2">
                    <div className="h-7 w-20 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    <div className="h-7 w-7 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">+</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 px-3 py-2 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  <span>{t('dashboardShowcase.tableHeaders.name')}</span>
                  <span className="hidden sm:block">{t('dashboardShowcase.tableHeaders.company')}</span>
                  <span>{t('dashboardShowcase.tableHeaders.amount')}</span>
                  <span>{t('dashboardShowcase.tableHeaders.status')}</span>
                </div>

                <div className="space-y-1">
                  {SCREEN_DATA[tabId].map((row, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <span className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                        {tabId === 'analytics' ? t(`analytics.${ANALYTICS_LABELS[i]}`) : row.name}
                      </span>
                      <span className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 truncate">{row.company}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{row.amount}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium w-fit', STATUS_BADGE[row.statusKey])}>
                        {t(`dashboardShowcase.statuses.${row.statusKey}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
