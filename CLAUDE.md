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

### Session N — Dashboard analytics (full)
All KPI cards and lists are wired to real backend data:
- **Top 5 clients** — ranked by total billed (CA), backend GROUP BY query in `dashboard.service.ts`, displayed as a bar chart in the dashboard.
- **Factures en retard list** — full list with client name, amounts, due date, and inline "Relancer" button (calls `facturesApi.relancer`).
- **CA en attente** — sum of totalTTC − montantPaye for ENVOYEE + EN_RETARD factures.
- **Taux de recouvrement** — paiements reçus ÷ total facturé, shown as a sub-label on the CA card.

### Session N — Reçu de paiement PDF
- `frontend/components/pdf/RecuPDF.tsx` — clean receipt PDF component.
- `frontend/components/pdf/RecuDownloadButton.tsx` — download button wrapper.

### Session N — Catalogue de produits/services
- Backend: `src/modules/catalogue/` — full CRUD module.
- Frontend: `frontend/app/dashboard/catalogue/page.tsx` — manage products/services (nom, description, prix, unité, type SERVICE/PRODUIT).
- `frontend/components/dashboard/ui/CataloguePicker.tsx` — picker integrated into the devis form so users can insert catalogue items into lines.

### Session N — Relance automatique des factures en retard
- Backend: `src/modules/relances/relances.service.ts` — cron job runs daily at 07:00 UTC (08:00 Casablanca). Auto-sends email reminders for EN_RETARD factures respecting a per-plan `relancesParMois` limit.
- Manual relance also available via `factures.service.ts` `relancerFacture()`.

### Session N — Portal dark/light mode + new pricing plans
- Portal page: dark/light mode toggle in header, implemented with inline styles (not Tailwind `dark:`) to avoid conflicts with main app theme.
- Backend: updated pricing plans — Starter / Pro / Business.
- Landing: updated pricing section.
- Settings/Billing: corrected plan display + WhatsApp upgrade button.

### Session N — Notification polling pause
- `NotificationProvider` now pauses polling when tab is hidden (`document.visibilityState`). Resumes immediately on tab focus via `visibilitychange` listener.

### Session N — 402 modal on duplicate/convert (devis)
- `handleDuplicate` and `handleConvert` in `devis/page.tsx` both correctly catch 402 and open `PlanLimitModal` (resource `'devis'` and `'factures'` respectively).

---

## What is NOT done yet / known gaps

### Features not started
1. **Recurring Invoices** — New `RecurringInvoiceTemplate` Prisma model, cron job to auto-create factures on schedule, frontend form to set up templates.
2. **Déclaration TVA automatique** — from Journal des Ventes, auto-calculate TVA collectée for a period and generate a summary for the comptable. No competitor does this well.
3. **Bon de livraison** — many Moroccan transactions require a BL before the facture. Same lines as devis, different header. Opens a new segment.
4. **Multi-devises** — some agencies bill in EUR/USD. Per-devis currency with exchange rate display.
5. **Digital Signature on Devis** — skipped because requires Cloudinary storage (user is on free tier). Skip until storage situation changes.

---

## Plan limits (current state)
- STARTER: 5 clients, 10 devis/month, 10 factures/month, 1 utilisateur, relances limited
- PRO: unlimited clients/devis/factures, 5 utilisateurs
- BUSINESS: unlimited everything
- Email notifications locked on STARTER
- `verifierLimite` accepts: 'clients' | 'devis' | 'factures' | 'utilisateurs' | 'relances'

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
- Catalogue: `src/modules/catalogue/`
- Relances auto: `src/modules/relances/relances.service.ts`
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
- Catalogue page: `frontend/app/dashboard/catalogue/page.tsx`
- Public facture page: `frontend/app/public/factures/[token]/page.tsx`
- PDF components: `frontend/components/pdf/FacturePDF.tsx` + `FactureSimplePDF.tsx` + `DevisPDF.tsx` + `RecuPDF.tsx` + `RecuDownloadButton.tsx`
- Catalogue picker: `frontend/components/dashboard/ui/CataloguePicker.tsx`
- Notification provider: `frontend/components/providers/NotificationProvider.tsx`
- API client: `frontend/lib/api.ts`
- Translations: `frontend/i18n/fr.json` + `en.json` + `ar.json`
- Middleware/permissions: `frontend/middleware.ts` + `frontend/lib/permissions.ts`
