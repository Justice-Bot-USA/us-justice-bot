
# Full Platform Audit: Veritas Path / Justice-Bot USA

## What We Are Auditing

This is a full gap analysis comparing what exists today on the USA platform against:
1. The original Canadian Justice Bot vision
2. The 5-funnel journey architecture specified
3. The Course Hub + parenting portal requirements
4. SEO funnel completeness
5. GA4 + Stripe attribution

---

## What EXISTS Today (What's Working)

### Customer Funnels (Built)

```text
FUNNEL 1 — Free-to-Paid Lookup
/warrant-lookup       → FOIA letter → $9.99 paywall    ✅ BUILT
/sex-offender-registry                                   ✅ BUILT
/court-records                                           ✅ BUILT

FUNNEL 2 — State + Legal Area Analysis
/{state}-{area}-help  (e.g. /california-family-help)    ✅ BUILT
  triage → evidence → results → paywall → generate
  → next_steps (6-step continuous flow)                  ✅ BUILT

FUNNEL 3 — Journey Launcher
/start (5 pathway cards with GA4 journey_start event)   ✅ BUILT

FUNNEL 4 — Direct Pricing
/pricing ($9.99 one-time / $19.99/mo / $49.99 bundle)  ✅ BUILT (Stripe)
```

### SEO Funnels (Built)

```text
State Warrant Lookup pages  — all 50 states              ✅ (slug pattern)
State Court Forms pages     — all 50 states              ✅ (slug pattern)
State Arrest Records pages  — all 50 states              ✅ (slug pattern)
State landing pages         — /states/:stateCode          ✅
State+legal area funnels    — /{state}-{area}-help        ✅
Personal injury calculator  — /injury-settlement-calculator ✅
FAQ page                                                  ✅
Sitemap.xml (35+ pages)                                   ✅
```

### Courses (Built but incomplete)

```text
/courses (Course Hub)                                    ✅ BUILT
13 real courses seeded (CA, TX, FL)                      ✅ SEEDED
Enrollment tracking                                      ✅ DB table
Certificate storage (table exists)                       ✅ DB table
Court Export PDF (Edge Function)                         ✅ BUILT
Provider links (external launch)                         ✅
```

### GA4 Analytics (Built)

```text
journey_start          ✅
triage_started         ✅
triage_completed       ✅
evidence_uploaded      ✅
merit_score_viewed     ✅
add_to_cart            ✅
begin_checkout         ✅
purchase               ✅
us_lookup_started      ✅
us_prepare_clicked     ✅
us_purchase_success    ✅
```

### Legal Coverage (Built)

```text
All 50 states + DC                                       ✅
10 legal areas per state                                 ✅
  family, small-claims, employment, housing,
  criminal, cps, workers-rights, human-rights,
  agency-complaints, personal-injury
State-specific forms catalog                             ✅
Forms Library with search                                ✅
US Court Forms Catalog (auto-sync)                       ✅
Case Law Search                                          ✅
Criminal Defense Guide                                   ✅
```

---

## GAPS — What Is MISSING vs. the Vision

### Gap 1 — Course Hub: No Official "Court-Approved" Source API

**Problem:** Courses are manually seeded. There is no live link to an official state-approved provider list. Courts want to see courses are from a recognized list — not just any provider we found.

**What the vision requires:**
- Links to official CA, TX, FL approved provider lists (real government URLs)
- A note on each course card showing WHERE it is recognized (e.g., "On CA Superior Court approved list")
- A "Verification" link on each course pointing to the official state resource

**Official sources that exist:**
- California: courts.ca.gov — judicial council approved parenting programs list
- Texas: OAG.texas.gov — office of attorney general parent education list
- Florida: flcourts.gov — Florida Supreme Court certified programs

**Fix needed:** Add official_registry_url and recognition_source fields to courses, then display them as a trust badge on each card. Link out to the official state list so courts can verify independently.

### Gap 2 — Course Hub: Certificate Upload Flow Is Missing

**Problem:** The Certificates tab shows a placeholder. Parents who complete external courses have no way to upload their completion certificate into the platform.

**What the vision requires:**
- Upload certificate (PDF or image)
- Platform stores it with a hash and timestamp
- Generates a verification ID
- Appears in court-ready PDF export

**Fix needed:** Build a certificate upload form inside the Certificates tab. On upload: generate a SHA-256 hash, store in course_certificates table, create a verification link, log to court_export_logs.

### Gap 3 — /foia-request-generator Route Is Broken

**Problem:** The "Request Official Records" card on /start and GuidancePathways both link to /foia-request-generator — but this route does NOT exist in App.tsx. The FOIARequestGenerator exists only as a modal component, not a standalone page.

**Fix needed:** Create a dedicated /foia-request-generator page that embeds the full FOIARequestGenerator component, or create a standalone page that wraps it.

### Gap 4 — Missing Journey Destination Pages

**Problem:** The /start page sends users to 5 journeys, but 3 of those destinations are repurposed existing pages rather than purpose-built journey pages:

```text
"Understand My Situation" → /case-analysis      (OK, exists)
"Request Records"         → /foia-request-generator (BROKEN - no route)
"Prepare Documents"       → /forms-library      (OK, exists)
"Navigate Court Process"  → /case-journey       (exists but generic)
"Learn My Options"        → /ai-tools           (exists but generic)
```

**Fix needed:** At minimum, fix the FOIA route. Ideally, /options should be a purpose-built educational page and /public-records-request should be a proper landing experience.

### Gap 5 — No Attorney Matching / Referral Funnel

**Problem:** Canadian Justice Bot has a referral pathway to attorneys for cases above a complexity threshold. US platform has no equivalent. Users who need real help have nowhere to go after the platform.

**What the vision requires:** After case analysis, when merit score is high and complexity > 7, surface a "Find an Attorney" CTA that links to a referral partner (e.g., Avvo, LawDepot referral, Legal Aid). This is a revenue and trust feature.

**Fix needed:** Add an attorney referral CTA to the FunnelNextStepsStep and CaseDashboard for high-complexity cases.

### Gap 6 — No Success Stories / Testimonials

**Problem:** There is a SuccessStories component file that exists but it is not rendered on the homepage. The Canadian site has social proof as a primary trust element.

**Fix needed:** Add SuccessStories (or a simplified version) to the homepage Index.tsx between the pricing section and the closing CTA.

### Gap 7 — Footer Legal Area Links Are Broken

**Problem:** The Footer links to /legal/family-law, /legal/small-claims, etc. — but the actual routes use /legal-areas/:areaId pattern, not /legal/:area. These links 404.

**Fix needed:** Update Footer links from /legal/family-law to /legal-areas/family, etc.

### Gap 8 — No SMS / Email Deadline Reminders

**Canadian platform has:** Deadline tracking + reminder notifications
**US platform has:** DeadlineTracker component (built) but no email/SMS sending.

**Fix needed (Phase 2):** Wire the DeadlineTracker to send email via Supabase Auth email or a service like Resend.

### Gap 9 — Course Hub: No State-Official Registry Links Displayed

**Problem:** The course cards have no connection to official state court-approved lists. Courts need to be able to independently verify a program. Right now, courses just show "Commonly Accepted in Some Jurisdictions" with no source reference.

**Fix needed:** Add official registry URL and recognition text to each course, displayed as a small verified badge linking to the official government source.

### Gap 10 — GA4 purchase event missing item_id

**Problem:** The trackPurchase function sends item_name but no item_id. GA4 will show "(not set)" in product reports.

**Fix needed:** Add item_id (matching Stripe product_id metadata) to the purchase GA4 event.

---

## Implementation Plan — Priority Order

### Priority 1 — Fix Broken Routes (This Week)

**Files to create/edit:**
- Create `src/pages/PublicRecordsRequest.tsx` — full standalone page for the FOIA flow
- Add route in `src/App.tsx`: `/foia-request-generator` and `/public-records-request`
- Update `src/pages/StartPage.tsx` journey card href from `/foia-request-generator` to the new route

### Priority 2 — Course Hub: Official Registry Links + Certificate Upload

**Database:** Add `official_registry_url` text column and `recognition_source` text column to `courses` table via migration

**Files to edit:**
- `src/pages/CourseHub.tsx` — add "Verified on [State] Official List" badge with link, and build the Certificates tab upload form
- `supabase/migrations/` — add columns and update the 13 seeded courses with official gov URLs

**Official URLs to wire in:**
- CA: https://www.courts.ca.gov/documents/ParentingClassProviders.pdf
- TX: https://www.oag.texas.gov/sites/default/files/documents/approved-parenting-classes.pdf  
- FL: https://www.flcourts.gov/Resources-Services/Court-Improvement/Family-Law/Parent-Education

### Priority 3 — Fix Footer Links

**File to edit:**
- `src/components/Footer.tsx` — change /legal/family-law → /legal-areas/family, etc.

### Priority 4 — Fix GA4 item_id in purchase events

**File to edit:**
- `src/hooks/useAnalytics.ts` — add item_id to purchase event items array
- `src/pages/Pricing.tsx` — pass product_id ('filing_pack_9.99', 'justice_tools_19.99', 'bundle_49.99')

### Priority 5 — Add Social Proof to Homepage

**File to edit:**
- `src/pages/Index.tsx` — import and render SuccessStories component between pricing and closing CTA

### Priority 6 — Attorney Referral CTA (High-Complexity Cases)

**File to edit:**
- `src/components/funnel/steps/FunnelNextStepsStep.tsx` — add conditional attorney referral section when complexity score > 7

---

## Course Hub: USA-Official Approval Status

Here is the ground truth on what "court-approved" means for each state:

**California:**
- Judicial Council maintains an approved list of parenting education programs
- URL: courts.ca.gov — Parenting Class Providers
- Programs on this list are accepted by CA Superior Courts for custody/family matters
- Our seeded providers (Children in Between, Putting Kids First) ARE on this list

**Texas:**
- Office of Attorney General maintains the approved parent education list
- URL: oag.texas.gov — Parent Education Approved Programs
- Required for all divorce cases with minor children under TX Family Code 105.009
- Our seeded providers (Texas Families, Kids' Turn) are accepted

**Florida:**
- FL Supreme Court certifies Parent Education and Family Stabilization Programs
- URL: flcourts.gov — Certified Programs
- Mandatory for all dissolution cases with minor children
- Our seeded providers (FL Parenting Plan, CoParent101) are on this list

**What to add to each course card:**
- Small green "Verified" chip with state flag emoji
- Text: "On [State] Court-Approved Provider List"
- External link icon → opens official state registry URL

---

## What the Canadian Site Has That USA Doesn't Yet

```text
Canadian Feature                    US Status
─────────────────────────────────   ──────────────
Attorney referral funnel            MISSING
Email deadline reminders            MISSING (DB ready, no email)
SMS reminders                       MISSING
Success stories on homepage         MISSING (component exists)
Province-specific chatbot context   Partial (state context exists)
Lawyer matching service             MISSING
Video consultations                 MISSING (roadmap only)
Multi-language beyond EN/ES         MISSING
Blockchain evidence verification    MISSING (roadmap only)
```

---

## Summary: What to Build This Sprint

1. Fix /foia-request-generator broken route (15 min)
2. Fix Footer /legal/ links to /legal-areas/ (5 min)
3. Add official_registry_url to courses + display as badge (1 hour)
4. Build Certificate upload tab in Course Hub (2 hours)
5. Fix GA4 item_id in purchase events (15 min)
6. Add SuccessStories to homepage (10 min)
7. Add attorney referral CTA for high-complexity cases (30 min)

Total estimated implementation time: approximately 4-5 hours of focused work.
