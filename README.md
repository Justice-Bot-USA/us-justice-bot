# Justice Bot USA

Legal-information and court-forms platform for self-represented people in the United States. Operated by Justice Bot Technologies Inc. US operations are run through a US subsidiary (being formed).

Justice Bot USA provides **legal information, not legal advice**. It does not practice law, predict outcomes, or replace an attorney.

## Current status (October 2026)

This section is the source of truth for what works today. Keep it accurate; do not round up.

| Area | Status |
| --- | --- |
| **New York** | Dedicated hub at `/ny/legal-center`: 8 legal areas, forms catalog (`src/lib/ny/forms.ts`), filing procedures (`src/lib/ny/procedures.ts`). |
| **California** | Dedicated hub at `/ca/legal-center`: 7 legal areas, forms catalog (`src/lib/ca/forms.ts`), filing procedures (`src/lib/ca/procedures.ts`). Every Judicial Council form number was checked against selfhelp.courts.ca.gov. |
| **Other 48 states + DC** | Template pages only (`src/lib/funnels/us-funnels.ts`). Form lists are not individually verified. |
| **Form filling (CA)** | `/fill/ca`: 8 official Judicial Council forms filled from the user's answers (SC-100, FW-001, FW-003, UD-105, FL-100, FL-110, CR-180, CR-181). The user still makes the legal choices on the form (defenses, grounds, relief) and signs. $9.99 per form; UD-105 is free (see Known gaps). |
| **Form filling (NY)** | Not built yet. nycourts.gov blocks automated downloads, so the official PDFs have to be added by hand to `public/forms/ny/`. |
| **Funnel purchase** | The funnel's $9.99 purchase still delivers PDF **guides** (purpose, fees, deadlines, official link), not filled forms. The funnel's forms step links to the filler where a form is fillable. |
| **Payments** | Stripe checkout (`supabase/functions/stripe-checkout`): $9.99 single form, $19.99/month, $49.99 bundle, FOIA $9.99 / $29.99. |
| **Legal review** | NY and CA procedures have **not** yet been reviewed by a licensed attorney in those states. That review is required before a marketing launch. |

### Known gaps

- **California document-preparation rules:** charging to fill in eviction papers may require registration as an unlawful detainer assistant, and charging for other self-help forms as a legal document assistant (Bus. & Prof. Code §6400 et seq.). UD-105 is therefore free until California counsel advises. The other paid CA forms need the same review before marketing.
- New York form filling: see the status table.
- Merit scores and settlement estimates remain in the case funnel. They need a decision under NY and CA unauthorized-practice-of-law rules.
- Analytics: checkout tracking records $4.99, while the actual price is $9.99.
- Stripe metadata still carries `app: "veritas_path"` (retired name). Change it only together with any webhook logic that reads it.

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
```

## Project layout

```
src/pages/                 Route components (NewYorkLegalCenter, CaliforniaLegalCenter, funnels, pricing…)
src/lib/ny/, src/lib/ca/   State-specific forms catalogs and filing procedures
src/lib/forms/             Multi-state forms data; launch states (CA, NY) use their dedicated catalogs
src/lib/funnels/           50-state funnel templates and analytics
src/hooks/useFormsPdfGenerator.ts   PDF form guides delivered after the funnel purchase
src/lib/formfill/          Form filling: field maps per official form (ca.ts) and the pdf-lib filler (fill.ts)
public/forms/ca/           Official Judicial Council PDFs (owner password and XFA layer removed so fields display)
supabase/functions/        Edge functions (Stripe, PayPal, legal sweeps, search, analysis)
```

## Adding a state

1. Add `src/lib/<state>/forms.ts` and `procedures.ts`, following `src/lib/ca/`.
2. Check every form number and URL against the official court or agency site, and note the check date in the file header.
3. Register the catalog in `LAUNCH_STATE_FORMS` (`src/lib/forms/index.ts`).
4. Add a legal-center page and routes in `src/App.tsx`.
5. Get review from an attorney licensed in that state before marketing it.

## Deployment

The app is connected to Lovable. Changes pushed to the default branch sync to the Lovable project, which publishes the site.
