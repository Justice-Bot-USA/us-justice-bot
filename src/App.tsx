import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Only eagerly load the landing page
import Index from "./pages/Index";

// Lazy load everything else
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminDashboardSimple = lazy(() => import("./pages/AdminDashboardSimple"));
const AdminSetup = lazy(() => import("./pages/AdminSetup"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const Support = lazy(() => import("./pages/Support"));
const CaseAnalysis = lazy(() => import("./pages/CaseAnalysis"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const LegalJourney = lazy(() => import("./pages/LegalJourney"));
const CaseDashboard = lazy(() => import("./pages/CaseDashboard"));
const UserAnalytics = lazy(() => import("./pages/UserAnalytics"));
const AITools = lazy(() => import("./pages/AITools"));
const AIToolsInteractive = lazy(() => import("./pages/AIToolsInteractive"));
const LegalAreasHub = lazy(() => import("./pages/LegalAreasHub"));
const LegalAreaPage = lazy(() => import("./pages/LegalAreaPage"));
const FormsLibrary = lazy(() => import("./pages/FormsLibrary"));
const UsaForms = lazy(() => import("./pages/UsaForms"));
const NewYorkLegalCenter = lazy(() => import("./pages/NewYorkLegalCenter"));
const CaliforniaLegalCenter = lazy(() => import("./pages/CaliforniaLegalCenter"));
const FormFillPage = lazy(() => import("./pages/FormFillPage"));
const CriminalDefenseGuide = lazy(() => import("./pages/CriminalDefenseGuide"));
const BookOfDocuments = lazy(() => import("./pages/BookOfDocuments"));
const CaseJourney = lazy(() => import("./pages/CaseJourney"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const LegalDisclaimer = lazy(() => import("./pages/LegalDisclaimer"));
const FAQ = lazy(() => import("./pages/FAQ"));
const DemoJourney = lazy(() => import("./pages/DemoJourney"));
const CourtRecordsLookup = lazy(() => import("./pages/CourtRecordsLookup"));
const CourtListenerSearch = lazy(() => import("./pages/CourtListenerSearch"));
const SelfHelpHub = lazy(() => import("./pages/SelfHelpHub"));
const LegalGlossary = lazy(() => import("./pages/LegalGlossary"));
const CourtroomPrep = lazy(() => import("./pages/CourtroomPrep"));
const StartPage = lazy(() => import("./pages/StartPage"));
const PublicRecordsRequest = lazy(() => import("./pages/PublicRecordsRequest"));
const JusticeBotPage = lazy(() => import("./pages/JusticeBotPage"));
const CourseHub = lazy(() => import("./pages/CourseHub"));
const CertificateVerify = lazy(() => import("./pages/CertificateVerify"));
const StateFunnelPage = lazy(() => import("./pages/StateFunnelPage"));
const StateLandingPage = lazy(() => import("./pages/StateLandingPage"));
const IssueHubPage = lazy(() => import("./pages/IssueHubPage"));
const IssueHubFormsPage = lazy(() => import("./pages/IssueHubFormsPage"));
const IssueHubTimelinePage = lazy(() => import("./pages/IssueHubTimelinePage"));
const IssueHubHelpPage = lazy(() => import("./pages/IssueHubHelpPage"));
const IssueHubStartPage = lazy(() => import("./pages/IssueHubStartPage"));
const TrackPage = lazy(() => import("./pages/TrackPage"));
const IssuesIndex = lazy(() => import("./pages/IssuesIndex"));
const LegalHelpIndex = lazy(() => import("./pages/LegalHelpIndex"));
const EvictionHelp = lazy(() => import("./pages/legal-help/EvictionHelp"));
const SmallClaimsHelp = lazy(() => import("./pages/legal-help/SmallClaimsHelp"));
const FamilyCourtHelp = lazy(() => import("./pages/legal-help/FamilyCourtHelp"));
const CivilRightsHelp = lazy(() => import("./pages/legal-help/CivilRightsHelp"));
const CriminalDefenseHelp = lazy(() => import("./pages/legal-help/CriminalDefenseHelp"));
const WorkplaceInjuryHelp = lazy(() => import("./pages/legal-help/WorkplaceInjuryHelp"));
const NativeAmericanRights = lazy(() => import("./pages/legal-help/NativeAmericanRights"));
const TenantRightsHelp = lazy(() => import("./pages/legal-help/TenantRightsHelp"));
const DivorceProcessHelp = lazy(() => import("./pages/legal-help/DivorceProcessHelp"));
const TribalCourtHelp = lazy(() => import("./pages/legal-help/TribalCourtHelp"));
const TribalJurisdictionHelp = lazy(() => import("./pages/legal-help/TribalJurisdictionHelp"));
const StateLegalHelp = lazy(() => import("./pages/legal-help/StateLegalHelp"));
const TribalJurisdictionCheck = lazy(() => import("./pages/legal-help/TribalJurisdictionCheck"));
const FreeEvictionDefenseTool = lazy(() => import("./pages/FreeEvictionDefenseTool"));
const FreeSmallClaimsTool = lazy(() => import("./pages/FreeSmallClaimsTool"));
const FreeCustodyTool = lazy(() => import("./pages/FreeCustodyTool"));
const FreeDiscriminationTool = lazy(() => import("./pages/FreeDiscriminationTool"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<AdminDashboardSimple />} />
              <Route path="/admin-setup" element={<AdminSetup />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              {/* Attorney directory and referrals stay offline until the board approves Lawyer Coordination and the referral-fee questions are resolved. */}
              <Route path="/attorneys" element={<Navigate to="/" replace />} />
              <Route path="/firm" element={<Navigate to="/" replace />} />
              <Route path="/support" element={<Support />} />
              <Route path="/case-analysis" element={<CaseAnalysis />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/legal-journey" element={<LegalJourney />} />
              <Route path="/my-cases" element={<CaseDashboard />} />
              <Route path="/dashboard/analytics" element={<UserAnalytics />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/ai-tools/use" element={<AIToolsInteractive />} />
              {/* Settlement calculator retired (no settlement estimates); old links go to the legal areas hub */}
              <Route path="/injury-settlement-calculator" element={<Navigate to="/legal-areas" replace />} />
              <Route path="/personal-injury-calculator" element={<Navigate to="/legal-areas" replace />} />
              <Route path="/legal-areas" element={<LegalAreasHub />} />
              <Route path="/legal-areas/:areaId" element={<LegalAreaPage />} />
              <Route path="/forms-library" element={<FormsLibrary />} />
              <Route path="/usa-forms" element={<UsaForms />} />
              <Route path="/ny/legal-center" element={<NewYorkLegalCenter />} />
              <Route path="/new-york/legal-center" element={<NewYorkLegalCenter />} />
              <Route path="/ca/legal-center" element={<CaliforniaLegalCenter />} />
              <Route path="/california/legal-center" element={<CaliforniaLegalCenter />} />
              <Route path="/california-legal-help" element={<CaliforniaLegalCenter />} />
              <Route path="/new-york-legal-help" element={<NewYorkLegalCenter />} />
              <Route path="/fill/:state" element={<FormFillPage />} />
              <Route path="/fill/:state/:formId" element={<FormFillPage />} />
              <Route path="/criminal-defense-guide" element={<CriminalDefenseGuide />} />
              {/* Case Law Search retired: it asked the AI for case citations from memory, not a legal database. */}
              <Route path="/case-law-search" element={<Navigate to="/legal-areas" replace />} />
              <Route path="/book-of-documents" element={<BookOfDocuments />} />
              <Route path="/case-journey" element={<CaseJourney />} />
              <Route path="/case/:caseId" element={<CaseJourney />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/disclaimer" element={<LegalDisclaimer />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/demo-journey" element={<DemoJourney />} />
              <Route path="/warrant-lookup" element={<Navigate to="/criminal-defense-guide" replace />} />
              {/* Sex offender lookup retired: we hold no registry data and do not access law-enforcement databases. */}
              <Route path="/sex-offender-registry" element={<Navigate to="/" replace />} />
              <Route path="/court-records" element={<CourtRecordsLookup />} />
              <Route path="/courtlistener" element={<CourtListenerSearch />} />
              <Route path="/self-help" element={<SelfHelpHub />} />
              <Route path="/legal-glossary" element={<LegalGlossary />} />
              <Route path="/courtroom-prep" element={<CourtroomPrep />} />
              <Route path="/start" element={<StartPage />} />
              <Route path="/foia-request-generator" element={<PublicRecordsRequest />} />
              <Route path="/public-records-request" element={<PublicRecordsRequest />} />
              <Route path="/justice-bot" element={<JusticeBotPage />} />
              <Route path="/courses" element={<CourseHub />} />
              <Route path="/verify/:id" element={<CertificateVerify />} />

              {/* Tool-led landing pages */}
              <Route path="/free-eviction-defense-tool" element={<FreeEvictionDefenseTool />} />
              <Route path="/free-small-claims-case-builder" element={<FreeSmallClaimsTool />} />
              <Route path="/free-custody-case-organizer" element={<FreeCustodyTool />} />
              <Route path="/free-discrimination-complaint-helper" element={<FreeDiscriminationTool />} />
              
              {/* Legal Help Library */}
              <Route path="/legal-help" element={<LegalHelpIndex />} />
              <Route path="/legal-help/eviction" element={<EvictionHelp />} />
              <Route path="/legal-help/eviction-process" element={<EvictionHelp />} />
              <Route path="/legal-help/how-to-fight-an-eviction" element={<EvictionHelp />} />
              <Route path="/legal-help/tenant-rights" element={<TenantRightsHelp />} />
              <Route path="/legal-help/eviction-notice-what-to-do" element={<EvictionHelp />} />
              <Route path="/legal-help/small-claims-court" element={<SmallClaimsHelp />} />
              <Route path="/legal-help/how-to-file-small-claims" element={<SmallClaimsHelp />} />
              <Route path="/legal-help/how-to-defend-small-claims" element={<SmallClaimsHelp />} />
              <Route path="/legal-help/small-claims-evidence" element={<SmallClaimsHelp />} />
              <Route path="/legal-help/child-custody" element={<FamilyCourtHelp />} />
              <Route path="/legal-help/divorce-process" element={<DivorceProcessHelp />} />
              <Route path="/legal-help/child-support" element={<FamilyCourtHelp />} />
              <Route path="/legal-help/protective-orders" element={<FamilyCourtHelp />} />
              <Route path="/legal-help/discrimination-law" element={<CivilRightsHelp />} />
              <Route path="/legal-help/how-to-file-civil-rights-complaint" element={<CivilRightsHelp />} />
              <Route path="/legal-help/workplace-discrimination" element={<CivilRightsHelp />} />
              <Route path="/legal-help/housing-discrimination" element={<CivilRightsHelp />} />
              <Route path="/legal-help/criminal-court-process" element={<CriminalDefenseHelp />} />
              <Route path="/legal-help/what-to-do-after-arrest" element={<CriminalDefenseHelp />} />
              <Route path="/legal-help/how-to-prepare-for-court" element={<CriminalDefenseHelp />} />
              <Route path="/legal-help/defense-evidence" element={<CriminalDefenseHelp />} />
              <Route path="/legal-help/workers-compensation" element={<WorkplaceInjuryHelp />} />
              <Route path="/legal-help/workplace-injury-claim" element={<WorkplaceInjuryHelp />} />
              <Route path="/legal-help/workers-comp-denied" element={<WorkplaceInjuryHelp />} />
              <Route path="/legal-help/native-american-rights" element={<NativeAmericanRights />} />
              <Route path="/legal-help/tribal-court" element={<TribalCourtHelp />} />
              <Route path="/legal-help/tribal-jurisdiction" element={<TribalJurisdictionHelp />} />
              <Route path="/legal-help/tribal-jurisdiction-check" element={<TribalJurisdictionCheck />} />

              {/* State-specific legal help pages */}
              <Route path="/legal-help/california-eviction-process" element={<StateLegalHelp />} />
              <Route path="/legal-help/texas-eviction-process" element={<StateLegalHelp />} />
              <Route path="/legal-help/florida-eviction-process" element={<StateLegalHelp />} />
              <Route path="/legal-help/new-york-eviction-process" element={<StateLegalHelp />} />
              <Route path="/legal-help/california-child-custody" element={<StateLegalHelp />} />
              <Route path="/legal-help/florida-child-custody" element={<StateLegalHelp />} />
              <Route path="/legal-help/california-workplace-discrimination" element={<StateLegalHelp />} />
              <Route path="/legal-help/texas-small-claims-court" element={<StateLegalHelp />} />
              <Route path="/legal-help/new-york-small-claims-court" element={<StateLegalHelp />} />

              {/* Issue Hubs — legacy route */}
              <Route path="/issues" element={<IssuesIndex />} />
              <Route path="/issues/:category/:issue" element={<IssueHubPage />} />

              {/* Issue Hubs — jurisdiction-aware routes */}
              <Route path="/:jurisdiction/:category/:issue" element={<IssueHubPage />} />
              <Route path="/:jurisdiction/:category/:issue/start" element={<IssueHubStartPage />} />
              <Route path="/:jurisdiction/:category/:issue/forms" element={<IssueHubFormsPage />} />
              <Route path="/:jurisdiction/:category/:issue/timeline" element={<IssueHubTimelinePage />} />
              <Route path="/:jurisdiction/:category/:issue/help" element={<IssueHubHelpPage />} />
              <Route path="/:jurisdiction/:category/:issue/track/:trackKey" element={<TrackPage />} />

              {/* State landing pages */}
              <Route path="/states/:stateCode" element={<StateLandingPage />} />
              
              {/* State-specific funnel routes (CA, TX, NY, FL) */}
              <Route path="/:slug" element={<StateFunnelPage />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
