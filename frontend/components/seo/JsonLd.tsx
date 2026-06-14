import { SITE_URL, SITE_NAME } from '@/lib/seo'

// ── Organization ──────────────────────────────────────────────────────────────
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://www.linkedin.com/company/sayerli',
      'https://twitter.com/sayerli_ma',
    ],
    description:
      'Sayerli est un logiciel de gestion commerciale pour les PME marocaines. CRM, devis, facturation et suivi des paiements dans une seule plateforme.',
    foundingDate: '2026',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
      addressLocality: 'Casablanca',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@sayerli.ma',
      availableLanguage: ['French', 'Arabic', 'English'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
    },
    knowsAbout: [
      'Logiciel de facturation',
      'CRM Maroc',
      'Gestion commerciale PME',
      'Devis en ligne',
      'Factures en ligne',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── SoftwareApplication ───────────────────────────────────────────────────────
export function SoftwareApplicationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Logiciel de gestion commerciale tout-en-un pour les PME marocaines. Créez des devis, générez des factures, gérez vos clients et suivez vos paiements.',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: [
      'CRM',
      'Facturation',
      'Gestion Commerciale',
      'Devis',
    ],
    operatingSystem: 'Web, iOS, Android',
    softwareVersion: '1.0',
    releaseNotes: `${SITE_URL}/changelog`,
    countriesSupported: 'MA',
    inLanguage: ['fr', 'ar', 'en'],
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '0',
        priceCurrency: 'MAD',
        priceValidUntil: '2026-12-31',
        description: 'Plan gratuit pour PME débutantes',
        url: `${SITE_URL}/register`,
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '299',
        priceCurrency: 'MAD',
        priceValidUntil: '2026-12-31',
        description: 'Plan Pro pour PME en croissance',
        url: `${SITE_URL}/register`,
      },
      {
        '@type': 'Offer',
        name: 'Business',
        price: '599',
        priceCurrency: 'MAD',
        priceValidUntil: '2026-12-31',
        description: 'Plan Business pour équipes et agences',
        url: `${SITE_URL}/register`,
      },
    ],
    featureList: [
      'CRM et gestion des clients',
      'Création de devis professionnels',
      'Génération de factures conformes',
      'Suivi des paiements en MAD',
      'Tableau de bord analytique',
      'Gestion multi-utilisateurs avec rôles',
      'Lien public de devis pour signature en ligne',
      'Notifications et rappels automatiques',
      'Accès cloud sécurisé',
      'Support en français et en arabe',
    ],
    screenshot: `${SITE_URL}/og-image.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── FAQPage ───────────────────────────────────────────────────────────────────
export function FaqPageJsonLd() {
  const faqs = [
    {
      q: 'Sayerli est-il adapté aux petites entreprises marocaines ?',
      a: 'Oui, Sayerli est conçu spécifiquement pour les PME, auto-entrepreneurs, agences et consultants au Maroc. L\'interface est simple et ne nécessite aucune formation technique. Vous pouvez créer votre premier devis en moins de 5 minutes.',
    },
    {
      q: 'Puis-je créer des factures conformes à la législation marocaine ?',
      a: 'Oui. Toutes les factures générées par Sayerli incluent les mentions obligatoires, une numérotation séquentielle automatique, et sont acceptées par les comptables et l\'administration fiscale marocaine.',
    },
    {
      q: 'Comment fonctionne le logiciel de devis en ligne de Sayerli ?',
      a: 'Créez un devis en quelques clics en ajoutant vos lignes de services, quantités et prix. Sayerli génère un lien public que vous envoyez à votre client. Il peut consulter et accepter le devis en ligne, sans créer de compte.',
    },
    {
      q: 'Quel est le prix du logiciel de facturation Sayerli au Maroc ?',
      a: 'Sayerli propose un plan gratuit (Starter) permettant de gérer jusqu\'à 5 clients, 10 devis et 10 factures par mois. Le plan Pro est à 299 MAD/mois avec des fonctionnalités illimitées. Le plan Business est à 599 MAD/mois pour les équipes.',
    },
    {
      q: 'Sayerli est-il disponible en arabe ?',
      a: 'Oui, Sayerli supporte le français (langue principale), l\'arabe et l\'anglais. L\'interface s\'adapte automatiquement en RTL pour l\'arabe.',
    },
    {
      q: 'Puis-je suivre les paiements de mes clients au Maroc ?',
      a: 'Oui. Sayerli vous permet d\'enregistrer chaque paiement reçu (cash, virement bancaire, carte, chèque, mobile money). Le statut de chaque facture est mis à jour automatiquement et vous recevez des alertes pour les impayés.',
    },
    {
      q: 'Y a-t-il un essai gratuit sans carte bancaire ?',
      a: 'Oui. Le plan Starter de Sayerli est entièrement gratuit et sans limite de durée. Aucune carte bancaire n\'est requise pour commencer. Vous pouvez passer à un plan payant à tout moment.',
    },
    {
      q: 'Sayerli peut-il remplacer Excel pour gérer mon entreprise au Maroc ?',
      a: 'Absolument. Sayerli est la meilleure alternative à Excel pour les PME marocaines. Il automatise la création de devis et factures, élimine les erreurs de calcul, et centralise la gestion de vos clients, ventes et paiements.',
    },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── WebSite (sitelinks search box) ────────────────────────────────────────────
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Logiciel de gestion commerciale pour PME marocaines — CRM, Devis, Facturation, Paiements.',
    inLanguage: ['fr', 'ar', 'en'],
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Blog Article ──────────────────────────────────────────────────────────────
export function BlogArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  keywords,
}: {
  title: string
  description: string
  slug: string
  publishedAt: string
  keywords: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: publishedAt,
    keywords: keywords.join(', '),
    inLanguage: 'fr',
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    isPartOf: {
      '@type': 'Blog',
      name: 'Sayerli Blog',
      url: `${SITE_URL}/blog`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
