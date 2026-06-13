'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail } from 'lucide-react'

function VerificationEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Vérifiez votre email
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mb-2">
          Nous avons envoyé un lien de confirmation à :
        </p>

        {email && (
          <p className="font-semibold text-slate-900 dark:text-white mb-6">
            {email}
          </p>
        )}

        <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
          Cliquez sur le lien dans l&apos;email pour activer votre compte. Le lien est valide pendant 24 heures.
        </p>

        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Vous n&apos;avez pas reçu l&apos;email ?{' '}
            <Link href="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Réessayer
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerificationEmailPage() {
  return (
    <Suspense>
      <VerificationEmailContent />
    </Suspense>
  )
}
