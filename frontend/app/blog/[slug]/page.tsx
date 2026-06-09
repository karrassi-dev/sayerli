import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildMetadata, BLOG_POSTS, SITE_URL, type BlogPost } from '@/lib/seo'
import { BlogArticleJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'

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

// ── Placeholder content per slug ──────────────────────────────────────────────
const ARTICLE_CONTENT: Record<string, { intro: string; sections: { h2: string; body: string }[] }> = {
  'comment-creer-un-devis-au-maroc': {
    intro:
      'Créer un devis professionnel est une étape clé pour toute PME marocaine. Un devis bien rédigé inspire confiance, protège juridiquement et accélère la prise de décision de vos clients. Dans ce guide, nous vous expliquons comment créer un devis au Maroc, quelles mentions sont obligatoires, et comment un logiciel comme Sayerli simplifie tout le processus.',
    sections: [
      {
        h2: 'Qu\'est-ce qu\'un devis et pourquoi est-il important au Maroc ?',
        body: 'Un devis est un document commercial qui précise les services ou produits proposés, leurs prix unitaires et le total HT et TTC. Au Maroc, un devis accepté constitue un engagement contractuel entre le prestataire et le client. Pour les PME marocaines, le devis est souvent la première impression professionnelle laissée à un prospect.',
      },
      {
        h2: 'Mentions obligatoires d\'un devis au Maroc',
        body: 'Un devis conforme doit inclure : le nom et les coordonnées de l\'entreprise (raison sociale, ICE, adresse), les coordonnées du client, la date d\'émission et la date de validité, le détail des prestations (description, quantité, prix unitaire HT), le taux de TVA applicable (20% standard), le total HT, le montant TVA, et le total TTC en MAD.',
      },
      {
        h2: 'Comment Sayerli simplifie la création de devis',
        body: 'Avec Sayerli, créer un devis prend moins de 2 minutes. Il vous suffit de sélectionner votre client, d\'ajouter vos lignes de services, et Sayerli calcule automatiquement les totaux HT, TVA et TTC. Vous pouvez ensuite envoyer un lien public à votre client pour qu\'il visualise et accepte le devis en ligne.',
      },
    ],
  },
  'meilleur-logiciel-de-facturation-maroc': {
    intro:
      'Choisir le bon logiciel de facturation est crucial pour les PME marocaines qui veulent professionnaliser leur gestion commerciale. Ce comparatif vous aide à trouver la solution idéale pour votre entreprise au Maroc, en analysant les fonctionnalités, les prix en MAD, et l\'adaptation au marché local.',
    sections: [
      {
        h2: 'Critères pour choisir un logiciel de facturation au Maroc',
        body: 'Les PME marocaines doivent prioriser : la conformité fiscale marocaine, la gestion en dirhams (MAD), le support en français et en arabe, la facilité d\'utilisation pour des profils non-techniques, et un prix adapté au marché local. Un bon logiciel doit aussi gérer les devis, les paiements partiels et les relances automatiques.',
      },
      {
        h2: 'Pourquoi Sayerli est le meilleur choix pour les PME marocaines',
        body: 'Sayerli a été conçu spécifiquement pour le marché marocain. Il gère nativement la devise MAD, supporte le français et l\'arabe, génère des factures conformes, et propose une interface simple adaptée aux entrepreneurs non-techniques. Son plan gratuit permet de démarrer sans investissement.',
      },
      {
        h2: 'Fonctionnalités essentielles à comparer',
        body: 'Lors de la comparaison des logiciels de facturation au Maroc, vérifiez la présence de : CRM intégré, création de devis, numérotation automatique des factures, suivi des paiements, tableau de bord financier, gestion multi-utilisateurs, et support client en français.',
      },
    ],
  },
  'crm-pour-pme-maroc': {
    intro:
      'Un CRM (Customer Relationship Management) n\'est plus réservé aux grandes entreprises. Les PME marocaines qui adoptent un CRM voient leur chiffre d\'affaires augmenter de 20 à 40% en moyenne grâce à une meilleure gestion de la relation client. Découvrez pourquoi votre entreprise marocaine a besoin d\'un CRM et comment en choisir un adapté.',
    sections: [
      {
        h2: 'Qu\'est-ce qu\'un CRM et à quoi ça sert pour une PME marocaine ?',
        body: 'Un CRM centralise toutes les informations sur vos clients : coordonnées, historique des achats, devis envoyés, factures, paiements et notes. Pour une PME marocaine, cela signifie fini les données éparpillées entre Excel, WhatsApp et votre mémoire. Tout est accessible en un clic, par toute votre équipe.',
      },
      {
        h2: 'Les bénéfices concrets d\'un CRM pour les entreprises marocaines',
        body: 'Les PME marocaines qui utilisent un CRM constatent : une réduction de 60% du temps de recherche d\'informations clients, une augmentation de 35% du taux de fidélisation, un suivi précis des impayés, et une équipe commerciale plus efficace grâce à une vision partagée des clients.',
      },
      {
        h2: 'Sayerli : le CRM pensé pour le marché marocain',
        body: 'Sayerli intègre un CRM complet, directement lié à votre facturation et vos devis. Gérez vos clients, consultez leur historique complet, ajoutez des notes, et relancez automatiquement les devis expirés ou les factures impayées. Interface en français et en arabe.',
      },
    ],
  },
  'gestion-clients-pour-entreprises-marocaines': {
    intro:
      'La gestion des clients est au cœur de la réussite de toute entreprise marocaine. Qu\'il s\'agisse d\'une agence, d\'un consultant indépendant ou d\'une PME en croissance, une gestion client efficace permet d\'augmenter les revenus, de fidéliser les clients existants et d\'attirer de nouveaux prospects. Ce guide pratique vous montre comment optimiser votre gestion client au Maroc.',
    sections: [
      {
        h2: 'Pourquoi la gestion client est critique pour les PME marocaines',
        body: 'Au Maroc, où la relation de confiance est au cœur des affaires, une gestion client rigoureuse est indispensable. Les entreprises qui centralisent leurs données clients dans un outil dédié convertissent 3x plus de prospects et renouvellent 2x plus de contrats que celles qui utilisent Excel ou des fichiers papier.',
      },
      {
        h2: 'Les éléments clés d\'une bonne gestion client',
        body: 'Une gestion client efficace comprend : une base de données centralisée avec historique complet, un suivi des devis et factures par client, des rappels automatiques pour les suivis commerciaux, une segmentation des clients par CA ou secteur, et une visibilité sur les impayés et les retards de paiement.',
      },
      {
        h2: 'Comment Sayerli révolutionne la gestion client pour les PME marocaines',
        body: 'Avec Sayerli, chaque client dispose d\'une fiche complète centralisant tous ses devis, factures, paiements et notes. Vous pouvez rechercher un client en quelques secondes, voir son CA total, et identifier rapidement les clients à relancer. Tout est synchronisé en temps réel pour toute votre équipe.',
      },
    ],
  },
  'alternative-excel-pour-gerer-son-entreprise': {
    intro:
      'Des milliers d\'entreprises marocaines gèrent encore leur facturation sur Excel. Si Excel est un outil puissant, il n\'est pas conçu pour la gestion commerciale d\'une PME moderne. Erreurs de calcul, fichiers perdus, impossibilité de travailler à plusieurs, absence d\'automatisation — les limites d\'Excel sont nombreuses. Découvrez pourquoi il est temps de migrer vers une solution dédiée.',
    sections: [
      {
        h2: 'Les limites d\'Excel pour les PME marocaines',
        body: 'Excel n\'est pas un logiciel de gestion commerciale. Ses principales limites : aucune numérotation automatique des factures, risques d\'erreurs de calcul sur les TVA, fichiers non partagés en temps réel, aucune relance automatique des impayés, impossibilité d\'envoyer des devis directement aux clients, et absence de tableau de bord financier intégré.',
      },
      {
        h2: 'Pourquoi migrer vers un logiciel dédié',
        body: 'Les PME marocaines qui migrent d\'Excel vers un logiciel de gestion comme Sayerli économisent en moyenne 3 heures par semaine, réduisent leurs erreurs de facturation de 95%, et améliorent leur taux de recouvrement de 40% grâce aux relances automatiques. Le retour sur investissement est immédiat.',
      },
      {
        h2: 'Sayerli : la meilleure alternative à Excel pour les PME marocaines',
        body: 'Sayerli reprend les avantages d\'Excel (simplicité, flexibilité, maîtrise des données) en éliminant tous ses défauts. Interface intuitive sans formation requise, plan gratuit pour démarrer, et fonctionnalités avancées : devis en ligne, facturation automatique, CRM, suivi des paiements en MAD, et tableau de bord analytique.',
      },
    ],
  },
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const content = ARTICLE_CONTENT[slug]

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

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Accueil</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary-600 dark:hover:text-primary-400">Blog</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 truncate">{post.title}</span>
      </nav>

      {/* Article header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-semibold">
            {post.category}
          </span>
          <time className="text-sm text-slate-400" dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('fr-MA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          {post.description}
        </p>

        {/* Keywords chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              {kw}
            </span>
          ))}
        </div>
      </header>

      {/* Article body */}
      {content && (
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-8">
            {content.intro}
          </p>
          {content.sections.map(({ h2, body }, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{h2}</h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{body}</p>
            </section>
          ))}
        </article>
      )}

      {/* CTA block — internal link */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <h2 className="text-xl font-black mb-2">
          Essayez Sayerli gratuitement — Logiciel de gestion pour PME marocaines
        </h2>
        <p className="text-primary-100 text-sm mb-5">
          CRM, Devis, Facturation et suivi des paiements en MAD. Sans carte bancaire.
          Opérationnel en 5 minutes.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-600 font-bold text-sm hover:bg-primary-50 transition-all"
          >
            Créer mon compte gratuit →
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
          >
            ← Retour au blog
          </Link>
        </div>
      </div>

      {/* Related articles */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Articles similaires</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {BLOG_POSTS.filter((p) => p.slug !== slug)
            .slice(0, 2)
            .map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="block p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
              >
                <span className="text-xs text-slate-400 mb-1 block">{related.category}</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {related.title}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </>
  )
}
