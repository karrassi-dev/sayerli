-- CreateEnum
CREATE TYPE "TypeItem" AS ENUM ('PRODUIT', 'SERVICE');

-- CreateTable
CREATE TABLE "produits_services" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "type" "TypeItem" NOT NULL DEFAULT 'SERVICE',
    "prixUnitaire" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "unite" TEXT DEFAULT 'forfait',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produits_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "produits_services_entrepriseId_idx" ON "produits_services"("entrepriseId");

-- AddForeignKey
ALTER TABLE "produits_services" ADD CONSTRAINT "produits_services_entrepriseId_fkey"
  FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
