'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'

const INPUT = 'w-full px-4 py-3 rounded-xl text-white placeholder:text-white/35 text-sm focus:outline-none transition-all'
const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.10)',
}

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
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#FCA5A5' }}
        >
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
        className={INPUT}
        style={INPUT_STYLE}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>{t('auth.password')}</span>
          <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: '#C49A2E' }}>
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
            className={cn(INPUT, 'pr-10')}
            style={INPUT_STYLE}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: loading
            ? 'rgba(196,154,46,0.4)'
            : 'linear-gradient(135deg, #D4A520 0%, #C49A2E 100%)',
          color: '#0A0A0F',
        }}
      >
        {loading ? t('auth.loggingIn') : t('auth.enterBtn')}
      </button>

      <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: '#C49A2E' }}>
          {t('auth.signUp')}
        </Link>
      </p>
    </form>
  )
}
