# Justice Bot USA - Features

## Overview
Justice Bot USA is a legal-information and court-forms platform for self-represented people in the
United States, live for California and New York. It is a service of Quorex Solutions, a trade name
of Justice Bot Technologies Inc. It provides **legal information, not legal advice**: it does not
practice law, predict outcomes or replace a lawyer.

README.md holds the current status table and the owner's setup steps. This file describes what each
feature does. Every claim here should match the code; if you change a feature, change this file.

## Core Features

### 1. **User Management & Role Assignment**
- **Roles**: Admin, Moderator and User
- **Authentication**: email/password with Supabase Auth
- **Profiles**: user profiles with personal information
- **Admin dashboard**: user and role management

**Access**: `/admin` (Admin/Moderator only)

### 2. **Support Ticket System**
- **Categories**: Technical, Billing, Legal and General
- **Priority levels**: Low, Medium, High and Urgent
- **Messaging**: live updates between users and support staff (Supabase Realtime)
- **Status tracking**: Open, In Progress, Waiting Response, Resolved, Closed
- **Staff assignment**: assign tickets to support team members

**Access**: `/support` (all signed-in users)

### 3. **Plain-Language Case Summary**
- **Summary of what you told us**: a neutral restatement of the user's own facts
- **General legal area**: a short label such as "Housing / eviction" or "Family law"
- **General information**: how matters in this area usually work in the user's state, with links to official sources
- **State legal centers**: the next step is always the CA or NY legal center (`StateNextSteps`), plus a reminder to talk to a lawyer or free legal aid
- **Your documents**: lists of the user's own uploads only

**Access**: `/case-analysis` (all signed-in users)

**Not provided (founder decision, October 2026)**: no merit score, success rate or win probability, no settlement or dollar estimate, no time-to-resolution estimate, no defence or legal strategy, and no choosing or ordering of court forms for the user. Choosing forms and strategy is off-limits even for a registered California legal document assistant (Bus. & Prof. Code 6400(g), 6411(e)) and falls under New York Judiciary Law 495(1)(e); invented scores and estimates are also untrue claims. The settlement calculator is retired; its routes redirect to `/legal-areas`. Old values in `case_merit_scores` (merit_score, settlement range and so on) are kept in the database but no longer produced, shown or exported.

### 4. **Legal Sweeps & Research**
**Status**: Retired (Oct 2026). The `legal-sweep` function never searched anything; it wrote made-up results with random statute citations and filing fees. It now answers 410 Gone, and the admin tab is removed.

### 5. **File Upload (free)**
- **Case journey and evidence uploader** (`src/components/FileUpload.tsx`): photos, PDFs, Word, Excel and PowerPoint files, text files, audio, video and ZIP files, up to 50 MB each, checked in the browser. Remove deletes the stored copy, then the record.
- **Case binder uploader** (`/toolkit/binder`): PDF, JPG and PNG files up to 25 MB each, checked by size and by the file's first bytes. HEIC photos get a plain message.
- **Storage**: private Supabase Storage buckets with row-level security; each person reaches only their own folder. Admins cannot open other people's files (see Security).
- **Cloud Storage tab**: saves Google Drive links as case files. The binder shows them as links and leaves them out of the binder PDF.

### 6. **Toolkit (paid plan, $25.00 a month; sales not open yet)**
The Toolkit is three organizing tools. Nothing in them computes, suggests, prefills, compares or
checks a legal date, hour or requirement: dates and hours are only what the person types, and past
calendar entries say only "Past". Everything a person saved stays theirs to see, change, download and
delete after a plan ends.

**Hub**: `/toolkit` (what each tool does, what is free, counts of saved items).

#### Case binder (`/toolkit/binder`)
- Free: upload, view (10-minute signed link), download, rename, add a typed document date and notes, choose a section (court papers, evidence, letters, money, photos, other), move to another case, put files in order, delete one file, or "Delete all my files" (typed confirmation).
- With the plan: **one binder PDF of the PDF, JPG and PNG files, in the order chosen**, built in the browser with pdf-lib: a cover with counsel's notice (not a court filing, not reviewed by a lawyer or a court), a contents page, and optional "Page N of M" in a margin band with every document page shrunk to 95% so nothing is covered ("No page numbers" turns it off). Filled forms are flattened first. Word files, saved links, unreadable files and PDFs with security settings go on "Not included" pages with a reason. Limits: 120 MB of files per binder, 1,500 pages.
- A confidential-records notice (juvenile, family and sealed records) is shown at upload and before making a binder until dismissed.

#### Hearing calendar (`/toolkit/calendar`)
- Free: see, change and delete saved dates; download `.ics` calendar files (one date, or all upcoming dates).
- With the plan: add new dates.
- Each entry: kind, title, typed date, optional time, one of 7 US time zones (filled in only from a California or New York case), place, room, address, where the date came from, notes, and alerts (1 week, 2 days, 1 day, morning of).
- Every new date, and every change to a date, time or zone, is read back ("This matches my papers") before it is saved; the database refuses a date change without a new confirmation.
- Calendar files: a "Leave court details out of the calendar file" option (title "Appointment", no place, no notes) and a lock-screen warning. Alerts come from the person's calendar app; some apps don't keep them. Case titles and "where this date came from" notes never go in the file.

#### Class tracker (`/toolkit/classes`)
- Free: see, change and delete class records and sessions; change status; record proof; download "Your class records (self-reported)" PDF (notes left out).
- With the plan: add classes and sessions; "Track this class" from the Course Hub (saves only the class name, provider, provider link and which listing it came from; never hours or dates).
- Each class: who ordered it, the order's wording, hours and due date as typed, provider link (https only), status (Not started, In progress, Finished (your record), Proof sent to the court), sessions with hours, proof chosen from the person's binder files, and an optional calendar entry for the due date. "Hours you logged" and "Hours you typed from your order" are shown side by side with nothing worked out between them.
- Course Hub (`/courses`): outside providers' classes and saving certificates stay free. Every listing carries the note that providers' "court-approved" claims are unchecked and only the court (or whoever ordered the class) can say which classes it accepts.

### 7. **Chat Interface**
- **AI legal assistant** (`legal-assistance` edge function): general legal information in English and Spanish, with conversation history

### 8. **Payments and the Toolkit plan**
- **Free**: every fillable court form (all 12, CA and NY), the funnel's form guides and the public-records letter PDF. Courts and agencies may charge their own fees (filing, service, copies); those are disclosed, and fee waivers and our fee waiver forms are free.
- **Toolkit, $25.00 a month** (the only paid plan): renews monthly until cancelled; no trials, promo codes, discounts or annual prices. Terms come word for word from `src/lib/billingDisclosure.ts`.
- **Sales are off by default.** `stripe-checkout` opens sales only when `TOOLKIT_SALES_ENABLED` is exactly `true`, billing email is configured, and the Stripe price, product name and description and account business name all match. Otherwise `/pricing` shows "Coming soon" and checkout answers 409 `PLAN_PAUSED`.
- **Buying**: counsel's terms box directly above two required, unticked checkboxes; a consent record (with a SHA-256 of the exact text shown) is stored before a card-only Stripe Checkout session is created. A second plan for the same person is refused, or cancelled and refunded if two clicks race.
- **After buying**: `/payment-success` shows the acknowledgment; counsel's acknowledgment email is sent once and retried if it fails. An annual reminder goes out each year.
- **Cancelling**: online at `/account/billing` (account menu, "Cancel subscription"), or by email to billing@justicebot-usa.com. The plan stays active to the end of the paid month, and a confirmation email follows. A full refund of the latest charge ends the plan unless the charge or refund has metadata `keep_plan=true`.
- **Refunds**: ask within 30 days of any charge.
- **Stripe** is the only payment method. PayPal is retired.

## Database Schema

### Tables
1. **profiles** - User profile information
2. **user_roles** - Role assignments (admin/moderator/user)
3. **support_tickets** - Support ticket records
4. **support_messages** - Ticket conversation messages
5. **case_merit_scores** - Case records (table name kept; score and estimate columns are no longer written)
6. **case_files** - Uploaded files, plus the binder's display name, typed document date, section, order and notes
7. **case_calendar_events** - Hearing calendar entries (typed date, time and zone, read-back time, `ics_sequence`)
8. **class_trackers** and **class_sessions** - Class tracker records and logged sessions
9. **subscriptions** - Plan records written by the Stripe webhook
10. **billing_consents** - Consent to the automatic renewal terms (kept at least 3 years, or 1 year after the plan ends)
11. **billing_notices** - Acknowledgment, annual reminder, price change and cancellation emails (status and retries)
12. **courses**, **course_certificates**, **course_enrollments** - Course Hub listings and the person's certificates
13. **chat_sessions**, **chat_messages** - Chat history

## Security Features

### Row-Level Security (RLS)
- All tables protected with RLS policies; people reach only their own rows and files.
- Toolkit links between a person's rows (case, proof file, class) must point at that person's own rows (same-owner foreign keys).
- Adding calendar entries and class records needs an active plan (`my_toolkit_access()`); changing and deleting them never does.
- Admins can no longer read or change other people's cases, files or stored objects; `/admin/analytics` gets counts from the admin-only functions `admin_case_file_count()` and `admin_case_stats()`.
- Billing consent and notice tables are written by the service role only.

### Authentication
- Supabase Auth, email/password
- Owner to-do before sales: MFA on admin accounts, leaked-password protection on, admin roles kept to the minimum

### Logs and analytics
- Case titles, file names, event titles, class names and notes are never sent to analytics or logs. Billing functions log errors with email addresses removed.

## API Endpoints (Edge Functions)

### 1. `analyze-case-merit`
**Purpose**: Plain-language summary of the user's situation (name kept for compatibility). Returns `{ success, summary, legalCategory, generalInfo, officialSources, isGuest, caseId }` (`legalCategory` is always null; `legal_area` is saved from the area the user picked); no score, estimate, strategy, citation or form list
**Auth**: Required
**Input**:
```json
{
  "caseData": {
    "userId": "uuid",
    "title": "string",
    "description": "string",
    "state": "string",
    "county": "string",
    "legalArea": "string"
  },
  "uploadedFiles": []
}
```

### 2. `legal-sweep`, `court-records-search`, `courtlistener-search`
**Status**: Retired (Oct 2026). All return 410 Gone. `/court-records` links to official CA and NY court sites; `/courtlistener` redirects there.

### 3. `legal-assistance`
**Purpose**: AI legal-information chat responses
**Auth**: Optional
**Input**:
```json
{
  "message": "string",
  "state": "string",
  "legalSection": "string",
  "language": "en" | "es",
  "context": []
}
```

### 4. Toolkit billing
- `stripe-checkout`: `checkout_status` (no sign-in; `{ available }`), `create_subscription` (signed in; both consents and the disclosure hash required), `verify_session`
- `stripe-webhook`: plan records, acknowledgment and cancellation emails, refunds, duplicate plans
- `cancel-subscription`, `check-subscription`: cancel at period end; plan status from the person's own records
- `billing-notices`: daily cron (`x-cron-secret`); retries failed notices and sends annual reminders
- `delete-my-data`: admin-run account deletion (cancels Stripe plans, removes stored files and every row of the person's content, then the sign-in account; payment and billing records kept)
- `court-export-pdf`: data for "Your class records (self-reported)"

### 5. `paypal-payments`, `paypal-webhook`
**Status**: Retired (Oct 2026). Both return 410 Gone. Payments go through `stripe-checkout`.

## Admin Features

### User Management
- View registered users
- Assign and modify user roles

### Support Management
- View support tickets, assign them to staff, update status and priority, and reply

### Analytics (`/admin/analytics`)
- Signups by month, funnel events and payments
- Case counts (total, by month, legal area and state) and the total file count, from count-only admin functions. Admins can't open anyone's cases or files from the admin pages.

## Usage Guidelines

### For Users
1. **Sign up** at `/auth`
2. **Select your state** and legal area
3. **Fill in official CA or NY court forms** for free at `/fill/ca` or `/fill/ny`
4. **Upload your files** and keep them in order on the case binder page (free)
5. **Request a plain-language summary** of your situation
6. **Create support tickets** for questions about the site

### For Admins
1. **Access the admin dashboard** at `/admin`
2. **Manage users** and assign roles
3. **Monitor support tickets** and respond promptly
4. **Track counts** on `/admin/analytics`

## Pricing Model

- Free: every fillable California and New York court form, the form guides and the public-records letter PDF (`src/lib/pricing.ts`). The other 48 states are coming soon.
- Court and agency fees (filing, service, copies) are separate and disclosed (`THIRD_PARTY_FEES_NOTE`); fee waivers and our fee waiver forms are free.
- Toolkit plan: $25.00 a month, the only paid plan; on sale only after the owner's launch checklist in README.md.
- No per-form, bundle or annual prices. No PayPal.

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **PDFs**: pdf-lib (form filling, case binder) and jsPDF (class records), in the browser
- **Email**: Resend (billing emails only, once the owner sets it up)
- **Payments**: Stripe (Toolkit plan; sales off until launch)
- **Storage**: Supabase Storage
- **Checks**: `npm run check:toolkit` (`scripts/toolkit/`)

## Roadmap

### Not built yet
- [ ] Price-change notice emails (required before any price or Toolkit change)
- [ ] Email or text reminders for court dates (the calendar uses the person's own calendar app)
- [ ] Self-service account deletion (owner-run today)
- [ ] Unicode fonts in generated PDFs
- [ ] Dropbox integration
- [ ] Mobile app (iOS/Android)

## Support & Contact

- **Support Center**: `/support`, or support@justicebot-usa.com
- **Billing**: billing@justicebot-usa.com
- **Privacy and account deletion**: privacy@justicebot-usa.com

## Legal Disclaimer

Justice Bot USA provides general legal information. This is **NOT legal advice** and does not create an attorney-client relationship. For advice about your situation, talk to a lawyer licensed in your state or a free legal aid organization.

---

**Last Updated**: 2026-10-13
