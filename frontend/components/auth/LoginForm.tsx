'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

const INPUT = [
  'w-full text-sm px-4 py-3.5 rounded-xl outline-none transition-all',
  'bg-black/[0.04] border border-black/[0.10] text-[#1A1828] placeholder:text-black/30',
  'dark:bg-white/[0.05] dark:border-white/[0.09] dark:text-[#F5F0E8] dark:placeholder:text-white/30',
  'focus:border-[#C49228] focus:ring-2 focus:ring-[#C49228]/10',
  'dark:focus:border-[#C49228] dark:focus:ring-[#C49228]/10',
].join(' ')

export function LoginForm() {
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const subText  = isDark ? 'rgba(245,240,232,0.45)' : 'rgba(26,24,40,0.45)'
  const divColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,24,40,0.07)'

  return (
    <form onSubmit={async e => { e.preventDefault(); await login(email, password) }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="email" required
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          className={INPUT}
        />

        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
            <Link
              href="/forgot-password"
              style={{ fontSize: '0.75rem', color: '#C49228' }}
              className="hover:underline"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
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
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: divColor, margin: '16px 0' }} />

      {/* CTA */}
      <button
        type="submit" disabled={loading}
        style={{
          width: '100%',
          height: 52, borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          background: 'linear-gradient(135deg, #C49228 0%, #E5A820 100%)',
          color: '#0A0600',
          fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase',
          boxShadow: !loading ? '0 4px 22px rgba(196,146,40,0.38)' : 'none',
          opacity: loading ? 0.45 : 1,
          transition: 'all 0.2s',
        }}
      >
        {loading ? t('auth.loggingIn') : t('auth.enterBtn')}
      </button>

      {/* Sign up link */}
      <p style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: 14, color: subText }}>
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: '#C49228' }}>
          {t('auth.signUp')}
        </Link>
      </p>
    </form>
  )
}
