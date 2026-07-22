import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sayerli.com'
export const SITE_NAME = 'Sayerli'

// ── Primary SEO keywords for Morocco ──────────────────────────────────────────
export const PRIMARY_KEYWORDS = [
  'logiciel devis maroc',
  'logiciel facture maroc',
  'logiciel facturation maroc',
  'crm maroc',
  'crm pour pme maroc',
  'gestion clients maroc',
  'gestion commerciale maroc',
  'devis en ligne maroc',
  'facture en ligne maroc',
  'logiciel de gestion maroc',
  'logiciel pme maroc',
  'logiciel freelance maroc',
  'logiciel auto entrepreneur maroc',
  'logiciel entreprise maroc',
  'logiciel facturation pme maroc',
  'facturation freelance maroc',
  'devis freelance maroc',
]

export const SECONDARY_KEYWORDS = [
  'suivi paiements maroc',
  'gestion devis et factures',
  'outil de facturation maroc',
  'plateforme de gestion commerciale',
  'gestion clients et factures',
  'logiciel pour auto entrepreneur maroc',
  'application freelance maroc',
  'gestion auto entrepreneur maroc',
  'facturation pour agence',
  'gestion commerciale pour pme',
]

export const LONG_TAIL_KEYWORDS = [
  'meilleur logiciel de facturation au maroc',
  'comment créer un devis au maroc',
  'logiciel crm pour petites entreprises maroc',
  'outil pour gérer clients et factures',
  'alternative excel gestion entreprise maroc',
  'logiciel devis facture freelancer maroc',
  'logiciel devis facture pour pme marocaine',
  'gestion commerciale simple pour freelancer maroc',
  'gestion commerciale simple pour entreprise marocaine',
]

export const ALL_KEYWORDS = [
  ...PRIMARY_KEYWORDS,
  ...SECONDARY_KEYWORDS,
  ...LONG_TAIL_KEYWORDS,
]

// ── Shared Open Graph images ──────────────────────────────────────────────────
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: 'Sayerli — Devis et Facturation pour Freelancers, Auto-entrepreneurs & PME au Maroc',
}

// ── Metadata builders ──────────────────────────────────────────────────────────
export function buildMetadata({
  title,
  description,
  path = '/',
  noindex = false,
  keywords,
  locale = 'fr_MA',
}: {
  title: string
  description: string
  path?: string
  noindex?: boolean
  keywords?: string[]
  locale?: string
}): Metadata {
  const url = `${SITE_URL}${path}`
  const kw = keywords ?? ALL_KEYWORDS

  return {
    title,
    description,
    keywords: kw.join(', '),
    authors: [{ name: 'Sayerli', url: SITE_URL }],
    creator: 'Sayerli',
    publisher: 'Sayerli',
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        'fr': `${SITE_URL}${path}`,
        'en': `${SITE_URL}/en${path}`,
        'ar': `${SITE_URL}/ar${path}`,
        'x-default': url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
      creator: '@sayerli_ma',
      site: '@sayerli_ma',
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}

// ── Blog posts registry ───────────────────────────────────────────────────────
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'comment-devenir-auto-entrepreneur-maroc',
    title: 'Comment devenir auto-entrepreneur au Maroc en 2025 : le guide complet',
    description: 'Statut, démarches, plafond de CA, CNSS, fiscalité et obligations de facturation. Tout ce qu\'il faut savoir pour se lancer comme auto-entrepreneur au Maroc.',
    category: 'autoEntrepreneur',
    keywords: [
      'auto entrepreneur maroc',
      'comment devenir auto entrepreneur maroc',
      'declaration auto entrepreneur maroc',
      'cnss auto entrepreneur maroc',
      'plafond auto entrepreneur maroc',
      'impot auto entrepreneur maroc',
      'facture auto entrepreneur maroc',
      'freelance maroc',
      'logiciel facturation maroc',
    ],
    publishedAt: '2026-07-22',
    image: '/blog/sayerli-entrepreneur-au-maroc.webp',
    readingTime: 8,
  },
  {
    slug: 'ir-liberatoire-auto-entrepreneur-maroc',
    title: 'IR libératoire auto-entrepreneur au Maroc : taux, calcul et exonérations',
    description: 'Comprendre l\'impôt sur le revenu libératoire pour les auto-entrepreneurs au Maroc : taux de 1% et 2% selon l\'activité, exonération des 3 premières années, calcul et déclaration trimestrielle.',
    category: 'autoEntrepreneur',
    keywords: [
      'ir liberatoire auto entrepreneur maroc',
      'impot auto entrepreneur maroc',
      'taux ir auto entrepreneur maroc',
      'exoneration ir auto entrepreneur maroc',
      'declaration ir auto entrepreneur maroc',
      'fiscalite auto entrepreneur maroc',
      'impot revenu freelance maroc',
      'auto entrepreneur maroc 2025',
      'taxe auto entrepreneur maroc',
    ],
    publishedAt: '2026-07-22',
    image: '/blog/ir-liberatoire-auto-entrepreneur-maroc.webp',
    readingTime: 6,
  },
  {
    slug: 'cnss-auto-entrepreneur-maroc',
    title: 'CNSS auto-entrepreneur au Maroc : cotisations, couverture sociale et déclarations',
    description: 'Tout savoir sur la CNSS pour les auto-entrepreneurs au Maroc : taux de cotisation, couverture AMO, retraite, prestations familiales, et comment faire vos déclarations trimestrielles.',
    category: 'autoEntrepreneur',
    keywords: [
      'cnss auto entrepreneur maroc',
      'cotisation cnss auto entrepreneur maroc',
      'couverture sociale auto entrepreneur maroc',
      'amo auto entrepreneur maroc',
      'retraite auto entrepreneur maroc',
      'declaration cnss auto entrepreneur maroc',
      'taux cnss auto entrepreneur maroc',
      'protection sociale freelance maroc',
      'auto entrepreneur maroc 2025',
    ],
    publishedAt: '2026-07-22',
    image: '/blog/cnss-auto-entrepreneur-maroc.webp',
    readingTime: 6,
  },
  {
    slug: 'inscription-auto-entrepreneur-maroc',
    title: 'Comment s\'inscrire comme auto-entrepreneur au Maroc : démarches, documents, RC et patente',
    description: 'Guide complet pour s\'inscrire comme auto-entrepreneur au Maroc : documents à fournir, inscription sur le portail officiel, RC, patente (taxe professionnelle) et identifiant fiscal.',
    category: 'autoEntrepreneur',
    keywords: [
      'inscription auto entrepreneur maroc',
      'comment s inscrire auto entrepreneur maroc',
      'documents auto entrepreneur maroc',
      'portail auto entrepreneur maroc',
      'rc auto entrepreneur maroc',
      'patente auto entrepreneur maroc',
      'taxe professionnelle auto entrepreneur maroc',
      'identifiant fiscal auto entrepreneur maroc',
      'demarches auto entrepreneur maroc',
      'auto entrepreneur maroc 2025',
    ],
    publishedAt: '2026-07-22',
    image: '/blog/inscription-auto-entrepreneur-maroc.webp',
    readingTime: 7,
  },
  {
    slug: 'plafond-ca-auto-entrepreneur-maroc',
    title: 'Plafond de CA auto-entrepreneur au Maroc : 500 000 MAD services, 2 000 000 MAD commerce',
    description: 'Comprendre les plafonds de chiffre d\'affaires du régime auto-entrepreneur au Maroc : comment les calculer, que faire en cas de dépassement, et quelle structure adopter ensuite.',
    category: 'autoEntrepreneur',
    keywords: [
      'plafond auto entrepreneur maroc',
      'plafond ca auto entrepreneur maroc',
      'seuil auto entrepreneur maroc',
      'chiffre affaires auto entrepreneur maroc',
      'depasser plafond auto entrepreneur maroc',
      'auto entrepreneur maroc 2025',
      'sarl maroc',
      'facture auto entrepreneur maroc',
    ],
    publishedAt: '2026-07-22',
    image: '/blog/seuil-ca-auto-entrepreneur-maroc.webp',
    readingTime: 6,
  },
]

export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  keywords: string[]
  publishedAt: string
  image?: string       // cover image URL (optional for now)
  readingTime?: number // minutes
}
