'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const INPUT = 'w-full bg-transparent text-white text-sm placeholder:text-white/30 outline-none transition-colors py-3.5 border-0 border-b border-white/[0.18] focus:border-[#B8922A]'

export function LoginForm() {
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={async e => { e.preventDefault(); await login(email, password) }}>
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-sm"
          style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.22)', color: '#FCA5A5', borderRadius: 2 }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1">
        <input
          type="email" required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          className={INPUT}
        />

        <div>
          <div className="flex items-center justify-between pt-2 pb-0.5">
            <span className="text-[10px] uppercase tracking-[0.12em]"
              style={{ color: 'rgba(255,255,255,0.24)' }}>
              {t('auth.password')}
            </span>
            <Link href="/forgot-password" className="text-xs hover:underline"
              style={{ color: '#B8922A' }}>
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
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

      {/* CTA */}
      <button
        type="submit" disabled={loading}
        className="w-full mt-6 font-black tracking-widest uppercase transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          height: 52,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #B8922A 0%, #D97706 100%)',
          color: '#0A0505',
          fontWeight: 800,
          fontSize: '0.75rem',
          letterSpacing: '0.10em',
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
