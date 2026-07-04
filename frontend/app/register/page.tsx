import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { AuthShell } from '@/components/auth/AuthShell'

export const metadata: Metadata = buildMetadata({
  title: 'Créer un compte — Essai gratuit | Sayerli Maroc',
  description:
    'Créez votre compte Sayerli gratuitement. Logiciel de devis, facturation et CRM pour freelancers, auto-entrepreneurs et PME au Maroc. Aucune carte bancaire requise. Opérationnel en 5 minutes.',
  path: '/register',
  keywords: [
    'créer compte logiciel facturation maroc',
    'essai gratuit crm maroc',
    'inscription logiciel pme maroc',
    'logiciel devis gratuit maroc',
  ],
})

export default function RegisterPage() {
  return (
    <AuthShell titleKey="auth.registerTitle" subKey="auth.registerSub">
      <RegisterForm />
    </AuthShell>
  )
}
