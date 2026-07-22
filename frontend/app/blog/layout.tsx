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
  title: 'Blog | Guides Facturation, CRM et Gestion — Freelancers & PME Maroc',
  description:
    'Guides pratiques sur la facturation, le CRM, les devis et la gestion commerciale pour freelancers, auto-entrepreneurs et PME au Maroc. Conseils, tutoriels et comparatifs logiciels.',
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </div>
  )
}
