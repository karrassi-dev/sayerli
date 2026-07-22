import type { Metadata } from 'next'
import { buildMetadata, BLOG_POSTS, SITE_URL } from '@/lib/seo'
import { OrganizationJsonLd } from '@/components/seo/JsonLd'
import { BlogPageContent } from '@/components/blog/BlogPageContent'

export const metadata: Metadata = buildMetadata({
  title: 'Blog Sayerli | Guides Facturation, CRM et Gestion — Freelancers & PME Maroc',
  description:
    "Guides et tutoriels sur la facturation, le CRM, les devis et la gestion commerciale pour freelancers, auto-entrepreneurs et PME au Maroc.",
  path: '/blog',
})

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
      ...(post.image ? { image: post.image } : {}),
      keywords: post.keywords.join(', '),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }} />
      <OrganizationJsonLd />
      <BlogPageContent />
    </>
  )
}
