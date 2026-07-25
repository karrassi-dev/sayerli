import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Contact | Support Sayerli — Maroc',
  description: 'Contactez l\'équipe Sayerli. Support en français et en arabe pour freelancers, auto-entrepreneurs et PME au Maroc. Réponse sous 24h.',
  path: '/contact',
  keywords: [
    'contact sayerli',
    'support sayerli maroc',
    'aide logiciel facturation maroc',
    'support crm maroc',
    'contacter sayerli',
    'support freelance maroc',
    'support pme maroc',
  ],
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
