'use client'

import { useState } from 'react'
import { Users, FileText, Receipt, BarChart3, Check, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

type TabId = 'clients' | 'devis' | 'bonsLivraison' | 'factures' | 'analytics'

const TABS: { id: TabId; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'clients',       icon: Users,     color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  { id: 'devis',         icon: FileText,  color: '#14b8a6', bg: 'rgba(20,184,166,0.12)'  },
  { id: 'bonsLivraison', icon: Truck,     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  { id: 'factures',      icon: Receipt,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)'  },
  { id: 'analytics',     icon: BarChart3, color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
]

const TAB_URL: Record<TabId, string> = {
  clients: 'clients', devis: 'devis', bonsLivraison: 'bons-livraison',
  factures: 'factures', analytics: 'tableau-de-bord',
}

const SCREEN_DATA: Record<TabId, { name: string; company: string; amount: string; statusKey: string }[]> = {
  clients: [
    { name: 'Hassan Oujda',  company: 'Imprimerie Express', amount: '18 400 MAD', statusKey: 'actif' },
    { name: 'Aicha Rachidi', company: 'Boutique Mode',      amount: '12 000 MAD', statusKey: 'actif' },
    { name: 'Karim Tazi',    company: 'Studio Design',      amount: '5 200 MAD',  statusKey: 'enAttente' },
    { name: 'Nadia Alami',   company: 'Consulting RH',      amount: '9 800 MAD',  statusKey: 'actif' },
  ],
  devis: [
    { name: 'DEV-2026-0042', company: 'Atlas Marketing',   amount: '24 000 MAD', statusKey: 'accepte' },
    { name: 'DEV-2026-0041', company: 'Boutique Mode',     amount: '8 500 MAD',  statusKey: 'envoye' },
    { name: 'DEV-2026-0040', company: 'Studio Casablanca', amount: '15 000 MAD', statusKey: 'vu' },
    { name: 'DEV-2026-0039', company: 'Restaurant Atlas',  amount: '42 000 MAD', statusKey: 'brouillon' },
  ],
  bonsLivraison: [
    { name: 'BL-2026-0018', company: 'Atlas Marketing',  amount: '24 000 MAD', statusKey: 'livre' },
    { name: 'BL-2026-0017', company: 'Groupe Tazi SARL', amount: '8 500 MAD',  statusKey: 'envoye' },
    { name: 'BL-2026-0016', company: 'Studio Design',    amount: '15 000 MAD', statusKey: 'facture' },
    { name: 'BL-2026-0015', company: 'Restaurant Atlas', amount: '6 200 MAD',  statusKey: 'brouillon' },
  ],
  factures: [
    { name: 'FAC-2026-0031', company: 'Atlas Marketing',  amount: '24 000 MAD', statusKey: 'payee' },
    { name: 'FAC-2026-0030', company: 'Boutique Mode',    amount: '8 500 MAD',  statusKey: 'partielle' },
    { name: 'FAC-2026-0029', company: 'Studio Design',    amount: '15 000 MAD', statusKey: 'enRetard' },
    { name: 'FAC-2026-0028', company: 'Restaurant Atlas', amount: '6 200 MAD',  statusKey: 'envoyee' },
  ],
  analytics: [
    { name: '', company: '', amount: '84 200 MAD', statusKey: 'actif' },
    { name: '', company: '', amount: '12 / 15',    statusKey: 'envoye' },
    { name: '', company: '', amount: '8 / 11',     statusKey: 'vu' },
    { name: '', company: '', amount: '23 400 MAD', statusKey: 'enAttente' },
  ],
}

const ANALYTICS_LABELS = ['kpi1.label', 'kpi2.label', 'kpi3.label', 'kpi4.label']

const STATUS_BADGE: Record<string, string> = {
  actif:     'text-emerald-700 dark:text-emerald-400',
  enAttente: 'text-amber-700 dark:text-amber-400',
  accepte:   'text-emerald-700 dark:text-emerald-400',
  envoye:    'text-blue-700 dark:text-blue-400',
  vu:        'text-purple-700 dark:text-purple-400',
  brouillon: 'text-slate-500 dark:text-slate-500',
  payee:     'text-emerald-700 dark:text-emerald-400',
  partielle: 'text-amber-700 dark:text-amber-400',
  enRetard:  'text-red-600 dark:text-red-400',
  envoyee:   'text-blue-700 dark:text-blue-400',
  livre:     'text-emerald-700 dark:text-emerald-400',
  facture:   'text-violet-700 dark:text-violet-400',
}

const STATUS_BG: Record<string, string> = {
  actif:     'rgba(16,185,129,0.1)',
  enAttente: 'rgba(245,158,11,0.1)',
  accepte:   'rgba(16,185,129,0.1)',
  envoye:    'rgba(59,130,246,0.1)',
  vu:        'rgba(139,92,246,0.1)',
  brouillon: 'rgba(148,163,184,0.12)',
  payee:     'rgba(16,185,129,0.1)',
  partielle: 'rgba(245,158,11,0.1)',
  enRetard:  'rgba(239,68,68,0.1)',
  envoyee:   'rgba(59,130,246,0.1)',
  livre:     'rgba(16,185,129,0.1)',
  facture:   'rgba(139,92,246,0.1)',
}

export function DashboardShowcase() {
  const { t } = useTranslation()
  const [activeIdx, setActiveIdx] = useState(0)
  const { ref, visible } = useScrollAnimation(0.05)
  const tab = TABS[activeIdx]

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-50 dark:bg-[#07080f]"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full opacity-20 dark:opacity-15"
          style={{
            background: `radial-gradient(circle, ${tab.color}55 0%, transparent 70%)`,
            filter: 'blur(80px)',
            transform: 'translate(25%, -25%)',
            transition: 'background 0.6s ease',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-15 dark:opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', filter: 'blur(60px)', transform: 'translate(-20%, 20%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={cn(
            'text-center mb-12 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5 border transition-all duration-400"
            style={{
              background: tab.bg,
              borderColor: `${tab.color}35`,
              color: tab.color,
            }}
          >
            {t('dashboardShowcase.badge')}
          </span>
          <h2 className="section-title mb-4">{t('dashboardShowcase.title')}</h2>
          <p className="section-sub">{t('dashboardShowcase.sub')}</p>
        </div>

        {/* Tab bar */}
        <div
          className={cn(
            'mb-10 transition-all duration-700 delay-100',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:justify-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit mx-auto shadow-sm">
            {TABS.map(({ id, icon: Icon, color, bg }, i) => {
              const isActive = activeIdx === i
              return (
                <button
                  key={id}
                  onClick={() => setActiveIdx(i)}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0"
                  style={isActive
                    ? { background: bg, color }
                    : { color: 'rgb(100 116 139)' }
                  }
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ border: `1px solid ${color}35`, boxShadow: `0 0 12px ${color}18` }}
                    />
                  )}
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? color : undefined }} />
                  <span>{t(`dashboardShowcase.tabs.${id}.label`)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            'grid lg:grid-cols-2 gap-10 lg:gap-14 items-center transition-all duration-700 delay-200',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          {/* Left: description */}
          <div key={`desc-${activeIdx}`} className="step-in">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0"
              style={{
                background: tab.bg,
                border: `1px solid ${tab.color}30`,
                boxShadow: `0 4px 20px ${tab.color}20`,
              }}
            >
              <tab.icon className="w-6 h-6" style={{ color: tab.color }} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-snug">
              {t(`dashboardShowcase.tabs.${tab.id}.headline`)}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-7">
              {t(`dashboardShowcase.tabs.${tab.id}.desc`)}
            </p>
            <ul className="space-y-3">
              {(['point1', 'point2', 'point3'] as const).map(p => (
                <li key={p} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: tab.bg }}
                  >
                    <Check className="w-3 h-3" style={{ color: tab.color }} />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base">
                    {t(`dashboardShowcase.tabs.${tab.id}.${p}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mock screen */}
          <div key={`mock-${activeIdx}`} className="step-in relative">
            {/* Glow halo behind the card */}
            <div
              className="absolute -inset-6 rounded-3xl pointer-events-none transition-all duration-500"
              style={{ background: `${tab.color}0e`, filter: 'blur(20px)' }}
            />
            <div
              className="absolute -inset-2 rounded-3xl pointer-events-none transition-all duration-500"
              style={{ background: `${tab.color}07` }}
            />

            {/* Browser card */}
            <div
              className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
              style={{ boxShadow: `0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px ${tab.color}15` }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="ms-3 flex-1 bg-white dark:bg-slate-700 rounded-lg px-3 py-1 text-xs text-slate-400 font-mono truncate border border-slate-200 dark:border-slate-600">
                  sayerli.com/dashboard/{TAB_URL[tab.id]}
                </div>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: tab.color, boxShadow: `0 0 6px ${tab.color}` }}
                />
              </div>

              <div className="p-4 bg-white dark:bg-slate-900">
                {/* Table header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: tab.bg }}
                    >
                      <tab.icon className="w-3.5 h-3.5" style={{ color: tab.color }} />
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {t(`dashboardShowcase.tabs.${tab.id}.label`)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-md"
                      style={{ background: `linear-gradient(135deg, ${tab.color}, ${tab.color}cc)`, boxShadow: `0 2px 8px ${tab.color}40` }}
                    >
                      +
                    </div>
                  </div>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-4 gap-2 px-3 py-2 mb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <span className="col-span-1">{t('dashboardShowcase.tableHeaders.name')}</span>
                  <span className="hidden sm:block">{t('dashboardShowcase.tableHeaders.company')}</span>
                  <span>{t('dashboardShowcase.tableHeaders.amount')}</span>
                  <span>{t('dashboardShowcase.tableHeaders.status')}</span>
                </div>

                {/* Rows */}
                <div className="space-y-0.5 mt-1">
                  {SCREEN_DATA[tab.id].map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-white truncate col-span-1">
                        {tab.id === 'analytics' ? t(`analytics.${ANALYTICS_LABELS[i]}`) : row.name}
                      </span>
                      <span className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 truncate">{row.company}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{row.amount}</span>
                      <span>
                        <span
                          className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold', STATUS_BADGE[row.statusKey])}
                          style={{ background: STATUS_BG[row.statusKey] }}
                        >
                          {t(`dashboardShowcase.statuses.${row.statusKey}`)}
                        </span>
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
