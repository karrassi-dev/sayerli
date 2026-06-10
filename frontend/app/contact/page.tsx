'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Mail, Clock, ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { contactApi } from '@/lib/api'
import { cn } from '@/lib/utils'

interface FormState {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
}

const EMPTY: FormState = {
  name: '', email: '', phone: '', company: '', subject: '', message: '',
}

interface FieldErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const { t, dir } = useTranslation()
  const { ref: heroRef, visible: heroVisible } = useScrollAnimation(0.05)
  const { ref: contentRef, visible: contentVisible } = useScrollAnimation(0.05)
  const { toasts, success, error: toastError, removeToast } = useToast()

  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field as keyof FieldErrors]) {
      setErrors(e => ({ ...e, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!form.name.trim()) next.name = t('contact.form.required')
    if (!form.email.trim()) next.email = t('contact.form.required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = t('contact.form.invalidEmail')
    if (!form.subject.trim()) next.subject = t('contact.form.required')
    if (!form.message.trim()) next.message = t('contact.form.required')
    else if (form.message.trim().length < 10) next.message = t('contact.form.messageTooShort')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      })
      setSent(true)
      setForm(EMPTY)
      setErrors({})
      success(t('contact.successTitle'), t('contact.success'))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
      toastError(
        t('contact.errorTitle'),
        typeof msg === 'string' ? msg : t('contact.error'),
      )
    } finally {
      setLoading(false)
    }
  }

  const inputBase =
    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 dark:focus:border-primary-500'
  const inputNormal = 'border-slate-200 dark:border-slate-700'
  const inputError = 'border-red-400 dark:border-red-500 focus:ring-red-400/30'

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]" dir={dir}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2563eb08_1px,transparent_1px),linear-gradient(to_bottom,#2563eb08_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-teal-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={cn(
              'transition-all duration-700',
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
              {t('contact.hero.badge')}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              {t('contact.hero.title').split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="gradient-text"> {word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section
        ref={contentRef}
        className="pb-28 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <div
            className={cn(
              'grid grid-cols-1 lg:grid-cols-5 gap-8 transition-all duration-700 delay-100',
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
          >
            {/* ── Info card ── */}
            <div className="lg:col-span-2">
              <div className="card rounded-3xl p-8 lg:sticky lg:top-24 space-y-8">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
                    <span className="text-white font-black text-xl">S</span>
                  </div>
                  <div>
                    <div className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                      {t('contact.info.title')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      {t('contact.info.subtitle')}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        {t('contact.info.emailLabel')}
                      </div>
                      <a
                        href="mailto:karrassi.hamza@gmail.com"
                        className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline break-all"
                      >
                        karrassi.hamza@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Response time */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        {t('contact.info.responseTimeLabel')}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t('contact.info.responseTime')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse flex-shrink-0" />
                    <span>Support disponible — Maroc 🇲🇦</span>
                  </div>
                </div>

                {/* Back link */}
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                >
                  <ArrowLeft className={cn(
                    'w-4 h-4 transition-transform group-hover:-translate-x-1',
                    dir === 'rtl' && 'rotate-180 group-hover:translate-x-1 group-hover:-translate-x-0',
                  )} />
                  <span>Retour à l'accueil</span>
                </Link>
              </div>
            </div>

            {/* ── Contact form ── */}
            <div className="lg:col-span-3">
              <div className="card rounded-3xl p-8">
                {sent ? (
                  /* Success state */
                  <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
                    <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                        {t('contact.successTitle')}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                        {t('contact.success')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSent(false)}
                      className="btn-secondary text-sm"
                    >
                      {t('contact.form.submit').replace('Envoyer', 'Nouveau message').replace('Send', 'New message').replace('إرسال', 'رسالة جديدة')}
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {t('contact.form.title')}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('contact.form.subtitle')}
                      </p>
                    </div>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                          {t('contact.form.name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={set('name')}
                          placeholder={t('contact.form.namePlaceholder')}
                          className={cn(inputBase, errors.name ? inputError : inputNormal)}
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                          {t('contact.form.email')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set('email')}
                          placeholder={t('contact.form.emailPlaceholder')}
                          className={cn(inputBase, errors.email ? inputError : inputNormal)}
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone + Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                          {t('contact.form.phone')}{' '}
                          <span className="text-slate-400 font-normal normal-case">
                            ({t('contact.form.optional')})
                          </span>
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set('phone')}
                          placeholder={t('contact.form.phonePlaceholder')}
                          className={cn(inputBase, inputNormal)}
                          autoComplete="tel"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                          {t('contact.form.company')}{' '}
                          <span className="text-slate-400 font-normal normal-case">
                            ({t('contact.form.optional')})
                          </span>
                        </label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={set('company')}
                          placeholder={t('contact.form.companyPlaceholder')}
                          className={cn(inputBase, inputNormal)}
                          autoComplete="organization"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                        {t('contact.form.subject')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={set('subject')}
                        placeholder={t('contact.form.subjectPlaceholder')}
                        className={cn(inputBase, errors.subject ? inputError : inputNormal)}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                        {t('contact.form.message')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={set('message')}
                        placeholder={t('contact.form.messagePlaceholder')}
                        rows={5}
                        className={cn(
                          inputBase,
                          'resize-none',
                          errors.message ? inputError : inputNormal,
                        )}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.message ? (
                          <p className="text-xs text-red-500">{errors.message}</p>
                        ) : (
                          <span />
                        )}
                        <span className={cn(
                          'text-xs tabular-nums',
                          form.message.length > 1800
                            ? 'text-red-500'
                            : 'text-slate-400 dark:text-slate-500',
                        )}>
                          {form.message.length}/2000
                        </span>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t('contact.form.submitting')}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t('contact.form.submit')}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
