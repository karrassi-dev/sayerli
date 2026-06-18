'use client'

import { useState } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'fr' | 'ar'

const EFFECTIVE_DATE = 'June 18, 2026'
const EFFECTIVE_DATE_FR = '18 juin 2026'
const EFFECTIVE_DATE_AR = '18 يونيو 2026'

const content = {
  en: {
    dir: 'ltr' as const,
    lang: 'EN',
    title: 'Privacy Policy',
    effective: `Effective Date: ${EFFECTIVE_DATE}`,
    back: '← Back to Sayerli',
    sections: [
      {
        heading: '1. Introduction',
        body: [
          'Sayerli ("we", "us", or "our") operates the cloud-based business management platform available at https://sayerli.com. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you access or use our service.',
          'By registering for an account or using Sayerli, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with the practices described here, please do not use our service.',
          'Sayerli is operated by an individual founder based in Morocco. We are committed to protecting your privacy and handling your data in accordance with applicable data protection laws, including the Moroccan Law 09-08 on the Protection of Personal Data and, where applicable, the European General Data Protection Regulation (GDPR).',
        ],
      },
      {
        heading: '2. Information We Collect',
        body: [
          'We collect the following categories of personal information:',
          '**Account and Identity Data:** When you register, we collect your first name, last name, email address, and a securely hashed password. You may optionally provide a profile photo.',
          '**Company and Business Data:** During onboarding or in your settings, you may provide company name, legal registration number (RC), tax identification number (ICE), business address, banking details (IBAN, RIB, SWIFT — used solely for display on your invoices), and a company logo stored via Cloudinary.',
          '**Business Records You Enter:** All quotes (devis), invoices (factures), client records, payment records, team member information, and declaration data that you input into Sayerli are stored on our behalf. This data belongs to you. We process it solely to provide the service.',
          '**Communication Data:** If you contact our support team, we retain records of that correspondence.',
          '**Technical and Usage Data:** We automatically collect your IP address, browser type, operating system, pages visited, features used, session timestamps, and last access time. This helps us maintain and improve the service.',
          '**Cookies and Session Tokens:** We use secure HTTP-only cookies to maintain your authenticated session. We do not use third-party advertising cookies.',
        ],
      },
      {
        heading: '3. How We Use Your Information',
        body: [
          'We use the information we collect to:',
          '• Provide, operate, and maintain the Sayerli platform',
          '• Authenticate your identity and maintain your session securely',
          '• Process and display your business documents (quotes, invoices, payments)',
          '• Send transactional emails such as account confirmation, password reset, team invitations, and notification alerts via Resend',
          '• Enforce subscription plan limits and feature access controls',
          '• Monitor service health, diagnose technical issues, and prevent abuse',
          '• Communicate product updates, security notices, and service announcements',
          '• Comply with legal obligations and respond to lawful government requests',
          'We do not use your data for advertising purposes, and we do not sell your personal data to any third party.',
        ],
      },
      {
        heading: '4. Payment Processing',
        body: [
          'All payment processing for Sayerli paid subscriptions is handled by Lemon Squeezy (a product of LemonSqueezy, LLC), acting as our Merchant of Record. This means Lemon Squeezy manages the full payment transaction, including billing, invoicing, VAT and tax collection, refunds, and chargebacks on our behalf.',
          'When you purchase a paid subscription, you will be redirected to Lemon Squeezy\'s secure checkout. Your payment card details, billing address, and transaction information are collected and stored solely by Lemon Squeezy. Sayerli never receives, stores, or processes your raw payment card data.',
          'Lemon Squeezy\'s privacy practices are governed by their own Privacy Policy, available at https://www.lemonsqueezy.com/privacy. We encourage you to review it before completing a purchase.',
          'We receive from Lemon Squeezy only the information necessary to activate your subscription: your email address, subscription plan, billing status, and renewal dates.',
        ],
      },
      {
        heading: '5. Cookies and Tracking',
        body: [
          'Sayerli uses a minimal set of cookies necessary to operate the service:',
          '**Authentication Cookies:** Secure, HTTP-only session tokens that keep you logged in during your session. These are strictly necessary and cannot be disabled without preventing you from using the service.',
          '**Preference Cookies:** We may store your language and theme preferences locally in your browser.',
          'We do not use Google Analytics, Meta Pixel, or any third-party tracking or advertising scripts. We do not build advertising profiles based on your behavior.',
        ],
      },
      {
        heading: '6. Data Sharing and Third-Party Services',
        body: [
          'We share your data only with the following trusted service providers, strictly for the purpose of operating the Sayerli platform:',
          '• **Neon (PostgreSQL):** Our primary database, hosted in the US West (Oregon) region, stores all your account, business, and document data.',
          '• **Vercel:** Hosts the Sayerli frontend application. May process request logs containing IP addresses.',
          '• **Railway:** Hosts the Sayerli backend API. May process request logs.',
          '• **Cloudinary:** Stores and serves your uploaded company logo.',
          '• **Resend:** Sends transactional emails on our behalf (account confirmations, password resets, team invitations, notification emails). Your email address is transmitted to Resend for this purpose.',
          '• **Lemon Squeezy:** Handles payment processing as described in Section 4.',
          'We do not share your data with any other third parties. We do not sell, rent, or trade your personal information.',
          'We may disclose your information if required to do so by law or in good faith belief that such disclosure is necessary to comply with a legal obligation, protect our rights, or prevent fraud.',
        ],
      },
      {
        heading: '7. Data Retention',
        body: [
          'We retain your personal data for as long as your account remains active. If you close your account, we will delete or anonymize your personal data within 30 days of your request, except where we are required to retain certain data by law.',
          'Billing and payment records are retained for a minimum of 7 years in compliance with applicable accounting and tax law requirements.',
          'Backup copies of data may persist for up to 90 days after deletion before being permanently purged from backup systems.',
          'Business records (quotes, invoices, client data) that you entered are deleted upon account deletion. If you wish to export your data before deleting your account, you may do so from the Settings section of your dashboard.',
        ],
      },
      {
        heading: '8. Your Rights',
        body: [
          'Depending on your location, you may have the following rights regarding your personal data:',
          '• **Right to Access:** Request a copy of the personal data we hold about you.',
          '• **Right to Rectification:** Request correction of inaccurate or incomplete personal data.',
          '• **Right to Erasure:** Request deletion of your personal data, subject to legal retention requirements.',
          '• **Right to Data Portability:** Request your data in a structured, machine-readable format.',
          '• **Right to Restriction:** Request that we restrict the processing of your data in certain circumstances.',
          '• **Right to Object:** Object to processing of your data where we rely on legitimate interests.',
          '• **Right to Withdraw Consent:** Where processing is based on consent, you may withdraw it at any time.',
          'To exercise any of these rights, please contact us at support@sayerli.com. We will respond to verified requests within 30 days.',
        ],
      },
      {
        heading: '9. International Data Transfers',
        body: [
          'Sayerli is operated from Morocco and our primary database is hosted in the United States (Oregon). When you use our service, your data may be transferred to and processed in countries outside your country of residence, including the United States and the European Union.',
          'We take steps to ensure that such transfers are conducted in accordance with applicable data protection law, including by relying on standard contractual clauses where required under GDPR.',
        ],
      },
      {
        heading: '10. Security',
        body: [
          'We implement industry-standard security measures to protect your personal data:',
          '• All data in transit is encrypted using TLS/HTTPS',
          '• Passwords are hashed using bcrypt — we never store plaintext passwords',
          '• Authentication is managed via signed JWT tokens',
          '• Our multi-tenant architecture ensures strict data isolation between companies — no company can access another company\'s data',
          '• Email confirmation is required upon registration to verify account ownership',
          '• Access to production infrastructure is restricted to authorized personnel only',
          'Despite these measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.',
        ],
      },
      {
        heading: '11. Children\'s Privacy',
        body: [
          'Sayerli is a business software platform intended for use by adults and legal business entities. We do not knowingly collect personal information from individuals under the age of 16. If we become aware that a minor has provided us with personal data without parental consent, we will delete that information promptly.',
        ],
      },
      {
        heading: '12. Changes to This Policy',
        body: [
          'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal obligations. When we make material changes, we will notify you by email or by displaying a prominent notice on the Sayerli platform. The updated policy will be effective as of the date indicated at the top of this page.',
          'Your continued use of Sayerli after the effective date of any revised policy constitutes your acceptance of the changes.',
        ],
      },
      {
        heading: '13. Contact Us',
        body: [
          'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:',
          '**Email:** support@sayerli.com',
          '**Website:** https://sayerli.com',
          'We are committed to resolving any privacy concerns promptly and transparently.',
        ],
      },
    ],
  },
  fr: {
    dir: 'ltr' as const,
    lang: 'FR',
    title: 'Politique de Confidentialité',
    effective: `Date d'entrée en vigueur : ${EFFECTIVE_DATE_FR}`,
    back: '← Retour à Sayerli',
    sections: [
      {
        heading: '1. Introduction',
        body: [
          'Sayerli ("nous", "notre") exploite la plateforme de gestion d\'entreprise en ligne accessible sur https://sayerli.com. La présente Politique de Confidentialité décrit la manière dont nous collectons, utilisons, divulguons et protégeons vos informations personnelles lorsque vous accédez à notre service ou l\'utilisez.',
          'En créant un compte ou en utilisant Sayerli, vous reconnaissez avoir pris connaissance de cette politique. Si vous n\'acceptez pas les pratiques décrites ici, veuillez ne pas utiliser notre service.',
          'Sayerli est géré par un fondateur individuel basé au Maroc. Nous nous engageons à protéger vos données conformément à la loi marocaine 09-08 relative à la protection des personnes physiques à l\'égard du traitement des données à caractère personnel, ainsi qu\'au RGPD lorsqu\'il est applicable.',
        ],
      },
      {
        heading: '2. Informations Collectées',
        body: [
          'Nous collectons les catégories suivantes de données personnelles :',
          '**Données de compte et d\'identité :** Lors de l\'inscription, nous collectons votre prénom, nom, adresse e-mail et un mot de passe sécurisé (haché). Vous pouvez éventuellement fournir une photo de profil.',
          '**Données d\'entreprise :** Lors de la configuration ou dans vos paramètres, vous pouvez renseigner le nom de votre société, le numéro d\'enregistrement légal (RC), le numéro d\'identification fiscale (ICE), l\'adresse professionnelle, les coordonnées bancaires (IBAN, RIB, SWIFT — utilisés uniquement pour l\'affichage sur vos factures) et un logo d\'entreprise stocké via Cloudinary.',
          '**Documents métier que vous saisissez :** Tous les devis, factures, dossiers clients, paiements, informations sur les membres de l\'équipe et déclarations que vous saisissez dans Sayerli sont stockés pour votre compte. Ces données vous appartiennent. Nous les traitons uniquement pour fournir le service.',
          '**Données de communication :** Si vous contactez notre équipe d\'assistance, nous conservons les enregistrements de cette correspondance.',
          '**Données techniques et d\'utilisation :** Nous collectons automatiquement votre adresse IP, le type de navigateur, le système d\'exploitation, les pages visitées, les fonctionnalités utilisées et les horodatages de session.',
          '**Cookies et jetons de session :** Nous utilisons des cookies HTTP-only sécurisés pour maintenir votre session authentifiée. Nous n\'utilisons pas de cookies publicitaires tiers.',
        ],
      },
      {
        heading: '3. Utilisation de Vos Informations',
        body: [
          'Nous utilisons les informations collectées pour :',
          '• Fournir, exploiter et maintenir la plateforme Sayerli',
          '• Authentifier votre identité et maintenir votre session de manière sécurisée',
          '• Traiter et afficher vos documents commerciaux (devis, factures, paiements)',
          '• Envoyer des e-mails transactionnels (confirmation de compte, réinitialisation de mot de passe, invitations d\'équipe) via Resend',
          '• Appliquer les limites des plans d\'abonnement et les contrôles d\'accès aux fonctionnalités',
          '• Surveiller la santé du service et prévenir les abus',
          '• Communiquer les mises à jour produit et les avis de sécurité',
          '• Respecter les obligations légales',
          'Nous n\'utilisons pas vos données à des fins publicitaires et nous ne vendons jamais vos données personnelles.',
        ],
      },
      {
        heading: '4. Traitement des Paiements',
        body: [
          'Tous les paiements pour les abonnements payants Sayerli sont traités par Lemon Squeezy (LemonSqueezy, LLC), agissant en tant que Marchand de Référence (Merchant of Record). Lemon Squeezy gère l\'intégralité de la transaction de paiement, y compris la facturation, la collecte de TVA, les remboursements et les rétrofacturations en notre nom.',
          'Lors de l\'achat d\'un abonnement payant, vous serez redirigé vers le checkout sécurisé de Lemon Squeezy. Vos coordonnées de paiement et informations de transaction sont collectées et stockées uniquement par Lemon Squeezy. Sayerli ne reçoit, ne stocke ni ne traite jamais vos données de carte bancaire brutes.',
          'Les pratiques de confidentialité de Lemon Squeezy sont régies par leur propre Politique de Confidentialité, disponible sur https://www.lemonsqueezy.com/privacy.',
          'Nous recevons de Lemon Squeezy uniquement les informations nécessaires à l\'activation de votre abonnement : adresse e-mail, plan souscrit, statut de facturation et dates de renouvellement.',
        ],
      },
      {
        heading: '5. Cookies et Suivi',
        body: [
          'Sayerli utilise un ensemble minimal de cookies nécessaires au fonctionnement du service :',
          '**Cookies d\'authentification :** Jetons de session sécurisés HTTP-only qui maintiennent votre connexion active. Ces cookies sont strictement nécessaires et ne peuvent pas être désactivés sans vous empêcher d\'utiliser le service.',
          '**Cookies de préférence :** Nous pouvons stocker localement vos préférences de langue et de thème.',
          'Nous n\'utilisons pas Google Analytics, Meta Pixel ni aucun script de suivi ou publicitaire tiers.',
        ],
      },
      {
        heading: '6. Partage des Données et Services Tiers',
        body: [
          'Nous partageons vos données uniquement avec les prestataires de services suivants, dans le seul but d\'exploiter la plateforme Sayerli :',
          '• **Neon (PostgreSQL) :** Notre base de données principale, hébergée en Ouest des États-Unis (Oregon)',
          '• **Vercel :** Héberge l\'application frontend Sayerli',
          '• **Railway :** Héberge l\'API backend Sayerli',
          '• **Cloudinary :** Stocke et diffuse votre logo d\'entreprise',
          '• **Resend :** Envoie des e-mails transactionnels en notre nom',
          '• **Lemon Squeezy :** Gère le traitement des paiements (voir section 4)',
          'Nous ne partageons vos données avec aucun autre tiers. Nous ne vendons, ne louons ni n\'échangeons jamais vos informations personnelles.',
        ],
      },
      {
        heading: '7. Conservation des Données',
        body: [
          'Nous conservons vos données personnelles aussi longtemps que votre compte est actif. Si vous fermez votre compte, nous supprimerons ou anonymiserons vos données personnelles dans les 30 jours suivant votre demande, sauf obligation légale de conservation.',
          'Les données de facturation et de paiement sont conservées pendant au moins 7 ans en conformité avec les obligations légales et fiscales applicables.',
          'Les copies de sauvegarde peuvent persister jusqu\'à 90 jours après la suppression avant d\'être définitivement effacées.',
        ],
      },
      {
        heading: '8. Vos Droits',
        body: [
          'Selon votre localisation, vous disposez des droits suivants concernant vos données personnelles :',
          '• **Droit d\'accès :** Demander une copie de vos données personnelles',
          '• **Droit de rectification :** Demander la correction de données inexactes',
          '• **Droit à l\'effacement :** Demander la suppression de vos données',
          '• **Droit à la portabilité :** Obtenir vos données dans un format structuré',
          '• **Droit à la limitation :** Demander la limitation du traitement',
          '• **Droit d\'opposition :** Vous opposer au traitement fondé sur nos intérêts légitimes',
          'Pour exercer l\'un de ces droits, contactez-nous à support@sayerli.com. Nous répondrons dans les 30 jours suivant votre demande.',
        ],
      },
      {
        heading: '9. Transferts Internationaux de Données',
        body: [
          'Sayerli est exploité depuis le Maroc et notre base de données principale est hébergée aux États-Unis (Oregon). L\'utilisation de notre service implique que vos données peuvent être transférées et traitées dans des pays en dehors de votre pays de résidence.',
          'Nous prenons toutes les mesures appropriées pour garantir que ces transferts respectent la réglementation applicable en matière de protection des données, notamment via des clauses contractuelles types le cas échéant.',
        ],
      },
      {
        heading: '10. Sécurité',
        body: [
          'Nous mettons en œuvre des mesures de sécurité conformes aux standards du secteur :',
          '• Toutes les données en transit sont chiffrées via TLS/HTTPS',
          '• Les mots de passe sont hachés avec bcrypt — nous ne stockons jamais les mots de passe en clair',
          '• L\'authentification est gérée via des tokens JWT signés',
          '• Notre architecture multi-tenant assure une isolation stricte des données entre entreprises',
          '• La confirmation par e-mail est requise lors de l\'inscription',
          'Malgré ces mesures, aucune méthode de transmission sur Internet n\'est sécurisée à 100%.',
        ],
      },
      {
        heading: '11. Mineurs',
        body: [
          'Sayerli est une plateforme logicielle professionnelle destinée aux adultes et aux entités commerciales légales. Nous ne collectons pas sciemment d\'informations personnelles auprès de personnes âgées de moins de 16 ans.',
        ],
      },
      {
        heading: '12. Modifications de la Politique',
        body: [
          'Nous pouvons mettre à jour cette Politique de Confidentialité périodiquement. En cas de modification importante, nous vous en informerons par e-mail ou via une notification visible sur la plateforme. La politique mise à jour sera effective à la date indiquée en haut de cette page.',
        ],
      },
      {
        heading: '13. Nous Contacter',
        body: [
          'Pour toute question concernant cette politique ou nos pratiques en matière de données :',
          '**E-mail :** support@sayerli.com',
          '**Site web :** https://sayerli.com',
        ],
      },
    ],
  },
  ar: {
    dir: 'rtl' as const,
    lang: 'AR',
    title: 'سياسة الخصوصية',
    effective: `تاريخ السريان: ${EFFECTIVE_DATE_AR}`,
    back: 'العودة إلى Sayerli →',
    sections: [
      {
        heading: '١. المقدمة',
        body: [
          'تُشغّل Sayerli ("نحن" أو "لنا") منصة إدارة الأعمال السحابية المتاحة على https://sayerli.com. توضح سياسة الخصوصية هذه كيفية جمع معلوماتك الشخصية واستخدامها والإفصاح عنها وحمايتها عند استخدام خدمتنا.',
          'بإنشاء حساب أو استخدام Sayerli، فإنك تقر بأنك اطلعت على هذه السياسة ووافقت عليها. يُدار Sayerli من قِبل مؤسس فردي مقيم في المغرب، ونلتزم بحماية بياناتك وفقاً للقانون المغربي رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة البيانات ذات الطابع الشخصي، وكذلك اللائحة الأوروبية العامة لحماية البيانات (GDPR) عند انطباقها.',
        ],
      },
      {
        heading: '٢. البيانات التي نجمعها',
        body: [
          'نجمع الفئات التالية من البيانات الشخصية:',
          '**بيانات الحساب والهوية:** عند التسجيل، نجمع اسمك الأول والأخير وعنوان بريدك الإلكتروني وكلمة مرور مشفرة.',
          '**بيانات الشركة:** يمكنك إضافة اسم الشركة، ورقم السجل التجاري (RC)، والرقم الضريبي (ICE)، والعنوان المهني، والبيانات المصرفية (IBAN، RIB، SWIFT) المستخدمة فقط لعرضها على فواتيرك، وشعار الشركة المخزّن عبر Cloudinary.',
          '**وثائق الأعمال التي تُدخلها:** جميع عروض الأسعار والفواتير وسجلات العملاء والمدفوعات ومعلومات أعضاء الفريق التي تُدخلها في Sayerli تُخزَّن نيابةً عنك. هذه البيانات ملك لك ونعالجها فقط لتقديم الخدمة.',
          '**البيانات التقنية وبيانات الاستخدام:** نجمع تلقائياً عنوان IP الخاص بك ونوع المتصفح ونظام التشغيل والصفحات التي تزورها وتوقيتات الجلسة.',
        ],
      },
      {
        heading: '٣. كيفية استخدام بياناتك',
        body: [
          'نستخدم البيانات المجمعة من أجل:',
          '• توفير منصة Sayerli وتشغيلها وصيانتها',
          '• التحقق من هويتك والحفاظ على جلستك بشكل آمن',
          '• معالجة وثائق أعمالك وعرضها (عروض الأسعار والفواتير والمدفوعات)',
          '• إرسال رسائل بريد إلكتروني تعاملية عبر Resend (تأكيد الحساب، إعادة تعيين كلمة المرور، دعوات الفريق)',
          '• الامتثال للالتزامات القانونية',
          'لا نستخدم بياناتك لأغراض إعلانية ولا نبيعها أبداً لأي طرف ثالث.',
        ],
      },
      {
        heading: '٤. معالجة المدفوعات',
        body: [
          'تتم معالجة جميع مدفوعات الاشتراكات المدفوعة في Sayerli بواسطة Lemon Squeezy (LemonSqueezy, LLC)، بوصفها التاجر المرجعي (Merchant of Record). وهذا يعني أن Lemon Squeezy تدير المعاملة المالية الكاملة، بما في ذلك الفوترة وجمع ضريبة القيمة المضافة واسترداد المبالغ ومعالجة النزاعات نيابةً عنا.',
          'عند شراء اشتراك مدفوع، ستُحوَّل إلى صفحة الدفع الآمنة الخاصة بـ Lemon Squeezy. لا تتلقى Sayerli بيانات بطاقتك المصرفية ولا تخزنها. تخضع ممارسات Lemon Squeezy لسياسة خصوصيتها المتاحة على https://www.lemonsqueezy.com/privacy.',
        ],
      },
      {
        heading: '٥. ملفات تعريف الارتباط والتتبع',
        body: [
          'تستخدم Sayerli الحد الأدنى من ملفات تعريف الارتباط اللازمة لتشغيل الخدمة:',
          '**ملفات تعريف ارتباط المصادقة:** رموز جلسة آمنة تحافظ على تسجيل دخولك. هذه ضرورية وإلزامية لاستخدام الخدمة.',
          '**ملفات تعريف ارتباط التفضيلات:** قد نخزّن تفضيلاتك للغة والسمة محلياً في متصفحك.',
          'لا نستخدم Google Analytics أو Meta Pixel أو أي نصوص تتبع إعلانية من جهات خارجية.',
        ],
      },
      {
        heading: '٦. مشاركة البيانات مع الأطراف الثالثة',
        body: [
          'نشارك بياناتك فقط مع مزودي الخدمات التاليين:',
          '• **Neon (PostgreSQL):** قاعدة بياناتنا الرئيسية، مستضافة في الغرب الأمريكي (أوريغون)',
          '• **Vercel:** يستضيف تطبيق واجهة المستخدم',
          '• **Railway:** يستضيف واجهة برمجة التطبيقات الخلفية',
          '• **Cloudinary:** يخزّن شعار شركتك ويعرضه',
          '• **Resend:** يرسل رسائل البريد الإلكتروني التعاملية',
          '• **Lemon Squeezy:** تعالج المدفوعات (انظر القسم 4)',
          'لا نشارك بياناتك مع أي أطراف أخرى، ولا نبيعها أو نؤجرها.',
        ],
      },
      {
        heading: '٧. الاحتفاظ بالبيانات',
        body: [
          'نحتفظ ببياناتك الشخصية طالما حسابك نشطاً. إذا أغلقت حسابك، سنحذف بياناتك الشخصية أو نجعلها مجهولة الهوية في غضون 30 يوماً من طلبك، إلا إذا كنا مُلزَمين قانوناً بالاحتفاظ بها.',
          'تُحفظ سجلات الفوترة والمدفوعات لمدة 7 سنوات على الأقل امتثالاً للمتطلبات القانونية والضريبية المعمول بها.',
        ],
      },
      {
        heading: '٨. حقوقك',
        body: [
          'بحسب موقعك الجغرافي، قد يحق لك:',
          '• **حق الوصول:** طلب نسخة من بياناتك الشخصية',
          '• **حق التصحيح:** طلب تصحيح البيانات غير الدقيقة',
          '• **حق الحذف:** طلب حذف بياناتك الشخصية',
          '• **حق نقل البيانات:** الحصول على بياناتك بصيغة منظمة وقابلة للقراءة آلياً',
          '• **حق الاعتراض:** الاعتراض على المعالجة المبنية على مصالحنا المشروعة',
          'لممارسة أي من هذه الحقوق، تواصل معنا على support@sayerli.com. سنرد على الطلبات الموثقة في غضون 30 يوماً.',
        ],
      },
      {
        heading: '٩. النقل الدولي للبيانات',
        body: [
          'يُدار Sayerli من المغرب وقاعدة بياناتنا مستضافة في الولايات المتحدة (أوريغون). قد يُنقل استخدامك للخدمة بياناتك إلى دول أخرى. نتخذ جميع الاحتياطات اللازمة لضمان أن عمليات النقل تتم وفق قانون حماية البيانات المعمول به.',
        ],
      },
      {
        heading: '١٠. الأمان',
        body: [
          'نطبّق معايير أمان متوافقة مع أفضل ممارسات الصناعة:',
          '• جميع البيانات أثناء النقل مشفرة عبر TLS/HTTPS',
          '• كلمات المرور مشفرة ببروتوكول bcrypt — لا نخزن كلمات المرور نصاً صريحاً',
          '• المصادقة تتم عبر رموز JWT موقعة',
          '• بنيتنا متعددة المستأجرين تضمن عزلاً صارماً للبيانات بين الشركات',
          '• يُشترط تأكيد البريد الإلكتروني عند التسجيل',
        ],
      },
      {
        heading: '١١. خصوصية الأطفال',
        body: [
          'Sayerli منصة برمجية مهنية مخصصة للبالغين والكيانات التجارية القانونية. لا نجمع بيانات شخصية من الأشخاص الذين تقل أعمارهم عن 16 عاماً.',
        ],
      },
      {
        heading: '١٢. التعديلات على هذه السياسة',
        body: [
          'قد نُحدّث سياسة الخصوصية هذه من وقت لآخر. في حال إجراء تغييرات جوهرية، سنخطرك عبر البريد الإلكتروني أو عبر إشعار ظاهر على المنصة.',
        ],
      },
      {
        heading: '١٣. التواصل معنا',
        body: [
          'لأي استفسارات أو طلبات تتعلق بهذه السياسة:',
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

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = content[lang]

  return (
    <div dir={t.dir} className="min-h-screen bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 transition-colors">
      {/* Top bar */}
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
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-4">
            Sayerli Legal
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500">{t.effective}</p>
        </div>

        {/* Sections */}
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

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Sayerli. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-indigo-600 dark:text-indigo-400">
            <Link href="/legal/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/legal/refund" className="hover:underline">Refund Policy</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
