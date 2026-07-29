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

// Bottom-line input style (architectural — no box, single gold-on-focus line)
const INPUT_BASE = 'w-full bg-transparent text-white text-sm placeholder:text-white/28 outline-none transition-colors py-3.5 border-0 border-b focus:border-[#B8922A]'
const INPUT_STYLE: React.CSSProperties = { borderRadius: 0 }
const BORDER_DEFAULT: React.CSSProperties = { borderBottomColor: 'rgba(255,255,255,0.14)' }

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
    <form onSubmit={handleSubmit} className="space-y-0">

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-none mb-4 text-sm"
          style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#FCA5A5' }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Profile selector — underline tab style ── */}
      <div
        className="flex items-stretch mb-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}
      >
        {PROFILE_TYPES.map(({ key, labelKey }) => {
          const active = profileType === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setProfileType(key)}
              className="flex-1 py-2 text-xs font-semibold transition-all leading-tight text-center"
              style={{
                color: active ? '#B8922A' : 'rgba(255,255,255,0.32)',
                borderBottom: active ? '2px solid #B8922A' : '2px solid transparent',
                marginBottom: -1,
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {t(`auth.${labelKey}`)}
            </button>
          )
        })}
      </div>

      {/* ── Freelancer / Entrepreneur fields ── */}
      {profileType !== 'pme' && (
        <div className="space-y-0">
          <input
            type="text"
            required
            value={simpleForm.nom}
            onChange={setSimple('nom')}
            placeholder={profileType === 'freelancer' ? 'Youssef Benali' : 'Youssef Design'}
            className={INPUT_BASE}
            style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <input
              type="email"
              required
              value={simpleForm.email}
              onChange={setSimple('email')}
              placeholder={t('auth.yourEmail')}
              className={INPUT_BASE}
              style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
            />
            <input
              type="tel"
              value={simpleForm.telephone}
              onChange={setSimple('telephone')}
              placeholder="+212 6 00 00 00 00"
              className={cn(INPUT_BASE, 'sm:border-l sm:border-l-white/8')}
              style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
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
              className={cn(INPUT_BASE, 'pr-9')}
              style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* ── PME fields ── */}
      {profileType === 'pme' && (
        <div className="space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <input
              type="text"
              required
              value={pmeForm.nomEntreprise}
              onChange={setPme('nomEntreprise')}
              placeholder={t('auth.companyName')}
              className={INPUT_BASE}
              style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
            />
            <input
              type="tel"
              value={pmeForm.telephoneEntreprise}
              onChange={setPme('telephoneEntreprise')}
              placeholder="+212 6 00 00 00 00"
              className={cn(INPUT_BASE, 'sm:border-l sm:border-l-white/8')}
              style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
            />
          </div>
          <input
            type="email"
            required
            value={pmeForm.emailEntreprise}
            onChange={setPme('emailEntreprise')}
            placeholder={t('auth.companyEmail')}
            className={INPUT_BASE}
            style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
          />
          {/* Admin section divider */}
          <div className="pt-4 pb-1">
            <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.24)' }}>
              {t('auth.adminSection')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <input
              type="text"
              required
              value={pmeForm.nomAdmin}
              onChange={setPme('nomAdmin')}
              placeholder={t('auth.yourName')}
              className={INPUT_BASE}
              style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
            />
            <input
              type="email"
              required
              value={pmeForm.emailAdmin}
              onChange={setPme('emailAdmin')}
              placeholder={t('auth.email')}
              className={cn(INPUT_BASE, 'sm:border-l sm:border-l-white/8')}
              style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={pmeForm.motDePasse}
              onChange={setPme('motDePasse')}
              placeholder={t('auth.password')}
              className={cn(INPUT_BASE, 'pr-9')}
              style={{ ...INPUT_STYLE, ...BORDER_DEFAULT }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* ── Terms ── */}
      <div className="flex items-start gap-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '1.25rem' }}>
        <input
          id="terms"
          type="checkbox"
          required
          checked={agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 shrink-0 cursor-pointer accent-[#B8922A]"
        />
        <label htmlFor="terms" className="text-[11px] leading-relaxed cursor-pointer" style={{ color: 'rgba(255,255,255,0.38)' }}>
          {t('auth.termsAgree')}{' '}
          <Link href="/legal/terms" target="_blank" className="hover:underline" style={{ color: '#B8922A' }}>{t('auth.termsTermsLink')}</Link>
          {t('auth.termsComma')}{' '}
          {t('auth.termsPrivacyIntro') && <>{t('auth.termsPrivacyIntro')}{' '}</>}
          <Link href="/legal/privacy" target="_blank" className="hover:underline" style={{ color: '#B8922A' }}>{t('auth.termsPrivacyLink')}</Link>
          {t('auth.termsAndThe')}{' '}
          <Link href="/legal/refund" target="_blank" className="hover:underline" style={{ color: '#B8922A' }}>{t('auth.termsRefundLink')}</Link>
          {' '}{t('auth.termsBrand')}
        </label>
      </div>

      {/* ── CTA button — architectural, full-width, zero radius, gold gradient ── */}
      <button
        type="submit"
        disabled={loading || !agreedToTerms}
        className="w-full font-black tracking-wide transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          height: 52,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #B8922A 0%, #D97706 100%)',
          color: '#0A0505',
          fontWeight: 800,
          fontSize: '0.875rem',
          letterSpacing: '0.06em',
          border: 'none',
          cursor: loading || !agreedToTerms ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? t('auth.registering') : t('auth.enterBtn')}
      </button>

      <p className="text-center text-xs pt-4" style={{ color: 'rgba(255,255,255,0.32)' }}>
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: '#B8922A' }}>
          {t('auth.signIn')}
        </Link>
      </p>
    </form>
  )
}
