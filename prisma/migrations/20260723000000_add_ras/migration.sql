-- Add RAS (Retenue à la Source) fields to clients
ALTER TABLE "clients" ADD COLUMN "rasActif" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "clients" ADD COLUMN "rasTaux" DECIMAL(5,2) NOT NULL DEFAULT 30;

-- Add RAS fields to factures
ALTER TABLE "factures" ADD COLUMN "rasActif" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "factures" ADD COLUMN "rasTaux" DECIMAL(5,2) NOT NULL DEFAULT 30;
ALTER TABLE "factures" ADD COLUMN "rasMontant" DECIMAL(12,2) NOT NULL DEFAULT 0;
