import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminDashboardSimple from "./pages/AdminDashboardSimple";
import AdminSetup from "./pages/AdminSetup";
import Support from "./pages/Support";
import CaseAnalysis from "./pages/CaseAnalysis";
import Pricing from "./pages/Pricing";
import LegalJourney from "./pages/LegalJourney";
import CaseDashboard from "./pages/CaseDashboard";
import AITools from "./pages/AITools";
import AIToolsInteractive from "./pages/AIToolsInteractive";
import PersonalInjuryCalculator from "./pages/PersonalInjuryCalculator";
import LegalAreaPage from "./pages/LegalAreaPage";
import FormsLibrary from "./pages/FormsLibrary";
import CriminalDefenseGuide from "./pages/CriminalDefenseGuide";
import CaseLawSearch from "./pages/CaseLawSearch";
import BookOfDocuments from "./pages/BookOfDocuments";
import UsaForms from "./pages/UsaForms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LegalDisclaimer from "./pages/LegalDisclaimer";
import FAQ from "./pages/FAQ";
import StateFunnelPage from "./pages/StateFunnelPage";
import StateLandingPage from "./pages/StateLandingPage";
import DemoJourney from "./pages/DemoJourney";
import CaseJourney from "./pages/CaseJourney";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import WarrantLookup from "./pages/WarrantLookup";
import SexOffenderRegistry from "./pages/SexOffenderRegistry";
import CourtRecordsLookup from "./pages/CourtRecordsLookup";
import StartPage from "./pages/StartPage";
import JusticeBotPage from "./pages/JusticeBotPage";
import CourseHub from "./pages/CourseHub";
import PublicRecordsRequest from "./pages/PublicRecordsRequest";
import CertificateVerify from "./pages/CertificateVerify";
import LegalAreasHub from "./pages/LegalAreasHub";
import CourtListenerSearch from "./pages/CourtListenerSearch";
import SelfHelpHub from "./pages/SelfHelpHub";
import LegalGlossary from "./pages/LegalGlossary";
import CourtroomPrep from "./pages/CourtroomPrep";
import IssueHubPage from "./pages/IssueHubPage";
import IssueHubFormsPage from "./pages/IssueHubFormsPage";
import IssueHubTimelinePage from "./pages/IssueHubTimelinePage";
import IssueHubHelpPage from "./pages/IssueHubHelpPage";
import IssueHubStartPage from "./pages/IssueHubStartPage";
import TrackPage from "./pages/TrackPage";
import IssuesIndex from "./pages/IssuesIndex";
import LegalHelpIndex from "./pages/LegalHelpIndex";
import EvictionHelp from "./pages/legal-help/EvictionHelp";
import SmallClaimsHelp from "./pages/legal-help/SmallClaimsHelp";
import FamilyCourtHelp from "./pages/legal-help/FamilyCourtHelp";
import CivilRightsHelp from "./pages/legal-help/CivilRightsHelp";
import CriminalDefenseHelp from "./pages/legal-help/CriminalDefenseHelp";
import WorkplaceInjuryHelp from "./pages/legal-help/WorkplaceInjuryHelp";
import NativeAmericanRights from "./pages/legal-help/NativeAmericanRights";
import TenantRightsHelp from "./pages/legal-help/TenantRightsHelp";
import DivorceProcessHelp from "./pages/legal-help/DivorceProcessHelp";
import TribalCourtHelp from "./pages/legal-help/TribalCourtHelp";
import TribalJurisdictionHelp from "./pages/legal-help/TribalJurisdictionHelp";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminDashboardSimple />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/support" element={<Support />} />
            <Route path="/case-analysis" element={<CaseAnalysis />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/legal-journey" element={<LegalJourney />} />
            <Route path="/my-cases" element={<CaseDashboard />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/ai-tools/use" element={<AIToolsInteractive />} />
            <Route path="/injury-settlement-calculator" element={<PersonalInjuryCalculator />} />
            <Route path="/personal-injury-calculator" element={<PersonalInjuryCalculator />} />
            <Route path="/legal-areas" element={<LegalAreasHub />} />
            <Route path="/legal-areas/:areaId" element={<LegalAreaPage />} />
            <Route path="/forms-library" element={<FormsLibrary />} />
            <Route path="/usa-forms" element={<UsaForms />} />
            <Route path="/criminal-defense-guide" element={<CriminalDefenseGuide />} />
            <Route path="/case-law-search" element={<CaseLawSearch />} />
            <Route path="/book-of-documents" element={<BookOfDocuments />} />
            <Route path="/case-journey" element={<CaseJourney />} />
            <Route path="/case/:caseId" element={<CaseJourney />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/disclaimer" element={<LegalDisclaimer />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/demo-journey" element={<DemoJourney />} />
            <Route path="/warrant-lookup" element={<WarrantLookup />} />
            <Route path="/sex-offender-registry" element={<SexOffenderRegistry />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
