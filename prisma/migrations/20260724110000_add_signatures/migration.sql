-- AlterTable: add owner signature to entreprises
ALTER TABLE "entreprises" ADD COLUMN "signature" TEXT;

-- AlterTable: add client signature fields to devis
ALTER TABLE "devis" ADD COLUMN "signatureClient" TEXT;
ALTER TABLE "devis" ADD COLUMN "signatureClientNom" TEXT;
ALTER TABLE "devis" ADD COLUMN "signatureClientIp" TEXT;
