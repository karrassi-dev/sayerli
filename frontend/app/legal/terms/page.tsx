'use client'

import { useState } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'fr' | 'ar'

const content = {
  en: {
    dir: 'ltr' as const,
    title: 'Terms of Service',
    effective: 'Effective Date: June 18, 2026',
    back: '← Back to Sayerli',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: [
          'These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and Sayerli ("we", "us", "our"), the operator of the software-as-a-service platform available at https://sayerli.com.',
          'By registering for an account, accessing the platform, or using any feature of Sayerli, you agree to be bound by these Terms. If you are using Sayerli on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.',
          'If you do not agree to these Terms, you must not use Sayerli. We reserve the right to update these Terms at any time, with notice provided as described in Section 18.',
        ],
      },
      {
        heading: '2. Description of Service',
        body: [
          'Sayerli is a cloud-based business management SaaS platform designed for Moroccan small and medium-sized enterprises (SMEs), freelancers, and independent accountants. The platform provides the following core features:',
          '• **CRM (Client Management):** Create, manage, and track client records',
          '• **Quotes (Devis):** Generate professional quotes compliant with Moroccan standards, including MAD currency, 20% VAT, ICE, and RC fields. Send quotes to clients via a secure public link and receive digital acceptances or rejections.',
          '• **Invoices (Factures):** Generate professional invoices, track their status (Draft, Sent, Viewed, Overdue, Paid, Cancelled), and share them with clients via a secure public link.',
          '• **Payment Tracking:** Record and track client payments, including client payment declarations.',
          '• **Team Management:** Invite team members with role-based access controls.',
          '• **Notifications:** Real-time in-app and email notifications for key business events.',
          '• **Dashboard & Analytics:** Business performance overview with real-time data.',
          'We reserve the right to modify, suspend, or discontinue features at any time, with reasonable prior notice where feasible.',
        ],
      },
      {
        heading: '3. Account Registration',
        body: [
          'To use Sayerli, you must create an account by providing accurate, complete, and current information. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
          'You must confirm your email address via the confirmation link sent upon registration before accessing the full platform. Unconfirmed accounts may have limited access.',
          'You agree to immediately notify us at support@sayerli.com if you become aware of any unauthorized use of your account or any security breach.',
          'You may not create more than one personal account. You may not use another person\'s account without their explicit permission.',
          'Sayerli operates a multi-tenant architecture. Each company\'s data is strictly isolated. You agree not to attempt to access any other company\'s data.',
        ],
      },
      {
        heading: '4. Subscription Plans and Billing',
        body: [
          'Sayerli offers the following subscription plans:',
          '• **STARTER (Free):** Access to core features with usage limits. No credit card required.',
          '• **PRO:** Full feature access with higher limits, including email notifications. Billed monthly or annually.',
          '• **BUSINESS:** Maximum feature access and limits for growing teams. Billed monthly or annually.',
          'Plan features, limits, and pricing are described on https://sayerli.com. We reserve the right to modify pricing with at least 30 days\' notice to existing subscribers.',
          'Paid subscriptions are billed in advance on a monthly or annual cycle. Subscriptions renew automatically unless cancelled before the renewal date.',
          'If a paid subscription expires and is not renewed, your account will automatically downgrade to the STARTER plan. Your data will be retained, but features and limits will be adjusted accordingly.',
          'All billing and payment processing is handled by Lemon Squeezy as described in Section 5.',
        ],
      },
      {
        heading: '5. Payment Processing by Lemon Squeezy',
        body: [
          'All payments for Sayerli paid subscriptions are processed by Lemon Squeezy (LemonSqueezy, LLC), which acts as our Merchant of Record. As Merchant of Record, Lemon Squeezy is the seller of record for all transactions and is responsible for managing payment processing, invoicing, applicable taxes (including VAT where required), refunds, and chargebacks.',
          'When you purchase a paid subscription, you will be directed to Lemon Squeezy\'s secure checkout page. Your payment information is governed by Lemon Squeezy\'s Terms of Service and Privacy Policy. Sayerli does not store, process, or have access to your payment card information.',
          'By purchasing a subscription, you also agree to Lemon Squeezy\'s Terms of Service available at https://www.lemonsqueezy.com/terms.',
          'Any billing disputes, refund requests, or payment-related issues should be submitted to support@sayerli.com. Refunds are subject to our Refund Policy available at https://sayerli.com/legal/refund.',
        ],
      },
      {
        heading: '6. Free Trial',
        body: [
          'Sayerli may offer a free trial period for paid plans from time to time. The duration and terms of any free trial will be communicated at the time of the offer.',
          'During a free trial, you have access to the features of the trial plan. At the end of the trial period, your subscription will automatically convert to a paid subscription unless you cancel before the trial ends.',
          'Only one free trial per user or company is permitted. We reserve the right to modify or discontinue free trial offers at any time.',
        ],
      },
      {
        heading: '7. Acceptable Use Policy',
        body: [
          'You agree to use Sayerli only for lawful business purposes. You agree not to:',
          '• Use the platform to store, transmit, or process any content that is illegal, fraudulent, misleading, defamatory, or that violates any applicable law',
          '• Attempt to gain unauthorized access to any part of the platform, other user accounts, or our infrastructure',
          '• Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the platform',
          '• Use automated scripts, bots, or scrapers to access the platform',
          '• Interfere with or disrupt the integrity or performance of the service',
          '• Use the platform to send spam, unsolicited messages, or to conduct phishing activities',
          '• Resell, sublicense, or otherwise commercialize access to the platform without written permission',
          '• Upload viruses, malware, or any other harmful code',
          'Violation of this Acceptable Use Policy may result in immediate account suspension or termination.',
        ],
      },
      {
        heading: '8. User Data and Content',
        body: [
          'You retain full ownership of all data and content you input into Sayerli, including client information, quotes, invoices, and business records ("Your Content"). By using the platform, you grant us a limited, non-exclusive, royalty-free license to store, process, and display Your Content solely for the purpose of providing the service to you.',
          'You are solely responsible for the accuracy, legality, and integrity of Your Content. You represent and warrant that you have the right to input all data you provide into Sayerli.',
          'We will not access, use, or disclose Your Content except as required to provide the service, as instructed by you, or as required by law.',
          'You may export your data at any time from the Settings section of your dashboard. Upon account deletion, your data will be permanently removed from our systems within 30 days, except for billing records which are retained as required by law.',
        ],
      },
      {
        heading: '9. Intellectual Property',
        body: [
          'All rights, title, and interest in and to the Sayerli platform, including its design, code, features, trademarks, logos, and documentation, are owned exclusively by Sayerli and its licensor(s). These Terms do not grant you any intellectual property rights in the platform.',
          'The Sayerli name, logo, and all related marks are trademarks of Sayerli. You may not use them without prior written consent.',
          'Any feedback, suggestions, or ideas you provide to us may be used by us without any obligation or compensation to you.',
        ],
      },
      {
        heading: '10. Service Availability',
        body: [
          'We strive to provide a reliable service but do not guarantee 100% uptime. The platform may be temporarily unavailable due to scheduled maintenance, emergency repairs, or circumstances beyond our control.',
          'We will make reasonable efforts to notify users in advance of planned maintenance. Unplanned outages will be communicated as quickly as practicable.',
          'We are not liable for any losses or damages arising from service unavailability.',
        ],
      },
      {
        heading: '11. Disclaimer of Warranties',
        body: [
          'Sayerli is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
          'We do not warrant that the platform will be error-free, secure, or uninterrupted, or that any defects will be corrected. We do not warrant the accuracy or completeness of any information provided through the platform.',
          'The use of Sayerli is at your sole risk.',
        ],
      },
      {
        heading: '12. Limitation of Liability',
        body: [
          'To the maximum extent permitted by applicable law, Sayerli and its founder shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill, arising out of or in connection with your use of the platform.',
          'Our total aggregate liability to you for any claims arising under or related to these Terms shall not exceed the total amount paid by you to Sayerli in the three (3) months immediately preceding the event giving rise to the claim.',
          'Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitation may not apply to you.',
        ],
      },
      {
        heading: '13. Indemnification',
        body: [
          'You agree to indemnify, defend, and hold harmless Sayerli and its founder from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your access to or use of the platform, your violation of these Terms, or your violation of any rights of a third party.',
        ],
      },
      {
        heading: '14. Account Suspension and Termination',
        body: [
          'You may cancel your account at any time from the Settings section of your dashboard or by contacting us at support@sayerli.com.',
          'We reserve the right to suspend or terminate your account immediately, with or without notice, if we determine that you have violated these Terms, engaged in fraudulent activity, or if required to do so by law.',
          'Upon termination, your access to the platform will cease. Your data will be retained for 30 days to allow for export, after which it will be permanently deleted, except for billing records required by law.',
          'Cancellation of a paid subscription does not automatically entitle you to a refund. Refunds are governed by our Refund Policy.',
        ],
      },
      {
        heading: '15. Governing Law',
        body: [
          'These Terms shall be governed by and construed in accordance with the laws of the Kingdom of Morocco, without regard to its conflict of law provisions.',
          'Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation between the parties. If unresolved within 30 days, disputes shall be submitted to the competent courts of Morocco.',
        ],
      },
      {
        heading: '16. Changes to Terms',
        body: [
          'We reserve the right to modify these Terms at any time. Material changes will be communicated via email or a prominent notice on the platform at least 14 days before they take effect.',
          'Your continued use of Sayerli after the effective date of any change constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the platform.',
        ],
      },
      {
        heading: '17. Miscellaneous',
        body: [
          'These Terms constitute the entire agreement between you and Sayerli regarding the use of the platform and supersede all prior agreements.',
          'If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.',
          'Our failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision.',
        ],
      },
      {
        heading: '18. Contact',
        body: [
          'For questions about these Terms of Service:',
          '**Email:** support@sayerli.com',
          '**Website:** https://sayerli.com',
        ],
      },
    ],
  },
  fr: {
    dir: 'ltr' as const,
    title: "Conditions Générales d'Utilisation",
    effective: "Date d'entrée en vigueur : 18 juin 2026",
    back: '← Retour à Sayerli',
    sections: [
      {
        heading: '1. Acceptation des Conditions',
        body: [
          'Les présentes Conditions Générales d\'Utilisation ("CGU") constituent un accord juridiquement contraignant entre vous ("Utilisateur") et Sayerli ("nous"), l\'exploitant de la plateforme SaaS disponible sur https://sayerli.com.',
          'En créant un compte, en accédant à la plateforme ou en utilisant l\'une de ses fonctionnalités, vous acceptez d\'être lié par ces CGU. Si vous utilisez Sayerli au nom d\'une entreprise, vous déclarez avoir l\'autorité pour engager cette entité.',
          'Si vous n\'acceptez pas ces CGU, vous ne devez pas utiliser Sayerli.',
        ],
      },
      {
        heading: '2. Description du Service',
        body: [
          'Sayerli est une plateforme SaaS de gestion commerciale en cloud conçue pour les PME, les freelancers et les comptables indépendants marocains. Elle comprend notamment :',
          '• **CRM (Gestion Clients) :** Création et gestion des fiches clients',
          '• **Devis :** Création de devis professionnels conformes aux normes marocaines (MAD, TVA 20%, ICE, RC), envoi via lien public, acceptation/refus numérique',
          '• **Factures :** Création de factures, suivi des statuts (Brouillon, Envoyée, Vue, En retard, Payée, Annulée), partage via lien public',
          '• **Suivi des Paiements :** Enregistrement et suivi des règlements clients',
          '• **Gestion d\'Équipe :** Invitation de membres avec contrôle d\'accès par rôle',
          '• **Notifications :** Notifications temps réel in-app et par e-mail',
          '• **Tableau de Bord & Analytique :** Vue d\'ensemble des performances en temps réel',
          'Nous nous réservons le droit de modifier, suspendre ou interrompre des fonctionnalités à tout moment, avec un préavis raisonnable.',
        ],
      },
      {
        heading: '3. Inscription au Compte',
        body: [
          'Pour utiliser Sayerli, vous devez créer un compte en fournissant des informations exactes et complètes. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités réalisées sous votre compte.',
          'Une confirmation par e-mail est requise lors de l\'inscription avant d\'accéder à la plateforme complète.',
          'Sayerli fonctionne en architecture multi-tenant. Les données de chaque entreprise sont strictement isolées. Vous vous engagez à ne pas tenter d\'accéder aux données d\'autres entreprises.',
        ],
      },
      {
        heading: '4. Plans d\'Abonnement et Facturation',
        body: [
          'Sayerli propose les plans suivants :',
          '• **STARTER (Gratuit) :** Accès aux fonctionnalités de base avec des limites d\'utilisation. Aucune carte bancaire requise.',
          '• **PRO :** Accès complet aux fonctionnalités, incluant les notifications par e-mail. Facturation mensuelle ou annuelle.',
          '• **BUSINESS :** Accès maximal pour les équipes en croissance. Facturation mensuelle ou annuelle.',
          'Les abonnements payants sont facturés à l\'avance et se renouvellent automatiquement sauf annulation avant la date de renouvellement.',
          'En cas d\'expiration non renouvelée, le compte est automatiquement rétrogradé au plan STARTER. Vos données sont conservées.',
          'Toute la facturation est gérée par Lemon Squeezy (voir Section 5).',
        ],
      },
      {
        heading: '5. Traitement des Paiements par Lemon Squeezy',
        body: [
          'Tous les paiements des abonnements payants Sayerli sont traités par Lemon Squeezy (LemonSqueezy, LLC), agissant en tant que Marchand de Référence. Lemon Squeezy est le vendeur officiel pour toutes les transactions et est responsable du traitement des paiements, de la facturation, des taxes applicables, des remboursements et des rétrofacturations.',
          'Lors d\'un achat, vous serez dirigé vers le checkout sécurisé de Lemon Squeezy. Vos informations de paiement sont régies par les CGU de Lemon Squeezy. Sayerli n\'a pas accès à vos données bancaires.',
          'En achetant un abonnement, vous acceptez également les CGU de Lemon Squeezy disponibles sur https://www.lemonsqueezy.com/terms.',
          'Pour tout litige de facturation ou demande de remboursement, contactez support@sayerli.com.',
        ],
      },
      {
        heading: '6. Période d\'Essai Gratuite',
        body: [
          'Sayerli peut proposer des périodes d\'essai pour les plans payants. À la fin de la période d\'essai, l\'abonnement se convertit automatiquement en abonnement payant sauf annulation avant la fin.',
          'Une seule période d\'essai par utilisateur ou entreprise est autorisée.',
        ],
      },
      {
        heading: '7. Politique d\'Utilisation Acceptable',
        body: [
          'Vous vous engagez à utiliser Sayerli uniquement à des fins commerciales légales. Vous vous interdisez notamment de :',
          '• Utiliser la plateforme pour stocker ou transmettre des contenus illégaux, frauduleux ou trompeurs',
          '• Tenter d\'accéder sans autorisation à d\'autres comptes ou à notre infrastructure',
          '• Procéder à de l\'ingénierie inverse du code de la plateforme',
          '• Utiliser des scripts automatisés, bots ou scrapers',
          '• Revendre ou sous-licencier l\'accès à la plateforme sans autorisation écrite',
          'Toute violation peut entraîner la suspension ou la résiliation immédiate du compte.',
        ],
      },
      {
        heading: '8. Données et Contenu Utilisateur',
        body: [
          'Vous conservez la pleine propriété de toutes les données et contenus que vous saisissez dans Sayerli. En utilisant la plateforme, vous nous accordez une licence limitée et non exclusive pour traiter ces données dans le seul but de vous fournir le service.',
          'Vous êtes seul responsable de l\'exactitude, de la légalité et de l\'intégrité de vos données.',
          'Vous pouvez exporter vos données à tout moment depuis les Paramètres de votre tableau de bord.',
        ],
      },
      {
        heading: '9. Propriété Intellectuelle',
        body: [
          'Tous les droits sur la plateforme Sayerli, y compris son code, son design, ses fonctionnalités, ses marques et sa documentation, appartiennent exclusivement à Sayerli. Ces CGU ne vous accordent aucun droit de propriété intellectuelle sur la plateforme.',
        ],
      },
      {
        heading: '10. Disponibilité du Service',
        body: [
          'Nous nous efforçons de fournir un service fiable mais ne garantissons pas une disponibilité de 100%. La plateforme peut être temporairement indisponible pour maintenance ou pour des raisons indépendantes de notre volonté. Nous déclinons toute responsabilité pour les pertes découlant d\'une indisponibilité du service.',
        ],
      },
      {
        heading: '11. Exclusion de Garanties',
        body: [
          'Sayerli est fourni "tel quel" et "tel que disponible", sans garantie d\'aucune sorte, expresse ou implicite. Nous ne garantissons pas que la plateforme sera exempte d\'erreurs, sécurisée ou ininterrompue.',
        ],
      },
      {
        heading: '12. Limitation de Responsabilité',
        body: [
          'Dans les limites autorisées par la loi applicable, Sayerli ne pourra pas être tenu responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs découlant de votre utilisation de la plateforme.',
          'Notre responsabilité totale envers vous est limitée au montant total que vous avez payé à Sayerli au cours des trois (3) mois précédant l\'événement à l\'origine de la réclamation.',
        ],
      },
      {
        heading: '13. Indemnisation',
        body: [
          'Vous acceptez d\'indemniser Sayerli et son fondateur contre toute réclamation, responsabilité, dommage ou dépense découlant de votre utilisation de la plateforme, de la violation de ces CGU ou de la violation des droits d\'un tiers.',
        ],
      },
      {
        heading: '14. Suspension et Résiliation du Compte',
        body: [
          'Vous pouvez annuler votre compte à tout moment depuis les Paramètres ou en contactant support@sayerli.com.',
          'Nous nous réservons le droit de suspendre ou résilier votre compte immédiatement en cas de violation de ces CGU ou d\'activité frauduleuse.',
          'À la résiliation, vos données seront conservées 30 jours pour vous permettre de les exporter, puis supprimées définitivement (sauf les données de facturation conservées par obligation légale).',
        ],
      },
      {
        heading: '15. Droit Applicable',
        body: [
          'Les présentes CGU sont régies par le droit du Royaume du Maroc. Tout litige sera d\'abord soumis à une tentative de résolution amiable. En cas d\'échec, les litiges seront portés devant les tribunaux compétents du Maroc.',
        ],
      },
      {
        heading: '16. Modifications des CGU',
        body: [
          'Nous nous réservons le droit de modifier ces CGU à tout moment. Les changements importants vous seront communiqués par e-mail ou via la plateforme au moins 14 jours avant leur entrée en vigueur.',
        ],
      },
      {
        heading: '17. Contact',
        body: [
          'Pour toute question relative aux présentes CGU :',
          '**E-mail :** support@sayerli.com',
          '**Site web :** https://sayerli.com',
        ],
      },
    ],
  },
  ar: {
    dir: 'rtl' as const,
    title: 'شروط الخدمة',
    effective: 'تاريخ السريان: 18 يونيو 2026',
    back: 'العودة إلى Sayerli →',
    sections: [
      {
        heading: '١. قبول الشروط',
        body: [
          'تُشكّل شروط الخدمة هذه ("الشروط") اتفاقية ملزمة قانونياً بينك ("المستخدم") وبين Sayerli ("نحن")، مشغّل منصة SaaS المتاحة على https://sayerli.com.',
          'بإنشاء حساب أو استخدام المنصة أو أي من ميزاتها، فإنك توافق على الالتزام بهذه الشروط. إذا كنت تستخدم Sayerli نيابةً عن شركة، فإنك تُقر بأن لديك صلاحية إلزام تلك الجهة بهذه الشروط.',
        ],
      },
      {
        heading: '٢. وصف الخدمة',
        body: [
          'Sayerli منصة إدارة أعمال سحابية مصممة للمقاولات الصغيرة والمتوسطة المغربية والمستقلين والمحاسبين. تشمل المنصة:',
          '• **إدارة العملاء (CRM):** إنشاء سجلات العملاء وإدارتها',
          '• **عروض الأسعار (Devis):** إنشاء عروض أسعار احترافية وفق المعايير المغربية (MAD، TVA 20%، ICE، RC)، إرسالها عبر رابط عام، وتلقّي الموافقة أو الرفض رقمياً',
          '• **الفواتير (Factures):** إنشاء فواتير وتتبع حالتها (مسودة، مرسلة، مُطلع عليها، متأخرة، مدفوعة، ملغاة)',
          '• **تتبع المدفوعات:** تسجيل المدفوعات وتتبعها',
          '• **إدارة الفريق:** دعوة أعضاء الفريق مع تحكم في الوصول حسب الدور',
          '• **الإشعارات:** إشعارات فورية داخل التطبيق وعبر البريد الإلكتروني',
          '• **لوحة التحكم والتحليلات:** نظرة عامة على الأداء التجاري',
        ],
      },
      {
        heading: '٣. تسجيل الحساب',
        body: [
          'يجب عليك إنشاء حساب بتقديم معلومات دقيقة وكاملة. أنت مسؤول عن سرية بيانات تسجيل الدخول وعن جميع الأنشطة التي تتم من خلال حسابك.',
          'يُشترط تأكيد عنوان بريدك الإلكتروني عند التسجيل للوصول الكامل إلى المنصة.',
          'تعمل Sayerli بنية متعددة المستأجرين. بيانات كل شركة معزولة تماماً. تلتزم بعدم محاولة الوصول إلى بيانات شركات أخرى.',
        ],
      },
      {
        heading: '٤. خطط الاشتراك والفوترة',
        body: [
          'تقدّم Sayerli الخطط التالية:',
          '• **STARTER (مجاني):** وصول إلى الميزات الأساسية مع حدود استخدام. لا يُشترط بطاقة مصرفية.',
          '• **PRO:** وصول كامل إلى الميزات، يشمل الإشعارات عبر البريد الإلكتروني. فوترة شهرية أو سنوية.',
          '• **BUSINESS:** أقصى وصول للفرق المتنامية. فوترة شهرية أو سنوية.',
          'تُجدَّد الاشتراكات المدفوعة تلقائياً ما لم يتم إلغاؤها قبل تاريخ التجديد. في حال انتهاء الاشتراك دون تجديد، يُنزَّل الحساب تلقائياً إلى خطة STARTER مع الاحتفاظ بالبيانات.',
        ],
      },
      {
        heading: '٥. معالجة المدفوعات بواسطة Lemon Squeezy',
        body: [
          'تُعالَج جميع مدفوعات الاشتراكات المدفوعة في Sayerli بواسطة Lemon Squeezy (LemonSqueezy, LLC)، بوصفها التاجر المرجعي (Merchant of Record). Lemon Squeezy هي البائع الرسمي لجميع المعاملات وتتحمل مسؤولية معالجة المدفوعات والضرائب والمبالغ المستردة والنزاعات.',
          'عند الشراء، ستُوجَّه إلى صفحة الدفع الآمنة الخاصة بـ Lemon Squeezy. لا تتلقى Sayerli بيانات بطاقتك المصرفية ولا تصل إليها.',
          'بشراء اشتراك، تقبل أيضاً شروط خدمة Lemon Squeezy المتاحة على https://www.lemonsqueezy.com/terms.',
        ],
      },
      {
        heading: '٦. الفترة التجريبية المجانية',
        body: [
          'قد تُقدّم Sayerli فترات تجريبية للخطط المدفوعة. في نهاية الفترة التجريبية، يتحوّل الاشتراك تلقائياً إلى اشتراك مدفوع ما لم يتم الإلغاء مسبقاً. تُسمح فترة تجريبية واحدة فقط لكل مستخدم أو شركة.',
        ],
      },
      {
        heading: '٧. سياسة الاستخدام المقبول',
        body: [
          'تلتزم باستخدام Sayerli لأغراض تجارية مشروعة فقط. يُحظر عليك:',
          '• استخدام المنصة لتخزين أو نقل محتوى غير قانوني أو احتيالي أو مضلل',
          '• محاولة الوصول غير المصرح به إلى حسابات أخرى أو بنيتنا التحتية',
          '• إجراء هندسة عكسية لكود المنصة',
          '• استخدام نصوص آلية أو روبوتات',
          '• إعادة بيع الوصول إلى المنصة أو الترخيص الثانوي له دون إذن مكتوب',
          'قد يؤدي انتهاك هذه السياسة إلى تعليق الحساب أو إنهائه فوراً.',
        ],
      },
      {
        heading: '٨. بيانات المستخدم والمحتوى',
        body: [
          'تحتفظ بالملكية الكاملة لجميع البيانات والمحتوى الذي تُدخله في Sayerli. يمكنك تصدير بياناتك في أي وقت من قسم الإعدادات في لوحة التحكم.',
          'أنت وحدك المسؤول عن دقة بياناتك وقانونيتها وسلامتها.',
        ],
      },
      {
        heading: '٩. الملكية الفكرية',
        body: [
          'جميع الحقوق المتعلقة بمنصة Sayerli، بما في ذلك الكود والتصميم والميزات والعلامات التجارية والوثائق، مملوكة حصرياً لـ Sayerli. لا تمنحك هذه الشروط أي حقوق ملكية فكرية على المنصة.',
        ],
      },
      {
        heading: '١٠. توافر الخدمة',
        body: [
          'نسعى لتقديم خدمة موثوقة لكننا لا نضمن توافراً بنسبة 100%. قد تكون المنصة غير متاحة مؤقتاً للصيانة أو لأسباب خارجة عن إرادتنا. لسنا مسؤولين عن أي خسائر ناجمة عن انقطاع الخدمة.',
        ],
      },
      {
        heading: '١١. إخلاء مسؤولية الضمانات',
        body: [
          'تُقدَّم Sayerli "كما هي" و"كما هي متاحة" دون أي ضمانات صريحة أو ضمنية. لا نضمن أن المنصة ستكون خالية من الأخطاء أو آمنة أو غير منقطعة.',
        ],
      },
      {
        heading: '١٢. تحديد المسؤولية',
        body: [
          'في أقصى الحدود التي يسمح بها القانون المعمول به، لن تكون Sayerli ومؤسسها مسؤولَين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية تنجم عن استخدامك للمنصة.',
          'تقتصر مسؤوليتنا الإجمالية تجاهك على المبلغ الإجمالي الذي دفعته لـ Sayerli خلال الثلاثة أشهر السابقة للحادثة.',
        ],
      },
      {
        heading: '١٣. تعليق الحساب وإنهاؤه',
        body: [
          'يمكنك إلغاء حسابك في أي وقت من الإعدادات أو بالتواصل مع support@sayerli.com.',
          'نحتفظ بالحق في تعليق حسابك أو إنهائه فوراً في حال انتهاك هذه الشروط أو ممارسة نشاط احتيالي.',
          'عند الإنهاء، تُحفظ بياناتك 30 يوماً لتتمكن من تصديرها، ثم تُحذف نهائياً.',
        ],
      },
      {
        heading: '١٤. القانون الحاكم',
        body: [
          'تخضع هذه الشروط لقوانين المملكة المغربية. يُحاوَل حل أي نزاع ودياً أولاً، وفي حال الفشل تُحال النزاعات إلى المحاكم المختصة في المغرب.',
        ],
      },
      {
        heading: '١٥. التواصل معنا',
        body: [
          'لأي استفسارات تتعلق بشروط الخدمة:',
          '**البريد الإلكتروني:** support@sayerli.com',
          '**الموقع الإلكتروني:** https://sayerli.com',
        ],
      },
    ],
  },
}

function renderText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-gray-900 dark:text-white">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

export default function TermsPage() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = content[lang]

  return (
    <div dir={t.dir} className="min-h-screen bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 transition-colors">
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            {t.back}
          </Link>
          <div className="flex items-center gap-2">
            {(['fr', 'en', 'ar'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  lang === l
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-4">
            Sayerli Legal
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500">{t.effective}</p>
        </div>

        <div className="space-y-10">
          {t.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph, j) => (
                  <p key={j} className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {renderText(paragraph)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Sayerli. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-indigo-600 dark:text-indigo-400">
            <Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/legal/refund" className="hover:underline">Refund Policy</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
