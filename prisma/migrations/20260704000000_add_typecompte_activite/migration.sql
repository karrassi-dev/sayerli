-- AlterTable
ALTER TABLE "entreprises" ADD COLUMN IF NOT EXISTS "typeCompte" TEXT DEFAULT 'pme';
ALTER TABLE "entreprises" ADD COLUMN IF NOT EXISTS "activite" TEXT;
