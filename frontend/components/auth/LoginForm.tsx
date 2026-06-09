'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {t('auth.email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vous@entreprise.ma"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t('auth.password')}
          </label>
          <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
            {t('auth.forgotPassword')}
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
      </button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          {t('auth.signUp')}
        </Link>
      </p>
    </form>
  )
}
