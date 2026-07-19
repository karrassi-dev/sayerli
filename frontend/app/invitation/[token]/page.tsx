'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, AlertCircle, Clock, Building2 } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'
import { invitationInfoApi } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'

interface InvitationInfo {
  invalid?: boolean
  expired?: boolean
  nomComplet?: string
  email?: string
  entrepriseNom?: string
  role?: string
  needsPassword?: boolean
}

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const { t } = useTranslation()

  const [info, setInfo] = useState<InvitationInfo | null>(null)
  const [infoLoading, setInfoLoading] = useState(true)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')

  // Fetch invitation info on mount
  useEffect(() => {
    invitationInfoApi.info(token)
      .then(res => setInfo(res.data?.data || res.data))
      .catch(() => setInfo({ invalid: true }))
      .finally(() => setInfoLoading(false))
  }, [token])

  // ── Case A: existing account — just join ────────────────────────────────────
  async function handleJoin() {
    setError('')
    setLoading(true)
    try {
      const res = await invitationInfoApi.accept(token)
      const data = res.data?.data || res.data
      if (data.existingAccount) {
        setDone(true)
        setTimeout(() => router.push('/login'), 3000)
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erreur lors de la jonction.'))
    } finally {
      setLoading(false)
    }
  }

  // ── Case B: new user — set password ────────────────────────────────────────
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setFieldError('')

    if (password.length < 8) { setFieldError(t('auth.invitation.minLength')); return }
    if (password !== confirm) { setFieldError(t('auth.invitation.passwordMismatch')); return }

    setLoading(true)
    try {
      await invitationInfoApi.accept(token, password)
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Lien invalide ou expiré.'))
    } finally {
      setLoading(false)
    }
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (infoLoading) {
    return (
      <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </AuthShell>
    )
  }

  // ── Invalid link ────────────────────────────────────────────────────────────
  if (info?.invalid) {
    return (
      <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {t('auth.invitation.invalidTitle')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('auth.invitation.invalidSub')}
            </p>
          </div>
          <button onClick={() => router.push('/login')} className="btn-primary text-sm mt-2">
            {t('auth.signIn')}
          </button>
        </div>
      </AuthShell>
    )
  }

  // ── Expired link ────────────────────────────────────────────────────────────
  if (info?.expired) {
    return (
      <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {t('auth.invitation.expiredTitle')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('auth.invitation.expiredSub')}
            </p>
          </div>
        </div>
      </AuthShell>
    )
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  if (done) {
    const isJoin = !info?.needsPassword
    return (
      <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {isJoin
                ? t('auth.invitation.joinedTitle').replace('{entreprise}', info?.entrepriseNom ?? '')
                : t('auth.invitation.activatedTitle')
              }
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isJoin ? t('auth.invitation.joinedSub') : t('auth.invitation.activatedSub')}
            </p>
          </div>
        </div>
      </AuthShell>
    )
  }

  // ── Case A: existing Sayerli user joining a new company ─────────────────────
  if (info && !info.needsPassword) {
    return (
      <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {t('auth.invitation.joinTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t('auth.invitation.joinSub')}
          </p>
        </div>

        {/* Company card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white truncate">{info.entrepriseNom}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {info.email} · {info.role?.charAt(0)}{info.role?.slice(1).toLowerCase().replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? t('auth.invitation.joining')
            : t('auth.invitation.joinBtn').replace('{entreprise}', info.entrepriseNom ?? '')}
        </button>
      </AuthShell>
    )
  }

  // ── Case B: new user — create password ──────────────────────────────────────
  return (
    <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          {t('auth.invitation.createPassword')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t('auth.invitation.createPasswordSub')}
        </p>
      </div>

      {/* Company info banner */}
      {info?.entrepriseNom && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 mb-5">
          <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <span className="font-semibold">{info.entrepriseNom}</span> vous invite en tant que{' '}
            <span className="font-semibold">{info.role?.charAt(0)}{info.role?.slice(1).toLowerCase().replace(/_/g, ' ')}</span>
          </p>
        </div>
      )}

      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('auth.invitation.password')}
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('auth.invitation.passwordPlaceholder')}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
              required
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('auth.invitation.confirmPassword')}
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder={t('auth.invitation.confirmPasswordPlaceholder')}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
              required
            />
            <button type="button" onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {fieldError && (
          <p className="text-red-600 dark:text-red-400 text-sm">{fieldError}</p>
        )}

        <button type="submit" disabled={loading}
          className="w-full btn-primary py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
          {loading ? t('auth.invitation.activating') : t('auth.invitation.activateBtn')}
        </button>
      </form>
    </AuthShell>
  )
}
