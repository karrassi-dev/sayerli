ALTER TABLE "utilisateurs"
  ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT,
  ADD COLUMN IF NOT EXISTS "resetPasswordExpiration" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "utilisateurs_resetPasswordToken_key" ON "utilisateurs"("resetPasswordToken");
