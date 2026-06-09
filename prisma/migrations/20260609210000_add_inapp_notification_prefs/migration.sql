ALTER TABLE "preferences_notifications"
  ADD COLUMN "inAppDevis"     BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "inAppFactures"  BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "inAppPaiements" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "inAppSysteme"   BOOLEAN NOT NULL DEFAULT true;
