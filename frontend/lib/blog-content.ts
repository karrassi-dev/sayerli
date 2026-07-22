// ── Block types ────────────────────────────────────────────────────────────────
export type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; variant: 'info' | 'warning' | 'success' | 'sayerli'; title: string; body: string; href?: string; cta?: string }

export interface ArticleSection {
  h2: string
  blocks: Block[]
}

export interface LocaleContent {
  title: string
  description: string
  intro: Block[]
  sections: ArticleSection[]
}

export interface ArticleData {
  slug: string
  image?: string
  readingTime: number
  content: {
    fr: LocaleContent
    en: LocaleContent
    ar: LocaleContent
  }
}

// ── Articles registry ──────────────────────────────────────────────────────────
export const ARTICLES: Record<string, ArticleData> = {
  'comment-devenir-auto-entrepreneur-maroc': {
    slug: 'comment-devenir-auto-entrepreneur-maroc',
    image: '/blog/sayerli-entrepreneur-au-maroc.webp',
    readingTime: 8,
    content: {

      // ── FRENCH ──────────────────────────────────────────────────────────────
      fr: {
        title: 'Comment devenir auto-entrepreneur au Maroc en 2025 : le guide complet',
        description: 'Statut, démarches, plafond de CA, CNSS, fiscalité et obligations de facturation. Tout ce qu\'il faut savoir pour se lancer comme auto-entrepreneur au Maroc.',
        intro: [
          {
            type: 'p',
            text: 'Des milliers de Marocains travaillent dans une zone grise juridique. Développeur freelance à Casablanca, graphiste à Rabat, coach à Marrakech, consultant à Tanger — beaucoup facturent sans statut légal, sans protection sociale et sans papiers conformes. Quand un client demande une vraie facture, on improvise sur Word ou Excel. Résultat : un document peu professionnel, sans numéro fiscal, et potentiellement problématique lors d\'un contrôle fiscal.',
          },
          {
            type: 'p',
            text: 'Depuis 2015, le Maroc a mis en place le régime de l\'auto-entrepreneur — une solution pensée exactement pour ces situations. Inscription gratuite, fiscalité allégée, couverture sociale réelle. Dans ce guide complet, on couvre tout ce qu\'il faut savoir : conditions, démarches pas à pas, CNSS, impôts, et surtout comment tenir vos obligations de facturation sans vous y noyer.',
          },
        ],
        sections: [
          {
            h2: 'C\'est quoi le statut auto-entrepreneur au Maroc ?',
            blocks: [
              {
                type: 'p',
                text: 'Le statut auto-entrepreneur au Maroc est un régime fiscal et social simplifié, créé par la loi n° 114-13, entrée en vigueur en 2015. Il permet à toute personne physique d\'exercer une activité professionnelle de manière légale — sans créer une société, sans capital social, sans comptable obligatoire et sans comptabilité complexe.',
              },
              {
                type: 'p',
                text: 'Concrètement, c\'est la voie légale idéale pour tout travailleur indépendant qui veut facturer ses clients au Maroc, qu\'il s\'agisse d\'une activité principale ou d\'un complément de revenus à côté d\'un emploi salarié.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Différence avec la SARL',
                body: 'L\'auto-entrepreneur agit en tant que personne physique, pas en tant qu\'entreprise morale. Pas de statuts à rédiger, pas de compte bancaire professionnel obligatoire, pas de frais de constitution. La contrepartie : votre patrimoine personnel est engagé en cas de litige.',
              },
            ],
          },
          {
            h2: 'Qui peut devenir auto-entrepreneur au Maroc ?',
            blocks: [
              {
                type: 'p',
                text: 'Le régime est ouvert à toute personne physique, marocaine ou étrangère résidente au Maroc, majeure, qui souhaite exercer légalement une activité. Pas de diplôme requis, pas d\'expérience minimum. Les activités éligibles couvrent la grande majorité des métiers indépendants :',
              },
              {
                type: 'ul',
                items: [
                  'Services intellectuels : développement web, design graphique, rédaction, traduction, marketing digital, conseil, coaching, formation',
                  'Artisanat et métiers manuels : plomberie, électricité, menuiserie, couture, peinture en bâtiment',
                  'Commerce de détail : revente de produits physiques',
                  'Enseignement particulier et cours privés',
                  'Services à la personne : ménage, garde d\'enfants, jardinage',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Professions exclues du régime',
                body: 'Les professions réglementées ne peuvent pas utiliser ce statut : avocats, médecins, notaires, experts-comptables, architectes, ingénieurs inscrits à un ordre. Ces professions doivent passer par une structure juridique différente (personne morale ou régime de droit commun).',
              },
            ],
          },
          {
            h2: 'Le plafond de chiffre d\'affaires : ce que vous devez savoir',
            blocks: [
              {
                type: 'p',
                text: 'Le régime auto-entrepreneur est soumis à un plafond annuel de chiffre d\'affaires. Ce plafond varie selon la nature de votre activité :',
              },
              {
                type: 'table',
                headers: ['Type d\'activité', 'Plafond annuel'],
                rows: [
                  ['Activités commerciales et artisanales', '500 000 MAD'],
                  ['Prestations de services', '200 000 MAD'],
                ],
              },
              {
                type: 'p',
                text: 'Si vous dépassez ce plafond pendant deux années consécutives, vous devez basculer vers un autre régime. En pratique, la plupart des freelancers et consultants en début d\'activité restent largement en dessous de ce seuil. La question de la transition vers une SARL se pose généralement après quelques années de croissance.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Conseil anticipation',
                body: 'Dès que vous atteignez 70-80% du plafond, commencez à vous renseigner sur la création d\'une SARL. La transition prend 4 à 8 semaines et il vaut mieux ne pas être pris de court en fin d\'année.',
              },
            ],
          },
          {
            h2: 'Comment s\'inscrire en tant qu\'auto-entrepreneur au Maroc',
            blocks: [
              {
                type: 'p',
                text: 'L\'inscription est entièrement gratuite et se fait en ligne sur la plateforme officielle. Depuis la refonte du portail, la procédure a été considérablement simplifiée. Voici les étapes exactes :',
              },
              {
                type: 'ol',
                items: [
                  'Rendez-vous sur portail.auto-entrepreneur.ma et créez votre compte avec votre email',
                  'Renseignez vos informations personnelles : numéro de CIN, date de naissance, adresse, numéro de téléphone',
                  'Choisissez votre activité principale dans la liste déroulante des activités éligibles',
                  'Ajoutez une description détaillée de votre activité (cela facilite le traitement du dossier)',
                  'Soumettez votre demande — aucun document papier à envoyer pour la grande majorité des activités',
                  'Recevez votre Identifiant Fiscal (IF) et votre attestation d\'inscription par email, sous 24 à 72h ouvrables',
                ],
              },
              {
                type: 'p',
                text: 'Une fois votre IF obtenu, vous pouvez légalement commencer à facturer. Notez que ce numéro doit figurer obligatoirement sur toutes vos factures. Pour les activités nécessitant une autorisation préalable (ex : transports, métiers réglementés), des démarches complémentaires peuvent s\'ajouter.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Durée réelle constatée',
                body: 'Dans la pratique, la majorité des inscriptions en ligne sont traitées en moins de 48 heures. Certains retours de dossiers complets ont même été observés le jour même. Le processus papier en agence CNSS prend en général 3 à 5 jours ouvrables.',
              },
            ],
          },
          {
            h2: 'CNSS auto-entrepreneur : votre couverture sociale au Maroc',
            blocks: [
              {
                type: 'p',
                text: 'L\'un des véritables apports du régime auto-entrepreneur est l\'accès à la couverture sociale via la CNSS. Les cotisations sont proportionnelles à votre chiffre d\'affaires déclaré, ce qui les rend accessibles même en début d\'activité. Voici les taux en vigueur :',
              },
              {
                type: 'table',
                headers: ['Nature de l\'activité', 'Taux CNSS sur CA'],
                rows: [
                  ['Activités commerciales', '6%'],
                  ['Activités artisanales', '6%'],
                  ['Prestations de services', '10,4%'],
                ],
              },
              {
                type: 'p',
                text: 'Ces cotisations ouvrent droit à l\'Assurance Maladie Obligatoire (AMO), à une pension de retraite, et aux prestations familiales. Les déclarations et paiements se font chaque trimestre, soit en ligne sur le portail auto-entrepreneur, soit dans une agence CNSS.',
              },
              {
                type: 'p',
                text: 'Point important : si vous êtes salarié en parallèle et que votre employeur vous affilié déjà à la CNSS, vous n\'avez pas à cotiser une seconde fois pour votre activité auto-entrepreneur. Vérifiez auprès de votre agence CNSS pour confirmer votre situation.',
              },
            ],
          },
          {
            h2: 'La fiscalité de l\'auto-entrepreneur : IR libératoire et exonérations',
            blocks: [
              {
                type: 'p',
                text: 'La fiscalité est l\'un des points forts du régime. L\'auto-entrepreneur paie un Impôt sur le Revenu (IR) dit "libératoire" — calculé directement sur le chiffre d\'affaires déclaré trimestriellement, sans avoir à déterminer un résultat net ni tenir une comptabilité analytique complète. Les taux sont les suivants :',
              },
              {
                type: 'table',
                headers: ['Nature de l\'activité', 'Taux IR libératoire'],
                rows: [
                  ['Activités commerciales', '1% du CA HT'],
                  ['Activités artisanales', '1% du CA HT'],
                  ['Prestations de services', '2% du CA HT'],
                ],
              },
              {
                type: 'p',
                text: 'Autre avantage majeur : les auto-entrepreneurs sont exonérés de TVA. Vous n\'avez pas à la collecter sur vos factures ni à la déclarer. En contrepartie, vous ne pouvez pas récupérer la TVA que vous payez sur vos achats professionnels — ce qui peut être pénalisant si vous avez beaucoup de charges.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Exonération totale les 3 premières années',
                body: 'Bonne nouvelle pour les nouveaux auto-entrepreneurs : vous bénéficiez d\'une exonération totale d\'IR pendant les 3 premières années d\'activité, à compter de la date d\'enregistrement. Cela représente une économie significative pour démarrer sereinement.',
              },
            ],
          },
          {
            h2: 'Vos obligations de facturation et comment les simplifier',
            blocks: [
              {
                type: 'p',
                text: 'C\'est ici que beaucoup d\'auto-entrepreneurs marocains perdent du temps et font des erreurs. Chaque prestation ou vente doit être documentée par une facture conforme. Cette facture constitue aussi la base de votre déclaration trimestrielle. Voici ce qu\'elle doit obligatoirement mentionner :',
              },
              {
                type: 'ul',
                items: [
                  'Vos nom et prénom complets (ou nom commercial si vous en avez un)',
                  'Votre Identifiant Fiscal (IF) — obtenu lors de l\'inscription',
                  'Votre adresse professionnelle',
                  'La date d\'émission et un numéro de facture séquentiel (FA-2025-001, FA-2025-002...)',
                  'Les coordonnées complètes de votre client',
                  'La description détaillée de la prestation ou du produit',
                  'La quantité, le prix unitaire HT, et le total HT (= TTC car vous êtes exonéré TVA)',
                  'La mention explicite "Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX"',
                  'Les conditions et modalités de paiement',
                ],
              },
              {
                type: 'p',
                text: 'En pratique, beaucoup d\'auto-entrepreneurs marocains créent encore leurs factures sur Word ou Excel. Le problème ? Pas de numérotation automatique, risques d\'erreurs sur les totaux, aucun suivi des impayés, et un aspect peu professionnel qui peut faire douter un client sérieux. Un prestataire qui envoie un PDF propre, avec son logo et ses mentions légales, inspire immédiatement plus confiance.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Gérez vos factures auto-entrepreneur avec Sayerli',
                body: 'Sayerli a été conçu pour les auto-entrepreneurs et freelancers marocains. Créez des factures conformes avec toutes les mentions légales en moins de 2 minutes. Envoyez des devis professionnels par WhatsApp ou email. Suivez vos paiements et préparez vos déclarations trimestrielles sans effort. Essai gratuit — sans carte bancaire.',
                href: '/register',
                cta: 'Créer mon compte gratuit',
              },
            ],
          },
          {
            h2: 'Les avantages et les limites du statut auto-entrepreneur',
            blocks: [
              {
                type: 'p',
                text: 'Voici un bilan honnête pour vous aider à décider si ce statut correspond à votre situation :',
              },
              {
                type: 'table',
                headers: ['Avantages', 'Limites'],
                rows: [
                  ['Inscription gratuite et rapide (< 72h)', 'Plafond de CA limité (200K MAD/an pour les services)'],
                  ['Fiscalité allégée : IR sur CA brut, pas sur bénéfice', 'Pas de déduction des charges professionnelles'],
                  ['Exonération de TVA = moins de comptabilité', 'Pas de récupération de TVA sur vos achats'],
                  ['Couverture sociale CNSS dès le 1er dirham', 'Responsabilité personnelle illimitée'],
                  ['Cumulable avec un emploi salarié', 'Certains grands comptes exigent une personne morale'],
                  ['Exonération IR les 3 premières années', 'Image parfois moins "sérieuse" que la SARL'],
                ],
              },
            ],
          },
          {
            h2: 'Par où commencer : votre plan d\'action concret',
            blocks: [
              {
                type: 'p',
                text: 'Si le statut auto-entrepreneur correspond à votre projet, voici votre feuille de route pour vous lancer dans les meilleures conditions :',
              },
              {
                type: 'ol',
                items: [
                  'Vérifiez que votre activité est éligible sur portail.auto-entrepreneur.ma (rubrique "Activités autorisées")',
                  'Inscrivez-vous en ligne — c\'est gratuit et prend moins de 15 minutes',
                  'Récupérez votre Identifiant Fiscal (IF) par email sous 24 à 72h',
                  'Ouvrez un compte bancaire dédié à votre activité (pas obligatoire légalement, mais fortement recommandé pour séparer vos finances)',
                  'Mettez en place un outil de facturation pour émettre des factures conformes dès le premier client',
                  'Notez les dates de déclaration trimestrielle CNSS/IR dans votre agenda — ne les oubliez pas, même si votre CA est nul',
                ],
              },
              {
                type: 'p',
                text: 'Le statut auto-entrepreneur est une vraie opportunité pour tous ceux qui veulent travailler à leur compte au Maroc sans la complexité d\'une société. La clé du succès ? Une bonne organisation administrative dès le départ — notamment sur la facturation — pour vous concentrer sur l\'essentiel : votre activité et vos clients.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli : l\'outil de gestion des indépendants marocains',
                body: 'Devis professionnels, factures conformes, suivi des paiements en MAD, tableau de bord de votre activité — tout ce dont vous avez besoin pour gérer votre activité auto-entrepreneur sans prise de tête. Démarrez gratuitement, sans carte bancaire.',
                href: '/fonctionnalites',
                cta: 'Voir toutes les fonctionnalités',
              },
            ],
          },
        ],
      },

      // ── ENGLISH ─────────────────────────────────────────────────────────────
      en: {
        title: 'How to Become a Self-Employed Entrepreneur in Morocco in 2025: The Complete Guide',
        description: 'Registration process, revenue cap, CNSS social coverage, taxation and invoicing obligations. Everything you need to know to start as an auto-entrepreneur in Morocco.',
        intro: [
          {
            type: 'p',
            text: 'Thousands of Moroccans work in a legal grey zone. Freelance developers in Casablanca, designers in Rabat, coaches in Marrakech, consultants in Tangier — many invoice clients without any legal status, no social protection, and no compliant documents. When a serious client asks for a proper invoice, they improvise on Word or Excel. The result: an unprofessional document with no tax ID, and a real risk during a tax audit.',
          },
          {
            type: 'p',
            text: 'Since 2015, Morocco has established the auto-entrepreneur regime — a solution designed exactly for these situations. Free registration, reduced taxation, real social coverage. In this complete guide, we cover everything you need to know: conditions, step-by-step process, CNSS, taxes, and how to handle your invoicing obligations without drowning in paperwork.',
          },
        ],
        sections: [
          {
            h2: 'What is the auto-entrepreneur status in Morocco?',
            blocks: [
              {
                type: 'p',
                text: 'The auto-entrepreneur status in Morocco is a simplified tax and social regime created by Law No. 114-13, which came into force in 2015. It allows any individual to practice a professional activity legally — without creating a company, without minimum capital, without a mandatory accountant, and without complex bookkeeping.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Key difference from an SARL',
                body: 'As an auto-entrepreneur, you act as a natural person, not as a legal entity. No articles of association to draft, no mandatory professional bank account, no incorporation fees. The trade-off: your personal assets are at risk in case of a dispute.',
              },
            ],
          },
          {
            h2: 'Who can become an auto-entrepreneur in Morocco?',
            blocks: [
              {
                type: 'p',
                text: 'The regime is open to any individual — Moroccan or foreign resident in Morocco — of legal age who wishes to legally carry out an activity. No diploma required, no minimum experience. Eligible activities cover the vast majority of independent trades:',
              },
              {
                type: 'ul',
                items: [
                  'Intellectual services: web development, graphic design, copywriting, translation, digital marketing, consulting, coaching, training',
                  'Crafts and manual trades: plumbing, electrical, carpentry, tailoring, painting',
                  'Retail commerce: resale of physical products',
                  'Private tutoring and courses',
                  'Personal services: cleaning, childcare, gardening',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Excluded professions',
                body: 'Regulated professions cannot use this status: lawyers, doctors, notaries, chartered accountants, architects, and any profession subject to a professional order. These must use a different legal structure.',
              },
            ],
          },
          {
            h2: 'Revenue cap: what you need to know',
            blocks: [
              {
                type: 'table',
                headers: ['Activity type', 'Annual revenue cap'],
                rows: [
                  ['Commercial and craft activities', '500,000 MAD'],
                  ['Service activities', '200,000 MAD'],
                ],
              },
              {
                type: 'p',
                text: 'If you exceed this cap for two consecutive years, you must switch to another legal structure. In practice, most freelancers and consultants starting out remain well below this threshold. The question of transitioning to an SARL usually arises after a few years of growth.',
              },
            ],
          },
          {
            h2: 'How to register as an auto-entrepreneur in Morocco',
            blocks: [
              {
                type: 'p',
                text: 'Registration is completely free and done online at portail.auto-entrepreneur.ma. Here are the exact steps:',
              },
              {
                type: 'ol',
                items: [
                  'Go to portail.auto-entrepreneur.ma and create your account with your email',
                  'Enter your personal details: national ID number, date of birth, address, phone number',
                  'Choose your main activity from the list of eligible activities',
                  'Add a detailed description of your activity',
                  'Submit your application — no paper documents needed for most activities',
                  'Receive your Tax Identifier (IF) and registration certificate by email within 24–72 business hours',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Real-world processing time',
                body: 'In practice, most online registrations are processed within 48 hours. Some complete applications receive a response the same day. The in-person process at a CNSS branch generally takes 3 to 5 business days.',
              },
            ],
          },
          {
            h2: 'CNSS: your social coverage as an auto-entrepreneur',
            blocks: [
              {
                type: 'table',
                headers: ['Activity type', 'CNSS rate on revenue'],
                rows: [
                  ['Commercial activities', '6%'],
                  ['Craft activities', '6%'],
                  ['Service activities', '10.4%'],
                ],
              },
              {
                type: 'p',
                text: 'These contributions give you access to mandatory health insurance (AMO), a retirement pension, and family allowances. Declarations and payments are made quarterly, either online or at a CNSS branch.',
              },
            ],
          },
          {
            h2: 'Taxation: the IR libératoire and exemptions',
            blocks: [
              {
                type: 'table',
                headers: ['Activity type', 'IR libératoire rate'],
                rows: [
                  ['Commercial activities', '1% of revenue'],
                  ['Craft activities', '1% of revenue'],
                  ['Service activities', '2% of revenue'],
                ],
              },
              {
                type: 'p',
                text: 'Auto-entrepreneurs are also VAT-exempt. You do not collect VAT on your invoices, which simplifies your accounting significantly. The trade-off: you cannot recover VAT on your business purchases.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Full tax exemption for the first 3 years',
                body: 'Auto-entrepreneurs benefit from complete IR exemption for the first 3 years of activity from the registration date. A significant financial advantage to start on solid footing.',
              },
            ],
          },
          {
            h2: 'Your invoicing obligations — and how to simplify them',
            blocks: [
              {
                type: 'p',
                text: 'Every service or sale must be documented by a compliant invoice. Here is what a Moroccan auto-entrepreneur invoice must include:',
              },
              {
                type: 'ul',
                items: [
                  'Your full name (or trade name)',
                  'Your Tax Identifier (IF)',
                  'Your professional address',
                  'Issue date and a sequential invoice number (INV-2025-001...)',
                  'Your client\'s complete details',
                  'Detailed description of the service or product',
                  'Quantity, unit price, and total in MAD (VAT-exempt)',
                  'Explicit mention: "VAT-exempt — Auto-entrepreneur IF No. XXXXXXXX"',
                  'Payment terms and conditions',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Manage your auto-entrepreneur invoices with Sayerli',
                body: 'Sayerli was built for Moroccan auto-entrepreneurs and freelancers. Create compliant invoices with all required legal mentions in under 2 minutes. Send professional quotes via WhatsApp or email. Track payments and prepare your quarterly declarations effortlessly. Free trial — no credit card required.',
                href: '/register',
                cta: 'Create my free account',
              },
            ],
          },
          {
            h2: 'Pros and cons of the auto-entrepreneur status',
            blocks: [
              {
                type: 'table',
                headers: ['Advantages', 'Limitations'],
                rows: [
                  ['Free and fast registration (< 72h)', 'Revenue cap (200K MAD/year for services)'],
                  ['Simplified taxation on gross revenue', 'No deduction of business expenses'],
                  ['VAT exemption = less accounting', 'No VAT recovery on purchases'],
                  ['CNSS social coverage from day one', 'Unlimited personal liability'],
                  ['Can be combined with a salaried job', 'Some large clients require a legal entity'],
                  ['Full IR exemption for first 3 years', 'Can seem less "serious" than an SARL to some clients'],
                ],
              },
            ],
          },
          {
            h2: 'Your concrete action plan to get started',
            blocks: [
              {
                type: 'ol',
                items: [
                  'Verify your activity is eligible at portail.auto-entrepreneur.ma',
                  'Register online — free and takes under 15 minutes',
                  'Receive your Tax Identifier (IF) within 24–72 hours',
                  'Open a dedicated bank account for your activity (strongly recommended)',
                  'Set up an invoicing tool to issue compliant invoices from your first client',
                  'Mark quarterly CNSS/IR declaration dates in your calendar — even if your revenue is zero',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli: the tool for Moroccan independent workers',
                body: 'Professional quotes, compliant invoices, MAD payment tracking, and a complete activity dashboard — everything you need to run your auto-entrepreneur business without the headaches. Start free, no credit card required.',
                href: '/fonctionnalites',
                cta: 'See all features',
              },
            ],
          },
        ],
      },

      // ── ARABIC ──────────────────────────────────────────────────────────────
      ar: {
        title: 'كيف تصبح مقاولاً ذاتياً بالمغرب في 2025: الدليل الشامل',
        description: 'إجراءات التسجيل، سقف رقم الأعمال، الصندوق الوطني للضمان الاجتماعي، الضرائب والتزامات الفوترة. كل ما تحتاج معرفته للانطلاق كمقاول ذاتي بالمغرب.',
        intro: [
          {
            type: 'p',
            text: 'آلاف المغاربة يعملون في منطقة رمادية قانونية. مطورون مستقلون في الدار البيضاء، مصممون في الرباط، مدربون في مراكش، مستشارون في طنجة — كثيرون منهم يُفوترون العملاء دون وضع قانوني، ودون حماية اجتماعية، ودون وثائق مطابقة للقانون. حين يطلب عميل جاد فاتورة حقيقية، يلجؤون إلى Word أو Excel. النتيجة: وثيقة غير احترافية، بلا معرّف ضريبي، وقد تُشكّل خطراً عند أي مراجعة جبائية.',
          },
          {
            type: 'p',
            text: 'منذ عام 2015، أرسى المغرب نظام المقاول الذاتي — حلٌّ مُصمَّم تحديداً لهذه الأوضاع. تسجيل مجاني، ضرائب مخففة، وتغطية اجتماعية فعلية. في هذا الدليل الشامل، نغطي كل ما تحتاج معرفته: الشروط، والخطوات التفصيلية، والصندوق الوطني للضمان الاجتماعي، والضرائب، وكيفية إدارة التزامات الفوترة دون أن تضيع في الإجراءات.',
          },
        ],
        sections: [
          {
            h2: 'ما هو وضع المقاول الذاتي بالمغرب؟',
            blocks: [
              {
                type: 'p',
                text: 'وضع المقاول الذاتي بالمغرب هو نظام ضريبي واجتماعي مبسط، أُنشئ بموجب القانون رقم 114-13 الذي دخل حيز التنفيذ عام 2015. يتيح لأي شخص طبيعي ممارسة نشاط مهني بصفة قانونية — دون الحاجة إلى تأسيس شركة، ودون رأس مال أدنى، ودون محاسب إلزامي، ودون محاسبة معقدة.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'الفرق مع الشركة ذات المسؤولية المحدودة',
                body: 'يتصرف المقاول الذاتي بصفته شخصاً طبيعياً لا شخصاً اعتبارياً. لا نظام أساسي لشركة، ولا حساب بنكي مهني إلزامي، ولا رسوم تأسيس. في المقابل، ممتلكاتك الشخصية تكون في خطر في حالة نزاع.',
              },
            ],
          },
          {
            h2: 'من يمكنه أن يصبح مقاولاً ذاتياً بالمغرب؟',
            blocks: [
              {
                type: 'p',
                text: 'النظام مفتوح لكل شخص طبيعي، مغربي أو أجنبي مقيم بالمغرب، بالغ سن الرشد، يرغب في ممارسة نشاط بصفة قانونية. لا يُشترط حصول على شهادة علمية أو خبرة مهنية. تشمل الأنشطة المؤهلة الغالبية العظمى من المهن المستقلة:',
              },
              {
                type: 'ul',
                items: [
                  'الخدمات الذهنية: تطوير الويب، التصميم الجرافيكي، الكتابة، الترجمة، التسويق الرقمي، الاستشارة، التدريب',
                  'الحرف اليدوية: السباكة، الكهرباء، النجارة، الخياطة، الطلاء',
                  'التجارة بالتجزئة: إعادة بيع المنتجات',
                  'الدروس الخصوصية والتكوين',
                  'خدمات المنازل: التنظيف، حضانة الأطفال، البستنة',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'المهن المستثناة',
                body: 'المهن المنظمة لا يمكنها استخدام هذا الوضع: المحامون، الأطباء، الموثقون، خبراء المحاسبة، المهندسون المعماريون، وكل مهنة تخضع لهيئة مهنية. يجب على هؤلاء اللجوء إلى هيكل قانوني مختلف.',
              },
            ],
          },
          {
            h2: 'سقف رقم الأعمال: ما يجب معرفته',
            blocks: [
              {
                type: 'table',
                headers: ['نوع النشاط', 'السقف السنوي'],
                rows: [
                  ['الأنشطة التجارية والحرفية', '500,000 درهم'],
                  ['تقديم الخدمات', '200,000 درهم'],
                ],
              },
              {
                type: 'p',
                text: 'إذا تجاوزت هذا السقف لسنتين متتاليتين، يجب الانتقال إلى هيكل قانوني آخر. في الواقع، يبقى معظم المستقلين والمستشارين في بداية نشاطهم بعيدين عن هذا الحد. تطرح مسألة التحول إلى شركة ذات مسؤولية محدودة عادةً بعد سنوات من النمو.',
              },
            ],
          },
          {
            h2: 'كيفية التسجيل كمقاول ذاتي بالمغرب',
            blocks: [
              {
                type: 'p',
                text: 'التسجيل مجاني تماماً ويتم عبر الإنترنت على portail.auto-entrepreneur.ma. إليك الخطوات الدقيقة:',
              },
              {
                type: 'ol',
                items: [
                  'توجه إلى portail.auto-entrepreneur.ma وأنشئ حسابك بالبريد الإلكتروني',
                  'أدخل معلوماتك الشخصية: رقم بطاقة التعريف الوطنية، تاريخ الميلاد، العنوان، رقم الهاتف',
                  'اختر نشاطك الرئيسي من قائمة الأنشطة المؤهلة',
                  'أضف وصفاً تفصيلياً لنشاطك',
                  'أرسل طلبك — لا حاجة لأي وثائق ورقية في معظم الحالات',
                  'احصل على معرفك الضريبي (IF) وشهادة تسجيلك عبر البريد الإلكتروني خلال 24 إلى 72 ساعة عمل',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'المدة الفعلية للمعالجة',
                body: 'في الواقع العملي، تُعالَج معظم التسجيلات الإلكترونية خلال 48 ساعة. بعض الملفات الكاملة تلقى رداً في اليوم ذاته. أما المسار الورقي في وكالة الصندوق الوطني للضمان الاجتماعي فيستغرق عادةً من 3 إلى 5 أيام عمل.',
              },
            ],
          },
          {
            h2: 'الصندوق الوطني للضمان الاجتماعي: تغطيتك الاجتماعية',
            blocks: [
              {
                type: 'table',
                headers: ['نوع النشاط', 'نسبة الاشتراك على رقم الأعمال'],
                rows: [
                  ['الأنشطة التجارية', '6%'],
                  ['الأنشطة الحرفية', '6%'],
                  ['تقديم الخدمات', '10.4%'],
                ],
              },
              {
                type: 'p',
                text: 'تمنحك هذه الاشتراكات الحق في التأمين الصحي الإلزامي (AMO)، ومعاش التقاعد، والتعويضات العائلية. تُنجز التصريحات والأداءات كل ثلاثة أشهر، إما عبر الإنترنت أو في وكالة الصندوق الوطني للضمان الاجتماعي.',
              },
            ],
          },
          {
            h2: 'الجباية: الضريبة على الدخل الجزافية والإعفاءات',
            blocks: [
              {
                type: 'table',
                headers: ['نوع النشاط', 'نسبة الضريبة على الدخل الجزافية'],
                rows: [
                  ['الأنشطة التجارية', '1% من رقم الأعمال'],
                  ['الأنشطة الحرفية', '1% من رقم الأعمال'],
                  ['تقديم الخدمات', '2% من رقم الأعمال'],
                ],
              },
              {
                type: 'p',
                text: 'كما يُعفى المقاولون الذاتيون من الضريبة على القيمة المضافة. لا تجمعها من عملائك ولا تُصرّح بها، مما يُبسّط محاسبتك بشكل ملحوظ. في المقابل، لا يمكنك استرداد الضريبة على القيمة المضافة من مشترياتك المهنية.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'إعفاء كامل خلال السنوات الثلاث الأولى',
                body: 'يستفيد المقاولون الذاتيون من إعفاء كامل من الضريبة على الدخل خلال السنوات الثلاث الأولى من تاريخ التسجيل. ميزة مالية كبيرة للانطلاق بثبات.',
              },
            ],
          },
          {
            h2: 'التزاماتك في الفوترة وكيفية تبسيطها',
            blocks: [
              {
                type: 'p',
                text: 'يجب توثيق كل خدمة أو بيع بفاتورة مطابقة للمواصفات القانونية. يجب أن تتضمن فاتورة المقاول الذاتي المغربي إلزامياً:',
              },
              {
                type: 'ul',
                items: [
                  'اسمك الكامل (أو الاسم التجاري إن وُجد)',
                  'معرفك الضريبي (IF)',
                  'عنوانك المهني',
                  'تاريخ الإصدار ورقم تسلسلي للفاتورة (FA-2025-001...)',
                  'المعلومات الكاملة للعميل',
                  'وصف تفصيلي للخدمة أو المنتج',
                  'الكمية والسعر الوحدوي والمجموع بالدرهم (معفى من الضريبة على القيمة المضافة)',
                  'الإشارة الصريحة: "معفى من الضريبة على القيمة المضافة — مقاول ذاتي IF رقم XXXXXXXX"',
                  'شروط وآجال الدفع',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'أدر فواتيرك مع Sayerli',
                body: 'صُمِّم Sayerli للمقاولين الذاتيين والمستقلين المغاربة. أنشئ فواتير مطابقة للمواصفات بكل البيانات الإلزامية في أقل من دقيقتين. أرسل عروض أسعار احترافية عبر واتساب أو البريد الإلكتروني. تتبع المدفوعات وجهّز تصريحاتك الفصلية بسهولة. تجربة مجانية — بدون بطاقة بنكية.',
                href: '/register',
                cta: 'إنشاء حسابي المجاني',
              },
            ],
          },
          {
            h2: 'مزايا وحدود وضع المقاول الذاتي',
            blocks: [
              {
                type: 'table',
                headers: ['المزايا', 'الحدود'],
                rows: [
                  ['تسجيل مجاني وسريع (أقل من 72 ساعة)', 'سقف رقم الأعمال (200,000 درهم/سنة للخدمات)'],
                  ['ضرائب مبسطة على رقم الأعمال الإجمالي', 'لا خصم للمصاريف المهنية'],
                  ['إعفاء من الضريبة على القيمة المضافة = محاسبة أبسط', 'لا استرداد الضريبة على القيمة المضافة من المشتريات'],
                  ['تغطية اجتماعية من أول درهم', 'مسؤولية شخصية غير محدودة'],
                  ['إمكانية الجمع مع عمل مأجور', 'بعض الشركات الكبرى تشترط التعامل مع أشخاص اعتبارية'],
                  ['إعفاء كامل من الضريبة لأول 3 سنوات', 'قد يبدو أقل رسوخاً من الشركة في نظر بعض العملاء'],
                ],
              },
            ],
          },
          {
            h2: 'خطتك العملية للانطلاق',
            blocks: [
              {
                type: 'ol',
                items: [
                  'تحقق من أن نشاطك مؤهل على portail.auto-entrepreneur.ma',
                  'سجّل عبر الإنترنت — مجاناً وفي أقل من 15 دقيقة',
                  'احصل على معرفك الضريبي (IF) خلال 24 إلى 72 ساعة',
                  'افتح حساباً بنكياً مخصصاً لنشاطك (مستحسن بشدة)',
                  'استخدم أداة فوترة لإصدار فواتير مطابقة منذ أول عميل',
                  'سجّل مواعيد التصريحات الفصلية في مفكرتك — حتى لو كان رقم أعمالك صفراً',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli: أداة المستقلين المغاربة',
                body: 'عروض أسعار احترافية، فواتير مطابقة، تتبع المدفوعات بالدرهم، ولوحة قيادة لنشاطك — كل ما تحتاجه لإدارة مقاولتك الذاتية دون تعقيد. ابدأ مجاناً، بدون بطاقة بنكية.',
                href: '/fonctionnalites',
                cta: 'اكتشف جميع المزايا',
              },
            ],
          },
        ],
      },
    },
  },

  // ── ARTICLE 2 ────────────────────────────────────────────────────────────────
  'plafond-ca-auto-entrepreneur-maroc': {
    slug: 'plafond-ca-auto-entrepreneur-maroc',
    image: '/blog/seuil-ca-auto-entrepreneur-maroc.webp',
    readingTime: 6,
    content: {

      // ── FRENCH ────────────────────────────────────────────────────────────
      fr: {
        title: 'Plafond de CA auto-entrepreneur au Maroc : 500 000 MAD services, 2 000 000 MAD commerce',
        description: 'Comprendre les plafonds de chiffre d\'affaires du régime auto-entrepreneur au Maroc : comment les calculer, que faire en cas de dépassement, et quelle structure adopter ensuite.',
        intro: [
          {
            type: 'p',
            text: 'Vous venez de vous lancer en tant qu\'auto-entrepreneur au Maroc, votre activité décolle et vous commencez à voir des chiffres sérieux arriver. Très bien. Mais à un moment précis, une question devient urgente : est-ce que je vais dépasser le plafond de chiffre d\'affaires autorisé ? Et si oui, qu\'est-ce qui m\'attend ?',
          },
          {
            type: 'p',
            text: 'Le plafond de CA est l\'une des règles les plus importantes — et les plus mal comprises — du régime auto-entrepreneur marocain. Beaucoup d\'indépendants le découvrent trop tard, en pleine croissance, et se retrouvent à devoir tout réorganiser dans l\'urgence. Ce guide vous explique tout : les seuils exacts, comment calculer votre CA, ce qui se passe si vous dépassez, et comment anticiper la transition sereinement.',
          },
        ],
        sections: [
          {
            h2: 'Les deux plafonds du régime auto-entrepreneur au Maroc',
            blocks: [
              {
                type: 'p',
                text: 'Le régime auto-entrepreneur au Maroc fixe deux plafonds annuels de chiffre d\'affaires selon la nature de votre activité. Ces seuils ont été revus à la hausse pour permettre aux indépendants de croître sans sortir trop tôt du régime simplifié :',
              },
              {
                type: 'table',
                headers: ['Type d\'activité', 'Plafond annuel de CA'],
                rows: [
                  ['Prestations de services', '500 000 MAD'],
                  ['Activités commerciales et artisanales', '2 000 000 MAD'],
                ],
              },
              {
                type: 'p',
                text: 'La distinction entre "services" et "commerce" est essentielle. Si vous êtes développeur web, designer, consultant, coach ou formateur, vous relevez des prestations de services — plafond à 500 000 MAD. Si vous achetez et revendez des produits physiques, ou exercez une activité artisanale, vous relevez du commerce — plafond à 2 000 000 MAD.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Règle des deux années consécutives',
                body: 'Le dépassement du plafond n\'entraîne pas de sortie automatique du régime dès la première année. Vous devez dépasser le seuil deux années consécutives pour être obligé de changer de régime. Une seule bonne année ne suffit pas à vous faire basculer.',
              },
            ],
          },
          {
            h2: 'Comment calculer exactement votre chiffre d\'affaires ?',
            blocks: [
              {
                type: 'p',
                text: 'Le chiffre d\'affaires pris en compte pour le plafond, c\'est le montant total hors taxes encaissé sur l\'année civile (du 1er janvier au 31 décembre). Attention à ne pas confondre avec le bénéfice — on parle bien du total de ce que vous avez facturé et encaissé, avant toute déduction de charges.',
              },
              {
                type: 'ul',
                items: [
                  'On compte : toutes les factures encaissées dans l\'année, quelle que soit la date de la prestation',
                  'On ne déduit pas : vos charges, achats de matériel, déplacements ou autres frais professionnels',
                  'On exclut : les remboursements de frais refacturés à l\'identique (avances clients remboursées)',
                  'Devise : tout est converti en MAD au taux du jour de l\'encaissement si vous facturez en EUR ou USD',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Piège à éviter',
                body: 'Certains auto-entrepreneurs croient que le CA se calcule sur les factures émises, pas encaissées. C\'est faux pour ce régime. C\'est bien la date d\'encaissement qui compte. Une facture émise en décembre mais payée en janvier est comptée dans l\'année suivante.',
              },
            ],
          },
          {
            h2: 'Activités mixtes : comment gérer plusieurs types d\'activités ?',
            blocks: [
              {
                type: 'p',
                text: 'Si vous exercez à la fois des activités de services et des activités commerciales — par exemple vous êtes graphiste (service) ET vous vendez des impressions (commerce) — la règle de calcul devient proportionnelle. La loi prévoit une règle de trois pour vérifier si vous respectez les seuils :',
              },
              {
                type: 'ol',
                items: [
                  'Calculez le CA réalisé en services et divisez-le par 500 000',
                  'Calculez le CA réalisé en commerce et divisez-le par 2 000 000',
                  'Additionnez les deux résultats',
                  'Si le total est inférieur ou égal à 1 : vous êtes dans les limites du régime',
                  'Si le total dépasse 1 pendant deux années consécutives : vous devez changer de régime',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Exemple concret',
                body: 'Vous avez encaissé 300 000 MAD de services et 800 000 MAD de ventes commerciales. Calcul : (300 000 / 500 000) + (800 000 / 2 000 000) = 0,6 + 0,4 = 1,0. Vous êtes exactement à la limite. L\'année suivante, soyez vigilant.',
              },
            ],
          },
          {
            h2: 'Que se passe-t-il concrètement si vous dépassez le plafond ?',
            blocks: [
              {
                type: 'p',
                text: 'Le dépassement du plafond pendant deux années consécutives entraîne la sortie automatique du régime auto-entrepreneur. Voici ce que cela implique en pratique :',
              },
              {
                type: 'ul',
                items: [
                  'Vous basculez vers le régime fiscal de droit commun (régime du résultat net ou forfaitaire selon votre CA)',
                  'Vous devenez assujetti à la TVA — vous devez la collecter sur vos factures et la déclarer trimestriellement',
                  'Vous avez l\'obligation de tenir une comptabilité complète (journal, grand livre, bilan)',
                  'Votre IR se calcule sur le bénéfice net (revenus − charges) et non plus sur le CA brut',
                  'La CNSS bascule vers des cotisations calculées différemment',
                ],
              },
              {
                type: 'p',
                text: 'Ce changement n\'est pas nécessairement une mauvaise nouvelle. Cela signifie que votre activité a suffisamment grandi pour justifier une structure plus solide. La vraie erreur est de ne pas l\'anticiper et de se retrouver à devoir tout réorganiser dans l\'urgence en fin d\'année.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Suivez votre CA en temps réel avec Sayerli',
                body: 'Le tableau de bord Sayerli affiche votre chiffre d\'affaires mensuel et cumulé en temps réel. Vous visualisez instantanément où vous en êtes par rapport à votre plafond annuel — sans Excel, sans calcul manuel. Essai gratuit, sans carte bancaire.',
                href: '/register',
                cta: 'Voir mon tableau de bord',
              },
            ],
          },
          {
            h2: 'Comment anticiper le dépassement avant qu\'il arrive ?',
            blocks: [
              {
                type: 'p',
                text: 'La bonne pratique est de commencer à surveiller votre CA dès que vous atteignez 60% du plafond. Pour les prestataires de services, ça signifie déclencher l\'alerte à partir de 300 000 MAD annuel. Pour les activités commerciales, à partir de 1 200 000 MAD.',
              },
              {
                type: 'ol',
                items: [
                  'Tenez un suivi mensuel de vos encaissements — ne vous contentez pas de regarder en fin d\'année',
                  'Projetez votre CA annuel à partir de septembre sur la base des mois écoulés',
                  'Consultez un comptable ou un conseiller dès 70% du seuil atteint',
                  'Commencez les démarches de création de SARL si la tendance est au dépassement',
                  'Ne signez pas de nouveaux gros contrats sans avoir clarifié votre situation fiscale',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Bonne nouvelle',
                body: 'Le dépassement d\'une seule année ne vous oblige à rien. Vous pouvez dépasser le plafond une année et rester dans le régime si vous repassez en dessous l\'année suivante. C\'est la règle des deux années consécutives qui déclenche la sortie obligatoire.',
              },
            ],
          },
          {
            h2: 'Quelle structure adopter après le régime auto-entrepreneur ?',
            blocks: [
              {
                type: 'p',
                text: 'Quand votre activité dépasse les plafonds auto-entrepreneur, deux options principales s\'offrent à vous :',
              },
              {
                type: 'table',
                headers: ['Structure', 'Pour qui ?', 'Avantage principal'],
                rows: [
                  ['Personne physique — régime du résultat net', 'Activité individuelle en croissance', 'Pas de création de société, mais comptabilité obligatoire'],
                  ['SARL / SARLAU', 'Activité en fort développement, clients grands comptes', 'Responsabilité limitée, image professionnelle renforcée, IS à 20%'],
                ],
              },
              {
                type: 'p',
                text: 'La SARL est souvent recommandée car elle sépare votre patrimoine personnel de celui de l\'entreprise — vous ne risquez plus vos biens personnels en cas de litige. Elle permet aussi d\'accueillir des associés, d\'être plus crédible auprès des banques et de certains grands comptes qui refusent les personnes physiques.',
              },
              {
                type: 'p',
                text: 'La création d\'une SARL au Maroc prend entre 4 et 8 semaines et coûte entre 2 000 et 5 000 MAD selon que vous passez par un professionnel ou non. Un expert-comptable peut vous accompagner sur le choix du régime fiscal optimal (IS vs IR) selon votre situation.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli s\'adapte à votre croissance',
                body: 'Que vous soyez auto-entrepreneur, personne physique ou SARL, Sayerli gère votre facturation, vos devis, vos bons de livraison et votre journal des ventes. Un seul outil qui grandit avec vous.',
                href: '/fonctionnalites',
                cta: 'Découvrir toutes les fonctionnalités',
              },
            ],
          },
          {
            h2: 'Ce qu\'il faut retenir en 5 points',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Services : plafond annuel à 500 000 MAD — Commerce/Artisanat : plafond à 2 000 000 MAD',
                  'Le CA se calcule sur les montants encaissés dans l\'année, pas sur les factures émises',
                  'Le dépassement d\'une seule année ne vous force pas à changer de régime — deux années consécutives sont nécessaires',
                  'Commencez à vous préparer dès 60-70% du plafond atteint : consultez un professionnel',
                  'La transition vers une SARL n\'est pas une punition, c\'est le signe que votre activité a grandi',
                ],
              },
            ],
          },
        ],
      },

      // ── ENGLISH ───────────────────────────────────────────────────────────
      en: {
        title: 'Auto-Entrepreneur Revenue Cap in Morocco: 500,000 MAD for Services, 2,000,000 MAD for Commerce',
        description: 'Everything you need to know about the auto-entrepreneur revenue caps in Morocco: how to calculate your revenue, what happens when you exceed the limit, and which structure to move to next.',
        intro: [
          {
            type: 'p',
            text: 'You launched as an auto-entrepreneur in Morocco, your business is growing and serious money is coming in. Great. But at some point, one question becomes urgent: am I going to exceed the authorized revenue cap? And if so, what happens?',
          },
          {
            type: 'p',
            text: 'The revenue cap is one of the most important — and most misunderstood — rules of the Moroccan auto-entrepreneur regime. Many independent workers discover it too late, in the middle of a growth phase, and end up having to reorganize everything in a rush. This guide explains it all: the exact thresholds, how to calculate your revenue, what happens if you exceed, and how to anticipate the transition calmly.',
          },
        ],
        sections: [
          {
            h2: 'The two revenue caps in Morocco\'s auto-entrepreneur regime',
            blocks: [
              {
                type: 'table',
                headers: ['Activity type', 'Annual revenue cap'],
                rows: [
                  ['Service activities', '500,000 MAD'],
                  ['Commercial and craft activities', '2,000,000 MAD'],
                ],
              },
              {
                type: 'p',
                text: 'The distinction between "services" and "commerce" is essential. If you are a web developer, designer, consultant, coach or trainer, you fall under service activities — cap at 500,000 MAD. If you buy and resell physical products, or practice a craft, you fall under commerce — cap at 2,000,000 MAD.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'The two consecutive years rule',
                body: 'Exceeding the cap does not trigger automatic exit from the regime in the first year. You must exceed the threshold for two consecutive years before being required to change regime. One good year alone is not enough to push you out.',
              },
            ],
          },
          {
            h2: 'How to calculate your revenue exactly',
            blocks: [
              {
                type: 'p',
                text: 'The revenue taken into account for the cap is the total amount received (collected) in the calendar year (January 1 to December 31), before any deductions. Do not confuse this with profit — we are talking about the total you invoiced and collected, before any expenses.',
              },
              {
                type: 'ul',
                items: [
                  'Count: all invoices collected during the year, regardless of when the work was done',
                  'Do not deduct: your expenses, equipment purchases, travel or other professional costs',
                  'Exclude: expense reimbursements passed through to the client at cost',
                  'Currency: everything is converted to MAD at the exchange rate on the collection date if you invoice in EUR or USD',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Common mistake to avoid',
                body: 'Some auto-entrepreneurs believe revenue is calculated on invoices issued, not collected. That is wrong for this regime. It is the collection date that matters. An invoice issued in December but paid in January counts in the following year.',
              },
            ],
          },
          {
            h2: 'Mixed activities: managing multiple types of work',
            blocks: [
              {
                type: 'p',
                text: 'If you carry out both service and commercial activities, a proportional rule applies:',
              },
              {
                type: 'ol',
                items: [
                  'Divide your service revenue by 500,000',
                  'Divide your commercial revenue by 2,000,000',
                  'Add the two results together',
                  'If the total is ≤ 1: you are within the regime limits',
                  'If the total exceeds 1 for two consecutive years: you must change regime',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Concrete example',
                body: 'You collected 300,000 MAD in services and 800,000 MAD in commercial sales. Calculation: (300,000 / 500,000) + (800,000 / 2,000,000) = 0.6 + 0.4 = 1.0. You are exactly at the limit. Be vigilant the following year.',
              },
            ],
          },
          {
            h2: 'What happens if you exceed the cap?',
            blocks: [
              {
                type: 'ul',
                items: [
                  'You switch to the standard tax regime (net result or flat rate depending on your revenue)',
                  'You become VAT-liable — you must collect and declare VAT quarterly',
                  'You are required to keep full accounting records (journal, ledger, balance sheet)',
                  'Your income tax is calculated on net profit (revenue − expenses) instead of gross revenue',
                  'CNSS contributions are calculated differently',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Track your revenue in real time with Sayerli',
                body: 'Sayerli\'s dashboard shows your monthly and cumulative revenue in real time. You instantly see where you stand against your annual cap — no Excel, no manual calculations. Free trial, no credit card required.',
                href: '/register',
                cta: 'View my dashboard',
              },
            ],
          },
          {
            h2: 'How to anticipate the cap before it hits',
            blocks: [
              {
                type: 'ol',
                items: [
                  'Track your collected revenue monthly — do not wait until year end',
                  'Project your annual revenue from September based on months already elapsed',
                  'Consult an accountant or advisor once you hit 70% of the threshold',
                  'Start SARL incorporation proceedings if the trend points to exceeding the cap',
                  'Do not sign large new contracts without clarifying your tax situation first',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Good news',
                body: 'Exceeding the cap for just one year does not force you to change anything. You can exceed in one year and stay in the regime if you fall back below the following year. It is the two consecutive years rule that triggers mandatory exit.',
              },
            ],
          },
          {
            h2: 'What structure to move to after auto-entrepreneur?',
            blocks: [
              {
                type: 'table',
                headers: ['Structure', 'Best for', 'Main benefit'],
                rows: [
                  ['Individual business — net result regime', 'Solo activity in growth phase', 'No company to create, but full accounting required'],
                  ['SARL / SARLAU', 'Strong growth, large clients', 'Limited liability, stronger professional image, 20% corporate tax'],
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli grows with your business',
                body: 'Whether you are an auto-entrepreneur, individual business or SARL, Sayerli handles your invoices, quotes, delivery notes and sales journal. One tool that scales with you.',
                href: '/fonctionnalites',
                cta: 'See all features',
              },
            ],
          },
          {
            h2: '5 things to remember',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Services: annual cap at 500,000 MAD — Commerce/Crafts: cap at 2,000,000 MAD',
                  'Revenue is calculated on amounts collected in the year, not on invoices issued',
                  'Exceeding the cap for one year alone does not force a regime change — two consecutive years are required',
                  'Start preparing at 60-70% of the cap reached: consult a professional',
                  'Transitioning to an SARL is not a penalty — it means your business has grown',
                ],
              },
            ],
          },
        ],
      },

      // ── ARABIC ────────────────────────────────────────────────────────────
      ar: {
        title: 'سقف رقم الأعمال للمقاول الذاتي بالمغرب: 500,000 درهم للخدمات و2,000,000 درهم للتجارة',
        description: 'كل ما تحتاج معرفته عن سقف رقم الأعمال لنظام المقاول الذاتي بالمغرب: كيفية حسابه، ما يحدث عند التجاوز، والهيكل القانوني الأنسب بعد ذلك.',
        intro: [
          {
            type: 'p',
            text: 'انطلقت كمقاول ذاتي بالمغرب، ونشاطك يتطور ومداخيل جدية بدأت تتدفق. رائع. لكن في لحظة ما، يصبح سؤال واحد ملحاً: هل سأتجاوز سقف رقم الأعمال المسموح به؟ وإذا حدث ذلك، فماذا ينتظرني؟',
          },
          {
            type: 'p',
            text: 'سقف رقم الأعمال هو أحد أهم القواعد — وأكثرها سوء فهم — في نظام المقاول الذاتي المغربي. يكتشفه كثيرون متأخرين، في خضم مرحلة نمو، فيضطرون لإعادة تنظيم كل شيء على عجل. هذا الدليل يشرح كل شيء: السقوف الدقيقة، كيفية حساب رقم الأعمال، ما يحدث عند التجاوز، وكيف تستعد للانتقال بهدوء.',
          },
        ],
        sections: [
          {
            h2: 'السقفان في نظام المقاول الذاتي بالمغرب',
            blocks: [
              {
                type: 'table',
                headers: ['نوع النشاط', 'السقف السنوي لرقم الأعمال'],
                rows: [
                  ['تقديم الخدمات', '500,000 درهم'],
                  ['الأنشطة التجارية والحرفية', '2,000,000 درهم'],
                ],
              },
              {
                type: 'p',
                text: 'التمييز بين "الخدمات" و"التجارة" أمر جوهري. إذا كنت مطوراً للويب، مصمماً، مستشاراً، مدرباً أو مكوِّناً، فأنت ضمن فئة تقديم الخدمات — سقفك 500,000 درهم. إذا كنت تشتري وتعيد بيع المنتجات المادية، أو تمارس حرفة يدوية، فأنت ضمن التجارة — سقفك 2,000,000 درهم.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'قاعدة السنتين المتتاليتين',
                body: 'تجاوز السقف لا يُخرجك تلقائياً من النظام في السنة الأولى. يجب أن تتجاوز الحد لسنتين متتاليتين لكي يلزمك تغيير النظام. سنة جيدة واحدة لا تكفي لإخراجك.',
              },
            ],
          },
          {
            h2: 'كيف تحسب رقم أعمالك بدقة؟',
            blocks: [
              {
                type: 'p',
                text: 'رقم الأعمال المعتمد لحساب السقف هو المبلغ الإجمالي المُحصَّل (المستلم) خلال السنة الميلادية (من فاتح يناير إلى 31 ديسمبر)، قبل أي خصومات. لا تخلط بين رقم الأعمال والربح — نتحدث عن مجموع ما فوترته وحصّلته، قبل أي مصاريف.',
              },
              {
                type: 'ul',
                items: [
                  'تُحتسب: جميع الفواتير المحصّلة خلال السنة، بصرف النظر عن تاريخ إنجاز الخدمة',
                  'لا تُخصم: مصاريفك، مشترياتك من معدات، أو أي تكاليف مهنية أخرى',
                  'تُستثنى: استرداد المصاريف المُعاد فوترتها للعميل بنفس القيمة',
                  'العملة: يُحوَّل كل شيء إلى درهم بسعر الصرف في تاريخ التحصيل إذا كنت تفوتر بالأورو أو الدولار',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'خطأ شائع يجب تجنبه',
                body: 'يظن بعض المقاولين الذاتيين أن رقم الأعمال يُحسب على الفواتير المُصدَرة لا المُحصَّلة. هذا خطأ في هذا النظام. تاريخ التحصيل هو المعتمد. فاتورة صادرة في ديسمبر لكن مدفوعة في يناير تُحسب في السنة التالية.',
              },
            ],
          },
          {
            h2: 'الأنشطة المختلطة: إدارة أنواع متعددة من الأعمال',
            blocks: [
              {
                type: 'p',
                text: 'إذا كنت تمارس أنشطة خدمات وتجارة في آنٍ واحد، تُطبَّق قاعدة تناسبية:',
              },
              {
                type: 'ol',
                items: [
                  'اقسم رقم أعمال الخدمات على 500,000',
                  'اقسم رقم أعمال التجارة على 2,000,000',
                  'اجمع النتيجتين',
                  'إذا كان المجموع ≤ 1: أنت ضمن حدود النظام',
                  'إذا تجاوز المجموع 1 لسنتين متتاليتين: يجب تغيير النظام',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'مثال عملي',
                body: 'حصّلت 300,000 درهم من الخدمات و800,000 درهم من المبيعات التجارية. الحساب: (300,000 ÷ 500,000) + (800,000 ÷ 2,000,000) = 0.6 + 0.4 = 1.0. أنت بالضبط عند الحد. كن يقظاً في السنة القادمة.',
              },
            ],
          },
          {
            h2: 'ماذا يحدث عند تجاوز السقف؟',
            blocks: [
              {
                type: 'ul',
                items: [
                  'تنتقل إلى النظام الجبائي العام (نظام الصافي الحقيقي أو الجزافي حسب رقم الأعمال)',
                  'تصبح خاضعاً للضريبة على القيمة المضافة — يجب جمعها وتصريحها كل ثلاثة أشهر',
                  'يُلزمك الأمر بمسك محاسبة كاملة (يومية، دفتر الأستاذ، الميزانية)',
                  'تُحسب ضريبة الدخل على الربح الصافي (المداخيل − المصاريف) لا على رقم الأعمال الخام',
                  'تتغير طريقة احتساب اشتراكات الصندوق الوطني للضمان الاجتماعي',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'تتبّع رقم أعمالك في الوقت الفعلي مع Sayerli',
                body: 'تُظهر لوحة قيادة Sayerli رقم أعمالك الشهري والتراكمي في الوقت الفعلي. ترى فوراً أين أنت من سقفك السنوي — دون Excel، دون حسابات يدوية. تجربة مجانية، بدون بطاقة بنكية.',
                href: '/register',
                cta: 'عرض لوحة القيادة',
              },
            ],
          },
          {
            h2: 'كيف تستعد للتجاوز قبل وقوعه؟',
            blocks: [
              {
                type: 'ol',
                items: [
                  'تتبّع مداخيلك المحصّلة شهرياً — لا تنتظر نهاية السنة',
                  'قدّر رقم أعمالك السنوي ابتداءً من شهر سبتمبر استناداً إلى الأشهر المنقضية',
                  'استشر محاسباً أو مستشاراً حين تبلغ 70% من السقف',
                  'ابدأ إجراءات تأسيس شركة ذات مسؤولية محدودة إذا كان التوجه نحو التجاوز واضحاً',
                  'لا توقّع عقوداً كبيرة جديدة دون توضيح وضعك الجبائي أولاً',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'خبر جيد',
                body: 'تجاوز السقف لسنة واحدة فقط لا يُلزمك بشيء. يمكنك التجاوز في سنة والبقاء في النظام إذا عدت دون السقف في السنة التالية. قاعدة السنتين المتتاليتين هي التي تُفعّل الخروج الإلزامي.',
              },
            ],
          },
          {
            h2: 'أي هيكل قانوني بعد نظام المقاول الذاتي؟',
            blocks: [
              {
                type: 'table',
                headers: ['الهيكل', 'الأنسب لـ', 'الميزة الرئيسية'],
                rows: [
                  ['شخص طبيعي — نظام الصافي الحقيقي', 'نشاط فردي في طور النمو', 'لا حاجة لتأسيس شركة، لكن محاسبة كاملة إلزامية'],
                  ['شركة ذات مسؤولية محدودة / ش.م.م.أ', 'نمو قوي، عملاء كبار', 'مسؤولية محدودة، صورة أكثر احترافية، ضريبة الشركات 20%'],
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli يتطور مع نشاطك',
                body: 'سواء كنت مقاولاً ذاتياً، شخصاً طبيعياً أو شركة ذات مسؤولية محدودة، يدير Sayerli فواتيرك وعروض أسعارك وسندات التسليم ودفتر مبيعاتك. أداة واحدة تنمو معك.',
                href: '/fonctionnalites',
                cta: 'اكتشف جميع المزايا',
              },
            ],
          },
          {
            h2: '5 نقاط أساسية يجب تذكرها',
            blocks: [
              {
                type: 'ul',
                items: [
                  'الخدمات: سقف سنوي 500,000 درهم — التجارة والحرف: سقف 2,000,000 درهم',
                  'يُحسب رقم الأعمال على المبالغ المحصّلة خلال السنة، لا على الفواتير المُصدَرة',
                  'تجاوز السقف لسنة واحدة لا يُوجب تغيير النظام — السنتان المتتاليتان هما الشرط',
                  'ابدأ التحضير حين تبلغ 60-70% من السقف: استشر مختصاً',
                  'الانتقال إلى شركة ذات مسؤولية محدودة ليس عقوبة — بل دليل على نمو نشاطك',
                ],
              },
            ],
          },
        ],
      },
    },
  },
}
