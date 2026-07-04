import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, BLOG_POSTS } from '@/lib/seo'
import { OrganizationJsonLd } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Blog Sayerli | Guides Facturation, CRM et Gestion — Freelancers & PME Maroc',
  description:
    'Guides et tutoriels sur la facturation, le CRM, les devis et la gestion commerciale pour freelancers, auto-entrepreneurs et PME au Maroc. Apprenez à optimiser votre gestion d\'entreprise.',
  path: '/blog',
})

const CATEGORY_COLORS: Record<string, string> = {
  Guides: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
  Comparatifs: 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300',
  CRM: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300',
}

export default function BlogPage() {
  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sayerli Blog',
    description:
      'Guides et ressources pour les PME marocaines — CRM, Facturation, Devis et Gestion commerciale.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Sayerli',
      url: SITE_URL,
    },
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      keywords: post.keywords.join(', '),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <OrganizationJsonLd />

      {/* Header */}
      <div className="mb-12">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
          Ressources
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
          Guides et conseils pour les PME marocaines
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
          Tout ce que vous devez savoir sur la facturation, le CRM, les devis et la gestion
          commerciale au Maroc. Des guides pratiques écrits pour les entrepreneurs marocains.
        </p>
      </div>

      {/* Articles grid */}
      <div className="grid gap-6">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${CATEGORY_COLORS[post.category] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {post.category}
              </span>
              <time className="text-xs text-slate-400 flex-shrink-0" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('fr-MA', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
              {post.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.keywords.slice(0, 3).map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Internal linking for SEO */}
      <div className="mt-16 p-6 rounded-2xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
        <h2 className="font-bold text-slate-900 dark:text-white mb-2">
          Essayez Sayerli gratuitement
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Le meilleur logiciel de devis, facturation et CRM pour PME marocaines.
          Sans carte bancaire, opérationnel en 5 minutes.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all"
        >
          Commencer gratuitement →
        </Link>
      </div>
    </>
  )
}
