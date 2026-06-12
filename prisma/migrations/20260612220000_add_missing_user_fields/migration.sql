-- Add missing columns to utilisateurs that exist in schema but were never migrated
ALTER TABLE "utilisateurs"
  ADD COLUMN IF NOT EXISTS "dernierAcces" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "invitationToken" TEXT,
  ADD COLUMN IF NOT EXISTS "invitationTokenExpiration" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "prenom" TEXT;

-- Add unique index for invitationToken
CREATE UNIQUE INDEX IF NOT EXISTS "utilisateurs_invitationToken_key" ON "utilisateurs"("invitationToken");
