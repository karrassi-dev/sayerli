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
export const BLOG_POSTS: BlogPost[] = []

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
