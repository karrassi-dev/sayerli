'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

type ProfileType = 'freelancer' | 'entrepreneur' | 'pme'

const PROFILES: { key: ProfileType; label: string }[] = [
  { key: 'freelancer',   label: 'Freelancer'   },
  { key: 'entrepreneur', label: 'Entrepreneur' },
  { key: 'pme',          label: 'PME'          },
]

const INPUT = 'w-full text-white text-sm placeholder:text-white/30 outline-none px-4 py-3.5 rounded-lg transition-colors'
const IS: React.CSSProperties = { background: 'rgba(8,6,2,0.75)', border: '1px solid rgba(196,154,46,0.24)' }

const AVATARS = [
  { bg: '#7C5B3A', l: 'Y' },
  { bg: '#4A6348', l: 'A' },
  { bg: '#3C4A6B', l: 'K' },
  { bg: '#6B3C5A', l: 'N' },
]

export function RegisterForm() {
  const { t } = useTranslation()
  const { register, loading, error } = useAuth()

  const [profileType, setProfileType] = useState<ProfileType>('freelancer')
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const [sf, setSf] = useState({ nom: '', email: '', motDePasse: '' })
  const [pf, setPf] = useState({
    nomEntreprise: '', emailEntreprise: '', telephoneEntreprise: '',
    nomAdmin: '', emailAdmin: '', motDePasse: '',
  })

  const ss = (k: keyof typeof sf) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSf(p => ({ ...p, [k]: e.target.value }))
  const sp = (k: keyof typeof pf) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPf(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (profileType === 'pme') {
      await register({ ...pf, typeCompte: 'pme' })
    } else {
      await register({
        nomEntreprise: sf.nom,
        emailEntreprise: sf.email,
        nomAdmin: sf.nom,
        emailAdmin: sf.email,
        motDePasse: sf.motDePasse,
        typeCompte: profileType,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-sm rounded-lg"
          style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.22)', color: '#FCA5A5' }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile selector — pill separator style */}
      <div className="flex items-center justify-center gap-1.5 mb-5">
        {PROFILES.map(({ key, label }, i) => {
          const active = profileType === key
          return (
            <div key={key} className="flex items-center gap-1.5">
              {i > 0 && (
                <span style={{ color: 'rgba(255,255,255,0.26)', fontSize: '0.78rem', userSelect: 'none' }}>·</span>
              )}
              <button
                type="button"
                onClick={() => setProfileType(key)}
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,0.42)',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.88rem',
                  background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                  border: active ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                  borderRadius: 6,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Freelancer / Entrepreneur fields ── */}
      {profileType !== 'pme' && (
        <div className="space-y-3">
          <input
            type="text" required
            value={sf.nom} onChange={ss('nom')}
            placeholder="Nom"
            className={INPUT} style={IS}
          />
          <input
            type="email" required
            value={sf.email} onChange={ss('email')}
            placeholder="Email"
            className={INPUT} style={IS}
          />
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'} required minLength={8}
              value={sf.motDePasse} onChange={ss('motDePasse')}
              placeholder="Mot de passe"
              className={cn(INPUT, 'pr-10')} style={IS}
            />
            <button
              type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'rgba(255,255,255,0.30)' }}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* ── PME fields ── */}
      {profileType === 'pme' && (
        <div className="space-y-3">
          <input
            type="text" required
            value={pf.nomEntreprise} onChange={sp('nomEntreprise')}
            placeholder={t('auth.companyName')}
            className={INPUT} style={IS}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email" required
              value={pf.emailEntreprise} onChange={sp('emailEntreprise')}
              placeholder={t('auth.email')}
              className={INPUT} style={IS}
            />
            <input
              type="tel"
              value={pf.telephoneEntreprise} onChange={sp('telephoneEntreprise')}
              placeholder="+212 6 00 00 00 00"
              className={INPUT} style={IS}
            />
          </div>
          <div style={{ height: 1, background: 'rgba(184,146,42,0.12)', margin: '2px 0' }} />
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {t('auth.adminSection')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" required
              value={pf.nomAdmin} onChange={sp('nomAdmin')}
              placeholder={t('auth.yourName')}
              className={INPUT} style={IS}
            />
            <input
              type="email" required
              value={pf.emailAdmin} onChange={sp('emailAdmin')}
              placeholder={t('auth.email')}
              className={INPUT} style={IS}
            />
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'} required minLength={8}
              value={pf.motDePasse} onChange={sp('motDePasse')}
              placeholder="Mot de passe"
              className={cn(INPUT, 'pr-10')} style={IS}
            />
            <button
              type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'rgba(255,255,255,0.30)' }}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Terms */}
      <div
        className="flex items-start gap-3 mt-4 pt-3.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <input
          id="terms" type="checkbox" required
          checked={agreed} onChange={e => setAgreed(e.target.checked)}
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

      {/* CTA button */}
      <button
        type="submit"
        disabled={loading || !agreed}
        className="w-full mt-4 font-bold uppercase tracking-wide transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          height: 52,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #C49228 0%, #E09820 100%)',
          color: '#0A0600',
          fontSize: '0.85rem',
          letterSpacing: '0.06em',
          border: 'none',
          cursor: loading || !agreed ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? t('auth.registering') : t('auth.enterBtn')}
      </button>

      {/* Avatar social proof */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <div className="flex -space-x-2">
          {AVATARS.map((av, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: av.bg, borderColor: '#080808', zIndex: 10 - i }}
            >
              {av.l}
            </div>
          ))}
        </div>
        <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.42)' }}>
          +3 200 entreprises marocaines
        </span>
      </div>

      {/* Sign in link */}
      <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.28)' }}>
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: '#B8922A' }}>
          {t('auth.signIn')}
        </Link>
      </p>
    </form>
  )
}
