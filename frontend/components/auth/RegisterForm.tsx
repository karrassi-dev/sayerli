'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

type ProfileType = 'freelancer' | 'entrepreneur' | 'pme'

const PROFILES: { key: ProfileType; label: string }[] = [
  { key: 'freelancer',   label: 'Freelancer'   },
  { key: 'entrepreneur', label: 'Entrepreneur' },
  { key: 'pme',          label: 'PME'          },
]

const AVATARS = [
  { bg: 'linear-gradient(135deg,#8B5E3C,#A06B40)', l: 'Y' },
  { bg: 'linear-gradient(135deg,#3C6B4A,#4A8059)', l: 'A' },
  { bg: 'linear-gradient(135deg,#3C486B,#4A5C88)', l: 'K' },
  { bg: 'linear-gradient(135deg,#6B3C5A,#884A72)', l: 'S' },
]

// Shared input Tailwind class — works with darkMode: 'class'
const INPUT = [
  'w-full text-sm px-4 py-3.5 rounded-xl outline-none transition-all',
  'bg-black/[0.04] border border-black/[0.16] text-[#1A1206] placeholder:text-black/35',
  'dark:bg-white/[0.05] dark:border-white/[0.09] dark:text-[#F5F0E8] dark:placeholder:text-white/30',
  'focus:border-[#C49228] focus:ring-2 focus:ring-[#C49228]/10',
  'dark:focus:border-[#C49228] dark:focus:ring-[#C49228]/10',
].join(' ')

export function RegisterForm() {
  const { t } = useTranslation()
  const { register, loading, error } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [profile, setProfile] = useState<ProfileType>('freelancer')
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
    if (profile === 'pme') {
      await register({ ...pf, typeCompte: 'pme' })
    } else {
      await register({
        nomEntreprise: sf.nom, emailEntreprise: sf.email,
        nomAdmin: sf.nom, emailAdmin: sf.email,
        motDePasse: sf.motDePasse, typeCompte: profile,
      })
    }
  }

  // Segmented control colours
  const segBg   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(26,20,10,0.08)'
  const segText  = isDark ? 'rgba(245,240,232,0.38)' : 'rgba(26,20,10,0.42)'
  const segActive = isDark ? 'rgba(255,255,255,0.10)' : '#FFFFFF'
  const segActiveShadow = isDark ? 'none' : '0 1px 5px rgba(26,20,10,0.15)'
  const activeText = isDark ? '#F5F0E8' : '#1A1206'
  const subText  = isDark ? 'rgba(245,240,232,0.45)' : 'rgba(26,20,10,0.50)'
  const divColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,20,10,0.10)'
  const labelColor = isDark ? 'rgba(245,240,232,0.22)' : 'rgba(26,20,10,0.38)'
  const linkColor = isDark ? '#C49228' : '#8C6410'

  return (
    <form onSubmit={handleSubmit}>
      {/* Error banner */}
      {error && (
        <div
          className="flex items-center gap-2.5 p-3 mb-4 text-sm rounded-xl"
          style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.20)', color: '#FCA5A5' }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Segmented control ──────────────────────────────────── */}
      <div
        style={{
          display: 'flex', borderRadius: 12, padding: 4,
          background: segBg, marginBottom: 20, gap: 2,
        }}
      >
        {PROFILES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setProfile(key)}
            style={{
              flex: 1, padding: '8px 4px', borderRadius: 9, fontSize: '0.80rem',
              fontWeight: profile === key ? 600 : 400, border: 'none', cursor: 'pointer',
              transition: 'all 0.18s',
              color: profile === key ? activeText : segText,
              background: profile === key ? segActive : 'transparent',
              boxShadow: profile === key ? segActiveShadow : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Freelancer / Auto-entrepreneur fields ─────────────── */}
      {profile !== 'pme' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text" required
            value={sf.nom} onChange={ss('nom')}
            placeholder="Nom"
            className={INPUT}
          />
          <input
            type="email" required
            value={sf.email} onChange={ss('email')}
            placeholder="Email"
            className={INPUT}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} required minLength={8}
              value={sf.motDePasse} onChange={ss('motDePasse')}
              placeholder="Mot de passe"
              className={INPUT}
              style={{ paddingRight: 44 }}
            />
            <button
              type="button" onClick={() => setShowPass(v => !v)}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                color: subText, background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* ── PME fields ────────────────────────────────────────── */}
      {profile === 'pme' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text" required
            value={pf.nomEntreprise} onChange={sp('nomEntreprise')}
            placeholder={t('auth.companyName')}
            className={INPUT}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              type="email" required
              value={pf.emailEntreprise} onChange={sp('emailEntreprise')}
              placeholder={t('auth.email')}
              className={INPUT}
            />
            <input
              type="tel"
              value={pf.telephoneEntreprise} onChange={sp('telephoneEntreprise')}
              placeholder="+212 6 00 00 00"
              className={INPUT}
            />
          </div>

          {/* Admin section divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 0' }}>
            <div style={{ flex: 1, height: 1, background: divColor }} />
            <span style={{ fontSize: '0.68rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: labelColor, whiteSpace: 'nowrap' }}>
              {t('auth.adminSection')}
            </span>
            <div style={{ flex: 1, height: 1, background: divColor }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              type="text" required
              value={pf.nomAdmin} onChange={sp('nomAdmin')}
              placeholder={t('auth.yourName')}
              className={INPUT}
            />
            <input
              type="email" required
              value={pf.emailAdmin} onChange={sp('emailAdmin')}
              placeholder={t('auth.email')}
              className={INPUT}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} required minLength={8}
              value={pf.motDePasse} onChange={sp('motDePasse')}
              placeholder="Mot de passe"
              className={INPUT}
              style={{ paddingRight: 44 }}
            />
            <button
              type="button" onClick={() => setShowPass(v => !v)}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                color: subText, background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Terms checkbox */}
      <div
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          marginTop: 16, paddingTop: 14,
          borderTop: `1px solid ${divColor}`,
        }}
      >
        <input
          id="terms" type="checkbox" required
          checked={agreed} onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 shrink-0 cursor-pointer accent-[#C49228]"
        />
        <label
          htmlFor="terms"
          style={{ fontSize: '0.71rem', lineHeight: 1.55, cursor: 'pointer', color: subText }}
        >
          {t('auth.termsAgree')}{' '}
          <Link href="/legal/terms" target="_blank" style={{ color: linkColor }} className="hover:underline">
            {t('auth.termsTermsLink')}
          </Link>
          {t('auth.termsComma')}{' '}
          {t('auth.termsPrivacyIntro') && <>{t('auth.termsPrivacyIntro')}{' '}</>}
          <Link href="/legal/privacy" target="_blank" style={{ color: linkColor }} className="hover:underline">
            {t('auth.termsPrivacyLink')}
          </Link>
          {t('auth.termsAndThe')}{' '}
          <Link href="/legal/refund" target="_blank" style={{ color: linkColor }} className="hover:underline">
            {t('auth.termsRefundLink')}
          </Link>{' '}
          {t('auth.termsBrand')}
        </label>
      </div>

      {/* CTA button */}
      <button
        type="submit"
        disabled={loading || !agreed}
        style={{
          width: '100%', marginTop: 14,
          height: 52, borderRadius: 12, border: 'none', cursor: loading || !agreed ? 'not-allowed' : 'pointer',
          background: isDark
            ? 'linear-gradient(135deg, #C49228 0%, #E5A820 100%)'
            : 'linear-gradient(135deg, #8C6410 0%, #B8861E 100%)',
          color: isDark ? '#0A0600' : '#FFFBF0',
          fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase',
          boxShadow: agreed && !loading
            ? isDark ? '0 4px 22px rgba(196,146,40,0.38)' : '0 4px 18px rgba(100,70,10,0.30)'
            : 'none',
          opacity: loading || !agreed ? 0.45 : 1,
          transition: 'all 0.2s',
        }}
      >
        {loading ? t('auth.registering') : t('auth.enterBtn')}
      </button>

      {/* Avatar social proof */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 18 }}>
        <div style={{ display: 'flex' }}>
          {AVATARS.map((av, i) => (
            <div
              key={i}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `2px solid ${isDark ? '#1C1B2C' : '#FFFFFF'}`,
                marginLeft: i === 0 ? 0 : -8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: av.bg,
                color: '#fff', fontSize: '0.62rem', fontWeight: 700,
                zIndex: AVATARS.length - i,
                position: 'relative',
              }}
            >
              {av.l}
            </div>
          ))}
        </div>
        <span style={{ fontSize: '0.73rem', color: subText }}>
          +3 200 entreprises marocaines
        </span>
      </div>

      {/* Sign in link */}
      <p style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: 14, color: subText }}>
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: linkColor }}>
          {t('auth.signIn')}
        </Link>
      </p>
    </form>
  )
}
