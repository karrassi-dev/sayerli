import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Features } from '@/components/landing/Features'
import { DashboardShowcase } from '@/components/landing/DashboardShowcase'
import { WhyChooseSayerli } from '@/components/landing/WhyChooseSayerli'
import { WorkflowTimeline } from '@/components/landing/WorkflowTimeline'
import { AnalyticsPreview } from '@/components/landing/AnalyticsPreview'
import { FeatureComparison } from '@/components/landing/FeatureComparison'
import { AutomationSection } from '@/components/landing/AutomationSection'
import { TrustSecurity } from '@/components/landing/TrustSecurity'
import { FinalCta } from '@/components/landing/FinalCta'

export const metadata: Metadata = buildMetadata({
  title: 'Fonctionnalités | Devis, Bons de livraison, Factures — Sayerli',
  description:
    'Tout le workflow commercial en un seul outil : devis professionnels, bons de livraison, factures automatiques, suivi des paiements, portail client et journal des ventes. Conçu pour les PME marocaines.',
  path: '/fonctionnalites',
})

export default function FonctionnalitesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Features />
        <DashboardShowcase />
        <WhyChooseSayerli />
        <WorkflowTimeline />
        <AnalyticsPreview />
        <FeatureComparison />
        <AutomationSection />
        <TrustSecurity />
        <FinalCta />
      </div>
      <Footer />
    </main>
  )
}
