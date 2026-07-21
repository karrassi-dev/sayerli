-- Add custom numbering fields to entreprises
ALTER TABLE "entreprises" ADD COLUMN "prefixeFacture" TEXT NOT NULL DEFAULT 'FAC';
ALTER TABLE "entreprises" ADD COLUMN "prefixeDevis" TEXT NOT NULL DEFAULT 'DEV';
ALTER TABLE "entreprises" ADD COLUMN "prefixeBL" TEXT NOT NULL DEFAULT 'BL';
ALTER TABLE "entreprises" ADD COLUMN "prochainNumeroFacture" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "entreprises" ADD COLUMN "prochainNumeroDevis" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "entreprises" ADD COLUMN "prochainNumeroBL" INTEGER NOT NULL DEFAULT 1;

-- Initialize counters from existing document counts so existing businesses continue their sequence
UPDATE "entreprises" e SET
  "prochainNumeroFacture" = COALESCE((SELECT COUNT(*) + 1 FROM "factures" f WHERE f."entrepriseId" = e.id), 1),
  "prochainNumeroDevis"   = COALESCE((SELECT COUNT(*) + 1 FROM "devis" d WHERE d."entrepriseId" = e.id), 1),
  "prochainNumeroBL"      = COALESCE((SELECT COUNT(*) + 1 FROM "bons_livraison" bl WHERE bl."entrepriseId" = e.id), 1);
