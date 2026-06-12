-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('STARTER', 'PRO', 'BUSINESS');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'MANAGER', 'COMMERCIAL', 'COMPTABLE');

-- CreateEnum
CREATE TYPE "StatutDevis" AS ENUM ('BROUILLON', 'ENVOYE', 'VU', 'ACCEPTE', 'REFUSE');

-- CreateEnum
CREATE TYPE "StatutFacture" AS ENUM ('BROUILLON', 'ENVOYEE', 'PAYEE', 'PARTIELLE', 'EN_RETARD');

-- CreateEnum
CREATE TYPE "MethodePaiement" AS ENUM ('CASH', 'VIREMENT', 'CARTE', 'CHEQUE', 'MOBILE');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('DEVIS_ENVOYE', 'DEVIS_ACCEPTE', 'DEVIS_REFUSE', 'DEVIS_VU', 'FACTURE_CREEE', 'FACTURE_PAYEE', 'FACTURE_PARTIELLE', 'RAPPEL_ECHEANCE', 'PAIEMENT_RECU');

-- CreateTable
CREATE TABLE "entreprises" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "logo" TEXT,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "devise" TEXT NOT NULL DEFAULT 'MAD',
    "plan" "PlanType" NOT NULL DEFAULT 'STARTER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entreprises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHash" TEXT NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT 'COMMERCIAL',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "nomEntreprise" TEXT,
    "notes" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devis" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "statut" "StatutDevis" NOT NULL DEFAULT 'BROUILLON',
    "totalHT" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxe" DECIMAL(5,2) NOT NULL DEFAULT 20,
    "totalTTC" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "dateExpiration" TIMESTAMP(3),
    "dateAcceptation" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devis_lignes" (
    "id" TEXT NOT NULL,
    "devisId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" DECIMAL(10,3) NOT NULL DEFAULT 1,
    "prixUnitaire" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "devis_lignes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liens_publics_devis" (
    "id" TEXT NOT NULL,
    "devisId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "utilise" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liens_publics_devis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factures" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "devisId" TEXT,
    "numeroFacture" TEXT NOT NULL,
    "statut" "StatutFacture" NOT NULL DEFAULT 'BROUILLON',
    "totalHT" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxe" DECIMAL(5,2) NOT NULL DEFAULT 20,
    "totalTTC" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "montantPaye" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "dateEcheance" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "factures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facture_lignes" (
    "id" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" DECIMAL(10,3) NOT NULL DEFAULT 1,
    "prixUnitaire" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "facture_lignes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiements" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "methode" "MethodePaiement" NOT NULL DEFAULT 'VIREMENT',
    "reference" TEXT,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paiements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "type" "TypeNotification" NOT NULL,
    "message" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "lien" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entreprises_email_key" ON "entreprises"("email");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_entrepriseId_email_key" ON "utilisateurs"("entrepriseId", "email");

-- CreateIndex
CREATE INDEX "clients_entrepriseId_idx" ON "clients"("entrepriseId");

-- CreateIndex
CREATE INDEX "devis_entrepriseId_idx" ON "devis"("entrepriseId");

-- CreateIndex
CREATE INDEX "devis_clientId_idx" ON "devis"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "liens_publics_devis_devisId_key" ON "liens_publics_devis"("devisId");

-- CreateIndex
CREATE UNIQUE INDEX "liens_publics_devis_token_key" ON "liens_publics_devis"("token");

-- CreateIndex
CREATE INDEX "factures_entrepriseId_idx" ON "factures"("entrepriseId");

-- CreateIndex
CREATE INDEX "factures_clientId_idx" ON "factures"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "factures_entrepriseId_numeroFacture_key" ON "factures"("entrepriseId", "numeroFacture");

-- CreateIndex
CREATE INDEX "paiements_entrepriseId_idx" ON "paiements"("entrepriseId");

-- CreateIndex
CREATE INDEX "paiements_factureId_idx" ON "paiements"("factureId");

-- CreateIndex
CREATE INDEX "notifications_entrepriseId_idx" ON "notifications"("entrepriseId");

-- CreateIndex
CREATE INDEX "notifications_lu_idx" ON "notifications"("lu");

-- AddForeignKey
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devis" ADD CONSTRAINT "devis_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devis" ADD CONSTRAINT "devis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devis_lignes" ADD CONSTRAINT "devis_lignes_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "devis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liens_publics_devis" ADD CONSTRAINT "liens_publics_devis_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "devis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factures" ADD CONSTRAINT "factures_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factures" ADD CONSTRAINT "factures_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factures" ADD CONSTRAINT "factures_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "devis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facture_lignes" ADD CONSTRAINT "facture_lignes_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "factures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "factures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
