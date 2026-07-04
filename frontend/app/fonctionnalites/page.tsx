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
  title: 'Fonctionnalités | Sayerli',
  description:
    'Découvrez toutes les fonctionnalités de Sayerli : tableau de bord, devis, factures, CRM clients, suivi des paiements, automatisation et sécurité — tout ce dont votre PME marocaine a besoin.',
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
