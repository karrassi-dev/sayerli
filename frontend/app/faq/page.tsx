import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { FaqPageJsonLd } from '@/components/seo/JsonLd'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FAQ } from '@/components/landing/FAQ'

export const metadata: Metadata = buildMetadata({
  title: 'FAQ | Sayerli',
  description:
    'Questions fréquentes sur Sayerli — tarifs, fonctionnalités, sécurité des données, support. Tout ce que vous devez savoir avant de commencer.',
  path: '/faq',
})

export default function FaqPage() {
  return (
    <>
      <FaqPageJsonLd />
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-16">
          <FAQ />
        </div>
        <Footer />
      </main>
    </>
  )
}
