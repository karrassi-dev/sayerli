import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import {
  OrganizationJsonLd,
  SoftwareApplicationJsonLd,
  FaqPageJsonLd,
  WebSiteJsonLd,
} from '@/components/seo/JsonLd'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Pricing } from '@/components/landing/Pricing'
import { Testimonials } from '@/components/landing/Testimonials'
import { FinalCta } from '@/components/landing/FinalCta'
import { DashboardShowcase } from '@/components/landing/DashboardShowcase'
import { WhyChooseSayerli } from '@/components/landing/WhyChooseSayerli'
import { WorkflowTimeline } from '@/components/landing/WorkflowTimeline'
import { AnalyticsPreview } from '@/components/landing/AnalyticsPreview'
import { FeatureComparison } from '@/components/landing/FeatureComparison'
import { AutomationSection } from '@/components/landing/AutomationSection'
import { FAQ } from '@/components/landing/FAQ'
import { TrustSecurity } from '@/components/landing/TrustSecurity'
import { FutureVision } from '@/components/landing/FutureVision'
import { FinalMegaCta } from '@/components/landing/FinalMegaCta'

export const metadata: Metadata = buildMetadata({
  title: 'Sayerli | CRM, Devis et Facturation pour PME au Maroc',
  description:
    'Sayerli est le logiciel de gestion commerciale pour PME marocaines. Créez des devis professionnels, générez des factures conformes, gérez vos clients et suivez vos paiements en MAD. Essai gratuit — sans carte bancaire.',
  path: '/',
})

export default function Home() {
  return (
    <>
      {/* ── JSON-LD Structured Data ── */}
      <OrganizationJsonLd />
      <SoftwareApplicationJsonLd />
      <FaqPageJsonLd />
      <WebSiteJsonLd />

      <main className="min-h-screen">
        {/* ── Existing sections (unchanged) ── */}
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCta />

        {/* ── Premium sections ── */}
        <DashboardShowcase />
        <WhyChooseSayerli />
        <WorkflowTimeline />
        <AnalyticsPreview />
        <FeatureComparison />
        <AutomationSection />
        <FAQ />
        <TrustSecurity />
        <FutureVision />
        <FinalMegaCta />

        <Footer />
      </main>
    </>
  )
}
