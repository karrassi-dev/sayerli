import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, BookOpen, BarChart3, Users, Tag } from 'lucide-react'
import { buildMetadata, BLOG_POSTS, SITE_URL } from '@/lib/seo'
import { OrganizationJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = buildMetadata({
  title: 'Blog Sayerli | Guides Facturation, CRM et Gestion — Freelancers & PME Maroc',
  description:
    "Guides et tutoriels sur la facturation, le CRM, les devis et la gestion commerciale pour freelancers, auto-entrepreneurs et PME au Maroc. Apprenez à optimiser votre gestion d'entreprise.",
  path: '/blog',
})

const READING_TIMES: Record<string, number> = {
  'comment-creer-un-devis-au-maroc': 4,
  'meilleur-logiciel-de-facturation-maroc': 5,
  'crm-pour-pme-maroc': 4,
  'gestion-clients-pour-entreprises-marocaines': 4,
  'alternative-excel-pour-gerer-son-entreprise': 5,
}

const CATEGORY_STYLE: Record<string, { badge: string; icon: React.ElementType }> = {
  Guides:      { badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900',   icon: BookOpen  },
  Comparatifs: { badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900',   icon: BarChart3 },
  CRM:         { badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900', icon: Users },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-MA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sayerli Blog',
    description: 'Guides et ressources pour les PME marocaines — CRM, Facturation, Devis et Gestion commerciale.',
    url: `${SITE_URL}/blog`,
    publisher: { '@type': 'Organization', name: 'Sayerli', url: SITE_URL },
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      keywords: post.keywords.join(', '),
    })),
  }

  const [featured, ...rest] = BLOG_POSTS

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }} />
      <OrganizationJsonLd />

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12),transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
            <Tag className="w-3.5 h-3.5" />
            Ressources & Guides
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-5 leading-tight">
            Guides pratiques pour les{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">
              PME marocaines
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Facturation, CRM, devis et gestion commerciale. Des articles concrets écrits pour les
            freelancers, auto-entrepreneurs et PME au Maroc.
          </p>
          <div className="flex items-center gap-6 mt-8 text-sm text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              {BLOG_POSTS.length} articles
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              Mis à jour régulièrement
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* Featured post */}
        {featured && (() => {
          const cat = CATEGORY_STYLE[featured.category]
          const CatIcon = cat?.icon ?? BookOpen
          return (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block mb-12 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-black/5 hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-primary-500 to-teal-500" />
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${cat?.badge ?? ''}`}>
                    <CatIcon className="w-3 h-3" />
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    {READING_TIMES[featured.slug] ?? 4} min de lecture
                  </span>
                  <time className="text-xs text-slate-400 dark:text-slate-500" dateTime={featured.publishedAt}>
                    {formatDate(featured.publishedAt)}
                  </time>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900 font-semibold">
                    À la une
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {featured.title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-2xl">
                  {featured.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {featured.keywords.slice(0, 3).map((kw) => (
                      <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                    Lire l&apos;article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          )
        })()}

        {/* Section title */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
          Tous les articles
        </h2>

        {/* Rest of posts grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {rest.map((post) => {
            const cat = CATEGORY_STYLE[post.category]
            const CatIcon = cat?.icon ?? BookOpen
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:shadow-black/5 hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${cat?.badge ?? ''}`}>
                    <CatIcon className="w-3 h-3" />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {READING_TIMES[post.slug] ?? 4} min
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <time className="text-xs text-slate-400 dark:text-slate-500" dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-1.5 transition-all">
                    Lire <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 p-8 sm:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold mb-4 border border-white/20">
                🇲🇦 Conçu pour le Maroc
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-3">
                Essayez Sayerli gratuitement
              </h2>
              <p className="text-primary-100 text-sm mb-6 max-w-lg">
                CRM, Devis, Bons de livraison et Facturation en MAD. Sans carte bancaire —
                opérationnel en 5 minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-600 font-bold text-sm hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5 group"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/fonctionnalites"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
                >
                  Voir les fonctionnalités
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
