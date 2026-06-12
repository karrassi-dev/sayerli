-- AlterEnum: add VUE and ANNULEE to StatutFacture
ALTER TYPE "StatutFacture" ADD VALUE IF NOT EXISTS 'VUE';
ALTER TYPE "StatutFacture" ADD VALUE IF NOT EXISTS 'ANNULEE';

-- AlterEnum: add AUTRE to MethodePaiement
ALTER TYPE "MethodePaiement" ADD VALUE IF NOT EXISTS 'AUTRE';

-- AlterEnum: add new notification types
ALTER TYPE "TypeNotification" ADD VALUE IF NOT EXISTS 'FACTURE_ENVOYEE';
ALTER TYPE "TypeNotification" ADD VALUE IF NOT EXISTS 'FACTURE_VUE';
ALTER TYPE "TypeNotification" ADD VALUE IF NOT EXISTS 'DECLARATION_RECUE';

-- CreateEnum: StatutDeclaration
DO $$ BEGIN
  CREATE TYPE "StatutDeclaration" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- AlterTable: add banking fields to entreprises
ALTER TABLE "entreprises"
  ADD COLUMN IF NOT EXISTS "titulaireCompte" TEXT,
  ADD COLUMN IF NOT EXISTS "banque"          TEXT,
  ADD COLUMN IF NOT EXISTS "rib"             TEXT,
  ADD COLUMN IF NOT EXISTS "iban"            TEXT,
  ADD COLUMN IF NOT EXISTS "swift"           TEXT;

-- AlterTable: add tracking + publicToken to factures (nullable first)
ALTER TABLE "factures"
  ADD COLUMN IF NOT EXISTS "publicToken"              TEXT,
  ADD COLUMN IF NOT EXISTS "dateEnvoi"                TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "dateConsultation"         TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "dateDerniereConsultation" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "nombreConsultations"      INTEGER NOT NULL DEFAULT 0;

-- Fill publicToken for existing rows
UPDATE "factures" SET "publicToken" = gen_random_uuid()::text WHERE "publicToken" IS NULL;

-- Make publicToken NOT NULL and UNIQUE
ALTER TABLE "factures" ALTER COLUMN "publicToken" SET NOT NULL;
ALTER TABLE "factures" ADD CONSTRAINT "factures_publicToken_key" UNIQUE ("publicToken");

-- CreateTable: declarations_paiement
CREATE TABLE IF NOT EXISTS "declarations_paiement" (
  "id"           TEXT NOT NULL,
  "entrepriseId" TEXT NOT NULL,
  "factureId"    TEXT NOT NULL,
  "montant"      DECIMAL(12,2) NOT NULL,
  "methode"      "MethodePaiement" NOT NULL DEFAULT 'VIREMENT',
  "reference"    TEXT,
  "message"      TEXT,
  "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "statut"       "StatutDeclaration" NOT NULL DEFAULT 'PENDING',
  "raisonRejet"  TEXT,
  "reviewedAt"   TIMESTAMP(3),
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "declarations_paiement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "declarations_paiement_entrepriseId_idx" ON "declarations_paiement"("entrepriseId");
CREATE INDEX IF NOT EXISTS "declarations_paiement_factureId_idx"    ON "declarations_paiement"("factureId");

-- AddForeignKey
ALTER TABLE "declarations_paiement"
  ADD CONSTRAINT "declarations_paiement_entrepriseId_fkey"
  FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "declarations_paiement"
  ADD CONSTRAINT "declarations_paiement_factureId_fkey"
  FOREIGN KEY ("factureId") REFERENCES "factures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
