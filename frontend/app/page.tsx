import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import {
  OrganizationJsonLd,
  SoftwareApplicationJsonLd,
  WebSiteJsonLd,
} from '@/components/seo/JsonLd'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Pricing } from '@/components/landing/Pricing'
import { Testimonials } from '@/components/landing/Testimonials'
import { FinalCta } from '@/components/landing/FinalCta'

export const metadata: Metadata = buildMetadata({
  title: 'Sayerli | CRM, Devis et Facturation pour PME au Maroc',
  description:
    'Sayerli est le logiciel de gestion commerciale pour PME marocaines. Créez des devis professionnels, générez des factures conformes, gérez vos clients et suivez vos paiements en MAD. Essai gratuit — sans carte bancaire.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <SoftwareApplicationJsonLd />
      <WebSiteJsonLd />

      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCta />
        <Footer />
      </main>
    </>
  )
}
