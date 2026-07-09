-- Add portalToken to clients, backfill existing rows, then enforce NOT NULL + unique
ALTER TABLE "clients" ADD COLUMN "portalToken" TEXT;
UPDATE "clients" SET "portalToken" = gen_random_uuid()::text WHERE "portalToken" IS NULL;
ALTER TABLE "clients" ALTER COLUMN "portalToken" SET NOT NULL;
CREATE UNIQUE INDEX "clients_portalToken_key" ON "clients"("portalToken");
