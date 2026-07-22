'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight, Clock, Search, Receipt, Truck, Briefcase,
  Calculator, Users, BarChart3, PenLine,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { BLOG_POSTS, type BlogPost } from '@/lib/seo'

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORY_KEYS = [
  'facturation',
  'devis',
  'autoEntrepreneur',
  'tva',
  'freelance',
  'comparatifs',
] as const

type CategoryKey = typeof CATEGORY_KEYS[number]

const CAT_META: Record<CategoryKey, {
  icon: React.ElementType
  gradient: string
  pill: string
  activePill: string
  badge: string
}> = {
  facturation: {
    icon: Receipt,
    gradient: 'from-blue-500 to-blue-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400',
    activePill: 'bg-blue-600 border-blue-600 text-white',
    badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900',
  },
  devis: {
    icon: Truck,
    gradient: 'from-amber-500 to-orange-500',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400',
    activePill: 'bg-amber-500 border-amber-500 text-white',
    badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900',
  },
  autoEntrepreneur: {
    icon: Briefcase,
    gradient: 'from-green-500 to-emerald-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400',
    activePill: 'bg-green-600 border-green-600 text-white',
    badge: 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900',
  },
  tva: {
    icon: Calculator,
    gradient: 'from-purple-500 to-violet-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400',
    activePill: 'bg-purple-600 border-purple-600 text-white',
    badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900',
  },
  freelance: {
    icon: Users,
    gradient: 'from-teal-500 to-teal-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-300 dark:hover:border-teal-700 hover:text-teal-600 dark:hover:text-teal-400',
    activePill: 'bg-teal-600 border-teal-600 text-white',
    badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900',
  },
  comparatifs: {
    icon: BarChart3,
    gradient: 'from-rose-500 to-pink-600',
    pill: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 dark:hover:text-rose-400',
    activePill: 'bg-rose-600 border-rose-600 text-white',
    badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900',
  },
}

// ── Post card ──────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: BlogPost }) {
  const { t, locale } = useTranslation()
  const meta = CAT_META[post.category as CategoryKey]
  const Icon = meta?.icon

  const dateStr = new Date(post.publishedAt).toLocaleDateString(
    locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-MA',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/80 overflow-hidden hover:shadow-2xl hover:shadow-black/8 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${meta?.gradient ?? 'from-slate-400 to-slate-500'} opacity-10 dark:opacity-20`} />
        )}
        {meta && (
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${meta.badge}`}>
              <Icon className="w-3 h-3" />
              {t(`blog.categories.${post.category}.name`)}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 dark:text-slate-500">
          <time dateTime={post.publishedAt}>{dateStr}</time>
          {post.readingTime && (
            <>
              <span className="text-slate-200 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} {t('blog.posts.min')}
              </span>
            </>
          )}
        </div>

        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1">
          {post.title}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {post.description}
        </p>

        <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all mt-auto">
          {t('blog.posts.read')} <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export function BlogPageContent() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all')

  const filtered = useMemo(() => {
    let posts = BLOG_POSTS
    if (activeCategory !== 'all') {
      posts = posts.filter((p) => p.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q)),
      )
    }
    return posts
  }, [search, activeCategory])

  const hasAnyPosts = BLOG_POSTS.length > 0

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-950">
        {/* subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.18),transparent)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 sm:pt-28 sm:pb-20 text-center">
          {/* — BLOG — label */}
          <div className="inline-flex items-center gap-3 mb-7">
            <span className="h-px w-8 bg-primary-400 dark:bg-primary-500" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-600 dark:text-primary-400">
              Blog
            </span>
            <span className="h-px w-8 bg-primary-400 dark:bg-primary-500" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-5 leading-[1.1] tracking-tight">
            {t('blog.hero.title')}{' '}
            <span className="bg-gradient-to-r from-primary-500 via-indigo-500 to-teal-400 bg-clip-text text-transparent">
              {t('blog.hero.titleHighlight')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t('blog.hero.sub')}
          </p>
        </div>
      </div>

      {/* ── Search + filters ─────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('blog.search.placeholder')}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 dark:focus:border-primary-600 transition-all"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* All pill */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('blog.filter.all')}
            </button>

            {CATEGORY_KEYS.map((key) => {
              const meta = CAT_META[key]
              const Icon = meta.icon
              const isActive = activeCategory === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(isActive ? 'all' : key)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    isActive ? meta.activePill : meta.pill
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t(`blog.categories.${key}.name`)}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Posts area ───────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {!hasAnyPosts ? (
          /* Global empty state — no posts at all yet */
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/25">
              <PenLine className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
              {t('blog.empty.title')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed mb-7">
              {t('blog.empty.sub')}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 group"
            >
              {t('blog.empty.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          /* Search / filter returned nothing */
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
              <Search className="w-7 h-7 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('blog.search.noResults')} &ldquo;{search || t(`blog.categories.${activeCategory as CategoryKey}.name`)}&rdquo;
            </h2>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all') }}
              className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold"
            >
              {t('blog.filter.all')} →
            </button>
          </div>
        ) : (
          /* Posts grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <div className="mt-20 rounded-2xl overflow-hidden">
          <div className="relative bg-gradient-to-br from-slate-900 via-primary-950 to-indigo-950 dark:from-slate-900 dark:via-primary-950 dark:to-indigo-950 p-8 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.2),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative text-center max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold mb-5 border border-white/15">
                {t('blog.cta.badge')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
                {t('blog.cta.title')}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-7">
                {t('blog.cta.sub')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5 group"
                >
                  {t('blog.cta.primary')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/fonctionnalites"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/15"
                >
                  {t('blog.cta.secondary')}
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
