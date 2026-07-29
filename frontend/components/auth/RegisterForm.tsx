'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

type ProfileType = 'freelancer' | 'entrepreneur' | 'pme'

const PROFILE_TYPES: { key: ProfileType; labelKey: string }[] = [
  { key: 'freelancer',   labelKey: 'typeFreelancer'   },
  { key: 'entrepreneur', labelKey: 'typeEntrepreneur' },
  { key: 'pme',          labelKey: 'typePme'          },
]

const INPUT = 'w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none transition-colors py-3.5 border-0 border-b border-white/[0.18] focus:border-[#B8922A]'

export function RegisterForm() {
  const { t } = useTranslation()
  const { register, loading, error } = useAuth()

  const [profileType, setProfileType] = useState<ProfileType>('freelancer')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [simpleForm, setSimpleForm] = useState({ nom: '', email: '', telephone: '', motDePasse: '' })
  const [pmeForm, setPmeForm] = useState({
    nomEntreprise: '', emailEntreprise: '', telephoneEntreprise: '',
    nomAdmin: '', emailAdmin: '', motDePasse: '',
  })

  const setSimple = (k: keyof typeof simpleForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSimpleForm(f => ({ ...f, [k]: e.target.value }))
  const setPme = (k: keyof typeof pmeForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPmeForm(f => ({ ...f, [k]: e.target.value }))

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

  return (
    <form onSubmit={handleSubmit}>
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-sm"
          style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.22)', color: '#FCA5A5', borderRadius: 2 }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile type — underline tab selector */}
      <div className="flex mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        {PROFILE_TYPES.map(({ key, labelKey }) => {
          const active = profileType === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setProfileType(key)}
              className="flex-1 py-2.5 text-xs font-semibold transition-all"
              style={{
                color: active ? '#B8922A' : 'rgba(255,255,255,0.30)',
                borderBottom: active ? '2px solid #B8922A' : '2px solid transparent',
                marginBottom: -1,
                background: 'transparent',
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              {t(`auth.${labelKey}`)}
            </button>
          )
        })}
      </div>

      {/* ── Freelancer / Entrepreneur ── */}
      {profileType !== 'pme' && (
        <div className="space-y-1">
          <input
            type="text" required
            value={simpleForm.nom}
            onChange={setSimple('nom')}
            placeholder={profileType === 'freelancer' ? 'Youssef Benali' : 'Youssef Design'}
            className={INPUT}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <input
              type="email" required
              value={simpleForm.email}
              onChange={setSimple('email')}
              placeholder={t('auth.yourEmail')}
              className={INPUT}
            />
            <input
              type="tel"
              value={simpleForm.telephone}
              onChange={setSimple('telephone')}
              placeholder="+212 6 00 00 00 00"
              className={cn(INPUT, 'sm:pl-3')}
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required minLength={8}
              value={simpleForm.motDePasse}
              onChange={setSimple('motDePasse')}
              placeholder={t('auth.password')}
              className={cn(INPUT, 'pr-9')}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.28)' }}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* ── PME ── */}
      {profileType === 'pme' && (
        <div className="space-y-1">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <input
              type="text" required
              value={pmeForm.nomEntreprise}
              onChange={setPme('nomEntreprise')}
              placeholder={t('auth.companyName')}
              className={INPUT}
            />
            <input
              type="tel"
              value={pmeForm.telephoneEntreprise}
              onChange={setPme('telephoneEntreprise')}
              placeholder="+212 6 00 00 00 00"
              className={cn(INPUT, 'sm:pl-3')}
            />
          </div>
          <input
            type="email" required
            value={pmeForm.emailEntreprise}
            onChange={setPme('emailEntreprise')}
            placeholder={t('auth.companyEmail')}
            className={INPUT}
          />
          <div className="pt-4">
            <p className="text-[9px] uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.22)' }}>
              {t('auth.adminSection')}
            </p>
            <div className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <input
                  type="text" required
                  value={pmeForm.nomAdmin}
                  onChange={setPme('nomAdmin')}
                  placeholder={t('auth.yourName')}
                  className={INPUT}
                />
                <input
                  type="email" required
                  value={pmeForm.emailAdmin}
                  onChange={setPme('emailAdmin')}
                  placeholder={t('auth.email')}
                  className={cn(INPUT, 'sm:pl-3')}
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required minLength={8}
                  value={pmeForm.motDePasse}
                  onChange={setPme('motDePasse')}
                  placeholder={t('auth.password')}
                  className={cn(INPUT, 'pr-9')}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.28)' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms */}
      <div className="flex items-start gap-3 mt-5 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <input
          id="terms" type="checkbox" required
          checked={agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 shrink-0 cursor-pointer accent-[#B8922A]"
        />
        <label htmlFor="terms" className="text-[11px] leading-relaxed cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          {t('auth.termsAgree')}{' '}
          <Link href="/legal/terms" target="_blank" className="hover:underline" style={{ color: '#B8922A' }}>
            {t('auth.termsTermsLink')}
          </Link>
          {t('auth.termsComma')}{' '}
          {t('auth.termsPrivacyIntro') && <>{t('auth.termsPrivacyIntro')}{' '}</>}
          <Link href="/legal/privacy" target="_blank" className="hover:underline" style={{ color: '#B8922A' }}>
            {t('auth.termsPrivacyLink')}
          </Link>
          {t('auth.termsAndThe')}{' '}
          <Link href="/legal/refund" target="_blank" className="hover:underline" style={{ color: '#B8922A' }}>
            {t('auth.termsRefundLink')}
          </Link>{' '}
          {t('auth.termsBrand')}
        </label>
      </div>

      {/* CTA — gold gradient, zero radius, 52px */}
      <button
        type="submit"
        disabled={loading || !agreedToTerms}
        className="w-full mt-5 font-black tracking-widest uppercase transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          height: 52,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #B8922A 0%, #D97706 100%)',
          color: '#0A0505',
          fontWeight: 800,
          fontSize: '0.75rem',
          letterSpacing: '0.10em',
          border: 'none',
          cursor: loading || !agreedToTerms ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? t('auth.registering') : t('auth.enterBtn')}
      </button>

      <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.28)' }}>
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: '#B8922A' }}>
          {t('auth.signIn')}
        </Link>
      </p>
    </form>
  )
}
