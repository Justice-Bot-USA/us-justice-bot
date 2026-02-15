import { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FreeToolsBar from "@/components/FreeToolsBar";
import StartHero from "@/components/StartHero";
import HowItWorks from "@/components/HowItWorks";
import StateSelector from "@/components/StateSelector";
import { ChatSection } from "@/components/ChatSection";
import { SEOHead } from "@/components/SEOHead";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import PrepareFilingModal from "@/components/PrepareFilingModal";

// Lazy load below-the-fold components
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const PricingComparison = lazy(() => import("@/components/PricingComparison"));
const MoneyBackGuarantee = lazy(() => import("@/components/MoneyBackGuarantee"));
const ClosingCTA = lazy(() => import("@/components/ClosingCTA"));
const StatesBanner = lazy(() => import("@/components/StatesBanner"));
const StatsBar = lazy(() => import("@/components/StatsBar"));
const QuickLegalTools = lazy(() => import("@/components/QuickLegalTools"));
const USCourtTriage = lazy(() => import("@/components/USCourtTriage"));
const AIToolsShowcase = lazy(() => import("@/components/AIToolsShowcase"));
const MeritScoreCalculator = lazy(() => import("@/components/MeritScoreCalculator"));

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
  const [showPrepareModal, setShowPrepareModal] = useState(false);

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
      price: "9.99",
      priceCurrency: "USD",
    },
  };

  const faqData = [
    {
      question: "Do I need to sign up to use this?",
      answer: "No! Free lookups require no account. Sign up only when you want to save progress or export documents.",
    },
    {
      question: "Is this a lawyer?",
      answer: "No. We provide self-help tools and information, not legal advice or representation.",
    },
    {
      question: "Is my information private?",
      answer: "Yes! We use 256-bit SSL encryption. We never sell your information and comply with US privacy laws.",
    },
    {
      question: "What does it cost?",
      answer: "Free tools are always free. Prepared Filing Pack is $9.99 one-time. Monthly access is $19.99/mo. Case Bundle is $49.99 one-time.",
    },
    {
      question: "How long does it take?",
      answer: "Free lookups take under 2 minutes. Full form preparation typically takes 15-30 minutes.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="US Justice Bot - Free Lookups & Legal Form Preparation | From $9.99"
        description="Free public-record lookups and step-by-step form preparation for your state. Official sources. No legal advice. Prepare your filing from $9.99."
        keywords="legal forms, court forms, warrant lookup, sex offender registry, filing preparation, self-help legal tools, court filing"
        url="https://justicebot-usa.com"
      />
      <EnhancedSEO
        title="US Justice Bot - Free Lookups & Official Filing Preparation"
        description="Free public-record lookups and step-by-step form preparation for all 50 states. Official sources only. Self-help tools, not legal advice."
        keywords="legal help USA, court forms, warrant lookup, sex offender registry, filing preparation, pro se, self-representation"
        canonicalUrl="https://justicebot-usa.com/"
        structuredData={structuredData}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      
      {/* Free Tools Top Bar */}
      <FreeToolsBar />
      
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main id="main-content" className="space-y-0">
        {/* 1. Hero — Above the fold */}
        <StartHero language={language} onPrepareForm={() => setShowPrepareModal(true)} />
        
        {/* 2. Stats Bar — social proof */}
        <Suspense fallback={null}>
          <StatsBar />
        </Suspense>
        
        {/* 3. What You Can Do Today (Free vs Paid) */}
        <Suspense fallback={<LoadingSection />}>
          <FeaturesSection />
        </Suspense>
        
        {/* 4. How It Works (4 steps) */}
        <div className="py-8" id="how-it-works">
          <HowItWorks language={language} />
        </div>
        
        {/* 5. Pricing */}
        <Suspense fallback={<LoadingSection />}>
          <div className="py-8">
            <PricingComparison />
          </div>
        </Suspense>
        
        {/* 6. Trust + Boundaries + Money-Back */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={null}>
              <MoneyBackGuarantee />
            </Suspense>
          </div>
        </section>
        
        {/* 7. Closing CTA */}
        <Suspense fallback={null}>
          <ClosingCTA onPrepareForm={() => setShowPrepareModal(true)} />
        </Suspense>
        
        {/* === Below: key interactive tools preserved === */}
        
        <Suspense fallback={null}>
          <StatesBanner />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <QuickLegalTools />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <USCourtTriage />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <AIToolsShowcase />
        </Suspense>
        
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
      
      <PrepareFilingModal
        open={showPrepareModal}
        onOpenChange={setShowPrepareModal}
        source="homepage_cta"
      />
      
      <Footer />
    </div>
  );
};

export default Index;
