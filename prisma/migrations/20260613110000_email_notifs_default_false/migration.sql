-- Change defaults to false for email notification fields
ALTER TABLE "preferences_notifications"
  ALTER COLUMN "emailNotifications" SET DEFAULT false,
  ALTER COLUMN "notificationsDevis" SET DEFAULT false,
  ALTER COLUMN "notificationsFactures" SET DEFAULT false,
  ALTER COLUMN "notificationsPaiements" SET DEFAULT false,
  ALTER COLUMN "notificationsSysteme" SET DEFAULT false;

-- Reset all existing records to false for email fields
UPDATE "preferences_notifications"
SET
  "emailNotifications" = false,
  "notificationsDevis" = false,
  "notificationsFactures" = false,
  "notificationsPaiements" = false,
  "notificationsSysteme" = false;
