# Justice Bot USA

Legal-information and court-forms platform for self-represented people in the United States. Justice Bot USA is a service of Quorex Solutions, a trade name of Justice Bot Technologies Inc. US operations are run through a US subsidiary (being formed).

Justice Bot USA provides **legal information, not legal advice**. It does not practice law, predict outcomes, or replace an attorney.

## Current status (October 2026)

This section is the source of truth for what works today. Keep it accurate; do not round up.

| Area | Status |
| --- | --- |
| **New York** | Dedicated hub at `/ny/legal-center`: 8 legal areas, forms catalog (`src/lib/ny/forms.ts`), filing procedures (`src/lib/ny/procedures.ts`). |
| **California** | Dedicated hub at `/ca/legal-center`: 7 legal areas, forms catalog (`src/lib/ca/forms.ts`), filing procedures (`src/lib/ca/procedures.ts`). Every Judicial Council form number was checked against selfhelp.courts.ca.gov. |
| **Other 48 states + DC** | Template pages only (`src/lib/funnels/us-funnels.ts`). Form lists are not individually verified. |
| **Form filling (CA)** | `/fill/ca`: 8 official Judicial Council forms filled from the user's answers (SC-100, FW-001, FW-003, UD-105, FL-100, FL-110, CR-180, CR-181). The user still makes the legal choices on the form (defenses, grounds, relief) and signs. Free to everyone. |
| **Form filling (NY)** | `/fill/ny`: 4 official forms, all free to everyone: CIV-SC-50 (NYC small claims), UCS-FW1 (fee waiver), and UD-1 (Summons with Notice) and UD-2 (Verified Complaint) for uncontested divorce. The court publishes UD-1 and UD-2 only as flat PDFs, so answers are drawn at measured positions (`src/lib/formfill/nyDivorce.ts`). The court's free DIY divorce program is linked alongside. Other NY forms are not fillable yet; official PDFs have to be added by hand to `public/forms/ny/` (nycourts.gov blocks automated downloads). NYC Housing Court answers are given in person or on the court's own form; the site explains the defenses and refers tenants to Housing Court Answers and Right to Counsel. |
| **Funnel** | The funnel delivers free PDF **guides** (purpose, fees, deadlines, official link). The funnel's forms step links to the filler where a form is fillable. |
| **Pricing** | Decided October 2026: every fillable form (all 12), the funnel's form guides and the public-records letter PDF are free; court and agency fees are separate and disclosed (`THIRD_PARTY_FEES_NOTE` in `src/lib/pricing.ts`). The only paid plan is the **Toolkit**, $25.00 a month (Stripe price `price_1UOYQSPr9cYwQq3CbOAjTe6i`, overridable with the `STRIPE_PRICE_MONTHLY` secret). **Sales are off** until the owner finishes the launch checklist below: `stripe-checkout` answers `create_subscription` with 409 `PLAN_PAUSED` and `/pricing` shows "Coming soon". Legacy one-time prices remain in `supabase/functions/_shared/stripe.ts` for old links only. Edge functions are deployed by hand. |
| **Toolkit plan (code written, not live yet)** | `/toolkit` (hub), `/toolkit/binder`, `/toolkit/calendar`, `/toolkit/classes` and `/account/billing`; `/book-of-documents` redirects to `/toolkit/binder`. Needs the migration `supabase/migrations/20261013120000_toolkit.sql` applied first. What is free and what needs the plan is in the Toolkit section below. Billing terms come word for word from `src/lib/billingDisclosure.ts` (counsel's text; a copy in `supabase/functions/_shared/billingDisclosure.ts` must stay identical, which `npm run check:toolkit` checks). |
| **Case analysis** | Decided October 2026: case analysis is a plain-language summary of what the user told us, the general legal area, general information with official links, and the CA/NY legal center as the next step. No merit score, success rate, settlement or dollar estimate, time estimate, legal strategy, or choosing/ordering of forms (Cal. Bus. & Prof. Code 6400(g), 6411(e); N.Y. Judiciary Law 495(1)(e)). The settlement calculator is retired and its routes redirect to `/legal-areas`. Old score columns stay in the database but are no longer written, shown or exported. |
| **Email updates list** | "Get updates" button next to Sign In (opens a dialog) and a signup in the site footer (`src/components/UpdatesSignup.tsx`) stores consented emails in `update_signups` (migration `20261011120000_update_signups.sql`; visitors can insert, only the service role reads). No email is sent automatically: there is no email provider. Removal requests go to privacy@justicebot-usa.com; set `unsubscribed_at`, and anyone sending must skip those rows. `source` is `header` or `footer` (older rows: a page type), never a form or legal area; `state` comes from the URL (CA/NY pages) or is empty. Migration `20261011150000_update_signups_header_footer.sql` allows the new source values. |
| **Search indexing of `/fill`** | Off. `FILL_PAGES_INDEXABLE` in `src/lib/formfill/index.ts` keeps the form pages `noindex` and out of the sitemap until the owner decides search listing is not a marketing launch (see Legal review). Turning it on adds canonical links and 14 sitemap URLs. |
| **Legal review** | NY and CA procedures have **not** yet been reviewed by a licensed attorney in those states. That review is required before a marketing launch. |

### Known gaps

- **California document-preparation rules:** charging to fill in eviction papers may require registration as an unlawful detainer assistant, and charging for other self-help forms as a legal document assistant (Bus. & Prof. Code §6400 et seq.). Every CA form is free now, so nothing is sold; get California counsel's advice before charging for any form-filling feature.
- New York form filling: see the status table.
- **Toolkit gaps (known, accepted for now):**
  - No price-change email sender exists yet. Terms §12 promises 10 to 30 days' notice, so no price or Toolkit change may ship until one is built and tested (the `billing_notices` kind `price_change` is ready).
  - The binder's 25 MB and PDF/JPG/PNG rules are checked in the browser only; the `evidence-files` bucket limits are unchanged. The binder reads each file's bytes and lists anything else as not included.
  - PDFs with security settings can't go in a binder (pdf-lib can't open them). They are named on the result screen and on the binder's "Not included" pages, with a separate download.
  - Binder and class-records PDFs use standard PDF fonts, so characters outside Latin-1 (Chinese, Vietnamese, emoji) print as "?". Spanish is fine.
  - Calendar alerts come from the person's calendar app; some apps drop imported alerts. Device tests (iPhone Calendar, Android Google Calendar, Gmail web, Outlook) are still to be done and recorded.
  - Account deletion is owner-run (`delete-my-data`); people can delete their own files in the app ("Delete all my files" on the binder page).
  - The Cloud Storage tab (`src/components/CloudStorageIntegration.tsx`) saves Google Drive links as case files; the binder shows them as links and leaves them out of the PDF.

## Tech stack

Vite · React · TypeScript · Tailwind CSS · shadcn/ui · Supabase (auth, Postgres, edge functions) · Stripe · Capacitor (mobile).

## Local development

Requires Node.js 18+.

```sh
npm install
npm run dev        # local dev server
npm run build      # production build (also regenerates public/sitemap.xml)
npm run lint
npx tsc -p tsconfig.app.json --noEmit   # type check
npm run check:toolkit   # Toolkit checks: .ics files, dates, binder PDFs, billing disclosure
```

`npm run check:toolkit` bundles each `scripts/toolkit/check-*.ts` with the project's esbuild and runs it with node; it needs no extra packages (it uses poppler's `pdftotext` for one extra binder check when installed). What each check covers is written at the top of its file.

## Project layout

```
src/pages/                 Route components (NewYorkLegalCenter, CaliforniaLegalCenter, funnels, pricing…)
src/lib/ny/, src/lib/ca/   State-specific forms catalogs and filing procedures
src/lib/forms/             Multi-state forms data; launch states (CA, NY) use their dedicated catalogs
src/lib/funnels/           50-state funnel templates and analytics
src/hooks/useFormsPdfGenerator.ts   Free PDF form guides delivered by the funnel
src/lib/formfill/          Form filling: field maps per official form (ca.ts, ny.ts) and the pdf-lib filler (fill.ts)
public/forms/ca/           Official Judicial Council PDFs (owner password and XFA layer removed so fields display)
public/forms/ny/           Official nycourts.gov PDFs (CIV-SC-50 with two bad field entries removed so pdf-lib can read it)
src/pages/toolkit/, src/components/toolkit/   Toolkit hub, case binder, hearing calendar, class tracker
src/pages/account/AccountBilling.tsx         "Your plan" page: status and Cancel subscription
src/lib/toolkit/           Toolkit data layer (types, queries, plan access)
src/lib/binder/            Binder PDF builder (pdf-lib, runs in the browser), upload checks, storage
src/lib/calendar/          Typed-date helpers and .ics calendar files
src/lib/billingDisclosure.ts   The single source of all billing wording (counsel's text)
scripts/toolkit/           npm run check:toolkit
supabase/migrations/       Database migrations (the Toolkit one is 20261013120000_toolkit.sql)
supabase/functions/        Edge functions (Stripe, billing emails, analysis; retired ones answer 410 Gone)
```

## Toolkit plan

Justice Bot USA's only paid plan: **Toolkit, $25.00 a month**, renews monthly until cancelled, no trial, no promo codes, no annual price (any of those needs a new counsel review first). Legal information, not legal advice. Nothing in the Toolkit computes, suggests, prefills, compares or checks a legal date, hour or requirement: dates and hours are only what the person types, and past calendar entries say only "Past".

| What | Without a plan (or after a plan ends) | With an active plan |
| --- | --- | --- |
| Case binder (`/toolkit/binder`) | Upload PDF, JPG and PNG files (25 MB each), view, rename, put in order, add a typed date and notes, download, delete one or all | Also make one binder PDF of the PDF, JPG and PNG files, in the chosen order: cover, contents, optional page numbers in a margin band, and a "Not included" list for everything else |
| Hearing calendar (`/toolkit/calendar`) | See, change and delete saved dates; download `.ics` calendar files | Also add new dates |
| Class tracker (`/toolkit/classes`) | See, change and delete class records and sessions; download "Your class records (self-reported)" PDF | Also add new classes and sessions; "Track this class" in the Course Hub |

How it works:
- **Plan check:** `public.my_toolkit_access()` (an active `subscriptions` row with `end_date` later than 2 days ago, or the admin role). Row-level security allows inserts into the calendar and class tables only with a plan; updates and deletes never need one, so a person whose plan ended can always fix or remove their own data. The binder PDF is made in the browser and is gated in the page.
- **Dates:** stored as `yyyy-MM-dd` strings and never passed to `new Date('yyyy-MM-dd')`. Every new date, and every change to a date, time or time zone, is read back ("This matches my papers") before saving; a database trigger refuses a date change without a new confirmation. The calendar accepts the 7 US time zones in `src/lib/calendar/dates.ts`; it is organizing software, while legal content stays California and New York only.
- **Calendar files:** `.ics` with alerts the person picks, a "Leave court details out of the calendar file" option (title "Appointment", no place, no notes) and a lock-screen warning. `SEQUENCE` goes up on every edit so a re-imported file replaces the old event.
- **Privacy:** admins can't read other people's cases, files or stored objects (the admin "ALL" policies are dropped); `/admin/analytics` uses the count-only functions `admin_case_file_count()` and `admin_case_stats()`. Case titles, file names, event titles, class names and notes are never sent to analytics or logs.
- **Billing:** Pricing shows counsel's terms box directly above two required, unticked checkboxes; `stripe-checkout` stores a consent record (with a SHA-256 of the exact text shown) before creating a card-only Checkout session. `stripe-webhook` records the plan, sends counsel's acknowledgment email, ends the plan when the latest charge is fully refunded (unless the charge or refund has metadata `keep_plan=true`) and refunds, then cancels, a second, duplicate plan. Cancelling is online at `/account/billing` (account menu, "Cancel subscription") or by email to billing@justicebot-usa.com; a confirmation email follows. `billing-notices` (daily cron) retries failed notices and sends the annual reminder. Consent and notice records, and payment and subscription records, are kept even if the account is deleted.

### Owner setup before sales open

Sales stay closed unless **all** of these hold: the `TOOLKIT_SALES_ENABLED` secret is exactly `true`, billing email is configured, the Stripe price is $25.00 a month, its product is named "Justice Bot USA Toolkit" with the approved description (`TOOLKIT_PRODUCT_DESCRIPTION` in `supabase/functions/_shared/billingDisclosure.ts`), and the Stripe account's public business name is "Justice Bot USA" (`supabase/functions/stripe-checkout/sales.ts`). In order:

1. Apply `supabase/migrations/20261013120000_toolkit.sql` (Postgres 15+; the Supabase CLI wraps it in one transaction). Then regenerate the TypeScript types and compare them with the hand-written additions in `src/integrations/supabase/types.ts`.
2. Deploy `stripe-checkout`, `stripe-webhook`, `cancel-subscription`, `check-subscription`, `court-export-pdf`, `billing-notices` (`verify_jwt = false`, checks `x-cron-secret`) and `delete-my-data` (`verify_jwt = true`, admin only). The shared code in `supabase/functions/stripe-webhook/toolkitSubscriptions.ts` and `_shared/` is bundled by the CLI.
3. Resend: create the account, verify the sending domain (SPF and DKIM in Cloudflare), then set the secrets `RESEND_API_KEY` and `BILLING_FROM_EMAIL` (optional: `BILLING_REPLY_TO`, `OWNER_ALERT_EMAIL`).
4. Set `CRON_SECRET` (at least 16 characters), store `project_url` and `billing_cron_secret` in Vault, and schedule the daily `billing-notices` job (SQL at the top of `supabase/functions/billing-notices/index.ts`).
5. Stripe: product name and description as above, account business name "Justice Bot USA", support email billing@justicebot-usa.com with a working inbox, Terms and Privacy URLs, successful-payment receipts on, and an invoice footer with the renewal and cancel terms. Add `invoice.paid` and `charge.refunded` to the webhook endpoint.
6. Admin accounts: require MFA, turn on leaked-password protection, and keep admin roles to the minimum (admins get Toolkit access for testing).
7. Test live: a $25.00 purchase (acknowledgment email arrives, `/payment-success` says it was emailed), a cancellation (confirmation email), a refund of the latest charge (plan ends, email arrives), one `billing-notices` call with the secret, and the `.ics` device tests. Get counsel's sign-off in writing and keep dated screenshots of the terms box, Checkout, emails and the cancel flow.
8. Only then set `TOOLKIT_SALES_ENABLED` to `true`. Leave it unset (off) until every step above is done.

## Adding a state

1. Add `src/lib/<state>/forms.ts` and `procedures.ts`, following `src/lib/ca/`.
2. Check every form number and URL against the official court or agency site, and note the check date in the file header.
3. Register the catalog in `LAUNCH_STATE_FORMS` (`src/lib/forms/index.ts`).
4. Add a legal-center page and routes in `src/App.tsx`.
5. Get review from an attorney licensed in that state before marketing it.

## Deployment

- **Site:** Cloudflare Pages builds and publishes `main` to justicebot-usa.com (DNS on Cloudflare). Each pull request gets a preview build.
- **Database and auth:** Supabase project `jhgkshjqgagxfllgvhco` (justicebot-usa), owned by the company's own Supabase organization.
- **Edge functions:** deployed by hand from `supabase/functions/` (no automatic deploy since leaving Lovable). Redeploy a function after changing it or anything in `_shared/`.

## License and trademarks

Proprietary. © Justice Bot Technologies Inc. All rights reserved; no license is granted. See [LICENSE](LICENSE).

"Justice Bot", "Justice Bot USA", "Quorex", "Quorex Solutions", and the related logos are trademarks of Justice Bot Technologies Inc. Quorex Solutions is the company's trade name. Open-source dependencies and official court forms keep their own terms (see LICENSE).
