'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Receipt, FileText, Briefcase, Calculator, Users, BarChart3, PenLine, Tag, Truck } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { BLOG_POSTS, type BlogPost } from '@/lib/seo'

const CATEGORIES = [
  {
    key: 'facturation',
    icon: Receipt,
    gradient: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-950/40',
    badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900',
    border: 'hover:border-blue-200 dark:hover:border-blue-800',
    shadow: 'hover:shadow-blue-500/5',
  },
  {
    key: 'devis',
    icon: Truck,
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900',
    border: 'hover:border-amber-200 dark:hover:border-amber-800',
    shadow: 'hover:shadow-amber-500/5',
  },
  {
    key: 'autoEntrepreneur',
    icon: Briefcase,
    gradient: 'from-green-500 to-emerald-600',
    iconBg: 'bg-green-50 dark:bg-green-950/40',
    badge: 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900',
    border: 'hover:border-green-200 dark:hover:border-green-800',
    shadow: 'hover:shadow-green-500/5',
  },
  {
    key: 'tva',
    icon: Calculator,
    gradient: 'from-purple-500 to-violet-600',
    iconBg: 'bg-purple-50 dark:bg-purple-950/40',
    badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900',
    border: 'hover:border-purple-200 dark:hover:border-purple-800',
    shadow: 'hover:shadow-purple-500/5',
  },
  {
    key: 'freelance',
    icon: Users,
    gradient: 'from-teal-500 to-teal-600',
    iconBg: 'bg-teal-50 dark:bg-teal-950/40',
    badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900',
    border: 'hover:border-teal-200 dark:hover:border-teal-800',
    shadow: 'hover:shadow-teal-500/5',
  },
  {
    key: 'comparatifs',
    icon: BarChart3,
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900',
    border: 'hover:border-rose-200 dark:hover:border-rose-800',
    shadow: 'hover:shadow-rose-500/5',
  },
] as const

function formatDate(d: string, locale: string) {
  const loc = locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-MA'
  return new Date(d).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' })
}

function PostCard({ post, cat }: { post: BlogPost; cat: typeof CATEGORIES[number] | undefined }) {
  const { t, locale } = useTranslation()
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 ${cat?.border ?? ''}`}
    >
      {/* Cover image */}
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
          <div className={`absolute inset-0 bg-gradient-to-br ${cat?.gradient ?? 'from-slate-400 to-slate-500'} opacity-10 dark:opacity-20`} />
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${cat?.badge ?? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
            {cat && <cat.icon className="w-3 h-3" />}
            {t(`blog.categories.${post.category}.name`)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-400 dark:text-slate-500">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          {post.readingTime && (
            <>
              <span>·</span>
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

        <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-1.5 transition-all mt-auto">
          {t('blog.posts.read')} <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  )
}

export function BlogPageContent() {
  const { t, locale } = useTranslation()

  const postsByCat = (key: string) => BLOG_POSTS.filter((p) => p.category === key)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12),transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
            <Tag className="w-3.5 h-3.5" />
            {t('blog.hero.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-5 leading-tight">
            {t('blog.hero.title')}{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">
              {t('blog.hero.titleHighlight')}
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t('blog.hero.sub')}
          </p>
          {BLOG_POSTS.length > 0 && (
            <div className="flex items-center gap-6 mt-8 text-sm text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {BLOG_POSTS.length} {BLOG_POSTS.length > 1 ? t('blog.hero.articles_plural') : t('blog.hero.articles')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                {t('blog.hero.updated')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* ── Categories ───────────────────────────────────── */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              {t('blog.categories.title')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
              {t('blog.categories.sub')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map(({ key, icon: Icon, gradient, iconBg, border }) => {
              const count = postsByCat(key).length
              return (
                <div
                  key={key}
                  className={`group relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 ${border}`}
                >
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {t(`blog.categories.${key}.name`)}
                  </h3>

                  {/* Desc */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 flex-1">
                    {t(`blog.categories.${key}.desc`)}
                  </p>

                  {/* Keywords */}
                  <p className="text-[10px] text-slate-400 dark:text-slate-600 leading-relaxed mb-3 font-mono">
                    {t(`blog.categories.${key}.keywords`)}
                  </p>

                  {/* Post count */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {count === 0
                        ? t('blog.categories.comingSoon')
                        : `${count} ${count > 1 ? t('blog.hero.articles_plural') : t('blog.hero.articles')}`}
                    </span>
                    {count === 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                        Soon
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Posts or empty state ─────────────────────────── */}
        {BLOG_POSTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mb-5 shadow-lg shadow-primary-500/20">
              <PenLine className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
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
        ) : (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
              {t('blog.posts.all')}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post) => {
                const cat = CATEGORIES.find((c) => c.key === post.category)
                return <PostCard key={post.slug} post={post} cat={cat} />
              })}
            </div>
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────── */}
        <div className="mt-16 rounded-2xl overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 p-8 sm:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold mb-4 border border-white/20">
                {t('blog.cta.badge')}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-3">
                {t('blog.cta.title')}
              </h2>
              <p className="text-primary-100 text-sm mb-6 max-w-lg">
                {t('blog.cta.sub')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-600 font-bold text-sm hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5 group"
                >
                  {t('blog.cta.primary')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/fonctionnalites"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
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
