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
  title: 'Sayerli | Devis et Facturation pour Freelancers, Auto-entrepreneurs & PME au Maroc',
  description:
    'Sayerli est le logiciel de gestion commerciale pour freelancers, auto-entrepreneurs et PME au Maroc. Créez des devis professionnels, générez des factures en MAD, gérez vos clients et suivez vos paiements. Essai gratuit — sans carte bancaire.',
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
