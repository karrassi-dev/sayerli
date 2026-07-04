'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Building2, User, Phone, AlertCircle, Laptop, Briefcase } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

type ProfileType = 'freelancer' | 'entrepreneur' | 'pme'

const PROFILE_TYPES: { key: ProfileType; Icon: React.ElementType; labelKey: string; subKey: string }[] = [
  { key: 'freelancer',   Icon: Laptop,    labelKey: 'typeFreelancer',   subKey: 'typeFreelancerSub' },
  { key: 'entrepreneur', Icon: Briefcase, labelKey: 'typeEntrepreneur', subKey: 'typeEntrepreneurSub' },
  { key: 'pme',          Icon: Building2, labelKey: 'typePme',          subKey: 'typePmeSub' },
]

export function RegisterForm() {
  const { t } = useTranslation()
  const { register, loading, error } = useAuth()

  const [profileType, setProfileType] = useState<ProfileType>('freelancer')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [simpleForm, setSimpleForm] = useState({ nom: '', email: '', telephone: '', motDePasse: '' })
  const [pmeForm, setPmeForm] = useState({
    nomEntreprise: '', emailEntreprise: '', telephoneEntreprise: '', nomAdmin: '', emailAdmin: '', motDePasse: '',
  })

  const setSimple = (key: keyof typeof simpleForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSimpleForm(f => ({ ...f, [key]: e.target.value }))

  const setPme = (key: keyof typeof pmeForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPmeForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (profileType === 'pme') {
      await register({ ...pmeForm, typeCompte: 'pme' })
    } else {
      await register({
        nomEntreprise: simpleForm.nom,
        emailEntreprise: simpleForm.email,
        telephoneEntreprise: simpleForm.telephone || undefined,
        nomAdmin: simpleForm.nom,
        emailAdmin: simpleForm.email,
        motDePasse: simpleForm.motDePasse,
        typeCompte: profileType,
      })
    }
  }

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Profile type selector ── */}
      <div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          {t('auth.chooseProfile')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PROFILE_TYPES.map(({ key, Icon, labelKey, subKey }) => (
            <button
              key={key}
              type="button"
              onClick={() => setProfileType(key)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all',
                profileType === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
              )}
            >
              <Icon className={cn(
                'w-5 h-5',
                profileType === key ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400',
              )} />
              <span className={cn(
                'text-xs font-semibold leading-tight',
                profileType === key ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300',
              )}>
                {t(`auth.${labelKey}`)}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight hidden sm:block">
                {t(`auth.${subKey}`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Freelancer / Entrepreneur form ── */}
      {profileType !== 'pme' && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.yourNameOrBrand')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={simpleForm.nom}
                onChange={setSimple('nom')}
                placeholder={profileType === 'freelancer' ? 'Youssef Benali' : 'Youssef Design'}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.yourEmail')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={simpleForm.email}
                  onChange={setSimple('email')}
                  placeholder="vous@gmail.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.phone')}{' '}
                <span className="text-slate-400 text-xs font-normal">({t('auth.optional')})</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={simpleForm.telephone}
                  onChange={setSimple('telephone')}
                  placeholder="+212 6 00 00 00 00"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={simpleForm.motDePasse}
                onChange={setSimple('motDePasse')}
                placeholder="Min. 8 caractères"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── PME form ── */}
      {profileType === 'pme' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.companyName')}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={pmeForm.nomEntreprise}
                  onChange={setPme('nomEntreprise')}
                  placeholder="Mon Entreprise SARL"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('auth.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={pmeForm.telephoneEntreprise}
                  onChange={setPme('telephoneEntreprise')}
                  placeholder="+212 6 00 00 00 00"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.companyEmail')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={pmeForm.emailEntreprise}
                onChange={setPme('emailEntreprise')}
                placeholder="contact@monentreprise.ma"
                className={inputClass}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium uppercase tracking-wide">
              {t('auth.adminSection')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('auth.yourName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={pmeForm.nomAdmin}
                    onChange={setPme('nomAdmin')}
                    placeholder="Mohammed Alami"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={pmeForm.emailAdmin}
                    onChange={setPme('emailAdmin')}
                    placeholder="vous@monentreprise.ma"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={pmeForm.motDePasse}
                onChange={setPme('motDePasse')}
                placeholder="Min. 8 caractères"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Terms ── */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <input
          id="terms"
          type="checkbox"
          required
          checked={agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer flex-shrink-0"
        />
        <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer">
          {t('auth.termsAgree')}{' '}
          <Link href="/legal/terms" target="_blank" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            {t('auth.termsTermsLink')}
          </Link>
          {t('auth.termsComma')}{' '}
          {t('auth.termsPrivacyIntro') && <>{t('auth.termsPrivacyIntro')}{' '}</>}
          <Link href="/legal/privacy" target="_blank" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            {t('auth.termsPrivacyLink')}
          </Link>
          {t('auth.termsAndThe')}{' '}
          <Link href="/legal/refund" target="_blank" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            {t('auth.termsRefundLink')}
          </Link>{' '}
          {t('auth.termsBrand')}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !agreedToTerms}
        className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? t('auth.registering') : t('auth.registerBtn')}
      </button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </form>
  )
}
