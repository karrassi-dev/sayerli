'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Building2, User, Phone, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

export function RegisterForm() {
  const { t } = useTranslation()
  const { register, loading, error } = useAuth()

  const [form, setForm] = useState({
    nomEntreprise: '',
    emailEntreprise: '',
    telephoneEntreprise: '',
    nomAdmin: '',
    emailAdmin: '',
    motDePasse: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register(form)
  }

  const inputClass = 'w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {t('auth.companyName')}
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" required value={form.nomEntreprise} onChange={set('nomEntreprise')}
              placeholder="Mon Entreprise SARL"
              className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Téléphone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="tel" value={form.telephoneEntreprise} onChange={set('telephoneEntreprise')}
              placeholder="+212 6 00 00 00 00"
              className={inputClass} />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Email entreprise
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="email" required value={form.emailEntreprise} onChange={set('emailEntreprise')}
            placeholder="contact@monentreprise.ma"
            className={inputClass} />
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium uppercase tracking-wide">
          Compte administrateur
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.yourName')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" required value={form.nomAdmin} onChange={set('nomAdmin')}
                placeholder="Mohammed Alami"
                className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" required value={form.emailAdmin} onChange={set('emailAdmin')}
                placeholder="vous@monentreprise.ma"
                className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {t('auth.password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            value={form.motDePasse}
            onChange={set('motDePasse')}
            placeholder="Min. 8 caractères"
            className={`${inputClass} pr-10`}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? t('auth.registering') : t('auth.registerBtn')}
      </button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          {t('auth.signIn')}
        </Link>
      </p>
    </form>
  )
}
