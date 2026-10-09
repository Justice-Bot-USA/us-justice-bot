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
| **What a paying user gets** | A PDF **guide** per form (purpose, fees, deadlines, link to the official form) plus a forms-package checklist. Forms are **not** pre-filled yet. |
| **Payments** | Stripe checkout (`supabase/functions/stripe-checkout`): $9.99 single form, $19.99/month, $49.99 bundle, FOIA $9.99 / $29.99. |
| **Legal review** | NY and CA procedures have **not** yet been reviewed by a licensed attorney in those states. That review is required before a marketing launch. |

### Known gaps

- Filling official court PDFs with the user's information is not built yet. Many California Judicial Council forms are fillable PDFs, which makes them the first target.
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
src/hooks/useFormsPdfGenerator.ts   PDF form guides delivered after purchase
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
