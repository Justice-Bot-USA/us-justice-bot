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
import LegalAreaPage from "./pages/LegalAreaPage";
import FormsLibrary from "./pages/FormsLibrary";
import CriminalDefenseGuide from "./pages/CriminalDefenseGuide";
import CaseLawSearch from "./pages/CaseLawSearch";
import BookOfDocuments from "./pages/BookOfDocuments";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LegalDisclaimer from "./pages/LegalDisclaimer";
import FAQ from "./pages/FAQ";

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
            <Route path="/admin" element={<AdminDashboardSimple />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/support" element={<Support />} />
            <Route path="/case-analysis" element={<CaseAnalysis />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/legal-journey" element={<LegalJourney />} />
            <Route path="/my-cases" element={<CaseDashboard />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/ai-tools/use" element={<AIToolsInteractive />} />
            <Route path="/legal-areas/:areaId" element={<LegalAreaPage />} />
            <Route path="/forms-library" element={<FormsLibrary />} />
            <Route path="/criminal-defense-guide" element={<CriminalDefenseGuide />} />
            <Route path="/case-law-search" element={<CaseLawSearch />} />
            <Route path="/book-of-documents" element={<BookOfDocuments />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/disclaimer" element={<LegalDisclaimer />} />
            <Route path="/faq" element={<FAQ />} />
            {/* add more routes above this */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
