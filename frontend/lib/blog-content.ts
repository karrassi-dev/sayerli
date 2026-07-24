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

  // ── ARTICLE 8 ────────────────────────────────────────────────────────────────
  'comment-faire-facture-maroc': {
    slug: 'comment-faire-facture-maroc',
    image: '/blog/comment-faire-facture-maroc.webp',
    readingTime: 7,
    content: {

      // ── FRENCH ──────────────────────────────────────────────────────────────
      fr: {
        title: 'Comment faire une facture professionnelle au Maroc : guide étape par étape',
        description: 'Comment créer une facture professionnelle au Maroc : les étapes, les informations à inclure, les outils disponibles et comment envoyer et suivre vos factures efficacement.',
        intro: [
          {
            type: 'p',
            text: 'Créer une facture peut sembler simple — jusqu\'au moment où vous vous retrouvez devant une page blanche à vous demander par où commencer. Quelles informations mettre en premier ? Comment structurer les lignes de prestation ? Quelle mention pour la TVA ? Est-ce que mon logo est obligatoire ?',
          },
          {
            type: 'p',
            text: 'Ce guide vous accompagne pas à pas dans la création d\'une facture professionnelle conforme au droit marocain — de la collecte des informations jusqu\'à l\'envoi et le suivi du paiement. Que vous soyez auto-entrepreneur, freelance ou dirigeant d\'une PME, vous aurez à la fin une méthode claire et reproductible.',
          },
        ],
        sections: [
          {
            h2: 'Étape 1 — Rassemblez toutes les informations avant de commencer',
            blocks: [
              {
                type: 'p',
                text: 'Avant d\'ouvrir un outil ou un fichier, rassemblez tout ce dont vous avez besoin. Partir avec des informations incomplètes vous fera perdre du temps et risque d\'entraîner des erreurs sur le document final.',
              },
              {
                type: 'table',
                headers: ['Informations sur vous', 'Informations sur votre client'],
                rows: [
                  ['Votre nom complet ou raison sociale', 'Nom complet ou raison sociale du client'],
                  ['Votre adresse professionnelle', 'Adresse complète du client'],
                  ['Votre Identifiant Fiscal (IF)', 'ICE du client (si entreprise)'],
                  ['Votre ICE (si vous êtes une société)', 'Email et téléphone du client'],
                  ['Votre RC et numéro de patente (si société)', '—'],
                  ['Vos coordonnées bancaires (RIB)', '—'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Où trouver l\'ICE de votre client ?',
                body: 'L\'ICE (Identifiant Commun de l\'Entreprise) figure sur toutes les factures que votre client vous envoie, sur son RC, ou sur son site web dans les mentions légales. Si vous ne l\'avez pas, demandez-le directement à votre contact — les entreprises sérieuses le communiquent sans problème.',
              },
            ],
          },
          {
            h2: 'Étape 2 — Choisissez votre outil de facturation',
            blocks: [
              {
                type: 'p',
                text: 'Vous avez plusieurs options pour créer votre facture. Chaque approche a ses avantages et ses limites :',
              },
              {
                type: 'table',
                headers: ['Outil', 'Avantages', 'Limites'],
                rows: [
                  ['Word / Google Docs', 'Gratuit, flexible', 'Numérotation manuelle, pas de suivi, risque d\'erreurs'],
                  ['Excel / Google Sheets', 'Calculs automatiques', 'Pas de PDF propre, pas de suivi des paiements'],
                  ['PDF modèle téléchargé', 'Rapide à démarrer', 'Non modifiable facilement, pas de base client'],
                  ['Logiciel de facturation (Sayerli…)', 'Mentions automatiques, numérotation, suivi paiements, envoi direct', 'Abonnement selon les fonctionnalités'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Le vrai coût de Word et Excel',
                body: 'Beaucoup de freelancers et d\'auto-entrepreneurs démarrent sur Word ou Excel. Ça fonctionne pour les toutes premières factures, mais rapidement les problèmes apparaissent : numérotation à gérer manuellement, aucun suivi des impayés, aucune relance automatique, perte de temps à chaque nouvelle facture. Dès le 5e client, un outil dédié devient rentable.',
              },
            ],
          },
          {
            h2: 'Étape 3 — Structurez votre facture en 5 zones',
            blocks: [
              {
                type: 'p',
                text: 'Une facture professionnelle marocaine se divise en 5 zones distinctes. Respecter cette structure rend le document immédiatement lisible et professionnel :',
              },
              {
                type: 'ol',
                items: [
                  'En-tête : vos coordonnées complètes (nom, adresse, IF, ICE si société) à gauche — le titre "FACTURE" et le numéro + date à droite',
                  'Coordonnées client : nom/raison sociale, adresse, ICE — clairement identifié comme "Facturé à :"',
                  'Corps — tableau des prestations : description détaillée | quantité | prix unitaire HT | total HT pour chaque ligne',
                  'Récapitulatif financier : sous-total HT, TVA (taux + montant) ou mention d\'exonération, total TTC en évidence',
                  'Pied de facture : modalités de paiement (délai, RIB, mode accepté), mentions légales (exonération TVA si applicable, forme juridique si société)',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Le titre "FACTURE" est-il obligatoire ?',
                body: 'Non, la loi marocaine n\'impose pas le mot "FACTURE" en en-tête. Mais c\'est une pratique universelle qui évite toute ambiguïté. Sans ce titre, le document peut être confondu avec un devis ou un bon de commande. Mettez-le toujours, en majuscules, bien visible.',
              },
            ],
          },
          {
            h2: 'Étape 4 — Remplissez le tableau des prestations avec précision',
            blocks: [
              {
                type: 'p',
                text: 'Le corps de la facture — le tableau des prestations — est la partie la plus importante. C\'est là que vous détaillez exactement ce que vous avez fourni et à quel prix. Voici comment bien le remplir :',
              },
              {
                type: 'ul',
                items: [
                  'Description : soyez précis et spécifique. "Développement frontend React — intégration maquettes — sprint 2 — juin 2025" vaut mieux que "Développement web"',
                  'Quantité : indiquez des unités claires (jours, heures, forfait, unités). "5 jours" est plus lisible que "5"',
                  'Prix unitaire HT : le prix d\'une unité hors taxe',
                  'Total HT : quantité × prix unitaire — vérifiez toujours le calcul',
                  'Remise éventuelle : si vous accordez une remise, indiquez le montant original, le pourcentage ou montant de remise, et le total après remise',
                ],
              },
              {
                type: 'table',
                headers: ['Description', 'Quantité', 'Prix unitaire HT', 'Total HT'],
                rows: [
                  ['Développement frontend React — sprint 2', '5 jours', '2 000 MAD', '10 000 MAD'],
                  ['Intégration API paiement — CMI', '1 forfait', '3 500 MAD', '3 500 MAD'],
                  ['Recette et déploiement', '1 forfait', '1 500 MAD', '1 500 MAD'],
                  ['', '', 'Total HT', '15 000 MAD'],
                  ['', '', 'TVA (Exonéré — Auto-entrepreneur IF n° 12345678)', '0 MAD'],
                  ['', '', 'Total TTC', '15 000 MAD'],
                ],
              },
            ],
          },
          {
            h2: 'Étape 5 — Ajoutez les informations de paiement',
            blocks: [
              {
                type: 'p',
                text: 'Une facture sans informations de paiement claires crée de la confusion et retarde les règlements. Voici ce que vous devez toujours préciser :',
              },
              {
                type: 'ul',
                items: [
                  'Délai de paiement : "Paiement à 30 jours" ou "Paiement à réception de facture" — soyez explicite',
                  'Mode de paiement accepté : virement bancaire (le plus courant), chèque, espèces pour les petits montants',
                  'RIB complet si virement : banque, agence, numéro de compte, clé RIB — certains clients ajoutent aussi le code SWIFT pour les virements internationaux',
                  'Pénalités de retard (optionnel mais recommandé en B2B) : "Tout retard de paiement entraîne des pénalités de X% par mois"',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Délai légal de paiement au Maroc',
                body: 'La loi marocaine (loi 49-15 sur les délais de paiement) fixe un délai maximum de 60 jours à compter de la date d\'émission de la facture pour les transactions B2B. Au-delà, des pénalités de retard sont dues de plein droit. Précisez toujours votre délai sur la facture pour éviter les ambiguïtés.',
              },
            ],
          },
          {
            h2: 'Étape 6 — Relisez, numérotez et exportez en PDF',
            blocks: [
              {
                type: 'p',
                text: 'Avant d\'envoyer, prenez 2 minutes pour vérifier ces points critiques :',
              },
              {
                type: 'ol',
                items: [
                  'Le numéro de facture est dans la bonne séquence (vérifiez votre dernière facture émise)',
                  'La date est correcte — jamais antidatée',
                  'Les calculs sont exacts — totaux HT, TVA, TTC',
                  'L\'IF et l\'ICE client sont présents et corrects',
                  'La mention TVA est correcte selon votre statut (taux ou exonération)',
                  'Les coordonnées bancaires sont complètes et sans faute',
                  'Exportez en PDF — c\'est le format standard attendu, non modifiable par le destinataire',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'N\'envoyez jamais un fichier Word ou Excel comme facture',
                body: 'Un fichier Word ou Excel peut être modifié par le destinataire. En cas de litige, vous ne pourrez pas prouver que le contenu original était différent. Le PDF est le seul format qui garantit l\'intégrité du document. Exportez toujours en PDF avant l\'envoi.',
              },
            ],
          },
          {
            h2: 'Étape 7 — Envoyez et suivez le paiement',
            blocks: [
              {
                type: 'p',
                text: 'La facture est prête. Il reste à l\'envoyer de la bonne façon et à en assurer le suivi :',
              },
              {
                type: 'ul',
                items: [
                  'Par email : envoyez le PDF en pièce jointe avec un objet clair — "Facture FA-2025-012 — [Nom de la prestation] — [Votre nom]"',
                  'Par WhatsApp : courant au Maroc, surtout avec les clients PME. Le PDF s\'affiche directement dans la conversation',
                  'Confirmez la réception : un simple message "Pouvez-vous confirmer la bonne réception de ma facture ?" évite les oublis',
                  'Notez la date d\'échéance dans votre agenda et lancez une relance douce 3 à 5 jours avant si le paiement n\'est pas arrivé',
                  'En cas de retard : relancez poliment par email, puis par téléphone si pas de réponse sous 48h',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli : de la création à l\'encaissement en quelques clics',
                body: 'Avec Sayerli, créez votre facture en 2 minutes avec toutes les mentions légales, envoyez-la directement par email ou lien partageable, et suivez son statut en temps réel (envoyée, vue, payée, en retard). Les relances automatiques s\'occupent des impayés à votre place. Essai gratuit, sans carte bancaire.',
                href: '/register',
                cta: 'Créer ma première facture',
              },
            ],
          },
          {
            h2: 'Récapitulatif : les 7 étapes pour faire une facture professionnelle au Maroc',
            blocks: [
              {
                type: 'ol',
                items: [
                  'Rassemblez vos informations et celles de votre client (IF, ICE, adresses, RIB)',
                  'Choisissez votre outil : logiciel dédié recommandé dès le 1er client sérieux',
                  'Structurez la facture en 5 zones : en-tête vous, en-tête client, tableau prestations, récapitulatif, pied',
                  'Détaillez précisément chaque ligne de prestation avec description, quantité, prix unitaire et total',
                  'Ajoutez les informations de paiement : délai, mode, RIB complet',
                  'Relisez, vérifiez la séquence de numérotation et exportez en PDF',
                  'Envoyez et assurez le suivi jusqu\'à l\'encaissement',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'La méthode la plus rapide : Sayerli',
                body: 'Sayerli centralise toutes ces étapes en un seul outil pensé pour le Maroc. Vos informations sont sauvegardées, vos clients dans votre base, la numérotation automatique, et les mentions légales toujours correctes. Passez de 30 minutes à 2 minutes par facture. Gratuit pour démarrer.',
                href: '/fonctionnalites',
                cta: 'Voir toutes les fonctionnalités',
              },
            ],
          },
        ],
      },

      // ── ENGLISH ─────────────────────────────────────────────────────────────
      en: {
        title: 'How to Create a Professional Invoice in Morocco: Step-by-Step Guide',
        description: 'How to create a professional invoice in Morocco: the steps, information to include, available tools, and how to send and track your invoices effectively.',
        intro: [
          {
            type: 'p',
            text: 'Creating an invoice can seem simple — until you find yourself staring at a blank page wondering where to start. What information goes first? How do you structure the service lines? What about the VAT mention? Is a logo required?',
          },
          {
            type: 'p',
            text: 'This guide walks you through creating a professional invoice that complies with Moroccan law — from gathering information to sending and tracking payment. Whether you are an auto-entrepreneur, freelancer or SME owner, you will finish with a clear and repeatable method.',
          },
        ],
        sections: [
          {
            h2: 'Step 1 — Gather all information before you start',
            blocks: [
              {
                type: 'p',
                text: 'Before opening any tool or file, collect everything you need. Starting with incomplete information wastes time and risks errors in the final document.',
              },
              {
                type: 'table',
                headers: ['Your information', 'Your client\'s information'],
                rows: [
                  ['Your full name or company name', 'Client\'s full name or company name'],
                  ['Your professional address', 'Client\'s full address'],
                  ['Your Tax Identifier (IF)', 'Client\'s ICE number (if a company)'],
                  ['Your ICE (if you are a company)', 'Client\'s email and phone'],
                  ['Your RC and patente number (if company)', '—'],
                  ['Your bank details (RIB)', '—'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Where to find your client\'s ICE?',
                body: 'The ICE (Identifiant Commun de l\'Entreprise) appears on any invoice your client sends you, on their trade register certificate, or in the legal mentions on their website. If you do not have it, ask your contact directly — serious companies share it without hesitation.',
              },
            ],
          },
          {
            h2: 'Step 2 — Choose your invoicing tool',
            blocks: [
              {
                type: 'p',
                text: 'You have several options for creating your invoice. Each approach has its advantages and limitations:',
              },
              {
                type: 'table',
                headers: ['Tool', 'Advantages', 'Limitations'],
                rows: [
                  ['Word / Google Docs', 'Free, flexible', 'Manual numbering, no tracking, risk of errors'],
                  ['Excel / Google Sheets', 'Automatic calculations', 'No clean PDF output, no payment tracking'],
                  ['Downloaded PDF template', 'Quick to start', 'Not easily editable, no client database'],
                  ['Invoicing software (Sayerli…)', 'Auto mentions, numbering, payment tracking, direct sending', 'Subscription depending on features'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'The real cost of Word and Excel',
                body: 'Many freelancers and auto-entrepreneurs start with Word or Excel. It works for the very first invoices, but problems appear quickly: numbering to manage manually, no late payment tracking, no automatic reminders, time wasted on every new invoice. From the 5th client onwards, a dedicated tool pays for itself.',
              },
            ],
          },
          {
            h2: 'Step 3 — Structure your invoice across 5 zones',
            blocks: [
              {
                type: 'p',
                text: 'A professional Moroccan invoice is divided into 5 distinct zones. Following this structure makes the document immediately readable and professional:',
              },
              {
                type: 'ol',
                items: [
                  'Header: your full details (name, address, IF, ICE if company) on the left — the title "INVOICE" with the number and date on the right',
                  'Client details: name/company name, address, ICE — clearly identified as "Billed to:"',
                  'Body — service table: detailed description | quantity | unit price excl. VAT | total excl. VAT for each line',
                  'Financial summary: subtotal excl. VAT, VAT (rate + amount) or exemption notice, total incl. VAT prominently displayed',
                  'Footer: payment terms (deadline, bank details, accepted methods), legal mentions (VAT exemption if applicable, legal form if company)',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Is the title "INVOICE" legally required?',
                body: 'No, Moroccan law does not require the word "INVOICE" in the header. But it is a universal practice that avoids any ambiguity. Without it, the document could be confused with a quote or purchase order. Always include it, in capitals, clearly visible.',
              },
            ],
          },
          {
            h2: 'Step 4 — Fill in the service table accurately',
            blocks: [
              {
                type: 'p',
                text: 'The body of the invoice — the service table — is the most important part. It is where you detail exactly what you provided and at what price. Here is how to fill it in correctly:',
              },
              {
                type: 'ul',
                items: [
                  'Description: be precise and specific. "React frontend development — mockup integration — sprint 2 — June 2025" is better than "Web development"',
                  'Quantity: use clear units (days, hours, flat rate, units). "5 days" is more readable than "5"',
                  'Unit price excl. VAT: the price of one unit before tax',
                  'Total excl. VAT: quantity × unit price — always double-check the calculation',
                  'Discount if applicable: show the original amount, the discount percentage or amount, and the total after discount',
                ],
              },
              {
                type: 'table',
                headers: ['Description', 'Qty', 'Unit price (excl. VAT)', 'Total (excl. VAT)'],
                rows: [
                  ['React frontend development — sprint 2', '5 days', '2,000 MAD', '10,000 MAD'],
                  ['CMI payment API integration', '1 flat rate', '3,500 MAD', '3,500 MAD'],
                  ['Testing and deployment', '1 flat rate', '1,500 MAD', '1,500 MAD'],
                  ['', '', 'Total excl. VAT', '15,000 MAD'],
                  ['', '', 'VAT (Exempt — Auto-entrepreneur IF No. 12345678)', '0 MAD'],
                  ['', '', 'Total incl. VAT', '15,000 MAD'],
                ],
              },
            ],
          },
          {
            h2: 'Step 5 — Add payment information',
            blocks: [
              {
                type: 'p',
                text: 'An invoice without clear payment information creates confusion and delays settlement. Always specify:',
              },
              {
                type: 'ul',
                items: [
                  'Payment deadline: "Payment within 30 days" or "Payment upon receipt" — be explicit',
                  'Accepted payment methods: bank transfer (most common), cheque, cash for small amounts',
                  'Full bank details for transfers: bank, branch, account number, RIB key — add SWIFT code for international transfers',
                  'Late payment penalties (optional but recommended in B2B): "Any late payment will incur penalties of X% per month"',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Legal payment deadline in Morocco',
                body: 'Moroccan law (Law 49-15 on payment deadlines) sets a maximum of 60 days from the invoice date for B2B transactions. Beyond that, late payment penalties are due automatically. Always state your deadline on the invoice to avoid ambiguity.',
              },
            ],
          },
          {
            h2: 'Step 6 — Review, number and export as PDF',
            blocks: [
              {
                type: 'p',
                text: 'Before sending, take 2 minutes to check these critical points:',
              },
              {
                type: 'ol',
                items: [
                  'The invoice number is in the correct sequence (check your last issued invoice)',
                  'The date is correct — never backdated',
                  'Calculations are accurate — totals excl. VAT, VAT amount, total incl. VAT',
                  'Your IF and the client\'s ICE are present and correct',
                  'The VAT mention matches your status (rate or exemption)',
                  'Bank details are complete and error-free',
                  'Export as PDF — the standard expected format, uneditable by the recipient',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Never send a Word or Excel file as an invoice',
                body: 'A Word or Excel file can be modified by the recipient. In case of a dispute, you will not be able to prove the original content was different. PDF is the only format that guarantees document integrity. Always export to PDF before sending.',
              },
            ],
          },
          {
            h2: 'Step 7 — Send and track payment',
            blocks: [
              {
                type: 'p',
                text: 'The invoice is ready. Now send it properly and follow up until you are paid:',
              },
              {
                type: 'ul',
                items: [
                  'By email: attach the PDF with a clear subject — "Invoice INV-2025-012 — [Service name] — [Your name]"',
                  'By WhatsApp: common in Morocco, especially with SME clients. The PDF displays directly in the conversation',
                  'Confirm receipt: a simple "Could you confirm you received my invoice?" prevents it from being overlooked',
                  'Note the due date in your calendar and send a gentle reminder 3 to 5 days before if payment has not arrived',
                  'If payment is late: follow up politely by email, then by phone if no response within 48 hours',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli: from creation to payment in a few clicks',
                body: 'With Sayerli, create your invoice in 2 minutes with all legal mentions, send it directly by email or shareable link, and track its status in real time (sent, viewed, paid, overdue). Automatic reminders handle late payments for you. Free trial, no credit card required.',
                href: '/register',
                cta: 'Create my first invoice',
              },
            ],
          },
          {
            h2: 'Summary: the 7 steps to create a professional invoice in Morocco',
            blocks: [
              {
                type: 'ol',
                items: [
                  'Gather your information and your client\'s (IF, ICE, addresses, bank details)',
                  'Choose your tool: dedicated software recommended from your first serious client',
                  'Structure the invoice across 5 zones: your header, client header, service table, financial summary, footer',
                  'Detail each service line precisely with description, quantity, unit price and total',
                  'Add payment information: deadline, method, complete bank details',
                  'Review, check the numbering sequence and export as PDF',
                  'Send and follow up until payment is received',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'The fastest method: Sayerli',
                body: 'Sayerli brings all these steps into one tool built for Morocco. Your details are saved, your clients in a database, numbering automatic, and legal mentions always correct. Go from 30 minutes to 2 minutes per invoice. Free to start.',
                href: '/fonctionnalites',
                cta: 'See all features',
              },
            ],
          },
        ],
      },

      // ── ARABIC ──────────────────────────────────────────────────────────────
      ar: {
        title: 'كيف تُنشئ فاتورة احترافية بالمغرب: دليل خطوة بخطوة',
        description: 'كيفية إنشاء فاتورة احترافية بالمغرب: الخطوات، المعلومات الواجب إدراجها، الأدوات المتاحة، وكيفية إرسال فواتيرك وتتبعها بفعالية.',
        intro: [
          {
            type: 'p',
            text: 'إنشاء فاتورة قد يبدو بسيطاً — حتى تجد نفسك أمام صفحة بيضاء تتساءل من أين تبدأ. ما المعلومات التي تُدرجها أولاً؟ كيف تُنظّم سطور الخدمات؟ وماذا عن بيان الضريبة على القيمة المضافة؟ هل الشعار إلزامي؟',
          },
          {
            type: 'p',
            text: 'يأخذك هذا الدليل خطوةً بخطوة في إنشاء فاتورة احترافية مطابقة للقانون المغربي — من جمع المعلومات إلى الإرسال وتتبع الدفع. سواء كنت مقاولاً ذاتياً أو مستقلاً أو مدير مقاولة صغيرة، ستمتلك في النهاية منهجاً واضحاً وقابلاً للتكرار.',
          },
        ],
        sections: [
          {
            h2: 'الخطوة 1 — اجمع جميع المعلومات قبل البدء',
            blocks: [
              {
                type: 'p',
                text: 'قبل فتح أي أداة أو ملف، اجمع كل ما تحتاجه. البدء بمعلومات ناقصة يُضيّع الوقت ويُعرّض الوثيقة النهائية للأخطاء.',
              },
              {
                type: 'table',
                headers: ['معلوماتك أنت', 'معلومات عميلك'],
                rows: [
                  ['اسمك الكامل أو الاسم التجاري', 'الاسم الكامل أو الشركة للعميل'],
                  ['عنوانك المهني', 'العنوان الكامل للعميل'],
                  ['معرّفك الضريبي (IF)', 'رقم ICE للعميل (إن كان شركة)'],
                  ['رقم ICE الخاص بك (إن كنت شركة)', 'البريد الإلكتروني والهاتف للعميل'],
                  ['رقم RC والضريبة المهنية (إن كنت شركة)', '—'],
                  ['بياناتك البنكية (RIB)', '—'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'أين تجد رقم ICE لعميلك؟',
                body: 'يظهر رقم ICE (المعرّف المشترك للمقاولة) في أي فاتورة يُرسلها عميلك إليك، وعلى شهادة تسجيله التجاري، أو في بيانات الاتصال القانونية في موقعه الإلكتروني. إذا لم يكن لديك الرقم، اطلبه مباشرةً من جهة الاتصال — الشركات الجادة تشاركه دون تردد.',
              },
            ],
          },
          {
            h2: 'الخطوة 2 — اختر أداة الفوترة المناسبة',
            blocks: [
              {
                type: 'p',
                text: 'لديك عدة خيارات لإنشاء فاتورتك. لكل نهج مزاياه وقيوده:',
              },
              {
                type: 'table',
                headers: ['الأداة', 'المزايا', 'القيود'],
                rows: [
                  ['Word / Google Docs', 'مجاني، مرن', 'ترقيم يدوي، لا تتبع، خطر الأخطاء'],
                  ['Excel / Google Sheets', 'حسابات تلقائية', 'لا PDF نظيف، لا تتبع للمدفوعات'],
                  ['قالب PDF محمَّل', 'سريع للبدء', 'يصعب تعديله، لا قاعدة عملاء'],
                  ['برنامج فوترة (Sayerli…)', 'بيانات تلقائية، ترقيم، تتبع مدفوعات، إرسال مباشر', 'اشتراك حسب المزايا'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'التكلفة الحقيقية لـ Word وExcel',
                body: 'كثير من المستقلين والمقاولين الذاتيين يبدؤون بـ Word أو Excel. يصلح ذلك لأولى الفواتير، لكن المشاكل تظهر سريعاً: ترقيم يدوي، لا تتبع للمتأخرات، لا تذكيرات تلقائية، وضياع وقت في كل فاتورة جديدة. من العميل الخامس فصاعداً، أداة متخصصة تُعوّض تكلفتها.',
              },
            ],
          },
          {
            h2: 'الخطوة 3 — هيكل فاتورتك في 5 أقسام',
            blocks: [
              {
                type: 'p',
                text: 'تنقسم الفاتورة الاحترافية المغربية إلى 5 أقسام متمايزة. احترام هذا الهيكل يجعل الوثيقة مقروءة واحترافية على الفور:',
              },
              {
                type: 'ol',
                items: [
                  'الترويسة: بياناتك الكاملة (الاسم، العنوان، IF، ICE إن كنت شركة) على اليسار — عنوان "فاتورة" مع الرقم والتاريخ على اليمين',
                  'بيانات العميل: الاسم/الشركة، العنوان، ICE — محددة بوضوح تحت "فاتورة إلى:"',
                  'الجسم — جدول الخدمات: وصف مفصَّل | الكمية | السعر الوحدوي (دون الضريبة) | الإجمالي (دون الضريبة) لكل سطر',
                  'الملخص المالي: المجموع الفرعي (دون الضريبة)، الضريبة على القيمة المضافة (النسبة + المبلغ) أو إشعار الإعفاء، المجموع الإجمالي بارزاً',
                  'ذيل الفاتورة: شروط الدفع (الأجل، RIB، الطرق المقبولة)، البيانات القانونية (إعفاء الضريبة على القيمة المضافة إن انطبق، الشكل القانوني إن كانت شركة)',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'هل عنوان "فاتورة" إلزامي قانوناً؟',
                body: 'لا، لا يشترط القانون المغربي كلمة "فاتورة" في الترويسة. لكنها ممارسة عالمية تُزيل أي التباس. بدونها قد تُخلَط الوثيقة مع عرض أسعار أو أمر شراء. اذكرها دائماً، بأحرف بارزة وواضحة.',
              },
            ],
          },
          {
            h2: 'الخطوة 4 — املأ جدول الخدمات بدقة',
            blocks: [
              {
                type: 'p',
                text: 'جسم الفاتورة — جدول الخدمات — هو الجزء الأهم. هنا تُفصّل بالضبط ما قدّمته وبأي سعر. إليك كيفية ملئه بشكل صحيح:',
              },
              {
                type: 'ul',
                items: [
                  'الوصف: كن دقيقاً ومحدداً. "تطوير واجهة React — دمج التصاميم — sprint 2 — يونيو 2025" أفضل من "تطوير ويب"',
                  'الكمية: استخدم وحدات واضحة (أيام، ساعات، جزافي، وحدات). "5 أيام" أوضح من "5"',
                  'السعر الوحدوي (دون الضريبة): سعر الوحدة الواحدة قبل الضريبة',
                  'الإجمالي (دون الضريبة): الكمية × السعر الوحدوي — تحقق دائماً من الحساب',
                  'الخصم إن وُجد: اعرض المبلغ الأصلي ونسبة أو مبلغ الخصم والمجموع بعد الخصم',
                ],
              },
              {
                type: 'table',
                headers: ['الوصف', 'الكمية', 'السعر الوحدوي (دون الضريبة)', 'الإجمالي (دون الضريبة)'],
                rows: [
                  ['تطوير واجهة React — sprint 2', '5 أيام', '2,000 درهم', '10,000 درهم'],
                  ['دمج API الدفع — CMI', 'جزافي', '3,500 درهم', '3,500 درهم'],
                  ['اختبار ونشر', 'جزافي', '1,500 درهم', '1,500 درهم'],
                  ['', '', 'المجموع (دون الضريبة)', '15,000 درهم'],
                  ['', '', 'الضريبة (معفى — مقاول ذاتي IF رقم 12345678)', '0 درهم'],
                  ['', '', 'المجموع الإجمالي', '15,000 درهم'],
                ],
              },
            ],
          },
          {
            h2: 'الخطوة 5 — أضف معلومات الدفع',
            blocks: [
              {
                type: 'p',
                text: 'فاتورة بلا معلومات دفع واضحة تُسبّب لبساً وتُأخّر التسوية. احرص دائماً على تحديد:',
              },
              {
                type: 'ul',
                items: [
                  'أجل الدفع: "الدفع في أجل 30 يوماً" أو "الدفع عند الاستلام" — كن صريحاً',
                  'طرق الدفع المقبولة: التحويل البنكي (الأشيع)، الشيك، النقد للمبالغ الصغيرة',
                  'بيانات بنكية كاملة للتحويل: البنك، الوكالة، رقم الحساب، مفتاح RIB — وأضف رمز SWIFT للتحويلات الدولية',
                  'غرامات التأخير (اختياري لكن موصى به في B2B): "أي تأخر في الدفع يُرتّب غرامات بنسبة X% شهرياً"',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'الأجل القانوني للدفع بالمغرب',
                body: 'يُحدّد القانون المغربي (قانون 49-15 المتعلق بآجال الأداء) أجلاً أقصاه 60 يوماً من تاريخ إصدار الفاتورة للمعاملات بين المهنيين. بعد ذلك تُستحق غرامات التأخير بحكم القانون. حدد دائماً أجلك في الفاتورة لتجنب أي غموض.',
              },
            ],
          },
          {
            h2: 'الخطوة 6 — راجع وأرقّم وصدّر بصيغة PDF',
            blocks: [
              {
                type: 'p',
                text: 'قبل الإرسال، خذ دقيقتين للتحقق من هذه النقاط الحاسمة:',
              },
              {
                type: 'ol',
                items: [
                  'رقم الفاتورة في التسلسل الصحيح (راجع آخر فاتورة أصدرتها)',
                  'التاريخ صحيح — لا تأريخ بتاريخ سابق أبداً',
                  'الحسابات دقيقة — مجاميع قبل الضريبة، ومبلغ الضريبة، والمجموع الإجمالي',
                  'معرّفك الضريبي ورقم ICE العميل موجودان وصحيحان',
                  'بيان الضريبة مطابق لوضعيتك (نسبة أو إعفاء)',
                  'البيانات البنكية كاملة وبلا أخطاء',
                  'صدِّر بصيغة PDF — الصيغة المعيارية المتوقعة، غير قابلة للتعديل من قِبَل المستلم',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'لا ترسل ملف Word أو Excel كفاتورة',
                body: 'ملف Word أو Excel قابل للتعديل من قِبَل المستلم. في حالة نزاع، لن تستطيع إثبات أن المحتوى الأصلي كان مختلفاً. PDF هو الصيغة الوحيدة التي تضمن سلامة الوثيقة. صدّر دائماً بصيغة PDF قبل الإرسال.',
              },
            ],
          },
          {
            h2: 'الخطوة 7 — أرسل وتتبّع الدفع',
            blocks: [
              {
                type: 'p',
                text: 'الفاتورة جاهزة. أرسلها بالطريقة الصحيحة وتابع حتى التحصيل:',
              },
              {
                type: 'ul',
                items: [
                  'بالبريد الإلكتروني: أرفق PDF بموضوع واضح — "فاتورة FA-2025-012 — [اسم الخدمة] — [اسمك]"',
                  'بواتساب: شائع بالمغرب، ولا سيما مع عملاء المقاولات الصغيرة. يظهر PDF مباشرةً في المحادثة',
                  'تأكّد من الاستلام: رسالة بسيطة "هل يمكنك تأكيد استلام فاتورتي؟" تمنع النسيان',
                  'سجّل تاريخ الاستحقاق في مفكرتك وأرسل تذكيراً لطيفاً قبل 3 إلى 5 أيام إن لم يصل الدفع',
                  'في حالة التأخر: ذكّر بلطف عبر البريد الإلكتروني، ثم بالهاتف إن لم يكن ثمة رد خلال 48 ساعة',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli: من الإنشاء إلى التحصيل بنقرات قليلة',
                body: 'مع Sayerli، أنشئ فاتورتك في دقيقتين بجميع البيانات القانونية، وأرسلها مباشرةً بالبريد الإلكتروني أو برابط قابل للمشاركة، وتتبّع حالتها في الوقت الفعلي (مُرسَلة، مُطّلَع عليها، مدفوعة، متأخرة). التذكيرات التلقائية تُعالج المتأخرات نيابةً عنك. تجربة مجانية، بدون بطاقة بنكية.',
                href: '/register',
                cta: 'إنشاء أول فاتورة',
              },
            ],
          },
          {
            h2: 'ملخص: الخطوات السبع لإنشاء فاتورة احترافية بالمغرب',
            blocks: [
              {
                type: 'ol',
                items: [
                  'اجمع معلوماتك ومعلومات عميلك (IF، ICE، العناوين، RIB)',
                  'اختر أداتك: برنامج متخصص مُوصى به من أول عميل جاد',
                  'هيكل الفاتورة في 5 أقسام: ترويستك، بيانات العميل، جدول الخدمات، الملخص المالي، الذيل',
                  'فصّل كل سطر خدمة بدقة: وصف، كمية، سعر وحدوي، إجمالي',
                  'أضف معلومات الدفع: الأجل، الطريقة، البيانات البنكية الكاملة',
                  'راجع، تحقق من تسلسل الترقيم، وصدّر بصيغة PDF',
                  'أرسل وتابع حتى استلام الدفع',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'الطريقة الأسرع: Sayerli',
                body: 'يجمع Sayerli كل هذه الخطوات في أداة واحدة مُصمَّمة للمغرب. بياناتك محفوظة، عملاؤك في قاعدة بيانات، الترقيم تلقائي، والبيانات القانونية دائماً صحيحة. انتقل من 30 دقيقة إلى دقيقتين لكل فاتورة. مجاني للبدء.',
                href: '/fonctionnalites',
                cta: 'اكتشف جميع المزايا',
              },
            ],
          },
        ],
      },
    },
  },

  // ── ARTICLE 7 ────────────────────────────────────────────────────────────────
  'mentions-obligatoires-facture-maroc': {
    slug: 'mentions-obligatoires-facture-maroc',
    image: '/blog/mentions-obligatoires-facture-maroc.webp',
    readingTime: 7,
    content: {

      // ── FRENCH ──────────────────────────────────────────────────────────────
      fr: {
        title: 'Mentions obligatoires sur une facture au Maroc : le guide complet 2025',
        description: 'Toutes les mentions obligatoires sur une facture au Maroc : ICE, IF, TVA, numérotation, coordonnées, délais de paiement. Guide complet pour auto-entrepreneurs, freelancers et PME.',
        intro: [
          {
            type: 'p',
            text: 'Au Maroc, une facture n\'est pas un simple document comptable — c\'est une pièce juridique encadrée par la loi. Une facture incomplète peut être refusée par votre client, rejetée lors d\'un contrôle fiscal, ou invalider votre droit au remboursement de TVA. Pourtant, la majorité des erreurs constatées sur les factures marocaines concernent des oublis simples : un numéro ICE manquant, une mention TVA absente, une numérotation incohérente.',
          },
          {
            type: 'p',
            text: 'Ce guide recense toutes les mentions obligatoires selon votre situation — auto-entrepreneur, freelance, SARL ou SA assujettie à la TVA — avec les formulations exactes à utiliser et les erreurs les plus courantes à éviter.',
          },
        ],
        sections: [
          {
            h2: 'Pourquoi les mentions obligatoires sont une obligation légale',
            blocks: [
              {
                type: 'p',
                text: 'Les mentions obligatoires sur les factures au Maroc sont régies par le Code Général des Impôts (CGI) et les dispositions de la loi sur la TVA. Elles ne sont pas de simples recommandations — leur absence peut avoir des conséquences concrètes :',
              },
              {
                type: 'ul',
                items: [
                  'Rejet de la facture par le client, notamment les entreprises dont la comptabilité est auditée',
                  'Impossibilité pour votre client de déduire la TVA sur vos prestations si les mentions TVA sont incorrectes',
                  'Remise en cause de la déductibilité de la charge lors d\'un contrôle fiscal',
                  'Pénalités en cas de facturation non conforme répétée',
                  'Litige commercial difficile à trancher sans facture opposable',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Facture obligatoire dès quel montant ?',
                body: 'Au Maroc, la facture est obligatoire pour toute transaction entre professionnels (B2B), quel que soit le montant. Pour les transactions avec des particuliers (B2C), elle est obligatoire au-delà de 10 000 MAD. En dessous, une note ou un reçu peut suffire — mais émettre une facture reste toujours la meilleure pratique.',
              },
            ],
          },
          {
            h2: 'Les mentions communes à toutes les factures au Maroc',
            blocks: [
              {
                type: 'p',
                text: 'Quel que soit votre statut juridique — auto-entrepreneur, personne physique, SARL ou SA — ces mentions doivent figurer sur chaque facture que vous émettez :',
              },
              {
                type: 'table',
                headers: ['Mention', 'Détail'],
                rows: [
                  ['Identité du vendeur / prestataire', 'Nom complet ou raison sociale, adresse complète'],
                  ['Numéro de facture', 'Séquentiel, continu, sans trou (FA-2025-001, FA-2025-002…)'],
                  ['Date d\'émission', 'Date à laquelle la facture est établie'],
                  ['Identité du client', 'Nom/raison sociale, adresse complète'],
                  ['Description de la prestation ou du bien', 'Suffisamment détaillée pour identifier la transaction'],
                  ['Quantité', 'Nombre d\'unités, d\'heures, de jours selon la nature de la prestation'],
                  ['Prix unitaire hors taxes', 'Pour chaque ligne de la facture'],
                  ['Montant total hors taxes (HT)', 'Somme de toutes les lignes'],
                  ['Modalités de paiement', 'Délai (30, 60 jours…), mode (virement, chèque, espèces)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Description insuffisante : le piège le plus courant',
                body: 'Une description comme "Prestation de services", "Travaux" ou "Consultation" est trop vague. En cas de contrôle, l\'administration fiscale peut remettre en cause la réalité de la prestation. Soyez précis : "Développement d\'une application mobile iOS — sprint 3 — mars 2025" est une description valide.',
              },
            ],
          },
          {
            h2: 'Mentions spécifiques aux auto-entrepreneurs et personnes physiques',
            blocks: [
              {
                type: 'p',
                text: 'Si vous êtes auto-entrepreneur ou personne physique exerçant sous le régime simplifié, deux mentions supplémentaires s\'appliquent à toutes vos factures :',
              },
              {
                type: 'table',
                headers: ['Mention', 'Détail et formulation'],
                rows: [
                  ['Identifiant Fiscal (IF)', '"IF : XXXXXXXX" — attribué lors de votre inscription. À placer dans l\'en-tête, clairement visible.'],
                  ['Mention d\'exonération TVA', '"Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX". Obligatoire sous le total de la facture.'],
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Pas de TVA = pas de ligne TVA, mais une mention obligatoire',
                body: 'Une erreur fréquente est de laisser une ligne TVA à 0% ou de ne rien mettre. La bonne pratique est de remplacer entièrement la ligne TVA par la mention d\'exonération explicite. Votre montant HT = votre montant TTC, et la mention légale explique pourquoi.',
              },
            ],
          },
          {
            h2: 'Mentions spécifiques aux entreprises assujetties à la TVA (SARL, SA…)',
            blocks: [
              {
                type: 'p',
                text: 'Si vous opérez via une société (SARL, SA, SARLAU) ou une personne physique assujettie à la TVA, des mentions supplémentaires s\'ajoutent — en particulier les identifiants officiels de votre entreprise :',
              },
              {
                type: 'table',
                headers: ['Mention', 'Détail'],
                rows: [
                  ['ICE (Identifiant Commun de l\'Entreprise)', 'Numéro à 15 chiffres attribué par le Registre de Commerce. Obligatoire pour toute entreprise immatriculée.'],
                  ['Numéro RC (Registre de Commerce)', 'Numéro d\'immatriculation au Registre de Commerce.'],
                  ['Identifiant Fiscal (IF)', 'Numéro fiscal attribué par la DGI, différent de l\'ICE.'],
                  ['Numéro de patente', 'Numéro de taxe professionnelle (anciennement "patente").'],
                  ['Taux de TVA appliqué', '20%, 10%, 7% ou 0% selon la nature de la prestation.'],
                  ['Montant de TVA', 'Montant exact de la TVA calculé sur le HT.'],
                  ['Montant TTC', 'Montant HT + TVA.'],
                  ['Forme juridique et capital social', 'Ex : "SARL au capital de 100 000 MAD"'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'ICE vs IF : quelle différence ?',
                body: 'L\'ICE (Identifiant Commun de l\'Entreprise) est un identifiant unique attribué à chaque entreprise immatriculée au Maroc — il regroupe l\'ensemble de vos identifiants officiels. L\'IF (Identifiant Fiscal) est attribué spécifiquement par la Direction Générale des Impôts. Les deux sont distincts et doivent tous les deux figurer sur vos factures si vous êtes une société.',
              },
            ],
          },
          {
            h2: 'La numérotation des factures : règles et bonnes pratiques',
            blocks: [
              {
                type: 'p',
                text: 'La numérotation est une mention obligatoire qui obéit à des règles strictes. Une numérotation incorrecte est l\'un des premiers signaux d\'alerte lors d\'un contrôle fiscal :',
              },
              {
                type: 'ul',
                items: [
                  'Séquentielle : chaque numéro doit être supérieur au précédent, sans exception',
                  'Continue : aucun trou dans la séquence — si vous annulez une facture, émettez un avoir plutôt que de supprimer le numéro',
                  'Chronologique : les numéros doivent correspondre à l\'ordre des dates d\'émission',
                  'Unique : un numéro ne peut être utilisé qu\'une seule fois',
                  'Format recommandé : FA-AAAA-NNN (ex : FA-2025-047) pour intégrer l\'année',
                  'Non modifiable : une facture émise ne peut être ni modifiée ni supprimée — seul un avoir peut la corriger',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Que faire si vous avez des trous dans votre numérotation ?',
                body: 'Si vous constatez des trous dans votre numérotation (une facture supprimée par erreur, par exemple), documentez l\'incident par écrit et conservez la preuve. L\'administration fiscale peut accepter une explication justifiée, mais les trous répétés et inexpliqués sont interprétés comme une tentative de dissimulation de chiffre d\'affaires.',
              },
            ],
          },
          {
            h2: 'Tableau récapitulatif : mentions par type de professionnel',
            blocks: [
              {
                type: 'p',
                text: 'Voici un récapitulatif rapide pour savoir exactement quelles mentions s\'appliquent à votre situation :',
              },
              {
                type: 'table',
                headers: ['Mention', 'Auto-entrepreneur', 'Personne physique (droit commun)', 'SARL / SA'],
                rows: [
                  ['Nom / Raison sociale + adresse', '✓', '✓', '✓'],
                  ['Numéro de facture séquentiel', '✓', '✓', '✓'],
                  ['Date d\'émission', '✓', '✓', '✓'],
                  ['Coordonnées client', '✓', '✓', '✓'],
                  ['Description détaillée', '✓', '✓', '✓'],
                  ['Prix HT + total HT', '✓', '✓', '✓'],
                  ['Modalités de paiement', '✓', '✓', '✓'],
                  ['Identifiant Fiscal (IF)', '✓', '✓', '✓'],
                  ['Mention exonération TVA', '✓', 'Si exonéré', '—'],
                  ['Taux + montant TVA', '—', 'Si assujetti', '✓'],
                  ['ICE (15 chiffres)', '—', 'Recommandé', '✓'],
                  ['Numéro RC', '—', '—', '✓'],
                  ['Numéro de patente', '—', 'Selon cas', '✓'],
                  ['Forme juridique + capital', '—', '—', '✓'],
                ],
              },
            ],
          },
          {
            h2: 'Checklist rapide avant d\'envoyer chaque facture',
            blocks: [
              {
                type: 'p',
                text: 'Avant d\'envoyer votre prochaine facture, passez cette checklist en revue :',
              },
              {
                type: 'ol',
                items: [
                  'Mon nom / raison sociale et mon adresse sont présents dans l\'en-tête',
                  'Mon identifiant fiscal (IF) est visible',
                  'Le numéro de facture est séquentiel et dans la bonne série',
                  'La date d\'émission est correcte',
                  'Les coordonnées complètes du client figurent sur la facture',
                  'Chaque ligne de prestation est décrite avec suffisamment de détail',
                  'Les prix unitaires et totaux HT sont corrects',
                  'La mention TVA est correcte : soit le taux + montant TVA (si assujetti), soit la mention d\'exonération (si auto-entrepreneur)',
                  'Les modalités de paiement sont clairement indiquées (délai + mode)',
                  'L\'ICE du client est mentionné si c\'est une entreprise',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli génère des factures 100% conformes automatiquement',
                body: 'Avec Sayerli, toutes ces mentions sont générées automatiquement à partir de votre profil et des informations client. Numérotation séquentielle, IF, ICE client, mention TVA ou exonération — rien n\'est oublié. Créez une facture conforme en moins de 2 minutes. Essai gratuit, sans carte bancaire.',
                href: '/register',
                cta: 'Créer ma première facture conforme',
              },
            ],
          },
          {
            h2: 'Les 5 erreurs de mentions les plus sanctionnées',
            blocks: [
              {
                type: 'p',
                text: 'D\'après les retours de contrôles fiscaux et les pratiques constatées au Maroc, voici les cinq erreurs qui posent le plus de problèmes :',
              },
              {
                type: 'table',
                headers: ['Erreur', 'Conséquence possible'],
                rows: [
                  ['IF ou ICE absent', 'Facture rejetée par le client ou l\'administration'],
                  ['Pas de mention TVA (ni taux ni exonération)', 'Impossibilité de déduire la TVA pour le client, remise en cause lors d\'audit'],
                  ['Description trop vague', 'Administration peut contester la réalité de la prestation'],
                  ['Trou dans la numérotation', 'Soupçon de dissimulation de CA, pénalités potentielles'],
                  ['Date incorrecte ou absente', 'Problème pour rattacher la charge à un exercice fiscal'],
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Ne laissez plus la conformité au hasard',
                body: 'Sayerli intègre les règles de facturation marocaines directement dans l\'outil. Que vous soyez auto-entrepreneur, freelance ou PME, vos factures respectent automatiquement toutes les obligations légales. Devis, factures, avoirs — tout en MAD, tout conforme. Démarrez gratuitement.',
                href: '/fonctionnalites',
                cta: 'Voir toutes les fonctionnalités',
              },
            ],
          },
        ],
      },

      // ── ENGLISH ─────────────────────────────────────────────────────────────
      en: {
        title: 'Mandatory Mentions on a Moroccan Invoice: The Complete 2025 Guide',
        description: 'All mandatory mentions required on a Moroccan invoice: ICE, IF, VAT, numbering, contact details, payment terms. Complete guide for auto-entrepreneurs, freelancers and SMEs.',
        intro: [
          {
            type: 'p',
            text: 'In Morocco, an invoice is not just an accounting document — it is a legal instrument governed by law. An incomplete invoice can be rejected by your client, challenged during a tax audit, or invalidate your VAT deduction rights. Yet the vast majority of errors found on Moroccan invoices come down to simple omissions: a missing ICE number, an absent VAT mention, or inconsistent numbering.',
          },
          {
            type: 'p',
            text: 'This guide lists all mandatory mentions based on your legal status — auto-entrepreneur, freelancer, SARL or SA subject to VAT — with the exact wording to use and the most common mistakes to avoid.',
          },
        ],
        sections: [
          {
            h2: 'Why mandatory mentions are a legal obligation',
            blocks: [
              {
                type: 'p',
                text: 'Mandatory invoice mentions in Morocco are governed by the General Tax Code (CGI) and VAT legislation. They are not mere recommendations — their absence can have real consequences:',
              },
              {
                type: 'ul',
                items: [
                  'Invoice rejected by the client, especially companies whose accounts are audited',
                  'Your client losing the right to deduct VAT on your services if VAT mentions are incorrect',
                  'The expense being disallowed as a deduction during a tax audit',
                  'Penalties for repeated non-compliant invoicing',
                  'Commercial disputes that are harder to resolve without an enforceable invoice',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'When is an invoice legally required?',
                body: 'In Morocco, an invoice is mandatory for all B2B transactions regardless of amount. For B2C transactions, it is mandatory above 10,000 MAD. Below that, a note or receipt may suffice — but issuing a proper invoice is always best practice.',
              },
            ],
          },
          {
            h2: 'Mentions required on all Moroccan invoices',
            blocks: [
              {
                type: 'p',
                text: 'Regardless of your legal status — auto-entrepreneur, individual trader, SARL or SA — these mentions must appear on every invoice you issue:',
              },
              {
                type: 'table',
                headers: ['Mention', 'Detail'],
                rows: [
                  ['Seller / service provider identity', 'Full name or company name, complete address'],
                  ['Invoice number', 'Sequential, continuous, no gaps (INV-2025-001, INV-2025-002…)'],
                  ['Issue date', 'The date the invoice is drawn up'],
                  ['Client identity', 'Name / company name, complete address'],
                  ['Description of service or product', 'Detailed enough to identify the transaction'],
                  ['Quantity', 'Number of units, hours, days depending on the nature of the service'],
                  ['Unit price excluding tax', 'For each line item'],
                  ['Total amount excluding tax', 'Sum of all lines'],
                  ['Payment terms', 'Deadline (30, 60 days…), method (bank transfer, cheque, cash)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Vague description: the most common trap',
                body: 'A description such as "Service provision", "Work" or "Consulting" is too vague. During a tax audit, the tax authority may challenge the reality of the service. Be specific: "iOS mobile app development — sprint 3 — March 2025" is a valid description.',
              },
            ],
          },
          {
            h2: 'Specific mentions for auto-entrepreneurs and individual traders',
            blocks: [
              {
                type: 'p',
                text: 'If you are an auto-entrepreneur or an individual trader under the simplified regime, two additional mentions apply to all your invoices:',
              },
              {
                type: 'table',
                headers: ['Mention', 'Detail and wording'],
                rows: [
                  ['Tax Identifier (IF)', '"IF: XXXXXXXX" — assigned at registration. Place in the header, clearly visible.'],
                  ['VAT exemption notice', '"VAT-exempt — Auto-entrepreneur IF No. XXXXXXXX". Mandatory below the invoice total.'],
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'No VAT = no VAT line, but a mandatory notice',
                body: 'A common mistake is leaving a VAT line at 0% or leaving it blank. Best practice is to replace the VAT line entirely with the explicit exemption notice. Your pre-tax amount equals your total amount, and the legal notice explains why.',
              },
            ],
          },
          {
            h2: 'Specific mentions for VAT-registered companies (SARL, SA…)',
            blocks: [
              {
                type: 'p',
                text: 'If you operate through a company (SARL, SA, SARLAU) or as a VAT-registered individual trader, additional mentions are required — in particular your company\'s official identifiers:',
              },
              {
                type: 'table',
                headers: ['Mention', 'Detail'],
                rows: [
                  ['ICE (Common Business Identifier)', '15-digit number assigned by the Trade Register. Mandatory for all registered companies.'],
                  ['RC number (Trade Register)', 'Your company\'s Trade Register registration number.'],
                  ['Tax Identifier (IF)', 'Tax number assigned by the DGI, distinct from the ICE.'],
                  ['Patente number', 'Professional tax number (formerly called "patente").'],
                  ['VAT rate applied', '20%, 10%, 7% or 0% depending on the type of service.'],
                  ['VAT amount', 'Exact VAT amount calculated on the pre-tax total.'],
                  ['Total including VAT', 'Pre-tax total + VAT.'],
                  ['Legal form and share capital', 'E.g. "SARL with share capital of 100,000 MAD"'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'ICE vs IF: what is the difference?',
                body: 'The ICE (Identifiant Commun de l\'Entreprise) is a unique identifier assigned to every registered business in Morocco — it consolidates all your official identifiers. The IF (Identifiant Fiscal) is assigned specifically by the Direction Générale des Impôts. Both are distinct and must both appear on your invoices if you are a company.',
              },
            ],
          },
          {
            h2: 'Invoice numbering: rules and best practices',
            blocks: [
              {
                type: 'p',
                text: 'Numbering is a mandatory mention subject to strict rules. Incorrect numbering is one of the first red flags during a tax audit:',
              },
              {
                type: 'ul',
                items: [
                  'Sequential: each number must be higher than the previous one, without exception',
                  'Continuous: no gaps in the sequence — if you cancel an invoice, issue a credit note rather than deleting the number',
                  'Chronological: numbers must match the order of issue dates',
                  'Unique: a number may only be used once',
                  'Recommended format: INV-YYYY-NNN (e.g. INV-2025-047) to include the year',
                  'Non-modifiable: an issued invoice cannot be edited or deleted — only a credit note can correct it',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'What if you have gaps in your numbering?',
                body: 'If you find gaps in your numbering (e.g. an invoice accidentally deleted), document the incident in writing and keep the evidence. The tax authority may accept a justified explanation, but repeated unexplained gaps are interpreted as an attempt to conceal revenue.',
              },
            ],
          },
          {
            h2: 'Summary table: mentions by professional type',
            blocks: [
              {
                type: 'table',
                headers: ['Mention', 'Auto-entrepreneur', 'Individual trader (standard)', 'SARL / SA'],
                rows: [
                  ['Name / company name + address', '✓', '✓', '✓'],
                  ['Sequential invoice number', '✓', '✓', '✓'],
                  ['Issue date', '✓', '✓', '✓'],
                  ['Client details', '✓', '✓', '✓'],
                  ['Detailed description', '✓', '✓', '✓'],
                  ['Unit price + total excl. VAT', '✓', '✓', '✓'],
                  ['Payment terms', '✓', '✓', '✓'],
                  ['Tax Identifier (IF)', '✓', '✓', '✓'],
                  ['VAT exemption notice', '✓', 'If exempt', '—'],
                  ['VAT rate + VAT amount', '—', 'If VAT-registered', '✓'],
                  ['ICE (15 digits)', '—', 'Recommended', '✓'],
                  ['RC number', '—', '—', '✓'],
                  ['Patente number', '—', 'Depending', '✓'],
                  ['Legal form + share capital', '—', '—', '✓'],
                ],
              },
            ],
          },
          {
            h2: 'Quick checklist before sending each invoice',
            blocks: [
              {
                type: 'ol',
                items: [
                  'My name / company name and address are in the header',
                  'My tax identifier (IF) is visible',
                  'The invoice number is sequential and in the correct series',
                  'The issue date is correct',
                  'The client\'s complete details appear on the invoice',
                  'Each service line is described in sufficient detail',
                  'Unit prices and pre-tax totals are correct',
                  'The VAT mention is correct: either the rate + VAT amount (if registered) or the exemption notice (if auto-entrepreneur)',
                  'Payment terms are clearly stated (deadline + method)',
                  'The client\'s ICE is included if they are a company',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli generates 100% compliant invoices automatically',
                body: 'With Sayerli, all these mentions are generated automatically from your profile and client information. Sequential numbering, IF, client ICE, VAT mention or exemption — nothing is forgotten. Create a compliant invoice in under 2 minutes. Free trial, no credit card required.',
                href: '/register',
                cta: 'Create my first compliant invoice',
              },
            ],
          },
          {
            h2: 'The 5 most penalized mention errors',
            blocks: [
              {
                type: 'table',
                headers: ['Error', 'Possible consequence'],
                rows: [
                  ['Missing IF or ICE', 'Invoice rejected by client or tax authority'],
                  ['No VAT mention (no rate and no exemption notice)', 'Client loses VAT deduction right, challenged in audit'],
                  ['Vague description', 'Tax authority may contest the reality of the service'],
                  ['Gap in numbering sequence', 'Suspicion of revenue concealment, potential penalties'],
                  ['Incorrect or missing date', 'Problem allocating the expense to a tax period'],
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Stop leaving compliance to chance',
                body: 'Sayerli builds Moroccan invoicing rules directly into the tool. Whether you are an auto-entrepreneur, freelancer or SME, your invoices automatically comply with all legal requirements. Quotes, invoices, credit notes — all in MAD, all compliant. Start free.',
                href: '/fonctionnalites',
                cta: 'See all features',
              },
            ],
          },
        ],
      },

      // ── ARABIC ──────────────────────────────────────────────────────────────
      ar: {
        title: 'البيانات الإلزامية في الفاتورة بالمغرب: الدليل الشامل 2025',
        description: 'جميع البيانات الإلزامية في الفاتورة بالمغرب: ICE وIF والضريبة على القيمة المضافة والترقيم وبيانات التواصل وآجال الدفع. دليل شامل للمقاولين الذاتيين والمستقلين والمقاولات الصغيرة.',
        intro: [
          {
            type: 'p',
            text: 'في المغرب، الفاتورة ليست مجرد وثيقة محاسبية — بل هي صك قانوني يُنظّمه القانون. فاتورة ناقصة قد يرفضها عميلك، أو تُطعن فيها عند مراجعة جبائية، أو تُسقط حقّك في استرداد الضريبة على القيمة المضافة. ومع ذلك، تعود غالبية الأخطاء المُلاحَظة في الفواتير المغربية إلى إغفالات بسيطة: رقم ICE مفقود، إشعار ضريبة على القيمة المضافة غائب، أو ترقيم متضارب.',
          },
          {
            type: 'p',
            text: 'يستعرض هذا الدليل جميع البيانات الإلزامية حسب وضعيتك القانونية — مقاول ذاتي، مستقل، شركة ذات مسؤولية محدودة أو شركة مساهمة خاضعة للضريبة على القيمة المضافة — مع الصياغات الدقيقة الواجب استخدامها والأخطاء الأكثر شيوعاً الواجب تجنبها.',
          },
        ],
        sections: [
          {
            h2: 'لماذا البيانات الإلزامية التزام قانوني',
            blocks: [
              {
                type: 'p',
                text: 'تخضع البيانات الإلزامية في الفواتير بالمغرب للمدونة العامة للضرائب وأحكام قانون الضريبة على القيمة المضافة. وهي ليست مجرد توصيات — غيابها قد يُفضي إلى عواقب ملموسة:',
              },
              {
                type: 'ul',
                items: [
                  'رفض الفاتورة من قِبل العميل، ولا سيما الشركات التي تخضع حساباتها للتدقيق',
                  'فقدان عميلك حق خصم الضريبة على القيمة المضافة على خدماتك إذا كانت بيانات الضريبة غير صحيحة',
                  'الطعن في قابلية خصم المصروف خلال مراجعة جبائية',
                  'غرامات في حالة الفوترة غير المطابقة المتكررة',
                  'نزاعات تجارية يصعب الفصل فيها دون فاتورة قابلة للاحتجاج بها',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'متى تكون الفاتورة إلزامية قانوناً؟',
                body: 'في المغرب، الفاتورة إلزامية في جميع المعاملات بين المهنيين (B2B) بصرف النظر عن المبلغ. في المعاملات مع الأفراد (B2C)، تصبح إلزامية فوق 10,000 درهم. دون ذلك قد تكفي مذكرة أو وصل — غير أن إصدار فاتورة سليمة يبقى أفضل ممارسة دائماً.',
              },
            ],
          },
          {
            h2: 'البيانات المشتركة في جميع الفواتير بالمغرب',
            blocks: [
              {
                type: 'p',
                text: 'بصرف النظر عن وضعك القانوني — مقاول ذاتي، تاجر فرد، شركة ذات مسؤولية محدودة أو شركة مساهمة — هذه البيانات يجب أن تظهر في كل فاتورة تُصدرها:',
              },
              {
                type: 'table',
                headers: ['البيان', 'التفصيل'],
                rows: [
                  ['هوية البائع / مقدّم الخدمة', 'الاسم الكامل أو الاسم التجاري، العنوان الكامل'],
                  ['رقم الفاتورة', 'تسلسلي، متواصل، بلا ثغرات (FA-2025-001، FA-2025-002…)'],
                  ['تاريخ الإصدار', 'التاريخ الذي حُرِّرت فيه الفاتورة'],
                  ['هوية العميل', 'الاسم/الشركة، العنوان الكامل'],
                  ['وصف الخدمة أو البضاعة', 'مفصَّل بما يكفي لتحديد المعاملة'],
                  ['الكمية', 'عدد الوحدات أو الساعات أو الأيام حسب طبيعة الخدمة'],
                  ['السعر الوحدوي (دون الضريبة)', 'لكل سطر من سطور الفاتورة'],
                  ['المجموع الإجمالي (دون الضريبة)', 'مجموع جميع السطور'],
                  ['شروط الدفع', 'الأجل (30، 60 يوماً…)، الطريقة (تحويل، شيك، نقداً)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'الوصف المبهم: الفخ الأكثر شيوعاً',
                body: 'وصف من قبيل "تقديم خدمات" أو "أشغال" أو "استشارة" مبهم للغاية. عند مراجعة جبائية، قد تطعن الإدارة الضريبية في واقعية الخدمة. كن دقيقاً: "تطوير تطبيق موبايل iOS — sprint 3 — مارس 2025" وصف صالح.',
              },
            ],
          },
          {
            h2: 'بيانات خاصة بالمقاولين الذاتيين والأشخاص الطبيعيين',
            blocks: [
              {
                type: 'p',
                text: 'إذا كنت مقاولاً ذاتياً أو شخصاً طبيعياً يمارس في إطار النظام المبسط، يُضاف بيانان إلزاميان لجميع فواتيرك:',
              },
              {
                type: 'table',
                headers: ['البيان', 'التفصيل والصياغة'],
                rows: [
                  ['المعرّف الضريبي (IF)', '"IF: XXXXXXXX" — يُسنَد عند التسجيل. يُوضَع في الترويسة مرئياً بوضوح.'],
                  ['إشعار الإعفاء من الضريبة على القيمة المضافة', '"معفى من الضريبة على القيمة المضافة — مقاول ذاتي IF رقم XXXXXXXX". إلزامي أسفل مجموع الفاتورة.'],
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'لا ضريبة = لا سطر للضريبة، لكن إشعار إلزامي',
                body: 'خطأ شائع هو ترك سطر الضريبة بنسبة 0% أو تركه فارغاً. الممارسة السليمة هي استبدال سطر الضريبة كلياً بإشعار الإعفاء الصريح. مجموعك قبل الضريبة = مجموعك الإجمالي، والبيان القانوني يُوضّح السبب.',
              },
            ],
          },
          {
            h2: 'بيانات خاصة بالشركات الخاضعة للضريبة على القيمة المضافة (ش.م.م، ش.أ…)',
            blocks: [
              {
                type: 'p',
                text: 'إذا كنت تُدير شركة (ش.م.م، ش.أ، ش.م.م.أ) أو شخصاً طبيعياً خاضعاً للضريبة على القيمة المضافة، تُضاف بيانات إضافية — ولا سيما المعرّفات الرسمية لشركتك:',
              },
              {
                type: 'table',
                headers: ['البيان', 'التفصيل'],
                rows: [
                  ['ICE (المعرّف المشترك للمقاولة)', 'رقم من 15 خانة تُسنده سجلات التجارة. إلزامي لكل شركة مسجَّلة.'],
                  ['رقم RC (السجل التجاري)', 'رقم تسجيل الشركة في السجل التجاري.'],
                  ['المعرّف الضريبي (IF)', 'الرقم الضريبي الصادر عن المديرية العامة للضرائب، مغاير لـ ICE.'],
                  ['رقم الحصة الضريبية (البطانة)', 'رقم الضريبة المهنية (المعروفة سابقاً بـ "البطانة").'],
                  ['نسبة الضريبة على القيمة المضافة المطبّقة', '20% أو 10% أو 7% أو 0% حسب طبيعة الخدمة.'],
                  ['مبلغ الضريبة على القيمة المضافة', 'المبلغ الدقيق للضريبة محسوباً على المجموع قبل الضريبة.'],
                  ['المجموع الإجمالي (شاملاً الضريبة)', 'المجموع قبل الضريبة + مبلغ الضريبة.'],
                  ['الشكل القانوني ورأس المال الاجتماعي', 'مثال: "شركة ذات مسؤولية محدودة برأس مال 100,000 درهم"'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'ICE مقابل IF: ما الفرق؟',
                body: 'ICE (المعرّف المشترك للمقاولة) هو معرّف فريد يُسنَد لكل شركة مسجَّلة بالمغرب — يجمع جميع معرّفاتك الرسمية. أما IF (المعرّف الضريبي) فيُسنَد تحديداً من المديرية العامة للضرائب. كلاهما مستقل عن الآخر ويجب أن يظهرا معاً في فواتيرك إذا كنت شركة.',
              },
            ],
          },
          {
            h2: 'ترقيم الفواتير: القواعد وأفضل الممارسات',
            blocks: [
              {
                type: 'p',
                text: 'الترقيم بيان إلزامي يخضع لقواعد صارمة. ترقيم غير سليم هو أول إشارة تنبيه عند أي مراجعة جبائية:',
              },
              {
                type: 'ul',
                items: [
                  'تسلسلي: كل رقم يجب أن يكون أعلى من السابق، دون استثناء',
                  'متواصل: لا ثغرات في التسلسل — إذا ألغيت فاتورة، أصدر أمر تخفيض بدلاً من حذف الرقم',
                  'زمني: يجب أن تتطابق الأرقام مع ترتيب تواريخ الإصدار',
                  'فريد: لا يُستخدم أي رقم مرتين',
                  'الصيغة الموصى بها: FA-سسسس-NNN (مثال: FA-2025-047) لتضمين السنة',
                  'غير قابل للتعديل: لا يجوز تعديل فاتورة صادرة أو حذفها — فقط أمر تخفيض يمكنه تصحيحها',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'ماذا تفعل إن وجدت ثغرات في ترقيمك؟',
                body: 'إذا اكتشفت ثغرات في ترقيمك (مثلاً فاتورة حُذفت عن طريق الخطأ)، وثّق الحادثة كتابةً واحتفظ بالدليل. قد تقبل الإدارة الضريبية تبريراً مدعوماً، لكن الثغرات المتكررة وغير المبررة تُفسَّر على أنها محاولة لإخفاء رقم الأعمال.',
              },
            ],
          },
          {
            h2: 'جدول ملخص: البيانات حسب نوع المهني',
            blocks: [
              {
                type: 'table',
                headers: ['البيان', 'مقاول ذاتي', 'شخص طبيعي (نظام عام)', 'ش.م.م / ش.أ'],
                rows: [
                  ['الاسم/الشركة + العنوان', '✓', '✓', '✓'],
                  ['رقم الفاتورة التسلسلي', '✓', '✓', '✓'],
                  ['تاريخ الإصدار', '✓', '✓', '✓'],
                  ['بيانات العميل', '✓', '✓', '✓'],
                  ['وصف مفصَّل', '✓', '✓', '✓'],
                  ['السعر الوحدوي + الإجمالي قبل الضريبة', '✓', '✓', '✓'],
                  ['شروط الدفع', '✓', '✓', '✓'],
                  ['المعرّف الضريبي (IF)', '✓', '✓', '✓'],
                  ['إشعار الإعفاء من الضريبة', '✓', 'إن كان معفى', '—'],
                  ['نسبة + مبلغ الضريبة', '—', 'إن كان خاضعاً', '✓'],
                  ['ICE (15 خانة)', '—', 'موصى به', '✓'],
                  ['رقم RC', '—', '—', '✓'],
                  ['رقم الضريبة المهنية', '—', 'حسب الحالة', '✓'],
                  ['الشكل القانوني + رأس المال', '—', '—', '✓'],
                ],
              },
            ],
          },
          {
            h2: 'قائمة مراجعة سريعة قبل إرسال كل فاتورة',
            blocks: [
              {
                type: 'ol',
                items: [
                  'اسمي/شركتي وعنواني موجودان في الترويسة',
                  'معرّفي الضريبي (IF) مرئي بوضوح',
                  'رقم الفاتورة تسلسلي وضمن السلسلة الصحيحة',
                  'تاريخ الإصدار صحيح',
                  'البيانات الكاملة للعميل مذكورة في الفاتورة',
                  'كل سطر خدمة موصوف بتفصيل كافٍ',
                  'الأسعار الوحدوية والمجاميع قبل الضريبة صحيحة',
                  'بيان الضريبة صحيح: إما النسبة + المبلغ (إن كنت خاضعاً) أو إشعار الإعفاء (إن كنت مقاولاً ذاتياً)',
                  'شروط الدفع مذكورة بوضوح (الأجل + الطريقة)',
                  'رقم ICE للعميل مذكور إن كان شركة',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli يولّد فواتير مطابقة 100% تلقائياً',
                body: 'مع Sayerli، تُولَّد جميع هذه البيانات تلقائياً انطلاقاً من ملفك الشخصي ومعلومات العميل. ترقيم تسلسلي، IF، ICE العميل، بيان الضريبة أو الإعفاء — لا شيء يُنسى. أنشئ فاتورة مطابقة في أقل من دقيقتين. تجربة مجانية، بدون بطاقة بنكية.',
                href: '/register',
                cta: 'إنشاء أول فاتورة مطابقة',
              },
            ],
          },
          {
            h2: 'أكثر 5 أخطاء في البيانات تعرّضاً للعقوبة',
            blocks: [
              {
                type: 'table',
                headers: ['الخطأ', 'العاقبة المحتملة'],
                rows: [
                  ['غياب IF أو ICE', 'رفض الفاتورة من العميل أو الإدارة الضريبية'],
                  ['غياب بيان الضريبة (لا نسبة ولا إشعار إعفاء)', 'فقدان العميل لحق خصم الضريبة، طعن عند التدقيق'],
                  ['وصف مبهم', 'قد تطعن الإدارة الضريبية في واقعية الخدمة'],
                  ['ثغرة في تسلسل الترقيم', 'اشتباه بإخفاء رقم الأعمال، غرامات محتملة'],
                  ['تاريخ خاطئ أو مفقود', 'إشكالية في نسب المصروف لسنة ضريبية محددة'],
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'لا تترك المطابقة للصدفة بعد اليوم',
                body: 'يُدمج Sayerli قواعد الفوترة المغربية مباشرةً في الأداة. سواء كنت مقاولاً ذاتياً أو مستقلاً أو مقاولة صغيرة، تمتثل فواتيرك تلقائياً لجميع الالتزامات القانونية. عروض أسعار وفواتير وأوامر تخفيض — كلها بالدرهم، كلها مطابقة. ابدأ مجاناً.',
                href: '/fonctionnalites',
                cta: 'اكتشف جميع المزايا',
              },
            ],
          },
        ],
      },
    },
  },

  // ── ARTICLE 6 ────────────────────────────────────────────────────────────────
  'facturer-auto-entrepreneur-maroc': {
    slug: 'facturer-auto-entrepreneur-maroc',
    image: '/blog/facturer-auto-entrepreneur-maroc.webp',
    readingTime: 7,
    content: {

      // ── FRENCH ──────────────────────────────────────────────────────────────
      fr: {
        title: 'Comment facturer en tant qu\'auto-entrepreneur au Maroc : mentions obligatoires et IF fiscal',
        description: 'Guide complet pour émettre des factures conformes en tant qu\'auto-entrepreneur au Maroc : mentions obligatoires, identifiant fiscal (IF), numérotation, exonération TVA et erreurs à éviter.',
        intro: [
          {
            type: 'p',
            text: 'Vous avez votre identifiant fiscal, votre premier client est prêt à payer — et là, la question se pose : comment créer une facture conforme ? Que doit-elle contenir exactement ? Qu\'est-ce que la mention d\'exonération TVA ? Comment numéroter mes factures ?',
          },
          {
            type: 'p',
            text: 'Une facture mal rédigée n\'est pas qu\'un problème esthétique. Elle peut être refusée par un client sérieux, poser des problèmes lors d\'un contrôle fiscal, ou invalider vos déclarations trimestrielles. Ce guide couvre tout ce que doit contenir une facture d\'auto-entrepreneur conforme au droit marocain — mention par mention.',
          },
        ],
        sections: [
          {
            h2: 'Pourquoi la conformité de vos factures est cruciale',
            blocks: [
              {
                type: 'p',
                text: 'La facture est votre document commercial et fiscal de référence. En tant qu\'auto-entrepreneur, elle remplit plusieurs fonctions simultanément : preuve de la prestation pour votre client, justificatif pour votre déclaration trimestrielle de CA, et document opposable en cas de litige ou de contrôle fiscal.',
              },
              {
                type: 'ul',
                items: [
                  'Un client entreprise (B2B) peut refuser de vous payer si la facture ne mentionne pas votre IF',
                  'La Direction Générale des Impôts peut requalifier une facture non conforme lors d\'un contrôle',
                  'Une numérotation incohérente ou des trous dans la séquence peuvent éveiller des soupçons lors d\'un audit',
                  'Certaines grandes entreprises exigent des factures conformes pour leur propre comptabilité',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Facture vs reçu vs bon de commande',
                body: 'La facture est le document qui acte la livraison d\'un bien ou d\'une prestation et déclenche l\'obligation de paiement. Elle diffère du devis (proposition commerciale avant la prestation) et du reçu (confirmation de paiement après). L\'auto-entrepreneur émet des factures, pas de simples reçus.',
              },
            ],
          },
          {
            h2: 'Les mentions obligatoires sur chaque facture',
            blocks: [
              {
                type: 'p',
                text: 'Voici la liste complète des mentions qui doivent figurer sur toute facture émise par un auto-entrepreneur marocain. Aucune n\'est facultative :',
              },
              {
                type: 'table',
                headers: ['Mention', 'Détail / exemple'],
                rows: [
                  ['Vos nom et prénom', 'Ou votre nom commercial si vous en avez un enregistré'],
                  ['Votre adresse', 'L\'adresse déclarée lors de votre inscription au portail'],
                  ['Votre Identifiant Fiscal (IF)', '"IF : 12345678" — obtenu à l\'inscription'],
                  ['Numéro de facture', 'Séquentiel et continu : FA-2025-001, FA-2025-002…'],
                  ['Date d\'émission', 'La date à laquelle la facture est émise'],
                  ['Coordonnées du client', 'Nom/raison sociale, adresse, ICE si entreprise'],
                  ['Description de la prestation', 'Détaillée — "Développement site vitrine — mai 2025"'],
                  ['Quantité et prix unitaire HT', 'Pour chaque ligne de prestation'],
                  ['Montant total HT', 'Somme de toutes les lignes'],
                  ['Mention d\'exonération TVA', '"Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX"'],
                  ['Montant TTC', 'Égal au HT puisque TVA = 0'],
                  ['Modalités de paiement', 'Délai, mode (virement, chèque, espèces…)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Mentions souvent oubliées',
                body: 'Les deux mentions les plus fréquemment oubliées sont : (1) la mention explicite d\'exonération TVA avec le numéro IF, et (2) les coordonnées complètes du client. Ces deux oublis sont les plus courants lors des contrôles et peuvent invalider la facture.',
              },
            ],
          },
          {
            h2: 'L\'Identifiant Fiscal (IF) : tout comprendre',
            blocks: [
              {
                type: 'p',
                text: 'L\'Identifiant Fiscal est le numéro qui vous a été attribué par la Direction Générale des Impôts lors de votre inscription sur le portail auto-entrepreneur. C\'est votre numéro de référence fiscal unique — l\'équivalent du numéro SIRET en France, mais pour les auto-entrepreneurs marocains.',
              },
              {
                type: 'ul',
                items: [
                  'Où le trouver : dans l\'email de confirmation reçu lors de votre inscription, ou dans votre espace personnel sur portail.auto-entrepreneur.ma',
                  'Format : une série de chiffres (généralement 7 à 8 chiffres)',
                  'Où le mettre sur la facture : dans l\'en-tête, clairement visible, à côté de votre nom et adresse',
                  'Comment le mentionner : "IF : 12345678" ou "Identifiant Fiscal : 12345678"',
                  'Obligatoire sur : toutes les factures, sans exception',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'IF introuvable ?',
                body: 'Si vous ne retrouvez plus votre IF, connectez-vous à portail.auto-entrepreneur.ma — il est visible dans votre tableau de bord et sur votre attestation d\'inscription téléchargeable. Vous pouvez également le demander directement auprès du centre régional des impôts (CRI) de votre wilaya.',
              },
            ],
          },
          {
            h2: 'La mention d\'exonération TVA : comment la rédiger',
            blocks: [
              {
                type: 'p',
                text: 'En tant qu\'auto-entrepreneur, vous êtes légalement exonéré de TVA. Cela signifie que vous ne collectez pas de TVA sur vos factures et que le montant facturé est identique HT et TTC. Mais cette exonération doit être mentionnée explicitement sur chaque facture — sans quoi le client peut légitimement se demander pourquoi il n\'y a pas de TVA.',
              },
              {
                type: 'p',
                text: 'La formulation standard recommandée est la suivante :',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Formulation exacte à utiliser',
                body: '"Exonéré de TVA en vertu du régime auto-entrepreneur — Identifiant Fiscal (IF) n° XXXXXXXX"\n\nOu en version courte : "Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX"',
              },
              {
                type: 'p',
                text: 'Cette mention rassure votre client et protège les deux parties. Elle indique clairement que l\'absence de TVA n\'est pas une erreur mais une exonération légale liée à votre statut. Placez-la sous le total de la facture, bien visible.',
              },
            ],
          },
          {
            h2: 'La numérotation des factures : la règle d\'or',
            blocks: [
              {
                type: 'p',
                text: 'La numérotation des factures n\'est pas libre. Elle doit suivre une séquence chronologique continue et sans trous. Voici les règles à respecter absolument :',
              },
              {
                type: 'ul',
                items: [
                  'Chronologique : chaque numéro doit être supérieur au précédent',
                  'Continue : pas de trou dans la numérotation (pas de FA-001, FA-003 sans FA-002)',
                  'Unique : aucun numéro ne peut être utilisé deux fois',
                  'Format recommandé : FA-AAAA-NNN (ex : FA-2025-001) pour intégrer l\'année et faciliter l\'archivage',
                  'Jamais rétroactive : une facture ne peut pas être antidatée',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Que faire en cas d\'erreur sur une facture ?',
                body: 'Vous ne pouvez pas supprimer ou modifier une facture déjà envoyée. Si vous faites une erreur, la procédure correcte est d\'émettre un avoir (note de crédit) qui annule la facture incorrecte, puis de réémettre une nouvelle facture avec un nouveau numéro. Ne modifiez jamais une facture envoyée.',
              },
            ],
          },
          {
            h2: 'Exemple d\'une facture auto-entrepreneur conforme',
            blocks: [
              {
                type: 'p',
                text: 'Voici la structure type d\'une facture conforme pour un auto-entrepreneur marocain prestataire de services :',
              },
              {
                type: 'table',
                headers: ['Zone de la facture', 'Contenu'],
                rows: [
                  ['En-tête (haut gauche)', 'Votre nom complet\nVotre adresse\nIF : 12345678\nVotre téléphone / email'],
                  ['En-tête (haut droite)', 'FACTURE N° FA-2025-007\nDate : 15 mai 2025'],
                  ['Informations client', 'Nom ou raison sociale du client\nAdresse du client\nICE : 001234567000012 (si entreprise)'],
                  ['Corps — lignes', 'Description | Qté | Prix unitaire HT | Total HT'],
                  ['Pied de facture', 'Total HT : 8 000 MAD\nTVA : Exonéré\nTotal TTC : 8 000 MAD'],
                  ['Mention légale', '"Exonéré de TVA — Auto-entrepreneur IF n° 12345678"'],
                  ['Paiement', 'Virement bancaire sous 30 jours\nRIB : XXXX XXXX XXXX'],
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Générez des factures conformes en 2 minutes avec Sayerli',
                body: 'Sayerli intègre automatiquement toutes les mentions obligatoires : votre IF, la mention d\'exonération TVA, la numérotation séquentielle, et les coordonnées de votre client. Créez, envoyez et suivez vos factures en MAD depuis un seul outil. Essai gratuit, sans carte bancaire.',
                href: '/register',
                cta: 'Créer ma première facture',
              },
            ],
          },
          {
            h2: 'Les 7 erreurs les plus fréquentes sur les factures auto-entrepreneur',
            blocks: [
              {
                type: 'p',
                text: 'Après analyse de centaines de factures émises par des auto-entrepreneurs marocains, voici les erreurs qui reviennent le plus souvent :',
              },
              {
                type: 'ol',
                items: [
                  'IF absent ou incorrect — c\'est la mention la plus importante et la plus souvent oubliée',
                  'Pas de mention d\'exonération TVA — le client ne sait pas pourquoi il n\'y a pas de TVA',
                  'Numérotation incohérente — des sauts dans la séquence ou des numéros répétés',
                  'Description trop vague — "Prestation de services" sans détail n\'est pas suffisant',
                  'Pas de date d\'émission — pourtant obligatoire et déterminante pour vos déclarations',
                  'Coordonnées client incomplètes — surtout l\'ICE manquant pour les clients entreprises',
                  'Facture modifiée après envoi — toujours émettre un avoir et une nouvelle facture à la place',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli élimine ces erreurs par construction',
                body: 'Avec Sayerli, chaque facture est générée avec toutes les mentions légales préremplies. La numérotation est automatique et séquentielle. Vous ne pouvez pas oublier l\'IF ni la mention TVA — ils sont inclus d\'office. Fini les refus de paiement pour facture non conforme.',
                href: '/fonctionnalites',
                cta: 'Voir toutes les fonctionnalités',
              },
            ],
          },
        ],
      },

      // ── ENGLISH ─────────────────────────────────────────────────────────────
      en: {
        title: 'How to Invoice as an Auto-Entrepreneur in Morocco: Mandatory Mentions and Tax Identifier',
        description: 'Complete guide to issuing compliant invoices as an auto-entrepreneur in Morocco: mandatory mentions, tax identifier (IF), numbering, VAT exemption notice and mistakes to avoid.',
        intro: [
          {
            type: 'p',
            text: 'You have your tax identifier, your first client is ready to pay — and then the question hits: how do you create a compliant invoice? What exactly does it need to include? What is the VAT exemption notice? How do you number your invoices?',
          },
          {
            type: 'p',
            text: 'A poorly written invoice is not just an aesthetic problem. It can be rejected by a serious client, cause issues during a tax audit, or invalidate your quarterly declarations. This guide covers everything a compliant auto-entrepreneur invoice must contain under Moroccan law — mention by mention.',
          },
        ],
        sections: [
          {
            h2: 'Why invoice compliance is critical',
            blocks: [
              {
                type: 'p',
                text: 'Your invoice is your key commercial and fiscal document. As an auto-entrepreneur, it serves multiple functions at once: proof of service for your client, supporting document for your quarterly revenue declaration, and an enforceable record in case of dispute or tax audit.',
              },
              {
                type: 'ul',
                items: [
                  'A B2B client may refuse to pay if the invoice does not include your tax identifier (IF)',
                  'The Direction Générale des Impôts can challenge a non-compliant invoice during an audit',
                  'Inconsistent numbering or gaps in the sequence can raise red flags during a review',
                  'Large companies often require compliant invoices for their own accounting',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Invoice vs receipt vs purchase order',
                body: 'An invoice is the document that confirms delivery of a service or product and triggers the payment obligation. It differs from a quote (commercial proposal before the work) and a receipt (payment confirmation after). Auto-entrepreneurs issue invoices, not simple receipts.',
              },
            ],
          },
          {
            h2: 'Mandatory mentions on every invoice',
            blocks: [
              {
                type: 'p',
                text: 'Here is the complete list of mentions that must appear on every invoice issued by a Moroccan auto-entrepreneur. None of them are optional:',
              },
              {
                type: 'table',
                headers: ['Mention', 'Detail / example'],
                rows: [
                  ['Your full name', 'Or your trade name if you have one registered'],
                  ['Your address', 'The address declared during your portal registration'],
                  ['Your Tax Identifier (IF)', '"IF: 12345678" — assigned at registration'],
                  ['Invoice number', 'Sequential and continuous: INV-2025-001, INV-2025-002…'],
                  ['Issue date', 'The date the invoice is issued'],
                  ['Client details', 'Name/company name, address, ICE number if a company'],
                  ['Description of service', 'Detailed — "Website development — May 2025"'],
                  ['Quantity and unit price', 'For each line item'],
                  ['Total amount (excl. VAT)', 'Sum of all lines'],
                  ['VAT exemption notice', '"VAT-exempt — Auto-entrepreneur IF No. XXXXXXXX"'],
                  ['Total amount incl. VAT', 'Equal to excl. VAT since VAT = 0'],
                  ['Payment terms', 'Deadline, method (bank transfer, cheque, cash…)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Most frequently forgotten mentions',
                body: 'The two most commonly omitted mentions are: (1) the explicit VAT exemption notice with the IF number, and (2) complete client details. These two omissions are the most common during audits and can invalidate the invoice.',
              },
            ],
          },
          {
            h2: 'The Tax Identifier (IF): everything you need to know',
            blocks: [
              {
                type: 'p',
                text: 'The Tax Identifier is the number assigned to you by the Direction Générale des Impôts when you registered on the auto-entrepreneur portal. It is your unique fiscal reference number — the Moroccan auto-entrepreneur equivalent of a SIRET number in France.',
              },
              {
                type: 'ul',
                items: [
                  'Where to find it: in the confirmation email received at registration, or in your personal space on portail.auto-entrepreneur.ma',
                  'Format: a series of digits (usually 7 to 8 digits)',
                  'Where to put it on the invoice: in the header, clearly visible, next to your name and address',
                  'How to write it: "IF: 12345678" or "Tax Identifier: 12345678"',
                  'Required on: every invoice, without exception',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Cannot find your IF?',
                body: 'If you cannot locate your IF, log in to portail.auto-entrepreneur.ma — it is visible on your dashboard and on your downloadable registration certificate. You can also request it directly from the regional tax centre (CRI) of your province.',
              },
            ],
          },
          {
            h2: 'The VAT exemption notice: how to write it',
            blocks: [
              {
                type: 'p',
                text: 'As an auto-entrepreneur, you are legally VAT-exempt. This means you do not collect VAT on your invoices and the invoiced amount is the same before and after tax. But this exemption must be stated explicitly on every invoice — otherwise the client may legitimately wonder why there is no VAT.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Exact wording to use',
                body: '"VAT-exempt under the auto-entrepreneur regime — Tax Identifier (IF) No. XXXXXXXX"\n\nShort version: "VAT-exempt — Auto-entrepreneur IF No. XXXXXXXX"',
              },
              {
                type: 'p',
                text: 'This mention reassures your client and protects both parties. It clearly states that the absence of VAT is not an error but a legal exemption tied to your status. Place it below the invoice total, clearly visible.',
              },
            ],
          },
          {
            h2: 'Invoice numbering: the golden rule',
            blocks: [
              {
                type: 'p',
                text: 'Invoice numbering is not free-form. It must follow a continuous chronological sequence with no gaps. Here are the rules to follow without exception:',
              },
              {
                type: 'ul',
                items: [
                  'Chronological: each number must be higher than the previous one',
                  'Continuous: no gaps in the sequence (no INV-001, INV-003 without INV-002)',
                  'Unique: no number may be used twice',
                  'Recommended format: INV-YYYY-NNN (e.g. INV-2025-001) to include the year and ease archiving',
                  'Never retroactive: an invoice cannot be backdated',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'What to do if you made an error on an invoice?',
                body: 'You cannot delete or modify an invoice that has already been sent. The correct procedure is to issue a credit note that cancels the incorrect invoice, then reissue a new invoice with a new number. Never edit a sent invoice.',
              },
            ],
          },
          {
            h2: 'Example of a compliant auto-entrepreneur invoice',
            blocks: [
              {
                type: 'p',
                text: 'Here is the standard structure of a compliant invoice for a Moroccan auto-entrepreneur providing services:',
              },
              {
                type: 'table',
                headers: ['Invoice section', 'Content'],
                rows: [
                  ['Header (top left)', 'Your full name\nYour address\nIF: 12345678\nYour phone / email'],
                  ['Header (top right)', 'INVOICE No. INV-2025-007\nDate: 15 May 2025'],
                  ['Client information', 'Client name or company name\nClient address\nICE: 001234567000012 (if company)'],
                  ['Body — line items', 'Description | Qty | Unit price | Total'],
                  ['Invoice footer', 'Total excl. VAT: 8,000 MAD\nVAT: Exempt\nTotal incl. VAT: 8,000 MAD'],
                  ['Legal notice', '"VAT-exempt — Auto-entrepreneur IF No. 12345678"'],
                  ['Payment', 'Bank transfer within 30 days\nIBAN: XXXX XXXX XXXX'],
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Generate compliant invoices in 2 minutes with Sayerli',
                body: 'Sayerli automatically includes all mandatory mentions: your IF, the VAT exemption notice, sequential numbering, and your client\'s details. Create, send and track your invoices in MAD from one tool. Free trial, no credit card required.',
                href: '/register',
                cta: 'Create my first invoice',
              },
            ],
          },
          {
            h2: 'The 7 most common auto-entrepreneur invoice mistakes',
            blocks: [
              {
                type: 'ol',
                items: [
                  'Missing or incorrect IF — the most important mention and the most often forgotten',
                  'No VAT exemption notice — the client does not know why there is no VAT',
                  'Inconsistent numbering — gaps in the sequence or repeated numbers',
                  'Vague description — "Service provision" without detail is not sufficient',
                  'No issue date — mandatory and critical for your quarterly declarations',
                  'Incomplete client details — especially the missing ICE for business clients',
                  'Invoice modified after sending — always issue a credit note and a new invoice instead',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli eliminates these mistakes by design',
                body: 'With Sayerli, every invoice is generated with all legal mentions pre-filled. Numbering is automatic and sequential. You cannot forget the IF or the VAT notice — they are included by default. No more payment rejections due to non-compliant invoices.',
                href: '/fonctionnalites',
                cta: 'See all features',
              },
            ],
          },
        ],
      },

      // ── ARABIC ──────────────────────────────────────────────────────────────
      ar: {
        title: 'كيف تُفوتر كمقاول ذاتي بالمغرب: البيانات الإلزامية والمعرّف الضريبي',
        description: 'دليل شامل لإصدار فواتير مطابقة كمقاول ذاتي بالمغرب: البيانات الإلزامية، المعرّف الضريبي (IF)، الترقيم، إشعار الإعفاء من الضريبة على القيمة المضافة، والأخطاء الواجب تجنبها.',
        intro: [
          {
            type: 'p',
            text: 'حصلت على معرّفك الضريبي، وعميلك الأول مستعد للدفع — ثم يطرح السؤال نفسه: كيف أُنشئ فاتورة مطابقة؟ ما الذي يجب أن تحتويه بالضبط؟ ما المقصود بإشعار الإعفاء من الضريبة على القيمة المضافة؟ كيف أُرقّم فواتيري؟',
          },
          {
            type: 'p',
            text: 'فاتورة مكتوبة بشكل خاطئ ليست مجرد مشكلة مظهرية. قد يرفضها عميل جاد، وقد تُسبّب مشاكل عند مراجعة جبائية، أو تُفسد تصريحاتك الفصلية. يغطي هذا الدليل كل ما يجب أن تحتويه فاتورة المقاول الذاتي المطابقة للقانون المغربي — بياناً بياناً.',
          },
        ],
        sections: [
          {
            h2: 'لماذا مطابقة فواتيرك أمر بالغ الأهمية',
            blocks: [
              {
                type: 'p',
                text: 'فاتورتك هي وثيقتك التجارية والجبائية المرجعية. بوصفك مقاولاً ذاتياً، تؤدي وظائف متعددة في آنٍ واحد: دليل على الخدمة أو المنتج لعميلك، مستند داعم لتصريحك الفصلي برقم الأعمال، ووثيقة قابلة للاحتجاج بها في حالة نزاع أو مراجعة جبائية.',
              },
              {
                type: 'ul',
                items: [
                  'عميل من الشركات قد يرفض الدفع إذا خلت الفاتورة من معرّفك الضريبي',
                  'قد تطعن المديرية العامة للضرائب في فاتورة غير مطابقة خلال مراجعة جبائية',
                  'ترقيم متضارب أو ثغرات في التسلسل قد تُثير الشكوك عند أي تدقيق',
                  'تشترط كثير من الشركات الكبرى فواتير مطابقة لمحاسبتها الخاصة',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'الفاتورة مقابل الوصل مقابل أمر الشراء',
                body: 'الفاتورة هي الوثيقة التي تُثبت تسليم خدمة أو منتج وتُفعّل الالتزام بالدفع. تختلف عن عرض الأسعار (اقتراح تجاري قبل الخدمة) والوصل (تأكيد الدفع بعدها). المقاول الذاتي يُصدر فواتير لا مجرد وصولات.',
              },
            ],
          },
          {
            h2: 'البيانات الإلزامية في كل فاتورة',
            blocks: [
              {
                type: 'p',
                text: 'إليك القائمة الكاملة للبيانات الواجب ذكرها في كل فاتورة يُصدرها مقاول ذاتي مغربي. لا شيء منها اختياري:',
              },
              {
                type: 'table',
                headers: ['البيان', 'التفصيل / مثال'],
                rows: [
                  ['اسمك الكامل', 'أو اسمك التجاري إن كان مسجلاً'],
                  ['عنوانك', 'العنوان المُصرَّح به عند التسجيل على البوابة'],
                  ['معرّفك الضريبي (IF)', '"IF: 12345678" — يُسنَد عند التسجيل'],
                  ['رقم الفاتورة', 'تسلسلي ومتواصل: FA-2025-001، FA-2025-002…'],
                  ['تاريخ الإصدار', 'التاريخ الذي أُصدرت فيه الفاتورة'],
                  ['بيانات العميل', 'الاسم/الشركة، العنوان، رقم ICE إن كان شركة'],
                  ['وصف الخدمة', 'مفصَّل — "تطوير موقع إلكتروني — ماي 2025"'],
                  ['الكمية والسعر الوحدوي', 'لكل سطر من سطور الخدمة'],
                  ['المجموع الإجمالي (دون الضريبة)', 'مجموع جميع السطور'],
                  ['إشعار الإعفاء من الضريبة على القيمة المضافة', '"معفى من الضريبة على القيمة المضافة — مقاول ذاتي IF رقم XXXXXXXX"'],
                  ['المجموع الإجمالي (شاملاً الضريبة)', 'يساوي المجموع دون الضريبة إذ الضريبة = 0'],
                  ['شروط الدفع', 'الأجل، الطريقة (تحويل بنكي، شيك، نقداً…)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'البيانات الأكثر نسياناً',
                body: 'أكثر بيانَين يُنسيان هما: (1) إشعار الإعفاء من الضريبة على القيمة المضافة مع رقم المعرّف الضريبي، و(2) البيانات الكاملة للعميل. هذان الإغفالان الأكثر شيوعاً عند المراجعات وقد يُبطلان الفاتورة.',
              },
            ],
          },
          {
            h2: 'المعرّف الضريبي (IF): كل ما تحتاج معرفته',
            blocks: [
              {
                type: 'p',
                text: 'المعرّف الضريبي هو الرقم الذي أسندته لك المديرية العامة للضرائب عند تسجيلك على بوابة المقاول الذاتي. إنه رقم مرجعيّك الجبائي الفريد — ما يقابل رقم SIRET في فرنسا، لكن للمقاولين الذاتيين المغاربة.',
              },
              {
                type: 'ul',
                items: [
                  'أين تجده: في بريد التأكيد الذي تلقيته عند التسجيل، أو في فضائك الشخصي على portail.auto-entrepreneur.ma',
                  'الصيغة: سلسلة أرقام (عادةً من 7 إلى 8 أرقام)',
                  'أين تضعه في الفاتورة: في الترويسة، مرئياً بوضوح، بجانب اسمك وعنوانك',
                  'كيفية كتابته: "IF: 12345678" أو "المعرّف الضريبي: 12345678"',
                  'إلزامي في: جميع الفواتير، دون استثناء',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'لا تجد معرّفك الضريبي؟',
                body: 'إذا لم تعثر على معرّفك الضريبي، سجّل الدخول إلى portail.auto-entrepreneur.ma — يظهر في لوحة قيادتك وعلى شهادة تسجيلك القابلة للتحميل. يمكنك أيضاً طلبه مباشرةً من المركز الجهوي للضرائب في إقليمك.',
              },
            ],
          },
          {
            h2: 'إشعار الإعفاء من الضريبة على القيمة المضافة: كيف تكتبه',
            blocks: [
              {
                type: 'p',
                text: 'بوصفك مقاولاً ذاتياً، أنت معفى قانونياً من الضريبة على القيمة المضافة. ذلك يعني أنك لا تجمعها من عملائك وأن المبلغ المُفوتَر متطابق قبل الضريبة وبعدها. لكن هذا الإعفاء يجب ذكره صراحةً في كل فاتورة — وإلا قد يتساءل العميل بحق لماذا لا توجد ضريبة على القيمة المضافة.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'الصياغة الدقيقة الموصى باستخدامها',
                body: '"معفى من الضريبة على القيمة المضافة بموجب نظام المقاول الذاتي — المعرّف الضريبي (IF) رقم XXXXXXXX"\n\nأو بالنسخة المختصرة: "معفى من الضريبة على القيمة المضافة — مقاول ذاتي IF رقم XXXXXXXX"',
              },
              {
                type: 'p',
                text: 'يطمئن هذا البيان عميلك ويحمي الطرفين. يُوضح صراحةً أن غياب الضريبة على القيمة المضافة ليس خطأ بل إعفاء قانوني مرتبط بوضعك. ضعه أسفل الإجمالي في الفاتورة، مرئياً بوضوح.',
              },
            ],
          },
          {
            h2: 'ترقيم الفواتير: القاعدة الذهبية',
            blocks: [
              {
                type: 'p',
                text: 'ترقيم الفواتير ليس حراً. يجب أن يتبع تسلسلاً زمنياً متواصلاً بلا ثغرات. إليك القواعد الواجب احترامها دون استثناء:',
              },
              {
                type: 'ul',
                items: [
                  'زمني: كل رقم يجب أن يكون أعلى من السابق',
                  'متواصل: لا ثغرات في التسلسل (لا FA-001 ثم FA-003 دون FA-002)',
                  'فريد: لا يُستخدم أي رقم مرتين',
                  'الصيغة الموصى بها: FA-سسسس-NNN (مثال: FA-2025-001) لتضمين السنة وتسهيل الأرشفة',
                  'غير رجعية أبداً: لا يجوز تأريخ فاتورة بتاريخ سابق',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'ماذا تفعل إذا أخطأت في فاتورة؟',
                body: 'لا يمكنك حذف أو تعديل فاتورة أُرسلت. الإجراء الصحيح هو إصدار أمر تخفيض (avoir) يُلغي الفاتورة الخاطئة، ثم إصدار فاتورة جديدة برقم جديد. لا تُعدّل أبداً فاتورة تم إرسالها.',
              },
            ],
          },
          {
            h2: 'مثال على فاتورة مقاول ذاتي مطابقة',
            blocks: [
              {
                type: 'p',
                text: 'إليك الهيكل النموذجي لفاتورة مطابقة لمقاول ذاتي مغربي مقدّم للخدمات:',
              },
              {
                type: 'table',
                headers: ['قسم الفاتورة', 'المحتوى'],
                rows: [
                  ['الترويسة (أعلى اليسار)', 'اسمك الكامل\nعنوانك\nIF: 12345678\nهاتفك / بريدك الإلكتروني'],
                  ['الترويسة (أعلى اليمين)', 'فاتورة رقم FA-2025-007\nالتاريخ: 15 ماي 2025'],
                  ['بيانات العميل', 'اسم العميل أو الشركة\nعنوان العميل\nICE: 001234567000012 (إن كان شركة)'],
                  ['الجسم — سطور الخدمة', 'الوصف | الكمية | السعر الوحدوي | الإجمالي'],
                  ['ذيل الفاتورة', 'المجموع (دون الضريبة): 8,000 درهم\nالضريبة على القيمة المضافة: معفى\nالمجموع الإجمالي: 8,000 درهم'],
                  ['البيان القانوني', '"معفى من الضريبة على القيمة المضافة — مقاول ذاتي IF رقم 12345678"'],
                  ['الدفع', 'تحويل بنكي في أجل 30 يوماً\nRIB: XXXX XXXX XXXX'],
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'أنشئ فواتير مطابقة في دقيقتين مع Sayerli',
                body: 'يُضمّن Sayerli تلقائياً جميع البيانات الإلزامية: معرّفك الضريبي، إشعار الإعفاء من الضريبة على القيمة المضافة، الترقيم التسلسلي، وبيانات عميلك. أنشئ فواتيرك وأرسلها وتتبّع مدفوعاتها بالدرهم من أداة واحدة. تجربة مجانية، بدون بطاقة بنكية.',
                href: '/register',
                cta: 'إنشاء أول فاتورة',
              },
            ],
          },
          {
            h2: 'أكثر 7 أخطاء شيوعاً في فواتير المقاولين الذاتيين',
            blocks: [
              {
                type: 'ol',
                items: [
                  'غياب المعرّف الضريبي أو خطؤه — البيان الأهم والأكثر نسياناً',
                  'غياب إشعار الإعفاء من الضريبة على القيمة المضافة — العميل لا يعرف سبب غياب الضريبة',
                  'ترقيم متضارب — ثغرات في التسلسل أو أرقام متكررة',
                  'وصف مبهم — "تقديم خدمات" دون تفصيل غير كافٍ',
                  'غياب تاريخ الإصدار — إلزامي وحاسم لتصريحاتك الفصلية',
                  'بيانات عميل ناقصة — لا سيما غياب ICE لعملاء الشركات',
                  'تعديل الفاتورة بعد إرسالها — أصدر دائماً أمر تخفيض وفاتورة جديدة بدلاً من ذلك',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli يُلغي هذه الأخطاء بتصميمه',
                body: 'مع Sayerli، تُولَّد كل فاتورة بجميع البيانات القانونية مُعبَّأةً مسبقاً. الترقيم تلقائي وتسلسلي. لا يمكنك أن تنسى المعرّف الضريبي ولا إشعار الضريبة — فكلاهما مُدرَج بشكل تلقائي. وداعاً لرفض المدفوعات بسبب فاتورة غير مطابقة.',
                href: '/fonctionnalites',
                cta: 'اكتشف جميع المزايا',
              },
            ],
          },
        ],
      },
    },
  },

  // ── ARTICLE 5 ────────────────────────────────────────────────────────────────
  'ir-liberatoire-auto-entrepreneur-maroc': {
    slug: 'ir-liberatoire-auto-entrepreneur-maroc',
    image: '/blog/ir-liberatoire-auto-entrepreneur-maroc.webp',
    readingTime: 6,
    content: {

      // ── FRENCH ──────────────────────────────────────────────────────────────
      fr: {
        title: 'IR libératoire auto-entrepreneur au Maroc : taux, calcul et exonérations',
        description: 'Comprendre l\'impôt sur le revenu libératoire pour les auto-entrepreneurs au Maroc : taux de 1% et 2% selon l\'activité, exonération des 3 premières années, calcul et déclaration trimestrielle.',
        intro: [
          {
            type: 'p',
            text: 'L\'une des questions qui revient le plus souvent chez les auto-entrepreneurs marocains : combien je paie vraiment comme impôts ? La réponse est simple — et c\'est là l\'un des avantages majeurs du statut. L\'impôt sur le revenu dans ce régime s\'appelle l\'IR libératoire. Il est calculé directement sur votre chiffre d\'affaires, sans comptabilité complexe, sans détermination de bénéfice net.',
          },
          {
            type: 'p',
            text: 'Ce guide explique tout ce qu\'il faut savoir : ce que signifie "libératoire", les taux exacts selon votre activité, l\'exonération des 3 premières années, comment calculer ce que vous devez, et comment déclarer. En moins de 10 minutes de lecture, vous aurez une vision claire et complète de votre situation fiscale.',
          },
        ],
        sections: [
          {
            h2: 'Qu\'est-ce que l\'IR libératoire ?',
            blocks: [
              {
                type: 'p',
                text: 'L\'IR libératoire est un impôt sur le revenu à taux fixe, calculé directement sur le chiffre d\'affaires brut encaissé. Le terme "libératoire" signifie que cet impôt vous libère de toute autre obligation déclarative au titre de l\'IR — vous n\'avez pas à déposer une déclaration annuelle de revenu global, ni à déterminer votre bénéfice net, ni à appliquer le barème progressif classique de l\'IR.',
              },
              {
                type: 'p',
                text: 'Concrètement, cela signifie que votre charge fiscale est entièrement transparente et prévisible : vous savez à l\'avance exactement combien vous paierez pour chaque dirham encaissé. Pas de surprise en fin d\'année, pas de calcul complexe.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'IR libératoire vs IR classique',
                body: 'Dans le régime de droit commun, l\'IR est calculé sur le bénéfice net (revenus moins charges) selon un barème progressif allant de 0% à 38%. Dans le régime auto-entrepreneur, l\'IR libératoire se calcule sur le CA brut à un taux fixe — sans tenir compte des charges. C\'est plus simple, mais pas toujours plus avantageux si vous avez beaucoup de charges.',
              },
            ],
          },
          {
            h2: 'Les taux d\'IR libératoire selon votre activité',
            blocks: [
              {
                type: 'p',
                text: 'Les taux d\'IR libératoire varient selon la nature de votre activité. Le législateur a fait le choix de taux très bas pour encourager la formalisation des activités indépendantes au Maroc :',
              },
              {
                type: 'table',
                headers: ['Type d\'activité', 'Taux IR libératoire', 'Exemples'],
                rows: [
                  ['Prestations de services', '2% du CA HT encaissé', 'Développeur, designer, consultant, coach, formateur, traducteur'],
                  ['Activités commerciales', '1% du CA HT encaissé', 'Revente de produits, commerce de détail'],
                  ['Activités artisanales', '1% du CA HT encaissé', 'Menuisier, électricien, plombier, couturier'],
                ],
              },
              {
                type: 'p',
                text: 'Ces taux s\'appliquent sur le chiffre d\'affaires encaissé dans le trimestre — pas sur le bénéfice, pas sur les factures émises. Un prestataire de services qui encaisse 50 000 MAD au deuxième trimestre paie 50 000 × 2% = 1 000 MAD d\'IR libératoire pour ce trimestre.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Ces taux sont parmi les plus bas au monde',
                body: '2% sur le CA pour les services, c\'est une fiscalité extrêmement légère. À titre de comparaison, un salarié marocain imposé au barème progressif peut payer de 10% à 38% de son revenu imposable. Le régime auto-entrepreneur est fiscalement très attractif, notamment en début d\'activité.',
              },
            ],
          },
          {
            h2: 'L\'exonération totale les 3 premières années',
            blocks: [
              {
                type: 'p',
                text: 'Si vous venez de vous inscrire — ou si vous envisagez de le faire — voici l\'information qui change tout : les auto-entrepreneurs marocains bénéficient d\'une exonération totale d\'IR pendant les 36 premiers mois d\'activité, à compter de la date d\'inscription sur le portail.',
              },
              {
                type: 'ul',
                items: [
                  'Durée : 36 mois (3 ans) à compter de la date d\'enregistrement officielle',
                  'Portée : exonération totale — vous déclarez votre CA mais vous ne payez aucun IR libératoire',
                  'Automatique : aucune démarche supplémentaire à effectuer, le portail applique l\'exonération de lui-même',
                  'Non cumulable avec d\'autres régimes d\'exonération IR',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Ce que ça représente concrètement',
                body: 'Un prestataire de services qui génère 200 000 MAD de CA sur ses 3 premières années économise 200 000 × 2% = 4 000 MAD d\'IR. Un commerçant qui génère 500 000 MAD économise 500 000 × 1% = 5 000 MAD. Une vraie aide au démarrage.',
              },
            ],
          },
          {
            h2: 'Comment calculer votre IR libératoire',
            blocks: [
              {
                type: 'p',
                text: 'Le calcul est volontairement simple. Voici la formule :',
              },
              {
                type: 'ul',
                items: [
                  'Déterminez votre CA encaissé sur le trimestre (total des paiements reçus, hors remboursements de frais)',
                  'Multipliez par votre taux : 1% si commerce/artisanat, 2% si services',
                  'Le résultat est votre IR libératoire dû pour ce trimestre',
                  'Si vous êtes encore dans les 3 premières années : résultat = 0 MAD (exonération)',
                ],
              },
              {
                type: 'table',
                headers: ['Activité', 'CA trimestriel', 'Taux', 'IR libératoire dû'],
                rows: [
                  ['Développeur freelance (services)', '40 000 MAD', '2%', '800 MAD'],
                  ['Graphiste (services)', '25 000 MAD', '2%', '500 MAD'],
                  ['Revendeur (commerce)', '80 000 MAD', '1%', '800 MAD'],
                  ['Électricien (artisanat)', '30 000 MAD', '1%', '300 MAD'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Activité mixte : quelle règle ?',
                body: 'Si vous exercez à la fois des activités de services et des activités commerciales, vous devez calculer l\'IR libératoire séparément pour chaque partie : 2% sur le CA services et 1% sur le CA commercial, puis additionner les deux montants.',
              },
            ],
          },
          {
            h2: 'Déclaration et paiement : le calendrier à respecter',
            blocks: [
              {
                type: 'p',
                text: 'L\'IR libératoire se déclare et se paie en même temps que les cotisations CNSS, chaque trimestre, sur portail.auto-entrepreneur.ma. Un seul formulaire, un seul paiement groupé. Voici le calendrier :',
              },
              {
                type: 'table',
                headers: ['Trimestre', 'Période', 'Date limite'],
                rows: [
                  ['T1', 'Janvier — Mars', '30 avril'],
                  ['T2', 'Avril — Juin', '31 juillet'],
                  ['T3', 'Juillet — Septembre', '31 octobre'],
                  ['T4', 'Octobre — Décembre', '31 janvier (N+1)'],
                ],
              },
              {
                type: 'p',
                text: 'Même si votre CA est nul sur un trimestre, la déclaration reste obligatoire. Vous soumettez une déclaration à zéro — l\'IR dû est alors zéro, mais l\'obligation déclarative est remplie. Négliger cette étape peut entraîner des pénalités et des complications lors des déclarations suivantes.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Pénalités de retard',
                body: 'Une déclaration soumise après la date limite entraîne des majorations sur l\'IR dû. Ces pénalités s\'accumulent par mois de retard. Plus tôt vous régularisez, moins la note est salée. En cas de difficulté, contactez votre centre régional des impôts avant l\'échéance.',
              },
            ],
          },
          {
            h2: 'Combien mettre de côté à chaque encaissement ?',
            blocks: [
              {
                type: 'p',
                text: 'La meilleure pratique est de provisionner votre IR libératoire à chaque paiement reçu, avant de dépenser quoi que ce soit. Voici les taux de provision recommandés qui incluent à la fois l\'IR et les cotisations CNSS :',
              },
              {
                type: 'table',
                headers: ['Activité', 'CNSS', 'IR libératoire', 'Total à provisionner'],
                rows: [
                  ['Prestations de services', '10,4%', '2%', '12,4% du CA encaissé'],
                  ['Commerce', '6%', '1%', '7% du CA encaissé'],
                  ['Artisanat', '6%', '1%', '7% du CA encaissé'],
                ],
              },
              {
                type: 'p',
                text: 'Concrètement : pour chaque 10 000 MAD encaissés en tant que prestataire de services, mettez 1 240 MAD de côté dans un compte séparé. Ces fonds ne touchent plus jusqu\'à la déclaration trimestrielle. Ce réflexe simple évite les mauvaises surprises quand l\'échéance arrive.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli calcule votre CA trimestriel automatiquement',
                body: 'Plus besoin d\'additionner vos encaissements manuellement avant chaque déclaration. Sayerli suit vos paiements en temps réel et vous donne le total exact par trimestre pour remplir votre déclaration IR et CNSS en quelques secondes. Essai gratuit, sans carte bancaire.',
                href: '/register',
                cta: 'Essayer Sayerli gratuitement',
              },
            ],
          },
          {
            h2: 'IR libératoire : avantage ou inconvénient par rapport au régime classique ?',
            blocks: [
              {
                type: 'p',
                text: 'La question mérite d\'être posée honnêtement. L\'IR libératoire est avantageux dans la majorité des situations pour un auto-entrepreneur, mais il a ses limites :',
              },
              {
                type: 'table',
                headers: ['Situation', 'IR libératoire', 'IR classique (résultat net)'],
                rows: [
                  ['CA de 150 000 MAD, charges de 20 000 MAD', '150 000 × 2% = 3 000 MAD', 'IR sur 130 000 MAD selon barème — probablement plus élevé'],
                  ['CA de 150 000 MAD, charges de 120 000 MAD', '150 000 × 2% = 3 000 MAD', 'IR sur 30 000 MAD — probablement moins élevé'],
                  ['Activité débutante (< 3 ans)', '0 MAD (exonération totale)', 'Abattement possible mais barème applicable'],
                ],
              },
              {
                type: 'p',
                text: 'La règle générale : si vos charges représentent moins de 80-85% de votre CA, l\'IR libératoire est presque toujours plus avantageux. Si vous avez des charges très élevées (location bureau, matériel coûteux, sous-traitance massive), le régime classique pourrait être plus intéressant — mais il implique une comptabilité complète et une SARL.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Gérez votre activité auto-entrepreneur avec Sayerli',
                body: 'Factures conformes, suivi des paiements, tableau de bord trimestriel, export pour vos déclarations — Sayerli est l\'outil de référence des auto-entrepreneurs et freelancers marocains. Démarrez gratuitement, sans carte bancaire.',
                href: '/fonctionnalites',
                cta: 'Voir toutes les fonctionnalités',
              },
            ],
          },
        ],
      },

      // ── ENGLISH ─────────────────────────────────────────────────────────────
      en: {
        title: 'IR Libératoire for Auto-Entrepreneurs in Morocco: Rates, Calculation and Exemptions',
        description: 'Everything you need to know about the IR libératoire income tax for auto-entrepreneurs in Morocco: 1% and 2% rates by activity, 3-year exemption, quarterly calculation and declaration.',
        intro: [
          {
            type: 'p',
            text: 'One of the most common questions from Moroccan auto-entrepreneurs: how much do I actually pay in taxes? The answer is simple — and that simplicity is one of the major advantages of the status. Income tax in this regime is called the IR libératoire. It is calculated directly on your revenue, with no complex accounting and no need to determine a net profit.',
          },
          {
            type: 'p',
            text: 'This guide covers everything you need to know: what "libératoire" means, the exact rates by activity, the 3-year exemption, how to calculate what you owe, and how to file your declaration. In under 10 minutes of reading, you will have a clear and complete picture of your tax situation.',
          },
        ],
        sections: [
          {
            h2: 'What is the IR libératoire?',
            blocks: [
              {
                type: 'p',
                text: 'The IR libératoire is a flat-rate income tax calculated directly on gross revenue collected. The word "libératoire" means this tax releases you from any other income tax filing obligation — you do not need to file an annual global income declaration, determine a net profit, or apply the standard progressive income tax scale.',
              },
              {
                type: 'p',
                text: 'In practice, this means your tax burden is entirely transparent and predictable: you know in advance exactly how much you will pay for every dirham collected. No year-end surprises, no complex calculations.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'IR libératoire vs standard income tax',
                body: 'Under the standard regime, income tax is calculated on net profit (revenue minus expenses) using a progressive scale from 0% to 38%. Under the auto-entrepreneur regime, the IR libératoire is calculated on gross revenue at a flat rate — without accounting for expenses. It is simpler, but not always more favorable if you have high business costs.',
              },
            ],
          },
          {
            h2: 'IR libératoire rates by activity type',
            blocks: [
              {
                type: 'p',
                text: 'IR libératoire rates vary based on the nature of your activity. The legislature chose very low rates to encourage formalization of independent activities in Morocco:',
              },
              {
                type: 'table',
                headers: ['Activity type', 'IR libératoire rate', 'Examples'],
                rows: [
                  ['Service activities', '2% of collected revenue', 'Developer, designer, consultant, coach, trainer, translator'],
                  ['Commercial activities', '1% of collected revenue', 'Product resale, retail commerce'],
                  ['Craft activities', '1% of collected revenue', 'Carpenter, electrician, plumber, tailor'],
                ],
              },
              {
                type: 'p',
                text: 'These rates apply to revenue collected in the quarter — not profit, not invoices issued. A service provider who collects 50,000 MAD in Q2 pays 50,000 × 2% = 1,000 MAD in IR libératoire for that quarter.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Among the lowest rates in the world',
                body: '2% on revenue for services is an extremely light tax burden. By comparison, a Moroccan salaried employee on the progressive scale can pay 10% to 38% of their taxable income. The auto-entrepreneur regime is fiscally very attractive, especially when starting out.',
              },
            ],
          },
          {
            h2: 'Full exemption for the first 3 years',
            blocks: [
              {
                type: 'p',
                text: 'If you have just registered — or are considering it — here is the information that changes everything: Moroccan auto-entrepreneurs benefit from a full IR exemption for the first 36 months of activity, from the date of registration on the portal.',
              },
              {
                type: 'ul',
                items: [
                  'Duration: 36 months (3 years) from the official registration date',
                  'Scope: total exemption — you declare your revenue but owe zero IR libératoire',
                  'Automatic: no additional steps required, the portal applies the exemption automatically',
                  'Not combinable with other IR exemption schemes',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'What this means in concrete terms',
                body: 'A service provider generating 200,000 MAD in revenue over their first 3 years saves 200,000 × 2% = 4,000 MAD in IR. A trader generating 500,000 MAD saves 500,000 × 1% = 5,000 MAD. A real head-start advantage.',
              },
            ],
          },
          {
            h2: 'How to calculate your IR libératoire',
            blocks: [
              {
                type: 'p',
                text: 'The calculation is deliberately simple. Here is the formula:',
              },
              {
                type: 'ul',
                items: [
                  'Determine your revenue collected during the quarter (total payments received, excluding expense reimbursements)',
                  'Multiply by your rate: 1% for commerce/crafts, 2% for services',
                  'The result is your IR libératoire due for that quarter',
                  'If you are still within the first 3 years: result = 0 MAD (exemption applies)',
                ],
              },
              {
                type: 'table',
                headers: ['Activity', 'Quarterly revenue', 'Rate', 'IR libératoire due'],
                rows: [
                  ['Freelance developer (services)', '40,000 MAD', '2%', '800 MAD'],
                  ['Graphic designer (services)', '25,000 MAD', '2%', '500 MAD'],
                  ['Reseller (commerce)', '80,000 MAD', '1%', '800 MAD'],
                  ['Electrician (craft)', '30,000 MAD', '1%', '300 MAD'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Mixed activity: which rule applies?',
                body: 'If you carry out both service and commercial activities, calculate the IR libératoire separately for each part: 2% on service revenue and 1% on commercial revenue, then add the two amounts together.',
              },
            ],
          },
          {
            h2: 'Declaration and payment: the calendar to follow',
            blocks: [
              {
                type: 'p',
                text: 'The IR libératoire is declared and paid at the same time as your CNSS contributions, quarterly, on portail.auto-entrepreneur.ma. One form, one grouped payment. Here is the calendar:',
              },
              {
                type: 'table',
                headers: ['Quarter', 'Period', 'Deadline'],
                rows: [
                  ['Q1', 'January — March', 'April 30'],
                  ['Q2', 'April — June', 'July 31'],
                  ['Q3', 'July — September', 'October 31'],
                  ['Q4', 'October — December', 'January 31 (following year)'],
                ],
              },
              {
                type: 'p',
                text: 'Even if your revenue is zero for a quarter, the declaration is still mandatory. You submit a zero declaration — IR owed is zero, but the filing obligation is met. Neglecting this step can result in penalties and complications with subsequent declarations.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Late penalties',
                body: 'A declaration submitted after the deadline triggers surcharges on the IR owed. These penalties accumulate per month of delay. The sooner you regularize, the lower the cost. If you are facing difficulties, contact your regional tax centre before the deadline.',
              },
            ],
          },
          {
            h2: 'How much to set aside with each payment received',
            blocks: [
              {
                type: 'p',
                text: 'Best practice is to provision your IR libératoire with every client payment received, before spending anything. Here are the recommended provision rates including both IR and CNSS contributions:',
              },
              {
                type: 'table',
                headers: ['Activity', 'CNSS', 'IR libératoire', 'Total to set aside'],
                rows: [
                  ['Service activities', '10.4%', '2%', '12.4% of revenue collected'],
                  ['Commerce', '6%', '1%', '7% of revenue collected'],
                  ['Crafts', '6%', '1%', '7% of revenue collected'],
                ],
              },
              {
                type: 'p',
                text: 'In practice: for every 10,000 MAD collected as a service provider, set aside 1,240 MAD in a separate account. Do not touch those funds until the quarterly declaration. This simple habit eliminates unpleasant surprises when the deadline arrives.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli calculates your quarterly revenue automatically',
                body: 'No more manual addition of payments before each declaration. Sayerli tracks your payments in real time and gives you the exact quarterly total to fill in your IR and CNSS declaration in seconds. Free trial, no credit card required.',
                href: '/register',
                cta: 'Try Sayerli for free',
              },
            ],
          },
          {
            h2: 'IR libératoire: advantage or drawback vs. the standard regime?',
            blocks: [
              {
                type: 'p',
                text: 'The question deserves an honest answer. The IR libératoire is advantageous in most auto-entrepreneur situations, but it has its limits:',
              },
              {
                type: 'table',
                headers: ['Situation', 'IR libératoire', 'Standard IR (net result)'],
                rows: [
                  ['Revenue 150,000 MAD, expenses 20,000 MAD', '150,000 × 2% = 3,000 MAD', 'IR on 130,000 MAD on progressive scale — likely higher'],
                  ['Revenue 150,000 MAD, expenses 120,000 MAD', '150,000 × 2% = 3,000 MAD', 'IR on 30,000 MAD — likely lower'],
                  ['New activity (< 3 years)', '0 MAD (full exemption)', 'Deductions possible but scale still applies'],
                ],
              },
              {
                type: 'p',
                text: 'General rule: if your expenses represent less than 80–85% of your revenue, the IR libératoire is almost always more favorable. If you have very high costs (office rental, expensive equipment, heavy subcontracting), the standard regime could be more interesting — but it requires full accounting and an SARL structure.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Manage your auto-entrepreneur activity with Sayerli',
                body: 'Compliant invoices, payment tracking, quarterly dashboard, export for your declarations — Sayerli is the reference tool for Moroccan auto-entrepreneurs and freelancers. Start free, no credit card required.',
                href: '/fonctionnalites',
                cta: 'See all features',
              },
            ],
          },
        ],
      },

      // ── ARABIC ──────────────────────────────────────────────────────────────
      ar: {
        title: 'الضريبة على الدخل الجزافية للمقاول الذاتي بالمغرب: النسب والحساب والإعفاءات',
        description: 'كل ما تحتاج معرفته عن الضريبة على الدخل الجزافية للمقاولين الذاتيين بالمغرب: نسبتا 1% و2% حسب النشاط، إعفاء السنوات الثلاث الأولى، الحساب والتصريح الفصلي.',
        intro: [
          {
            type: 'p',
            text: 'من أكثر الأسئلة شيوعاً لدى المقاولين الذاتيين المغاربة: كم أدفع فعلاً من الضرائب؟ الجواب بسيط — وهذه البساطة تُعدّ من أبرز مزايا هذا الوضع. الضريبة على الدخل في هذا النظام تُسمى الضريبة على الدخل الجزافية. تُحسب مباشرةً على رقم أعمالك، دون محاسبة معقدة، ودون الحاجة إلى تحديد الربح الصافي.',
          },
          {
            type: 'p',
            text: 'يشرح هذا الدليل كل ما تحتاج معرفته: معنى "جزافية"، النسب الدقيقة حسب نشاطك، إعفاء السنوات الثلاث الأولى، كيفية حساب ما تدين به، وكيفية التصريح. في أقل من 10 دقائق من القراءة ستمتلك رؤية واضحة وشاملة لوضعيتك الجبائية.',
          },
        ],
        sections: [
          {
            h2: 'ما هي الضريبة على الدخل الجزافية؟',
            blocks: [
              {
                type: 'p',
                text: 'الضريبة على الدخل الجزافية هي ضريبة دخل بنسبة ثابتة تُحسب مباشرةً على رقم الأعمال الإجمالي المحصَّل. وصف "جزافية" يعني أن هذه الضريبة تُعفيك من أي التزام تصريحي آخر يتعلق بضريبة الدخل — فلا حاجة إلى تقديم تصريح سنوي بمجموع الدخل، ولا إلى تحديد الربح الصافي، ولا إلى تطبيق الجدول التصاعدي الكلاسيكي لضريبة الدخل.',
              },
              {
                type: 'p',
                text: 'ذلك يعني عملياً أن عبءك الضريبي شفاف وقابل للتوقع تماماً: تعرف سلفاً بالضبط كم ستدفع عن كل درهم محصَّل. لا مفاجآت في نهاية السنة، لا حسابات معقدة.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'الضريبة الجزافية مقابل ضريبة الدخل الكلاسيكية',
                body: 'في النظام العام، تُحسب ضريبة الدخل على الربح الصافي (المداخيل ناقص المصاريف) وفق جدول تصاعدي يتراوح بين 0% و38%. في نظام المقاول الذاتي، تُحسب الضريبة الجزافية على رقم الأعمال الإجمالي بنسبة ثابتة — دون اعتبار المصاريف. أبسط، لكن ليس دائماً أفضل إذا كانت مصاريفك مرتفعة.',
              },
            ],
          },
          {
            h2: 'نسب الضريبة على الدخل الجزافية حسب نوع النشاط',
            blocks: [
              {
                type: 'p',
                text: 'تتفاوت نسب الضريبة الجزافية تبعاً لطبيعة نشاطك. اختار المشرّع نسباً منخفضة جداً لتشجيع تسوية الأوضاع القانونية للأنشطة المستقلة بالمغرب:',
              },
              {
                type: 'table',
                headers: ['نوع النشاط', 'نسبة الضريبة الجزافية', 'أمثلة'],
                rows: [
                  ['تقديم الخدمات', '2% من رقم الأعمال المحصَّل', 'مطور، مصمم، مستشار، مدرب، مترجم'],
                  ['الأنشطة التجارية', '1% من رقم الأعمال المحصَّل', 'إعادة بيع المنتجات، تجارة التجزئة'],
                  ['الأنشطة الحرفية', '1% من رقم الأعمال المحصَّل', 'نجار، كهربائي، سباك، خياط'],
                ],
              },
              {
                type: 'p',
                text: 'تُطبَّق هذه النسب على رقم الأعمال المحصَّل في الربع — لا على الربح، ولا على الفواتير المُصدَرة. مقدّم خدمات يحصّل 50,000 درهم في الربع الثاني يدفع 50,000 × 2% = 1,000 درهم كضريبة جزافية عن ذلك الربع.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'من بين أدنى النسب في العالم',
                body: '2% على رقم الأعمال للخدمات هو عبء ضريبي خفيف للغاية. للمقارنة، يمكن أن يدفع الأجير المغربي وفق الجدول التصاعدي ما بين 10% و38% من دخله الخاضع للضريبة. نظام المقاول الذاتي جذاب ضريبياً جداً، ولا سيما في بداية النشاط.',
              },
            ],
          },
          {
            h2: 'الإعفاء التام خلال السنوات الثلاث الأولى',
            blocks: [
              {
                type: 'p',
                text: 'إذا كنت قد سجّلت حديثاً — أو تفكر في ذلك — فهذه المعلومة تُغيّر كل شيء: يستفيد المقاولون الذاتيون المغاربة من إعفاء تام من ضريبة الدخل الجزافية خلال الـ 36 شهراً الأولى من النشاط، تُحتسب من تاريخ التسجيل على البوابة.',
              },
              {
                type: 'ul',
                items: [
                  'المدة: 36 شهراً (3 سنوات) من تاريخ التسجيل الرسمي',
                  'النطاق: إعفاء تام — تُصرّح برقم أعمالك لكنك لا تدفع أي ضريبة جزافية',
                  'تلقائي: لا إجراءات إضافية، تُطبّق البوابة الإعفاء من تلقاء نفسها',
                  'غير قابل للجمع مع أنظمة إعفاء أخرى من ضريبة الدخل',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'ما يمثله ذلك فعلياً',
                body: 'مقدّم خدمات يحقق 200,000 درهم من رقم الأعمال خلال سنواته الثلاث الأولى يوفّر 200,000 × 2% = 4,000 درهم من الضريبة. تاجر يحقق 500,000 درهم يوفّر 500,000 × 1% = 5,000 درهم. دعم حقيقي للانطلاق.',
              },
            ],
          },
          {
            h2: 'كيف تحسب ضريبتك الجزافية',
            blocks: [
              {
                type: 'p',
                text: 'الحساب بسيط بشكل مقصود. إليك الصيغة:',
              },
              {
                type: 'ul',
                items: [
                  'حدّد رقم أعمالك المحصَّل خلال الربع (مجموع المدفوعات المستلمة، باستثناء استرداد المصاريف)',
                  'اضربه في نسبتك: 1% للتجارة والحرف، 2% للخدمات',
                  'الناتج هو الضريبة الجزافية المستحقة عن ذلك الربع',
                  'إذا كنت لا تزال في السنوات الثلاث الأولى: الناتج = 0 درهم (الإعفاء سارٍ)',
                ],
              },
              {
                type: 'table',
                headers: ['النشاط', 'رقم الأعمال الفصلي', 'النسبة', 'الضريبة الجزافية المستحقة'],
                rows: [
                  ['مطور مستقل (خدمات)', '40,000 درهم', '2%', '800 درهم'],
                  ['مصمم جرافيك (خدمات)', '25,000 درهم', '2%', '500 درهم'],
                  ['بائع بالتجزئة (تجارة)', '80,000 درهم', '1%', '800 درهم'],
                  ['كهربائي (حرفة)', '30,000 درهم', '1%', '300 درهم'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'نشاط مختلط: أي قاعدة تُطبَّق؟',
                body: 'إذا كنت تمارس أنشطة خدمات وتجارة في آنٍ واحد، احسب الضريبة الجزافية منفصلةً لكل جزء: 2% على رقم أعمال الخدمات و1% على رقم الأعمال التجاري، ثم اجمع المبلغَين.',
              },
            ],
          },
          {
            h2: 'التصريح والأداء: التقويم الواجب احترامه',
            blocks: [
              {
                type: 'p',
                text: 'تُصرَّح الضريبة الجزافية وتُؤدَّى في نفس وقت اشتراكات الصندوق الوطني للضمان الاجتماعي، فصلياً، على بوابة portail.auto-entrepreneur.ma. استمارة واحدة، أداء مجمَّع واحد. إليك التقويم:',
              },
              {
                type: 'table',
                headers: ['الربع', 'الفترة', 'الموعد الأقصى'],
                rows: [
                  ['الربع الأول', 'يناير — مارس', '30 أبريل'],
                  ['الربع الثاني', 'أبريل — يونيو', '31 يوليوز'],
                  ['الربع الثالث', 'يوليوز — شتنبر', '31 أكتوبر'],
                  ['الربع الرابع', 'أكتوبر — دجنبر', '31 يناير (السنة التالية)'],
                ],
              },
              {
                type: 'p',
                text: 'حتى لو كان رقم أعمالك صفراً في ربع ما، يبقى التصريح إلزامياً. تُقدّم تصريحاً بصفر — الضريبة المستحقة تكون صفراً، لكن الالتزام التصريحي يكون قد أُنجز. إهمال هذه الخطوة قد يُفضي إلى غرامات وتعقيدات في التصريحات اللاحقة.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'غرامات التأخير',
                body: 'تصريح مُقدَّم بعد الموعد الأقصى يُرتّب زيادات على الضريبة المستحقة. تتراكم هذه الغرامات شهراً بشهر. كلما أسرعت في التسوية، كانت الفاتورة أخف. إذا واجهت صعوبة، تواصل مع مركزك الجهوي للضرائب قبل حلول الأجل.',
              },
            ],
          },
          {
            h2: 'كم تخصّص من كل مبلغ تحصّله؟',
            blocks: [
              {
                type: 'p',
                text: 'أفضل الممارسات هي تخصيص مبلغ ضريبتك الجزافية عند كل مدفوعات العملاء، قبل إنفاق أي شيء. إليك نسب التخصيص الموصى بها شاملةً الضريبة واشتراكات الصندوق معاً:',
              },
              {
                type: 'table',
                headers: ['النشاط', 'الصندوق الوطني للضمان الاجتماعي', 'الضريبة الجزافية', 'الإجمالي الواجب تخصيصه'],
                rows: [
                  ['تقديم الخدمات', '10.4%', '2%', '12.4% من رقم الأعمال المحصَّل'],
                  ['التجارة', '6%', '1%', '7% من رقم الأعمال المحصَّل'],
                  ['الحرف اليدوية', '6%', '1%', '7% من رقم الأعمال المحصَّل'],
                ],
              },
              {
                type: 'p',
                text: 'عملياً: مقابل كل 10,000 درهم تحصّلها كمقدّم خدمات، خصّص 1,240 درهم في حساب منفصل. لا تمسّ هذا المبلغ حتى موعد التصريح الفصلي. هذه العادة البسيطة تجنّبك المفاجآت غير السارة عند حلول الأجل.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli يحسب رقم أعمالك الفصلي تلقائياً',
                body: 'لا حاجة بعد الآن لجمع مدفوعاتك يدوياً قبل كل تصريح. يتتبع Sayerli مدفوعاتك في الوقت الفعلي ويمنحك الإجمالي الدقيق لكل ربع لتملأ تصريح الضريبة والصندوق في ثوانٍ. تجربة مجانية، بدون بطاقة بنكية.',
                href: '/register',
                cta: 'جرّب Sayerli مجاناً',
              },
            ],
          },
          {
            h2: 'الضريبة الجزافية: ميزة أم عيب مقارنةً بالنظام الكلاسيكي؟',
            blocks: [
              {
                type: 'p',
                text: 'يستحق السؤال إجابةً صريحة. الضريبة الجزافية مفيدة في غالبية حالات المقاول الذاتي، لكنها ليست مثالية في جميع الحالات:',
              },
              {
                type: 'table',
                headers: ['الوضعية', 'الضريبة الجزافية', 'ضريبة الدخل الكلاسيكية (الصافي الحقيقي)'],
                rows: [
                  ['رقم أعمال 150,000 درهم، مصاريف 20,000 درهم', '150,000 × 2% = 3,000 درهم', 'ضريبة على 130,000 درهم وفق الجدول التصاعدي — غالباً أعلى'],
                  ['رقم أعمال 150,000 درهم، مصاريف 120,000 درهم', '150,000 × 2% = 3,000 درهم', 'ضريبة على 30,000 درهم — غالباً أقل'],
                  ['نشاط ناشئ (أقل من 3 سنوات)', '0 درهم (إعفاء تام)', 'تخفيضات ممكنة لكن الجدول التصاعدي يسري'],
                ],
              },
              {
                type: 'p',
                text: 'القاعدة العامة: إذا كانت مصاريفك تمثّل أقل من 80 إلى 85% من رقم أعمالك، فالضريبة الجزافية أفضل في الغالب. إذا كانت لديك مصاريف مرتفعة جداً (إيجار مكتب، معدات باهظة، مناولة مكثّفة)، فقد يكون النظام الكلاسيكي أجدى — لكنه يستلزم محاسبة كاملة وتأسيس شركة ذات مسؤولية محدودة.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'أدِر نشاطك كمقاول ذاتي مع Sayerli',
                body: 'فواتير مطابقة، تتبع المدفوعات، لوحة قيادة فصلية، تصدير لتصريحاتك — Sayerli هو الأداة المرجعية للمقاولين الذاتيين والمستقلين المغاربة. ابدأ مجاناً، بدون بطاقة بنكية.',
                href: '/fonctionnalites',
                cta: 'اكتشف جميع المزايا',
              },
            ],
          },
        ],
      },
    },
  },

  // ── ARTICLE 4 ────────────────────────────────────────────────────────────────
  'cnss-auto-entrepreneur-maroc': {
    slug: 'cnss-auto-entrepreneur-maroc',
    image: '/blog/cnss-auto-entrepreneur-maroc.webp',
    readingTime: 6,
    content: {

      // ── FRENCH ──────────────────────────────────────────────────────────────
      fr: {
        title: 'CNSS auto-entrepreneur au Maroc : cotisations, couverture sociale et déclarations',
        description: 'Tout savoir sur la CNSS pour les auto-entrepreneurs au Maroc : taux de cotisation, couverture AMO, retraite, prestations familiales, et comment faire vos déclarations trimestrielles.',
        intro: [
          {
            type: 'p',
            text: 'Travailler à son compte au Maroc sans couverture sociale, c\'est prendre un risque réel. Un accident, une maladie, quelques semaines sans pouvoir travailler — et sans filet de protection, la situation peut vite devenir critique. C\'est précisément l\'un des problèmes que le régime auto-entrepreneur résout : il donne accès à la CNSS dès le premier dirham de chiffre d\'affaires déclaré.',
          },
          {
            type: 'p',
            text: 'Pourtant, beaucoup d\'auto-entrepreneurs marocains ne comprennent pas vraiment ce qu\'ils paient ni ce qu\'ils reçoivent en retour. Ce guide répond à toutes ces questions : les taux exacts, ce que couvre la CNSS concrètement, comment déclarer, et les erreurs à éviter.',
          },
        ],
        sections: [
          {
            h2: 'Pourquoi la CNSS est obligatoire pour les auto-entrepreneurs',
            blocks: [
              {
                type: 'p',
                text: 'Contrairement aux idées reçues, la CNSS n\'est pas optionnelle pour les auto-entrepreneurs au Maroc. L\'affiliation et les cotisations trimestrielles font partie des obligations légales du régime, au même titre que les déclarations fiscales. En vous inscrivant sur portail.auto-entrepreneur.ma, vous êtes automatiquement affilié à la CNSS.',
              },
              {
                type: 'p',
                text: 'Cette obligation est en réalité une protection. La CNSS vous ouvre droit à trois types de couverture : l\'assurance maladie obligatoire (AMO), la retraite, et les prestations familiales. Pour un indépendant qui n\'a pas d\'employeur pour le protéger, c\'est un filet de sécurité indispensable.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Si vous êtes déjà salarié',
                body: 'Si vous cumulez votre activité auto-entrepreneur avec un emploi salarié pour lequel votre employeur cotise déjà à la CNSS, vous n\'êtes pas obligé de doubler vos cotisations. Contactez votre agence CNSS locale pour confirmer votre situation et éviter de payer deux fois.',
              },
            ],
          },
          {
            h2: 'Les taux de cotisation CNSS selon votre activité',
            blocks: [
              {
                type: 'p',
                text: 'Les cotisations CNSS se calculent en pourcentage de votre chiffre d\'affaires déclaré chaque trimestre. Ce mécanisme est pensé pour être proportionnel : vous payez peu quand vous gagnez peu, plus quand votre activité décolle. Voici les taux en vigueur :',
              },
              {
                type: 'table',
                headers: ['Type d\'activité', 'Taux CNSS sur CA HT déclaré'],
                rows: [
                  ['Activités commerciales', '6%'],
                  ['Activités artisanales', '6%'],
                  ['Prestations de services', '10,4%'],
                ],
              },
              {
                type: 'p',
                text: 'Exemple concret : vous êtes développeur freelance (prestation de services) et vous déclarez 30 000 MAD de CA au premier trimestre. Votre cotisation CNSS sera de 30 000 × 10,4% = 3 120 MAD pour ce trimestre. Si votre CA est nul, la cotisation est nulle — mais la déclaration reste obligatoire.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Base de calcul : CA encaissé, pas facturé',
                body: 'Comme pour l\'IR, la base de calcul des cotisations CNSS est le chiffre d\'affaires effectivement encaissé dans le trimestre, pas les factures émises. Une facture envoyée en mars mais payée en avril compte dans le deuxième trimestre.',
              },
            ],
          },
          {
            h2: 'Ce que couvre concrètement la CNSS auto-entrepreneur',
            blocks: [
              {
                type: 'p',
                text: 'Vos cotisations CNSS ne sont pas une taxe perdue — elles alimentent trois branches de protection sociale auxquelles vous avez droit :',
              },
              {
                type: 'table',
                headers: ['Couverture', 'Ce que ça signifie concrètement'],
                rows: [
                  ['AMO — Assurance Maladie Obligatoire', 'Remboursement partiel des soins médicaux, hospitalisations, médicaments, analyses'],
                  ['Retraite', 'Pension de retraite proportionnelle aux cotisations versées tout au long de votre carrière'],
                  ['Prestations familiales', 'Allocations familiales pour vos enfants à charge (sous conditions de durée de cotisation)'],
                ],
              },
              {
                type: 'p',
                text: 'L\'AMO est souvent la couverture la plus immédiatement utile. Elle vous permet de bénéficier du remboursement d\'une partie de vos dépenses de santé auprès de la CNSS ou via les mutuelles conventionnées. Pour en bénéficier, vous devez être à jour de vos cotisations et avoir cotisé un minimum de trimestres.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'AMO : ouverture des droits',
                body: 'Pour ouvrir vos droits à l\'AMO, vous devez avoir cotisé au moins 54 jours de travail au cours des 6 derniers mois (ou l\'équivalent en trimestres). Une fois les droits ouverts, vous et vos ayants droit (conjoint, enfants) êtes couverts pour les soins.',
              },
            ],
          },
          {
            h2: 'Comment déclarer et payer vos cotisations CNSS',
            blocks: [
              {
                type: 'p',
                text: 'Les déclarations et paiements CNSS se font trimestriellement, en même temps que vos déclarations fiscales auprès de la DGI. Tout se passe sur le même portail : portail.auto-entrepreneur.ma. Le processus est le suivant :',
              },
              {
                type: 'ol',
                items: [
                  'Connectez-vous à portail.auto-entrepreneur.ma avec vos identifiants',
                  'Accédez à la rubrique "Déclaration trimestrielle"',
                  'Saisissez le montant total de votre chiffre d\'affaires encaissé sur le trimestre écoulé',
                  'Le système calcule automatiquement votre cotisation CNSS et votre IR libératoire',
                  'Procédez au paiement en ligne (carte bancaire, virement, ou paiement en agence CNSS)',
                  'Conservez votre reçu de paiement — c\'est votre preuve de mise à jour',
                ],
              },
              {
                type: 'table',
                headers: ['Trimestre', 'Période couverte', 'Date limite de déclaration'],
                rows: [
                  ['T1', 'Janvier — Mars', '30 avril'],
                  ['T2', 'Avril — Juin', '31 juillet'],
                  ['T3', 'Juillet — Septembre', '31 octobre'],
                  ['T4', 'Octobre — Décembre', '31 janvier (année suivante)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'CA nul = déclaration quand même',
                body: 'Si vous n\'avez encaissé aucun chiffre d\'affaires sur un trimestre, vous devez quand même soumettre une déclaration à zéro. L\'omission répétée de déclarations peut entraîner des pénalités et la suspension de vos droits à la couverture sociale.',
              },
            ],
          },
          {
            h2: 'Que se passe-t-il en cas de retard ou d\'impayé ?',
            blocks: [
              {
                type: 'p',
                text: 'Ne pas payer ses cotisations CNSS à temps a des conséquences concrètes, au-delà des simples pénalités :',
              },
              {
                type: 'ul',
                items: [
                  'Pénalités de retard : des majorations s\'appliquent sur les montants dus',
                  'Suspension des droits AMO : votre couverture maladie peut être suspendue tant que votre situation n\'est pas régularisée',
                  'Impact sur la retraite : les trimestres non cotisés ne sont pas validés pour le calcul de votre pension',
                  'Difficultés administratives : certaines démarches (prêts bancaires, renouvellements) nécessitent d\'être à jour CNSS',
                ],
              },
              {
                type: 'p',
                text: 'Si vous avez des arriérés, il est possible de les régulariser progressivement en contactant votre agence CNSS. Des plans d\'apurement existent pour les auto-entrepreneurs en difficulté passagère.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Suivez votre CA trimestriel avec Sayerli',
                body: 'Sayerli calcule automatiquement votre chiffre d\'affaires par trimestre à partir de vos factures encaissées. Plus besoin d\'additionner manuellement — vous arrivez à votre déclaration CNSS avec le bon chiffre, du premier coup. Essai gratuit, sans carte bancaire.',
                href: '/register',
                cta: 'Essayer Sayerli gratuitement',
              },
            ],
          },
          {
            h2: 'Conseils pratiques pour bien gérer vos cotisations',
            blocks: [
              {
                type: 'p',
                text: 'Voici les bonnes pratiques adoptées par les auto-entrepreneurs marocains les mieux organisés :',
              },
              {
                type: 'ul',
                items: [
                  'Provisionnez 10 à 11% de chaque paiement client reçu si vous êtes prestataire de services (10,4% CNSS + 2% IR = ~12,4% au total après la 3e année)',
                  'Gardez un compte bancaire séparé pour votre activité et virez votre provision CNSS/IR à chaque encaissement',
                  'Activez les rappels dans votre agenda pour les 4 dates limites trimestrielles',
                  'Vérifiez chaque année votre relevé de carrière CNSS pour vous assurer que vos trimestres sont bien validés',
                  'En cas de doute, contactez votre agence CNSS — les agents sont habitués aux questions des auto-entrepreneurs',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli : la gestion sereine de votre activité indépendante',
                body: 'Dévis, factures, suivi des paiements, tableau de bord CA par trimestre — Sayerli centralise tout ce dont vous avez besoin pour piloter votre activité auto-entrepreneur et préparer vos déclarations sans stress. Gratuit au démarrage.',
                href: '/fonctionnalites',
                cta: 'Voir toutes les fonctionnalités',
              },
            ],
          },
        ],
      },

      // ── ENGLISH ─────────────────────────────────────────────────────────────
      en: {
        title: 'CNSS for Auto-Entrepreneurs in Morocco: Contributions, Social Coverage and Declarations',
        description: 'Everything you need to know about CNSS for auto-entrepreneurs in Morocco: contribution rates, AMO health insurance, retirement, family benefits, and how to file your quarterly declarations.',
        intro: [
          {
            type: 'p',
            text: 'Working independently in Morocco without social coverage is a real risk. An accident, an illness, a few weeks unable to work — without a safety net, the situation can quickly become critical. This is one of the problems the auto-entrepreneur regime specifically solves: it gives you access to CNSS social security from the very first dirham of declared revenue.',
          },
          {
            type: 'p',
            text: 'Yet many Moroccan auto-entrepreneurs do not really understand what they are paying or what they get in return. This guide answers all those questions: the exact rates, what CNSS actually covers, how to file declarations, and the mistakes to avoid.',
          },
        ],
        sections: [
          {
            h2: 'Why CNSS is mandatory for auto-entrepreneurs',
            blocks: [
              {
                type: 'p',
                text: 'Contrary to popular belief, CNSS is not optional for auto-entrepreneurs in Morocco. Affiliation and quarterly contributions are a legal obligation of the regime, just like tax declarations. By registering on portail.auto-entrepreneur.ma, you are automatically affiliated with the CNSS.',
              },
              {
                type: 'p',
                text: 'This obligation is actually a form of protection. CNSS gives you access to three types of social coverage: mandatory health insurance (AMO), a retirement pension, and family benefits. For a self-employed worker with no employer to protect them, this safety net is essential.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'If you are already a salaried employee',
                body: 'If you combine your auto-entrepreneur activity with a salaried job for which your employer already contributes to CNSS, you are not required to pay twice. Contact your local CNSS branch to confirm your situation and avoid double payment.',
              },
            ],
          },
          {
            h2: 'CNSS contribution rates by activity type',
            blocks: [
              {
                type: 'p',
                text: 'CNSS contributions are calculated as a percentage of your declared quarterly revenue. This mechanism is designed to be proportional: you pay little when you earn little, more as your activity grows. Here are the current rates:',
              },
              {
                type: 'table',
                headers: ['Activity type', 'CNSS rate on declared revenue (excl. VAT)'],
                rows: [
                  ['Commercial activities', '6%'],
                  ['Craft activities', '6%'],
                  ['Service activities', '10.4%'],
                ],
              },
              {
                type: 'p',
                text: 'Concrete example: you are a freelance developer (service activity) and you declare 30,000 MAD in revenue for the first quarter. Your CNSS contribution will be 30,000 × 10.4% = 3,120 MAD for that quarter. If your revenue is zero, the contribution is zero — but the declaration is still mandatory.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Calculation base: collected revenue, not invoiced',
                body: 'As with income tax, CNSS contributions are calculated on revenue actually collected during the quarter, not on invoices issued. An invoice sent in March but paid in April counts in the second quarter.',
              },
            ],
          },
          {
            h2: 'What CNSS actually covers for auto-entrepreneurs',
            blocks: [
              {
                type: 'p',
                text: 'Your CNSS contributions are not a lost tax — they fund three branches of social protection that you have a right to:',
              },
              {
                type: 'table',
                headers: ['Coverage', 'What it means in practice'],
                rows: [
                  ['AMO — Mandatory Health Insurance', 'Partial reimbursement of medical costs, hospitalizations, medication, lab tests'],
                  ['Retirement', 'Pension proportional to contributions paid throughout your career'],
                  ['Family benefits', 'Family allowances for your dependent children (subject to minimum contribution period)'],
                ],
              },
              {
                type: 'p',
                text: 'AMO is often the most immediately useful coverage. It lets you claim partial reimbursement of healthcare expenses through CNSS or affiliated mutual insurance providers. To benefit, you must be up to date on contributions and have contributed for a minimum number of quarters.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'AMO: how rights are activated',
                body: 'To activate your AMO rights, you must have contributed for at least 54 working days in the past 6 months (or the quarterly equivalent). Once rights are open, you and your dependants (spouse, children) are covered for healthcare.',
              },
            ],
          },
          {
            h2: 'How to declare and pay your CNSS contributions',
            blocks: [
              {
                type: 'p',
                text: 'CNSS declarations and payments are made quarterly, at the same time as your tax declarations with the DGI. Everything happens on the same portal: portail.auto-entrepreneur.ma. The process is as follows:',
              },
              {
                type: 'ol',
                items: [
                  'Log in to portail.auto-entrepreneur.ma with your credentials',
                  'Go to the "Quarterly Declaration" section',
                  'Enter the total revenue collected during the past quarter',
                  'The system automatically calculates your CNSS contribution and your IR libératoire',
                  'Pay online (bank card, bank transfer, or in person at a CNSS branch)',
                  'Keep your payment receipt — it is your proof that you are up to date',
                ],
              },
              {
                type: 'table',
                headers: ['Quarter', 'Period covered', 'Declaration deadline'],
                rows: [
                  ['Q1', 'January — March', 'April 30'],
                  ['Q2', 'April — June', 'July 31'],
                  ['Q3', 'July — September', 'October 31'],
                  ['Q4', 'October — December', 'January 31 (following year)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Zero revenue = declaration still required',
                body: 'If you collected no revenue during a quarter, you must still submit a zero declaration. Repeated missed declarations can result in penalties and suspension of your social coverage rights.',
              },
            ],
          },
          {
            h2: 'What happens if you are late or do not pay?',
            blocks: [
              {
                type: 'p',
                text: 'Failing to pay CNSS contributions on time has real consequences beyond simple late fees:',
              },
              {
                type: 'ul',
                items: [
                  'Late penalties: surcharges apply to the amounts owed',
                  'AMO suspension: your health coverage can be suspended until your situation is regularized',
                  'Impact on retirement: quarters without contributions are not validated for pension calculation',
                  'Administrative difficulties: some processes (bank loans, renewals) require proof of CNSS compliance',
                ],
              },
              {
                type: 'p',
                text: 'If you have arrears, it is possible to regularize them gradually by contacting your CNSS branch. Payment plans exist for auto-entrepreneurs going through a temporary difficult period.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Track your quarterly revenue with Sayerli',
                body: 'Sayerli automatically calculates your revenue by quarter from your collected invoices. No more manual additions — you arrive at your CNSS declaration with the right figure, first time. Free trial, no credit card required.',
                href: '/register',
                cta: 'Try Sayerli for free',
              },
            ],
          },
          {
            h2: 'Practical tips for managing your contributions well',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Set aside 10 to 11% of every client payment received if you are a service provider (10.4% CNSS + 2% IR = ~12.4% total after year 3)',
                  'Keep a separate bank account for your activity and transfer your CNSS/IR provision with each payment received',
                  'Set calendar reminders for all 4 quarterly deadlines',
                  'Check your CNSS career statement each year to confirm your quarters are properly validated',
                  'When in doubt, contact your CNSS branch — agents are used to auto-entrepreneur questions',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli: stress-free management of your independent activity',
                body: 'Quotes, invoices, payment tracking, quarterly revenue dashboard — Sayerli centralizes everything you need to run your auto-entrepreneur activity and prepare your declarations without hassle. Free to start.',
                href: '/fonctionnalites',
                cta: 'See all features',
              },
            ],
          },
        ],
      },

      // ── ARABIC ──────────────────────────────────────────────────────────────
      ar: {
        title: 'الصندوق الوطني للضمان الاجتماعي للمقاول الذاتي بالمغرب: الاشتراكات والتغطية والتصريحات',
        description: 'كل ما تحتاج معرفته عن الصندوق الوطني للضمان الاجتماعي للمقاولين الذاتيين بالمغرب: نسب الاشتراك، التأمين الصحي الإلزامي، التقاعد، التعويضات العائلية، وكيفية إنجاز تصريحاتك الفصلية.',
        intro: [
          {
            type: 'p',
            text: 'العمل المستقل بالمغرب دون تغطية اجتماعية مجازفة حقيقية. حادثة، مرض، أسابيع من العجز عن العمل — وبدون شبكة حماية، قد يتحول الوضع إلى أزمة بسرعة. هذا تحديداً ما يحله نظام المقاول الذاتي: فهو يمنحك حق الانخراط في الصندوق الوطني للضمان الاجتماعي منذ أول درهم من رقم الأعمال المصرَّح به.',
          },
          {
            type: 'p',
            text: 'غير أن كثيراً من المقاولين الذاتيين المغاربة لا يفهمون حقاً ما يدفعونه ولا ما يحصلون عليه في المقابل. هذا الدليل يجيب عن جميع هذه الأسئلة: النسب الدقيقة، ما تشمله التغطية فعلياً، كيفية التصريح، والأخطاء الواجب تجنبها.',
          },
        ],
        sections: [
          {
            h2: 'لماذا الانخراط في الصندوق الوطني للضمان الاجتماعي إلزامي للمقاولين الذاتيين',
            blocks: [
              {
                type: 'p',
                text: 'خلافاً للاعتقاد الشائع، لا يُعدّ الانخراط في الصندوق الوطني للضمان الاجتماعي اختيارياً للمقاولين الذاتيين بالمغرب. الانخراط والاشتراكات الفصلية التزام قانوني ضمن النظام، شأنه شأن التصريحات الضريبية. بمجرد تسجيلك على بوابة portail.auto-entrepreneur.ma، تُنخرط تلقائياً في الصندوق الوطني للضمان الاجتماعي.',
              },
              {
                type: 'p',
                text: 'هذا الالتزام هو في حقيقته حماية. يمنحك الصندوق الوطني للضمان الاجتماعي الحق في ثلاثة أنواع من التغطية الاجتماعية: التأمين الصحي الإلزامي، التقاعد، والتعويضات العائلية. لمستقل لا يوجد صاحب عمل يحميه، هذا الأمان الاجتماعي لا غنى عنه.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'إذا كنت أجيراً في نفس الوقت',
                body: 'إذا كنت تجمع بين نشاطك كمقاول ذاتي وعمل مأجور يؤدي فيه صاحب العمل اشتراكات الصندوق الوطني للضمان الاجتماعي عنك، فلست ملزماً بالازدواج في الاشتراكات. تواصل مع وكالة الصندوق المحلية لتأكيد وضعك وتجنب الدفع مرتين.',
              },
            ],
          },
          {
            h2: 'نسب اشتراكات الصندوق الوطني للضمان الاجتماعي حسب نوع النشاط',
            blocks: [
              {
                type: 'p',
                text: 'تُحسب اشتراكات الصندوق الوطني للضمان الاجتماعي بنسبة مئوية من رقم أعمالك المصرَّح به كل فصل. هذه الآلية مُصمَّمة لتكون تناسبية: تدفع القليل حين تكسب القليل، وأكثر كلما توسّع نشاطك. إليك النسب المعمول بها:',
              },
              {
                type: 'table',
                headers: ['نوع النشاط', 'نسبة الاشتراك في الصندوق على رقم الأعمال المصرَّح به'],
                rows: [
                  ['الأنشطة التجارية', '6%'],
                  ['الأنشطة الحرفية', '6%'],
                  ['تقديم الخدمات', '10.4%'],
                ],
              },
              {
                type: 'p',
                text: 'مثال عملي: أنت مطور مستقل (تقديم خدمات) وتُصرّح بـ 30,000 درهم من رقم الأعمال في الربع الأول. اشتراكك في الصندوق الوطني للضمان الاجتماعي سيكون: 30,000 × 10.4% = 3,120 درهم لذلك الربع. إذا كان رقم أعمالك صفراً، يكون الاشتراك صفراً — لكن التصريح يبقى إلزامياً.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'أساس الحساب: رقم الأعمال المحصَّل لا المُفوتَر',
                body: 'كما هو الحال مع الضريبة على الدخل، يُحسب اشتراك الصندوق الوطني للضمان الاجتماعي على أساس رقم الأعمال المحصَّل فعلاً خلال الفصل، لا على الفواتير المُصدَرة. فاتورة أُرسلت في مارس لكن سُدِّدت في أبريل تُحسب في الربع الثاني.',
              },
            ],
          },
          {
            h2: 'ما تشمله تغطية الصندوق الوطني للضمان الاجتماعي للمقاول الذاتي فعلياً',
            blocks: [
              {
                type: 'p',
                text: 'اشتراكاتك في الصندوق الوطني للضمان الاجتماعي ليست ضريبة مفقودة — بل تُموِّل ثلاثة فروع من الحماية الاجتماعية التي تحق لك:',
              },
              {
                type: 'table',
                headers: ['التغطية', 'ما تعنيه فعلياً'],
                rows: [
                  ['التأمين الصحي الإلزامي (AMO)', 'استرداد جزئي لتكاليف الرعاية الطبية والاستشفاء والأدوية والتحاليل'],
                  ['التقاعد', 'معاش تقاعدي متناسب مع الاشتراكات المؤداة طوال مسيرتك المهنية'],
                  ['التعويضات العائلية', 'تعويضات عائلية لأطفالك المعالين (بشرط مدة اشتراك أدنى)'],
                ],
              },
              {
                type: 'p',
                text: 'التأمين الصحي الإلزامي هو في الغالب التغطية الأكثر فائدة على المدى القريب. يتيح لك استرداد جزء من نفقات الرعاية الصحية لدى الصندوق أو المؤسسات التكميلية المتعاقدة معه. للاستفادة منه يجب أن تكون في وضعية منتظمة من حيث الاشتراكات وأن تكون قد اشتركت عدداً أدنى من الأرباع.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'فتح حقوق التأمين الصحي الإلزامي',
                body: 'لفتح حقوقك في التأمين الصحي الإلزامي، يجب أن تكون قد اشتركت ما لا يقل عن 54 يوم عمل خلال الأشهر الستة الأخيرة (أو ما يعادلها من الأرباع). بمجرد فتح هذه الحقوق، أنت ومن تعولهم (الزوج/الزوجة، الأطفال) مشمولون بالتغطية الصحية.',
              },
            ],
          },
          {
            h2: 'كيفية التصريح وأداء اشتراكاتك في الصندوق',
            blocks: [
              {
                type: 'p',
                text: 'تُنجز تصريحات وأداءات الصندوق الوطني للضمان الاجتماعي فصلياً، في نفس وقت تصريحاتك الضريبية لدى المديرية العامة للضرائب. كل شيء يتم على نفس البوابة: portail.auto-entrepreneur.ma. وإليك مسار الإجراء:',
              },
              {
                type: 'ol',
                items: [
                  'سجّل الدخول إلى portail.auto-entrepreneur.ma ببيانات حسابك',
                  'توجّه إلى خانة "التصريح الفصلي"',
                  'أدخل المبلغ الإجمالي لرقم الأعمال المحصَّل خلال الربع المنقضي',
                  'يحسب النظام تلقائياً اشتراكك في الصندوق والضريبة على الدخل الجزافية',
                  'أدِّ الاشتراك إلكترونياً (بطاقة بنكية، تحويل، أو حضورياً في وكالة الصندوق)',
                  'احتفظ بوصل الأداء — فهو دليلك على أنك في وضعية انتظام',
                ],
              },
              {
                type: 'table',
                headers: ['الربع', 'الفترة المشمولة', 'الموعد الأقصى للتصريح'],
                rows: [
                  ['الربع الأول', 'يناير — مارس', '30 أبريل'],
                  ['الربع الثاني', 'أبريل — يونيو', '31 يوليوز'],
                  ['الربع الثالث', 'يوليوز — شتنبر', '31 أكتوبر'],
                  ['الربع الرابع', 'أكتوبر — دجنبر', '31 يناير (السنة التالية)'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'رقم أعمال صفر = تصريح إلزامي على أي حال',
                body: 'إذا لم تحصّل أي رقم أعمال خلال ربع ما، يجب عليك رغم ذلك تقديم تصريح بصفر. تكرار إغفال التصريحات قد يُفضي إلى غرامات وتعليق حقوقك في التغطية الاجتماعية.',
              },
            ],
          },
          {
            h2: 'ماذا يحدث في حالة التأخر أو عدم الأداء؟',
            blocks: [
              {
                type: 'p',
                text: 'عدم أداء اشتراكات الصندوق في الوقت المحدد له تداعيات ملموسة تتجاوز مجرد الغرامات:',
              },
              {
                type: 'ul',
                items: [
                  'غرامات التأخير: زيادات تُطبَّق على المبالغ المستحقة',
                  'تعليق التأمين الصحي الإلزامي: قد تُوقَف تغطيتك الصحية إلى حين تسوية وضعيتك',
                  'تأثير على التقاعد: الأرباع غير المؤدى عنها لا تُحتسب في حساب معاشك',
                  'عراقيل إدارية: بعض الإجراءات (القروض البنكية، التجديدات) تشترط انتظام الوضعية لدى الصندوق',
                ],
              },
              {
                type: 'p',
                text: 'في حال وجود متأخرات، يمكن تسويتها تدريجياً بالتواصل مع وكالة الصندوق الوطني للضمان الاجتماعي. تتوفر خطط تقسيط للمقاولين الذاتيين الذين يمرون بصعوبات مؤقتة.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'تتبّع رقم أعمالك الفصلي مع Sayerli',
                body: 'يحسب Sayerli تلقائياً رقم أعمالك حسب كل ربع انطلاقاً من فواتيرك المحصَّلة. لا حاجة لأي جمع يدوي — ستصل إلى تصريحك لدى الصندوق بالرقم الصحيح من المرة الأولى. تجربة مجانية، بدون بطاقة بنكية.',
                href: '/register',
                cta: 'جرّب Sayerli مجاناً',
              },
            ],
          },
          {
            h2: 'نصائح عملية لإدارة اشتراكاتك بشكل جيد',
            blocks: [
              {
                type: 'ul',
                items: [
                  'خصّص 10 إلى 11% من كل مدفوعات العملاء إذا كنت مقدّم خدمات (10.4% للصندوق + 2% ضريبة على الدخل = ~12.4% إجمالاً بعد السنة الثالثة)',
                  'احتفظ بحساب بنكي منفصل لنشاطك وحوّل مخصص الصندوق والضريبة عند كل تحصيل',
                  'فعّل التذكيرات في مفكرتك للمواعيد الأربعة الفصلية',
                  'راجع بيان مسيرتك المهنية لدى الصندوق الوطني للضمان الاجتماعي كل سنة للتحقق من أن أربعك مُعتمَدة',
                  'في حال الشك، تواصل مع وكالة الصندوق — الموظفون معتادون على أسئلة المقاولين الذاتيين',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli: التسيير الهادئ لنشاطك المستقل',
                body: 'عروض أسعار، فواتير، تتبع المدفوعات، لوحة قيادة رقم الأعمال الفصلي — Sayerli يجمع كل ما تحتاجه لإدارة نشاطك كمقاول ذاتي وتحضير تصريحاتك بدون توتر. مجاني للبدء.',
                href: '/fonctionnalites',
                cta: 'اكتشف جميع المزايا',
              },
            ],
          },
        ],
      },
    },
  },

  // ── ARTICLE 3 ────────────────────────────────────────────────────────────────
  'inscription-auto-entrepreneur-maroc': {
    slug: 'inscription-auto-entrepreneur-maroc',
    image: '/blog/inscription-auto-entrepreneur-maroc.webp',
    readingTime: 7,
    content: {

      // ── FRENCH ──────────────────────────────────────────────────────────────
      fr: {
        title: 'Comment s\'inscrire comme auto-entrepreneur au Maroc : démarches, documents, RC et patente',
        description: 'Guide complet pour s\'inscrire comme auto-entrepreneur au Maroc : documents à fournir, inscription sur le portail officiel, RC, patente (taxe professionnelle) et identifiant fiscal.',
        intro: [
          {
            type: 'p',
            text: 'Vous avez décidé de vous lancer comme auto-entrepreneur au Maroc. Maintenant, la vraie question : comment faire concrètement ? Quel portail ? Quels documents ? Et qu\'en est-il du Registre de Commerce et de la patente dont tout le monde parle ? Ces questions reviennent constamment, et pour cause — la confusion entre les démarches des différents statuts juridiques est réelle.',
          },
          {
            type: 'p',
            text: 'La bonne nouvelle : le régime auto-entrepreneur a été conçu précisément pour simplifier tout ça. Dans ce guide, on couvre les démarches étape par étape, les documents exacts à préparer, et on clarifie définitivement les questions sur le RC et la patente — deux notions souvent mal comprises pour ce statut.',
          },
        ],
        sections: [
          {
            h2: 'Les documents à préparer avant de commencer',
            blocks: [
              {
                type: 'p',
                text: 'L\'un des atouts majeurs du régime auto-entrepreneur est la légèreté du dossier. Contrairement à la création d\'une SARL qui nécessite statuts, capital social et acte notarié, l\'inscription auto-entrepreneur ne demande que quelques informations de base. Voici ce dont vous aurez besoin :',
              },
              {
                type: 'ul',
                items: [
                  'Carte Nationale d\'Identité (CIN) — le numéro est saisi en ligne, aucun scan n\'est envoyé pour la plupart des activités',
                  'Adresse email valide — c\'est là que vous recevrez votre attestation d\'inscription et votre identifiant fiscal',
                  'Numéro de téléphone marocain — pour la vérification du compte',
                  'Adresse postale complète — votre adresse personnelle fait office d\'adresse professionnelle au départ',
                  'Description de votre activité — préparez 2 à 3 lignes décrivant précisément ce que vous faites',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Activités nécessitant des pièces supplémentaires',
                body: 'Certaines activités réglementées (transport, vente de médicaments, activités nécessitant une autorisation de la commune) peuvent demander des documents complémentaires. Le portail vous en informe au moment de choisir votre activité. Pour les services intellectuels — développement, design, conseil, formation — aucune pièce supplémentaire n\'est requise.',
              },
            ],
          },
          {
            h2: 'L\'inscription pas à pas sur le portail officiel',
            blocks: [
              {
                type: 'p',
                text: 'L\'inscription se fait exclusivement en ligne sur portail.auto-entrepreneur.ma — le portail officiel géré conjointement par la CNSS et la Direction Générale des Impôts (DGI). Voici les étapes dans l\'ordre exact :',
              },
              {
                type: 'ol',
                items: [
                  'Accédez à portail.auto-entrepreneur.ma et cliquez sur "S\'inscrire"',
                  'Créez votre compte : email, mot de passe, et vérification par SMS',
                  'Renseignez vos informations personnelles : numéro de CIN, prénom, nom, date et lieu de naissance',
                  'Saisissez votre adresse complète (elle servira d\'adresse d\'activité)',
                  'Sélectionnez votre secteur d\'activité dans la liste déroulante, puis votre activité précise',
                  'Décrivez votre activité en quelques lignes dans le champ libre prévu à cet effet',
                  'Relisez et validez votre dossier — vous pouvez sauvegarder et revenir plus tard',
                  'Soumettez votre demande : un numéro de dossier vous est attribué immédiatement',
                  'Attendez la confirmation par email : vous recevrez votre attestation d\'inscription et votre IF (Identifiant Fiscal)',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Délai réel de traitement',
                body: 'La grande majorité des dossiers complets sont traités en 24 à 48 heures ouvrables. Certains retours ont été constatés le jour même. Si votre activité nécessite une vérification supplémentaire, le délai peut aller jusqu\'à 5 jours ouvrables. Aucun passage en agence n\'est requis pour les activités de services classiques.',
              },
            ],
          },
          {
            h2: 'RC (Registre de Commerce) : l\'auto-entrepreneur en est-il dispensé ?',
            blocks: [
              {
                type: 'p',
                text: 'C\'est l\'une des questions les plus fréquentes — et la réponse est claire : les auto-entrepreneurs ne sont pas tenus de s\'inscrire au Registre de Commerce (RC). Le RC est une obligation réservée aux sociétés commerciales (SARL, SA, SARLAU) et aux commerçants personnes physiques relevant du régime de droit commun.',
              },
              {
                type: 'p',
                text: 'Le régime auto-entrepreneur dispose de son propre système d\'enregistrement via le portail national. L\'attestation d\'inscription délivrée à l\'issue de la procédure remplace le RC pour toutes vos démarches administratives et commerciales courantes.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Attention aux demandes de certains clients',
                body: 'Certains donneurs d\'ordre — notamment les grandes entreprises ou les administrations publiques — demandent parfois un numéro RC dans leurs formulaires de référencement fournisseur. Dans ce cas, vous pouvez fournir votre attestation d\'inscription auto-entrepreneur et votre Identifiant Fiscal. Si un client exige impérativement un RC, il faudra envisager la création d\'une SARL pour travailler avec lui.',
              },
              {
                type: 'table',
                headers: ['Démarche', 'Auto-entrepreneur', 'SARL / Commerçant'],
                rows: [
                  ['Registre de Commerce (RC)', 'Non requis', 'Obligatoire'],
                  ['Portail auto-entrepreneur.ma', 'Obligatoire', 'Non applicable'],
                  ['Identifiant Fiscal (IF)', 'Attribué automatiquement', 'Obtenu à la DGI'],
                  ['Acte notarié / Statuts', 'Non requis', 'Obligatoires'],
                  ['Capital social minimum', 'Aucun', '1 MAD (SARL)'],
                ],
              },
            ],
          },
          {
            h2: 'Patente et taxe professionnelle : ce qu\'il faut savoir',
            blocks: [
              {
                type: 'p',
                text: 'La "patente" — officiellement rebaptisée "taxe professionnelle" depuis la réforme fiscale — est souvent source de confusion pour les auto-entrepreneurs. Voici la règle exacte :',
              },
              {
                type: 'ul',
                items: [
                  'Exonération totale pendant les 5 premières années d\'activité à compter de la date d\'inscription',
                  'Après 5 ans : assujettissement à la taxe professionnelle aux taux normaux applicables à votre activité',
                  'La déclaration et le paiement se font auprès de votre centre régional des impôts (CRI)',
                  'En pratique : pour la grande majorité des auto-entrepreneurs en début d\'activité, la taxe professionnelle ne s\'applique tout simplement pas encore',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Triple exonération les premières années',
                body: 'En cumulant l\'exonération d\'IR (3 ans), l\'exonération de taxe professionnelle / patente (5 ans) et l\'exonération de TVA (permanente pour ce régime), un auto-entrepreneur en début d\'activité ne paie pratiquement aucune charge fiscale directe — uniquement les cotisations CNSS proportionnelles à son CA déclaré.',
              },
            ],
          },
          {
            h2: 'Votre identifiant fiscal (IF) : à quoi sert-il et où le mettre ?',
            blocks: [
              {
                type: 'p',
                text: 'À l\'issue de votre inscription, vous recevez par email votre Identifiant Fiscal (IF) — un numéro unique attribué par la Direction Générale des Impôts. C\'est votre numéro d\'identification fiscale officiel en tant qu\'auto-entrepreneur. Il est indispensable sur chacune de vos factures.',
              },
              {
                type: 'ul',
                items: [
                  'Sur toutes vos factures : mention obligatoire "IF n° XXXXXXXX" dans l\'en-tête',
                  'Pour vos déclarations trimestrielles de CA auprès de la DGI',
                  'Pour vos cotisations CNSS trimestrielles',
                  'Pour ouvrir un compte professionnel auprès de certaines banques',
                  'Pour tout justificatif de statut légal demandé par un partenaire ou client',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Vos factures conformes avec votre IF, en 2 minutes',
                body: 'Sayerli génère automatiquement des factures avec toutes les mentions légales obligatoires : votre IF, votre adresse, la mention d\'exonération TVA, et la numérotation séquentielle. Aucun risque d\'oubli, aucune erreur. Essai gratuit, sans carte bancaire.',
                href: '/register',
                cta: 'Créer mon compte gratuit',
              },
            ],
          },
          {
            h2: 'Après l\'inscription : ce que vous pouvez faire immédiatement',
            blocks: [
              {
                type: 'p',
                text: 'Dès réception de votre attestation d\'inscription et de votre IF, vous pouvez légalement commencer votre activité. Voici ce que vous pouvez — et devez — mettre en place dès le premier jour :',
              },
              {
                type: 'ol',
                items: [
                  'Émettre des factures conformes avec votre IF et la mention d\'exonération TVA',
                  'Ouvrir un compte bancaire dédié à votre activité (fortement recommandé — pas obligatoire légalement, mais indispensable en pratique)',
                  'Commencer à enregistrer vos encaissements pour votre déclaration trimestrielle',
                  'Vous affilier à la CNSS si ce n\'est pas fait automatiquement (certaines inscriptions en ligne le font d\'office)',
                  'Préparer votre première déclaration trimestrielle pour la période en cours',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Ne manquez pas votre première déclaration',
                body: 'Les déclarations trimestrielles sont obligatoires même si votre CA est nul. Les dates limites sont : 31 janvier (T4 N-1), 30 avril (T1), 31 juillet (T2), 31 octobre (T3). Une déclaration tardive ou oubliée peut entraîner des pénalités. Notez ces dates dans votre agenda dès maintenant.',
              },
            ],
          },
          {
            h2: 'Les erreurs fréquentes à éviter lors de l\'inscription',
            blocks: [
              {
                type: 'p',
                text: 'Après avoir accompagné de nombreux indépendants marocains dans leurs démarches, voici les erreurs les plus courantes à éviter absolument :',
              },
              {
                type: 'ul',
                items: [
                  'Choisir une activité trop vague ou trop large — soyez précis, ça facilite le traitement et protège en cas de contrôle',
                  'Utiliser une adresse email temporaire ou peu consultée — tous vos documents officiels y seront envoyés',
                  'Ne pas conserver votre attestation d\'inscription — téléchargez-la et gardez-la en lieu sûr',
                  'Oublier de noter les dates de déclaration trimestrielle dès le départ',
                  'Facturer avant d\'avoir reçu votre IF — attendez la confirmation officielle',
                  'Confondre votre IF auto-entrepreneur avec un numéro RC — ce sont deux choses différentes',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli : l\'outil pensé pour les auto-entrepreneurs marocains',
                body: 'Devis professionnels, factures conformes avec IF et mentions légales, suivi des paiements, tableau de bord CA — tout ce dont vous avez besoin pour gérer votre activité sans erreur dès le premier jour. Gratuit au démarrage, sans carte bancaire.',
                href: '/fonctionnalites',
                cta: 'Voir toutes les fonctionnalités',
              },
            ],
          },
        ],
      },

      // ── ENGLISH ─────────────────────────────────────────────────────────────
      en: {
        title: 'How to Register as an Auto-Entrepreneur in Morocco: Steps, Documents, RC and Patente',
        description: 'Complete guide to registering as an auto-entrepreneur in Morocco: required documents, step-by-step registration on the official portal, the RC (trade register), and the patente (professional tax).',
        intro: [
          {
            type: 'p',
            text: 'You have decided to start as an auto-entrepreneur in Morocco. Now the real question: what do you actually do? Which portal? What documents? And what about the Registre de Commerce and the patente that everyone mentions? These questions come up constantly — and for good reason. Confusion between the requirements for different legal statuses is widespread.',
          },
          {
            type: 'p',
            text: 'The good news: the auto-entrepreneur regime was designed specifically to cut through all that complexity. In this guide we cover the process step by step, the exact documents to prepare, and we clarify once and for all the questions around the RC and the patente — two concepts that are frequently misunderstood for this status.',
          },
        ],
        sections: [
          {
            h2: 'Documents to prepare before you start',
            blocks: [
              {
                type: 'p',
                text: 'One of the biggest advantages of the auto-entrepreneur regime is how light the application is. Unlike creating an SARL — which requires articles of association, share capital, and a notarial deed — auto-entrepreneur registration only needs a few basic pieces of information:',
              },
              {
                type: 'ul',
                items: [
                  'National Identity Card (CIN) — the number is entered online; no scan is required for most activities',
                  'Valid email address — this is where you will receive your registration certificate and tax identifier',
                  'Moroccan phone number — for account verification',
                  'Full postal address — your personal address serves as your professional address initially',
                  'Description of your activity — prepare 2–3 lines describing precisely what you do',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Activities requiring extra documents',
                body: 'Some regulated activities (transport, pharmaceutical sales, activities requiring a municipal permit) may require additional documents. The portal notifies you when you select your activity type. For intellectual services — development, design, consulting, training — no additional documents are needed.',
              },
            ],
          },
          {
            h2: 'Step-by-step registration on the official portal',
            blocks: [
              {
                type: 'p',
                text: 'Registration is done exclusively online at portail.auto-entrepreneur.ma — the official portal managed jointly by the CNSS and the Direction Générale des Impôts (DGI). Here are the exact steps in order:',
              },
              {
                type: 'ol',
                items: [
                  'Go to portail.auto-entrepreneur.ma and click "S\'inscrire" (Register)',
                  'Create your account: email, password, and SMS verification',
                  'Enter your personal details: CIN number, first name, last name, date and place of birth',
                  'Enter your full address (it will serve as your business address)',
                  'Select your activity sector from the dropdown, then your specific activity',
                  'Describe your activity in a few lines in the free-text field provided',
                  'Review and confirm your application — you can save and return later',
                  'Submit your application: a file number is assigned to you immediately',
                  'Wait for email confirmation: you will receive your registration certificate and your Tax Identifier (IF)',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Real processing time',
                body: 'The vast majority of complete applications are processed within 24 to 48 business hours. Some responses have been received the same day. If your activity requires additional verification, processing can take up to 5 business days. No visit to an office is required for standard service activities.',
              },
            ],
          },
          {
            h2: 'RC (Registre de Commerce): are auto-entrepreneurs exempt?',
            blocks: [
              {
                type: 'p',
                text: 'This is one of the most common questions — and the answer is clear: auto-entrepreneurs are not required to register with the Registre de Commerce (RC). The RC is an obligation reserved for commercial companies (SARL, SA, SARLAU) and individual traders operating under the standard legal regime.',
              },
              {
                type: 'p',
                text: 'The auto-entrepreneur regime has its own registration system via the national portal. The registration certificate issued at the end of the process replaces the RC for all your standard administrative and commercial dealings.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Watch out for client requests',
                body: 'Some clients — especially large companies or public administrations — may ask for an RC number in their supplier registration forms. In that case, you can provide your auto-entrepreneur registration certificate and your Tax Identifier (IF). If a client strictly requires an RC, you will need to consider creating an SARL to work with them.',
              },
              {
                type: 'table',
                headers: ['Requirement', 'Auto-entrepreneur', 'SARL / Trader'],
                rows: [
                  ['Registre de Commerce (RC)', 'Not required', 'Mandatory'],
                  ['portail.auto-entrepreneur.ma', 'Mandatory', 'Not applicable'],
                  ['Tax Identifier (IF)', 'Assigned automatically', 'Obtained from DGI'],
                  ['Articles of association', 'Not required', 'Mandatory'],
                  ['Minimum share capital', 'None', '1 MAD (SARL)'],
                ],
              },
            ],
          },
          {
            h2: 'Patente and professional tax: what you need to know',
            blocks: [
              {
                type: 'p',
                text: 'The "patente" — officially renamed "taxe professionnelle" (professional tax) — is often a source of confusion for auto-entrepreneurs. Here is the exact rule:',
              },
              {
                type: 'ul',
                items: [
                  'Full exemption for the first 5 years of activity from the registration date',
                  'After 5 years: subject to professional tax at the standard rates applicable to your activity',
                  'Declaration and payment are made at your regional tax centre (CRI)',
                  'In practice: for the vast majority of auto-entrepreneurs just starting out, the professional tax simply does not apply yet',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Triple exemption in the early years',
                body: 'Combining the IR exemption (3 years), the patente/professional tax exemption (5 years), and the permanent VAT exemption, an auto-entrepreneur starting out pays virtually no direct tax — only the CNSS contributions proportional to their declared revenue.',
              },
            ],
          },
          {
            h2: 'Your Tax Identifier (IF): what it is and where to use it',
            blocks: [
              {
                type: 'p',
                text: 'At the end of your registration, you receive your Tax Identifier (IF) by email — a unique number assigned by the Direction Générale des Impôts. This is your official tax identification number as an auto-entrepreneur. It is mandatory on every invoice you issue.',
              },
              {
                type: 'ul',
                items: [
                  'On all your invoices: mandatory mention "IF No. XXXXXXXX" in the header',
                  'For your quarterly revenue declarations to the DGI',
                  'For your quarterly CNSS contributions',
                  'To open a professional bank account with some banks',
                  'For any proof of legal status requested by a partner or client',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Compliant invoices with your IF, in 2 minutes',
                body: 'Sayerli automatically generates invoices with all mandatory legal mentions: your IF, your address, the VAT exemption notice, and sequential numbering. No risk of forgetting anything, no errors. Free trial, no credit card required.',
                href: '/register',
                cta: 'Create my free account',
              },
            ],
          },
          {
            h2: 'After registration: what you can do immediately',
            blocks: [
              {
                type: 'p',
                text: 'As soon as you receive your registration certificate and your IF, you can legally begin your activity. Here is what you can — and should — put in place from day one:',
              },
              {
                type: 'ol',
                items: [
                  'Issue compliant invoices with your IF and the VAT exemption notice',
                  'Open a dedicated bank account for your activity (strongly recommended — not legally required, but essential in practice)',
                  'Start recording your collected payments for your quarterly declaration',
                  'Register with the CNSS if not done automatically during the online registration',
                  'Prepare your first quarterly declaration for the current period',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Do not miss your first declaration',
                body: 'Quarterly declarations are mandatory even if your revenue is zero. Deadlines are: January 31 (Q4 prior year), April 30 (Q1), July 31 (Q2), October 31 (Q3). A late or missed declaration can result in penalties. Add these dates to your calendar now.',
              },
            ],
          },
          {
            h2: 'Common mistakes to avoid during registration',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Choosing an activity description that is too vague — be specific; it speeds up processing and protects you in case of a tax audit',
                  'Using a temporary or rarely-checked email address — all your official documents will be sent there',
                  'Not keeping a copy of your registration certificate — download it and store it safely',
                  'Forgetting to note quarterly declaration dates from the start',
                  'Invoicing before receiving your IF — wait for official confirmation',
                  'Confusing your auto-entrepreneur IF with an RC number — they are two different things',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli: built for Moroccan auto-entrepreneurs',
                body: 'Professional quotes, compliant invoices with IF and legal mentions, payment tracking, revenue dashboard — everything you need to run your activity without errors from day one. Free to start, no credit card required.',
                href: '/fonctionnalites',
                cta: 'See all features',
              },
            ],
          },
        ],
      },

      // ── ARABIC ──────────────────────────────────────────────────────────────
      ar: {
        title: 'كيف تسجّل كمقاول ذاتي بالمغرب: الإجراءات والوثائق والسجل التجاري والبطاقة المهنية',
        description: 'دليل شامل للتسجيل كمقاول ذاتي بالمغرب: الوثائق المطلوبة، التسجيل على البوابة الرسمية خطوة بخطوة، السجل التجاري، الضريبة المهنية (البطاقة المهنية) والمعرّف الضريبي.',
        intro: [
          {
            type: 'p',
            text: 'لقد اتخذت قرارك بالانطلاق كمقاول ذاتي بالمغرب. الآن يأتي السؤال الحقيقي: ماذا تفعل بالضبط؟ أي بوابة؟ ما الوثائق؟ وماذا عن السجل التجاري والبطاقة المهنية التي يتحدث عنها الجميع؟ هذه الأسئلة تتكرر دائماً — وبحق، لأن الخلط بين متطلبات الأوضاع القانونية المختلفة أمر شائع فعلاً.',
          },
          {
            type: 'p',
            text: 'البشرى السارة: صُمِّم نظام المقاول الذاتي تحديداً لاختصار كل هذا التعقيد. في هذا الدليل نغطي الإجراءات خطوة بخطوة، والوثائق الدقيقة المطلوبة، ونوضح نهائياً مسألتَي السجل التجاري والبطاقة المهنية — مفهومان كثيراً ما يُساء فهمهما في هذا الوضع.',
          },
        ],
        sections: [
          {
            h2: 'الوثائق التي تحتاج إعدادها قبل البدء',
            blocks: [
              {
                type: 'p',
                text: 'من أبرز مزايا نظام المقاول الذاتي خفة ملف التسجيل. خلافاً لتأسيس شركة ذات مسؤولية محدودة التي تستلزم نظاماً أساسياً ورأس مال واتفاقية موثقة، لا يتطلب التسجيل كمقاول ذاتي سوى معلومات أساسية بسيطة:',
              },
              {
                type: 'ul',
                items: [
                  'بطاقة التعريف الوطنية (CIN) — يُدخَل الرقم إلكترونياً، ولا يُرسَل أي مسح ضوئي في معظم الأنشطة',
                  'بريد إلكتروني فعّال — هنا ستتلقى شهادة تسجيلك ومعرّفك الضريبي',
                  'رقم هاتف مغربي — للتحقق من الحساب',
                  'العنوان البريدي الكامل — عنوانك الشخصي يُعتمد عنواناً مهنياً في البداية',
                  'وصف لنشاطك — جهّز سطرين أو ثلاثة يصفان بدقة ما تقدمه',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'الأنشطة التي تستلزم وثائق إضافية',
                body: 'بعض الأنشطة المنظمة (النقل، بيع الأدوية، الأنشطة التي تستوجب ترخيصاً بلدياً) قد تستدعي وثائق إضافية. تُعلمك البوابة بذلك عند اختيار نوع نشاطك. أما الخدمات الذهنية — التطوير والتصميم والاستشارة والتكوين — فلا تستلزم أي وثيقة إضافية.',
              },
            ],
          },
          {
            h2: 'التسجيل خطوة بخطوة على البوابة الرسمية',
            blocks: [
              {
                type: 'p',
                text: 'يتم التسجيل حصرياً عبر الإنترنت على portail.auto-entrepreneur.ma — البوابة الرسمية التي تشرف عليها مشتركةً الصندوقُ الوطني للضمان الاجتماعي والمديريةُ العامة للضرائب. إليك الخطوات بالترتيب الدقيق:',
              },
              {
                type: 'ol',
                items: [
                  'توجّه إلى portail.auto-entrepreneur.ma وانقر على "التسجيل"',
                  'أنشئ حسابك: البريد الإلكتروني، كلمة المرور، والتحقق برسالة SMS',
                  'أدخل معلوماتك الشخصية: رقم بطاقة التعريف الوطنية، الاسم الشخصي، العائلي، تاريخ ومكان الازدياد',
                  'أدخل عنوانك الكامل (سيُعتمد عنواناً لنشاطك)',
                  'اختر قطاع نشاطك من القائمة المنسدلة ثم نشاطك المحدد',
                  'صِف نشاطك في بضعة أسطر في خانة النص الحر المخصصة لذلك',
                  'راجع ملفك وصادق عليه — يمكنك الحفظ والعودة لاحقاً',
                  'أرسل طلبك: يُسنَد إليك رقم الملف فوراً',
                  'انتظر تأكيد البريد الإلكتروني: ستتلقى شهادة تسجيلك ومعرّفك الضريبي (IF)',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'مدة المعالجة الفعلية',
                body: 'تُعالَج الغالبية العظمى من الملفات الكاملة خلال 24 إلى 48 ساعة عمل. بعض الردود تصل في نفس اليوم. إذا استدعى نشاطك تحققاً إضافياً، قد تمتد المدة إلى 5 أيام عمل. لا حاجة للتنقل إلى أي مكتب بالنسبة لأنشطة الخدمات العادية.',
              },
            ],
          },
          {
            h2: 'السجل التجاري: هل يُعفى منه المقاول الذاتي؟',
            blocks: [
              {
                type: 'p',
                text: 'هذا من أكثر الأسئلة شيوعاً — والجواب واضح: لا يُلزَم المقاولون الذاتيون بالتسجيل في السجل التجاري. السجل التجاري التزام مخصص للشركات التجارية (ش.م.م، ش.أ، ش.م.م.أ) والتجار الأشخاص الطبيعيين الخاضعين للنظام العام.',
              },
              {
                type: 'p',
                text: 'يمتلك نظام المقاول الذاتي منظومة تسجيل خاصة به عبر البوابة الوطنية. وشهادة التسجيل الصادرة في ختام الإجراء تحل محل السجل التجاري في جميع تعاملاتك الإدارية والتجارية الاعتيادية.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'انتبه لطلبات بعض العملاء',
                body: 'بعض الجهات — ولا سيما الشركات الكبرى أو الإدارات العمومية — قد تطلب رقم سجل تجاري في استمارات تسجيل الموردين. في هذه الحالة، يمكنك تقديم شهادة تسجيلك كمقاول ذاتي ومعرّفك الضريبي. إذا اشترط عميل حتماً سجلاً تجارياً، فقد تستوجب الحالة تأسيس شركة ذات مسؤولية محدودة للتعامل معه.',
              },
              {
                type: 'table',
                headers: ['المتطلب', 'المقاول الذاتي', 'ش.م.م / تاجر'],
                rows: [
                  ['السجل التجاري', 'غير مطلوب', 'إلزامي'],
                  ['بوابة auto-entrepreneur.ma', 'إلزامية', 'غير مطبقة'],
                  ['المعرّف الضريبي (IF)', 'يُسنَد تلقائياً', 'يُستخرج من المديرية العامة للضرائب'],
                  ['النظام الأساسي للشركة', 'غير مطلوب', 'إلزامي'],
                  ['رأس المال الأدنى', 'لا شيء', 'درهم واحد (ش.م.م)'],
                ],
              },
            ],
          },
          {
            h2: 'البطاقة المهنية والضريبة المهنية: ما يجب معرفته',
            blocks: [
              {
                type: 'p',
                text: 'البطاقة المهنية — المعروفة رسمياً بـ "الضريبة المهنية" بعد إصلاح الضريبة المسماة "البطانة" سابقاً — مصدر لبس كثير للمقاولين الذاتيين. إليك القاعدة الدقيقة:',
              },
              {
                type: 'ul',
                items: [
                  'إعفاء تام خلال السنوات الخمس الأولى من النشاط تحتسب من تاريخ التسجيل',
                  'بعد 5 سنوات: تصبح خاضعاً للضريبة المهنية بالأسعار المعتادة المطبقة على نشاطك',
                  'تُنجز التصريحات والأداءات لدى مركزك الجهوي للضرائب (CRI)',
                  'من الناحية العملية: على معظم المقاولين الذاتيين في بداية نشاطهم، لا تسري الضريبة المهنية بعد',
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'ثلاثة إعفاءات مجتمعة في السنوات الأولى',
                body: 'بالجمع بين إعفاء الضريبة على الدخل (3 سنوات)، وإعفاء البطاقة المهنية/الضريبة المهنية (5 سنوات)، والإعفاء الدائم من الضريبة على القيمة المضافة، لا يدفع المقاول الذاتي في بداية نشاطه أي ضريبة مباشرة تقريباً — سوى اشتراكات الصندوق الوطني للضمان الاجتماعي المتناسبة مع رقم أعماله المصرَّح به.',
              },
            ],
          },
          {
            h2: 'معرّفك الضريبي (IF): ما دوره وأين تستخدمه؟',
            blocks: [
              {
                type: 'p',
                text: 'عند انتهاء تسجيلك، تتلقى بريداً إلكترونياً يتضمن معرّفك الضريبي (IF) — رقم فريد تُسنده المديرية العامة للضرائب. هذا هو رقم تعريفك الضريبي الرسمي بوصفك مقاولاً ذاتياً. وهو إلزامي على كل فاتورة تصدرها.',
              },
              {
                type: 'ul',
                items: [
                  'على جميع فواتيرك: ذكر إلزامي "IF رقم XXXXXXXX" في الترويسة',
                  'لتصريحاتك الفصلية برقم الأعمال لدى المديرية العامة للضرائب',
                  'لاشتراكاتك الفصلية في الصندوق الوطني للضمان الاجتماعي',
                  'لفتح حساب بنكي مهني لدى بعض البنوك',
                  'لأي إثبات وضع قانوني يطلبه شريك أو عميل',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'فواتير مطابقة مع معرّفك الضريبي في دقيقتين',
                body: 'يولّد Sayerli تلقائياً فواتير بجميع البيانات القانونية الإلزامية: معرّفك الضريبي، عنوانك، إشعار الإعفاء من الضريبة على القيمة المضافة، والترقيم التسلسلي. لا خطر نسيان أي شيء، لا أخطاء. تجربة مجانية، بدون بطاقة بنكية.',
                href: '/register',
                cta: 'إنشاء حسابي المجاني',
              },
            ],
          },
          {
            h2: 'بعد التسجيل: ما يمكنك البدء به فوراً',
            blocks: [
              {
                type: 'p',
                text: 'بمجرد استلام شهادة تسجيلك ومعرّفك الضريبي، يمكنك قانونياً البدء في نشاطك. إليك ما يجب وضعه موضع التنفيذ منذ اليوم الأول:',
              },
              {
                type: 'ol',
                items: [
                  'إصدار فواتير مطابقة تتضمن معرّفك الضريبي وإشعار الإعفاء من الضريبة على القيمة المضافة',
                  'فتح حساب بنكي مخصص لنشاطك (مستحسن بشدة — ليس إلزامياً قانوناً، لكنه ضروري عملياً)',
                  'البدء في تسجيل مداخيلك المحصّلة لإعداد تصريحك الفصلي',
                  'الانخراط في الصندوق الوطني للضمان الاجتماعي إن لم يتم تلقائياً خلال التسجيل الإلكتروني',
                  'إعداد أول تصريح فصلي للفترة الجارية',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'لا تفوّت أول تصريح فصلي',
                body: 'التصريحات الفصلية إلزامية حتى لو كان رقم أعمالك صفراً. المواعيد النهائية: 31 يناير (الربع الرابع من السنة السابقة)، 30 أبريل (الربع الأول)، 31 يوليوز (الربع الثاني)، 31 أكتوبر (الربع الثالث). قد يُفضي التأخر في التصريح أو إغفاله إلى غرامات. سجّل هذه المواعيد في مفكرتك الآن.',
              },
            ],
          },
          {
            h2: 'الأخطاء الشائعة التي يجب تجنبها عند التسجيل',
            blocks: [
              {
                type: 'ul',
                items: [
                  'اختيار وصف نشاط مبهم جداً أو واسع — كن دقيقاً، فذلك يُسرّع المعالجة ويحميك عند أي مراجعة جبائية',
                  'استخدام بريد إلكتروني مؤقت أو نادر الاستخدام — جميع وثائقك الرسمية ستُرسَل إليه',
                  'عدم الاحتفاظ بنسخة من شهادة التسجيل — حمّلها واحفظها في مكان آمن',
                  'إهمال تسجيل مواعيد التصريحات الفصلية منذ البداية',
                  'الفوترة قبل استلام معرّفك الضريبي — انتظر التأكيد الرسمي',
                  'الخلط بين المعرّف الضريبي للمقاول الذاتي ورقم السجل التجاري — إنهما شيئان مختلفان',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Sayerli: مصمَّم للمقاولين الذاتيين المغاربة',
                body: 'عروض أسعار احترافية، فواتير مطابقة مع المعرّف الضريبي والبيانات القانونية، تتبع المدفوعات، لوحة قيادة رقم الأعمال — كل ما تحتاجه لتسيير نشاطك بلا أخطاء منذ اليوم الأول. مجاني للبدء، بدون بطاقة بنكية.',
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

  'calcul-tva-maroc': {
    slug: 'calcul-tva-maroc',
    image: '/blog/calcul-tva-maroc.webp',
    readingTime: 9,
    content: {

      fr: {
        title: 'TVA au Maroc : taux, calcul et déclaration — guide complet 2025',
        description: 'Tout savoir sur la TVA au Maroc : taux de 7%, 10%, 14% et 20%, comment calculer la TVA, bien facturer et déclarer en ligne via Simpl-TVA. Guide complet pour PME, freelancers et auto-entrepreneurs.',
        intro: [
          {
            type: 'p',
            text: 'La TVA — Taxe sur la Valeur Ajoutée — est l\'un des impôts les plus collectés au Maroc, et pourtant l\'un des plus mal compris. Quel taux appliquer sur votre facture ? Comment calculer le montant HT à partir d\'un prix TTC ? Qu\'est-ce que la TVA déductible, et comment la récupérer ? Quand et comment faire sa déclaration ?',
          },
          {
            type: 'p',
            text: 'Que vous soyez gérant de SARL, freelance assujetti ou comptable d\'une PME marocaine, ce guide couvre tout ce qu\'il faut savoir sur la TVA au Maroc en 2025 : mécanisme, taux, formules de calcul, facturation conforme, TVA déductible, et procédure de déclaration via le portail DGI.',
          },
        ],
        sections: [
          {
            h2: 'Qu\'est-ce que la TVA au Maroc ?',
            blocks: [
              {
                type: 'p',
                text: 'La Taxe sur la Valeur Ajoutée (TVA) est un impôt indirect régi par la loi n° 30-85. Elle frappe la consommation de biens et services. Contrairement à l\'IR ou à l\'IS, la TVA n\'est pas un impôt sur vos bénéfices — c\'est un impôt que vous collectez pour le compte de l\'État auprès de vos clients, puis reversez à la DGI après déduction de la TVA que vous avez payée sur vos propres achats.',
              },
              {
                type: 'p',
                text: 'En pratique, la TVA fonctionne comme une chaîne : chaque opérateur collecte la TVA sur ses ventes, déduit la TVA sur ses achats, et verse la différence à l\'État. Au final, c\'est toujours le consommateur final qui supporte la charge économique de la taxe.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'TVA ≠ impôt sur votre bénéfice',
                body: 'La TVA que vous facturez à vos clients ne vous appartient pas — c\'est de l\'argent que vous détenez temporairement pour le compte de l\'État. Votre revenu réel, c\'est le montant hors taxes (HT), pas le TTC.',
              },
            ],
          },
          {
            h2: 'Les taux de TVA en vigueur au Maroc en 2025',
            blocks: [
              {
                type: 'p',
                text: 'Le Maroc applique plusieurs taux de TVA selon la nature du bien ou du service :',
              },
              {
                type: 'table',
                headers: ['Taux', 'Domaine d\'application'],
                rows: [
                  ['20%', 'Taux normal — tous les biens et services sans taux réduit ni exonération'],
                  ['14%', 'Énergie électrique, eau, transport de voyageurs et de marchandises, téléphonie mobile'],
                  ['10%', 'Opérations bancaires et de crédit, restauration, hôtellerie, leasing'],
                  ['7%', 'Médicaments, produits alimentaires de base (huile, sucre, farine...), eau en réseau'],
                  ['0% (exonéré)', 'Exportations, certains produits agricoles, livraisons en zones franches'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Le 20% est le taux par défaut',
                body: 'En cas de doute sur le taux applicable, appliquez 20%. Les taux réduits (7%, 10%, 14%) ne s\'appliquent qu\'aux opérations expressément listées dans le Code Général des Impôts. Consultez un expert-comptable si votre activité couvre plusieurs taux.',
              },
            ],
          },
          {
            h2: 'Qui est assujetti à la TVA au Maroc ?',
            blocks: [
              {
                type: 'p',
                text: 'L\'assujettissement dépend du statut juridique et du chiffre d\'affaires :',
              },
              {
                type: 'ul',
                items: [
                  'Sociétés (SARL, SA, SAS) : assujetties de plein droit, quel que soit leur CA',
                  'Personnes physiques professionnelles (patentées) : assujetties si CA > 500 000 MAD, ou sur option',
                  'Professions libérales (médecins, avocats, architectes...) : assujetties de plein droit',
                  'Importateurs : assujettis sur les marchandises importées',
                  'Auto-entrepreneurs : exonérés de TVA — ils ne la facturent pas et ne la récupèrent pas',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Auto-entrepreneur et TVA : exonération totale',
                body: 'Si vous êtes auto-entrepreneur, vous ne devez pas appliquer la TVA sur vos factures. Mentionnez : "Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX". Appliquer une TVA en tant qu\'auto-entrepreneur est une erreur qui peut poser problème lors d\'un contrôle fiscal.',
              },
            ],
          },
          {
            h2: 'Comment calculer la TVA au Maroc : formules et exemples pratiques',
            blocks: [
              {
                type: 'p',
                text: 'Deux formules couvrent 95% des cas au quotidien :',
              },
              {
                type: 'ul',
                items: [
                  'De HT à TTC : TTC = HT × (1 + taux TVA)',
                  'De TTC à HT : HT = TTC ÷ (1 + taux TVA)',
                  'Montant TVA seul : TVA = HT × taux TVA',
                ],
              },
              {
                type: 'table',
                headers: ['Base HT', 'Taux TVA', 'Montant TVA', 'Total TTC'],
                rows: [
                  ['500 MAD', '20%', '100 MAD', '600 MAD'],
                  ['1 000 MAD', '20%', '200 MAD', '1 200 MAD'],
                  ['5 000 MAD', '20%', '1 000 MAD', '6 000 MAD'],
                  ['10 000 MAD', '20%', '2 000 MAD', '12 000 MAD'],
                  ['1 000 MAD', '14%', '140 MAD', '1 140 MAD'],
                  ['1 000 MAD', '10%', '100 MAD', '1 100 MAD'],
                  ['1 000 MAD', '7%', '70 MAD', '1 070 MAD'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Exemple : retrouver le HT à partir d\'un TTC',
                body: 'Vous recevez une facture de 14 400 MAD TTC au taux de 20%. HT = 14 400 ÷ 1,20 = 12 000 MAD. TVA déductible = 2 400 MAD. Attention : ne divisez pas par 0,20 — c\'est une erreur fréquente.',
              },
            ],
          },
          {
            h2: 'Comment facturer correctement avec la TVA',
            blocks: [
              {
                type: 'p',
                text: 'Une facture conforme avec TVA doit obligatoirement mentionner les éléments suivants, sous peine de rejet de la TVA déductible par votre client :',
              },
              {
                type: 'ul',
                items: [
                  'Votre numéro ICE et votre IF (Identifiant Fiscal)',
                  'Le numéro ICE de votre client (pour les transactions B2B)',
                  'La désignation précise du bien ou service',
                  'Le prix unitaire hors taxe (HT)',
                  'Le taux de TVA applicable (7%, 10%, 14% ou 20%)',
                  'Le montant de TVA calculé',
                  'Le total toutes taxes comprises (TTC)',
                  'Si plusieurs taux sur une même facture, détaillez chaque ligne séparément',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Facture sans TVA correcte = TVA non récupérable pour votre client',
                body: 'Si votre facture ne mentionne pas clairement le taux et le montant de TVA, votre client ne pourra pas la déduire sur sa déclaration. C\'est une source de friction fréquente avec les PME et grands comptes.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Factures avec TVA automatique sur Sayerli',
                body: 'Sayerli calcule automatiquement la TVA sur chaque ligne de votre facture. Choisissez votre taux (7%, 10%, 14%, 20% ou personnalisé) et le HT/TTC sont calculés en temps réel. Vos factures incluent ICE, IF, montant TVA et total TTC — conformes dès la première émission.',
                href: '/fonctionnalites',
                cta: 'Voir les fonctionnalités',
              },
            ],
          },
          {
            h2: 'TVA collectée vs TVA déductible : le mécanisme clé',
            blocks: [
              {
                type: 'p',
                text: 'Le principe fondamental de la TVA repose sur la différence entre deux flux :',
              },
              {
                type: 'ul',
                items: [
                  'TVA collectée : la TVA que vous facturez à vos clients sur vos ventes ou prestations',
                  'TVA déductible : la TVA que vous avez payée sur vos achats et charges professionnelles',
                  'TVA nette à payer = TVA collectée − TVA déductible',
                ],
              },
              {
                type: 'p',
                text: 'Exemple : en juin vous avez facturé 50 000 MAD HT à 20% → 10 000 MAD de TVA collectée. Vous avez payé 20 000 MAD HT d\'achats professionnels avec 4 000 MAD de TVA. TVA nette à payer : 10 000 − 4 000 = 6 000 MAD.',
              },
              {
                type: 'table',
                headers: ['Opération', 'Base HT', 'TVA (20%)', 'Sens'],
                rows: [
                  ['Ventes clients (juin)', '50 000 MAD', '10 000 MAD', 'Collectée → à reverser'],
                  ['Achats fournisseurs (juin)', '20 000 MAD', '4 000 MAD', 'Déductible → à récupérer'],
                  ['TVA nette à payer', '—', '6 000 MAD', 'Versé à la DGI'],
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Crédit de TVA : quand l\'État vous doit de l\'argent',
                body: 'Si votre TVA déductible dépasse votre TVA collectée (ex : investissement lourd), vous êtes en crédit de TVA. Ce crédit est reportable sur les déclarations suivantes ou peut faire l\'objet d\'une demande de remboursement à la DGI.',
              },
            ],
          },
          {
            h2: 'Comment déclarer la TVA au Maroc via Simpl-TVA',
            blocks: [
              {
                type: 'p',
                text: 'La déclaration de TVA est obligatoirement télédéclarée via le portail DGI. Voici les étapes :',
              },
              {
                type: 'ol',
                items: [
                  'Connectez-vous sur simpl.tax.gov.ma avec vos identifiants fiscaux',
                  'Sélectionnez l\'espace "Simpl-TVA" depuis votre tableau de bord',
                  'Choisissez la période concernée (mois ou trimestre selon votre régime)',
                  'Renseignez le CA imposable HT et la TVA collectée par taux',
                  'Renseignez les montants de TVA déductible justifiés par des factures fournisseurs conformes',
                  'Le système calcule la TVA nette à payer ou le crédit reportable',
                  'Procédez au paiement en ligne ou en agence avant la date limite',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Délais et pénalités',
                body: 'Dépôt avant le 20 du mois suivant la période. Retard : majoration de 10% + 5% par mois supplémentaire. La régularisation spontanée avant tout contrôle peut atténuer les pénalités.',
              },
            ],
          },
          {
            h2: 'Régime mensuel vs régime trimestriel',
            blocks: [
              {
                type: 'table',
                headers: ['Régime', 'CA annuel', 'Périodicité', 'Date limite'],
                rows: [
                  ['Mensuel', 'CA > 1 000 000 MAD', 'Chaque mois', 'Avant le 20 du mois suivant'],
                  ['Trimestriel', 'CA ≤ 1 000 000 MAD', 'Chaque trimestre', 'Avant le 20 du mois suivant le trimestre'],
                ],
              },
              {
                type: 'p',
                text: 'Les trimestres civils se terminent le 31 mars, 30 juin, 30 septembre et 31 décembre. La déclaration du T1 est à déposer avant le 20 avril, T2 avant le 20 juillet, T3 avant le 20 octobre, T4 avant le 20 janvier.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Option pour le régime mensuel',
                body: 'Même si votre CA ne dépasse pas 1 000 000 MAD, vous pouvez opter volontairement pour le régime mensuel — avantageux si vous avez régulièrement des crédits de TVA importants à récupérer plus vite.',
              },
            ],
          },
          {
            h2: 'Les 5 erreurs les plus fréquentes à éviter',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Appliquer le mauvais taux : facturer à 20% un service à 10% génère un surcoût client ou un risque fiscal',
                  'Confondre HT et TTC dans votre CA déclaré : votre chiffre d\'affaires est le HT, pas le TTC encaissé',
                  'Oublier de déduire la TVA sur vos achats : vous payez plus que nécessaire',
                  'Accepter des factures fournisseurs incomplètes : sans ICE, taux ni montant TVA, elles ne sont pas déductibles',
                  'Déclarer en retard : 10% de majoration dès le premier jour — mettez un rappel dans votre agenda',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Gérez votre TVA automatiquement avec Sayerli',
                body: 'Sayerli génère votre Déclaration TVA automatiquement à partir de vos factures et dépenses — TVA collectée, TVA déductible, TVA nette à payer. Exportez un PDF prêt à soumettre à votre comptable ou à la DGI. Fini les calculs manuels et les oublis de délais.',
                href: '/register',
                cta: 'Essayer Sayerli gratuitement',
              },
            ],
          },
        ],
      },

      en: {
        title: 'VAT in Morocco: Rates, Calculation and Declaration — Complete Guide 2025',
        description: 'Everything about VAT (TVA) in Morocco: 7%, 10%, 14% and 20% rates, how to calculate VAT, invoice correctly and file your declaration via Simpl-TVA. Complete guide for SMEs, freelancers and businesses.',
        intro: [
          {
            type: 'p',
            text: 'VAT — Value Added Tax (known as TVA in Morocco) — is one of the most collected taxes in the country, yet one of the most misunderstood. Which rate applies to your invoice? How do you calculate the pre-tax amount from a TTC price? What is deductible VAT, and how do you recover it? When and how do you file your declaration?',
          },
          {
            type: 'p',
            text: 'Whether you are a company manager, a self-employed professional subject to VAT, or an SME accountant, this guide covers everything you need to know about VAT in Morocco in 2025: mechanism, rates, calculation formulas, compliant invoicing, deductible VAT, and the filing process via the DGI portal.',
          },
        ],
        sections: [
          {
            h2: 'What is VAT in Morocco?',
            blocks: [
              {
                type: 'p',
                text: 'Value Added Tax (TVA) is an indirect tax governed by Law No. 30-85. It taxes the consumption of goods and services. Unlike income tax (IR) or corporate tax (IS), VAT is not a tax on profits — it is a tax you collect on behalf of the State from your clients, then remit to the DGI after deducting the VAT you paid on your own purchases.',
              },
              {
                type: 'p',
                text: 'In practice, VAT works as a chain: each economic operator collects VAT on sales, deducts VAT on purchases, and pays the difference to the State. The end consumer always bears the economic burden of the tax.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'VAT ≠ tax on your profit',
                body: 'The VAT you charge clients does not belong to you — it is money you temporarily hold on behalf of the State. Your actual income is the pre-tax amount (HT), not the total including tax (TTC).',
              },
            ],
          },
          {
            h2: 'VAT Rates in Morocco in 2025',
            blocks: [
              {
                type: 'p',
                text: 'Morocco applies several VAT rates depending on the nature of the goods or service:',
              },
              {
                type: 'table',
                headers: ['Rate', 'Scope of Application'],
                rows: [
                  ['20%', 'Standard rate — all goods and services not benefiting from a reduced rate or exemption'],
                  ['14%', 'Electricity, water, passenger and freight transport, mobile phone services'],
                  ['10%', 'Banking and credit operations, restaurants, hotels, leasing'],
                  ['7%', 'Medicines, basic food products (oil, sugar, flour...), network-delivered water'],
                  ['0% (exempt)', 'Exports, certain agricultural products, deliveries to free zones'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: '20% is the default rate',
                body: 'When in doubt about the applicable rate, apply 20%. Reduced rates only apply to operations expressly listed in the General Tax Code. Consult an accountant if your activity spans multiple rates.',
              },
            ],
          },
          {
            h2: 'Who is Subject to VAT in Morocco?',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Companies (SARL, SA, SAS): subject to VAT by right, regardless of turnover',
                  'Self-employed professionals: subject to VAT if annual turnover exceeds 500,000 MAD, or by voluntary option',
                  'Liberal professions (doctors, lawyers, architects...): subject to VAT by right',
                  'Importers: subject to VAT on imported goods',
                  'Auto-entrepreneurs (micro-business): exempt from VAT — they do not charge or recover it',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Auto-entrepreneur and VAT: full exemption',
                body: 'If you are a registered auto-entrepreneur, do not apply VAT on your invoices. Write: "Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX". Charging VAT as an auto-entrepreneur is an error that can cause issues during a tax audit.',
              },
            ],
          },
          {
            h2: 'How to Calculate VAT in Morocco: Formulas and Examples',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Pre-tax to total: TTC = HT × (1 + VAT rate)',
                  'Total to pre-tax: HT = TTC ÷ (1 + VAT rate)',
                  'VAT amount only: VAT = HT × VAT rate',
                ],
              },
              {
                type: 'table',
                headers: ['Pre-tax (HT)', 'VAT Rate', 'VAT Amount', 'Total (TTC)'],
                rows: [
                  ['500 MAD', '20%', '100 MAD', '600 MAD'],
                  ['1,000 MAD', '20%', '200 MAD', '1,200 MAD'],
                  ['5,000 MAD', '20%', '1,000 MAD', '6,000 MAD'],
                  ['10,000 MAD', '20%', '2,000 MAD', '12,000 MAD'],
                  ['1,000 MAD', '14%', '140 MAD', '1,140 MAD'],
                  ['1,000 MAD', '10%', '100 MAD', '1,100 MAD'],
                  ['1,000 MAD', '7%', '70 MAD', '1,070 MAD'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Example: finding pre-tax from a TTC amount',
                body: 'You receive a supplier invoice for 14,400 MAD TTC at 20%. HT = 14,400 ÷ 1.20 = 12,000 MAD. Deductible VAT = 2,400 MAD. Do not divide by 0.20 — that is a common mistake.',
              },
            ],
          },
          {
            h2: 'How to Invoice Correctly with VAT',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Your ICE number and IF (Tax Identifier)',
                  'Your client\'s ICE number (for B2B transactions)',
                  'Precise description of the goods or service',
                  'Unit price excluding tax (HT)',
                  'Applicable VAT rate (7%, 10%, 14% or 20%)',
                  'Calculated VAT amount',
                  'Total including tax (TTC)',
                  'If multiple rates on one invoice, detail each line separately',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Invoice without correct VAT = non-recoverable VAT for your client',
                body: 'If your invoice does not clearly state the VAT rate and amount, your client cannot deduct it on their declaration. This is a frequent source of friction with SME and large-account clients.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Automatic VAT invoices on Sayerli',
                body: 'Sayerli automatically calculates VAT on each invoice line. Select your rate (7%, 10%, 14%, 20% or custom) and HT/TTC are computed in real time. Your invoices include ICE, IF, VAT amount and TTC total — compliant from day one.',
                href: '/fonctionnalites',
                cta: 'See features',
              },
            ],
          },
          {
            h2: 'Collected VAT vs Deductible VAT: the Key Mechanism',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Collected VAT: the VAT you charge clients on your sales or services',
                  'Deductible VAT: the VAT you paid on professional purchases (suppliers, equipment, software...)',
                  'Net VAT payable = Collected VAT − Deductible VAT',
                ],
              },
              {
                type: 'p',
                text: 'Example: in June you invoiced 50,000 MAD HT at 20% = 10,000 MAD collected VAT. You paid 20,000 MAD HT in professional purchases with 4,000 MAD VAT. Net VAT payable: 10,000 − 4,000 = 6,000 MAD.',
              },
              {
                type: 'table',
                headers: ['Operation', 'Pre-tax (HT)', 'VAT (20%)', 'Direction'],
                rows: [
                  ['Client sales (June)', '50,000 MAD', '10,000 MAD', 'Collected → to remit'],
                  ['Supplier purchases (June)', '20,000 MAD', '4,000 MAD', 'Deductible → to recover'],
                  ['Net VAT payable', '—', '6,000 MAD', 'Paid to DGI'],
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'VAT credit: when the State owes you money',
                body: 'If deductible VAT exceeds collected VAT (e.g. a major equipment investment), you are in a VAT credit position. This credit can be carried forward or you can apply for a refund from the DGI.',
              },
            ],
          },
          {
            h2: 'How to File Your VAT Declaration via Simpl-TVA',
            blocks: [
              {
                type: 'ol',
                items: [
                  'Log in to simpl.tax.gov.ma with your tax credentials',
                  'Select the "Simpl-TVA" section from your tax dashboard',
                  'Choose the relevant period (month or quarter)',
                  'Enter your taxable turnover (HT) and collected VAT broken down by rate',
                  'Enter deductible VAT amounts backed by compliant supplier invoices',
                  'The system calculates net VAT payable or carryover credit automatically',
                  'Pay online or at an agency before the deadline',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Filing deadlines and penalties',
                body: 'File before the 20th of the month following the period. Late filing: 10% surcharge + 5% per additional month. Spontaneous regularisation before any tax audit can reduce penalties.',
              },
            ],
          },
          {
            h2: 'Monthly vs Quarterly Regime',
            blocks: [
              {
                type: 'table',
                headers: ['Regime', 'Annual Turnover', 'Frequency', 'Deadline'],
                rows: [
                  ['Monthly', 'Turnover > 1,000,000 MAD', 'Each month', 'Before the 20th of the following month'],
                  ['Quarterly', 'Turnover ≤ 1,000,000 MAD', 'Each quarter', 'Before the 20th of the month after the quarter'],
                ],
              },
              {
                type: 'p',
                text: 'Q1 declaration is due before April 20, Q2 before July 20, Q3 before October 20, Q4 before January 20.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Option for monthly regime',
                body: 'Even below 1,000,000 MAD turnover, you can voluntarily opt for the monthly regime — useful if you regularly have significant VAT credits to recover faster.',
              },
            ],
          },
          {
            h2: 'The 5 Most Common Mistakes to Avoid',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Wrong rate: charging 20% on a 10% service creates a client overcharge or tax risk',
                  'Confusing HT and TTC in your declared turnover: revenue is the pre-tax (HT) amount, not the TTC collected',
                  'Not deducting VAT on purchases: you overpay the State unnecessarily',
                  'Accepting incomplete supplier invoices: without ICE, rate or VAT amount, they are not tax-deductible',
                  'Filing late: 10% surcharge from day one — set a calendar reminder',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Manage your VAT effortlessly with Sayerli',
                body: 'Sayerli automatically generates your VAT Declaration from your invoices and expenses — collected VAT, deductible VAT, net VAT payable. Export a PDF ready to submit to your accountant or the DGI. No manual calculations, no missed deadlines.',
                href: '/register',
                cta: 'Try Sayerli for free',
              },
            ],
          },
        ],
      },

      ar: {
        title: 'الضريبة على القيمة المضافة في المغرب: المعدلات والحساب والتصريح — دليل شامل 2025',
        description: 'كل ما تحتاج معرفته عن TVA في المغرب: معدلات 7% و10% و14% و20%، وكيفية حساب الضريبة، والفوترة الصحيحة، والتصريح عبر Simpl-TVA. دليل شامل للمقاولات الصغيرة والمتوسطة والمقاولين الذاتيين.',
        intro: [
          {
            type: 'p',
            text: 'الضريبة على القيمة المضافة (TVA) من أكثر الضرائب تحصيلاً في المغرب، ومع ذلك تبقى الأكثر سوء فهماً. أي معدل تطبّقه على فاتورتك؟ كيف تحسب المبلغ خارج الضريبة (HT) من سعر شامل (TTC)؟ ما هي TVA القابلة للخصم وكيف تستردها؟ متى وكيف تقدّم تصريحك؟',
          },
          {
            type: 'p',
            text: 'سواء كنت مسيّر شركة ذات مسؤولية محدودة أو مهنياً مستقلاً خاضعاً لـ TVA أو محاسب مقاولة، يغطي هذا الدليل كل ما تحتاج معرفته عن TVA في المغرب 2025: الآلية، المعدلات، صيغ الحساب، الفوترة المطابقة، TVA القابلة للخصم، وإجراءات التصريح عبر بوابة المديرية العامة للضرائب.',
          },
        ],
        sections: [
          {
            h2: 'ما هي الضريبة على القيمة المضافة في المغرب؟',
            blocks: [
              {
                type: 'p',
                text: 'TVA ضريبة غير مباشرة تحكمها القانون رقم 30-85. تفرض على استهلاك السلع والخدمات. على خلاف الضريبة على الدخل (IR) أو الضريبة على الشركات (IS)، فإن TVA ليست ضريبة على الأرباح — بل تحصّلها من عملائك نيابةً عن الدولة، ثم تؤدّيها للمديرية العامة للضرائب بعد خصم TVA التي دفعتها على مشترياتك.',
              },
              {
                type: 'p',
                text: 'من الناحية العملية، TVA تعمل كسلسلة: كل متعامل يحصّل TVA على مبيعاته، يخصم TVA على مشترياته، ويسلّم الفارق للدولة. المستهلك النهائي هو دائماً من يتحمّل العبء الاقتصادي للضريبة.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'TVA ≠ ضريبة على ربحك',
                body: 'الـ TVA التي تفاتر بها عملاءك لا تخصّك — إنها مبلغ تحتفظ به مؤقتاً لصالح الدولة. دخلك الحقيقي هو المبلغ خارج الضريبة (HT)، وليس الإجمالي الشامل (TTC).',
              },
            ],
          },
          {
            h2: 'معدلات TVA السارية في المغرب 2025',
            blocks: [
              {
                type: 'p',
                text: 'يُطبَّق في المغرب عدة معدلات لـ TVA حسب طبيعة السلعة أو الخدمة:',
              },
              {
                type: 'table',
                headers: ['المعدل', 'مجال التطبيق'],
                rows: [
                  ['20%', 'المعدل العادي — جميع السلع والخدمات غير المستفيدة من معدل مخفَّض أو إعفاء'],
                  ['14%', 'الطاقة الكهربائية، الماء، نقل المسافرين والبضائع، خدمات الهاتف المحمول'],
                  ['10%', 'العمليات البنكية والائتمانية، المطاعم، الفنادق، الائتمان الإيجاري'],
                  ['7%', 'الأدوية، المواد الغذائية الأساسية (الزيت، السكر، الدقيق...)، الماء الموزَّع عبر الشبكات'],
                  ['0% (معفاة)', 'الصادرات، بعض المنتجات الفلاحية، التسليمات للمناطق الحرة'],
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: '20% هو المعدل الافتراضي',
                body: 'عند الشك في المعدل المطبَّق على نشاطك، طبِّق 20%. المعدلات المخفَّضة لا تنطبق إلا على العمليات المذكورة صراحةً في المدونة العامة للضرائب. استشر مستشاراً جبائياً إذا تداخل نشاطك مع عدة معدلات.',
              },
            ],
          },
          {
            h2: 'من هو خاضع لـ TVA في المغرب؟',
            blocks: [
              {
                type: 'ul',
                items: [
                  'الشركات (SARL، SA، SAS): خاضعة بقوة القانون بصرف النظر عن رقم الأعمال',
                  'الأشخاص الطبيعيون المهنيون: خاضعون إذا تجاوز رقم أعمالهم 500,000 درهم أو بالاختيار',
                  'أصحاب المهن الحرة (أطباء، محامون، مهندسون معماريون...): خاضعون بقوة القانون',
                  'المستوردون: خاضعون على البضائع المستوردة',
                  'المقاولون الذاتيون: معفَوْن من TVA — لا يفاترون بها ولا يخصمونها',
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'المقاول الذاتي وTVA: إعفاء كامل',
                body: 'إذا كنت مسجَّلاً كمقاول ذاتي، لا تضِف TVA على فواتيرك. أدرج: "Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX". تطبيق TVA بوصفك مقاولاً ذاتياً خطأ قد يُسبِّب مشكلات عند مراقبة جبائية.',
              },
            ],
          },
          {
            h2: 'كيفية حساب TVA في المغرب: الصيغ والأمثلة',
            blocks: [
              {
                type: 'ul',
                items: [
                  'من HT إلى TTC: TTC = HT × (1 + معدل TVA)',
                  'من TTC إلى HT: HT = TTC ÷ (1 + معدل TVA)',
                  'مبلغ TVA وحده: TVA = HT × معدل TVA',
                ],
              },
              {
                type: 'table',
                headers: ['خارج الضريبة (HT)', 'معدل TVA', 'مبلغ TVA', 'الإجمالي الشامل (TTC)'],
                rows: [
                  ['500 درهم', '20%', '100 درهم', '600 درهم'],
                  ['1,000 درهم', '20%', '200 درهم', '1,200 درهم'],
                  ['5,000 درهم', '20%', '1,000 درهم', '6,000 درهم'],
                  ['10,000 درهم', '20%', '2,000 درهم', '12,000 درهم'],
                  ['1,000 درهم', '14%', '140 درهم', '1,140 درهم'],
                  ['1,000 درهم', '10%', '100 درهم', '1,100 درهم'],
                  ['1,000 درهم', '7%', '70 درهم', '1,070 درهم'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'مثال عملي: إيجاد HT انطلاقاً من TTC',
                body: 'تلقيت فاتورة مورِّد بمبلغ 14,400 درهم TTC بمعدل 20%. HT = 14,400 ÷ 1.20 = 12,000 درهم. TVA القابلة للخصم = 2,400 درهم. لا تقسم على 0.20 — هذا خطأ شائع.',
              },
            ],
          },
          {
            h2: 'كيفية الفوترة الصحيحة مع TVA',
            blocks: [
              {
                type: 'ul',
                items: [
                  'رقم ICE ورقم IF (المعرِّف الجبائي) الخاصَّين بك',
                  'رقم ICE الخاص بعميلك (للمعاملات B2B)',
                  'وصف دقيق للسلعة أو الخدمة',
                  'سعر الوحدة خارج الضريبة (HT)',
                  'معدل TVA المطبَّق (7%، 10%، 14%، أو 20%)',
                  'مبلغ TVA المحسوب',
                  'الإجمالي شامل الضريبة (TTC)',
                  'في حال عدة معدلات على نفس الفاتورة، فصِّل كل سطر على حدة',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'فاتورة بدون TVA صحيحة = ضريبة غير قابلة للخصم',
                body: 'إذا لم تُبيَّن في فاتورتك المعدل ومبلغ TVA بشكل صريح، لن يستطيع عميلك خصم هذه الضريبة في تصريحه. هذا مصدر احتكاك متكرر مع العملاء من المقاولات.',
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'فواتير مع TVA تلقائية على Sayerli',
                body: 'يحسب Sayerli تلقائياً TVA على كل سطر من فاتورتك. اختر معدلك (7%، 10%، 14%، 20% أو مخصَّص) ويتم حساب HT وTTC فورياً. تتضمن فواتيرك ICE وIF ومبلغ TVA والإجمالي TTC — مطابقة منذ أول إصدار.',
                href: '/fonctionnalites',
                cta: 'اكتشف المزايا',
              },
            ],
          },
          {
            h2: 'TVA المحصَّلة مقابل TVA القابلة للخصم',
            blocks: [
              {
                type: 'ul',
                items: [
                  'TVA المحصَّلة: الضريبة التي تفاتر بها عملاءك على مبيعاتك أو خدماتك',
                  'TVA القابلة للخصم: الضريبة التي دفعتها على مشترياتك وأعبائك المهنية',
                  'TVA الصافية المستحقة = TVA المحصَّلة − TVA القابلة للخصم',
                ],
              },
              {
                type: 'p',
                text: 'مثال: في يونيو فاتَرت 50,000 درهم HT بمعدل 20% → 10,000 درهم TVA محصَّلة. دفعت 20,000 درهم HT مشتريات مهنية مع 4,000 درهم TVA. TVA الصافية: 10,000 − 4,000 = 6,000 درهم.',
              },
              {
                type: 'table',
                headers: ['العملية', 'خارج الضريبة (HT)', 'TVA (20%)', 'الاتجاه'],
                rows: [
                  ['مبيعات العملاء (يونيو)', '50,000 درهم', '10,000 درهم', 'محصَّلة → للتحويل للدولة'],
                  ['مشتريات الموردين (يونيو)', '20,000 درهم', '4,000 درهم', 'قابلة للخصم → للاسترداد'],
                  ['TVA الصافية المستحقة', '—', '6,000 درهم', 'تُؤدَّى للمديرية العامة للضرائب'],
                ],
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'رصيد TVA: حين تكون الدولة مدينة لك',
                body: 'إذا تجاوزت TVA القابلة للخصم TVA المحصَّلة (مثل استثمار ضخم في معدات)، تكون في وضعية رصيد TVA قابل للترحيل أو طلب استرداده من المديرية العامة للضرائب.',
              },
            ],
          },
          {
            h2: 'كيفية تقديم تصريح TVA عبر Simpl-TVA',
            blocks: [
              {
                type: 'ol',
                items: [
                  'سجِّل الدخول على simpl.tax.gov.ma بمعرِّفاتك الجبائية',
                  'اختر قسم "Simpl-TVA" من لوحة القيادة الجبائية',
                  'حدِّد الفترة المعنية (الشهر أو الربع حسب نظامك)',
                  'أدخل رقم أعمالك الخاضع للضريبة (HT) وTVA المحصَّلة حسب المعدل',
                  'أدخل مبالغ TVA القابلة للخصم المُثبَتة بفواتير موردين مطابقة',
                  'يحسب النظام تلقائياً TVA الصافية المستحقة أو الرصيد المُرحَّل',
                  'أؤدِّ المبلغ إلكترونياً أو في الوكالة قبل الموعد النهائي',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'آجال التصريح والغرامات',
                body: 'يجب إيداع التصريح قبل الـ 20 من الشهر الموالي للفترة. أي تأخير: زيادة 10% + 5% عن كل شهر إضافي. التسوية التلقائية قبل أي مراقبة جبائية قد تُخفِّف من الغرامات.',
              },
            ],
          },
          {
            h2: 'النظام الشهري مقابل النظام الربعي',
            blocks: [
              {
                type: 'table',
                headers: ['النظام', 'رقم الأعمال السنوي', 'الدورية', 'الموعد النهائي'],
                rows: [
                  ['الشهري', 'رقم الأعمال > 1,000,000 درهم', 'كل شهر', 'قبل الـ 20 من الشهر الموالي'],
                  ['الربعي', 'رقم الأعمال ≤ 1,000,000 درهم', 'كل ربع سنة', 'قبل الـ 20 من الشهر الموالي للربع'],
                ],
              },
              {
                type: 'p',
                text: 'تصريح الربع الأول يُودَع قبل 20 أبريل، الربع الثاني قبل 20 يوليوز، الربع الثالث قبل 20 أكتوبر، الربع الرابع قبل 20 يناير.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'الاختيار للنظام الشهري',
                body: 'حتى لو لم يتجاوز رقم أعمالك 1,000,000 درهم، يمكنك الاختيار الطوعي للنظام الشهري — مفيد إذا كانت لديك أرصدة TVA متكررة تريد استردادها بسرعة.',
              },
            ],
          },
          {
            h2: 'أبرز 5 أخطاء شائعة يجب تجنبها',
            blocks: [
              {
                type: 'ul',
                items: [
                  'تطبيق المعدل الخاطئ: فاتُرة خدمة بـ 20% بينما تستحق 10% يُولِّد تحميلاً زائداً أو خطراً جبائياً',
                  'الخلط بين HT وTTC في رقم أعمالك: رقم الأعمال المُصرَّح هو HT لا TTC المحصَّل',
                  'إهمال خصم TVA على المشتريات: تدفع للدولة أكثر من اللازم',
                  'قبول فواتير موردين ناقصة: بدون ICE أو معدل أو مبلغ TVA لا تُخصَم جبائياً',
                  'التأخر في التصريح: زيادة 10% من اليوم الأول — ضع تذكيراً في مفكرتك',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'أدِّر TVA الخاصة بك بسهولة مع Sayerli',
                body: 'يُولِّد Sayerli تلقائياً تصريح TVA انطلاقاً من فواتيرك ومصاريفك — TVA المحصَّلة، TVA القابلة للخصم، TVA الصافية المستحقة. صدِّر PDF جاهزاً للتقديم لمحاسبك أو للمديرية العامة للضرائب. لا حسابات يدوية، لا نسيان مواعيد.',
                href: '/register',
                cta: 'جرِّب Sayerli مجاناً',
              },
            ],
          },
        ],
      },
    },
  },

  'modele-facture-maroc': {
    slug: 'modele-facture-maroc',
    image: '/blog/modele-facture-maroc.webp',
    readingTime: 8,
    content: {

      fr: {
        title: 'Modèle de facture au Maroc : Word, PDF et Excel — guide complet 2025',
        description: 'Téléchargez un modèle de facture gratuit pour le Maroc : Word, PDF et Excel avec toutes les mentions obligatoires. Guide complet pour freelancers, auto-entrepreneurs et PME marocaines.',
        intro: [
          {
            type: 'p',
            text: 'Chaque jour, des milliers de freelancers et de PME au Maroc ouvrent Word ou Excel pour créer une facture à la main. Le résultat : une numérotation incohérente, des mentions légales manquantes, des calculs TVA approximatifs, et un document qui ne inspire pas confiance au client. Pire, en cas de contrôle fiscal, une facture incomplète peut être rejetée.',
          },
          {
            type: 'p',
            text: 'Dans ce guide, on couvre exactement ce que doit contenir un modèle de facture conforme au Maroc, les formats disponibles (Word, Excel, PDF), leurs avantages et limites, et comment passer à un niveau supérieur pour ne plus jamais se poser ces questions.',
          },
        ],
        sections: [
          {
            h2: 'Les mentions obligatoires sur une facture marocaine en 2025',
            blocks: [
              {
                type: 'p',
                text: 'Avant de choisir un modèle, il faut savoir ce qu\'il doit impérativement contenir. Au Maroc, une facture non conforme peut être refusée par votre client ou rejetée lors d\'un contrôle fiscal. Voici les mentions obligatoires :',
              },
              {
                type: 'table',
                headers: ['Mention', 'Détail'],
                rows: [
                  ['Nom / Raison sociale', 'Votre nom complet ou le nom de votre société'],
                  ['Adresse professionnelle', 'Adresse complète de votre siège ou lieu d\'activité'],
                  ['Identifiant Fiscal (IF)', 'Votre numéro fiscal obtenu à la DGI'],
                  ['ICE', 'Identifiant Commun de l\'Entreprise — obligatoire pour les sociétés'],
                  ['Numéro de facture', 'Séquentiel et unique (ex : FA-2025-001)'],
                  ['Date d\'émission', 'Date de création de la facture'],
                  ['Coordonnées client', 'Nom, adresse, ICE du client pour les B2B'],
                  ['Description prestation', 'Désignation précise du bien ou service fourni'],
                  ['Montant HT', 'Prix unitaire et total hors taxes'],
                  ['Taux et montant TVA', 'Taux applicable (7%, 10%, 14%, 20%) et montant calculé'],
                  ['Total TTC', 'Montant total toutes taxes comprises'],
                  ['Conditions de paiement', 'Délai, mode de paiement, pénalités de retard éventuelles'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Auto-entrepreneur : mention TVA spécifique',
                body: 'Si vous êtes auto-entrepreneur, vous êtes exonéré de TVA. Votre facture doit mentionner : "Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX". N\'inscrivez aucun montant TVA.',
              },
            ],
          },
          {
            h2: 'Modèle de facture Word pour le Maroc',
            blocks: [
              {
                type: 'p',
                text: 'Le modèle Word est le plus utilisé au Maroc par les indépendants qui débutent. Il est simple à personnaliser — logo, couleurs, coordonnées — et ne nécessite aucune compétence technique.',
              },
              {
                type: 'ul',
                items: [
                  'Avantage : personnalisation facile, mise en page libre, aucun abonnement',
                  'Avantage : compatible avec toutes les versions de Word et LibreOffice',
                  'Limite : numérotation manuelle — risque de doublons ou de sauts de numéros',
                  'Limite : aucun calcul automatique — erreurs fréquentes sur les totaux HT/TVA/TTC',
                  'Limite : pas de suivi des paiements — vous ne savez pas qui a payé et qui ne l\'a pas fait',
                  'Limite : chaque facture est un fichier séparé — archivage complexe',
                ],
              },
              {
                type: 'p',
                text: 'Un bon modèle Word pour le Maroc doit comporter : un en-tête avec logo et coordonnées, un bloc client, un tableau de lignes (description / quantité / prix unitaire HT / total HT), un récapitulatif TVA, et un pied de page avec conditions de paiement et coordonnées bancaires (RIB).',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Le problème de la numérotation manuelle',
                body: 'La loi marocaine exige une numérotation séquentielle et sans interruption. Si vous sautez un numéro (FA-2025-003 après FA-2025-001), cela peut être interprété comme une facture dissimulée lors d\'un contrôle fiscal. Avec un modèle Word, c\'est un risque réel.',
              },
            ],
          },
          {
            h2: 'Modèle de facture Excel pour le Maroc',
            blocks: [
              {
                type: 'p',
                text: 'Le modèle Excel est préféré par ceux qui veulent que les calculs soient automatiques. Les formules se chargent de la TVA et du total TTC, ce qui réduit les erreurs arithmétiques.',
              },
              {
                type: 'ul',
                items: [
                  'Avantage : calculs automatiques (HT × TVA = TTC) avec des formules simples',
                  'Avantage : peut servir de journal de suivi si bien structuré',
                  'Avantage : export PDF natif depuis Excel',
                  'Limite : mise en page difficile à contrôler — sauts de page aléatoires à l\'impression',
                  'Limite : partage par email peu professionnel — le client reçoit un fichier modifiable',
                  'Limite : pas de gestion des relances, des impayés ou des devis associés',
                ],
              },
              {
                type: 'p',
                text: 'La structure recommandée pour un modèle Excel marocain : un onglet "Facture" avec le template visuel, un onglet "Registre" listant toutes vos factures avec numéro, date, client, montant et statut de paiement. Le registre devient votre journal des ventes pour vos déclarations fiscales.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Excel n\'est pas un logiciel de facturation',
                body: 'Un fichier Excel partagé par email peut être modifié par votre client après réception. Une facture PDF horodatée et envoyée depuis un logiciel crée une preuve juridique bien plus solide.',
              },
            ],
          },
          {
            h2: 'Modèle de facture PDF pour le Maroc',
            blocks: [
              {
                type: 'p',
                text: 'Le PDF est le format de référence pour la facturation professionnelle. Un fichier PDF est non modifiable, compatible sur tous les appareils, et peut être archivé facilement. Pour créer une facture PDF conforme au Maroc, deux approches :',
              },
              {
                type: 'ol',
                items: [
                  'Créer dans Word ou Excel puis exporter en PDF — simple mais vous conservez tous les inconvénients de ces outils',
                  'Utiliser un logiciel de facturation qui génère directement le PDF avec toutes les mentions légales — la solution professionnelle',
                ],
              },
              {
                type: 'p',
                text: 'Le PDF généré par un logiciel de facturation inclut généralement : logo et branding de votre entreprise, toutes les mentions légales automatiquement remplies, numérotation automatique, calcul TVA exact, et possibilité d\'ajouter un lien de paiement en ligne.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Le PDF, c\'est la norme chez vos clients grands comptes',
                body: 'Les grandes entreprises et administrations marocaines exigent des factures en PDF avec ICE, IF et toutes les mentions légales. Un document Word ou Excel risque d\'être refusé par leur service comptabilité.',
              },
            ],
          },
          {
            h2: 'Comment numéroter vos factures correctement au Maroc',
            blocks: [
              {
                type: 'p',
                text: 'La numérotation des factures est un point souvent négligé qui peut coûter cher en cas de contrôle. Voici les règles à respecter :',
              },
              {
                type: 'ul',
                items: [
                  'La numérotation doit être séquentielle et continue — pas de trous, pas de doublons',
                  'Le format recommandé : FA-AAAA-NNN (ex : FA-2025-001, FA-2025-002...)',
                  'La numérotation peut redémarrer chaque année ou être continue — choisissez et restez cohérent',
                  'Les factures annulées doivent être conservées avec la mention "ANNULÉE" — ne les supprimez pas',
                  'Les avoirs (notes de crédit) ont leur propre numérotation séparée (ex : AV-2025-001)',
                ],
              },
              {
                type: 'table',
                headers: ['Format', 'Exemple', 'Usage'],
                rows: [
                  ['FA-AAAA-NNN', 'FA-2025-001', 'Le plus courant — inclut l\'année'],
                  ['AAAA/NNN', '2025/001', 'Simple, adopté par certains comptables'],
                  ['NNN', '00123', 'Numérotation continue sans année — déconseillé'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Une numérotation automatique évite tous ces problèmes',
                body: 'Avec un logiciel de facturation, la numérotation est automatique et inviolable. Vous ne pouvez pas créer deux factures avec le même numéro, ni en supprimer une sans laisser de trace.',
              },
            ],
          },
          {
            h2: 'Les 6 erreurs les plus fréquentes sur les factures marocaines',
            blocks: [
              {
                type: 'ul',
                items: [
                  'IF manquant ou erroné : votre Identifiant Fiscal doit figurer sur chaque facture sans exception',
                  'ICE absent : obligatoire pour les sociétés — sans ICE, votre client B2B ne peut pas déduire la TVA',
                  'TVA mal calculée ou absent : le taux et le montant TVA doivent être explicites (ou la mention d\'exonération pour les auto-entrepreneurs)',
                  'Numérotation incohérente : factures dans le désordre ou numéros répétés',
                  'Description vague : "Prestation de service" ne suffit pas — décrivez précisément ce qui a été fourni',
                  'Conditions de paiement absentes : le délai légal maximum au Maroc est 60 jours — précisez-le',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Une facture rejetée = un paiement retardé',
                body: 'Les services comptabilité des grandes entreprises marocaines retournent systématiquement les factures incomplètes. Chaque erreur peut retarder votre paiement de 30 à 60 jours.',
              },
            ],
          },
          {
            h2: 'Au-delà du modèle : pourquoi Sayerli remplace Word, Excel et PDF',
            blocks: [
              {
                type: 'p',
                text: 'Un modèle Word ou Excel résout la forme, pas le fond. Ce qu\'un modèle ne peut pas faire pour vous :',
              },
              {
                type: 'ul',
                items: [
                  'Numéroter automatiquement vos factures sans risque de doublons',
                  'Calculer et appliquer la TVA correcte selon votre statut',
                  'Envoyer la facture par email directement depuis l\'outil',
                  'Suivre qui a payé, qui est en retard, et relancer automatiquement',
                  'Générer votre journal des ventes pour vos déclarations fiscales',
                  'Créer un devis et le convertir en facture en un clic',
                  'Donner à votre client un portail pour consulter et accepter ses documents',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Créez votre première facture conforme en 2 minutes',
                body: 'Sayerli a été conçu pour les freelancers, auto-entrepreneurs et PME marocaines. Factures PDF professionnelles avec ICE, IF, TVA automatique et numérotation séquentielle. Envoi par email, suivi des paiements, relances automatiques et déclaration TVA intégrée. Essai gratuit — sans carte bancaire.',
                href: '/register',
                cta: 'Créer mon compte gratuit',
              },
            ],
          },
        ],
      },

      en: {
        title: 'Invoice Template for Morocco: Word, PDF and Excel — Complete Guide 2025',
        description: 'Download a free invoice template for Morocco: Word, PDF and Excel with all mandatory fields. Complete guide for freelancers, auto-entrepreneurs and Moroccan SMEs.',
        intro: [
          {
            type: 'p',
            text: 'Every day, thousands of freelancers and SMEs in Morocco open Word or Excel to manually create an invoice. The result: inconsistent numbering, missing legal mentions, approximate VAT calculations, and a document that does not inspire client confidence. Worse, during a tax audit, an incomplete invoice can be rejected entirely.',
          },
          {
            type: 'p',
            text: 'In this guide, we cover exactly what a compliant Moroccan invoice template must contain, the available formats (Word, Excel, PDF), their advantages and limitations, and how to step up to a solution that eliminates these headaches permanently.',
          },
        ],
        sections: [
          {
            h2: 'Mandatory Fields on a Moroccan Invoice in 2025',
            blocks: [
              {
                type: 'p',
                text: 'Before choosing a template, you need to know what it must contain. In Morocco, a non-compliant invoice can be refused by your client or rejected during a tax audit. Here are the mandatory fields:',
              },
              {
                type: 'table',
                headers: ['Field', 'Detail'],
                rows: [
                  ['Name / Company name', 'Your full name or company name'],
                  ['Business address', 'Complete address of your registered office or place of business'],
                  ['Tax Identifier (IF)', 'Your tax number obtained from the DGI'],
                  ['ICE', 'Common Business Identifier — mandatory for companies'],
                  ['Invoice number', 'Sequential and unique (e.g. FA-2025-001)'],
                  ['Issue date', 'Date the invoice was created'],
                  ['Client details', 'Name, address, ICE for B2B transactions'],
                  ['Service description', 'Precise description of the goods or service provided'],
                  ['Pre-tax amount (HT)', 'Unit price and total excluding taxes'],
                  ['VAT rate and amount', 'Applicable rate (7%, 10%, 14%, 20%) and calculated amount'],
                  ['Total including tax (TTC)', 'Grand total with all taxes included'],
                  ['Payment terms', 'Due date, payment method, late payment penalties'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Auto-entrepreneur: specific VAT mention',
                body: 'If you are an auto-entrepreneur, you are exempt from VAT. Your invoice must state: "Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX". Do not include any VAT amount.',
              },
            ],
          },
          {
            h2: 'Word Invoice Template for Morocco',
            blocks: [
              {
                type: 'p',
                text: 'The Word template is the most widely used in Morocco by independent workers starting out. It is easy to customise — logo, colours, contact details — and requires no technical skills.',
              },
              {
                type: 'ul',
                items: [
                  'Advantage: easy personalisation, free layout, no subscription',
                  'Advantage: compatible with all versions of Word and LibreOffice',
                  'Limitation: manual numbering — risk of duplicates or number gaps',
                  'Limitation: no automatic calculations — frequent errors on HT/VAT/TTC totals',
                  'Limitation: no payment tracking — you cannot see who has paid and who has not',
                  'Limitation: each invoice is a separate file — complex archiving',
                ],
              },
              {
                type: 'p',
                text: 'A good Word template for Morocco should include: a header with logo and contact details, a client block, a line-item table (description / quantity / unit price HT / total HT), a VAT summary, and a footer with payment terms and bank details (RIB).',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'The manual numbering problem',
                body: 'Moroccan law requires sequential and uninterrupted numbering. If you skip a number (FA-2025-003 after FA-2025-001), it can be interpreted as a concealed invoice during a tax audit. With a Word template, this is a real risk.',
              },
            ],
          },
          {
            h2: 'Excel Invoice Template for Morocco',
            blocks: [
              {
                type: 'p',
                text: 'The Excel template is preferred by those who want automatic calculations. Formulas handle the VAT and TTC total, reducing arithmetic errors.',
              },
              {
                type: 'ul',
                items: [
                  'Advantage: automatic calculations (HT × VAT = TTC) with simple formulas',
                  'Advantage: can serve as a tracking register if well structured',
                  'Advantage: native PDF export from Excel',
                  'Limitation: difficult layout control — random page breaks when printing',
                  'Limitation: sharing by email is unprofessional — the client receives an editable file',
                  'Limitation: no management of reminders, unpaid invoices or associated quotes',
                ],
              },
              {
                type: 'p',
                text: 'The recommended structure for a Moroccan Excel template: one "Invoice" tab with the visual template, one "Register" tab listing all your invoices with number, date, client, amount and payment status. The register becomes your sales journal for tax declarations.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Excel is not invoicing software',
                body: 'An Excel file shared by email can be modified by your client after receipt. A timestamped PDF invoice sent from dedicated software creates a far stronger legal record.',
              },
            ],
          },
          {
            h2: 'PDF Invoice Template for Morocco',
            blocks: [
              {
                type: 'p',
                text: 'PDF is the reference format for professional invoicing. A PDF file is non-editable, compatible on all devices, and easy to archive. Two approaches to creating a compliant PDF invoice in Morocco:',
              },
              {
                type: 'ol',
                items: [
                  'Create in Word or Excel then export to PDF — simple, but you keep all the drawbacks of those tools',
                  'Use invoicing software that generates the PDF directly with all mandatory legal fields — the professional solution',
                ],
              },
              {
                type: 'p',
                text: 'A PDF generated by invoicing software typically includes: your company logo and branding, all legal fields automatically filled, automatic sequential numbering, accurate VAT calculation, and the option to add an online payment link.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'PDF is the standard for large-account clients',
                body: 'Major Moroccan companies and public administrations require invoices in PDF format with ICE, IF and all mandatory fields. A Word or Excel document is likely to be rejected by their accounting department.',
              },
            ],
          },
          {
            h2: 'How to Number Your Invoices Correctly in Morocco',
            blocks: [
              {
                type: 'p',
                text: 'Invoice numbering is often overlooked but can be costly during an audit. Here are the rules to follow:',
              },
              {
                type: 'ul',
                items: [
                  'Numbering must be sequential and continuous — no gaps, no duplicates',
                  'Recommended format: FA-YYYY-NNN (e.g. FA-2025-001, FA-2025-002...)',
                  'Numbering can restart each year or be continuous — choose one and stay consistent',
                  'Cancelled invoices must be kept with the note "CANCELLED" — never delete them',
                  'Credit notes have their own separate numbering (e.g. AV-2025-001)',
                ],
              },
              {
                type: 'table',
                headers: ['Format', 'Example', 'Usage'],
                rows: [
                  ['FA-YYYY-NNN', 'FA-2025-001', 'Most common — includes the year'],
                  ['YYYY/NNN', '2025/001', 'Simple, adopted by some accountants'],
                  ['NNN', '00123', 'Continuous numbering without year — not recommended'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Automatic numbering eliminates all these problems',
                body: 'With invoicing software, numbering is automatic and tamper-proof. You cannot create two invoices with the same number, nor delete one without leaving a trace.',
              },
            ],
          },
          {
            h2: 'The 6 Most Common Errors on Moroccan Invoices',
            blocks: [
              {
                type: 'ul',
                items: [
                  'Missing or incorrect IF: your Tax Identifier must appear on every invoice without exception',
                  'Absent ICE: mandatory for companies — without ICE, your B2B client cannot deduct the VAT',
                  'Missing or miscalculated VAT: the rate and VAT amount must be explicit (or the exemption mention for auto-entrepreneurs)',
                  'Inconsistent numbering: out-of-order invoices or repeated numbers',
                  'Vague description: "Service provision" is not enough — describe precisely what was delivered',
                  'Missing payment terms: the legal maximum in Morocco is 60 days — specify it',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'A rejected invoice = a delayed payment',
                body: 'Accounting departments at large Moroccan companies routinely return incomplete invoices. Each error can delay your payment by 30 to 60 days.',
              },
            ],
          },
          {
            h2: 'Beyond the Template: Why Sayerli Replaces Word, Excel and PDF',
            blocks: [
              {
                type: 'p',
                text: 'A Word or Excel template solves the appearance, not the substance. Here is what a template cannot do for you:',
              },
              {
                type: 'ul',
                items: [
                  'Automatically number invoices with no risk of duplicates',
                  'Calculate and apply the correct VAT rate based on your status',
                  'Send the invoice by email directly from the tool',
                  'Track who has paid, who is late, and send automatic reminders',
                  'Generate your sales journal for tax declarations',
                  'Convert a quote to an invoice in one click',
                  'Give your client a portal to view and accept their documents',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'Create your first compliant invoice in 2 minutes',
                body: 'Sayerli is built for Moroccan freelancers, auto-entrepreneurs and SMEs. Professional PDF invoices with ICE, IF, automatic VAT and sequential numbering. Email sending, payment tracking, automatic reminders and integrated VAT declaration. Free trial — no credit card.',
                href: '/register',
                cta: 'Create my free account',
              },
            ],
          },
        ],
      },

      ar: {
        title: 'نموذج فاتورة في المغرب: Word وPDF وExcel — دليل شامل 2025',
        description: 'حمّل نموذج فاتورة مجاني للمغرب: Word وPDF وExcel مع جميع البيانات الإلزامية. دليل شامل للمستقلين والمقاولين الذاتيين والمقاولات الصغيرة والمتوسطة.',
        intro: [
          {
            type: 'p',
            text: 'كل يوم، آلاف المستقلين والمقاولات في المغرب يفتحون Word أو Excel لإنشاء فاتورة يدوياً. النتيجة: ترقيم غير منتظم، بيانات قانونية ناقصة، حسابات TVA تقريبية، ووثيقة لا تُوحي بالثقة للعميل. والأسوأ أن فاتورة ناقصة قد تُرفض عند مراقبة جبائية.',
          },
          {
            type: 'p',
            text: 'في هذا الدليل، نغطي بدقة ما يجب أن يتضمنه نموذج فاتورة مطابق في المغرب، والصيغ المتاحة (Word وExcel وPDF)، ومزاياها وحدودها، وكيف ترتقي إلى مستوى أعلى يجعلك تنسى هذه الأسئلة نهائياً.',
          },
        ],
        sections: [
          {
            h2: 'البيانات الإلزامية في الفاتورة المغربية 2025',
            blocks: [
              {
                type: 'p',
                text: 'قبل اختيار نموذج، عليك معرفة ما يجب أن يتضمنه حتماً. في المغرب، فاتورة غير مطابقة قد يرفضها عميلك أو تُردّ عند مراقبة جبائية. إليك البيانات الإلزامية:',
              },
              {
                type: 'table',
                headers: ['البيان', 'التفصيل'],
                rows: [
                  ['الاسم / الشخصية القانونية', 'اسمك الكامل أو اسم شركتك'],
                  ['العنوان المهني', 'عنوان مقرك الاجتماعي أو مكان ممارسة النشاط'],
                  ['المعرِّف الجبائي (IF)', 'رقمك الجبائي المحصَّل من المديرية العامة للضرائب'],
                  ['ICE', 'المعرِّف المشترك للمقاولة — إلزامي للشركات'],
                  ['رقم الفاتورة', 'متسلسل وفريد (مثال: FA-2025-001)'],
                  ['تاريخ الإصدار', 'تاريخ إنشاء الفاتورة'],
                  ['بيانات العميل', 'الاسم والعنوان وICE للمعاملات B2B'],
                  ['وصف الخدمة', 'وصف دقيق للسلعة أو الخدمة المقدَّمة'],
                  ['المبلغ خارج الضريبة (HT)', 'سعر الوحدة والإجمالي خارج الضريبة'],
                  ['معدل ومبلغ TVA', 'المعدل المطبَّق (7%، 10%، 14%، 20%) والمبلغ المحسوب'],
                  ['الإجمالي الشامل للضريبة (TTC)', 'المبلغ الكلي شاملاً جميع الضرائب'],
                  ['شروط الدفع', 'الأجل، طريقة الدفع، وعقوبات التأخير إن وُجدت'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'المقاول الذاتي: بيان TVA الخاص',
                body: 'إذا كنت مقاولاً ذاتياً، فأنت معفًى من TVA. يجب أن تتضمن فاتورتك: "Exonéré de TVA — Auto-entrepreneur IF n° XXXXXXXX". لا تُدرج أي مبلغ TVA.',
              },
            ],
          },
          {
            h2: 'نموذج فاتورة Word للمغرب',
            blocks: [
              {
                type: 'p',
                text: 'نموذج Word هو الأكثر استخداماً في المغرب من قِبَل المستقلين في بداية مسيرتهم. سهل التخصيص — شعار، ألوان، بيانات الاتصال — ولا يتطلب أي مهارات تقنية.',
              },
              {
                type: 'ul',
                items: [
                  'ميزة: تخصيص سهل، تخطيط حر، لا اشتراك',
                  'ميزة: متوافق مع جميع إصدارات Word وLibreOffice',
                  'حد: ترقيم يدوي — خطر التكرار أو وجود ثغرات في الأرقام',
                  'حد: لا حسابات تلقائية — أخطاء متكررة في مجاميع HT/TVA/TTC',
                  'حد: لا تتبع للمدفوعات — لا تعرف من دفع ومن لم يدفع',
                  'حد: كل فاتورة ملف منفصل — أرشفة معقدة',
                ],
              },
              {
                type: 'p',
                text: 'نموذج Word جيد للمغرب يجب أن يتضمن: رأس صفحة بالشعار وبيانات الاتصال، كتلة العميل، جدول السطور (الوصف / الكمية / سعر الوحدة HT / الإجمالي HT)، ملخص TVA، وتذييل بشروط الدفع والبيانات البنكية (RIB).',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'مشكلة الترقيم اليدوي',
                body: 'يشترط القانون المغربي ترقيماً متسلسلاً ومتواصلاً. إذا أسقطت رقماً (FA-2025-003 بعد FA-2025-001)، فقد يُفسَّر ذلك على أنه فاتورة مخفية عند مراقبة جبائية. مع نموذج Word، هذا خطر حقيقي.',
              },
            ],
          },
          {
            h2: 'نموذج فاتورة Excel للمغرب',
            blocks: [
              {
                type: 'p',
                text: 'يُفضَّل نموذج Excel من قِبَل من يريد حسابات تلقائية. تتولى الصيغ حساب TVA والإجمالي TTC، مما يقلل الأخطاء الحسابية.',
              },
              {
                type: 'ul',
                items: [
                  'ميزة: حسابات تلقائية (HT × TVA = TTC) بصيغ بسيطة',
                  'ميزة: يمكن أن يكون سجلاً للمتابعة إذا نُظِّم جيداً',
                  'ميزة: تصدير PDF مدمج من Excel',
                  'حد: تخطيط صعب التحكم — فواصل صفحات عشوائية عند الطباعة',
                  'حد: المشاركة بالبريد الإلكتروني غير احترافية — العميل يستلم ملفاً قابلاً للتعديل',
                  'حد: لا إدارة للتذكيرات أو المستحقات غير المدفوعة أو عروض الأسعار المرتبطة',
                ],
              },
              {
                type: 'p',
                text: 'الهيكل الموصى به لنموذج Excel المغربي: علامة تبويب "الفاتورة" بالنموذج البصري، وعلامة تبويب "السجل" تُدرج جميع فواتيرك مع الرقم والتاريخ والعميل والمبلغ وحالة الدفع. يصبح السجل دفتر مبيعاتك للتصريحات الجبائية.',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Excel ليس برنامج فوترة',
                body: 'ملف Excel مشارَك بالبريد الإلكتروني يمكن تعديله من قِبَل عميلك بعد الاستلام. فاتورة PDF مؤرَّخة ومُرسَلة من برنامج مخصص توفر سنداً قانونياً أقوى بكثير.',
              },
            ],
          },
          {
            h2: 'نموذج فاتورة PDF للمغرب',
            blocks: [
              {
                type: 'p',
                text: 'PDF هو صيغة المرجع في الفوترة الاحترافية. ملف PDF غير قابل للتعديل، متوافق مع جميع الأجهزة، وسهل الأرشفة. لإنشاء فاتورة PDF مطابقة في المغرب، ثمة مقاربتان:',
              },
              {
                type: 'ol',
                items: [
                  'الإنشاء في Word أو Excel ثم التصدير إلى PDF — بسيط لكن تبقى كل عيوب هذه الأدوات',
                  'استخدام برنامج فوترة يُولِّد PDF مباشرةً مع جميع البيانات القانونية — الحل الاحترافي',
                ],
              },
              {
                type: 'p',
                text: 'PDF الصادر عن برنامج فوترة يتضمن عادةً: شعار المقاولة وهويتها البصرية، جميع البيانات القانونية مملوءة تلقائياً، ترقيم تلقائي متسلسل، حساب TVA دقيق، وإمكانية إضافة رابط دفع إلكتروني.',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'PDF هو المعيار لدى عملاء الحسابات الكبيرة',
                body: 'الشركات الكبيرة والإدارات المغربية تشترط فواتير بصيغة PDF مع ICE وIF وجميع البيانات الإلزامية. وثيقة Word أو Excel على الأرجح ستُردّ من قِبَل قسم المحاسبة.',
              },
            ],
          },
          {
            h2: 'كيفية ترقيم فواتيرك بشكل صحيح في المغرب',
            blocks: [
              {
                type: 'ul',
                items: [
                  'الترقيم يجب أن يكون متسلسلاً ومتواصلاً — لا ثغرات، لا تكرار',
                  'الصيغة الموصى بها: FA-SSSS-NNN (مثال: FA-2025-001، FA-2025-002...)',
                  'يمكن إعادة الترقيم كل سنة أو بشكل مستمر — اختر وابقَ متسقاً',
                  'الفواتير الملغاة تُحتفظ بها مع عبارة "ملغاة" — لا تحذفها أبداً',
                  'الإشعارات الدائنة (notes de crédit) لها ترقيمها الخاص المستقل (مثال: AV-2025-001)',
                ],
              },
              {
                type: 'table',
                headers: ['الصيغة', 'مثال', 'الاستخدام'],
                rows: [
                  ['FA-SSSS-NNN', 'FA-2025-001', 'الأكثر شيوعاً — يتضمن السنة'],
                  ['SSSS/NNN', '2025/001', 'بسيطة، يعتمدها بعض المحاسبين'],
                  ['NNN', '00123', 'ترقيم مستمر بدون سنة — غير موصى به'],
                ],
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'الترقيم التلقائي يحل كل هذه المشكلات',
                body: 'مع برنامج فوترة، الترقيم تلقائي ومحمي. لا يمكنك إنشاء فاتورتين بنفس الرقم، ولا حذف فاتورة دون ترك أثر.',
              },
            ],
          },
          {
            h2: 'أبرز 6 أخطاء شائعة في الفواتير المغربية',
            blocks: [
              {
                type: 'ul',
                items: [
                  'IF مفقود أو خاطئ: معرِّفك الجبائي يجب أن يظهر على كل فاتورة دون استثناء',
                  'ICE غائب: إلزامي للشركات — بدون ICE لا يستطيع عميلك B2B خصم TVA',
                  'TVA منقوصة أو محسوبة خطأً: المعدل والمبلغ يجب أن يكونا صريحَيْن (أو بيان الإعفاء للمقاولين الذاتيين)',
                  'ترقيم غير منتظم: فواتير مبعثرة أو أرقام متكررة',
                  'وصف مبهم: "تقديم خدمة" لا يكفي — صِف بدقة ما قُدِّم',
                  'شروط الدفع غائبة: الحد القانوني الأقصى في المغرب 60 يوماً — حدِّده صراحةً',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'فاتورة مردودة = تأخر في الدفع',
                body: 'أقسام المحاسبة في الشركات الكبيرة المغربية ترفض بشكل منتظم الفواتير الناقصة. كل خطأ قد يؤخر دفعتك 30 إلى 60 يوماً.',
              },
            ],
          },
          {
            h2: 'ما وراء النموذج: لماذا Sayerli يُغني عن Word وExcel وPDF',
            blocks: [
              {
                type: 'p',
                text: 'نموذج Word أو Excel يحل الشكل لا الجوهر. ما لا يستطيعه أي نموذج:',
              },
              {
                type: 'ul',
                items: [
                  'ترقيم فواتيرك تلقائياً دون خطر التكرار',
                  'حساب وتطبيق معدل TVA الصحيح حسب وضعيتك',
                  'إرسال الفاتورة بالبريد الإلكتروني مباشرةً من الأداة',
                  'تتبع من دفع ومن تأخر وإرسال تذكيرات تلقائية',
                  'توليد دفتر مبيعاتك للتصريحات الجبائية',
                  'تحويل عرض السعر إلى فاتورة بنقرة واحدة',
                  'منح عميلك بوابة لاستشارة وثائقه وقبولها',
                ],
              },
              {
                type: 'callout',
                variant: 'sayerli',
                title: 'أنشئ أول فاتورة مطابقة في دقيقتين',
                body: 'Sayerli مصمَّم للمستقلين والمقاولين الذاتيين والمقاولات الصغيرة والمتوسطة المغربية. فواتير PDF احترافية مع ICE وIF وTVA تلقائية وترقيم متسلسل. إرسال بالبريد الإلكتروني، تتبع المدفوعات، تذكيرات تلقائية وتصريح TVA مدمج. تجربة مجانية — بدون بطاقة بنكية.',
                href: '/register',
                cta: 'إنشاء حسابي المجاني',
              },
            ],
          },
        ],
      },
    },
  },
}
