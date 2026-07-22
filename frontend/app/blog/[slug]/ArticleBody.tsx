'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Clock, ChevronRight, Info, AlertTriangle, CheckCircle2, Briefcase } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { TableOfContents, type TocItem } from '@/components/blog/TableOfContents'
import { ARTICLES, type Block, type ArticleSection } from '@/lib/blog-content'
import { BLOG_POSTS, type BlogPost } from '@/lib/seo'
import { CAT_META, type CategoryKey } from '@/components/blog/blogCategories'

// ── Block renderers ────────────────────────────────────────────────────────────

function Paragraph({ text }: { text: string }) {
  return (
    <p className="text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-[1.85] mb-0">
      {text}
    </p>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 my-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function OrderedList({ items, dir }: { items: string[]; dir: string }) {
  return (
    <ol className="space-y-3 my-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3.5 text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

function ArticleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/60 my-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-4 py-3 text-slate-700 dark:text-slate-300 ${ci === 0 ? 'font-medium' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CalloutBox({ variant, title, body, href, cta }: Extract<Block, { type: 'callout' }>) {
  const styles = {
    info: {
      wrap: 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60',
      icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />,
      title: 'text-blue-800 dark:text-blue-200',
      body: 'text-blue-700 dark:text-blue-300',
    },
    warning: {
      wrap: 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />,
      title: 'text-amber-800 dark:text-amber-200',
      body: 'text-amber-700 dark:text-amber-300',
    },
    success: {
      wrap: 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/60',
      icon: <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />,
      title: 'text-green-800 dark:text-green-200',
      body: 'text-green-700 dark:text-green-300',
    },
    sayerli: {
      wrap: 'bg-gradient-to-br from-primary-600 to-teal-600 border-0',
      icon: null,
      title: 'text-white',
      body: 'text-primary-100',
    },
  }

  const s = styles[variant]

  if (variant === 'sayerli') {
    return (
      <div className={`rounded-2xl p-6 relative overflow-hidden ${s.wrap}`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative">
          <p className={`text-sm font-black uppercase tracking-widest mb-2 ${s.title}`}>
            {title}
          </p>
          <p className={`text-sm leading-relaxed mb-4 ${s.body}`}>{body}</p>
          {href && cta && (
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-700 font-bold text-sm hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5 group"
            >
              {cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl p-4 ${s.wrap}`}>
      <div className="flex items-start gap-2.5">
        {s.icon}
        <div>
          <p className={`text-sm font-bold mb-1 ${s.title}`}>{title}</p>
          <p className={`text-sm leading-relaxed ${s.body}`}>{body}</p>
        </div>
      </div>
    </div>
  )
}

function renderBlock(block: Block, dir: string, index: number) {
  switch (block.type) {
    case 'p':       return <Paragraph key={index} text={block.text} />
    case 'ul':      return <BulletList key={index} items={block.items} />
    case 'ol':      return <OrderedList key={index} items={block.items} dir={dir} />
    case 'table':   return <ArticleTable key={index} headers={block.headers} rows={block.rows} />
    case 'callout': return <CalloutBox key={index} {...block} />
    default:        return null
  }
}

function SectionContent({ section, index, dir }: { section: ArticleSection; index: number; dir: string }) {
  return (
    <section id={`section-${index}`} className="scroll-mt-28">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-5 leading-snug">
        {section.h2}
      </h2>
      <div className="space-y-4">
        {section.blocks.map((block, bi) => renderBlock(block, dir, bi))}
      </div>
    </section>
  )
}

// ── Category badge ─────────────────────────────────────────────────────────────

function CategoryBadge({ category, t }: { category: string; t: (k: string) => string }) {
  const meta = CAT_META[category as CategoryKey]
  if (!meta) return null
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${meta.badge}`}>
      <Icon className="w-3 h-3" />
      {t(`blog.categories.${category}.name`)}
    </span>
  )
}

// ── Related post card ──────────────────────────────────────────────────────────

function RelatedCard({ post, t }: { post: BlogPost; t: (k: string) => string }) {
  const meta = CAT_META[post.category as CategoryKey]
  const Icon = meta?.icon ?? Briefcase
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold w-fit mb-3 ${meta?.badge ?? ''}`}>
        <Icon className="w-3 h-3" />
        {t(`blog.categories.${post.category}.name`)}
      </span>
      <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug flex-1">
        {post.title}
      </span>
      <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-1.5 transition-all">
        {t('blog.posts.read')} <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  slug: string
  post: BlogPost
}

export function ArticleBody({ slug, post }: Props) {
  const { t, locale, dir } = useTranslation()

  const articleData = ARTICLES[slug]
  const localeKey = locale === 'ar' ? 'ar' : locale === 'en' ? 'en' : 'fr'
  const content = articleData?.content[localeKey]

  const dateStr = new Date(post.publishedAt).toLocaleDateString(
    locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-MA',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )

  const tocItems: TocItem[] = content
    ? content.sections.map((s, i) => ({ id: `section-${i}`, title: s.h2 }))
    : []

  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2)

  const displayTitle = content?.title ?? post.title
  const displayDesc = content?.description ?? post.description

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" dir={dir}>

      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 mb-10 flex-wrap"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          {locale === 'ar' ? 'الرئيسية' : locale === 'en' ? 'Home' : 'Accueil'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href="/blog" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Blog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px] sm:max-w-sm">
          {displayTitle}
        </span>
      </nav>

      {/* Two-column layout */}
      <div className="lg:flex lg:gap-16 xl:gap-20">

        {/* ── Article ──────────────────────────────────────── */}
        <article className="flex-1 min-w-0 max-w-3xl">

          {/* Cover image */}
          {post.image && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-slate-100 dark:bg-slate-800 shadow-xl shadow-black/5 dark:shadow-black/20">
              <Image
                src={post.image}
                alt={displayTitle}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 740px"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <CategoryBadge category={post.category} t={t} />
              <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.publishedAt}>{dateStr}</time>
              </span>
              {post.readingTime && (
                <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime} {t('blog.posts.min')} {locale === 'ar' ? 'قراءة' : locale === 'en' ? 'read' : 'de lecture'}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-5 tracking-tight">
              {displayTitle}
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {displayDesc}
            </p>

            <div className="flex flex-wrap gap-2 pb-8 border-b border-slate-100 dark:border-slate-800">
              {post.keywords.slice(0, 6).map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          </header>

          {/* Mobile TOC */}
          {tocItems.length > 0 && <TableOfContents items={tocItems} />}

          {/* Body */}
          {content && (
            <div className="space-y-10 mt-8">
              {/* Intro */}
              <div className="space-y-4">
                {content.intro.map((block, i) => renderBlock(block, dir, i))}
              </div>

              {/* Sections */}
              {content.sections.map((section, i) => (
                <SectionContent key={i} section={section} index={i} dir={dir} />
              ))}
            </div>
          )}

          {/* End CTA */}
          <div className="mt-14 rounded-2xl overflow-hidden">
            <div className="relative bg-gradient-to-br from-slate-900 via-primary-950 to-indigo-950 p-8 sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold mb-4 border border-white/15">
                  🇲🇦 {locale === 'ar' ? 'تجربة مجانية — بدون بطاقة بنكية' : locale === 'en' ? 'Free trial — no credit card' : 'Essai gratuit — Sans carte bancaire'}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  {locale === 'ar' ? 'جرب Sayerli مجاناً' : locale === 'en' ? 'Try Sayerli for free' : 'Essayez Sayerli gratuitement'}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-md">
                  {locale === 'ar'
                    ? 'إدارة العملاء، عروض الأسعار، سندات التسليم والفوترة بالدرهم. جاهز في 5 دقائق.'
                    : locale === 'en'
                    ? 'CRM, Quotes, Delivery Notes and Invoicing in MAD. Ready in 5 minutes.'
                    : 'CRM, Devis, Bons de livraison et Facturation en MAD. Opérationnel en 5 minutes.'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5 group"
                  >
                    {locale === 'ar' ? 'إنشاء حسابي المجاني' : locale === 'en' ? 'Create my free account' : 'Créer mon compte gratuit'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/15"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {locale === 'ar' ? 'العودة إلى المدونة' : locale === 'en' ? 'Back to blog' : 'Retour au blog'}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
                {locale === 'ar' ? 'مقالات ذات صلة' : locale === 'en' ? 'Related articles' : 'Articles similaires'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => <RelatedCard key={r.slug} post={r} t={t} />)}
              </div>
            </div>
          )}

        </article>

        {/* ── TOC Sidebar ──────────────────────────────────── */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <TableOfContents items={tocItems} />
          </aside>
        )}

      </div>
    </div>
  )
}
