import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata, BLOG_POSTS, SITE_URL } from '@/lib/seo'
import { BlogArticleJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
import { ArticleBody } from './ArticleBody'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return {}
  return buildMetadata({
    title: `${post.title} | Sayerli Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: [
      ...post.keywords,
      'sayerli',
      'logiciel gestion maroc',
      'facturation maroc',
      'auto entrepreneur maroc',
    ],
  })
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: 'Sayerli', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Sayerli',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.jpg` },
    },
    keywords: post.keywords.join(', '),
    ...(post.image ? { image: `${SITE_URL}${post.image}` } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <OrganizationJsonLd />
      <ArticleBody slug={slug} post={post} />
    </>
  )
}
