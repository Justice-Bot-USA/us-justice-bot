import { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import WarningBanner from "@/components/WarningBanner";
import LegalSections from "@/components/LegalSections";
import TrustStats from "@/components/TrustStats";
import SuccessStories from "@/components/SuccessStories";
import StateSelector from "@/components/StateSelector";
import { ChatSection } from "@/components/ChatSection";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

// Lazy load below-the-fold components for better performance
const MeritScoreCalculator = lazy(() => import("@/components/MeritScoreCalculator"));
const TriageSection = lazy(() => import("@/components/TriageSection"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const InteractiveTutorial = lazy(() => import("@/components/InteractiveTutorial"));
const PricingComparison = lazy(() => import("@/components/PricingComparison"));
const JourneyFlowchart = lazy(() => import("@/components/JourneyFlowchart"));
const CompetitorComparison = lazy(() => import("@/components/CompetitorComparison"));
const MoneyBackGuarantee = lazy(() => import("@/components/MoneyBackGuarantee"));
const UrgencyTimer = lazy(() => import("@/components/UrgencyTimer"));
const FeatureHighlightBanner = lazy(() => import("@/components/FeatureHighlightBanner"));
const StatesBanner = lazy(() => import("@/components/StatesBanner"));

// New Canada-matching components
const StatsBar = lazy(() => import("@/components/StatsBar"));
const QuickLegalTools = lazy(() => import("@/components/QuickLegalTools"));
const USCourtTriage = lazy(() => import("@/components/USCourtTriage"));
const AIToolsShowcase = lazy(() => import("@/components/AIToolsShowcase"));
const CourtLocator = lazy(() => import("@/components/CourtLocator"));
const FeatureGrid = lazy(() => import("@/components/FeatureGrid"));
const LegalChatbot = lazy(() => import("@/components/LegalChatbot"));

// Lazy load engagement widgets
const SocialProofTicker = lazy(() => import("@/components/SocialProofTicker"));
const LeadCaptureModal = lazy(() => import("@/components/LeadCaptureModal"));
const StickyBottomCTA = lazy(() => import("@/components/StickyBottomCTA"));
const LiveSupportWidget = lazy(() => import("@/components/LiveSupportWidget"));
const AccessibilityPanel = lazy(() => import("@/components/AccessibilityPanel"));
const ChurnPreventionNudge = lazy(() => import("@/components/ChurnPreventionNudge"));

const LoadingSection = () => (
  <div className="py-8 flex items-center justify-center min-h-[100px]">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showStateSelector, setShowStateSelector] = useState(false);

  const handleGetStarted = () => {
    setShowStateSelector(true);
  };

  const handleSectionSelect = (section: string) => {
    navigate('/case-analysis');
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setShowStateSelector(false);
    setTimeout(() => {
      const chatSection = document.getElementById('chat-section');
      chatSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "US Justice Bot",
    applicationCategory: "Legal",
    operatingSystem: "Web",
    description: "AI-powered legal information and form guidance for Americans in all 50 states facing housing, human rights, family, employment, and small claims issues.",
    url: "https://justicebot-usa.com",
    offers: {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "USD",
    },
  };

  const faqData = [
    {
      question: "What states does US Justice Bot serve?",
      answer: "US Justice Bot serves all 50 US states with state-specific court forms, procedures, and legal guidance for family law, small claims, housing, employment, and more.",
    },
    {
      question: "How much does US Justice Bot cost?",
      answer: "Individual forms are $4.99 each. Monthly subscription is $9.99/month for unlimited access. Annual subscription is $79/year (save over 30%).",
    },
    {
      question: "Is US Justice Bot a law firm?",
      answer: "No, US Justice Bot is not a law firm and does not provide legal advice or representation. We provide legal information, form guidance, and AI-powered case analysis tools.",
    },
    {
      question: "Can an AI assistant replace a lawyer?",
      answer: "US Justice Bot is not a replacement for legal advice from a qualified lawyer. We help you understand forms, rules, and procedures. For complex cases, consult with a licensed attorney.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="US Justice Bot - Equal Justice Under Law - Affordable Legal Guidance"
        description="Professional legal assistance at a fraction of attorney costs. We care about your justice, not billable hours. Expert guidance for all 50 US states."
        keywords="affordable legal assistance, legal advice, legal help, US law, legal guidance, constitutional law, legal bot, legal AI, attorney alternative"
        url="https://justicebot-usa.com"
      />
      <EnhancedSEO
        title="US Justice Bot - Legal Help for All 50 States | Court Forms $4.99"
        description="AI-powered legal form helper for all 50 US states. Get court forms for just $4.99 each. Family law, small claims, employment, housing. Not a law firm - practical tools to prepare your case."
        keywords="legal help USA, court forms, legal forms, small claims court, family court forms, tenant rights, employment law, legal self-help"
        canonicalUrl="https://justicebot-usa.com/"
        structuredData={structuredData}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main id="main-content" className="space-y-0">
        {/* Stats Bar - matches Canada */}
        <Suspense fallback={null}>
          <StatsBar />
        </Suspense>
        
        <HeroSection language={language} onGetStarted={handleGetStarted} />
        
        {/* States Banner */}
        <Suspense fallback={null}>
          <StatesBanner />
        </Suspense>
        
        {/* AI Tools Showcase - matches Canada */}
        <Suspense fallback={<LoadingSection />}>
          <AIToolsShowcase />
        </Suspense>
        
        {/* Quick Legal Tools - matches Canada */}
        <Suspense fallback={<LoadingSection />}>
          <QuickLegalTools />
        </Suspense>
        
        <div className="py-8">
          <HowItWorks language={language} />
        </div>
        
        {/* Pricing Comparison */}
        <Suspense fallback={<LoadingSection />}>
          <div className="py-8">
            <PricingComparison />
          </div>
        </Suspense>
        
        {/* Interactive Tutorial */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <Suspense fallback={<LoadingSection />}>
              <InteractiveTutorial />
            </Suspense>
          </div>
        </section>
        
        {/* US Court Triage - matches Canada tribunals */}
        <Suspense fallback={<LoadingSection />}>
          <USCourtTriage />
        </Suspense>
        
        {/* Legal Chatbot - Free AI Assistant */}
        <Suspense fallback={<LoadingSection />}>
          <LegalChatbot />
        </Suspense>
        
        {/* Merit Score Calculator */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Check Your Case Strength</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get an instant AI-powered assessment of your legal case merit score
              </p>
            </div>
            <Suspense fallback={<LoadingSection />}>
              <MeritScoreCalculator />
            </Suspense>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-8">
          <WarningBanner language={language} />
        </div>
        
        <div className="py-8">
          <LegalSections language={language} onSectionSelect={handleSectionSelect} />
        </div>
        
        <div className="py-8">
          <TrustStats language={language} />
        </div>
        
        {/* Money-Back Guarantee */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={null}>
              <MoneyBackGuarantee />
            </Suspense>
          </div>
        </section>
        
        <div className="py-8">
          <SuccessStories language={language} />
        </div>
        
        {/* Features Section */}
        <Suspense fallback={<LoadingSection />}>
          <div className="py-8">
            <FeaturesSection />
          </div>
        </Suspense>
        
        {/* Competitor Comparison */}
        <Suspense fallback={<LoadingSection />}>
          <div className="py-8">
            <CompetitorComparison />
          </div>
        </Suspense>
        
        {showStateSelector && (
          <div id="state-selector">
            <StateSelector 
              language={language} 
              onStateSelect={handleStateSelect}
              selectedState={selectedState}
            />
          </div>
        )}
        
        <div id="chat-section">
          <ChatSection 
            language={language} 
            selectedState={selectedState} 
            selectedSection={selectedSection}
            onLanguageChange={setLanguage}
            onStateChange={setSelectedState}
          />
        </div>
      </main>
      
      <Footer />
      
      {/* Engagement Widgets */}
      <Suspense fallback={null}>
        <AccessibilityPanel />
      </Suspense>
      
      <Suspense fallback={null}>
        <LeadCaptureModal trigger="time" delaySeconds={45} />
      </Suspense>
      
      <Suspense fallback={null}>
        <SocialProofTicker />
      </Suspense>
      
      <Suspense fallback={null}>
        <LiveSupportWidget />
      </Suspense>
      
      <Suspense fallback={null}>
        <StickyBottomCTA />
      </Suspense>
      
      <Suspense fallback={null}>
        <ChurnPreventionNudge />
      </Suspense>
    </div>
  );
};

export default Index;
