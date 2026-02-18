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
            <Route path="/start" element={<StartPage />} />
            <Route path="/foia-request-generator" element={<PublicRecordsRequest />} />
            <Route path="/public-records-request" element={<PublicRecordsRequest />} />
            <Route path="/justice-bot" element={<JusticeBotPage />} />
            <Route path="/courses" element={<CourseHub />} />
            <Route path="/verify/:id" element={<CertificateVerify />} />
            
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
