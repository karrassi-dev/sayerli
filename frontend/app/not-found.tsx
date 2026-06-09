'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useTranslation } from '@/hooks/useTranslation'

const COUNTDOWN = 3

export default function NotFound() {
  const router = useRouter()
  const { t, dir } = useTranslation()
  const [count, setCount] = useState(COUNTDOWN)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get('sayerli_token'))
  }, [])

  useEffect(() => {
    if (count === 0) {
      router.replace(isLoggedIn ? '/dashboard' : '/')
      return
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, isLoggedIn, router])

  const destination = isLoggedIn ? t('notFound.redirectLoggedIn') : t('notFound.redirectGuest')
  const progress = ((COUNTDOWN - count) / COUNTDOWN) * 100

  return (
    <div
      dir={dir}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#0a0a0f]"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-primary-100 to-teal-50 dark:from-primary-950/40 dark:to-teal-950/20 blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-100 dark:bg-teal-950/30 blur-3xl opacity-40" />
        <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-primary-100 dark:bg-primary-950/30 blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="text-center px-6 max-w-lg w-full">
        {/* 404 */}
        <div className="relative mb-6 select-none">
          <span className="text-[10rem] sm:text-[13rem] font-black leading-none gradient-text opacity-10 absolute inset-0 flex items-center justify-center pointer-events-none blur-sm">
            404
          </span>
          <span className="relative text-[10rem] sm:text-[13rem] font-black leading-none gradient-text">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {t('notFound.heading')}
        </h1>

        {/* Message */}
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">
          {t('notFound.message')}
        </p>

        {/* Redirect info */}
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 mb-6">
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
            {destination}
          </p>

          {/* Countdown ring */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-200 dark:text-white/10"
                />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - (COUNTDOWN - count) / COUNTDOWN)}`}
                  className="text-primary-500 transition-all duration-1000 ease-linear"
                  stroke="currentColor"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white">
                {count}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
            {count} {t('notFound.seconds')}
          </p>
        </div>

        {/* Manual redirect button */}
        <button
          onClick={() => router.replace(isLoggedIn ? '/dashboard' : '/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-600 hover:from-primary-500 hover:to-teal-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          {t('notFound.redirectNow')}
        </button>
      </div>
    </div>
  )
}
