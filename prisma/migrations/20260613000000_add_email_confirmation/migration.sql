ALTER TABLE "utilisateurs"
  ADD COLUMN IF NOT EXISTS "emailConfirme" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "emailConfirmationToken" TEXT,
  ADD COLUMN IF NOT EXISTS "emailConfirmationExpiration" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "utilisateurs_emailConfirmationToken_key" ON "utilisateurs"("emailConfirmationToken");
