-- CreateEnum
CREATE TYPE "StatutBonLivraison" AS ENUM ('BROUILLON', 'ENVOYE', 'LIVRE');

-- CreateTable
CREATE TABLE "bons_livraison" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "statut" "StatutBonLivraison" NOT NULL DEFAULT 'BROUILLON',
    "entrepriseId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "devisId" TEXT,
    "notes" TEXT,
    "dateLivraison" TIMESTAMP(3),
    "publicToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bons_livraison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bon_livraison_lignes" (
    "id" TEXT NOT NULL,
    "bonLivraisonId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" DECIMAL(10,3) NOT NULL DEFAULT 1,
    "unite" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "bon_livraison_lignes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bons_livraison_publicToken_key" ON "bons_livraison"("publicToken");

-- CreateIndex
CREATE UNIQUE INDEX "bons_livraison_entrepriseId_reference_key" ON "bons_livraison"("entrepriseId", "reference");

-- CreateIndex
CREATE INDEX "bons_livraison_entrepriseId_idx" ON "bons_livraison"("entrepriseId");

-- CreateIndex
CREATE INDEX "bons_livraison_clientId_idx" ON "bons_livraison"("clientId");

-- AddForeignKey
ALTER TABLE "bons_livraison" ADD CONSTRAINT "bons_livraison_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bons_livraison" ADD CONSTRAINT "bons_livraison_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "devis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bons_livraison" ADD CONSTRAINT "bons_livraison_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bon_livraison_lignes" ADD CONSTRAINT "bon_livraison_lignes_bonLivraisonId_fkey" FOREIGN KEY ("bonLivraisonId") REFERENCES "bons_livraison"("id") ON DELETE CASCADE ON UPDATE CASCADE;
