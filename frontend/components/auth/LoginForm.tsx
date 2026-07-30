'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'

export function LoginForm() {
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const inputBg   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(30,23,67,0.04)'
  const inputBdr  = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(30,23,67,0.12)'
  const textMain  = isDark ? 'rgba(245,243,255,0.92)' : '#1e1743'
  const textSub   = isDark ? 'rgba(245,243,255,0.48)' : 'rgba(30,23,67,0.52)'
  const divClr    = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.10)'
  const linkColor = isDark ? '#818cf8'               : '#4f46e5'

  const inputClass = [
    'w-full text-sm px-4 py-3 rounded-xl outline-none transition-all',
    'placeholder:opacity-40',
    'focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]',
  ].join(' ')
  const inputStyle = {
    background: inputBg,
    border: `1.5px solid ${inputBdr}`,
    color: textMain,
  }

  return (
    <motion.form
      onSubmit={async e => { e.preventDefault(); await login(email, password) }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="mb-6">
        <div
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#6366f1)', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}
        >
          <LogIn className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: textMain }}>
          {t('auth.loginTitle')}
        </h1>
        <p className="text-sm" style={{ color: textSub }}>{t('auth.loginSub')}</p>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="email" required
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          className={inputClass} style={inputStyle}
        />

        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
            <Link href="/forgot-password" style={{ fontSize: '0.75rem', color: linkColor }} className="hover:underline">
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              style={{ ...inputStyle, paddingRight: 44 }}
            />
            <button
              type="button" onClick={() => setShowPass(v => !v)}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                color: textSub, background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: divClr, margin: '16px 0' }} />

      <motion.button
        type="submit" disabled={loading}
        whileHover={!loading ? { scale: 1.01, boxShadow: '0 6px 28px rgba(79,70,229,0.45)' } : {}}
        whileTap={!loading ? { scale: 0.985 } : {}}
        style={{
          width: '100%',
          height: 52, borderRadius: 14, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: 'linear-gradient(135deg, #4f46e5 0%, #4f46e5 100%)',
          color: '#ffffff',
          fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.03em',
          boxShadow: !loading ? '0 4px 20px rgba(79,70,229,0.38)' : 'none',
          opacity: loading ? 0.48 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
      </motion.button>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: 14, color: textSub }}>
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: linkColor }}>
          {t('auth.signUp')} →
        </Link>
      </p>
    </motion.form>
  )
}
