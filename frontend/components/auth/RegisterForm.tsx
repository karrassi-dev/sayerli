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

const INPUT = 'w-full px-4 py-3 rounded-xl text-white placeholder:text-white/35 text-sm focus:outline-none transition-all'
const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.10)',
}
const INPUT_FOCUS_STYLE = {
  '--tw-ring-color': 'rgba(196,154,46,0.4)',
} as React.CSSProperties

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

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#FCA5A5' }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Profile pill selector ── */}
      <div
        className="flex items-center justify-center rounded-xl p-1 gap-0.5"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {PROFILE_TYPES.map(({ key, labelKey }, idx) => (
          <button
            key={key}
            type="button"
            onClick={() => setProfileType(key)}
            className={cn(
              'flex-1 text-xs font-semibold py-2 px-2 rounded-lg transition-all',
              profileType === key
                ? 'text-white'
                : 'text-white/40 hover:text-white/65',
            )}
            style={profileType === key
              ? { background: 'rgba(196,154,46,0.25)', color: '#E8C464' }
              : undefined}
          >
            {t(`auth.${labelKey}`)}
            {idx < PROFILE_TYPES.length - 1 && profileType !== key && profileType !== PROFILE_TYPES[idx + 1]?.key && (
              <span className="mx-1 opacity-30">·</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Freelancer / Entrepreneur fields ── */}
      {profileType !== 'pme' && (
        <>
          <input
            type="text"
            required
            value={simpleForm.nom}
            onChange={setSimple('nom')}
            placeholder={profileType === 'freelancer' ? 'Youssef Benali' : 'Youssef Design'}
            className={INPUT}
            style={INPUT_STYLE}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              required
              value={simpleForm.email}
              onChange={setSimple('email')}
              placeholder={t('auth.yourEmail')}
              className={INPUT}
              style={INPUT_STYLE}
            />
            <input
              type="tel"
              value={simpleForm.telephone}
              onChange={setSimple('telephone')}
              placeholder="+212 6 00 00 00 00"
              className={INPUT}
              style={INPUT_STYLE}
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={simpleForm.motDePasse}
              onChange={setSimple('motDePasse')}
              placeholder={t('auth.password')}
              className={cn(INPUT, 'pr-10')}
              style={INPUT_STYLE}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </>
      )}

      {/* ── PME fields ── */}
      {profileType === 'pme' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={pmeForm.nomEntreprise}
              onChange={setPme('nomEntreprise')}
              placeholder={t('auth.companyName')}
              className={INPUT}
              style={INPUT_STYLE}
            />
            <input
              type="tel"
              value={pmeForm.telephoneEntreprise}
              onChange={setPme('telephoneEntreprise')}
              placeholder="+212 6 00 00 00 00"
              className={INPUT}
              style={INPUT_STYLE}
            />
          </div>
          <input
            type="email"
            required
            value={pmeForm.emailEntreprise}
            onChange={setPme('emailEntreprise')}
            placeholder={t('auth.companyEmail')}
            className={INPUT}
            style={INPUT_STYLE}
          />
          <div
            className="pt-3 mt-1"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'rgba(255,255,255,0.30)' }}>
              {t('auth.adminSection')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={pmeForm.nomAdmin}
                onChange={setPme('nomAdmin')}
                placeholder={t('auth.yourName')}
                className={INPUT}
                style={INPUT_STYLE}
              />
              <input
                type="email"
                required
                value={pmeForm.emailAdmin}
                onChange={setPme('emailAdmin')}
                placeholder={t('auth.email')}
                className={INPUT}
                style={INPUT_STYLE}
              />
            </div>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={pmeForm.motDePasse}
              onChange={setPme('motDePasse')}
              placeholder={t('auth.password')}
              className={cn(INPUT, 'pr-10')}
              style={INPUT_STYLE}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </>
      )}

      {/* ── Terms ── */}
      <div
        className="flex items-start gap-3 p-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <input
          id="terms"
          type="checkbox"
          required
          checked={agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded shrink-0 cursor-pointer accent-amber-500"
        />
        <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {t('auth.termsAgree')}{' '}
          <Link href="/legal/terms" target="_blank" className="hover:underline" style={{ color: '#C49A2E' }}>
            {t('auth.termsTermsLink')}
          </Link>
          {t('auth.termsComma')}{' '}
          {t('auth.termsPrivacyIntro') && <>{t('auth.termsPrivacyIntro')}{' '}</>}
          <Link href="/legal/privacy" target="_blank" className="hover:underline" style={{ color: '#C49A2E' }}>
            {t('auth.termsPrivacyLink')}
          </Link>
          {t('auth.termsAndThe')}{' '}
          <Link href="/legal/refund" target="_blank" className="hover:underline" style={{ color: '#C49A2E' }}>
            {t('auth.termsRefundLink')}
          </Link>{' '}
          {t('auth.termsBrand')}
        </label>
      </div>

      {/* ── CTA button ── */}
      <button
        type="submit"
        disabled={loading || !agreedToTerms}
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: loading || !agreedToTerms
            ? 'rgba(196,154,46,0.4)'
            : 'linear-gradient(135deg, #D4A520 0%, #C49A2E 100%)',
          color: '#0A0A0F',
        }}
      >
        {loading ? t('auth.registering') : t('auth.enterBtn')}
      </button>

      <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: '#C49A2E' }}>
          {t('auth.signIn')}
        </Link>
      </p>
    </form>
  )
}
