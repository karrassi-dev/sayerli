# Sayerli — Context for Claude Code

## Project
B2B SaaS for Moroccan freelancers, auto-entrepreneurs, and PMEs.
Invoicing, quotes, clients, payments, team management.
Stack: NestJS + Prisma + PostgreSQL (backend on Railway), Next.js 15 App Router + TailwindCSS (frontend on Vercel), Neon PostgreSQL, Resend email, Cloudinary (free tier — avoid adding image storage features).

GitHub: https://github.com/karrassi-dev/sayerli.git
Token: (stored locally — do not commit)
Frontend: sayerli.com (Vercel auto-deploy from main)
Backend: Railway (runs `npx prisma migrate deploy && node dist/src/main` on deploy)

---

## What has been built (all committed and pushed to main)

### Session 1 — Core features

**Bug fixes**
- `dupliquerDevis` — was bypassing the 10/month STARTER plan limit. Fixed.
- Factures plan limit — STARTER had no limit on factures. Added `facturesParMois: 10` to `PLAN_LIMITS`, added guard to `creerFacture` and `convertirEnFacture`, wired `PlanLimitModal` on the factures page.
- Footer links — all footer links were `#` (broken). Fixed to real routes.

**Feature — Client Portal**
Every client has a `portalToken` (UUID, unique) on the `Client` model.
- `GET /api/v1/public/portal/:token` — returns client + devis + factures + entreprise branding. Rate limited 30 req/min.
- `POST /api/v1/public/portal/:token/devis/:devisId/accepter` — accept devis from portal.
- `GET /api/v1/clients/:id/lien-portal` — authenticated endpoint returns portal URL.
- Frontend page `/portal/[token]` — shows company branding, client greeting, pending devis cards with Accept button, factures list.
- "Lien portail" action in clients page ActionMenu copies URL to clipboard.

**Feature — Journal des Ventes export**
- Export mode selector: "Export général" vs "Journal des ventes".
- Journal mode: period auto-switches to all, BROUILLON/ANNULEE filtered out.
- Excel columns: Date Facture, N° Facture, Client, Entreprise Client, ICE Client, IF Fiscal, Montant HT, TVA%, Montant TVA, Montant TTC, Montant Payé, Reste à Payer, Statut.
- PARTIELLE factures show full TTC + paid + remaining.
- File named `journal-ventes-YYYY-MM-DD.xlsx`.

### Session 2 — ICE / IF Fiscal on Client

Added `ice` and `ifFiscal` optional fields to the `Client` Prisma model.

**Rules:**
- ENTREPRISE → shows ICE + IF Fiscal in the form
- FREELANCE → shows IF Fiscal only
- PARTICULIER → shows neither

**Changes:**
- `prisma/schema.prisma` — added `ice String?` and `ifFiscal String?` to Client model
- Migration: `20260709100000_add_ice_iffiscal_to_client`
- `dto/creer-client.dto.ts` + `modifier-client.dto.ts` — added both fields as optional `@IsString()`
- `clients.service.ts` — added `ice` and `ifFiscal` to `listerClients` select
- `export.service.ts` — added both fields to the factures → client select
- `clients/page.tsx` — form fields, payloads, openEdit, detail modal all updated
- `export/page.tsx` — wires `f.client?.ice` and `f.client?.ifFiscal` in journal export
- `i18n/fr.json` + `en.json` + `ar.json` — all labels and placeholders translated in 3 languages

### Session 2 — Remise carried from Devis to Facture

`remise` on Devis is a **fixed MAD amount** (not a percentage).
Previously it was silently dropped when converting a devis to facture.

**Changes:**
- `prisma/schema.prisma` — added `remise Decimal @default(0)` to Facture model
- Migration: `20260714000000_add_remise_to_facture`
- `creer-facture.dto.ts` — added optional `remise` field
- `factures.service.ts` — `calculerTotaux` now accepts `remise`, applied in `creerFacture` and `modifierFacture`
- `devis.service.ts` `convertirEnFacture` — now passes `remise: devis.remise`
- `FactureSimplePDF.tsx` + `FacturePDF.tsx` — show "Remise −X MAD" line when remise > 0
- `factures/page.tsx` — detail modal shows amber "Remise appliquée" badge
- `public/factures/[token]/page.tsx` — passes `remise` to both PDF builders

---

## What is NOT done yet / known gaps

### Quick fixes (30 min each)
1. **402 modal missing on `handleDuplicate` and `handleConvert` in devis page** — both handlers show a toast instead of `PlanLimitModal` on 402. Only `handleCreate` shows the modal correctly.
2. **Notification polling pause** — `NotificationProvider` polls every 30s even when tab is hidden. Add `document.visibilitychange` listener to pause it.

### Dashboard analytics — 3 missing pieces (the rest already works)
The dashboard already has charts (Recharts), KPI cards with real data, area chart, donut chart, bar chart, recent invoices, activity timeline — all wired to real backend data.

**Missing:**
3. **Top 5 clients** — ranked by total billed (CA). Backend needs one extra GROUP BY query, frontend needs one new block.
4. **Factures en retard list** — dashboard shows a count but not the actual list with inline "Relancer" button.
5. **CA en attente + Taux de recouvrement** — two KPI numbers not yet in the cards. CA en attente = sum of totalTTC of ENVOYEE + EN_RETARD. Taux = paiements reçus ÷ total facturé.

### Medium features
6. **Recurring Invoices (Feature 3)** — not started. New `RecurringInvoiceTemplate` Prisma model, cron job to auto-create factures on schedule, frontend form to set up templates.
7. **Reçu de paiement PDF** — when a facture is marked PAYEE, generate a clean receipt PDF. Expected in Morocco, especially by comptables.

### Bigger features (future roadmap)
8. **Relance automatique des factures en retard** — when a facture hits `EN_RETARD`, auto-send WhatsApp/email reminder after X days. Biggest pain point for freelancers.
9. **Déclaration TVA automatique** — from Journal des Ventes, auto-calculate TVA collectée for a period and generate a summary for the comptable. No competitor does this well.
10. **Bon de livraison** — many Moroccan transactions require a BL before the facture. Same lines as devis, different header. Opens a new segment.
11. **Catalogue de produits/services** — pre-save recurring services and pick from dropdown when creating a devis. Saves 80% of time for freelancers with standard rates.
12. **Multi-devises** — some agencies bill in EUR/USD. Per-devis currency with exchange rate display.
13. **Digital Signature on Devis** — skipped because requires Cloudinary storage (user is on free tier). Skip until storage situation changes.

---

## Recommended next order
1. Fix 402 modal on duplicate/convert in devis page (20 min)
2. Dashboard — Top 5 clients + Factures en retard list + CA en attente (2-3h total)
3. Reçu de paiement PDF
4. Relance automatique
5. Recurring Invoices

---

## Plan limits (current state)
- STARTER: 5 clients, 10 devis/month, 10 factures/month, 1 utilisateur
- PRO: unlimited clients/devis/factures, 5 utilisateurs
- BUSINESS: unlimited everything
- Email notifications locked on STARTER
- Catalogue: no limit defined
- `verifierLimite` accepts: 'clients' | 'devis' | 'factures' | 'utilisateurs'

---

## Key file paths

### Backend
- Plan limits: `src/common/utils/plan-limits.ts`
- Portal: `src/modules/portal/portal.service.ts` + `portal.controller.ts` + `portal.module.ts`
- Export: `src/modules/export/export.service.ts`
- Clients: `src/modules/clients/clients.service.ts` + `dto/creer-client.dto.ts` + `dto/modifier-client.dto.ts`
- Factures: `src/modules/factures/factures.service.ts` + `dto/creer-facture.dto.ts`
- Devis: `src/modules/devis/devis.service.ts`
- Dashboard: `src/modules/dashboard/dashboard.service.ts` + `dashboard.controller.ts`
- Schema: `prisma/schema.prisma`
- App module: `src/app.module.ts`

### Frontend
- Dashboard: `frontend/app/dashboard/page.tsx`
- Charts component: `frontend/components/dashboard/ui/Charts.tsx`
- Portal page: `frontend/app/portal/[token]/page.tsx`
- Export page: `frontend/app/dashboard/export/page.tsx`
- Clients page: `frontend/app/dashboard/clients/page.tsx`
- Devis page: `frontend/app/dashboard/devis/page.tsx`
- Factures page: `frontend/app/dashboard/factures/page.tsx`
- Public facture page: `frontend/app/public/factures/[token]/page.tsx`
- PDF components: `frontend/components/pdf/FacturePDF.tsx` + `FactureSimplePDF.tsx` + `DevisPDF.tsx`
- API client: `frontend/lib/api.ts`
- Translations: `frontend/i18n/fr.json` + `en.json` + `ar.json`
- Middleware/permissions: `frontend/middleware.ts` + `frontend/lib/permissions.ts`
