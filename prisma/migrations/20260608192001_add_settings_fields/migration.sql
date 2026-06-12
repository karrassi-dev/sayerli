-- AlterTable
ALTER TABLE "entreprises" ADD COLUMN     "couleurPrimaire" TEXT DEFAULT '#2563eb',
ADD COLUMN     "formatDate" TEXT DEFAULT 'DD/MM/YYYY',
ADD COLUMN     "ice" TEXT,
ADD COLUMN     "pays" TEXT DEFAULT 'Maroc',
ADD COLUMN     "planExpiration" TIMESTAMP(3),
ADD COLUMN     "rc" TEXT,
ADD COLUMN     "ville" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "utilisateurs" ADD COLUMN     "langue" TEXT DEFAULT 'fr',
ADD COLUMN     "telephone" TEXT,
ADD COLUMN     "theme" TEXT DEFAULT 'system';

-- CreateTable
CREATE TABLE "preferences_notifications" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "notificationsDevis" BOOLEAN NOT NULL DEFAULT true,
    "notificationsFactures" BOOLEAN NOT NULL DEFAULT true,
    "notificationsPaiements" BOOLEAN NOT NULL DEFAULT true,
    "notificationsSysteme" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preferences_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "preferences_notifications_utilisateurId_key" ON "preferences_notifications"("utilisateurId");

-- AddForeignKey
ALTER TABLE "preferences_notifications" ADD CONSTRAINT "preferences_notifications_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
