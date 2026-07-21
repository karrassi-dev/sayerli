ALTER TABLE "bons_livraison" ADD COLUMN "factureId" TEXT;
ALTER TABLE "bons_livraison" ADD CONSTRAINT "bons_livraison_factureId_fkey"
  FOREIGN KEY ("factureId") REFERENCES "factures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
