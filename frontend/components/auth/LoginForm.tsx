'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const INPUT_BASE = 'w-full bg-transparent text-white text-sm placeholder:text-white/28 outline-none transition-colors py-3.5 border-0 border-b focus:border-[#B8922A]'

export function LoginForm() {
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0">

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 text-sm"
          style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#FCA5A5', borderRadius: 0 }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t('auth.email')}
        className={INPUT_BASE}
        style={{ borderRadius: 0, borderBottomColor: 'rgba(255,255,255,0.14)' }}
      />

      <div className="relative">
        <div className="flex items-center justify-between pt-3 pb-0">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>{t('auth.password')}</span>
          <Link href="/forgot-password" className="text-xs hover:underline transition-colors" style={{ color: '#B8922A' }}>
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className={cn(INPUT_BASE, 'pr-9')}
            style={{ borderRadius: 0, borderBottomColor: 'rgba(255,255,255,0.14)' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'rgba(255,255,255,0.28)' }}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* CTA — architectural, full-width, zero radius */}
      <button
        type="submit"
        disabled={loading}
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
          marginTop: '1.5rem',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? t('auth.loggingIn') : t('auth.enterBtn')}
      </button>

      <p className="text-center text-xs pt-4" style={{ color: 'rgba(255,255,255,0.32)' }}>
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: '#B8922A' }}>
          {t('auth.signUp')}
        </Link>
      </p>
    </form>
  )
}
