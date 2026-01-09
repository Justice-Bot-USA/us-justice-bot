import { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StartHero from "@/components/StartHero";
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
const WhatWeDoSection = lazy(() => import("@/components/WhatWeDoSection"));

const PrivacyConsentBanner = lazy(() => import("@/components/PrivacyConsentBanner"));

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
      question: "Do I need to sign up to use this?",
      answer: "No! You can start your free assessment immediately without creating an account. If you want to save your progress or access premium features, you can create an account later.",
    },
    {
      question: "Is this a lawyer?",
      answer: "No, US Justice Bot is not a law firm and does not provide legal advice or representation. We provide legal information, form guidance, and AI-powered case analysis tools to help you understand your options.",
    },
    {
      question: "Is my information private?",
      answer: "Yes! We use 256-bit SSL encryption (the same as banks) to protect your data. We never sell your information and comply with US privacy laws.",
    },
    {
      question: "What does it cost?",
      answer: "The initial assessment is 100% free. Individual forms are $4.99 each. Monthly subscription is $9.99/month for unlimited access. Annual subscription is $79/year (save over 30%).",
    },
    {
      question: "How accurate is the legal guidance?",
      answer: "Our AI is trained on current US federal and state laws, court procedures, and official forms. We update our database daily with new case law and regulatory changes. However, for complex cases, we always recommend consulting with a licensed attorney.",
    },
    {
      question: "How long does it take?",
      answer: "Most users complete their initial assessment in under 90 seconds. Full case preparation typically takes 15-30 minutes depending on complexity.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="US Justice Bot - Your Legal Ally in America | Affordable AI Legal Assistance"
        description="When people are expected to follow the law, ignorance should not be an option. AI-powered legal help for all 50 US states. Court forms from $4.99."
        keywords="affordable legal assistance, legal advice, legal help, US law, legal guidance, court forms, small claims, housing court, EEOC, legal AI, attorney alternative, self-representation"
        url="https://justicebot-usa.com"
      />
      <EnhancedSEO
        title="US Justice Bot - Your Legal Ally in America | Court Forms $4.99"
        description="When people are expected to follow the law, ignorance should not be an option. US Justice Bot helps you understand your legal situation and next steps in plain language. All 50 states."
        keywords="legal help USA, court forms, legal forms, small claims court, family court forms, tenant rights, employment law, EEOC complaint, housing court, legal self-help, pro se, self-representation"
        canonicalUrl="https://justicebot-usa.com/"
        structuredData={structuredData}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main id="main-content" className="space-y-0">
        {/* Above-the-fold Start Hero - Forces first decision */}
        <StartHero language={language} />
        
        {/* Stats Bar - social proof after first action */}
        <Suspense fallback={null}>
          <StatsBar />
        </Suspense>
        
        {/* States Banner */}
        <Suspense fallback={null}>
          <StatesBanner />
        </Suspense>
        
        {/* What We Do Section - matches Canada's "Clear About What We Do" */}
        <Suspense fallback={<LoadingSection />}>
          <WhatWeDoSection />
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
        <PrivacyConsentBanner />
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
