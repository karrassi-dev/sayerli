import { PrismaClient, RoleType, StatutDevis, StatutFacture, MethodePaiement } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Initialisation des données de démonstration Sayerli...\n');

  await prisma.notification.deleteMany();
  await prisma.paiement.deleteMany();
  await prisma.factureLigne.deleteMany();
  await prisma.facture.deleteMany();
  await prisma.lienPublicDevis.deleteMany();
  await prisma.devisLigne.deleteMany();
  await prisma.devis.deleteMany();
  await prisma.client.deleteMany();
  await prisma.utilisateur.deleteMany();
  await prisma.entreprise.deleteMany();

  // ============================================
  // ENTREPRISE DÉMO
  // ============================================
  const entreprise = await prisma.entreprise.create({
    data: {
      nom: 'Agence Digitale Atlas',
      email: 'contact@atlas-digital.ma',
      telephone: '+212 6 12 34 56 78',
      adresse: '15 Rue Mohammed V, Casablanca 20000, Maroc',
      devise: 'MAD',
      plan: 'PRO',
    },
  });
  console.log(`✅ Entreprise créée: ${entreprise.nom}`);

  // ============================================
  // UTILISATEURS
  // ============================================
  const motDePasseHash = await bcrypt.hash('sayerli2024!', 12);

  const admin = await prisma.utilisateur.create({
    data: {
      entrepriseId: entreprise.id,
      nom: 'Youssef El Amrani',
      email: 'youssef@atlas-digital.ma',
      motDePasseHash,
      role: RoleType.ADMIN,
    },
  });
  console.log(`✅ Admin créé: ${admin.nom} (${admin.email})`);

  const commercial = await prisma.utilisateur.create({
    data: {
      entrepriseId: entreprise.id,
      nom: 'Fatima Zahra Benali',
      email: 'fatima@atlas-digital.ma',
      motDePasseHash,
      role: RoleType.COMMERCIAL,
    },
  });
  console.log(`✅ Commercial créé: ${commercial.nom}`);

  const comptable = await prisma.utilisateur.create({
    data: {
      entrepriseId: entreprise.id,
      nom: 'Karim Tazi',
      email: 'karim@atlas-digital.ma',
      motDePasseHash,
      role: RoleType.COMPTABLE,
    },
  });
  console.log(`✅ Comptable créé: ${comptable.nom}`);

  // ============================================
  // CLIENTS
  // ============================================
  const client1 = await prisma.client.create({
    data: {
      entrepriseId: entreprise.id,
      nom: 'Hassan Oujda',
      email: 'hassan@imprimerie-oujda.ma',
      telephone: '+212 5 35 12 34 56',
      nomEntreprise: 'Imprimerie Oujda Express',
      notes: 'Client fidèle depuis 2022. Préfère les devis par email.',
    },
  });
  console.log(`✅ Client créé: ${client1.nom} (${client1.nomEntreprise})`);

  const client2 = await prisma.client.create({
    data: {
      entrepriseId: entreprise.id,
      nom: 'Aicha Rachidi',
      email: 'aicha.rachidi@gmail.com',
      telephone: '+212 6 67 89 01 23',
      nomEntreprise: 'Boutique Mode Rachidi',
      notes: 'E-commerçante. Besoin de site web et marketing.',
    },
  });
  console.log(`✅ Client créé: ${client2.nom} (${client2.nomEntreprise})`);

  const client3 = await prisma.client.create({
    data: {
      entrepriseId: entreprise.id,
      nom: 'Mohamed Ait Brahim',
      email: 'contact@restaurant-atlas.ma',
      telephone: '+212 5 22 98 76 54',
      nomEntreprise: 'Restaurant Atlas Marrakech',
      notes: 'Restaurant haut de gamme. Budget conséquent.',
    },
  });
  console.log(`✅ Client créé: ${client3.nom} (${client3.nomEntreprise})`);

  // ============================================
  // DEVIS
  // ============================================
  const devis1 = await prisma.devis.create({
    data: {
      entrepriseId: entreprise.id,
      clientId: client1.id,
      reference: 'DEV-2024-0001',
      statut: StatutDevis.ACCEPTE,
      taxe: 20,
      totalHT: 15000,
      totalTTC: 18000,
      dateExpiration: new Date('2024-12-31'),
      dateAcceptation: new Date('2024-11-20'),
      notes: 'Développement site web + identité visuelle',
      lignes: {
        create: [
          {
            description: 'Création site web vitrine (5 pages)',
            quantite: 1,
            prixUnitaire: 8000,
            total: 8000,
            ordre: 0,
          },
          {
            description: 'Identité visuelle (logo + charte graphique)',
            quantite: 1,
            prixUnitaire: 5000,
            total: 5000,
            ordre: 1,
          },
          {
            description: 'Formation et mise en main (2h)',
            quantite: 2,
            prixUnitaire: 1000,
            total: 2000,
            ordre: 2,
          },
        ],
      },
    },
    include: { lignes: true },
  });
  console.log(`✅ Devis créé: ${devis1.reference} (${devis1.statut})`);

  const devis2 = await prisma.devis.create({
    data: {
      entrepriseId: entreprise.id,
      clientId: client2.id,
      reference: 'DEV-2024-0002',
      statut: StatutDevis.ENVOYE,
      taxe: 20,
      totalHT: 22500,
      totalTTC: 27000,
      dateExpiration: new Date('2024-12-15'),
      notes: 'Boutique e-commerce + campagne marketing',
      lignes: {
        create: [
          {
            description: 'Développement boutique en ligne (Shopify)',
            quantite: 1,
            prixUnitaire: 12000,
            total: 12000,
            ordre: 0,
          },
          {
            description: 'Intégration paiement (CMI/PayZone)',
            quantite: 1,
            prixUnitaire: 3500,
            total: 3500,
            ordre: 1,
          },
          {
            description: 'Campagne Meta Ads (3 mois)',
            quantite: 3,
            prixUnitaire: 2000,
            total: 6000,
            ordre: 2,
          },
          {
            description: 'Shooting photo produits',
            quantite: 1,
            prixUnitaire: 1000,
            total: 1000,
            ordre: 3,
          },
        ],
      },
    },
    include: { lignes: true },
  });
  console.log(`✅ Devis créé: ${devis2.reference} (${devis2.statut})`);

  const devis3 = await prisma.devis.create({
    data: {
      entrepriseId: entreprise.id,
      clientId: client3.id,
      reference: 'DEV-2024-0003',
      statut: StatutDevis.BROUILLON,
      taxe: 20,
      totalHT: 35000,
      totalTTC: 42000,
      notes: 'Refonte identité + application de réservation',
      lignes: {
        create: [
          {
            description: 'Refonte identité visuelle complète',
            quantite: 1,
            prixUnitaire: 10000,
            total: 10000,
            ordre: 0,
          },
          {
            description: 'Application web de réservation',
            quantite: 1,
            prixUnitaire: 20000,
            total: 20000,
            ordre: 1,
          },
          {
            description: 'Menu digital QR Code',
            quantite: 1,
            prixUnitaire: 5000,
            total: 5000,
            ordre: 2,
          },
        ],
      },
    },
    include: { lignes: true },
  });
  console.log(`✅ Devis créé: ${devis3.reference} (${devis3.statut})`);

  // ============================================
  // FACTURES
  // ============================================
  const facture1 = await prisma.facture.create({
    data: {
      entrepriseId: entreprise.id,
      clientId: client1.id,
      devisId: devis1.id,
      numeroFacture: 'FAC-2024-0001',
      statut: StatutFacture.PAYEE,
      taxe: 20,
      totalHT: 15000,
      totalTTC: 18000,
      montantPaye: 18000,
      dateEcheance: new Date('2024-12-30'),
      notes: 'Paiement reçu en totalité. Merci !',
      lignes: {
        create: devis1.lignes.map((l) => ({
          description: l.description,
          quantite: l.quantite,
          prixUnitaire: l.prixUnitaire,
          total: l.total,
          ordre: l.ordre,
        })),
      },
    },
  });
  console.log(`✅ Facture créée: ${facture1.numeroFacture} (${facture1.statut})`);

  const facture2 = await prisma.facture.create({
    data: {
      entrepriseId: entreprise.id,
      clientId: client2.id,
      numeroFacture: 'FAC-2024-0002',
      statut: StatutFacture.PARTIELLE,
      taxe: 20,
      totalHT: 8333.33,
      totalTTC: 10000,
      montantPaye: 5000,
      dateEcheance: new Date('2024-12-20'),
      notes: 'Acompte de 50% reçu. Solde à régler à la livraison.',
      lignes: {
        create: [
          {
            description: 'Acompte - Site e-commerce Boutique Rachidi',
            quantite: 1,
            prixUnitaire: 8333.33,
            total: 8333.33,
            ordre: 0,
          },
        ],
      },
    },
  });
  console.log(`✅ Facture créée: ${facture2.numeroFacture} (${facture2.statut})`);

  // ============================================
  // PAIEMENTS
  // ============================================
  await prisma.paiement.create({
    data: {
      entrepriseId: entreprise.id,
      factureId: facture1.id,
      montant: 18000,
      methode: MethodePaiement.VIREMENT,
      reference: 'VIR-2024-1120',
      datePaiement: new Date('2024-11-20'),
      notes: 'Virement reçu. Projet terminé.',
    },
  });
  console.log(`✅ Paiement enregistré: 18,000 MAD (Virement)`);

  await prisma.paiement.create({
    data: {
      entrepriseId: entreprise.id,
      factureId: facture2.id,
      montant: 5000,
      methode: MethodePaiement.CASH,
      reference: 'CASH-2024-1205',
      datePaiement: new Date('2024-12-05'),
      notes: 'Acompte espèces à la signature du contrat.',
    },
  });
  console.log(`✅ Paiement enregistré: 5,000 MAD (Cash)`);

  // ============================================
  // NOTIFICATIONS
  // ============================================
  await prisma.notification.createMany({
    data: [
      {
        entrepriseId: entreprise.id,
        type: 'DEVIS_ACCEPTE',
        message: `Le devis DEV-2024-0001 a été accepté par ${client1.nom}.`,
        lu: true,
        lien: `/devis/${devis1.id}`,
      },
      {
        entrepriseId: entreprise.id,
        type: 'FACTURE_PAYEE',
        message: `Paiement complet reçu pour la facture FAC-2024-0001 : 18,000 MAD.`,
        lu: true,
        lien: `/factures/${facture1.id}`,
      },
      {
        entrepriseId: entreprise.id,
        type: 'DEVIS_ENVOYE',
        message: `Le devis DEV-2024-0002 a été envoyé à ${client2.nom}.`,
        lu: false,
        lien: `/devis/${devis2.id}`,
      },
      {
        entrepriseId: entreprise.id,
        type: 'FACTURE_PARTIELLE',
        message: `Paiement partiel de 5,000 MAD reçu pour la facture FAC-2024-0002. Reste: 5,000 MAD.`,
        lu: false,
        lien: `/factures/${facture2.id}`,
      },
    ],
  });
  console.log(`✅ Notifications créées`);

  // ============================================
  // RÉSUMÉ
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Base de données initialisée avec succès !\n');
  console.log('📋 IDENTIFIANTS DE CONNEXION:');
  console.log('   Email:       youssef@atlas-digital.ma');
  console.log('   Mot de passe: sayerli2024!');
  console.log('\n📊 DONNÉES CRÉÉES:');
  console.log(`   - 1 entreprise: ${entreprise.nom}`);
  console.log(`   - 3 utilisateurs (admin, commercial, comptable)`);
  console.log(`   - 3 clients`);
  console.log(`   - 3 devis (1 accepté, 1 envoyé, 1 brouillon)`);
  console.log(`   - 2 factures (1 payée, 1 partielle)`);
  console.log(`   - 2 paiements (23,000 MAD total)`);
  console.log(`   - 4 notifications`);
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'initialisation:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
