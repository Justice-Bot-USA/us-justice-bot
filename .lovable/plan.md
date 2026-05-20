
# New York State — Full Legal Coverage Parity with California

Goal: bring NY to the same depth as CA across **Criminal, Family, Divorce, CPS, Immigration, Workplace, Civil, and Human Rights**, with in-app forms, filing procedures, and automated daily sweeps to keep data fresh.

## 1. Modular Data Layer (NY-specific)

Create one module per legal area, mirroring the CA structure already in `src/lib/forms/`:

```text
src/lib/forms/ny/
  criminalFormsData.ts       // arraignment, motions, expungement (CPL 160.59), DAT
  familyFormsData.ts         // custody, visitation, support, orders of protection
  divorceFormsData.ts        // UD-1..UD-13 uncontested packet, contested, RJI
  cpsFormsData.ts            // ACS/OCFS forms, Article 10 responses, indicated-finding appeals
  immigrationFormsData.ts    // NY-specific (IDNYC, OneNYC), federal I-130/I-589/I-765 mirrors
  workplaceFormsData.ts      // NYSDOL LS forms, WTPA, NYC Commission on Human Rights
  civilFormsData.ts          // small claims CIV-SC-50, housing court (HP/HPD), consumer
  humanRightsFormsData.ts    // NYSDHR complaint, NYC CHR intake, Title VII parallels
  index.ts                   // getNYForms(category) aggregator
```

Each form record uses the existing `CourtForm` shape: `form_number, form_name, description, url, official_pdf_url, fee, category, is_required, instructions_md`.

Wire into `getExpandedStateFormsData('NY')` so the existing `FormsLibrary`, `IssueHubFormsPage`, and funnels pick it up automatically with no UI changes.

## 2. Filing Procedures (in-app, per category)

New module `src/lib/procedures/ny/` — one file per area. Each procedure exports a typed `FilingProcedure`:

```ts
{ id, category, title, steps: Step[], venue, fees, deadlines, eFilingUrl, sources }
```

Rendered by a new shared `<FilingProcedureView />` component (reused for any state later). Linked from each Issue Hub and Forms page via a "How to File" tab — no new routes needed; extends `IssueHubHelpPage`.

Covers for NY: e-filing via **NYSCEF**, county clerk filing, Family Court intake, Housing Court (HP action / non-payment answer), Small Claims (NYC vs upstate), DHR complaint intake, ACS fair hearings.

## 3. Issue Hubs (NY seeding)

Insert NY rows into existing `issue_hubs` + `issue_sections` + `form_packages` tables for all 8 categories using a one-time seed migration. Hub keys: `ny/criminal/...`, `ny/family/...`, etc. Reuses existing `IssueHubPage`, `IssueHubFormsPage`, `IssueHubHelpPage`, `IssueHubTimelinePage`, `IssueHubStartPage` — no new pages.

## 4. Daily Sweeps

New edge function `supabase/functions/ny-daily-sweep/index.ts`:
- Pulls latest from NYCourts.gov forms feed, NYSCEF announcements, NYSDOL bulletins, NYSDHR updates, ACS policy bulletins, USCIS/ICE NY field office notices (via existing Firecrawl).
- Upserts into `forms`, `form_packages`, `form_sources` (NY rows).
- Logs run in `juriscraper_ingest_logs` (reuse).
- Scheduled via `pg_cron` + `pg_net` to run daily at 06:00 UTC.

Also extends `juriscraper-ingest` to include NY court IDs (`ny`, `nyappdiv`, `nyappterm`, `nycivct`, `nyfamct`, `nysupct`, etc.) for daily opinion pulls.

## 5. Funnels

Extend `src/lib/funnels/us-funnels.ts` with NY funnel configs for each of the 8 areas (mirrors CA funnels), pointing at the new NY forms. The existing `FunnelEngine` + `FunnelFormsStep` will pick them up automatically.

## 6. Disclaimers / Guardrails

All new content carries the standard "legal information, not advice" disclaimer. Criminal area uses the existing read-only guardrail wording (no advice to plead/sue). No new compliance copy required.

## Technical notes

- No schema changes — all new content fits existing tables.
- One migration: seeds `issue_hubs`, `issue_sections`, `form_packages`, `form_sources` rows for NY.
- One cron entry created via insert tool (not migration) because it carries the project URL + anon key.
- New code is additive; no edits to CA modules.
- Form URLs use official sources only: nycourts.gov, dol.ny.gov, dhr.ny.gov, nyc.gov, ocfs.ny.gov, uscis.gov.

## Out of scope (this pass)

- Other states beyond NY.
- Custom NY UI redesign — reuses existing CA-style hub/forms/timeline pages.
- Attorney-drafted form fill-in (still link-out to official PDFs).
