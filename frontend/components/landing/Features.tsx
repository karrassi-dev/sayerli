'use client'

import { Users, FileText, Truck, Receipt, CreditCard, BarChart3, UserCog, Globe, BookOpen, Bell } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const FEATURES = [
  { key: 'crm',           icon: Users,    gradient: 'from-blue-500 to-primary-600',    bg: 'bg-blue-50 dark:bg-blue-950/30'    },
  { key: 'devis',         icon: FileText, gradient: 'from-teal-500 to-emerald-600',    bg: 'bg-teal-50 dark:bg-teal-950/30'    },
  { key: 'bonsLivraison', icon: Truck,    gradient: 'from-amber-500 to-orange-500',    bg: 'bg-amber-50 dark:bg-amber-950/30'  },
  { key: 'factures',      icon: Receipt,  gradient: 'from-purple-500 to-violet-600',   bg: 'bg-purple-50 dark:bg-purple-950/30'},
  { key: 'paiements',     icon: CreditCard, gradient: 'from-orange-500 to-amber-600', bg: 'bg-orange-50 dark:bg-orange-950/30'},
  { key: 'analytics',     icon: BarChart3,gradient: 'from-pink-500 to-rose-600',      bg: 'bg-pink-50 dark:bg-pink-950/30'    },
  { key: 'team',          icon: UserCog,  gradient: 'from-slate-500 to-slate-700',     bg: 'bg-slate-50 dark:bg-slate-800/50'  },
  { key: 'portal',        icon: Globe,    gradient: 'from-indigo-500 to-blue-600',     bg: 'bg-indigo-50 dark:bg-indigo-950/30'},
  { key: 'catalogue',     icon: BookOpen, gradient: 'from-green-500 to-emerald-600',   bg: 'bg-green-50 dark:bg-green-950/30'  },
  { key: 'relances',      icon: Bell,     gradient: 'from-red-500 to-orange-600',      bg: 'bg-red-50 dark:bg-red-950/30'      },
] as const

export function Features() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation()

  return (
    <section id="features" ref={ref} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={cn('text-center mb-14 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
            {t('features.badge')}
          </span>
          <h2 className="section-title mb-4">{t('features.title')}</h2>
          <p className="section-sub">{t('features.sub')}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ key, icon: Icon, gradient, bg }, i) => (
            <div
              key={key}
              className={cn(
                'group card p-6 rounded-2xl hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform', bg)}>
                <div className={cn('w-6 h-6 bg-gradient-to-br rounded-md flex items-center justify-center', gradient)}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{t(`features.${key}.title`)}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t(`features.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
