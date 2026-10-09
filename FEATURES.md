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
- **Automated legal research**: AI-powered sweeping of reputable legal sites
- **Multi-source aggregation**: Cornell Law, Justia, FindLaw, Nolo, and more
- **State-specific searches**: Filter by state and county
- **Legal area filtering**: Focus on specific practice areas
- **Form discovery**: Automatic identification of legal forms
- **Citation extraction**: Proper legal citations for all sources
- **Relevance scoring**: AI-powered ranking of search results

**Access**: `/admin` → Legal Sweeps tab (Admin only)

**Supported Legal Sources**:
- law.cornell.edu (Cornell Legal Information Institute)
- justia.com (Justia Legal Resources)
- findlaw.com (FindLaw)
- nolo.com (Nolo Legal Encyclopedia)
- supreme.justia.com (Supreme Court Opinions)

**Document Types**:
- Statutes
- Regulations
- Case law
- Legal forms
- Procedures

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
- **PayPal integration**: Secure payment processing
- **Subscription plans**:
  - Monthly: $59.99/month
  - Annual: $299.99/year (save $419.89!)
- **Payment tracking**: Admin dashboard for revenue monitoring
- **Subscription management**: User self-service portal

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
**Purpose**: Plain-language summary of the user's situation (name kept for compatibility). Returns `{ success, summary, legalCategory, generalInfo, officialSources, isGuest, caseId }`; no score, estimate, strategy or form list
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

### 2. `legal-sweep`
**Purpose**: Perform automated legal research
**Auth**: Required (Admin only)
**Input**:
```json
{
  "sweepId": "uuid",
  "searchTerms": ["term1", "term2"],
  "state": "string",
  "legalArea": "string"
}
```

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

### 4. `paypal-payments`
**Purpose**: Process subscription payments
**Auth**: Required
**Input**: PayPal payment data

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

### Legal Sweep Configuration
- Create new sweep configurations
- Schedule automated sweeps
- Monitor sweep results
- Configure target domains and search terms
- Filter by state and legal area

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
7. **Subscribe** for premium features

### For Admins
1. **Access admin dashboard** at `/admin`
2. **Manage users** and assign roles
3. **Monitor support tickets** and respond promptly
4. **Configure legal sweeps** for research automation
5. **Review case analyses** for quality control
6. **Track metrics** and system usage

## Pricing Model

### Subscription Benefits
- **Pay Per Form ($4.99/form)**:
  - One-time payment for single form
  - AI-powered case evaluation
  - State-specific guidance
  - Document generation

- **Monthly Plan ($9.99/month)**:
  - Unlimited AI chat sessions
  - Unlimited form access
  - Priority support
  - All 50 states coverage
  - Advanced case analysis
  - Document storage
   
- **Annual Plan ($79/year)**:
  - Everything in Monthly Plan
  - 34% discount vs monthly
  - Priority case reviews
  - Extended document storage
  - Dedicated support
  - Just $6.58/month

### Value Proposition
- Professional legal assistance at **1/20th the cost of a lawyer**
- $10 cheaper than competitors
- 24/7 availability
- No hourly billing
- Transparent pricing
- We care about your justice, not billable hours

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **AI**: Lovable AI Gateway (Gemini models)
- **Payments**: PayPal
- **Storage**: Supabase Storage

## Roadmap

### Coming Soon
- [ ] Google Drive integration
- [ ] Dropbox integration
- [ ] PDF document generation
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Mobile app (iOS/Android)
- [ ] Attorney matching service
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