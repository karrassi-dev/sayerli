import type { Metadata } from 'next'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { SITE_URL, SITE_NAME, ALL_KEYWORDS } from '@/lib/seo'
import GoogleAnalytics from '@/components/seo/GoogleAnalytics'
import MetaPixel from '@/components/seo/MetaPixel'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | CRM, Devis et Facturation pour PME au Maroc`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Sayerli aide les entreprises marocaines à gérer leurs clients, devis, factures et paiements dans une seule plateforme simple et moderne. Logiciel de gestion commerciale pour PME au Maroc.',
  keywords: ALL_KEYWORDS.join(', '),
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Business Software',
  classification: 'Logiciel de gestion, CRM, Facturation',
  applicationName: SITE_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/sayerlilogopng.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    alternateLocale: ['ar_MA', 'en_MA'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | CRM, Devis et Facturation pour PME au Maroc`,
    description:
      'Logiciel de gestion commerciale pour PME marocaines. Créez des devis, générez des factures, gérez vos clients et suivez vos paiements en MAD.',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sayerli — Logiciel CRM, Devis et Facturation pour PME au Maroc',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sayerli_ma',
    creator: '@sayerli_ma',
    title: `${SITE_NAME} | CRM, Devis et Facturation pour PME au Maroc`,
    description:
      'Logiciel de gestion commerciale pour PME marocaines. Devis, Factures, CRM et paiements — tout en un.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'fr': SITE_URL,
      'ar': `${SITE_URL}/ar`,
      'en': `${SITE_URL}/en`,
      'x-default': SITE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* hreflang — Multilingual SEO */}
        <link rel="alternate" hrefLang="fr" href={SITE_URL} />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en`} />
        <link rel="alternate" hrefLang="ar" href={`${SITE_URL}/ar`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for third-party domains */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <GoogleAnalytics />
        <MetaPixel />
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
