-- CreateEnum
CREATE TYPE "DGIStatut" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'REJETEE');

-- AlterEnum
ALTER TYPE "StatutFacture" ADD VALUE 'CLEARANCE_EN_COURS';
ALTER TYPE "StatutFacture" ADD VALUE 'REJETEE_DGI';

-- AlterTable entreprises
ALTER TABLE "entreprises" ADD COLUMN "dgiMode" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable factures
ALTER TABLE "factures"
  ADD COLUMN "dgiMode"        BOOLEAN      NOT NULL DEFAULT false,
  ADD COLUMN "dgiStatut"      "DGIStatut",
  ADD COLUMN "dgiClearanceId" TEXT,
  ADD COLUMN "dgiSoumisAt"    TIMESTAMP(3),
  ADD COLUMN "dgiValideAt"    TIMESTAMP(3),
  ADD COLUMN "dgiRaisonRejet" TEXT,
  ADD COLUMN "xmlStorageKey"  TEXT,
  ADD COLUMN "pdfStorageKey"  TEXT,
  ADD COLUMN "documentHash"   TEXT;
