'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export default function ConfirmationEmailPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return

    axios.get(`${API_URL}/auth/confirmer-email/${token}`)
      .then((res) => {
        const data = res.data?.data || res.data
        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken)
        }
        setStatus('success')
        setMessage(data.message)
        setTimeout(() => router.push('/dashboard'), 2000)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Lien invalide ou expiré.')
      })
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">

        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Vérification en cours...
            </h1>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Email confirmé !
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{message}</p>
            <p className="text-sm text-slate-400">Redirection vers le dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Lien invalide
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>
            <a
              href="/register"
              className="inline-block bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
            >
              Créer un nouveau compte
            </a>
          </>
        )}

      </div>
    </div>
  )
}
