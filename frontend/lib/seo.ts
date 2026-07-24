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
    slug: 'comment-faire-facture-maroc',
    title: 'Comment faire une facture professionnelle au Maroc : guide étape par étape',
    description: 'Comment créer une facture professionnelle au Maroc : les étapes, les informations à inclure, les outils disponibles et comment envoyer et suivre vos factures efficacement.',
    category: 'facturation',
    keywords: [
      'comment faire une facture maroc',
      'faire une facture maroc',
      'créer une facture maroc',
      'facture professionnelle maroc',
      'facture maroc',
      'modèle facture maroc',
      'logiciel facturation maroc',
      'facture en ligne maroc',
      'facture freelance maroc',
      'facture auto entrepreneur maroc',
    ],
    publishedAt: '2026-07-22',
    image: '/blog/comment-faire-facture-maroc.webp',
    readingTime: 7,
  },
  {
    slug: 'mentions-obligatoires-facture-maroc',
    title: 'Mentions obligatoires sur une facture au Maroc : le guide complet 2025',
    description: 'Toutes les mentions obligatoires sur une facture au Maroc : ICE, IF, TVA, numérotation, coordonnées, délais de paiement. Guide complet pour auto-entrepreneurs, freelancers et PME.',
    category: 'facturation',
    keywords: [
      'mentions obligatoires facture maroc',
      'facture maroc',
      'facture conforme maroc',
      'ice facture maroc',
      'if facture maroc',
      'tva facture maroc',
      'mentions legales facture maroc',
      'facture professionnelle maroc',
      'logiciel facturation maroc',
      'faire une facture maroc',
    ],
    publishedAt: '2026-07-22',
    image: '/blog/mentions-obligatoires-facture-maroc.webp',
    readingTime: 7,
  },
  {
    slug: 'facturer-auto-entrepreneur-maroc',
    title: 'Comment facturer en tant qu\'auto-entrepreneur au Maroc : mentions obligatoires et IF fiscal',
    description: 'Guide complet pour émettre des factures conformes en tant qu\'auto-entrepreneur au Maroc : mentions obligatoires, identifiant fiscal (IF), numérotation, exonération TVA et erreurs à éviter.',
    category: 'autoEntrepreneur',
    keywords: [
      'facturer auto entrepreneur maroc',
      'facture auto entrepreneur maroc',
      'mentions obligatoires facture maroc',
      'identifiant fiscal auto entrepreneur maroc',
      'if fiscal facture maroc',
      'exoneration tva facture maroc',
      'modele facture auto entrepreneur maroc',
      'numerotation facture maroc',
      'facture conforme maroc',
    ],
    publishedAt: '2026-07-22',
    image: '/blog/facturer-auto-entrepreneur-maroc.webp',
    readingTime: 7,
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
  {
    slug: 'calcul-tva-maroc',
    title: 'TVA au Maroc : taux, calcul et déclaration — guide complet 2025',
    description: 'Tout savoir sur la TVA au Maroc : taux de 7%, 10%, 14% et 20%, comment calculer la TVA, bien facturer et déclarer en ligne via Simpl-TVA. Guide complet pour PME, freelancers et auto-entrepreneurs.',
    category: 'tva',
    keywords: [
      'calcul tva maroc',
      'tva maroc',
      'taux tva maroc',
      'tva 20 maroc',
      'tva 10 maroc',
      'declaration tva maroc',
      'simulateur tva maroc',
      'tva facture maroc',
      'tva deductible maroc',
      'logiciel tva maroc',
      'tva pme maroc',
      'facture tva maroc',
    ],
    publishedAt: '2026-07-24',
    image: '/blog/calcul-tva-maroc.webp',
    readingTime: 9,
  },
  {
    slug: 'modele-facture-maroc',
    title: 'Modèle de facture au Maroc : Word, PDF et Excel — guide complet 2025',
    description: 'Téléchargez un modèle de facture gratuit pour le Maroc : Word, PDF et Excel avec toutes les mentions obligatoires. Guide complet pour freelancers, auto-entrepreneurs et PME marocaines.',
    category: 'facturation',
    keywords: [
      'modele facture maroc',
      'modele facture word',
      'modele facture excel',
      'facture pdf maroc',
      'facture gratuite pdf',
      'facture auto entrepreneur maroc',
      'mentions obligatoires facture maroc',
      'logiciel facturation maroc',
      'facture freelance maroc',
      'numerotation facture maroc',
    ],
    publishedAt: '2026-07-24',
    image: '/blog/modele-facture-maroc.webp',
    readingTime: 8,
  },
  {
    slug: 'freelance-maroc-guide',
    title: 'Freelance au Maroc en 2025 : statut, contrat, facturation et fiscalité — guide complet',
    description: 'Tout savoir pour travailler en freelance au Maroc : quel statut choisir, comment rédiger un contrat, facturer correctement, fixer ses tarifs et gérer sa fiscalité. Guide complet pour indépendants marocains.',
    category: 'freelance',
    keywords: [
      'freelance maroc',
      'facture freelance maroc',
      'contrat freelance maroc',
      'tarif freelance maroc',
      'statut freelance maroc',
      'fiscalite freelance maroc',
      'auto entrepreneur freelance maroc',
      'logiciel facturation freelance maroc',
      'devis freelance maroc',
      'cnss freelance maroc',
    ],
    publishedAt: '2026-07-24',
    image: '/blog/freelance-maroc-guide.webp',
    readingTime: 10,
  },
  {
    slug: 'modele-devis-maroc',
    title: 'Modèle de devis professionnel au Maroc : télécharger gratuitement (2025)',
    description: 'Créez un devis professionnel et conforme au Maroc : mentions obligatoires, modèles Word, Excel et PDF, durée de validité, TVA et conversion en facture. Guide complet pour freelancers et PME marocaines.',
    category: 'devis',
    keywords: [
      'modele devis maroc',
      'devis freelance maroc',
      'exemple devis maroc',
      'devis entreprise maroc',
      'modele devis word',
      'modele devis excel',
      'devis pdf maroc',
      'comment faire un devis maroc',
      'devis professionnel maroc',
      'logiciel devis maroc',
    ],
    publishedAt: '2026-07-24',
    image: '/blog/modele-devis-maroc.webp',
    readingTime: 8,
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
