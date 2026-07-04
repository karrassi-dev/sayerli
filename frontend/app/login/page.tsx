import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthShell } from '@/components/auth/AuthShell'

export const metadata: Metadata = buildMetadata({
  title: 'Connexion — Sayerli | Logiciel de Gestion pour Freelancers & PME Maroc',
  description:
    'Connectez-vous à votre espace Sayerli et gérez vos clients, devis, factures et paiements. Logiciel de gestion commerciale pour freelancers, auto-entrepreneurs et PME au Maroc.',
  path: '/login',
  keywords: ['logiciel gestion maroc connexion', 'sayerli connexion', 'crm maroc login'],
})

export default function LoginPage() {
  return (
    <AuthShell titleKey="auth.loginTitle" subKey="auth.loginSub">
      <LoginForm />
    </AuthShell>
  )
}
