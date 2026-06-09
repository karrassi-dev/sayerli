'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'
import { invitationApi } from '@/lib/api'

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldError('')

    if (password.length < 8) {
      setFieldError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      setFieldError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      await invitationApi.accept(token, password)
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Lien invalide ou expiré.'))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Compte activé !
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Redirection vers la page de connexion…
            </p>
          </div>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Créez votre mot de passe
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Choisissez un mot de passe sécurisé pour activer votre compte Sayerli.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Répétez votre mot de passe"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {fieldError && (
          <p className="text-red-600 dark:text-red-400 text-sm">{fieldError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? 'Activation…' : 'Activer mon compte'}
        </button>
      </form>
    </AuthShell>
  )
}
