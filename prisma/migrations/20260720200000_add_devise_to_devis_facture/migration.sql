-- AddColumn devise to devis and factures
ALTER TABLE "devis" ADD COLUMN IF NOT EXISTS "devise" TEXT NOT NULL DEFAULT 'MAD';
ALTER TABLE "factures" ADD COLUMN IF NOT EXISTS "devise" TEXT NOT NULL DEFAULT 'MAD';
