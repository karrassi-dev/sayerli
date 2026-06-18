'use client'

import { useState } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'fr' | 'ar'

const content = {
  en: {
    dir: 'ltr' as const,
    title: 'Refund Policy',
    effective: 'Effective Date: June 18, 2026',
    back: '← Back to Sayerli',
    sections: [
      {
        heading: '1. Overview',
        body: [
          'This Refund Policy governs all refund and cancellation requests for Sayerli paid subscriptions. Sayerli is a cloud-based SaaS platform and all transactions are processed by Lemon Squeezy (LemonSqueezy, LLC), our Merchant of Record.',
          'By purchasing a Sayerli subscription, you agree to this Refund Policy. We are committed to fair and transparent refund practices while recognizing the nature of digital software services.',
          'For any refund request or billing question, please contact us at support@sayerli.com.',
        ],
      },
      {
        heading: '2. Free Plan',
        body: [
          'The STARTER plan is completely free. No credit card is required to sign up, and there is nothing to refund for free plan users.',
          'You may use the STARTER plan indefinitely without any charge.',
        ],
      },
      {
        heading: '3. Free Trial',
        body: [
          'If Sayerli offers a free trial for a paid plan, no payment is collected during the trial period. You will only be charged if you do not cancel before the trial ends.',
          'If you were charged at the end of a trial period due to a technical error and you have not used the paid features, you are eligible for a full refund. You must contact us within 7 days of the charge.',
          'Cancelling a free trial before it ends prevents any charge. Free trial periods are not extendable.',
        ],
      },
      {
        heading: '4. Monthly Subscription Refunds',
        body: [
          'For monthly subscriptions, you are eligible for a full refund within **7 days** of your initial subscription payment or your most recent renewal payment, provided that:',
          '• You have not made extensive use of paid features during the billing period (sending more than 5 invoices or quotes, or having more than 3 active team members)',
          '• This is your first refund request for this subscription',
          '• Your request is submitted within the 7-day window',
          'After 7 days from the payment date, monthly subscription payments are non-refundable. You may cancel at any time to prevent future charges, but no partial refund will be issued for the remainder of the billing period.',
        ],
      },
      {
        heading: '5. Annual Subscription Refunds',
        body: [
          'For annual subscriptions, you are eligible for a full refund within **14 days** of your initial annual payment, provided that you have not made extensive use of the platform as described above.',
          'After 14 days and before 6 months have elapsed, we may offer a prorated refund for unused months at our discretion, based on the review criteria described in Section 8.',
          'No refund will be issued for annual subscriptions after 6 months of use.',
          'If Sayerli discontinues a feature that was material to your subscription decision, and you notify us within 30 days of that discontinuation, we will consider your refund request in good faith regardless of the standard timeline.',
        ],
      },
      {
        heading: '6. Non-Refundable Items',
        body: [
          'The following are not eligible for refunds:',
          '• Subscription fees paid more than 7 days ago (monthly) or 14 days ago (annual) unless exceptional circumstances apply',
          '• Subscription periods during which the service was used extensively',
          '• Fees for accounts that were suspended or terminated due to violations of our Terms of Service',
          '• Any custom or one-time fees, if applicable',
          '• Partial periods — Sayerli does not issue partial-month refunds for mid-cycle cancellations',
        ],
      },
      {
        heading: '7. How to Request a Refund',
        body: [
          'To request a refund, please contact us at **support@sayerli.com** with the following information:',
          '• The email address associated with your Sayerli account',
          '• Your Lemon Squeezy order number or receipt (available in your billing confirmation email)',
          '• The reason for your refund request',
          '• The date of the payment you are requesting a refund for',
          'We will acknowledge your request within 2 business days and provide a decision within 5 business days.',
        ],
      },
      {
        heading: '8. Refund Review Criteria',
        body: [
          'When reviewing a refund request, we consider the following factors:',
          '• **Time elapsed since payment:** Requests within the eligibility window receive priority consideration',
          '• **Usage during the billing period:** Low or no usage of paid features supports refund eligibility',
          '• **Nature of the issue:** Technical failures on our side or billing errors are resolved with priority refunds',
          '• **First-time request:** First refund requests are treated more favorably than repeated requests',
          '• **Plan type:** Annual plan requests are subject to a broader review than monthly plans',
          'We reserve the right to decline refund requests that do not meet these criteria, particularly where the platform has been used extensively.',
        ],
      },
      {
        heading: '9. Cancellation Policy',
        body: [
          'You may cancel your Sayerli paid subscription at any time. Cancellation takes effect at the end of your current billing period.',
          'After cancellation, your account will automatically downgrade to the STARTER (free) plan at the end of the current period. You will retain access to your data, but paid features and higher limits will no longer be available.',
          'Cancellation does not automatically trigger a refund. If you believe you are entitled to a refund, you must submit a separate refund request as described in Section 7.',
          'To cancel, visit the Billing section of your dashboard or contact us at support@sayerli.com.',
        ],
      },
      {
        heading: '10. Chargebacks',
        body: [
          'A chargeback occurs when you dispute a payment directly with your bank or card issuer. We strongly encourage you to contact us at support@sayerli.com before initiating a chargeback, as most billing issues can be resolved quickly and directly.',
          'Initiating an unjustified chargeback — particularly where a refund would have been approved if requested through our support channel — may result in immediate suspension of your Sayerli account pending resolution.',
          'Since Lemon Squeezy is our Merchant of Record, chargebacks are managed by Lemon Squeezy\'s dispute resolution process. We will cooperate fully with any investigation.',
        ],
      },
      {
        heading: '11. Billing Disputes',
        body: [
          'If you believe you have been charged incorrectly — for example, charged after cancellation, charged the wrong amount, or charged twice — please contact us immediately at support@sayerli.com.',
          'Include your account email and your Lemon Squeezy order number. We will investigate and resolve valid billing errors within 5 business days.',
          'Billing errors on our part will always be corrected with a full refund or account credit, as appropriate.',
        ],
      },
      {
        heading: '12. Refund Timelines',
        body: [
          'Once a refund is approved:',
          '• **Processing time:** Lemon Squeezy processes the refund on our behalf, typically within 1–3 business days of approval',
          '• **Bank processing:** Depending on your bank or card issuer, the refund may take an additional 5–10 business days to appear on your statement',
          '• **Total estimated time:** 7–15 business days from approval to funds appearing in your account',
          'You will receive a confirmation email from Lemon Squeezy when the refund has been processed.',
        ],
      },
      {
        heading: '13. Changes to This Policy',
        body: [
          'We reserve the right to update this Refund Policy at any time. Material changes will be communicated via email or a notice on the platform. The updated policy applies to subscriptions purchased after the effective date.',
        ],
      },
      {
        heading: '14. Contact',
        body: [
          'For all refund requests and billing questions:',
          '**Email:** support@sayerli.com',
          '**Website:** https://sayerli.com',
          'Our support team is committed to responding to all refund requests within 2 business days.',
        ],
      },
    ],
  },
  fr: {
    dir: 'ltr' as const,
    title: 'Politique de Remboursement',
    effective: "Date d'entrée en vigueur : 18 juin 2026",
    back: '← Retour à Sayerli',
    sections: [
      {
        heading: '1. Présentation Générale',
        body: [
          'La présente Politique de Remboursement régit toutes les demandes de remboursement et d\'annulation pour les abonnements payants Sayerli. Toutes les transactions sont traitées par Lemon Squeezy (LemonSqueezy, LLC), notre Marchand de Référence.',
          'En achetant un abonnement Sayerli, vous acceptez cette politique. Nous nous engageons à des pratiques de remboursement équitables et transparentes.',
          'Pour toute demande de remboursement, contactez-nous à support@sayerli.com.',
        ],
      },
      {
        heading: '2. Plan Gratuit',
        body: [
          'Le plan STARTER est entièrement gratuit. Aucune carte bancaire n\'est requise et il n\'y a rien à rembourser pour les utilisateurs du plan gratuit.',
        ],
      },
      {
        heading: '3. Période d\'Essai Gratuite',
        body: [
          'Si Sayerli propose un essai gratuit, aucun paiement n\'est prélevé pendant la période d\'essai. Vous ne serez facturé que si vous n\'annulez pas avant la fin de l\'essai.',
          'Si vous avez été facturé à la fin d\'un essai par erreur technique et n\'avez pas utilisé les fonctionnalités payantes, vous êtes éligible à un remboursement complet sous 7 jours.',
        ],
      },
      {
        heading: '4. Remboursements pour Abonnements Mensuels',
        body: [
          'Pour les abonnements mensuels, vous êtes éligible à un remboursement complet dans les **7 jours** suivant votre paiement initial ou votre dernier renouvellement, à condition que :',
          '• Vous n\'ayez pas fait un usage intensif des fonctionnalités payantes (plus de 5 factures ou devis envoyés, ou plus de 3 membres actifs)',
          '• C\'est votre première demande de remboursement pour cet abonnement',
          '• Votre demande soit soumise dans le délai de 7 jours',
          'Au-delà de 7 jours, les paiements mensuels ne sont pas remboursables. Vous pouvez annuler à tout moment pour éviter les prélèvements futurs, mais aucun remboursement partiel ne sera accordé pour la période restante.',
        ],
      },
      {
        heading: '5. Remboursements pour Abonnements Annuels',
        body: [
          'Pour les abonnements annuels, vous êtes éligible à un remboursement complet dans les **14 jours** suivant votre paiement annuel initial, sous réserve de n\'avoir pas fait un usage intensif de la plateforme.',
          'Après 14 jours et avant 6 mois d\'utilisation, nous pouvons proposer un remboursement proratisé pour les mois non utilisés, à notre discrétion.',
          'Aucun remboursement ne sera accordé après 6 mois d\'utilisation d\'un abonnement annuel.',
        ],
      },
      {
        heading: '6. Éléments Non Remboursables',
        body: [
          'Les éléments suivants ne sont pas éligibles au remboursement :',
          '• Les frais d\'abonnement payés il y a plus de 7 jours (mensuel) ou 14 jours (annuel), sauf circonstances exceptionnelles',
          '• Les périodes d\'abonnement pendant lesquelles le service a été utilisé intensément',
          '• Les frais pour des comptes suspendus ou résiliés suite à des violations des CGU',
          '• Les remboursements partiels pour annulation en cours de cycle',
        ],
      },
      {
        heading: '7. Comment Demander un Remboursement',
        body: [
          'Pour demander un remboursement, contactez-nous à **support@sayerli.com** en indiquant :',
          '• L\'adresse e-mail associée à votre compte Sayerli',
          '• Votre numéro de commande Lemon Squeezy ou votre reçu',
          '• La raison de votre demande',
          '• La date du paiement concerné',
          'Nous accuserons réception dans les 2 jours ouvrés et vous fournirons une décision dans les 5 jours ouvrés.',
        ],
      },
      {
        heading: '8. Critères d\'Évaluation des Remboursements',
        body: [
          'Lors de l\'examen d\'une demande, nous prenons en compte :',
          '• **Le délai depuis le paiement :** Les demandes dans la période d\'éligibilité sont prioritaires',
          '• **L\'utilisation pendant la période de facturation :** Une utilisation faible ou nulle soutient l\'éligibilité',
          '• **La nature du problème :** Les défaillances techniques de notre côté sont traitées en priorité',
          '• **La première demande :** Les premières demandes sont traitées plus favorablement',
          'Nous nous réservons le droit de refuser les demandes ne répondant pas à ces critères.',
        ],
      },
      {
        heading: '9. Politique d\'Annulation',
        body: [
          'Vous pouvez annuler votre abonnement payant Sayerli à tout moment. L\'annulation prend effet à la fin de la période de facturation en cours.',
          'Après annulation, votre compte sera rétrogradé au plan STARTER à la fin de la période. Vous conserverez l\'accès à vos données, mais les fonctionnalités payantes ne seront plus disponibles.',
          'L\'annulation ne déclenche pas automatiquement un remboursement. Pour un remboursement, soumettez une demande séparée.',
        ],
      },
      {
        heading: '10. Rétrofacturations (Chargebacks)',
        body: [
          'Nous vous encourageons vivement à nous contacter à support@sayerli.com avant d\'initier une rétrofacturation, car la plupart des problèmes de facturation peuvent être résolus rapidement.',
          'Une rétrofacturation injustifiée peut entraîner la suspension immédiate de votre compte. Lemon Squeezy, en tant que Marchand de Référence, gère les procédures de contestation.',
        ],
      },
      {
        heading: '11. Litiges de Facturation',
        body: [
          'Si vous pensez avoir été facturé incorrectement, contactez-nous immédiatement à support@sayerli.com avec votre e-mail de compte et votre numéro de commande Lemon Squeezy.',
          'Les erreurs de facturation de notre part seront toujours corrigées par un remboursement complet ou un crédit de compte.',
        ],
      },
      {
        heading: '12. Délais de Remboursement',
        body: [
          'Une fois le remboursement approuvé :',
          '• **Traitement par Lemon Squeezy :** 1 à 3 jours ouvrés après approbation',
          '• **Traitement bancaire :** 5 à 10 jours ouvrés supplémentaires selon votre banque',
          '• **Délai total estimé :** 7 à 15 jours ouvrés entre l\'approbation et la réception des fonds',
          'Vous recevrez un e-mail de confirmation de Lemon Squeezy une fois le remboursement traité.',
        ],
      },
      {
        heading: '13. Modifications de la Politique',
        body: [
          'Nous nous réservons le droit de mettre à jour cette politique à tout moment. Les changements importants vous seront communiqués par e-mail ou via la plateforme.',
        ],
      },
      {
        heading: '14. Contact',
        body: [
          'Pour toutes les demandes de remboursement et questions de facturation :',
          '**E-mail :** support@sayerli.com',
          '**Site web :** https://sayerli.com',
        ],
      },
    ],
  },
  ar: {
    dir: 'rtl' as const,
    title: 'سياسة الاسترداد',
    effective: 'تاريخ السريان: 18 يونيو 2026',
    back: 'العودة إلى Sayerli →',
    sections: [
      {
        heading: '١. نظرة عامة',
        body: [
          'تحكم سياسة الاسترداد هذه جميع طلبات استرداد الأموال وإلغاء الاشتراكات المدفوعة في Sayerli. تُعالَج جميع المعاملات بواسطة Lemon Squeezy (LemonSqueezy, LLC)، التاجر المرجعي.',
          'بشراء اشتراك Sayerli، فإنك توافق على هذه السياسة. نلتزم بممارسات استرداد عادلة وشفافة.',
          'لأي طلب استرداد، تواصل معنا على support@sayerli.com.',
        ],
      },
      {
        heading: '٢. الخطة المجانية',
        body: [
          'خطة STARTER مجانية تماماً. لا يُشترط بطاقة مصرفية، ولا شيء يستوجب الاسترداد لمستخدمي الخطة المجانية.',
        ],
      },
      {
        heading: '٣. الفترة التجريبية المجانية',
        body: [
          'إذا قدّمت Sayerli فترة تجريبية مجانية، لا يُحصّل أي مبلغ خلالها. لن تُفرض عليك رسوم إلا إذا لم تلغِ اشتراكك قبل انتهاء الفترة.',
          'إذا فُرضت عليك رسوم بسبب خطأ تقني ولم تستخدم الميزات المدفوعة، فأنت مؤهل لاسترداد كامل خلال 7 أيام من الرسوم.',
        ],
      },
      {
        heading: '٤. استرداد الاشتراكات الشهرية',
        body: [
          'للاشتراكات الشهرية، يحق لك استرداد كامل خلال **7 أيام** من دفعتك الأولى أو آخر تجديد، بشرط:',
          '• ألا تكون قد استخدمت الميزات المدفوعة استخداماً مكثفاً (إرسال أكثر من 5 فواتير أو عروض أسعار، أو وجود أكثر من 3 أعضاء نشطين)',
          '• أن يكون هذا أول طلب استرداد لهذا الاشتراك',
          '• أن يُقدَّم الطلب ضمن مهلة 7 أيام',
          'بعد 7 أيام من تاريخ الدفع، لا يمكن استرداد مدفوعات الاشتراكات الشهرية. يمكنك الإلغاء في أي وقت لتفادي الرسوم المستقبلية دون أي استرداد جزئي.',
        ],
      },
      {
        heading: '٥. استرداد الاشتراكات السنوية',
        body: [
          'للاشتراكات السنوية، يحق لك استرداد كامل خلال **14 يوماً** من دفعتك السنوية الأولى، بشرط عدم الاستخدام المكثف للمنصة.',
          'بعد 14 يوماً وقبل مرور 6 أشهر، قد نُقدّم استرداداً نسبياً للأشهر غير المستخدمة وفقاً لتقديرنا.',
          'لا يُقدَّم أي استرداد للاشتراكات السنوية بعد 6 أشهر من الاستخدام.',
        ],
      },
      {
        heading: '٦. البنود غير القابلة للاسترداد',
        body: [
          'لا يحق استرداد المبالغ التالية:',
          '• رسوم الاشتراك المدفوعة منذ أكثر من 7 أيام (شهري) أو 14 يوماً (سنوي) إلا في ظروف استثنائية',
          '• فترات الاشتراك التي استُخدمت فيها الخدمة استخداماً مكثفاً',
          '• رسوم الحسابات الموقوفة أو المنهاة بسبب انتهاك شروط الخدمة',
          '• المبالغ الجزئية عن الإلغاء في منتصف دورة الفوترة',
        ],
      },
      {
        heading: '٧. كيفية طلب الاسترداد',
        body: [
          'لطلب الاسترداد، تواصل معنا على **support@sayerli.com** مع ذكر:',
          '• عنوان البريد الإلكتروني المرتبط بحسابك في Sayerli',
          '• رقم طلب Lemon Squeezy أو إيصال الدفع',
          '• سبب طلب الاسترداد',
          '• تاريخ الدفع المعني',
          'سنؤكد استلام طلبك خلال يومَي عمل ونُقدّم قراراً خلال 5 أيام عمل.',
        ],
      },
      {
        heading: '٨. معايير مراجعة طلبات الاسترداد',
        body: [
          'عند مراجعة طلب الاسترداد، نأخذ بعين الاعتبار:',
          '• **الوقت المنقضي منذ الدفع:** تحظى الطلبات ضمن فترة الأهلية بأولوية',
          '• **الاستخدام خلال فترة الفوترة:** الاستخدام المنخفض أو المعدوم يدعم أهلية الاسترداد',
          '• **طبيعة المشكلة:** تُعالَج الأعطال التقنية من جانبنا باسترداد أولوية',
          '• **الطلب الأول:** تُعامَل الطلبات الأولى بصورة أكثر ملاءمة',
        ],
      },
      {
        heading: '٩. سياسة الإلغاء',
        body: [
          'يمكنك إلغاء اشتراكك المدفوع في Sayerli في أي وقت. يسري الإلغاء في نهاية فترة الفوترة الحالية.',
          'بعد الإلغاء، يُنزَّل حسابك إلى خطة STARTER في نهاية الفترة الحالية. ستحتفظ بوصولك إلى بياناتك، لكن الميزات المدفوعة لن تكون متاحة.',
          'لا يُشغّل الإلغاء تلقائياً استرداداً. لطلب استرداد، قدّم طلباً منفصلاً.',
        ],
      },
      {
        heading: '١٠. الاسترداد القسري (Chargebacks)',
        body: [
          'نحثّك بشدة على التواصل معنا على support@sayerli.com قبل بدء استرداد قسري، إذ يمكن حل معظم مشكلات الفوترة بسرعة ومباشرة.',
          'قد يؤدي الاسترداد القسري غير المبرر إلى تعليق حسابك فوراً. تُدير Lemon Squeezy، بوصفها التاجر المرجعي، إجراءات النزاعات.',
        ],
      },
      {
        heading: '١١. نزاعات الفوترة',
        body: [
          'إذا اعتقدت أنك فُرضت عليك رسوم خاطئة، تواصل معنا فوراً على support@sayerli.com مع ذكر بريدك الإلكتروني ورقم طلب Lemon Squeezy.',
          'ستُصحَّح أخطاء الفوترة من جانبنا دائماً باسترداد كامل أو رصيد في الحساب.',
        ],
      },
      {
        heading: '١٢. مواعيد الاسترداد',
        body: [
          'بعد الموافقة على الاسترداد:',
          '• **معالجة Lemon Squeezy:** 1 إلى 3 أيام عمل بعد الموافقة',
          '• **معالجة البنك:** 5 إلى 10 أيام عمل إضافية حسب مصرفك',
          '• **الإجمالي المتوقع:** 7 إلى 15 يوم عمل من الموافقة حتى ظهور المبلغ في حسابك',
          'ستتلقى رسالة تأكيد من Lemon Squeezy عند معالجة الاسترداد.',
        ],
      },
      {
        heading: '١٣. تعديلات على هذه السياسة',
        body: [
          'نحتفظ بالحق في تحديث سياسة الاسترداد هذه في أي وقت. ستُوضَح التغييرات الجوهرية عبر البريد الإلكتروني أو إشعار على المنصة.',
        ],
      },
      {
        heading: '١٤. التواصل معنا',
        body: [
          'لجميع طلبات الاسترداد واستفسارات الفوترة:',
          '**البريد الإلكتروني:** support@sayerli.com',
          '**الموقع الإلكتروني:** https://sayerli.com',
          'يلتزم فريق الدعم بالرد على جميع طلبات الاسترداد خلال يومَي عمل.',
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

export default function RefundPage() {
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

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {[
            { icon: '🆓', label: lang === 'ar' ? 'الخطة المجانية' : lang === 'fr' ? 'Plan gratuit' : 'Free plan', sub: lang === 'ar' ? 'لا شيء يُسترد' : lang === 'fr' ? 'Rien à rembourser' : 'Nothing to refund' },
            { icon: '📅', label: lang === 'ar' ? 'شهري' : lang === 'fr' ? 'Mensuel' : 'Monthly', sub: lang === 'ar' ? 'استرداد خلال 7 أيام' : lang === 'fr' ? 'Remboursement sous 7j' : '7-day refund window' },
            { icon: '📆', label: lang === 'ar' ? 'سنوي' : lang === 'fr' ? 'Annuel' : 'Annual', sub: lang === 'ar' ? 'استرداد خلال 14 يوماً' : lang === 'fr' ? 'Remboursement sous 14j' : '14-day refund window' },
          ].map((card, i) => (
            <div key={i} className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center text-center gap-1">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{card.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">{card.sub}</span>
            </div>
          ))}
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

        <div className="mt-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-6 text-center">
          <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
            {lang === 'ar' ? 'بحاجة إلى مساعدة؟' : lang === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}
          </p>
          <p className="text-sm text-indigo-700 dark:text-indigo-400">
            {lang === 'ar' ? 'تواصل مع فريق الدعم على ' : lang === 'fr' ? 'Contactez notre équipe à ' : 'Contact our team at '}
            <a href="mailto:support@sayerli.com" className="font-semibold underline">
              support@sayerli.com
            </a>
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Sayerli. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-indigo-600 dark:text-indigo-400">
            <Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
