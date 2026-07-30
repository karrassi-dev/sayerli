'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, CheckCircle, ShieldCheck, MapPin, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { RoleSelector, type RoleType } from './RoleSelector'

// ── Password strength ───────────────────────────────────────────────
function getStrength(pw: string): 0 | 1 | 2 | 3 {
  let score = 0
  if (pw.length >= 8)                        score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw))                      score++
  return Math.min(score, 3) as 0 | 1 | 2 | 3
}

const STRENGTH_COLOR = ['#ef4444', '#f59e0b', '#22c55e', '#4f46e5'] as const
const STRENGTH_KEY   = ['pwWeak', 'pwFair', 'pwGood', 'pwStrong']  as const

export function RegisterForm() {
  const { t } = useTranslation()
  const { register, loading, error } = useAuth()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [profile, setProfile] = useState<RoleType>('entrepreneur')
  const [showPass, setShowPass]   = useState(false)
  const [agreed, setAgreed]       = useState(false)

  // Solo fields (freelancer / entrepreneur)
  const [sf, setSf] = useState({ nom: '', email: '', motDePasse: '' })
  // PME fields
  const [pf, setPf] = useState({
    nomEntreprise: '', emailEntreprise: '', telephoneEntreprise: '',
    nomAdmin: '', emailAdmin: '', motDePasse: '',
  })

  const ss = (k: keyof typeof sf) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSf(p => ({ ...p, [k]: e.target.value }))
  const sp = (k: keyof typeof pf) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPf(p => ({ ...p, [k]: e.target.value }))

  const currentPw  = profile === 'pme' ? pf.motDePasse : sf.motDePasse
  const strength   = currentPw.length ? getStrength(currentPw) : -1 as const

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

  // ── Dynamic styles ─────────────────────────────────────────────────
  const inputBg  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.04)'
  const inputBdr = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(99,102,241,0.14)'
  const textMain = isDark ? '#f1f5f9'                : '#1e1b4b'
  const textSub  = isDark ? 'rgba(148,163,184,0.85)' : 'rgba(71,85,105,0.75)'
  const divClr   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.10)'
  const labelClr = isDark ? 'rgba(148,163,184,0.45)' : 'rgba(99,102,241,0.40)'
  const linkClr  = isDark ? '#818cf8'                : '#4f46e5'

  const inputClass = [
    'w-full text-sm px-4 py-3 rounded-xl outline-none transition-all',
    'placeholder:opacity-40',
    'focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
  ].join(' ')
  const inputStyle = {
    background: inputBg,
    border: `1.5px solid ${inputBdr}`,
    color: textMain,
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="mb-5">
        <div
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}
        >
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: textMain }}>
          {t('auth.registerTitle')}
        </h1>

        {/* Trust pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { icon: <CheckCircle className="w-3 h-3" />, label: t('auth.noCreditCard') },
            { icon: <CheckCircle className="w-3 h-3" />, label: t('auth.cancelAnytime') },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
                color: isDark ? '#a5b4fc' : '#4f46e5',
                border: isDark ? '1px solid rgba(99,102,241,0.22)' : '1px solid rgba(99,102,241,0.18)',
              }}
            >
              {icon}{label}
            </span>
          ))}
        </div>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2.5 p-3 mb-4 text-sm rounded-xl"
            style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.22)', color: '#fca5a5' }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role selector */}
      <div className="mb-5">
        <RoleSelector
          value={profile}
          onChange={setProfile}
          isDark={isDark}
          legend={t('auth.chooseProfile')}
          sublabel={t('auth.whoAreYouSub')}
          labels={{
            entrepreneur: t('auth.roleEntrepreneurName'),
            freelance:    t('auth.roleFreelanceName'),
            pme:          t('auth.rolePmeName'),
          }}
          descs={{
            entrepreneur: t('auth.roleEntrepreneurDesc'),
            freelance:    t('auth.roleFreelanceDesc'),
            pme:          t('auth.rolePmeDesc'),
          }}
        />
      </div>

      {/* ── Fields: Freelancer / Entrepreneur ─────────── */}
      <AnimatePresence mode="wait">
        {profile !== 'pme' ? (
          <motion.div
            key="solo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <input
              type="text" required
              value={sf.nom} onChange={ss('nom')}
              placeholder={t('auth.yourNameOrBrand')}
              className={inputClass} style={inputStyle}
            />
            <input
              type="email" required
              value={sf.email} onChange={ss('email')}
              placeholder={t('auth.yourEmail')}
              className={inputClass} style={inputStyle}
            />
            <PasswordField
              value={sf.motDePasse}
              onChange={ss('motDePasse')}
              show={showPass}
              onToggle={() => setShowPass(v => !v)}
              isDark={isDark}
              inputClass={inputClass}
              inputStyle={inputStyle}
              textSub={textSub}
              strength={strength}
              t={t}
            />
          </motion.div>
        ) : (
          <motion.div
            key="pme"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <input
              type="text" required
              value={pf.nomEntreprise} onChange={sp('nomEntreprise')}
              placeholder={t('auth.companyName')}
              className={inputClass} style={inputStyle}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                type="email" required
                value={pf.emailEntreprise} onChange={sp('emailEntreprise')}
                placeholder={t('auth.companyEmail')}
                className={inputClass} style={inputStyle}
              />
              <input
                type="tel"
                value={pf.telephoneEntreprise} onChange={sp('telephoneEntreprise')}
                placeholder="+212 6 00 00 00"
                className={inputClass} style={inputStyle}
              />
            </div>

            {/* Admin divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
              <div style={{ flex: 1, height: 1, background: divClr }} />
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: labelClr, whiteSpace: 'nowrap' }}>
                {t('auth.adminSection')}
              </span>
              <div style={{ flex: 1, height: 1, background: divClr }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                type="text" required
                value={pf.nomAdmin} onChange={sp('nomAdmin')}
                placeholder={t('auth.yourName')}
                className={inputClass} style={inputStyle}
              />
              <input
                type="email" required
                value={pf.emailAdmin} onChange={sp('emailAdmin')}
                placeholder={t('auth.email')}
                className={inputClass} style={inputStyle}
              />
            </div>
            <PasswordField
              value={pf.motDePasse}
              onChange={sp('motDePasse')}
              show={showPass}
              onToggle={() => setShowPass(v => !v)}
              isDark={isDark}
              inputClass={inputClass}
              inputStyle={inputStyle}
              textSub={textSub}
              strength={strength}
              t={t}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms */}
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${divClr}` }}
      >
        <input
          id="terms" type="checkbox" required
          checked={agreed} onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 shrink-0 cursor-pointer accent-violet-500"
        />
        <label htmlFor="terms" style={{ fontSize: '0.70rem', lineHeight: 1.55, cursor: 'pointer', color: textSub }}>
          {t('auth.termsAgree')}{' '}
          <Link href="/legal/terms"   target="_blank" style={{ color: linkClr }} className="hover:underline">{t('auth.termsTermsLink')}</Link>
          {t('auth.termsComma')}{' '}
          {t('auth.termsPrivacyIntro') && <>{t('auth.termsPrivacyIntro')}{' '}</>}
          <Link href="/legal/privacy" target="_blank" style={{ color: linkClr }} className="hover:underline">{t('auth.termsPrivacyLink')}</Link>
          {t('auth.termsAndThe')}{' '}
          <Link href="/legal/refund"  target="_blank" style={{ color: linkClr }} className="hover:underline">{t('auth.termsRefundLink')}</Link>
          {' '}{t('auth.termsBrand')}
        </label>
      </div>

      {/* CTA */}
      <motion.button
        type="submit"
        disabled={loading || !agreed}
        whileHover={!loading && agreed ? { scale: 1.01, boxShadow: '0 6px 28px rgba(79,70,229,0.45)' } : {}}
        whileTap={!loading && agreed ? { scale: 0.985 } : {}}
        style={{
          width: '100%', marginTop: 14,
          height: 52, borderRadius: 14, border: 'none',
          cursor: loading || !agreed ? 'not-allowed' : 'pointer',
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
          color: '#ffffff',
          fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.03em',
          boxShadow: agreed && !loading ? '0 4px 20px rgba(79,70,229,0.38)' : 'none',
          opacity: loading || !agreed ? 0.48 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? t('auth.registering') : t('auth.registerBtn')}
      </motion.button>

      {/* Trust row */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-4"
        style={{ fontSize: '0.65rem', color: textSub }}
      >
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 opacity-60" />{t('auth.trustData')}
        </span>
        <span className="opacity-30">·</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 opacity-60" />{t('auth.trustLegal')}
        </span>
        <span className="opacity-30">·</span>
        <span className="flex items-center gap-1">
          <CreditCard className="w-3 h-3 opacity-60" />{t('auth.trustPay')}
        </span>
      </div>

      {/* Sign-in link */}
      <p style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: 14, color: textSub }}>
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: linkClr }}>
          {t('auth.signIn')} →
        </Link>
      </p>
    </motion.form>
  )
}

// ── Password sub-component ────────────────────────────────────────────
interface PasswordFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  show: boolean
  onToggle: () => void
  isDark: boolean
  inputClass: string
  inputStyle: React.CSSProperties
  textSub: string
  strength: number
  t: (k: string) => string
}

function PasswordField({ value, onChange, show, onToggle, isDark, inputClass, inputStyle, textSub, strength, t }: PasswordFieldProps) {
  const bars = [0, 1, 2]

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'} required minLength={8}
          value={value} onChange={onChange}
          placeholder={t('auth.password')}
          className={inputClass}
          style={{ ...inputStyle, paddingRight: 44 }}
        />
        <button
          type="button" onClick={onToggle}
          style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            color: textSub, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
          }}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Strength indicator */}
      {value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-1.5 flex items-center gap-2"
        >
          <div className="flex gap-1 flex-1">
            {bars.map(i => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  background: i <= strength
                    ? STRENGTH_COLOR[Math.max(0, strength)]
                    : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(30,23,67,0.08)',
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium" style={{ color: STRENGTH_COLOR[Math.max(0, strength)], minWidth: 34 }}>
            {t(STRENGTH_KEY[Math.max(0, strength)])}
          </span>
        </motion.div>
      )}
    </div>
  )
}
