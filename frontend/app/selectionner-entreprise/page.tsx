'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, CheckCircle, ChevronRight, Crown, Briefcase } from 'lucide-react'
import { useAuth, type CompanyInfo } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/LogoMark'

const PLAN_COLORS: Record<string, string> = {
  STARTER:  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  PRO:      'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300',
  BUSINESS: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
}

export default function SelectionnerEntreprisePage() {
  const { t } = useTranslation()
  const { companies, selectCompany, loading, error } = useAuth()
  const router = useRouter()
  const [selecting, setSelecting] = useState<string | null>(null)

  // If no companies in state (e.g. direct navigation), redirect to login
  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? sessionStorage.getItem('sayerli_select_token')
      : null
    if (!token && companies.length === 0) {
      router.replace('/login')
    }
  }, [companies, router])

  async function handleSelect(company: CompanyInfo) {
    setSelecting(company.utilisateurId)
    await selectCompany(company.utilisateurId)
    setSelecting(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size={40} />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {t('auth.selectCompany.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t('auth.selectCompany.sub')}
            </p>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="p-3 space-y-2">
            {companies.map((company) => {
              const isSelecting = selecting === company.utilisateurId
              const isDisabled = loading || !!selecting

              return (
                <button
                  key={company.utilisateurId}
                  onClick={() => !isDisabled && handleSelect(company)}
                  disabled={isDisabled}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all group',
                    isSelecting
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-950/40'
                      : isDisabled
                      ? 'border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 cursor-pointer'
                  )}
                >
                  {/* Company avatar */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-black text-sm">
                      {company.nom.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{company.nom}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', PLAN_COLORS[company.plan] ?? PLAN_COLORS.STARTER)}>
                        {company.plan}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                        {company.role === 'PROPRIETAIRE' || company.role === 'ADMIN'
                          ? <Crown className="w-3 h-3" />
                          : <Briefcase className="w-3 h-3" />}
                        {company.role.charAt(0) + company.role.slice(1).toLowerCase().replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Arrow / spinner */}
                  <div className="flex-shrink-0">
                    {isSelecting ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                    ) : (
                      <ChevronRight className={cn(
                        'w-4 h-4 transition-colors',
                        isDisabled ? 'text-slate-200 dark:text-slate-700' : 'text-slate-300 dark:text-slate-600 group-hover:text-primary-500'
                      )} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="px-6 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
            <button
              onClick={() => router.push('/login')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              ← {t('auth.signIn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
