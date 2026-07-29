'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const INPUT = 'w-full text-white text-sm placeholder:text-white/30 outline-none px-4 py-3.5 rounded-lg transition-colors'
const IS: React.CSSProperties = { background: 'rgba(8,6,2,0.75)', border: '1px solid rgba(196,154,46,0.24)' }

export function LoginForm() {
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  return (
    <form onSubmit={async e => { e.preventDefault(); await login(email, password) }}>
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-sm rounded-lg"
          style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.22)', color: '#FCA5A5' }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        <input
          type="email" required
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          className={INPUT} style={IS}
        />

        <div>
          <div className="flex items-center justify-end mb-1.5">
            <Link href="/forgot-password" className="text-[11px] hover:underline" style={{ color: '#B8922A' }}>
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'} required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
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
      </div>

      {/* CTA */}
      <button
        type="submit" disabled={loading}
        className="w-full mt-5 font-bold uppercase tracking-wide transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          height: 52,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #C49228 0%, #E09820 100%)',
          color: '#0A0600',
          fontSize: '0.85rem',
          letterSpacing: '0.06em',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? t('auth.loggingIn') : t('auth.enterBtn')}
      </button>

      <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.28)' }}>
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: '#B8922A' }}>
          {t('auth.signUp')}
        </Link>
      </p>
    </form>
  )
}
