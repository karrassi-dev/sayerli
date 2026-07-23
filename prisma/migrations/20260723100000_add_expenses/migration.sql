-- CreateEnum
CREATE TYPE "CategorieDepense" AS ENUM ('LOYER', 'EQUIPEMENT', 'TRANSPORT', 'ABONNEMENTS', 'MATIERES_PREMIERES', 'SALAIRES', 'MARKETING', 'FOURNITURES', 'SOUS_TRAITANCE', 'AUTRE');

-- AlterTable
ALTER TABLE "entreprises" ADD COLUMN "storageUsedBytes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "depenses" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'MAD',
    "categorie" "CategorieDepense" NOT NULL,
    "fournisseur" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "receiptKey" TEXT,
    "receiptUrl" TEXT,
    "receiptSizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "depenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "depenses_entrepriseId_idx" ON "depenses"("entrepriseId");

-- AddForeignKey
ALTER TABLE "depenses" ADD CONSTRAINT "depenses_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
