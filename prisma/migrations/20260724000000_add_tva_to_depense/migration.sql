-- AddColumn tauxTva and montantTva to Depense
ALTER TABLE "depenses" ADD COLUMN "tauxTva" DECIMAL(5,2) NOT NULL DEFAULT 0;
ALTER TABLE "depenses" ADD COLUMN "montantTva" DECIMAL(12,2) NOT NULL DEFAULT 0;
