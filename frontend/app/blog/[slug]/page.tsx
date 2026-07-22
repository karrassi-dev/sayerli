import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Calendar, ChevronRight, BookOpen, BarChart3, Users } from 'lucide-react'
import { buildMetadata, BLOG_POSTS, SITE_URL, type BlogPost } from '@/lib/seo'
import { BlogArticleJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
import { TableOfContents, type TocItem } from '@/components/blog/TableOfContents'

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
    keywords: [...post.keywords, 'sayerli', 'logiciel gestion maroc', 'pme maroc'],
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-MA', { day: 'numeric', month: 'long', year: 'numeric' })
}

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

// ── Article content ────────────────────────────────────────────────────────────

const ARTICLE_CONTENT: Record<string, { intro: string; sections: { h2: string; body: string }[] }> = {
  'comment-creer-un-devis-au-maroc': {
    intro:
      "Créer un devis professionnel est une étape clé pour toute PME marocaine. Un devis bien rédigé inspire confiance, protège juridiquement et accélère la prise de décision de vos clients. Dans ce guide, nous vous expliquons comment créer un devis au Maroc, quelles mentions sont obligatoires, et comment un logiciel comme Sayerli simplifie tout le processus.",
    sections: [
      {
        h2: "Qu'est-ce qu'un devis et pourquoi est-il important au Maroc ?",
        body: "Un devis est un document commercial qui précise les services ou produits proposés, leurs prix unitaires et le total HT et TTC. Au Maroc, un devis accepté constitue un engagement contractuel entre le prestataire et le client. Pour les PME marocaines, le devis est souvent la première impression professionnelle laissée à un prospect.",
      },
      {
        h2: "Mentions obligatoires d'un devis au Maroc",
        body: "Un devis conforme doit inclure : le nom et les coordonnées de l'entreprise (raison sociale, ICE, adresse), les coordonnées du client, la date d'émission et la date de validité, le détail des prestations (description, quantité, prix unitaire HT), le taux de TVA applicable (20% standard), le total HT, le montant TVA, et le total TTC en MAD.",
      },
      {
        h2: "Comment Sayerli simplifie la création de devis",
        body: "Avec Sayerli, créer un devis prend moins de 2 minutes. Il vous suffit de sélectionner votre client, d'ajouter vos lignes de services, et Sayerli calcule automatiquement les totaux HT, TVA et TTC. Vous pouvez ensuite envoyer un lien public à votre client pour qu'il visualise et accepte le devis en ligne.",
      },
    ],
  },
  'meilleur-logiciel-de-facturation-maroc': {
    intro:
      "Choisir le bon logiciel de facturation est crucial pour les PME marocaines qui veulent professionnaliser leur gestion commerciale. Ce comparatif vous aide à trouver la solution idéale pour votre entreprise au Maroc, en analysant les fonctionnalités, les prix en MAD, et l'adaptation au marché local.",
    sections: [
      {
        h2: "Critères pour choisir un logiciel de facturation au Maroc",
        body: "Les PME marocaines doivent prioriser : la conformité fiscale marocaine, la gestion en dirhams (MAD), le support en français et en arabe, la facilité d'utilisation pour des profils non-techniques, et un prix adapté au marché local. Un bon logiciel doit aussi gérer les devis, les paiements partiels et les relances automatiques.",
      },
      {
        h2: "Pourquoi Sayerli est le meilleur choix pour les PME marocaines",
        body: "Sayerli a été conçu spécifiquement pour le marché marocain. Il gère nativement la devise MAD, supporte le français et l'arabe, génère des factures conformes, et propose une interface simple adaptée aux entrepreneurs non-techniques. Son plan gratuit permet de démarrer sans investissement.",
      },
      {
        h2: "Fonctionnalités essentielles à comparer",
        body: "Lors de la comparaison des logiciels de facturation au Maroc, vérifiez la présence de : CRM intégré, création de devis, numérotation automatique des factures, suivi des paiements, tableau de bord financier, gestion multi-utilisateurs, et support client en français.",
      },
    ],
  },
  'crm-pour-pme-maroc': {
    intro:
      "Un CRM (Customer Relationship Management) n'est plus réservé aux grandes entreprises. Les PME marocaines qui adoptent un CRM voient leur chiffre d'affaires augmenter de 20 à 40% en moyenne grâce à une meilleure gestion de la relation client. Découvrez pourquoi votre entreprise marocaine a besoin d'un CRM et comment en choisir un adapté.",
    sections: [
      {
        h2: "Qu'est-ce qu'un CRM et à quoi ça sert pour une PME marocaine ?",
        body: "Un CRM centralise toutes les informations sur vos clients : coordonnées, historique des achats, devis envoyés, factures, paiements et notes. Pour une PME marocaine, cela signifie fini les données éparpillées entre Excel, WhatsApp et votre mémoire. Tout est accessible en un clic, par toute votre équipe.",
      },
      {
        h2: "Les bénéfices concrets d'un CRM pour les entreprises marocaines",
        body: "Les PME marocaines qui utilisent un CRM constatent : une réduction de 60% du temps de recherche d'informations clients, une augmentation de 35% du taux de fidélisation, un suivi précis des impayés, et une équipe commerciale plus efficace grâce à une vision partagée des clients.",
      },
      {
        h2: "Sayerli : le CRM pensé pour le marché marocain",
        body: "Sayerli intègre un CRM complet, directement lié à votre facturation et vos devis. Gérez vos clients, consultez leur historique complet, ajoutez des notes, et relancez automatiquement les devis expirés ou les factures impayées. Interface en français et en arabe.",
      },
    ],
  },
  'gestion-clients-pour-entreprises-marocaines': {
    intro:
      "La gestion des clients est au cœur de la réussite de toute entreprise marocaine. Qu'il s'agisse d'une agence, d'un consultant indépendant ou d'une PME en croissance, une gestion client efficace permet d'augmenter les revenus, de fidéliser les clients existants et d'attirer de nouveaux prospects.",
    sections: [
      {
        h2: "Pourquoi la gestion client est critique pour les PME marocaines",
        body: "Au Maroc, où la relation de confiance est au cœur des affaires, une gestion client rigoureuse est indispensable. Les entreprises qui centralisent leurs données clients dans un outil dédié convertissent 3x plus de prospects et renouvellent 2x plus de contrats que celles qui utilisent Excel ou des fichiers papier.",
      },
      {
        h2: "Les éléments clés d'une bonne gestion client",
        body: "Une gestion client efficace comprend : une base de données centralisée avec historique complet, un suivi des devis et factures par client, des rappels automatiques pour les suivis commerciaux, une segmentation des clients par CA ou secteur, et une visibilité sur les impayés et les retards de paiement.",
      },
      {
        h2: "Comment Sayerli révolutionne la gestion client pour les PME marocaines",
        body: "Avec Sayerli, chaque client dispose d'une fiche complète centralisant tous ses devis, factures, paiements et notes. Vous pouvez rechercher un client en quelques secondes, voir son CA total, et identifier rapidement les clients à relancer. Tout est synchronisé en temps réel pour toute votre équipe.",
      },
    ],
  },
  'alternative-excel-pour-gerer-son-entreprise': {
    intro:
      "Des milliers d'entreprises marocaines gèrent encore leur facturation sur Excel. Si Excel est un outil puissant, il n'est pas conçu pour la gestion commerciale d'une PME moderne. Erreurs de calcul, fichiers perdus, impossibilité de travailler à plusieurs — les limites d'Excel sont nombreuses.",
    sections: [
      {
        h2: "Les limites d'Excel pour les PME marocaines",
        body: "Excel n'est pas un logiciel de gestion commerciale. Ses principales limites : aucune numérotation automatique des factures, risques d'erreurs de calcul sur les TVA, fichiers non partagés en temps réel, aucune relance automatique des impayés, impossibilité d'envoyer des devis directement aux clients, et absence de tableau de bord financier intégré.",
      },
      {
        h2: "Pourquoi migrer vers un logiciel dédié",
        body: "Les PME marocaines qui migrent d'Excel vers un logiciel de gestion comme Sayerli économisent en moyenne 3 heures par semaine, réduisent leurs erreurs de facturation de 95%, et améliorent leur taux de recouvrement de 40% grâce aux relances automatiques. Le retour sur investissement est immédiat.",
      },
      {
        h2: "Sayerli : la meilleure alternative à Excel pour les PME marocaines",
        body: "Sayerli reprend les avantages d'Excel (simplicité, flexibilité, maîtrise des données) en éliminant tous ses défauts. Interface intuitive sans formation requise, plan gratuit pour démarrer, et fonctionnalités avancées : devis en ligne, facturation automatique, CRM, suivi des paiements en MAD, et tableau de bord analytique.",
      },
    ],
  },
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const content = ARTICLE_CONTENT[slug]
  const cat = CATEGORY_STYLE[post.category]
  const CatIcon = cat?.icon ?? BookOpen
  const readMins = READING_TIMES[slug] ?? 4

  // Build TOC items from h2 headings
  const tocItems: TocItem[] = content
    ? content.sections.map(({ h2 }) => ({ id: slugify(h2), title: h2 }))
    : []

  // Related posts (excluding current)
  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <>
      <BlogArticleJsonLd
        title={post.title}
        description={post.description}
        slug={post.slug}
        publishedAt={post.publishedAt}
        keywords={post.keywords}
      />
      <OrganizationJsonLd />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Accueil</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href="/blog" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        {/* Two-column layout */}
        <div className="lg:flex lg:gap-14 xl:gap-20">

          {/* ── Main article ─────────────────────────────── */}
          <article className="flex-1 min-w-0 max-w-3xl">

            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${cat?.badge ?? ''}`}>
                  <CatIcon className="w-3 h-3" />
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {readMins} min de lecture
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-5">
                {post.title}
              </h1>

              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-2 pb-8 border-b border-slate-100 dark:border-slate-800">
                {post.keywords.map((kw) => (
                  <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {kw}
                  </span>
                ))}
              </div>
            </header>

            {/* Mobile TOC */}
            {tocItems.length > 0 && <TableOfContents items={tocItems} />}

            {/* Article body */}
            {content && (
              <div className="space-y-10">
                {/* Intro */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {content.intro}
                </p>

                {/* Sections */}
                {content.sections.map(({ h2, body }) => (
                  <section key={h2} id={slugify(h2)} className="scroll-mt-28">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 leading-snug">
                      {h2}
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {body}
                    </p>
                  </section>
                ))}
              </div>
            )}

            {/* CTA block */}
            <div className="mt-14 rounded-2xl overflow-hidden">
              <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 p-7 sm:p-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-4 border border-white/20">
                    🇲🇦 Essai gratuit — Sans carte bancaire
                  </div>
                  <h2 className="text-xl font-black text-white mb-2">
                    Essayez Sayerli gratuitement
                  </h2>
                  <p className="text-primary-100 text-sm mb-6">
                    CRM, Devis, Bons de livraison et Facturation en MAD. Opérationnel en 5 minutes.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-600 font-bold text-sm hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5 group"
                    >
                      Créer mon compte gratuit
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Retour au blog
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-14">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
                  Articles similaires
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {related.map((r) => {
                    const rCat = CATEGORY_STYLE[r.category]
                    const RIcon = rCat?.icon ?? BookOpen
                    return (
                      <Link
                        key={r.slug}
                        href={`/blog/${r.slug}`}
                        className="group flex flex-col p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold w-fit mb-3 ${rCat?.badge ?? ''}`}>
                          <RIcon className="w-3 h-3" />
                          {r.category}
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug flex-1">
                          {r.title}
                        </span>
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-1.5 transition-all">
                          Lire <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

          </article>

          {/* ── TOC Sidebar ──────────────────────────────── */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <TableOfContents items={tocItems} />
            </aside>
          )}

        </div>
      </div>
    </>
  )
}
