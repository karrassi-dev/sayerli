import type { Metadata, Viewport } from 'next'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = buildMetadata({
  title: 'Blog | Guides CRM, Facturation et Gestion PME au Maroc',
  description:
    'Guides pratiques sur la facturation, le CRM, les devis et la gestion commerciale pour les PME marocaines. Conseils, tutoriels et comparatifs logiciels.',
  path: '/blog',
  keywords: [
    'guide facturation maroc',
    'tutoriel crm maroc',
    'conseils gestion pme maroc',
    'logiciel devis maroc guide',
    'blog gestion commerciale maroc',
  ],
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        {children}
      </main>
      <Footer />
    </div>
  )
}
