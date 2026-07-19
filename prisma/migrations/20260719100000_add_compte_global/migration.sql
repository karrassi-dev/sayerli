-- CreateTable
CREATE TABLE "comptes_globaux" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "comptes_globaux_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "comptes_globaux_email_key" ON "comptes_globaux"("email");
ALTER TABLE "utilisateurs" ADD COLUMN "compteGlobalId" TEXT;
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_compteGlobalId_fkey" FOREIGN KEY ("compteGlobalId") REFERENCES "comptes_globaux"("id") ON DELETE SET NULL ON UPDATE CASCADE;
