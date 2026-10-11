# US Justice Bot - Features Documentation

## Overview
US Justice Bot is a comprehensive legal assistance platform that provides affordable legal guidance, case analysis, and support services for all Americans. Our platform leverages AI and automated legal research to democratize access to justice.

## Core Features

### 1. **User Management & Role Assignment**
- **Multi-tier role system**: Admin, Moderator, and User roles
- **Secure authentication**: Email/password authentication with Supabase
- **Profile management**: User profiles with personal information
- **Activity logging**: Track all user actions for security and compliance
- **Admin dashboard**: Comprehensive admin interface for managing users and roles

**Access**: `/admin` (Admin/Moderator only)

### 2. **Support Ticket System**
- **Multi-category support**: Technical, Billing, Legal, and General categories
- **Priority levels**: Low, Medium, High, and Urgent
- **Real-time messaging**: Live chat between users and support staff
- **Status tracking**: Open, In Progress, Waiting Response, Resolved, Closed
- **Attachment support**: Upload files with support tickets
- **Staff assignment**: Assign tickets to specific support team members

**Access**: `/support` (All authenticated users)

**Features**:
- Create support tickets with detailed descriptions
- Real-time message updates using Supabase Realtime
- Filter and search tickets
- Status and priority management
- Automatic notifications

### 3. **Plain-Language Case Summary**
- **Summary of what you told us**: A neutral restatement of the user's own facts
- **General legal area**: A short label such as "Housing / eviction" or "Family law"
- **General information**: How matters in this area usually work in the user's state, with links to official sources
- **State legal centers**: The next step is always the CA or NY legal center (`StateNextSteps`), plus a reminder to talk to a lawyer or free legal aid
- **Your documents**: Lists of the user's own uploads only

**Access**: `/case-analysis` (All authenticated users)

**Not provided (founder decision, October 2026)**: no merit score, success rate or win probability, no settlement or dollar estimate, no time-to-resolution estimate, no defence or legal strategy, and no choosing or ordering of court forms for the user. Choosing forms and strategy is off-limits even for a registered California legal document assistant (Bus. & Prof. Code 6400(g), 6411(e)) and falls under New York Judiciary Law 495(1)(e); invented scores and estimates are also untrue claims. The settlement calculator is retired; its routes redirect to `/legal-areas`. Old values in `case_merit_scores` (merit_score, settlement range and so on) are kept in the database but no longer produced, shown or exported.

### 4. **Legal Sweeps & Research**
**Status**: Retired (Oct 2026). The `legal-sweep` function never searched anything; it wrote made-up results with random statute citations and filing fees. It now answers 410 Gone, and the admin tab is removed.

### 5. **File Upload & Evidence Management**
- **Multi-bucket storage**: Separate buckets for evidence, case documents, and user uploads
- **Cloud integration**: Connect Google Drive, Dropbox (coming soon)
- **File categorization**: Tag and categorize uploaded files
- **Photo evidence**: Direct camera integration for mobile devices
- **Secure storage**: Row-level security on all uploads
- **File metadata**: Track upload dates, sizes, and descriptions

**Supported File Types**:
- Documents: PDF, DOC, DOCX
- Images: JPG, PNG, WEBP
- Contracts and agreements
- Correspondence
- Financial documents

### 6. **Chat Interface**
- **AI legal assistant**: Powered by Lovable AI (Gemini models)
- **Context-aware responses**: Maintains conversation history
- **State-specific guidance**: Tailored to user's jurisdiction
- **Bilingual support**: English and Spanish
- **Session management**: Save and resume conversations
- **Evidence integration**: Reference uploaded documents in chat

### 7. **Payment & Subscription System**
- **Free**: every fillable court form (all 12, CA and NY), the funnel's form guides and the
  public-records letter PDF. Courts and agencies may charge their own fees (filing, service,
  copies); those are disclosed, and fee waivers and our fee waiver forms are free.
- **$25/month plan (Justice Bot USA Access)**: PAUSED for new purchases (October 2026);
  `stripe-checkout` answers `create_subscription` with 409 `PLAN_PAUSED`. It returns as the
  Toolkit plan once the case binder, hearing calendar with reminders and course tracker exist.
- **Stripe checkout**: the only payment method. No yearly plan, no per-form or one-time purchases.
- **Cancellation**: signed-in subscribers cancel on `/pricing` (`cancel-subscription`); access
  runs to the end of the paid period.
- **Payment tracking**: Admin dashboard for revenue monitoring

## Database Schema

### Tables
1. **profiles** - User profile information
2. **user_roles** - Role assignments (admin/moderator/user)
3. **support_tickets** - Support ticket records
4. **support_messages** - Ticket conversation messages
5. **case_merit_scores** - Case records (table name kept; score and estimate columns are no longer written)
6. **legal_sweeps** - Scheduled legal research sweeps
7. **legal_sweep_results** - Discovered legal documents
8. **case_files** - Uploaded evidence and documents
9. **chat_sessions** - User conversation sessions
10. **chat_messages** - Chat message history
11. **user_activity_logs** - Security and compliance logging
12. **subscriptions** - Payment and subscription records

## Security Features

### Row-Level Security (RLS)
- All tables protected with RLS policies
- Users can only access their own data
- Admins have elevated access where appropriate
- Staff can view assigned support tickets

### Authentication
- Supabase Auth integration
- Email/password authentication
- Session management
- Password security best practices

### Activity Logging
- All user actions logged
- IP address and user agent tracking
- Audit trail for compliance
- Admin access to activity logs

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
**Purpose**: AI-powered legal chat responses
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

### 4. `paypal-payments`, `paypal-webhook`
**Status**: Retired (Oct 2026). Both return 410 Gone. Payments go through `stripe-checkout`.

## Admin Features

### User Management
- View all registered users
- Assign and modify user roles
- View user activity logs
- Monitor user engagement

### Support Management
- View all support tickets
- Assign tickets to staff
- Update ticket status and priority
- Respond to user messages
- Close and resolve tickets

### Case Analysis Oversight
- View all case summaries
- Monitor scoring accuracy
- Review legal citations
- Audit case recommendations

### Analytics & Reporting
- User growth metrics
- Support ticket statistics
- Case analysis metrics
- Revenue tracking
- System usage statistics

## Usage Guidelines

### For Users
1. **Sign up** at `/auth`
2. **Select your state** and legal area of concern
3. **Chat with the AI** legal assistant for general guidance
4. **Upload evidence** to support your case
5. **Request a plain-language summary** of your situation
6. **Create support tickets** for specific questions

### For Admins
1. **Access admin dashboard** at `/admin`
2. **Manage users** and assign roles
3. **Monitor support tickets** and respond promptly
4. **Review case analyses** for quality control
5. **Track metrics** and system usage

## Pricing Model

- Free: every fillable California and New York court form, the form guides and the public-records letter PDF (`src/lib/pricing.ts`). The other 48 states are coming soon.
- Court and agency fees (filing, service, copies) are separate and disclosed (`THIRD_PARTY_FEES_NOTE`); fee waivers and our fee waiver forms are free.
- The $25/month plan is paused for new purchases and returns later as the Toolkit plan.
- No per-form, bundle or annual prices. No PayPal.

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **AI**: Lovable AI Gateway (Gemini models)
- **Payments**: Stripe ($25/month plan, paused for new purchases)
- **Storage**: Supabase Storage

## Roadmap

### Coming Soon
- [ ] Google Drive integration
- [ ] Dropbox integration
- [ ] PDF document generation
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Mobile app (iOS/Android)
- [ ] Court date tracking
- [ ] Legal document templates
- [ ] Video consultations

### Under Consideration
- [ ] Blockchain evidence verification
- [ ] Multi-language support (beyond English/Spanish)
- [ ] API access for third-party developers
- [ ] White-label solutions
- [ ] Enterprise plans

## Support & Contact

- **Support Center**: `/support`
- **Admin Contact**: Create a ticket with "urgent" priority
- **Technical Issues**: support@usjusticebot.com (coming soon)
- **Legal Inquiries**: legal@usjusticebot.com (coming soon)

## Legal Disclaimer

US Justice Bot provides educational legal information and AI-assisted guidance. This is **NOT legal advice** and does not create an attorney-client relationship. For specific legal advice, please consult a qualified attorney in your jurisdiction.

---

**Version**: 1.0.0  
**Last Updated**: 2025-09-30  
**Documentation**: This document describes all implemented features as of the current release.